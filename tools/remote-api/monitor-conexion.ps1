$ErrorActionPreference = "Continue"

$runtimePath = Join-Path $PSScriptRoot "runtime"
$activationScript = Join-Path $PSScriptRoot "activar-servidor-completo.ps1"
$logPath = Join-Path $runtimePath "monitor-conexion.log"
$expectedUrl = "https://emphasis-expanse-evolution.ngrok-free.dev"
$failureThreshold = 3
$recoveryCooldownSeconds = 180
$consecutiveFailures = 0
$lastRecovery = [DateTime]::MinValue

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

function Test-Web([string]$Url, [int]$TimeoutSec) {
    try {
        $response = Invoke-WebRequest $Url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec $TimeoutSec `
            -Headers @{ "ngrok-skip-browser-warning" = "smartrestaurantqr" }
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
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
    $stockLocalActivo = Test-Web "http://127.0.0.1:5050/stock/" 8
    $stockPublicoActivo = Test-Web "$expectedUrl/stock/" 15

    $todoActivo = $postgresActivo -and $backendActivo -and $publicoActivo -and
        $stockLocalActivo -and $stockPublicoActivo

    if ($todoActivo) {
        if ($consecutiveFailures -gt 0) {
            Write-MonitorLog "Conexion recuperada sin reiniciar servicios."
        }
        $consecutiveFailures = 0
    } else {
        $consecutiveFailures++
        Write-MonitorLog "Fallo $consecutiveFailures/$failureThreshold. PostgreSQL=$postgresActivo Backend=$backendActivo Publico=$publicoActivo StockLocal=$stockLocalActivo StockPublico=$stockPublicoActivo."

        $cooldownElapsed = ((Get-Date) - $lastRecovery).TotalSeconds -ge $recoveryCooldownSeconds
        if ($consecutiveFailures -ge $failureThreshold -and $cooldownElapsed) {
            Write-MonitorLog "Fallo confirmado. Intentando recuperar."
            try {
                $recoveryOutput = & $activationScript -NoPause -NoMonitor 2>&1 | Out-String
                if ($recoveryOutput) {
                    Add-Content -LiteralPath $logPath -Value $recoveryOutput
                }
                Write-MonitorLog "Proceso de recuperacion ejecutado."
            } catch {
                Write-MonitorLog "La recuperacion fallo: $($_.Exception.Message)"
            }
            $lastRecovery = Get-Date
            $consecutiveFailures = 0
        } elseif ($consecutiveFailures -ge $failureThreshold) {
            Write-MonitorLog "Recuperacion omitida por periodo de estabilizacion."
        }
    }

    Start-Sleep -Seconds 30
}
