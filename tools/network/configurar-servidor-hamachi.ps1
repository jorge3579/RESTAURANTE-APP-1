[CmdletBinding()]
param(
    [string]$IpHamachiRemota = "25.3.143.140",
    [string]$SubredLocal = "192.168.0.0/24",
    [int]$PuertoBackend = 3000
)

$ErrorActionPreference = "Stop"
$taskName = "SmartRestaurantQR Backend"
$ruleName = "SmartRestaurantQR Backend Hamachi $PuertoBackend"
$lanRuleName = "SmartRestaurantQR Backend LAN $PuertoBackend"
$repo = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
$backend = Join-Path $repo "backend"
$node = (Get-Command node -ErrorAction Stop).Source
$log = Join-Path $PSScriptRoot "configurar-servidor-hamachi.log"

$identidad = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = [Security.Principal.WindowsPrincipal]::new($identidad)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    throw "Este script debe ejecutarse como administrador."
}

Start-Transcript -Path $log -Force

try {
    $action = New-ScheduledTaskAction `
        -Execute $node `
        -Argument "src/server.js" `
        -WorkingDirectory $backend

    $trigger = New-ScheduledTaskTrigger -AtStartup
    $settings = New-ScheduledTaskSettingsSet `
        -StartWhenAvailable `
        -RestartCount 5 `
        -RestartInterval (New-TimeSpan -Minutes 1) `
        -ExecutionTimeLimit ([TimeSpan]::Zero) `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries

    Register-ScheduledTask `
        -TaskName $taskName `
        -Action $action `
        -Trigger $trigger `
        -Settings $settings `
        -User "SYSTEM" `
        -RunLevel Highest `
        -Force | Out-Null

    Get-NetFirewallRule `
        -DisplayName "Node.js JavaScript Runtime" `
        -ErrorAction SilentlyContinue |
        Where-Object { $_.Direction -eq "Inbound" -and $_.Action -eq "Allow" } |
        Disable-NetFirewallRule

    Get-NetFirewallRule `
        -DisplayName "SmartRestaurantQR Backend 3000" `
        -ErrorAction SilentlyContinue |
        Remove-NetFirewallRule

    Get-NetFirewallRule `
        -DisplayName $ruleName `
        -ErrorAction SilentlyContinue |
        Remove-NetFirewallRule

    Get-NetFirewallRule `
        -DisplayName $lanRuleName `
        -ErrorAction SilentlyContinue |
        Remove-NetFirewallRule

    New-NetFirewallRule `
        -DisplayName $ruleName `
        -Direction Inbound `
        -Action Allow `
        -Protocol TCP `
        -LocalPort $PuertoBackend `
        -RemoteAddress $IpHamachiRemota `
        -InterfaceAlias "Hamachi" `
        -Program $node `
        -Profile Any | Out-Null

    New-NetFirewallRule `
        -DisplayName $lanRuleName `
        -Direction Inbound `
        -Action Allow `
        -Protocol TCP `
        -LocalPort $PuertoBackend `
        -RemoteAddress $SubredLocal `
        -Profile Any | Out-Null

    Stop-ScheduledTask `
        -TaskName $taskName `
        -ErrorAction SilentlyContinue

    Start-Sleep -Seconds 2

    Start-ScheduledTask -TaskName $taskName
    Start-Sleep -Seconds 4

    $respuesta = Invoke-RestMethod `
        -Uri "http://127.0.0.1:$PuertoBackend/api/health" `
        -TimeoutSec 10

    Write-Host "Servidor configurado correctamente." -ForegroundColor Green
    Write-Host "PC Hamachi autorizada: $IpHamachiRemota"
    Write-Host "Subred LAN autorizada: $SubredLocal"
    Write-Host "Health: $($respuesta.data.status)"
} finally {
    Stop-Transcript
}
