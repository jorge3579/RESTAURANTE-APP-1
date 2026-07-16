$ErrorActionPreference = "Stop"
$processFile = Join-Path $PSScriptRoot "runtime\processes.json"

if (-not (Test-Path -LiteralPath $processFile)) {
    Write-Host "No hay procesos registrados."
    exit 0
}

$processes = Get-Content -LiteralPath $processFile | ConvertFrom-Json

foreach ($processId in @($processes.TunnelPid, $processes.BackendPid)) {
    if ($processId) {
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }
}

Remove-Item -LiteralPath $processFile -Force
Write-Host "API publica detenida."

