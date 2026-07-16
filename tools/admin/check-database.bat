@echo off

sqlcmd ^
-S localhost ^
-U sa ^
-P TuPassword ^
-Q "SELECT DB_NAME()"

pause