# Limpieza de secretos y rotación de credenciales

Fecha: 22 de noviembre de 2026.

## 1. Secretos eliminados del historial de Git — completado

### Situación encontrada

El repositorio tenía archivos con credenciales en commits antiguos del historial
local:

| Archivo | Contenido | Riesgo |
| --- | --- | --- |
| `password postgres.txt` | Contraseña de PostgreSQL | Alto |
| `sql data.txt` | Datos de conexión | Medio |

**Dato importante:** el historial **publicado en GitHub nunca los contuvo**.
Solo existían en dos referencias locales: la rama `github-master` y el tag
`respaldo-pre-reformas-20261122`.

### Qué se hizo

1. Se verificó que el respaldo `historial-local-completo.bundle` (479 MB) contenía
   ambos commits, antes de tocar nada.
2. Se eliminaron el tag `respaldo-pre-reformas-20261122` y la rama `github-master`.
3. Se expiró el reflog y se ejecutó `git gc --prune=now` para purgar los objetos
   inalcanzables.

### Resultado

- **Ninguna rama ni tag contiene ya los secretos.** Verificado recorriendo todo
  el historial alcanzable con `git rev-list --all`.
- El repositorio pasó de **708.63 MiB a 129.23 MiB** de pack: se eliminaron
  también los blobs del instalador de PostgreSQL de 358 MB que estaba commiteado.
- `git fsck` no reporta errores de integridad.
- La rama `main` sigue sincronizada con `origin/main`.

### Respaldo

El historial anterior completo, incluidos los commits con secretos, quedó
guardado en:

```
_archivo-depuracion-20261122/git/historial-local-completo.bundle
```

Ese archivo está excluido del repositorio por `.gitignore`. **Conviene borrarlo
o moverlo a un almacenamiento cifrado** una vez confirmado que no hace falta,
porque contiene las credenciales antiguas.

## 2. Rotación del token de ngrok — completado

### Situación

El `authtoken` de ngrok estaba en texto plano en `%LOCALAPPDATA%\ngrok\ngrok.yml`.
Ya se movió a la variable de entorno de usuario `NGROK_AUTHTOKEN`, y el archivo
`ngrok.yml` quedó solo con `version: "2"`.

Se verificó que el token **no quedó registrado en ningún log** del proyecto ni
del runtime de ngrok.

### Verificación previa al cambio

Antes de rotar se comprobó en el panel de ngrok que
`emphasis-expanse-evolution.ngrok-free.dev` es el **dominio de desarrollo de la
cuenta**, no una propiedad del token. Por eso rotar el token no cambia la URL
que usan los APK.

### Qué se hizo

1. Se entró al panel de ngrok con la cuenta de la organización.
2. Se pulsó **Rotate authtoken**, que revoca el token anterior y genera uno nuevo.
3. Se actualizó la variable de entorno de usuario `NGROK_AUTHTOKEN` con el token
   nuevo.
4. Se reinició el agente de ngrok.

### Resultado verificado

| Comprobación | Resultado |
| --- | --- |
| Túnel HTTPS con el dominio reservado | `https://emphasis-expanse-evolution.ngrok-free.dev` |
| API pública (`/api/health`) | **UP** |
| Backend local | **UP** |
| Stock público (`/stock/`) | **HTTP 200** |

El token anterior (`...nf3rXB`) quedó revocado y ya no autentica.

### Nota de seguridad

El token nuevo no se escribe en este documento ni en ningún archivo del
repositorio: vive únicamente en la variable de entorno `NGROK_AUTHTOKEN`.

### Si hay que volver a rotarlo

1. Entrar a `https://dashboard.ngrok.com/get-started/your-authtoken`.
2. Pulsar **Rotate authtoken** y marcar las dos casillas de confirmación.
3. Copiar el token nuevo y actualizar la variable:

```powershell
[Environment]::SetEnvironmentVariable("NGROK_AUTHTOKEN", "TOKEN_NUEVO", "User")
```

4. Detener y reiniciar el agente de ngrok.
5. Verificar `https://emphasis-expanse-evolution.ngrok-free.dev/api/health`.
