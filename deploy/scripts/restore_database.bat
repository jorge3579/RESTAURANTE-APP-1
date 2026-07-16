@echo off

sqlcmd ^
-S localhost ^
-U sa ^
-P TuPassword ^
-Q "RESTORE DATABASE SmartRestaurantQR FROM DISK='C:\Backups\SmartRestaurantQR.bak' WITH REPLACE"

pause