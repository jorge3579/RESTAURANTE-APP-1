using StockSmartRestaurantQR.Domain.Common;

namespace StockSmartRestaurantQR.Domain.Entities;

public sealed class SaleDetail : BaseEntity
{
    public int SaleId { get; set; }
    public Sale Sale { get; set; } = null!;
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public decimal Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal SubTotal { get; set; }
}
