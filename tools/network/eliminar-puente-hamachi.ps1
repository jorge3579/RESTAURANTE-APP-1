[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$IpHotspot,

    [int]$PuertoBackend = 3000
)

$ErrorActionPreference = "Stop"
$nombreRegla = "SmartRestaurantQR Puente Hamachi $PuertoBackend"

$identidad = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identidad)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw "Ejecuta PowerShell como administrador para eliminar el puente."
}

& netsh interface portproxy delete v4tov4 `
    listenaddress=$IpHotspot `
    listenport=$PuertoBackend | Out-Null

Get-NetFirewallRule -DisplayName $nombreRegla -ErrorAction SilentlyContinue |
    Remove-NetFirewallRule

Write-Host "Puente y regla de firewall eliminados." -ForegroundColor Green
