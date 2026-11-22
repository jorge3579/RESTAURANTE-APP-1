using StockSmartRestaurantQR.Application.Common;
using StockSmartRestaurantQR.Application.DTOs;

namespace StockSmartRestaurantQR.Application.Interfaces;

public interface IInventoryService
{
    Task<PagedResult<ProductDto>> GetProductsAsync(string? search, int page, int pageSize, string? sort = null, CancellationToken cancellationToken = default);
    Task<ProductDto?> GetProductAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SupplierDto>> GetSuppliersAsync(CancellationToken cancellationToken = default);
    Task<OperationResult<ProductDto>> SaveProductAsync(ProductRequest request, string userId, CancellationToken cancellationToken = default);
    Task<OperationResult<CategoryDto>> SaveCategoryAsync(CategoryRequest request, string userId, CancellationToken cancellationToken = default);
    Task<OperationResult<SupplierDto>> SaveSupplierAsync(SupplierRequest request, string userId, CancellationToken cancellationToken = default);
    Task<OperationResult> DeleteProductAsync(int id, string userId, CancellationToken cancellationToken = default);
    Task<OperationResult> DeleteCategoryAsync(int id, string userId, CancellationToken cancellationToken = default);
    Task<OperationResult> DeleteSupplierAsync(int id, string userId, CancellationToken cancellationToken = default);
    Task<OperationResult<StockMovementDto>> ChangeStockAsync(StockChangeRequest request, string userId, CancellationToken cancellationToken = default);
    Task<PagedResult<StockMovementDto>> GetMovementsAsync(int? productId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<OperationResult<SaleDto>> CreateSaleAsync(CreateSaleRequest request, string userId, CancellationToken cancellationToken = default);
    Task<PagedResult<SaleDto>> GetSalesAsync(DateTime? from, DateTime? to, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<DashboardDto> GetDashboardAsync(CancellationToken cancellationToken = default);
}

public interface IAuthService
{
    Task<OperationResult<AuthResult>> LoginAsync(LoginRequest request, CancellationToken cancellationToken = default);
    Task<OperationResult> ChangePasswordAsync(string userId, ChangePasswordRequest request, CancellationToken cancellationToken = default);
}

public interface IUserService
{
    Task<IReadOnlyList<UserDto>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<OperationResult<UserDto>> CreateAsync(CreateUserRequest request, CancellationToken cancellationToken = default);
    Task<OperationResult> SetActiveAsync(string id, bool active, CancellationToken cancellationToken = default);
    Task SeedAsync(CancellationToken cancellationToken = default);
}

public interface IReportService
{
    Task<byte[]> SalesPdfAsync(ReportFilter filter, CancellationToken cancellationToken = default);
    Task<byte[]> InventoryPdfAsync(CancellationToken cancellationToken = default);
    Task<byte[]> SalesExcelAsync(ReportFilter filter, CancellationToken cancellationToken = default);
    Task<byte[]> InventoryExcelAsync(CancellationToken cancellationToken = default);
    Task<byte[]> SaleReceiptPdfAsync(int saleId, CancellationToken cancellationToken = default);
}

public interface IFileStorageService
{
    Task<string> SaveProductImageAsync(Stream content, string originalFileName, CancellationToken cancellationToken = default);
    Task DeleteAsync(string? relativePath, CancellationToken cancellationToken = default);
}

public interface IAdminService
{
    Task<PagedResult<AuditLogDto>> GetAuditAsync(int page, int pageSize, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<SettingDto>> GetSettingsAsync(CancellationToken cancellationToken = default);
    Task<OperationResult<SettingDto>> SaveSettingAsync(SettingDto setting, string userId, CancellationToken cancellationToken = default);
}
