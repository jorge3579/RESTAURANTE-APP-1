using StockSmartRestaurantQR.Domain.Common;

namespace StockSmartRestaurantQR.Domain.Entities;

public sealed class Category : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ICollection<Product> Products { get; set; } = [];
}
