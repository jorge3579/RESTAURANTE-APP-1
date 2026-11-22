# Captura la conversacion de WhatsApp Desktop para leer respuestas.
# Uso: powershell -ExecutionPolicy Bypass -File whatsapp-capturar.ps1 [-Salida ruta.png]
#
# Guarda una imagen del area de mensajes. Por defecto escribe en
# tools\whatsapp\runtime\chat-actual.png y conserva la captura anterior
# como chat-anterior.png para detectar si llego algo nuevo.

param(
    [string]$Salida = "",
    [switch]$SinHistorial
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

Add-Type @"
using System;
using System.Text;
using System.Runtime.InteropServices;
public class WaCaptura {
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc cb, IntPtr l);
    public delegate bool EnumWindowsProc(IntPtr h, IntPtr l);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowTextW(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
    public struct RECT { public int Left, Top, Right, Bottom; }
}
"@ -ErrorAction SilentlyContinue

$runtime = Join-Path $PSScriptRoot "runtime"
New-Item -ItemType Directory -Force -Path $runtime | Out-Null

if ([string]::IsNullOrWhiteSpace($Salida)) {
    $Salida = Join-Path $runtime "chat-actual.png"
}

$script:handleWa = [IntPtr]::Zero
$callback = [WaCaptura+EnumWindowsProc]{
    param($h, $l)
    if ([WaCaptura]::IsWindowVisible($h)) {
        $buffer = New-Object System.Text.StringBuilder 256
        [void][WaCaptura]::GetWindowTextW($h, $buffer, 256)
        if ($buffer.ToString() -eq "WhatsApp") {
            $script:handleWa = $h
            return $false
        }
    }
    return $true
}
[void][WaCaptura]::EnumWindows($callback, [IntPtr]::Zero)

if ($script:handleWa -eq [IntPtr]::Zero) {
    Write-Error "No se encontro la ventana de WhatsApp Desktop."
    exit 1
}

$rect = New-Object WaCaptura+RECT
[void][WaCaptura]::GetWindowRect($script:handleWa, [ref]$rect)

[void][WaCaptura]::ShowWindow($script:handleWa, 9)
[void][WaCaptura]::SetForegroundWindow($script:handleWa)
Start-Sleep -Milliseconds 600

# Solo el panel derecho (mensajes), sin la lista de chats.
$ancho = $rect.Right - $rect.Left
$alto = $rect.Bottom - $rect.Top
$x = $rect.Left + [int]($ancho * 0.405)
$y = $rect.Top + [int]($alto * 0.055)
$anchoPanel = $ancho - [int]($ancho * 0.405)
$altoPanel = $alto - [int]($alto * 0.115)

# Conserva la captura previa para comparar.
$anterior = Join-Path $runtime "chat-anterior.png"
if ((Test-Path $Salida) -and -not $SinHistorial) {
    Copy-Item $Salida $anterior -Force
}

$bitmap = New-Object System.Drawing.Bitmap($anchoPanel, $altoPanel)
$grafico = [System.Drawing.Graphics]::FromImage($bitmap)
$grafico.CopyFromScreen($x, $y, 0, 0, $bitmap.Size)
$bitmap.Save($Salida, [System.Drawing.Imaging.ImageFormat]::Png)
$grafico.Dispose()
$bitmap.Dispose()

Write-Host "Captura guardada: $Salida"
Write-Host "Dimensiones: ${anchoPanel}x${altoPanel}"
Write-Output $Salida
exit 0
