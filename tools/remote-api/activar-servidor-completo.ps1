param(
    [switch]$NoPause,
    [switch]$NoMonitor
)

$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$backendPath = Join-Path $projectRoot "backend"
$stockRoot = Join-Path $projectRoot "stock restaurante\stock restaurante app\StockSmartRestaurantQR"
$stockLauncher = Join-Path $stockRoot "INICIAR-APLICACION.cmd"
$runtimePath = Join-Path $PSScriptRoot "runtime"
$backendHealthUrl = "http://127.0.0.1:3000/api/health"
$backendStockUrl = "http://127.0.0.1:3000/stock/"
$backendStockLoginUrl = "http://127.0.0.1:3000/stock/auth/login"
$stockLocalUrl = "http://127.0.0.1:5050/stock/"
$stockLocalLoginUrl = "http://127.0.0.1:5050/stock/auth/login"
$ngrokApiUrl = "http://127.0.0.1:4040/api/tunnels"
$expectedUrl = "https://emphasis-expanse-evolution.ngrok-free.dev"

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

function Test-Web([string]$Url, [int]$TimeoutSec = 5) {
    try {
        $response = Invoke-WebRequest $Url -UseBasicParsing -MaximumRedirection 5 -TimeoutSec $TimeoutSec `
            -Headers @{ "ngrok-skip-browser-warning" = "smartrestaurantqr" }
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 400
    } catch {
        return $false
    }
}

function Test-StockLoginRoute([string]$Url, [int]$TimeoutSec = 5) {
    try {
        $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
        $session.UserAgent = "SmartRestaurantQR-Reconnect/1.0"
        $loginUrl = $Url -replace "/auth/login$", "/login"
        $login = Invoke-WebRequest $loginUrl -WebSession $session -UseBasicParsing `
            -TimeoutSec $TimeoutSec -Headers @{ "ngrok-skip-browser-warning" = "smartrestaurantqr" }
        $token = [regex]::Match(
            $login.Content,
            'name="__RequestVerificationToken"[^>]*value="([^"]+)"'
        ).Groups[1].Value
        if (-not $token) { return $false }

        $response = Invoke-WebRequest $Url -Method Post -WebSession $session -UseBasicParsing `
            -MaximumRedirection 5 -TimeoutSec $TimeoutSec `
            -Headers @{ "ngrok-skip-browser-warning" = "smartrestaurantqr" } `
            -ContentType "application/x-www-form-urlencoded" `
            -Body @{
                Username = "healthcheck"
                Password = "healthcheck"
                __RequestVerificationToken = $token
            }
        return $response.StatusCode -eq 200 -and $response.BaseResponse.ResponseUri.Query -match "error=1"
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

    Write-Step "Comprobando MariaDB y MongoDB para Stock"
    $stockDatabaseServices = Get-Service -ErrorAction SilentlyContinue | Where-Object {
        $_.Name -match "maria|mysql|mongo" -or $_.DisplayName -match "MariaDB|MySQL|MongoDB"
    }
    foreach ($service in $stockDatabaseServices) {
        if ($service.Status -ne "Running") {
            Start-Service -Name $service.Name
            $service.WaitForStatus("Running", [TimeSpan]::FromSeconds(20))
        }
        Write-Host "Servicio de Stock activo: $($service.Name)" -ForegroundColor Green
    }

    Write-Step "Comprobando la aplicacion de Stock"
    if (-not (Test-Web $stockLocalUrl) -or -not (Test-StockLoginRoute $stockLocalLoginUrl)) {
        if (-not (Test-Path -LiteralPath $stockLauncher)) {
            throw "No se encontro el iniciador oficial de Stock: $stockLauncher"
        }

        $stockOut = Join-Path $runtimePath "stock-output.log"
        $stockErr = Join-Path $runtimePath "stock-error.log"
        $process = Start-Process -FilePath $env:ComSpec `
            -ArgumentList @("/d", "/c", "`"$stockLauncher`"") `
            -WorkingDirectory $stockRoot `
            -WindowStyle Hidden `
            -RedirectStandardOutput $stockOut `
            -RedirectStandardError $stockErr `
            -PassThru
        $process.Id | Set-Content (Join-Path $runtimePath "stock.pid")

        foreach ($attempt in 1..60) {
            Start-Sleep -Seconds 1
            if ((Test-Web $stockLocalUrl) -and (Test-StockLoginRoute $stockLocalLoginUrl)) { break }
        }
    }

    if (-not (Test-Web $stockLocalUrl) -or -not (Test-StockLoginRoute $stockLocalLoginUrl)) {
        throw "Stock no pudo iniciar. Revise tools\remote-api\runtime\stock-error.log."
    }
    Write-Host "Stock local activo: $stockLocalUrl" -ForegroundColor Green

    Write-Step "Comprobando el backend"
    $backendNeedsStart = -not (Test-Health $backendHealthUrl) -or
        -not (Test-Web $backendStockUrl) -or
        -not (Test-StockLoginRoute $backendStockLoginUrl)
    if ($backendNeedsStart) {
        $listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
            Select-Object -First 1
        if ($listener) {
            Write-Host "Reiniciando el backend para aplicar la configuracion actual..." -ForegroundColor Yellow
            Stop-Process -Id $listener.OwningProcess -Force -ErrorAction Stop
            Start-Sleep -Seconds 2
        }

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
    if (-not (Test-Web $backendStockUrl)) {
        throw "El backend inicio, pero no publico Stock en /stock/."
    }
    if (-not (Test-StockLoginRoute $backendStockLoginUrl)) {
        throw "El backend publico Stock, pero no reenvia correctamente el inicio de sesion."
    }
    Write-Host "Backend local activo: $backendHealthUrl" -ForegroundColor Green

    Write-Step "Comprobando ngrok"
    $httpsTunnel = $null
    try {
        $httpsTunnel = (Invoke-RestMethod $ngrokApiUrl -TimeoutSec 3).tunnels |
            Where-Object { $_.proto -eq "https" } | Select-Object -First 1
    } catch {}

    if ($httpsTunnel -and $httpsTunnel.public_url.TrimEnd("/") -ne $expectedUrl) {
        Write-Host "Reemplazando un tunel ngrok con URL incompatible con los APK..." -ForegroundColor Yellow
        $oldPid = Get-Content (Join-Path $runtimePath "ngrok.pid") -ErrorAction SilentlyContinue
        if ($oldPid) { Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue }
        $httpsTunnel = $null
        Start-Sleep -Seconds 2
    }

    if (-not $httpsTunnel) {
        $ngrok = Find-Ngrok
        $ngrokLog = Join-Path $runtimePath "ngrok.log"
        $process = Start-Process -FilePath $ngrok `
            -ArgumentList @("http", "3000", "--url", $expectedUrl, "--log", $ngrokLog, "--log-format", "json") `
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

    if (-not (Test-Web "$publicUrl/stock/" 20)) {
        throw "El tunel responde, pero Stock no esta accesible en $publicUrl/stock/."
    }
    if (-not (Test-StockLoginRoute "$publicUrl/stock/auth/login" 20)) {
        throw "El tunel abre Stock, pero no reenvia correctamente su inicio de sesion."
    }
    Write-Host "Stock publico activo: $publicUrl/stock/" -ForegroundColor Green

    if ($publicUrl -ne $expectedUrl) {
        throw "ngrok publico $publicUrl, pero los APK requieren $expectedUrl."
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
