using StockSmartRestaurantQR.Domain.Common;

namespace StockSmartRestaurantQR.Domain.Entities;

public sealed class Sale : BaseEntity
{
    public string SaleNumber { get; set; } = string.Empty;
    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string? CustomerName { get; set; }
    public string? Notes { get; set; }
    public string? ExternalReference { get; set; }
    public ICollection<SaleDetail> Details { get; set; } = [];
}
