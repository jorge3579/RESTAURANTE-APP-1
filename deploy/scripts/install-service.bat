@echo off

echo Instalando SmartRestaurantQR como servicio...

npm install -g pm2

pm2 start backend/src/server.js --name SmartRestaurantQR

pm2 save

pause