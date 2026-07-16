@echo off

sqlcmd ^
-S localhost ^
-U sa ^
-P TuPassword ^
-d SmartRestaurantQR ^
-i reset-demo-data.sql

pause