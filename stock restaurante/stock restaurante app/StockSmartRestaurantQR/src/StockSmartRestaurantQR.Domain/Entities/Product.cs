using StockSmartRestaurantQR.Domain.Common;

namespace StockSmartRestaurantQR.Domain.Entities;

public sealed class Product : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    public int? SupplierId { get; set; }
    public Supplier? Supplier { get; set; }
    public decimal Price { get; set; }
    public decimal Cost { get; set; }
    public decimal Stock { get; set; }
    public decimal MinStock { get; set; }
    public string? ImagePath { get; set; }
    public string Unit { get; set; } = "unidad";
    public ICollection<StockMovement> StockMovements { get; set; } = [];
    public ICollection<SaleDetail> SaleDetails { get; set; } = [];
}
