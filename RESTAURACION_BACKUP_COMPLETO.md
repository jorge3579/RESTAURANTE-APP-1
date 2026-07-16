# Restauración completa de SmartRestaurantQR

## Ubicación del proyecto

Restaurar la carpeta principal completa en:

`D:\RESTAURANTE-APP-1`

Las carpetas deben conservar esta ubicación relativa:

- `backend` → servidor Node.js, API REST y migraciones PostgreSQL.
- `backend\imagen producto` → imágenes cargadas para los productos.
- `frontend-cliente` → aplicación móvil del cliente.
- `frontend-restaurante` → aplicación móvil del restaurante.
- `aplicaciones` → APK finales instalables.
- `tools` → herramientas de inicio, red y mantenimiento.
- `backups` → volcados PostgreSQL del respaldo integral de Drive.
- `deploy` y `docs` → despliegue y documentación técnica.

No cambiar la estructura interna de esas carpetas.

## Requisitos

1. Windows, Node.js compatible con el proyecto, pnpm y Git.
2. PostgreSQL 18 y las herramientas `pg_restore` y `psql`.
3. ngrok autenticado en el usuario de Windows.
4. Android Studio y Android SDK solamente si se recompilarán los APK.

## Restaurar archivos privados

El repositorio GitHub no contiene contraseñas ni tokens. Del respaldo privado de
Drive deben restaurarse los archivos `.env` exactamente en sus ubicaciones
originales, especialmente `backend\.env`. Nunca publicarlos ni agregarlos a Git.

## Restaurar PostgreSQL

El respaldo se encuentra en `backups\postgresql-FECHA\database.dump` y está en
formato personalizado de PostgreSQL. Crear primero el usuario y la base indicados
en `backend\.env`. Luego, desde PowerShell:

```powershell
& "C:\Program Files\PostgreSQL\18\bin\pg_restore.exe" `
  --clean --if-exists --no-owner `
  --host localhost --port 5432 `
  --username USUARIO --dbname BASE_DE_DATOS `
  "D:\RESTAURANTE-APP-1\backups\postgresql-FECHA\database.dump"
```

El volcado incluye esquema, datos, secuencias, funciones y permisos propios de la
base. Los roles globales deben crearse manualmente porque el usuario operativo de
la aplicación no posee privilegios para leer `pg_authid`.

## Instalar dependencias

Ejecutar `pnpm install` en `backend`, `frontend-cliente` y
`frontend-restaurante`. No usar npm.

## Activar el sistema

Ejecutar como administrador:

`D:\RESTAURANTE-APP-1\ACTIVAR-SERVIDOR-Y-NGROK.bat`

El iniciador comprueba PostgreSQL, levanta el backend y ngrok, y verifica que la
dirección pública coincida con la incorporada en ambos APK.

## Validación final

1. Abrir `http://127.0.0.1:3000/api/health` en esta PC.
2. Confirmar que el iniciador indique `SERVIDOR LISTO`.
3. Probar inicio de sesión desde ambas aplicaciones usando una red externa.
4. Crear un producto en restaurante y verificar que aparezca en cliente.
5. Crear un pedido/reserva en cliente y verificar que aparezca en restaurante.

