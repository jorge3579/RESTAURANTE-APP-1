@echo off
setlocal
title SmartRestaurantQR - Reconectar API, Stock y aplicaciones
cd /d "%~dp0"

set "SCRIPT=%~dp0tools\remote-api\activar-servidor-completo.ps1"
set "MODO_PRUEBA=0"

if /i "%~1"=="--prueba" set "MODO_PRUEBA=1"

if not exist "%SCRIPT%" (
    echo.
    echo ERROR: No se encontro el componente de reconexion:
    echo %SCRIPT%
    echo.
    pause
    exit /b 1
)

if "%MODO_PRUEBA%"=="0" (
    net session >nul 2>&1
    if errorlevel 1 (
        echo Solicitando permisos de administrador...
        powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
          "Start-Process -FilePath '%~f0' -ArgumentList '--elevado' -Verb RunAs -Wait"
        if errorlevel 1 (
            echo.
            echo ERROR: Windows no autorizo la ejecucion como administrador.
            pause
            exit /b 1
        )
        exit /b 0
    )
)

echo.
echo Reconectando SmartRestaurantQR...
echo Se comprobaran PostgreSQL, MariaDB/MongoDB, Stock, backend y ngrok.
echo URL publica requerida: https://emphasis-expanse-evolution.ngrok-free.dev
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" -NoPause
set "RESULTADO=%ERRORLEVEL%"

if not "%RESULTADO%"=="0" (
    echo.
    echo ERROR: No se pudo completar la reconexion.
    echo Revise tools\remote-api\runtime\backend-error.log,
    echo tools\remote-api\runtime\stock-error.log,
    echo tools\remote-api\runtime\ngrok.log y monitor-conexion.log.
) else (
    echo.
    echo CONEXION RESTABLECIDA CORRECTAMENTE.
    echo API publica:   https://emphasis-expanse-evolution.ngrok-free.dev/api
    echo Stock publico: https://emphasis-expanse-evolution.ngrok-free.dev/stock/
    echo Ya puede abrir ambas aplicaciones desde cualquier red.
)

if "%MODO_PRUEBA%"=="0" pause

endlocal & exit /b %RESULTADO%
