using StockSmartRestaurantQR.Domain.Enums;

namespace StockSmartRestaurantQR.Application.DTOs;

public sealed record CategoryDto(int Id, string Name, string? Description);
public sealed record SupplierDto(int Id, string Name, string? ContactName, string? Phone, string? Email, string? Address);

public sealed record ProductDto(
    int Id, string Code, string Name, string? Description, int CategoryId, string CategoryName,
    int? SupplierId, string? SupplierName, decimal Price, decimal Cost, decimal Stock,
    decimal MinStock, string Unit, string? ImagePath);

public sealed record StockMovementDto(
    int Id, int ProductId, string ProductName, MovementType MovementType, decimal Quantity,
    decimal PreviousStock, decimal NewStock, string? Reference, string UserId, string? Notes, DateTime CreatedAt);

public sealed record SaleDetailDto(int ProductId, string ProductName, decimal Quantity, decimal UnitPrice, decimal SubTotal);
public sealed record SaleDto(int Id, string SaleNumber, DateTime SaleDate, decimal TotalAmount, string UserId,
    string? CustomerName, string? Notes, string? ExternalReference, IReadOnlyList<SaleDetailDto> Details);

public sealed record DashboardDto(
    int LowStockCount, int TodaySalesCount, decimal TodaySalesAmount,
    IReadOnlyList<ProductDto> LowStockProducts, IReadOnlyList<StockMovementDto> LatestMovements,
    IReadOnlyList<TopProductDto> TopProducts);

public sealed record TopProductDto(string ProductName, decimal Quantity);

public sealed class CategoryRequest
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

public sealed class SupplierRequest
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? ContactName { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
}

public sealed class ProductRequest
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CategoryId { get; set; }
    public int? SupplierId { get; set; }
    public decimal Price { get; set; }
    public decimal Cost { get; set; }
    public decimal MinStock { get; set; }
    public string Unit { get; set; } = "unidad";
    public string? ImagePath { get; set; }
}

public sealed class StockChangeRequest
{
    public int ProductId { get; set; }
    public MovementType MovementType { get; set; }
    public decimal Quantity { get; set; }
    public string? Reference { get; set; }
    public string? Notes { get; set; }
}

public sealed class SaleItemRequest
{
    public int ProductId { get; set; }
    public decimal Quantity { get; set; }
}

public sealed class CreateSaleRequest
{
    public string? CustomerName { get; set; }
    public string? Notes { get; set; }
    public string? ExternalReference { get; set; }
    public List<SaleItemRequest> Items { get; set; } = [];
}

public sealed record ReportFilter(DateTime? From = null, DateTime? To = null);
public sealed record AuditLogDto(int Id, string UserId, string Action, string EntityName, string? EntityId, string? NewValues, DateTime Timestamp);
public sealed record SettingDto(int Id, string Key, string Value, string? Description);
