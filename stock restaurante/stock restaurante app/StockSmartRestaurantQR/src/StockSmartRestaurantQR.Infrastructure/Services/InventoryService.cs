using System.Data;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using StockSmartRestaurantQR.Application.Common;
using StockSmartRestaurantQR.Application.DTOs;
using StockSmartRestaurantQR.Application.Interfaces;
using StockSmartRestaurantQR.Domain.Entities;
using StockSmartRestaurantQR.Domain.Enums;
using StockSmartRestaurantQR.Infrastructure.Persistence;

namespace StockSmartRestaurantQR.Infrastructure.Services;

public sealed class InventoryService(ApplicationDbContext db) : IInventoryService
{
    public async Task<PagedResult<ProductDto>> GetProductsAsync(string? search, int page, int pageSize, string? sort = null, CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
        var query = db.Products.AsNoTracking().Include(x => x.Category).Include(x => x.Supplier).AsQueryable();
        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(x => x.Name.Contains(term) || x.Code.Contains(term));
        }
        query = sort switch
        {
            "stock" => query.OrderBy(x => x.Stock),
            "price_desc" => query.OrderByDescending(x => x.Price),
            "name_desc" => query.OrderByDescending(x => x.Name),
            _ => query.OrderBy(x => x.Name)
        };
        var total = await query.CountAsync(cancellationToken);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).Select(x => MapProduct(x)).ToListAsync(cancellationToken);
        return new PagedResult<ProductDto>(items, total, page, pageSize);
    }

    public Task<ProductDto?> GetProductAsync(int id, CancellationToken cancellationToken = default) =>
        db.Products.AsNoTracking().Include(x => x.Category).Include(x => x.Supplier)
            .Where(x => x.Id == id).Select(x => MapProduct(x)).FirstOrDefaultAsync(cancellationToken);

    public async Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default) =>
        await db.Categories.AsNoTracking().OrderBy(x => x.Name).Select(x => new CategoryDto(x.Id, x.Name, x.Description)).ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<SupplierDto>> GetSuppliersAsync(CancellationToken cancellationToken = default) =>
        await db.Suppliers.AsNoTracking().OrderBy(x => x.Name).Select(x => new SupplierDto(x.Id, x.Name, x.ContactName, x.Phone, x.Email, x.Address)).ToListAsync(cancellationToken);

    public async Task<OperationResult<ProductDto>> SaveProductAsync(ProductRequest request, string userId, CancellationToken cancellationToken = default)
    {
        var code = request.Code.Trim().ToUpperInvariant();
        if (await db.Products.AnyAsync(x => x.Code == code && x.Id != request.Id, cancellationToken))
            return OperationResult<ProductDto>.Fail("Ya existe un producto con ese código.");
        Product entity;
        string action;
        if (request.Id == 0) { entity = new Product(); db.Products.Add(entity); action = "Create"; }
        else
        {
            entity = await db.Products.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken) ?? null!;
            if (entity is null) return OperationResult<ProductDto>.Fail("Producto no encontrado.");
            action = "Update";
        }
        entity.Code = code; entity.Name = request.Name.Trim(); entity.Description = request.Description?.Trim();
        entity.CategoryId = request.CategoryId; entity.SupplierId = request.SupplierId; entity.Price = request.Price;
        entity.Cost = request.Cost; entity.MinStock = request.MinStock; entity.Unit = request.Unit.Trim(); entity.ImagePath = request.ImagePath;
        await db.SaveChangesAsync(cancellationToken);
        await AuditAsync(userId, action, nameof(Product), entity.Id.ToString(), request, cancellationToken);
        return OperationResult<ProductDto>.Ok((await GetProductAsync(entity.Id, cancellationToken))!);
    }

    public async Task<OperationResult<CategoryDto>> SaveCategoryAsync(CategoryRequest request, string userId, CancellationToken cancellationToken = default)
    {
        var name = request.Name.Trim();
        if (await db.Categories.AnyAsync(x => x.Name == name && x.Id != request.Id, cancellationToken))
            return OperationResult<CategoryDto>.Fail("La categoría ya existe.");
        Category entity;
        if (request.Id == 0) { entity = new Category(); db.Categories.Add(entity); }
        else { entity = await db.Categories.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken) ?? null!; if (entity is null) return OperationResult<CategoryDto>.Fail("Categoría no encontrada."); }
        entity.Name = name; entity.Description = request.Description?.Trim();
        await db.SaveChangesAsync(cancellationToken);
        await AuditAsync(userId, request.Id == 0 ? "Create" : "Update", nameof(Category), entity.Id.ToString(), request, cancellationToken);
        return OperationResult<CategoryDto>.Ok(new(entity.Id, entity.Name, entity.Description));
    }

    public async Task<OperationResult<SupplierDto>> SaveSupplierAsync(SupplierRequest request, string userId, CancellationToken cancellationToken = default)
    {
        Supplier entity;
        if (request.Id == 0) { entity = new Supplier(); db.Suppliers.Add(entity); }
        else { entity = await db.Suppliers.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken) ?? null!; if (entity is null) return OperationResult<SupplierDto>.Fail("Proveedor no encontrado."); }
        entity.Name = request.Name.Trim(); entity.ContactName = request.ContactName?.Trim(); entity.Phone = request.Phone?.Trim();
        entity.Email = request.Email?.Trim(); entity.Address = request.Address?.Trim();
        await db.SaveChangesAsync(cancellationToken);
        await AuditAsync(userId, request.Id == 0 ? "Create" : "Update", nameof(Supplier), entity.Id.ToString(), request, cancellationToken);
        return OperationResult<SupplierDto>.Ok(new(entity.Id, entity.Name, entity.ContactName, entity.Phone, entity.Email, entity.Address));
    }

    public Task<OperationResult> DeleteProductAsync(int id, string userId, CancellationToken cancellationToken = default) => SoftDeleteAsync<Product>(id, userId, cancellationToken);
    public Task<OperationResult> DeleteCategoryAsync(int id, string userId, CancellationToken cancellationToken = default) => SoftDeleteAsync<Category>(id, userId, cancellationToken);
    public Task<OperationResult> DeleteSupplierAsync(int id, string userId, CancellationToken cancellationToken = default) => SoftDeleteAsync<Supplier>(id, userId, cancellationToken);

    public async Task<OperationResult<StockMovementDto>> ChangeStockAsync(StockChangeRequest request, string userId, CancellationToken cancellationToken = default)
    {
        if (request.Quantity <= 0) return OperationResult<StockMovementDto>.Fail("La cantidad debe ser mayor que cero.");
        await using var transaction = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable, cancellationToken);
        var product = await db.Products.FirstOrDefaultAsync(x => x.Id == request.ProductId, cancellationToken);
        if (product is null) return OperationResult<StockMovementDto>.Fail("Producto no encontrado.");
        var previous = product.Stock;
        var delta = request.MovementType == MovementType.Entry ? request.Quantity : -request.Quantity;
        if (request.MovementType == MovementType.Adjustment) delta = request.Quantity - product.Stock;
        if (product.Stock + delta < 0) return OperationResult<StockMovementDto>.Fail("Stock insuficiente.");
        product.Stock += delta;
        var movement = new StockMovement { ProductId = product.Id, MovementType = request.MovementType, Quantity = request.Quantity,
            PreviousStock = previous, NewStock = product.Stock, Reference = request.Reference, UserId = userId, Notes = request.Notes };
        db.StockMovements.Add(movement);
        await db.SaveChangesAsync(cancellationToken); await transaction.CommitAsync(cancellationToken);
        await AuditAsync(userId, "StockChange", nameof(Product), product.Id.ToString(), request, cancellationToken);
        return OperationResult<StockMovementDto>.Ok(MapMovement(movement, product.Name));
    }

    public async Task<PagedResult<StockMovementDto>> GetMovementsAsync(int? productId, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
        var query = db.StockMovements.AsNoTracking().Include(x => x.Product).AsQueryable();
        if (productId.HasValue) query = query.Where(x => x.ProductId == productId.Value);
        query = query.OrderByDescending(x => x.CreatedAt);
        var total = await query.CountAsync(cancellationToken);
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).Select(x => MapMovement(x, x.Product.Name)).ToListAsync(cancellationToken);
        return new(items, total, page, pageSize);
    }

    public async Task<OperationResult<SaleDto>> CreateSaleAsync(CreateSaleRequest request, string userId, CancellationToken cancellationToken = default)
    {
        if (request.Items.Count == 0) return OperationResult<SaleDto>.Fail("La venta no contiene productos.");
        if (!string.IsNullOrWhiteSpace(request.ExternalReference))
        {
            var existing = await db.Sales.Include(x => x.Details).ThenInclude(x => x.Product)
                .FirstOrDefaultAsync(x => x.ExternalReference == request.ExternalReference, cancellationToken);
            if (existing is not null) return OperationResult<SaleDto>.Ok(MapSale(existing));
        }
        await using var transaction = await db.Database.BeginTransactionAsync(IsolationLevel.Serializable, cancellationToken);
        var ids = request.Items.Select(x => x.ProductId).Distinct().ToList();
        var products = await db.Products.Where(x => ids.Contains(x.Id)).ToDictionaryAsync(x => x.Id, cancellationToken);
        if (products.Count != ids.Count) return OperationResult<SaleDto>.Fail("Uno o más productos no existen.");
        foreach (var item in request.Items)
            if (item.Quantity <= 0 || products[item.ProductId].Stock < item.Quantity)
                return OperationResult<SaleDto>.Fail($"Stock insuficiente para {products[item.ProductId].Name}.");

        var sale = new Sale { SaleNumber = $"V-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 9999)}", UserId = userId,
            CustomerName = request.CustomerName?.Trim(), Notes = request.Notes?.Trim(), ExternalReference = request.ExternalReference?.Trim() };
        foreach (var item in request.Items)
        {
            var product = products[item.ProductId]; var previous = product.Stock; product.Stock -= item.Quantity;
            var subtotal = Math.Round(product.Price * item.Quantity, 2);
            sale.Details.Add(new SaleDetail { ProductId = product.Id, Quantity = item.Quantity, UnitPrice = product.Price, SubTotal = subtotal });
            db.StockMovements.Add(new StockMovement { ProductId = product.Id, MovementType = MovementType.Sale,
                Quantity = item.Quantity, PreviousStock = previous, NewStock = product.Stock, Reference = sale.SaleNumber, UserId = userId, Notes = "Venta" });
        }
        sale.TotalAmount = sale.Details.Sum(x => x.SubTotal); db.Sales.Add(sale);
        await db.SaveChangesAsync(cancellationToken); await transaction.CommitAsync(cancellationToken);
        await AuditAsync(userId, "Create", nameof(Sale), sale.Id.ToString(), new { sale.SaleNumber, sale.TotalAmount }, cancellationToken);
        sale.Details.ToList().ForEach(x => x.Product = products[x.ProductId]);
        return OperationResult<SaleDto>.Ok(MapSale(sale));
    }

    public async Task<PagedResult<SaleDto>> GetSalesAsync(DateTime? from, DateTime? to, int page, int pageSize, CancellationToken cancellationToken = default)
    {
        page = Math.Max(1, page); pageSize = Math.Clamp(pageSize, 1, 100);
        var query = db.Sales.AsNoTracking().Include(x => x.Details).ThenInclude(x => x.Product).AsQueryable();
        if (from.HasValue) query = query.Where(x => x.SaleDate >= from.Value.ToUniversalTime());
        if (to.HasValue) query = query.Where(x => x.SaleDate < to.Value.Date.AddDays(1).ToUniversalTime());
        query = query.OrderByDescending(x => x.SaleDate);
        var total = await query.CountAsync(cancellationToken);
        var sales = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync(cancellationToken);
        return new(sales.Select(MapSale).ToList(), total, page, pageSize);
    }

    public async Task<DashboardDto> GetDashboardAsync(CancellationToken cancellationToken = default)
    {
        var todayLocal = TimeZoneInfo.ConvertTimeBySystemTimeZoneId(DateTime.UtcNow, "Argentina Standard Time").Date;
        var startUtc = TimeZoneInfo.ConvertTimeToUtc(todayLocal, TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time"));
        var endUtc = startUtc.AddDays(1);
        var low = await db.Products.AsNoTracking().Include(x => x.Category).Include(x => x.Supplier)
            .Where(x => x.Stock <= x.MinStock).OrderBy(x => x.Stock).Take(10).Select(x => MapProduct(x)).ToListAsync(cancellationToken);
        var salesToday = db.Sales.AsNoTracking().Where(x => x.SaleDate >= startUtc && x.SaleDate < endUtc);
        var count = await salesToday.CountAsync(cancellationToken); var amount = await salesToday.SumAsync(x => (decimal?)x.TotalAmount, cancellationToken) ?? 0;
        var latest = await db.StockMovements.AsNoTracking().Include(x => x.Product).OrderByDescending(x => x.CreatedAt).Take(10)
            .Select(x => MapMovement(x, x.Product.Name)).ToListAsync(cancellationToken);
        var topQuantities = await db.SaleDetails.AsNoTracking().GroupBy(x => x.ProductId)
            .Select(g => new { ProductId = g.Key, Quantity = g.Sum(x => x.Quantity) })
            .OrderByDescending(x => x.Quantity).Take(5).ToListAsync(cancellationToken);
        var topProductIds = topQuantities.Select(x => x.ProductId).ToList();
        var topNames = await db.Products.AsNoTracking().Where(x => topProductIds.Contains(x.Id))
            .ToDictionaryAsync(x => x.Id, x => x.Name, cancellationToken);
        var top = topQuantities.Select(x => new TopProductDto(topNames.GetValueOrDefault(x.ProductId, "Producto"), x.Quantity)).ToList();
        return new(low.Count, count, amount, low, latest, top);
    }

    private async Task<OperationResult> SoftDeleteAsync<T>(int id, string userId, CancellationToken cancellationToken) where T : Domain.Common.BaseEntity
    {
        var entity = await db.Set<T>().FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (entity is null) return OperationResult.Fail("Registro no encontrado.");
        entity.IsDeleted = true; entity.DeletedAt = DateTime.UtcNow; await db.SaveChangesAsync(cancellationToken);
        await AuditAsync(userId, "Delete", typeof(T).Name, id.ToString(), null, cancellationToken); return OperationResult.Ok();
    }

    private async Task AuditAsync(string userId, string action, string entity, string id, object? values, CancellationToken cancellationToken)
    {
        db.AuditLogs.Add(new AuditLog { UserId = userId, Action = action, EntityName = entity, EntityId = id,
            NewValues = values is null ? null : JsonSerializer.Serialize(values), Timestamp = DateTime.UtcNow });
        await db.SaveChangesAsync(cancellationToken);
    }

    private static ProductDto MapProduct(Product x) => new(x.Id, x.Code, x.Name, x.Description, x.CategoryId, x.Category.Name,
        x.SupplierId, x.Supplier != null ? x.Supplier.Name : null, x.Price, x.Cost, x.Stock, x.MinStock, x.Unit, x.ImagePath);
    private static StockMovementDto MapMovement(StockMovement x, string productName) => new(x.Id, x.ProductId, productName,
        x.MovementType, x.Quantity, x.PreviousStock, x.NewStock, x.Reference, x.UserId, x.Notes, x.CreatedAt);
    private static SaleDto MapSale(Sale x) => new(x.Id, x.SaleNumber, x.SaleDate, x.TotalAmount, x.UserId, x.CustomerName,
        x.Notes, x.ExternalReference, x.Details.Select(d => new SaleDetailDto(d.ProductId, d.Product.Name, d.Quantity, d.UnitPrice, d.SubTotal)).ToList());
}
