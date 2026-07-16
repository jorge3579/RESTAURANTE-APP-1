# API publica sin exponer PostgreSQL

La arquitectura utiliza el backend Express existente:

```text
Apps Android -> HTTPS de Cloudflare -> localhost:3000 -> PostgreSQL localhost:5432
```

El puerto 5432 no debe abrirse en el router ni en el firewall.

## Opcion estable: ngrok

Con ngrok instalado y autenticado:

```powershell
.\tools\remote-api\start-ngrok-api.ps1
```

Para detener solamente el tunel:

```powershell
.\tools\remote-api\stop-ngrok-api.ps1
```

El dominio asignado queda guardado en
`tools/remote-api/runtime/ngrok-public-url.txt`.

## Primera instalacion

Desde PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\tools\remote-api\install-cloudflared.ps1
```

## Iniciar la API publica

PostgreSQL debe estar funcionando y el backend debe tener su configuracion local valida.

```powershell
.\tools\remote-api\start-public-api.ps1
```

El comando muestra dos valores:

- `API`: usar como `EXPO_PUBLIC_API_URL`.
- `Socket`: usar como `EXPO_PUBLIC_SOCKET_URL`.

La URL tambien queda en `tools/remote-api/runtime/public-api-url.txt`.

## Detener

```powershell
.\tools\remote-api\stop-public-api.ps1
```

## Limitacion

El tunel rapido no requiere dominio ni cuenta, pero genera una URL distinta al reiniciarse.
Las APK compiladas con una URL anterior deben recompilarse cuando la URL cambie.
Para conservar una URL estable sin comprar dominio se necesita una cuenta gratuita de un
proveedor que asigne un hostname persistente, por ejemplo ngrok o Tailscale Funnel.
