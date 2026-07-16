@echo off

set /p PASSWORD=Ingrese password a convertir en hash: 

node scripts/generate-password-hash.js %PASSWORD%

pause