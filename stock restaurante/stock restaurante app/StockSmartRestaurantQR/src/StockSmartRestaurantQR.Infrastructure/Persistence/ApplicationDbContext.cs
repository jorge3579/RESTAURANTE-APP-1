using Microsoft.EntityFrameworkCore;
using StockSmartRestaurantQR.Domain.Common;
using StockSmartRestaurantQR.Domain.Entities;

namespace StockSmartRestaurantQR.Infrastructure.Persistence;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<StockMovement> StockMovements => Set<StockMovement>();
    public DbSet<Sale> Sales => Set<Sale>();
    public DbSet<SaleDetail> SaleDetails => Set<SaleDetail>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<SystemSetting> SystemSettings => Set<SystemSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Category>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Supplier>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Product>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<Sale>().HasQueryFilter(x => !x.IsDeleted);
        modelBuilder.Entity<SaleDetail>().HasQueryFilter(x => !x.IsDeleted && !x.Sale.IsDeleted && !x.Product.IsDeleted);
        modelBuilder.Entity<StockMovement>().HasQueryFilter(x => !x.IsDeleted && !x.Product.IsDeleted);
        modelBuilder.Entity<SystemSetting>().HasQueryFilter(x => !x.IsDeleted);

        modelBuilder.Entity<Category>().HasIndex(x => x.Name).IsUnique();
        modelBuilder.Entity<Supplier>().HasIndex(x => x.Name);
        modelBuilder.Entity<Product>().HasIndex(x => x.Code).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(x => new { x.Name, x.CategoryId });
        modelBuilder.Entity<StockMovement>().HasIndex(x => new { x.ProductId, x.CreatedAt });
        modelBuilder.Entity<Sale>().HasIndex(x => x.SaleNumber).IsUnique();
        modelBuilder.Entity<Sale>().HasIndex(x => x.ExternalReference).IsUnique();
        modelBuilder.Entity<Sale>().HasIndex(x => x.SaleDate);
        modelBuilder.Entity<SystemSetting>().HasIndex(x => x.Key).IsUnique();

        modelBuilder.Entity<Product>().Property(x => x.Price).HasPrecision(18, 2);
        modelBuilder.Entity<Product>().Property(x => x.Cost).HasPrecision(18, 2);
        modelBuilder.Entity<Product>().Property(x => x.Stock).HasPrecision(18, 3);
        modelBuilder.Entity<Product>().Property(x => x.MinStock).HasPrecision(18, 3);
        modelBuilder.Entity<StockMovement>().Property(x => x.Quantity).HasPrecision(18, 3);
        modelBuilder.Entity<StockMovement>().Property(x => x.PreviousStock).HasPrecision(18, 3);
        modelBuilder.Entity<StockMovement>().Property(x => x.NewStock).HasPrecision(18, 3);
        modelBuilder.Entity<Sale>().Property(x => x.TotalAmount).HasPrecision(18, 2);
        modelBuilder.Entity<SaleDetail>().Property(x => x.Quantity).HasPrecision(18, 3);
        modelBuilder.Entity<SaleDetail>().Property(x => x.UnitPrice).HasPrecision(18, 2);
        modelBuilder.Entity<SaleDetail>().Property(x => x.SubTotal).HasPrecision(18, 2);

        modelBuilder.Entity<Product>().HasOne(x => x.Supplier).WithMany(x => x.Products).HasForeignKey(x => x.SupplierId).OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<Product>().HasOne(x => x.Category).WithMany(x => x.Products).HasForeignKey(x => x.CategoryId).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<SaleDetail>().HasOne(x => x.Product).WithMany(x => x.SaleDetails).HasForeignKey(x => x.ProductId).OnDelete(DeleteBehavior.Restrict);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTime.UtcNow;
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            if (entry.State == EntityState.Added) entry.Entity.CreatedAt = now;
            if (entry.State == EntityState.Modified) entry.Entity.UpdatedAt = now;
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
