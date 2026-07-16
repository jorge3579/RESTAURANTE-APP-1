[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$IpHamachiServidor,

    [Parameter(Mandatory = $true)]
    [string]$IpHotspot,

    [int]$PuertoBackend = 3000,

    [string]$SubredCelulares
)

$ErrorActionPreference = "Stop"
$nombreRegla = "SmartRestaurantQR Puente Hamachi $PuertoBackend"

function Confirmar-IPv4 {
    param([string]$Valor, [string]$Nombre)

    $ip = $null
    if (-not [System.Net.IPAddress]::TryParse($Valor, [ref]$ip) -or
        $ip.AddressFamily -ne [System.Net.Sockets.AddressFamily]::InterNetwork) {
        throw "$Nombre debe ser una direccion IPv4 valida. Valor recibido: $Valor"
    }
}

$identidad = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identidad)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw "Ejecuta PowerShell como administrador para configurar el puente."
}

Confirmar-IPv4 -Valor $IpHamachiServidor -Nombre "IpHamachiServidor"
Confirmar-IPv4 -Valor $IpHotspot -Nombre "IpHotspot"

if (-not $IpHamachiServidor.StartsWith("25.")) {
    Write-Warning "La IP indicada no comienza con 25. Confirma que sea la IPv4 mostrada por Hamachi."
}

if ([string]::IsNullOrWhiteSpace($SubredCelulares)) {
    $octetos = $IpHotspot.Split(".")
    $SubredCelulares = "$($octetos[0]).$($octetos[1]).$($octetos[2]).0/24"
}

Set-Service -Name iphlpsvc -StartupType Automatic
Start-Service -Name iphlpsvc

& netsh interface portproxy delete v4tov4 `
    listenaddress=$IpHotspot `
    listenport=$PuertoBackend | Out-Null

& netsh interface portproxy add v4tov4 `
    listenaddress=$IpHotspot `
    listenport=$PuertoBackend `
    connectaddress=$IpHamachiServidor `
    connectport=$PuertoBackend

if ($LASTEXITCODE -ne 0) {
    throw "Windows no pudo crear el reenvio TCP. Codigo: $LASTEXITCODE"
}

Get-NetFirewallRule -DisplayName $nombreRegla -ErrorAction SilentlyContinue |
    Remove-NetFirewallRule

New-NetFirewallRule `
    -DisplayName $nombreRegla `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalAddress $IpHotspot `
    -LocalPort $PuertoBackend `
    -RemoteAddress $SubredCelulares `
    -Profile Any | Out-Null

Write-Host "Puente configurado correctamente." -ForegroundColor Green
Write-Host "Celulares: http://${IpHotspot}:$PuertoBackend"
Write-Host "Destino Hamachi: http://${IpHamachiServidor}:$PuertoBackend"
Write-Host "Subred autorizada: $SubredCelulares"

Write-Host "`nRegla portproxy:" -ForegroundColor Cyan
& netsh interface portproxy show v4tov4

$prueba = Test-NetConnection `
    -ComputerName $IpHamachiServidor `
    -Port $PuertoBackend `
    -InformationLevel Quiet

if ($prueba) {
    Write-Host "El backend responde a traves de Hamachi." -ForegroundColor Green
} else {
    Write-Warning "El puente fue creado, pero el backend aun no responde en ${IpHamachiServidor}:$PuertoBackend."
}
