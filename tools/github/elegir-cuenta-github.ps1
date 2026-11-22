# Selecciona la cuenta jorge3579 en el dialogo "Select an account" de
# Git Credential Manager y pulsa Continue.
# Uso: powershell -ExecutionPolicy Bypass -File elegir-cuenta-github.ps1
#      [-Cuenta "jorge3579"] [-TimeoutSegundos 30] [-Silencioso]

param(
    [string]$Cuenta = "jorge3579",
    [int]$TimeoutSegundos = 30,
    [switch]$Silencioso
)

$ErrorActionPreference = "Stop"

Add-Type -AssemblyName UIAutomationClient, UIAutomationTypes

Add-Type @"
using System;
using System.Text;
using System.Runtime.InteropServices;
public class VentanaGitHub {
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc cb, IntPtr l);
    public delegate bool EnumWindowsProc(IntPtr h, IntPtr l);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll", CharSet=CharSet.Unicode)] public static extern int GetWindowTextW(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
}
"@ -ErrorAction SilentlyContinue

function Escribir([string]$Mensaje) {
    if (-not $Silencioso) { Write-Host $Mensaje }
}

# Busca la ventana del selector de cuentas de Git Credential Manager.
function Buscar-VentanaSelector {
    $encontrada = [IntPtr]::Zero
    $callback = [VentanaGitHub+EnumWindowsProc]{
        param($h, $l)
        if ([VentanaGitHub]::IsWindowVisible($h)) {
            $buffer = New-Object System.Text.StringBuilder 256
            [void][VentanaGitHub]::GetWindowTextW($h, $buffer, 256)
            if ($buffer.ToString() -eq "Select an account") {
                $script:encontrada = $h
                return $false
            }
        }
        return $true
    }
    [void][VentanaGitHub]::EnumWindows($callback, [IntPtr]::Zero)
    return $encontrada
}

$limite = (Get-Date).AddSeconds($TimeoutSegundos)
$ventana = [IntPtr]::Zero

while ((Get-Date) -lt $limite -and $ventana -eq [IntPtr]::Zero) {
    $ventana = Buscar-VentanaSelector
    if ($ventana -eq [IntPtr]::Zero) { Start-Sleep -Milliseconds 500 }
}

if ($ventana -eq [IntPtr]::Zero) {
    Escribir "No aparecio el dialogo 'Select an account'."
    exit 1
}

Escribir "Dialogo detectado (handle $ventana)."
[void][VentanaGitHub]::SetForegroundWindow($ventana)
Start-Sleep -Milliseconds 400

$raiz = [System.Windows.Automation.AutomationElement]::FromHandle($ventana)
$condicion = New-Object System.Windows.Automation.PropertyCondition(
    [System.Windows.Automation.AutomationElement]::IsControlElementProperty, $true
)
$elementos = $raiz.FindAll([System.Windows.Automation.TreeScope]::Descendants, $condicion)

# Localiza el elemento de texto cuyo nombre es la cuenta pedida.
$objetivo = $null
foreach ($elemento in $elementos) {
    if ($elemento.Current.ControlType.ProgrammaticName -eq "ControlType.Text" -and
        $elemento.Current.Name -eq $Cuenta) {
        $objetivo = $elemento
        break
    }
}

if (-not $objetivo) {
    Escribir "No se encontro la cuenta '$Cuenta' en el dialogo."
    exit 1
}

# El clic se hace sobre el contenedor (ListItem) para activar la seleccion.
$padre = [System.Windows.Automation.TreeWalker]::ControlViewWalker.GetParent($objetivo)
if ($padre -and $padre.Current.ControlType.ProgrammaticName -eq "ControlType.ListItem") {
    $clic = $padre.GetCurrentPattern([System.Windows.Automation.SelectionItemPattern]::Pattern)
    $clic.Select()
} else {
    $clic = $objetivo.GetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern)
    $clic.Invoke()
}

Escribir "Cuenta '$Cuenta' seleccionada."
Start-Sleep -Milliseconds 600

# Pulsa Continue, que se habilita tras seleccionar la cuenta.
$boton = $null
$elementos = $raiz.FindAll([System.Windows.Automation.TreeScope]::Descendants, $condicion)
foreach ($elemento in $elementos) {
    if ($elemento.Current.ControlType.ProgrammaticName -eq "ControlType.Button" -and
        $elemento.Current.Name -eq "Continue") {
        $boton = $elemento
        break
    }
}

if (-not $boton) {
    Escribir "No se encontro el boton Continue."
    exit 1
}

if (-not $boton.Current.IsEnabled) {
    Start-Sleep -Milliseconds 800
}

if ($boton.Current.IsEnabled) {
    $invocar = $boton.GetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern)
    $invocar.Invoke()
    Escribir "Continue pulsado. Autenticacion completada."
    exit 0
}

Escribir "El boton Continue sigue deshabilitado."
exit 1
