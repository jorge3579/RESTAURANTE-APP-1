param(
    [int]$Port = 3000,
    [string]$PublicUrl = "https://emphasis-expanse-evolution.ngrok-free.dev"
)

$ErrorActionPreference = "Stop"
$runtimePath = Join-Path $PSScriptRoot "runtime"
$ngrok = Get-Command "ngrok.exe" -ErrorAction SilentlyContinue

if (-not $ngrok) {
    $ngrok = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" `
        -Recurse -Filter "ngrok.exe" -ErrorAction Stop | Select-Object -First 1
}

New-Item -ItemType Directory -Force -Path $runtimePath | Out-Null

try {
    Invoke-RestMethod "http://127.0.0.1:$Port/api/health" -TimeoutSec 5 | Out-Null
} catch {
    throw "El backend no responde en el puerto $Port. Inicie primero el backend."
}

$oldPid = Get-Content (Join-Path $runtimePath "ngrok.pid") -ErrorAction SilentlyContinue
if ($oldPid) {
    Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue
}

$logPath = Join-Path $runtimePath "ngrok.log"
Remove-Item -LiteralPath $logPath -Force -ErrorAction SilentlyContinue

$process = Start-Process -FilePath $ngrok.FullName `
    -ArgumentList @("http", $Port, "--url", $PublicUrl, "--log", $logPath, "--log-format", "json") `
    -WindowStyle Hidden -PassThru
$process.Id | Set-Content (Join-Path $runtimePath "ngrok.pid")

$httpsTunnel = $null
foreach ($attempt in 1..30) {
    Start-Sleep -Seconds 1
    try {
        $tunnels = Invoke-RestMethod "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 3
        $httpsTunnel = $tunnels.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1
        if ($httpsTunnel) { break }
    } catch {}
}

if (-not $httpsTunnel) {
    throw "ngrok no creo el endpoint HTTPS. Revise $logPath."
}

$httpsTunnel.public_url | Set-Content (Join-Path $runtimePath "ngrok-public-url.txt")
Write-Host "API: $($httpsTunnel.public_url)/api" -ForegroundColor Green
Write-Host "Socket: $($httpsTunnel.public_url)"
Write-Host "Stock: $($httpsTunnel.public_url)/stock/"

