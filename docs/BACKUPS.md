# Backups

## Crear backup SQL Server

```bash
sqlcmd -S localhost -U sa -P TuPassword -Q "BACKUP DATABASE SmartRestaurantQR TO DISK='C:\Backups\SmartRestaurantQR.bak' WITH INIT"