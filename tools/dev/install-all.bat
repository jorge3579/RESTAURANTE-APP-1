@echo off

echo ===============================

echo Instalando Backend

echo ===============================

cd ../../backend

call npm install

echo.

echo ===============================

echo Instalando Cliente

echo ===============================

cd ../frontend-cliente

call npm install

echo.

echo ===============================

echo Instalando Restaurante

echo ===============================

cd ../frontend-restaurante

call npm install

echo.

echo Todo instalado correctamente.

pause