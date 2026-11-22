using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using StockSmartRestaurantQR.Application.Interfaces;
using StockSmartRestaurantQR.Infrastructure.Auth;

namespace StockSmartRestaurantQR.Infrastructure.Services;

public sealed class FileStorageService(IHostEnvironment environment, IOptions<FileStorageSettings> settings) : IFileStorageService
{
    private readonly string _root = Path.GetFullPath(Path.Combine(environment.ContentRootPath, settings.Value.ProductImagesPath));
    private static readonly HashSet<string> Allowed = new(StringComparer.OrdinalIgnoreCase) { ".jpg", ".jpeg", ".png", ".webp" };

    public async Task<string> SaveProductImageAsync(Stream content, string originalFileName, CancellationToken cancellationToken = default)
    {
        var extension = Path.GetExtension(Path.GetFileName(originalFileName));
        if (!Allowed.Contains(extension)) throw new InvalidOperationException("Formato de imagen no permitido.");
        Directory.CreateDirectory(_root);
        var name = $"{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var fullPath = Path.GetFullPath(Path.Combine(_root, name));
        if (!fullPath.StartsWith(_root, StringComparison.OrdinalIgnoreCase)) throw new InvalidOperationException("Ruta de archivo inválida.");
        await using var output = File.Create(fullPath);
        await content.CopyToAsync(output, cancellationToken);
        return $"/uploads/productos/{name}";
    }

    public Task DeleteAsync(string? relativePath, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(relativePath)) return Task.CompletedTask;
        var file = Path.GetFileName(relativePath);
        var fullPath = Path.GetFullPath(Path.Combine(_root, file));
        if (fullPath.StartsWith(_root, StringComparison.OrdinalIgnoreCase) && File.Exists(fullPath)) File.Delete(fullPath);
        return Task.CompletedTask;
    }
}
