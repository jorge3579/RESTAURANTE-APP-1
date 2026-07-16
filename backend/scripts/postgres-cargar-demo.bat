@echo off

setlocal

echo =====================================================
echo SmartRestaurantQR - Cargar datos demo
echo =====================================================
echo.

set PG_BIN=C:\Program Files\PostgreSQL\18\bin
set PG_HOST=localhost
set PG_PORT=5432
set PG_DATABASE=smartrestaurantqr
set PG_USER=postgres

cd /d "%~dp0.."

"%PG_BIN%\psql.exe" ^
    -h %PG_HOST% ^
    -p %PG_PORT% ^
    -U %PG_USER% ^
    -d %PG_DATABASE% ^
    -v ON_ERROR_STOP=1 ^
    -f database\032_datos_demo.sql

if errorlevel 1 (
    echo.
    echo ERROR: no se pudieron cargar los datos demo.
    pause
    exit /b 1
)

echo.
echo Datos demo cargados correctamente.
echo.

pause

endlocal