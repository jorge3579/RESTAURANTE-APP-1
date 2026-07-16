param(
    [switch]$NoPause,
    [switch]$NoMonitor
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$backendPath = Join-Path $projectRoot "backend"
$runtimePath = Join-Path $PSScriptRoot "runtime"
$backendHealthUrl = "http://127.0.0.1:3000/api/health"
$ngrokApiUrl = "http://127.0.0.1:4040/api/tunnels"

function Write-Step([string]$Message) {
    Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Test-Health([string]$Url, [int]$TimeoutSec = 5) {
    try {
        $response = Invoke-RestMethod $Url -TimeoutSec $TimeoutSec -Headers @{ "ngrok-skip-browser-warning" = "true" }
        return $response.success -eq $true
    } catch {
        return $false
    }
}

function Find-Ngrok {
    $command = Get-Command "ngrok.exe" -ErrorAction SilentlyContinue
    if ($command) { return $command.Source }

    $candidate = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" `
        -Recurse -Filter "ngrok.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($candidate) { return $candidate.FullName }

    throw "ngrok no esta instalado o no se encuentra en PATH."
}

New-Item -ItemType Directory -Force -Path $runtimePath | Out-Null

try {
    Write-Step "Comprobando PostgreSQL"
    $postgresServices = Get-Service | Where-Object { $_.Name -like "postgresql*" }
    if (-not $postgresServices) {
        throw "No se encontro ningun servicio PostgreSQL instalado."
    }

    foreach ($service in $postgresServices) {
        if ($service.Status -ne "Running") {
            Start-Service -Name $service.Name
            $service.WaitForStatus("Running", [TimeSpan]::FromSeconds(20))
        }
        Write-Host "PostgreSQL activo: $($service.Name)" -ForegroundColor Green
    }

    Write-Step "Comprobando el backend"
    if (-not (Test-Health $backendHealthUrl)) {
        $node = Get-Command "node.exe" -ErrorAction Stop
        $backendOut = Join-Path $runtimePath "backend-output.log"
        $backendErr = Join-Path $runtimePath "backend-error.log"
        $process = Start-Process -FilePath $node.Source `
            -ArgumentList "src/server.js" `
            -WorkingDirectory $backendPath `
            -WindowStyle Hidden `
            -RedirectStandardOutput $backendOut `
            -RedirectStandardError $backendErr `
            -PassThru
        $process.Id | Set-Content (Join-Path $runtimePath "backend.pid")

        foreach ($attempt in 1..30) {
            Start-Sleep -Seconds 1
            if (Test-Health $backendHealthUrl) { break }
        }
    }

    if (-not (Test-Health $backendHealthUrl)) {
        throw "El backend no pudo iniciar. Revise tools\remote-api\runtime\backend-error.log."
    }
    Write-Host "Backend local activo: $backendHealthUrl" -ForegroundColor Green

    Write-Step "Comprobando ngrok"
    $httpsTunnel = $null
    try {
        $httpsTunnel = (Invoke-RestMethod $ngrokApiUrl -TimeoutSec 3).tunnels |
            Where-Object { $_.proto -eq "https" } | Select-Object -First 1
    } catch {}

    if (-not $httpsTunnel) {
        $ngrok = Find-Ngrok
        $ngrokLog = Join-Path $runtimePath "ngrok.log"
        $process = Start-Process -FilePath $ngrok `
            -ArgumentList @("http", "3000", "--log", $ngrokLog, "--log-format", "json") `
            -WorkingDirectory $projectRoot `
            -WindowStyle Hidden `
            -PassThru
        $process.Id | Set-Content (Join-Path $runtimePath "ngrok.pid")

        foreach ($attempt in 1..40) {
            Start-Sleep -Seconds 1
            try {
                $httpsTunnel = (Invoke-RestMethod $ngrokApiUrl -TimeoutSec 3).tunnels |
                    Where-Object { $_.proto -eq "https" } | Select-Object -First 1
                if ($httpsTunnel) { break }
            } catch {}
        }
    }

    if (-not $httpsTunnel) {
        throw "ngrok no pudo crear el tunel HTTPS. Revise tools\remote-api\runtime\ngrok.log."
    }

    $publicUrl = $httpsTunnel.public_url.TrimEnd("/")
    $publicApiUrl = "$publicUrl/api"
    $publicUrl | Set-Content (Join-Path $runtimePath "ngrok-public-url.txt")
    Write-Host "Tunel ngrok activo: $publicUrl" -ForegroundColor Green

    Write-Step "Verificando acceso desde Internet"
    if (-not (Test-Health "$publicApiUrl/health" 15)) {
        throw "El tunel existe, pero el backend no responde desde Internet."
    }

    $expectedUrl = "https://emphasis-expanse-evolution.ngrok-free.dev"
    if ($publicUrl -ne $expectedUrl) {
        Write-Warning "La URL de ngrok no coincide con la incluida en los APK."
        Write-Warning "APK:   $expectedUrl"
        Write-Warning "Actual: $publicUrl"
        Write-Warning "Los APK requeriran actualizar su configuracion y recompilarse."
    } else {
        Write-Host "La URL coincide con la configurada en ambos APK." -ForegroundColor Green
    }

    Write-Host "`nSERVIDOR LISTO" -ForegroundColor Green
    Write-Host "Puede abrir las aplicaciones cliente y restaurante."
    Write-Host "Mantenga esta PC encendida y conectada a Internet."

    if (-not $NoMonitor) {
        $monitorScript = Join-Path $PSScriptRoot "monitor-conexion.ps1"
        $monitorPidPath = Join-Path $runtimePath "monitor.pid"
        $monitorActivo = $false
        $monitorPid = Get-Content $monitorPidPath -ErrorAction SilentlyContinue
        if ($monitorPid) {
            $monitorActivo = [bool](Get-Process -Id $monitorPid -ErrorAction SilentlyContinue)
        }

        if (-not $monitorActivo) {
            $powershell = (Get-Command "powershell.exe" -ErrorAction Stop).Source
            $monitor = Start-Process -FilePath $powershell `
                -ArgumentList @(
                    "-NoProfile",
                    "-ExecutionPolicy", "Bypass",
                    "-File", "`"$monitorScript`""
                ) `
                -WindowStyle Hidden `
                -PassThru
            $monitor.Id | Set-Content $monitorPidPath
            Write-Host "Monitor de reconexion automatica activo." -ForegroundColor Green
        } else {
            Write-Host "El monitor de reconexion ya estaba activo." -ForegroundColor Green
        }
    }
} catch {
    Write-Host "`nERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "No cierre esta ventana hasta leer el mensaje anterior."
    if (-not $NoPause) { Read-Host "Presione Enter para salir" }
    exit 1
}

if (-not $NoPause) {
    Read-Host "`nPresione Enter para cerrar esta ventana (los servicios seguiran activos)"
}
