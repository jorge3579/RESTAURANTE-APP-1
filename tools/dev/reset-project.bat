@echo off

echo ==========================================
echo SmartRestaurantQR - Reset Proyecto
echo ==========================================

echo.

echo Eliminando node_modules...

rmdir /S /Q backend\node_modules
rmdir /S /Q frontend-cliente\node_modules
rmdir /S /Q frontend-restaurante\node_modules

echo.

echo Eliminando package-lock...

del backend\package-lock.json
del frontend-cliente\package-lock.json
del frontend-restaurante\package-lock.json

echo.

echo Proyecto limpio.

pause