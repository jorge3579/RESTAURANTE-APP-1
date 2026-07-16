@echo off

echo Levantando contenedor Docker...

cd ..

docker compose up -d --build

pause