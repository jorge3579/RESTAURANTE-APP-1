using StockSmartRestaurantQR.Domain.Common;

namespace StockSmartRestaurantQR.Domain.Entities;

public sealed class Supplier : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? ContactName { get; set; }
    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public ICollection<Product> Products { get; set; } = [];
}
