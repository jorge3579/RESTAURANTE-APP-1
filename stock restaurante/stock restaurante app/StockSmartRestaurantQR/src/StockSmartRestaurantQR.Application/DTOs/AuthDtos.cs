namespace StockSmartRestaurantQR.Application.DTOs;

public sealed class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public sealed record AuthResult(string UserId, string Username, string FullName, string Role, string Token, DateTime ExpiresAtUtc);

public sealed record UserDto(string Id, string Username, string FullName, string Email, string Role, bool IsActive,
    DateTime CreatedAt, DateTime? LastLogin);

public sealed class CreateUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "Employee";
}

public sealed class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
