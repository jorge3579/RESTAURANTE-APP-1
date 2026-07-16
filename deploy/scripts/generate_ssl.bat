@echo off

mkdir certs

openssl req ^
-x509 ^
-nodes ^
-days 3650 ^
-newkey rsa:4096 ^
-keyout certs/server.key ^
-out certs/server.crt

pause