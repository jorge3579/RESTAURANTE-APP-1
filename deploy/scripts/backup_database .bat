@echo off

sqlcmd ^
-S localhost ^
-U sa ^
-P TuPassword ^
-Q "BACKUP DATABASE SmartRestaurantQR TO DISK='C:\Backups\SmartRestaurantQR.bak' WITH INIT"

pause