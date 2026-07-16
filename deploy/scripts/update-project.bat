@echo off

git pull

cd backend

npm install

pm2 restart SmartRestaurantQR

pause