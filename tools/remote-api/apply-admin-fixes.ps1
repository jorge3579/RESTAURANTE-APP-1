# Aplica los cambios de seguridad que requieren privilegios de administrador.
# Ejecutado una sola vez mediante UAC. Registra todo en apply-fixes.log.

$ErrorActionPreference = "Stop"

$runtime = "D:\RESTAURANTE-APP-1\tools\remote-api\runtime"
$backend = "D:\RESTAURANTE-APP-1\backend"
$log = Join-Path $runtime "apply-fixes.log"

if (-not (Test-Path $runtime)) {
    New-Item -ItemType Directory -Force -Path $runtime | Out-Null
}

function Log([string]$mensaje) {
    $linea = "{0}  {1}" -f (Get-Date -Format "HH:mm:ss"), $mensaje
    Write-Host $linea
    Add-Content -Path $log -Value $linea
}

Log "=== Aplicando cambios de seguridad ==="

# 1. PostgreSQL: aplicar listen_addresses = localhost (ya editado en postgresql.conf)
try {
    Log "Estado PostgreSQL antes: $((Get-Service postgresql-x64-18).Status)"
    Restart-Service -Name "postgresql-x64-18" -Force
    (Get-Service postgresql-x64-18).WaitForStatus("Running", [TimeSpan]::FromSeconds(60))
    Start-Sleep -Seconds 4
    Log "PostgreSQL reiniciado: $((Get-Service postgresql-x64-18).Status)"
} catch {
    Log "ERROR al reiniciar PostgreSQL: $($_.Exception.Message)"
}

# 2. Backend: reiniciar para que tome el nuevo CORS
try {
    $listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue |
        Select-Object -First 1

    if ($listener) {
        Log "Deteniendo backend PID $($listener.OwningProcess)"
        Stop-Process -Id $listener.OwningProcess -Force
        Start-Sleep -Seconds 3
    }

    $node = (Get-Command "node.exe" -ErrorAction Stop).Source
    $proceso = Start-Process -FilePath $node `
        -ArgumentList "src/server.js" `
        -WorkingDirectory $backend `
        -WindowStyle Hidden `
        -RedirectStandardOutput (Join-Path $runtime "backend-output.log") `
        -RedirectStandardError (Join-Path $runtime "backend-error.log") `
        -PassThru

    $proceso.Id | Set-Content (Join-Path $runtime "backend.pid")
    Log "Backend iniciado con PID $($proceso.Id)"
} catch {
    Log "ERROR al reiniciar el backend: $($_.Exception.Message)"
}

# 3. Verificaciones
$salud = $false
foreach ($intento in 1..40) {
    Start-Sleep -Seconds 1
    try {
        $r = Invoke-RestMethod "http://127.0.0.1:3000/api/health" -TimeoutSec 3
        if ($r.success) { $salud = $true; break }
    } catch {}
}
Log "Backend health: $salud"

try {
    $permitido = (Invoke-WebRequest "http://127.0.0.1:3000/api/health" -UseBasicParsing -TimeoutSec 5 `
        -Headers @{ "Origin" = "https://emphasis-expanse-evolution.ngrok-free.dev" }).Headers["Access-Control-Allow-Origin"]
    Log "CORS origen PERMITIDO -> [$permitido]"
} catch { Log "No se pudo probar el origen permitido" }

try {
    $denegado = (Invoke-WebRequest "http://127.0.0.1:3000/api/health" -UseBasicParsing -TimeoutSec 5 `
        -Headers @{ "Origin" = "https://sitio-malicioso.example" }).Headers["Access-Control-Allow-Origin"]
    Log "CORS origen DENEGADO -> [$denegado]  (vacio = correcto)"
} catch { Log "No se pudo probar el origen denegado" }

try {
    $sinOrigen = (Invoke-WebRequest "http://127.0.0.1:3000/api/health" -UseBasicParsing -TimeoutSec 5).StatusCode
    Log "Sin Origin (apps moviles) -> HTTP $sinOrigen"
} catch { Log "Fallo la prueba sin Origin" }

$puertos = Get-NetTCPConnection -LocalPort 5432 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty LocalAddress -Unique
Log "5432 escucha en: $($puertos -join ', ')  (solo 127.0.0.1 y ::1 = correcto)"

try {
    $publico = Invoke-RestMethod "https://emphasis-expanse-evolution.ngrok-free.dev/api/health" `
        -TimeoutSec 20 -Headers @{ "ngrok-skip-browser-warning" = "true" }
    Log "API publica desde Internet: $($publico.data.status)"
} catch {
    Log "ADVERTENCIA: la API publica no respondio: $($_.Exception.Message)"
}

Log "=== COMPLETADO ==="
