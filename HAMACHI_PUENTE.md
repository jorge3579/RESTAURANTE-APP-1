# Puente Hamachi para SmartRestaurantQR

Esta configuracion permite que celulares conectados al hotspot Wi-Fi de una PC
remota alcancen el backend que se ejecuta en la PC servidor.

```text
Celular -> hotspot PC remota -> proxy TCP -> Hamachi -> backend -> PostgreSQL local
```

PostgreSQL no se publica. El backend del servidor conserva `DB_HOST=127.0.0.1`.

## PC servidor

1. Instalar Hamachi y crear la red privada `SmartRestaurantQR-Privada-Jorge`.
2. Confirmar la IPv4 Hamachi del servidor: `25.3.143.139`.
3. Iniciar el backend en el puerto 3000 y comprobar `/api/health`.
4. Autorizar el puerto 3000 en el firewall solo para la PC remota de Hamachi.

## PC remota Windows 10

1. Instalar Hamachi y unirla a `SmartRestaurantQR-Privada-Jorge`.
2. Confirmar que puede alcanzar la IP Hamachi del servidor.
3. Activar **Configuracion > Red e Internet > Zona con cobertura inalambrica movil**.
4. Conectar un celular al hotspot y ejecutar `ipconfig` para identificar la IPv4
   del adaptador del hotspot. Normalmente es `192.168.137.1`, pero debe verificarse.
5. Copiar la carpeta `tools/network` a la PC remota.
6. Abrir PowerShell como administrador y ejecutar:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
./configurar-puente-hamachi.ps1 `
  -IpHamachiServidor 25.3.143.139 `
  -IpHotspot 192.168.0.5
```

Sustituir ambas IP por los valores reales.

## Prueba desde el celular

Con el celular conectado al hotspot, abrir:

```text
http://IP_HOTSPOT:3000/api/health
```

Las aplicaciones usan las siguientes variables durante la compilacion:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.5:3000/api
EXPO_PUBLIC_SOCKET_URL=http://192.168.0.5:3000
```

Este esquema es privado y depende de que ambas computadoras y Hamachi permanezcan
encendidos. No funciona cuando el celular abandona el hotspot de la PC remota.

## Deshacer el puente

En PowerShell como administrador:

```powershell
./eliminar-puente-hamachi.ps1 -IpHotspot 192.168.0.5
```
