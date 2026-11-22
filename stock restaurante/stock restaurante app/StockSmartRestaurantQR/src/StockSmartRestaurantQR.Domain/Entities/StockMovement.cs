using StockSmartRestaurantQR.Domain.Common;
using StockSmartRestaurantQR.Domain.Enums;

namespace StockSmartRestaurantQR.Domain.Entities;

public sealed class StockMovement : BaseEntity
{
    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;
    public MovementType MovementType { get; set; }
    public decimal Quantity { get; set; }
    public decimal PreviousStock { get; set; }
    public decimal NewStock { get; set; }
    public string? Reference { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string? Notes { get; set; }
}
