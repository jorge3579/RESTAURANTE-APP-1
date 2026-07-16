$ErrorActionPreference = "Stop"
$binPath = Join-Path $PSScriptRoot "bin"
$destination = Join-Path $binPath "cloudflared.exe"
$downloadUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"

New-Item -ItemType Directory -Force -Path $binPath | Out-Null
Write-Host "Descargando cloudflared oficial..."
Invoke-WebRequest -Uri $downloadUrl -OutFile $destination

& $destination --version
Write-Host "cloudflared instalado en $destination"

