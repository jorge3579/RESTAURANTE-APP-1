@echo off

sqlcmd -S localhost -Q "SELECT @@VERSION"

pause