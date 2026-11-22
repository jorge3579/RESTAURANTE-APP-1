using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StockSmartRestaurantQR.Infrastructure.Auth;

public sealed class MongoUser
{
    [BsonId, BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "Employee";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLogin { get; set; }
}

public sealed class MongoDbSettings
{
    public string DatabaseName { get; set; } = "StockSmartRestaurantQR_Auth";
    public string UsersCollection { get; set; } = "Users";
}

public sealed class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpirationHours { get; set; } = 8;
}

public sealed class FileStorageSettings
{
    public string ProductImagesPath { get; set; } = "wwwroot/uploads/productos";
}

public sealed class BootstrapUsersSettings
{
    public List<BootstrapUser> Users { get; set; } = [];
}

public sealed class BootstrapUser
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "Employee";
}
