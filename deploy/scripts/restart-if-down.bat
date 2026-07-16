@echo off

pm2 describe SmartRestaurantQR > nul

IF ERRORLEVEL 1 (
    echo Servicio caido. Reiniciando...
    pm2 start backend/src/server.js --name SmartRestaurantQR
    pm2 save
) ELSE (
    echo Servicio activo.
)

pause