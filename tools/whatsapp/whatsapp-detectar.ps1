# Detecta si llego un mensaje nuevo en el chat de consultas de WhatsApp.
# Uso: powershell -ExecutionPolicy Bypass -File whatsapp-detectar.ps1 [-Forzar]
#
# Compara los pixeles reales de la zona de mensajes contra la captura previa.
# No compara el archivo PNG completo porque su codificacion puede variar
# aunque la imagen sea identica. Ignora el encabezado (reloj y estado) y el
# cuadro de escritura (cursor parpadeante).
# Devuelve exit 0 cuando hay una novedad real.

param(
    [switch]$Forzar,
    [int]$UmbralPixeles = 4000
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$runtime = Join-Path $PSScriptRoot "runtime"
New-Item -ItemType Directory -Force -Path $runtime | Out-Null

$zonaPrevia = Join-Path $runtime "zona-previa.png"
$deteccion = Join-Path $runtime "deteccion.log"

function Registrar([string]$mensaje) {
    $linea = "{0}  {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $mensaje
    Add-Content -Path $deteccion -Value $linea
}

# Captura completa del chat.
$capturar = Join-Path $PSScriptRoot "whatsapp-capturar.ps1"
& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $capturar | Out-Null

$completa = Join-Path $runtime "chat-actual.png"
if (-not (Test-Path $completa)) {
    Registrar "No se pudo capturar el chat."
    exit 2
}

# Recorta la zona de mensajes.
$origen = [System.Drawing.Bitmap]::FromFile((Resolve-Path $completa).Path)
$y0 = [int]($origen.Height * 0.12)
$altoZona = [int]($origen.Height * 0.76)
$ancho = $origen.Width

$zona = New-Object System.Drawing.Bitmap($ancho, $altoZona)
$grafico = [System.Drawing.Graphics]::FromImage($zona)
$rectOrigen = New-Object System.Drawing.Rectangle(0, $y0, $ancho, $altoZona)
$rectDestino = New-Object System.Drawing.Rectangle(0, 0, $ancho, $altoZona)
$grafico.DrawImage($origen, $rectDestino, $rectOrigen, [System.Drawing.GraphicsUnit]::Pixel)
$grafico.Dispose()
$origen.Dispose()

function CompararPixeles($actual, $previa) {
    if ($null -eq $previa) { return -1 }
    if ($actual.Width -ne $previa.Width -or $actual.Height -ne $previa.Height) { return -1 }

    $distintos = 0
    $step = 3
    for ($y = 0; $y -lt $actual.Height; $y += $step) {
        for ($x = 0; $x -lt $actual.Width; $x += $step) {
            if ($actual.GetPixel($x, $y).ToArgb() -ne $previa.GetPixel($x, $y).ToArgb()) {
                $distintos++
            }
        }
    }
    return $distintos
}

# Carga la referencia previa en memoria y la libera de inmediato, para que
# el archivo quede disponible al guardar la nueva referencia.
$previa = $null
if (Test-Path $zonaPrevia) {
    try {
        $temporal = [System.Drawing.Bitmap]::FromFile((Resolve-Path $zonaPrevia).Path)
        $previa = New-Object System.Drawing.Bitmap($temporal.Width, $temporal.Height)
        $copia = [System.Drawing.Graphics]::FromImage($previa)
        $copia.DrawImage($temporal, 0, 0, $temporal.Width, $temporal.Height)
        $copia.Dispose()
        $temporal.Dispose()
    } catch {
        $previa = $null
    }
}

$distintos = CompararPixeles $zona $previa

# Guarda la zona actual como referencia para la proxima comparacion.
$zona.Save($zonaPrevia, [System.Drawing.Imaging.ImageFormat]::Png)

if ($null -ne $previa) { $previa.Dispose() }
$zona.Dispose()

if ($distintos -lt 0) {
    Registrar "Primera referencia guardada."
    exit 1
}

if ($Forzar -or $distintos -ge $UmbralPixeles) {
    Copy-Item $completa (Join-Path $runtime "chat-nuevo.png") -Force
    Registrar "Novedad detectada: $distintos pixeles distintos."
    Write-Output "NUEVO ($distintos pixeles)"
    exit 0
}

Registrar "Sin novedades ($distintos pixeles distintos)."
exit 1
