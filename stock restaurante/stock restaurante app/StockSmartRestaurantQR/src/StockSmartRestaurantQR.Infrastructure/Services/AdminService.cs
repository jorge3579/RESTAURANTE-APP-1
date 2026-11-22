using Microsoft.EntityFrameworkCore;
using StockSmartRestaurantQR.Application.Common;
using StockSmartRestaurantQR.Application.DTOs;
using StockSmartRestaurantQR.Application.Interfaces;
using StockSmartRestaurantQR.Domain.Entities;
using StockSmartRestaurantQR.Infrastructure.Persistence;

namespace StockSmartRestaurantQR.Infrastructure.Services;

public sealed class AdminService(ApplicationDbContext db) : IAdminService
{
    public async Task<PagedResult<AuditLogDto>> GetAuditAsync(int page, int pageSize, CancellationToken cancellationToken = default)
    {
        page=Math.Max(1,page);pageSize=Math.Clamp(pageSize,1,100);var query=db.AuditLogs.AsNoTracking().OrderByDescending(x=>x.Timestamp);
        var total=await query.CountAsync(cancellationToken);var items=await query.Skip((page-1)*pageSize).Take(pageSize)
            .Select(x=>new AuditLogDto(x.Id,x.UserId,x.Action,x.EntityName,x.EntityId,x.NewValues,x.Timestamp)).ToListAsync(cancellationToken);
        return new(items,total,page,pageSize);
    }
    public async Task<IReadOnlyList<SettingDto>> GetSettingsAsync(CancellationToken cancellationToken=default)=>
        await db.SystemSettings.AsNoTracking().OrderBy(x=>x.Key).Select(x=>new SettingDto(x.Id,x.Key,x.Value,x.Description)).ToListAsync(cancellationToken);
    public async Task<OperationResult<SettingDto>> SaveSettingAsync(SettingDto setting,string userId,CancellationToken cancellationToken=default)
    {
        var entity=setting.Id==0?new SystemSetting():await db.SystemSettings.FirstOrDefaultAsync(x=>x.Id==setting.Id,cancellationToken);
        if(entity is null)return OperationResult<SettingDto>.Fail("Configuración no encontrada.");
        if(setting.Id==0)db.SystemSettings.Add(entity);entity.Key=setting.Key.Trim();entity.Value=setting.Value.Trim();entity.Description=setting.Description?.Trim();
        await db.SaveChangesAsync(cancellationToken);db.AuditLogs.Add(new AuditLog{UserId=userId,Action="UpdateSetting",EntityName=nameof(SystemSetting),EntityId=entity.Id.ToString(),NewValues=$"{entity.Key}={entity.Value}"});await db.SaveChangesAsync(cancellationToken);
        return OperationResult<SettingDto>.Ok(new(entity.Id,entity.Key,entity.Value,entity.Description));
    }
}
