using Microsoft.EntityFrameworkCore;
using StockSmartRestaurantQR.Domain.Entities;
using StockSmartRestaurantQR.Domain.Enums;

namespace StockSmartRestaurantQR.Infrastructure.Persistence;

public sealed class DataSeeder(ApplicationDbContext db)
{
    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        await db.Database.EnsureCreatedAsync(cancellationToken);
        if (await db.Categories.AnyAsync(cancellationToken)) return;

        var categories = new[]
        {
            new Category { Name = "Bebidas", Description = "Bebidas con y sin alcohol" },
            new Category { Name = "Carnes", Description = "Carnes y proteínas" },
            new Category { Name = "Verduras", Description = "Verduras y frutas" },
            new Category { Name = "Lácteos", Description = "Leches, quesos y derivados" },
            new Category { Name = "Limpieza", Description = "Insumos de higiene" },
            new Category { Name = "Packaging", Description = "Envases y descartables" }
        };
        var suppliers = new[]
        {
            new Supplier { Name = "Distribuidora del Sur", ContactName = "Ventas", Phone = "291-000-1001", Email = "ventas@distribuidora.local" },
            new Supplier { Name = "Frigorífico Regional", ContactName = "Pedidos", Phone = "291-000-1002", Email = "pedidos@frigorifico.local" },
            new Supplier { Name = "Mercado Fresco", ContactName = "Compras", Phone = "291-000-1003", Email = "compras@mercado.local" },
            new Supplier { Name = "Lácteos Pampeanos", ContactName = "Comercial", Phone = "291-000-1004", Email = "comercial@lacteos.local" },
            new Supplier { Name = "Envases Bahía", ContactName = "Atención", Phone = "291-000-1005", Email = "atencion@envases.local" }
        };
        db.AddRange(categories); db.AddRange(suppliers); await db.SaveChangesAsync(cancellationToken);
        var products = new[]
        {
            P("BEB-001", "Agua mineral 500 ml", 900, 420, 48, 12, "unidad", categories[0], suppliers[0]),
            P("BEB-002", "Gaseosa cola 1,5 l", 2800, 1550, 30, 8, "unidad", categories[0], suppliers[0]),
            P("BEB-003", "Cerveza lata 473 ml", 2100, 1180, 36, 12, "unidad", categories[0], suppliers[0]),
            P("CAR-001", "Carne vacuna", 14500, 10800, 18, 5, "kg", categories[1], suppliers[1]),
            P("CAR-002", "Pechuga de pollo", 8900, 6400, 22, 6, "kg", categories[1], suppliers[1]),
            P("CAR-003", "Hamburguesa artesanal", 3800, 2300, 45, 15, "unidad", categories[1], suppliers[1]),
            P("VER-001", "Papa", 1200, 650, 40, 10, "kg", categories[2], suppliers[2]),
            P("VER-002", "Tomate", 2400, 1450, 24, 6, "kg", categories[2], suppliers[2]),
            P("VER-003", "Lechuga", 1300, 720, 20, 5, "unidad", categories[2], suppliers[2]),
            P("LAC-001", "Queso mozzarella", 11800, 8400, 15, 4, "kg", categories[3], suppliers[3]),
            P("LAC-002", "Crema de leche 500 ml", 3900, 2450, 18, 6, "unidad", categories[3], suppliers[3]),
            P("LAC-003", "Manteca 200 g", 2600, 1600, 20, 5, "unidad", categories[3], suppliers[3]),
            P("LIM-001", "Detergente 5 l", 9200, 6800, 8, 3, "bidón", categories[4], suppliers[0]),
            P("LIM-002", "Desinfectante 5 l", 10800, 7900, 6, 3, "bidón", categories[4], suppliers[0]),
            P("LIM-003", "Rollo de cocina", 2200, 1250, 24, 8, "unidad", categories[4], suppliers[0]),
            P("PKG-001", "Caja hamburguesa", 350, 180, 200, 50, "unidad", categories[5], suppliers[4]),
            P("PKG-002", "Vaso descartable 500 ml", 180, 90, 300, 75, "unidad", categories[5], suppliers[4]),
            P("PKG-003", "Bolsa delivery", 250, 120, 250, 60, "unidad", categories[5], suppliers[4])
        };
        db.Products.AddRange(products); await db.SaveChangesAsync(cancellationToken);
        db.StockMovements.AddRange(products.Select(p => new StockMovement
        {
            ProductId = p.Id, MovementType = MovementType.Entry, Quantity = p.Stock, PreviousStock = 0,
            NewStock = p.Stock, Reference = "STOCK-INICIAL", UserId = "system", Notes = "Carga inicial"
        }));
        db.SystemSettings.Add(new SystemSetting { Key = "GlobalMinStock", Value = "5", Description = "Stock mínimo general sugerido" });
        await db.SaveChangesAsync(cancellationToken);
    }

    private static Product P(string code, string name, decimal price, decimal cost, decimal stock, decimal min,
        string unit, Category category, Supplier supplier) => new()
        { Code = code, Name = name, Price = price, Cost = cost, Stock = stock, MinStock = min, Unit = unit, Category = category, Supplier = supplier };
}
