using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using StockSmartRestaurantQR.Application.Common;
using StockSmartRestaurantQR.Application.DTOs;
using StockSmartRestaurantQR.Application.Interfaces;

namespace StockSmartRestaurantQR.Infrastructure.Auth;

public sealed class UserService : IUserService
{
    private readonly IMongoCollection<MongoUser> _users;
    private readonly BootstrapUsersSettings _bootstrap;

    public UserService(IMongoDatabase database, IOptions<MongoDbSettings> settings, IOptions<BootstrapUsersSettings> bootstrap)
    {
        _users = database.GetCollection<MongoUser>(settings.Value.UsersCollection);
        _bootstrap = bootstrap.Value;
    }

    public async Task<IReadOnlyList<UserDto>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _users.Find(Builders<MongoUser>.Filter.Empty).SortBy(x => x.Username)
            .Project(x => new UserDto(x.Id, x.Username, x.FullName, x.Email, x.Role, x.IsActive, x.CreatedAt, x.LastLogin))
            .ToListAsync(cancellationToken);

    public async Task<OperationResult<UserDto>> CreateAsync(CreateUserRequest request, CancellationToken cancellationToken = default)
    {
        var username = request.Username.Trim().ToLowerInvariant();
        if (request.Password.Length < 10) return OperationResult<UserDto>.Fail("La contraseña debe tener al menos 10 caracteres.");
        if (await _users.Find(x => x.Username == username).AnyAsync(cancellationToken))
            return OperationResult<UserDto>.Fail("El nombre de usuario ya existe.");

        var user = new MongoUser
        {
            Username = username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 12),
            FullName = request.FullName.Trim(), Email = request.Email.Trim(),
            Role = request.Role is "Admin" ? "Admin" : "Employee"
        };
        await _users.InsertOneAsync(user, cancellationToken: cancellationToken);
        return OperationResult<UserDto>.Ok(Map(user));
    }

    public async Task<OperationResult> SetActiveAsync(string id, bool active, CancellationToken cancellationToken = default)
    {
        var result = await _users.UpdateOneAsync(x => x.Id == id,
            Builders<MongoUser>.Update.Set(x => x.IsActive, active), cancellationToken: cancellationToken);
        return result.MatchedCount == 1 ? OperationResult.Ok() : OperationResult.Fail("Usuario no encontrado.");
    }

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        var index = new CreateIndexModel<MongoUser>(Builders<MongoUser>.IndexKeys.Ascending(x => x.Username), new CreateIndexOptions { Unique = true });
        await _users.Indexes.CreateOneAsync(index, cancellationToken: cancellationToken);

        var configured = _bootstrap.Users
            .Where(x => !string.IsNullOrWhiteSpace(x.Username) && x.Password.Length >= 10)
            .Select(x => new MongoUser
            {
                Username = x.Username.Trim().ToLowerInvariant(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(x.Password, workFactor: 12),
                FullName = x.FullName.Trim(), Email = x.Email.Trim(),
                Role = x.Role is "Admin" ? "Admin" : "Employee"
            }).ToList();
        foreach (var user in configured)
        {
            if (!await _users.Find(x => x.Username == user.Username).AnyAsync(cancellationToken))
                await _users.InsertOneAsync(user, cancellationToken: cancellationToken);
        }
    }

    private static UserDto Map(MongoUser x) => new(x.Id, x.Username, x.FullName, x.Email, x.Role, x.IsActive, x.CreatedAt, x.LastLogin);
}

public sealed class AuthService : IAuthService
{
    private readonly IMongoCollection<MongoUser> _users;
    private readonly JwtSettings _jwt;

    public AuthService(IMongoDatabase database, IOptions<MongoDbSettings> mongoSettings, IOptions<JwtSettings> jwtSettings)
    {
        _users = database.GetCollection<MongoUser>(mongoSettings.Value.UsersCollection);
        _jwt = jwtSettings.Value;
    }

    public async Task<OperationResult<AuthResult>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default)
    {
        var username = request.Username.Trim().ToLowerInvariant();
        var user = await _users.Find(x => x.Username == username).FirstOrDefaultAsync(cancellationToken);
        if (user is null || !user.IsActive || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return OperationResult<AuthResult>.Fail("Usuario o contraseña incorrectos.");

        var expires = DateTime.UtcNow.AddHours(_jwt.ExpirationHours);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(ClaimTypes.NameIdentifier, user.Id), new Claim(ClaimTypes.Name, user.Username),
            new Claim("FullName", user.FullName), new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
        };
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Secret));
        var token = new JwtSecurityToken(_jwt.Issuer, _jwt.Audience, claims, expires: expires,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
        await _users.UpdateOneAsync(x => x.Id == user.Id,
            Builders<MongoUser>.Update.Set(x => x.LastLogin, DateTime.UtcNow), cancellationToken: cancellationToken);
        return OperationResult<AuthResult>.Ok(new AuthResult(user.Id, user.Username, user.FullName, user.Role,
            new JwtSecurityTokenHandler().WriteToken(token), expires));
    }

    public async Task<OperationResult> ChangePasswordAsync(string userId, ChangePasswordRequest request, CancellationToken cancellationToken = default)
    {
        var user = await _users.Find(x => x.Id == userId).FirstOrDefaultAsync(cancellationToken);
        if (user is null || !BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
            return OperationResult.Fail("La contraseña actual no es correcta.");
        if (request.NewPassword.Length < 10) return OperationResult.Fail("La nueva contraseña debe tener al menos 10 caracteres.");
        var hash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword, workFactor: 12);
        await _users.UpdateOneAsync(x => x.Id == userId,
            Builders<MongoUser>.Update.Set(x => x.PasswordHash, hash), cancellationToken: cancellationToken);
        return OperationResult.Ok();
    }
}
