$ErrorActionPreference = "Continue"

$runtimePath = Join-Path $PSScriptRoot "runtime"
$activationScript = Join-Path $PSScriptRoot "activar-servidor-completo.ps1"
$logPath = Join-Path $runtimePath "monitor-conexion.log"
$expectedUrl = "https://emphasis-expanse-evolution.ngrok-free.dev"

New-Item -ItemType Directory -Force -Path $runtimePath | Out-Null
$PID | Set-Content (Join-Path $runtimePath "monitor.pid")

function Test-Url([string]$Url, [int]$TimeoutSec) {
    try {
        $response = Invoke-RestMethod $Url -TimeoutSec $TimeoutSec `
            -Headers @{ "ngrok-skip-browser-warning" = "smartrestaurantqr" }
        return $response.success -eq $true
    } catch {
        return $false
    }
}

function Write-MonitorLog([string]$Message) {
    $line = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $Message"
    Add-Content -LiteralPath $logPath -Value $line
}

Write-MonitorLog "Monitor iniciado."

while ($true) {
    $postgresActivo = [bool](Get-Service -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -like "postgresql*" -and $_.Status -eq "Running" })
    $backendActivo = Test-Url "http://127.0.0.1:3000/api/health" 5
    $publicoActivo = Test-Url "$expectedUrl/api/health" 12

    if (-not ($postgresActivo -and $backendActivo -and $publicoActivo)) {
        Write-MonitorLog "Fallo detectado. PostgreSQL=$postgresActivo Backend=$backendActivo Publico=$publicoActivo. Intentando recuperar."
        try {
            & $activationScript -NoPause -NoMonitor *>> $logPath
            Write-MonitorLog "Proceso de recuperacion ejecutado."
        } catch {
            Write-MonitorLog "La recuperacion fallo: $($_.Exception.Message)"
        }
    }

    Start-Sleep -Seconds 30
}
