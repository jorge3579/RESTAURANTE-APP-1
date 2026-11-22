using System.Security.Claims;
using StockSmartRestaurantQR.Application.DTOs;
using StockSmartRestaurantQR.Application.Interfaces;

namespace StockSmartRestaurantQR.Web;

public static class ApiEndpoints
{
    public static IEndpointRouteBuilder MapStockApi(this IEndpointRouteBuilder endpoints)
    {
        var api = endpoints.MapGroup("/api");
        api.MapPost("/auth/token", async (LoginRequest request, IAuthService auth, CancellationToken ct) =>
        {
            var result = await auth.LoginAsync(request, ct);
            return result.Success ? Results.Ok(result.Value) : Results.Unauthorized();
        }).AllowAnonymous();
        var secured = api.MapGroup("").RequireAuthorization();
        secured.MapGet("/products", async (string? search, int page, int pageSize, string? sort, IInventoryService service, CancellationToken ct) =>
            Results.Ok(await service.GetProductsAsync(search, page == 0 ? 1 : page, pageSize == 0 ? 20 : pageSize, sort, ct)));
        secured.MapGet("/products/{id:int}", async (int id, IInventoryService service, CancellationToken ct) =>
            await service.GetProductAsync(id, ct) is { } product ? Results.Ok(product) : Results.NotFound());
        secured.MapPost("/products", async (ProductRequest request, ClaimsPrincipal user, IInventoryService service, CancellationToken ct) =>
            Result(await service.SaveProductAsync(request, UserId(user), ct))).RequireAuthorization("AdminOnly");
        secured.MapDelete("/products/{id:int}", async (int id, ClaimsPrincipal user, IInventoryService service, CancellationToken ct) =>
            Result(await service.DeleteProductAsync(id, UserId(user), ct))).RequireAuthorization("AdminOnly");
        secured.MapGet("/categories", async (IInventoryService service, CancellationToken ct) => Results.Ok(await service.GetCategoriesAsync(ct)));
        secured.MapPost("/categories", async (CategoryRequest request, ClaimsPrincipal user, IInventoryService service, CancellationToken ct) =>
            Result(await service.SaveCategoryAsync(request, UserId(user), ct))).RequireAuthorization("AdminOnly");
        secured.MapGet("/suppliers", async (IInventoryService service, CancellationToken ct) => Results.Ok(await service.GetSuppliersAsync(ct)));
        secured.MapPost("/suppliers", async (SupplierRequest request, ClaimsPrincipal user, IInventoryService service, CancellationToken ct) =>
            Result(await service.SaveSupplierAsync(request, UserId(user), ct))).RequireAuthorization("AdminOnly");
        secured.MapPost("/stock/movements", async (StockChangeRequest request, ClaimsPrincipal user, IInventoryService service, CancellationToken ct) =>
            Result(await service.ChangeStockAsync(request, UserId(user), ct)));
        secured.MapGet("/stock/movements", async (int? productId, int page, int pageSize, IInventoryService service, CancellationToken ct) =>
            Results.Ok(await service.GetMovementsAsync(productId, page == 0 ? 1 : page, pageSize == 0 ? 20 : pageSize, ct)));
        secured.MapPost("/sales", async (CreateSaleRequest request, ClaimsPrincipal user, IInventoryService service, CancellationToken ct) =>
            Result(await service.CreateSaleAsync(request, UserId(user), ct)));
        secured.MapGet("/sales", async (DateTime? from, DateTime? to, int page, int pageSize, IInventoryService service, CancellationToken ct) =>
            Results.Ok(await service.GetSalesAsync(from, to, page == 0 ? 1 : page, pageSize == 0 ? 20 : pageSize, ct)));
        secured.MapGet("/dashboard", async (IInventoryService service, CancellationToken ct) => Results.Ok(await service.GetDashboardAsync(ct)));
        secured.MapGet("/reports/inventory.pdf", async (IReportService service, CancellationToken ct) => Results.File(await service.InventoryPdfAsync(ct), "application/pdf", "inventario.pdf"));
        secured.MapGet("/reports/inventory.xlsx", async (IReportService service, CancellationToken ct) => Results.File(await service.InventoryExcelAsync(ct), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "inventario.xlsx"));
        secured.MapGet("/reports/sales.pdf", async (DateTime? from, DateTime? to, IReportService service, CancellationToken ct) => Results.File(await service.SalesPdfAsync(new(from, to), ct), "application/pdf", "ventas.pdf"));
        secured.MapGet("/reports/sales.xlsx", async (DateTime? from, DateTime? to, IReportService service, CancellationToken ct) => Results.File(await service.SalesExcelAsync(new(from, to), ct), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ventas.xlsx"));
        secured.MapGet("/sales/{id:int}/receipt.pdf", async (int id, IReportService service, CancellationToken ct) => Results.File(await service.SaleReceiptPdfAsync(id, ct), "application/pdf", $"venta-{id}.pdf"));
        secured.MapGet("/users", async (IUserService service, CancellationToken ct) => Results.Ok(await service.GetAllAsync(ct))).RequireAuthorization("AdminOnly");
        secured.MapPost("/users", async (CreateUserRequest request, IUserService service, CancellationToken ct) => Result(await service.CreateAsync(request, ct))).RequireAuthorization("AdminOnly");
        secured.MapPut("/users/{id}/active/{active:bool}", async (string id, bool active, IUserService service, CancellationToken ct) => Result(await service.SetActiveAsync(id, active, ct))).RequireAuthorization("AdminOnly");
        secured.MapPost("/auth/change-password", async (ChangePasswordRequest request, ClaimsPrincipal user, IAuthService service, CancellationToken ct) => Result(await service.ChangePasswordAsync(UserId(user), request, ct)));
        secured.MapGet("/audit", async (int page, int pageSize, IAdminService service, CancellationToken ct) => Results.Ok(await service.GetAuditAsync(page==0?1:page,pageSize==0?50:pageSize,ct))).RequireAuthorization("AdminOnly");
        secured.MapGet("/settings", async (IAdminService service, CancellationToken ct) => Results.Ok(await service.GetSettingsAsync(ct))).RequireAuthorization("AdminOnly");
        secured.MapPost("/settings", async (SettingDto request, ClaimsPrincipal user, IAdminService service, CancellationToken ct) => Result(await service.SaveSettingAsync(request,UserId(user),ct))).RequireAuthorization("AdminOnly");
        return endpoints;
    }

    private static string UserId(ClaimsPrincipal user) => user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException();
    private static IResult Result(Application.Common.OperationResult result) => result.Success ? Results.Ok() : Results.BadRequest(new { error = result.Error });
    private static IResult Result<T>(Application.Common.OperationResult<T> result) => result.Success ? Results.Ok(result.Value) : Results.BadRequest(new { error = result.Error });
}
