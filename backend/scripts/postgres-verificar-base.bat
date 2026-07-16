@echo off

setlocal

echo =====================================================
echo SmartRestaurantQR - Verificar PostgreSQL
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
    -f database\033_verificacion_funcional.sql

if errorlevel 1 (
    echo.
    echo ERROR: la verificacion encontro problemas.
    pause
    exit /b 1
)

echo.
echo Verificacion finalizada.
echo.

pause

endlocal