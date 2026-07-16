$pidPath = Join-Path $PSScriptRoot "runtime\ngrok.pid"
$ngrokPid = Get-Content $pidPath -ErrorAction SilentlyContinue
if ($ngrokPid) {
    Stop-Process -Id $ngrokPid -Force -ErrorAction SilentlyContinue
    Remove-Item -LiteralPath $pidPath -Force -ErrorAction SilentlyContinue
}
Write-Host "Tunel ngrok detenido."

