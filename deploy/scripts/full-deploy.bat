@echo off

echo ===============================
echo SmartRestaurantQR Full Deploy
echo ===============================

git pull

cd backend

call npm install

call npm test

cd ..

docker compose down

docker compose up -d --build

pm2 restart SmartRestaurantQR

echo.
echo Deploy finalizado correctamente.
echo.

pause