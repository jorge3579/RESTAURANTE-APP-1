param(
    [int]$Port = 3000
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$backendPath = Join-Path $repoRoot "backend"
$binPath = Join-Path $PSScriptRoot "bin"
$runtimePath = Join-Path $PSScriptRoot "runtime"
$cloudflared = Join-Path $binPath "cloudflared.exe"
$pnpm = (Get-Command "pnpm.cmd" -ErrorAction Stop).Source
$tunnelLog = Join-Path $runtimePath "cloudflared.log"
$urlFile = Join-Path $runtimePath "public-api-url.txt"
$processFile = Join-Path $runtimePath "processes.json"

New-Item -ItemType Directory -Force -Path $binPath, $runtimePath | Out-Null

if (-not (Test-Path -LiteralPath $cloudflared)) {
    throw "Falta cloudflared.exe en $binPath. Ejecute primero install-cloudflared.ps1."
}

$healthUrl = "http://127.0.0.1:$Port/api/health"
$backendProcess = $null

try {
    Invoke-RestMethod -Uri $healthUrl -TimeoutSec 3 | Out-Null
    Write-Host "El backend ya esta funcionando en el puerto $Port."
} catch {
    Write-Host "Iniciando backend SmartRestaurantQR..."
    $backendProcess = Start-Process `
        -FilePath $pnpm `
        -ArgumentList "start" `
        -WorkingDirectory $backendPath `
        -WindowStyle Hidden `
        -PassThru

    $ready = $false
    foreach ($attempt in 1..30) {
        Start-Sleep -Seconds 1
        try {
            Invoke-RestMethod -Uri $healthUrl -TimeoutSec 2 | Out-Null
            $ready = $true
            break
        } catch {}
    }

    if (-not $ready) {
        if ($backendProcess -and -not $backendProcess.HasExited) {
            Stop-Process -Id $backendProcess.Id -Force
        }
        throw "El backend no respondio en $healthUrl. Revise su configuracion y PostgreSQL."
    }
}

Remove-Item -LiteralPath $tunnelLog, $urlFile -Force -ErrorAction SilentlyContinue

Write-Host "Creando tunel HTTPS publico..."
$tunnelProcess = Start-Process `
    -FilePath $cloudflared `
    -ArgumentList @("tunnel", "--url", "http://127.0.0.1:$Port", "--no-autoupdate", "--logfile", $tunnelLog) `
    -WorkingDirectory $PSScriptRoot `
    -WindowStyle Hidden `
    -PassThru

$publicOrigin = $null
foreach ($attempt in 1..60) {
    Start-Sleep -Seconds 1
    if (Test-Path -LiteralPath $tunnelLog) {
        $match = Select-String -Path $tunnelLog -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' -AllMatches |
            Select-Object -Last 1
        if ($match) {
            $publicOrigin = $match.Matches[0].Value
            break
        }
    }
    if ($tunnelProcess.HasExited) {
        throw "cloudflared termino antes de crear el tunel. Revise $tunnelLog."
    }
}

if (-not $publicOrigin) {
    Stop-Process -Id $tunnelProcess.Id -Force -ErrorAction SilentlyContinue
    throw "No se obtuvo una URL publica. Revise $tunnelLog."
}

$publicApiUrl = "$publicOrigin/api"
$publicApiUrl | Set-Content -LiteralPath $urlFile -Encoding utf8

[PSCustomObject]@{
    BackendPid = if ($backendProcess) { $backendProcess.Id } else { $null }
    TunnelPid = $tunnelProcess.Id
} | ConvertTo-Json | Set-Content -LiteralPath $processFile -Encoding utf8

$remoteHealth = $null
foreach ($attempt in 1..30) {
    try {
        $remoteHealth = Invoke-RestMethod -Uri "$publicApiUrl/health" -TimeoutSec 10
        if ($remoteHealth.success) {
            break
        }
    } catch {
        Start-Sleep -Seconds 2
    }
}

if (-not $remoteHealth -or -not $remoteHealth.success) {
    Write-Warning "El DNS local todavia no resuelve la URL. El tunel queda activo; pruebe nuevamente en unos minutos."
}

Write-Host ""
Write-Host "API PUBLICA LISTA" -ForegroundColor Green
Write-Host "API:    $publicApiUrl"
Write-Host "Socket: $publicOrigin"
Write-Host "Estado: $publicApiUrl/health"
Write-Host ""
Write-Host "Mantenga esta PC encendida. Para detenerla ejecute stop-public-api.ps1."
