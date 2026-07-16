@echo off

echo Generando APK SmartRestaurantQR Restaurante...

pnpm dlx eas-cli build --platform android --profile production

pause
