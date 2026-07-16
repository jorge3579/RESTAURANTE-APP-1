@echo off

echo Ejecutando datos de prueba SmartRestaurantQR...

sqlcmd ^
-S localhost ^
-U sa ^
-P TuPassword ^
-d SmartRestaurantQR ^
-i database\023_seed_demo.sql

echo.
echo Seed demo ejecutado.
echo.

pause