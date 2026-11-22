# Envia un mensaje por WhatsApp Desktop al chat propio (canal de consultas).
# Uso: powershell -ExecutionPolicy Bypass -File whatsapp-enviar.ps1 -Mensaje "texto"
#
# Requisitos: WhatsApp Desktop abierto con el chat propio seleccionado.
# El script ubica la ventana, la enfoca, escribe en el cuadro de mensaje
# y pulsa Enter para enviar.

param(
    [Parameter(Mandatory = $true)]
    [string]$Mensaje,
    [switch]$NoEnviar
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

Add-Type @"
using System;
using System.Text;
using System.Runtime.InteropServices;
public class WaVentana {
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc cb, IntPtr l);
    public delegate bool EnumWindowsProc(IntPtr h, IntPtr l);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowTextW(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
    [DllImport("user32.dll")] public static extern void mouse_event(uint f, uint dx, uint dy, uint d, IntPtr e);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
    public const uint MOUSE_DOWN = 0x02;
    public const uint MOUSE_UP = 0x04;
    public struct RECT { public int Left, Top, Right, Bottom; }
}
"@ -ErrorAction SilentlyContinue

function Buscar-VentanaWhatsApp {
    $script:handleWa = [IntPtr]::Zero
    $callback = [WaVentana+EnumWindowsProc]{
        param($h, $l)
        if ([WaVentana]::IsWindowVisible($h)) {
            $buffer = New-Object System.Text.StringBuilder 256
            [void][WaVentana]::GetWindowTextW($h, $buffer, 256)
            if ($buffer.ToString() -eq "WhatsApp") {
                $script:handleWa = $h
                return $false
            }
        }
        return $true
    }
    [void][WaVentana]::EnumWindows($callback, [IntPtr]::Zero)
    return $script:handleWa
}

function ClicEn([int]$x, [int]$y) {
    [void][WaVentana]::SetCursorPos($x, $y)
    Start-Sleep -Milliseconds 250
    [WaVentana]::mouse_event([WaVentana]::MOUSE_DOWN, 0, 0, 0, [IntPtr]::Zero)
    Start-Sleep -Milliseconds 90
    [WaVentana]::mouse_event([WaVentana]::MOUSE_UP, 0, 0, 0, [IntPtr]::Zero)
    Start-Sleep -Milliseconds 500
}

$handle = Buscar-VentanaWhatsApp
if ($handle -eq [IntPtr]::Zero) {
    Write-Error "No se encontro la ventana de WhatsApp Desktop."
    exit 1
}

$rect = New-Object WaVentana+RECT
[void][WaVentana]::GetWindowRect($handle, [ref]$rect)
$ancho = $rect.Right - $rect.Left
$alto = $rect.Bottom - $rect.Top

[void][WaVentana]::ShowWindow($handle, 9)
[void][WaVentana]::SetForegroundWindow($handle)
Start-Sleep -Milliseconds 700

# El cuadro de mensaje esta en la franja inferior derecha de la ventana.
$cuadroX = $rect.Left + [int]($ancho * 0.60)
$cuadroY = $rect.Top + [int]($alto * 0.955)
ClicEn $cuadroX $cuadroY

# Limpia cualquier borrador previo y escribe el mensaje.
# SendKeys interpreta como comandos los caracteres ( ) { } [ ] + ^ % ~ y
# demas, por eso se usa el portapapeles y Ctrl+V en lugar de escribir letra
# por letra: asi el texto llega literal, con cualquier signo, tilde o emoji.
[System.Windows.Forms.SendKeys]::SendWait("^a")
Start-Sleep -Milliseconds 200
[System.Windows.Forms.SendKeys]::SendWait("{DEL}")
Start-Sleep -Milliseconds 200

$anteriorPortapapeles = $null
try { $anteriorPortapapeles = [System.Windows.Forms.Clipboard]::GetText() } catch {}

[System.Windows.Forms.Clipboard]::SetText($Mensaje)
Start-Sleep -Milliseconds 300
[System.Windows.Forms.SendKeys]::SendWait("^v")
Start-Sleep -Milliseconds 1200

if ($NoEnviar) {
    Write-Host "Mensaje escrito sin enviar (-NoEnviar)."
    exit 0
}

[System.Windows.Forms.SendKeys]::SendWait("{ENTER}")
Start-Sleep -Milliseconds 1500

Write-Host "Mensaje enviado."

# Refresca la referencia del detector: asi el propio mensaje enviado no se
# reporta como una novedad en la proxima revision.
$detectar = Join-Path $PSScriptRoot "whatsapp-detectar.ps1"
if (Test-Path $detectar) {
    & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $detectar | Out-Null
}

exit 0
