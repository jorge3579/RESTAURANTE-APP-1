@echo off
title Stock Smart Restaurant QR
cd /d "%~dp0"
echo Iniciando Stock Smart Restaurant QR...
echo Cuando aparezca "Now listening", abra http://localhost:5050/stock/ en su navegador.
echo Desde Internet use https://emphasis-expanse-evolution.ngrok-free.dev/stock/.
echo Para detener el sistema, cierre esta ventana o presione Ctrl+C.
echo.
dotnet run --project "src\StockSmartRestaurantQR.Web\StockSmartRestaurantQR.Web.csproj" --configuration Release --no-launch-profile --urls "http://0.0.0.0:5050"
if errorlevel 1 (
  echo.
  echo No se pudo iniciar la aplicacion. Revise que MariaDB y MongoDB esten activos.
  pause
)
