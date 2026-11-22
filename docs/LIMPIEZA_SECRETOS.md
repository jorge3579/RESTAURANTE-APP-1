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

## 2. Rotación del token de ngrok — pendiente, requiere el panel de ngrok

### Situación

El `authtoken` de ngrok estaba en texto plano en `%LOCALAPPDATA%\ngrok\ngrok.yml`.
Ya se movió a la variable de entorno de usuario `NGROK_AUTHTOKEN`, y el archivo
`ngrok.yml` quedó solo con `version: "2"`.

Se verificó que el token **no quedó registrado en ningún log** del proyecto ni
del runtime de ngrok.

### Por qué no se puede rotar desde aquí

Rotar el token exige entrar al panel de ngrok con la cuenta, y no hay credencial
de la API de administración de ngrok en el equipo: el `authtoken` sirve para
autenticar el túnel, no para administrar la cuenta.

### Advertencia importante antes de rotarlo

**Los APK que hoy se distribuyen apuntan al dominio
`emphasis-expanse-evolution.ngrok-free.dev`.** Ese dominio es un dominio
reservado que pertenece a la **cuenta** de ngrok, no al token.

Por lo tanto:

- Rotar el token **no cambia el dominio**, porque el dominio se conserva en la
  cuenta.
- Pero si se usa `ngrok config add-authtoken` con el token nuevo y el dominio
  reservado se hubiera asignado de otra forma, hay que **volver a verificar el
  túnel** y, de ser necesario, recompilar los APK.

### Pasos recomendados (en el panel de ngrok)

1. Entrar a `https://dashboard.ngrok.com/get-started/your-authtoken`.
2. Pulsar **Revoke** o **Regenerate** para invalidar el token actual.
3. Copiar el token nuevo.
4. Ejecutar en PowerShell:

```powershell
[Environment]::SetEnvironmentVariable("NGROK_AUTHTOKEN", "TOKEN_NUEVO", "User")
```

5. Reiniciar ngrok y comprobar:

```powershell
ngrok http 3000 --url https://emphasis-expanse-evolution.ngrok-free.dev
Invoke-RestMethod http://127.0.0.1:4040/api/tunnels
```

6. Verificar la API pública:
   `https://emphasis-expanse-evolution.ngrok-free.dev/api/health`

Si el túnel no levanta con el dominio reservado, revisar que el dominio siga
asociado a la cuenta y que el token nuevo corresponda a la misma cuenta.
