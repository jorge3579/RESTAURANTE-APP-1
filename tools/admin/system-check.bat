@echo off

echo ==========================================
echo SmartRestaurantQR - Diagnóstico General
echo ==========================================

echo.
echo [1/8] Version de Windows
ver

echo.
echo [2/8] Version de Node
node -v

echo.
echo [3/8] Version de pnpm
pnpm -v

echo.
echo [4/8] Docker
docker --version

echo.
echo [5/8] PM2
pm2 -v

echo.
echo [6/8] PostgreSQL
psql --version

echo.
echo [7/8] Puerto API
netstat -ano | findstr :3000

echo.
echo [8/8] Puerto PostgreSQL
netstat -ano | findstr :5432

pause
