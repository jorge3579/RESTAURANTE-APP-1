using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using QuestPDF.Infrastructure;
using StockSmartRestaurantQR.Application.Interfaces;
using StockSmartRestaurantQR.Infrastructure.Auth;
using StockSmartRestaurantQR.Infrastructure.Persistence;
using StockSmartRestaurantQR.Infrastructure.Services;

namespace StockSmartRestaurantQR.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var mariaConnection = configuration.GetConnectionString("MariaDb")
            ?? throw new InvalidOperationException("Falta ConnectionStrings:MariaDb.");
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseMySql(mariaConnection, new MariaDbServerVersion(new Version(11, 4, 0)),
                mysql => mysql.EnableRetryOnFailure(3)));

        services.Configure<MongoDbSettings>(configuration.GetSection("MongoDbSettings"));
        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
        services.Configure<FileStorageSettings>(configuration.GetSection("FileStorage"));
        services.Configure<BootstrapUsersSettings>(configuration.GetSection("BootstrapUsers"));
        var mongoConnection = configuration.GetConnectionString("MongoDb")
            ?? throw new InvalidOperationException("Falta ConnectionStrings:MongoDb.");
        var mongoSettings = configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>() ?? new();
        services.AddSingleton<IMongoClient>(_ => new MongoClient(mongoConnection));
        services.AddSingleton(sp => sp.GetRequiredService<IMongoClient>().GetDatabase(mongoSettings.DatabaseName));

        services.AddScoped<IInventoryService, InventoryService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IFileStorageService, FileStorageService>();
        services.AddScoped<IAdminService, AdminService>();
        services.AddScoped<DataSeeder>();
        QuestPDF.Settings.License = LicenseType.Community;
        return services;
    }
}
