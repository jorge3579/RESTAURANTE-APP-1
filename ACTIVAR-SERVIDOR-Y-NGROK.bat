@echo off
setlocal
title SmartRestaurantQR - Activar servidor

set "SCRIPT=%~dp0tools\remote-api\activar-servidor-completo.ps1"

if not exist "%SCRIPT%" (
    echo ERROR: No se encontro el script:
    echo %SCRIPT%
    pause
    exit /b 1
)

echo Solicitando permisos para comprobar PostgreSQL y activar los servicios...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "Start-Process powershell.exe -Verb RunAs -Wait -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File ""%SCRIPT%""'"

if errorlevel 1 (
    echo.
    echo No se pudo completar la activacion.
    pause
    exit /b 1
)

endlocal

