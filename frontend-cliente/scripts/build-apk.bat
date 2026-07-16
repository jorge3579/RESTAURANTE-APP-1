@echo off

echo Generando APK SmartRestaurantQR Cliente...

pnpm dlx eas-cli build --platform android --profile production

pause
