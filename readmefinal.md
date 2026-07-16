# SmartRestaurantQR — guía final de reconstrucción

## 1. Componentes

SmartRestaurantQR contiene:

- `backend`: API REST Node.js/Express, Socket.IO y acceso a PostgreSQL.
- `frontend-cliente`: aplicación React Native/Expo para clientes.
- `frontend-restaurante`: aplicación React Native/Expo para administración, pedidos, cocina, QR y caja.
- `backend/database`: esquema, migraciones y datos iniciales PostgreSQL.
- `backend/imagen producto`: almacenamiento persistente de imágenes cargadas desde Gestión.
- `tools`: comprobaciones de red, administración y documentación operativa.

El puerto PostgreSQL `5432` no debe publicarse en Internet. Los celulares se conectan únicamente a la API HTTPS; la API accede a PostgreSQL dentro de esta PC o de la red privada.

## 2. Requisitos

- Windows 10/11.
- Node.js compatible con el proyecto.
- pnpm 11.
- PostgreSQL 18, o Docker Desktop.
- Android Studio, Android SDK y JDK incluido en `Android Studio\jbr`.
- ngrok autenticado para acceso desde Wi‑Fi externo o datos móviles.

Comprobar herramientas:

```powershell
node --version
pnpm --version
psql --version
adb devices
ngrok version
```

## 3. Variables de entorno y seguridad

Copiar `backend/.env.example` como `backend/.env` y completar localmente. Nunca subir `backend/.env`, contraseñas, tokens JWT, claves privadas ni el token de Mercado Pago.

Variables principales:

```dotenv
NODE_ENV=development
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=smartrestaurantqr
DB_USER=smartrestaurant_app
DB_PASSWORD=CAMBIAR_CONTRASENA
JWT_SECRET=GENERAR_UN_SECRETO_LARGO
CORS_ORIGIN=*
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_PUBLIC_KEY=
```

Los archivos `.env.production` de los frontends solo contienen direcciones públicas, no secretos. Si cambia el dominio de ngrok, actualizar:

- `frontend-cliente/.env.production`: `EXPO_PUBLIC_API_URL=https://DOMINIO/api`
- `frontend-restaurante/.env.production`: `EXPO_PUBLIC_API_URL=https://DOMINIO/api`
- `frontend-restaurante/.env.production`: `EXPO_PUBLIC_SOCKET_URL=https://DOMINIO`

Un cambio de URL exige recompilar los APK. Mercado Pago se configura únicamente en el backend y no exige recompilar las aplicaciones.

## 4. Crear PostgreSQL desde cero

### Opción Docker

Crear un `.env` en la raíz con una contraseña segura para `DB_PASSWORD` y ejecutar:

```powershell
docker compose up -d postgres
docker compose logs -f postgres
```

El inicializador ejecuta `backend/database/031_ejecutar_todo_postgres.sql`.

### Opción PostgreSQL instalado en Windows

Crear la base y ejecutar el script maestro con un usuario administrador de PostgreSQL:

```powershell
psql -U postgres -c "CREATE DATABASE smartrestaurantqr;"
psql -U postgres -d smartrestaurantqr -v ON_ERROR_STOP=1 -f backend/database/031_ejecutar_todo_postgres.sql
```

Aplicar después las migraciones que sean posteriores al script maestro, incluida `035_horarios_cortados.sql`, si todavía no están incorporadas en la base restaurada.

Probar la conexión de la aplicación:

```powershell
cd backend
pnpm install
pnpm db:test
```

No abrir el puerto 5432 en el router ni en el firewall público.

## 5. Ejecutar el backend

```powershell
cd D:\RESTAURANTE-APP-1\backend
pnpm install
pnpm dev
```

Comprobar:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health
```

La carpeta `backend/imagen producto` debe existir y tener permisos de escritura. Las imágenes se sirven en `/imagenes-productos/<archivo>` y la base guarda esa ruta relativa, de modo que funciona tanto localmente como mediante ngrok.

## 6. Ejecutar aplicaciones en emuladores

La dirección local del emulador Android es `http://10.0.2.2:3000`.

```powershell
cd frontend-cliente
pnpm install
pnpm start
```

En otra terminal:

```powershell
cd frontend-restaurante
pnpm install
pnpm start
```

Para dos servidores Metro simultáneos, usar puertos distintos y configurar el puerto del servidor de desarrollo del dispositivo correspondiente.

## 7. Publicar temporalmente mediante ngrok

Con el backend escuchando en el puerto 3000:

```powershell
ngrok http 3000
```

Verificar el túnel local:

```powershell
Invoke-RestMethod http://127.0.0.1:4040/api/tunnels
```

Actualizar ambos `.env.production` con la URL HTTPS mostrada por ngrok. Las aplicaciones ya envían `ngrok-skip-browser-warning` en Axios y Socket.IO.

Condiciones operativas:

- Esta PC debe permanecer encendida.
- PostgreSQL, backend y ngrok deben estar ejecutándose.
- Si ngrok asigna otra URL, hay que actualizar la configuración y recompilar.
- La API pública es el único acceso externo; PostgreSQL permanece privado.

## 8. Compilar APK localmente

Abrir PowerShell y definir las herramientas solo para esa sesión:

```powershell
$env:JAVA_HOME='C:\Program Files\Android\Android Studio\jbr'
$env:ANDROID_HOME='C:\Users\jorge\AppData\Local\Android\Sdk'
$env:NODE_ENV='production'
```

Cliente:

```powershell
cd D:\RESTAURANTE-APP-1\frontend-cliente\android
.\gradlew.bat clean assembleRelease
```

Restaurante:

```powershell
cd D:\RESTAURANTE-APP-1\frontend-restaurante\android
.\gradlew.bat clean assembleRelease
```

Resultados:

- `frontend-cliente/android/app/build/outputs/apk/release/app-release.apk`
- `frontend-restaurante/android/app/build/outputs/apk/release/app-release.apk`

Antes de distribuir, comprobar que el bundle contiene la URL ngrok vigente y no `10.0.2.2`.

## 9. Pruebas mínimas obligatorias

```powershell
cd backend
pnpm lint
pnpm test
pnpm db:test
```

En los celulares o emuladores verificar:

1. Login Cliente y Restaurante.
2. Producto creado/editado/pausado en Restaurante aparece o desaparece en Cliente.
3. Imagen cargada se guarda en `backend/imagen producto` y aparece en Menú, Pedido y Reserva.
4. Reserva Cliente aparece en Dashboard/Reservas Restaurante.
5. Pedido Cliente aparece en Pedidos y Cocina Restaurante.
6. Cocina avanza a preparado, listo y entregado; Cliente ve el estado.
7. QR abre cámara, valida una vez y rechaza reutilización.
8. Caja abre, cierra y muestra historial sin pantalla blanca.
9. Horarios simples y cortados se guardan y limitan la reserva.
10. Refresco manual, WebSocket y respaldo automático cada 30 segundos.

## 10. Mercado Pago

Completar en `backend/.env` las credenciales y URLs HTTPS. La URL de webhook debe apuntar al dominio público actual, por ejemplo `https://DOMINIO/api/mercado-pago/webhook`. Probar primero con credenciales de prueba. Sin access token, la API responde de forma controlada que el pago todavía no está configurado.

## 11. Respaldo y restauración

Respaldar PostgreSQL:

```powershell
pg_dump -U postgres -Fc smartrestaurantqr -f smartrestaurantqr.backup
```

Restaurar:

```powershell
createdb -U postgres smartrestaurantqr
pg_restore -U postgres -d smartrestaurantqr --clean --if-exists smartrestaurantqr.backup
```

Respaldar también `backend/imagen producto`; el dump de PostgreSQL no incluye esos archivos.

## 12. GitHub

El repositorio debe incluir código, migraciones, lockfiles, `.env.example`, `.env.production`, documentación y, si el tamaño lo permite, los APK finales. Debe excluir `.env`, secretos, `node_modules`, cachés Gradle/Expo, builds intermedios, logs, capturas temporales, instaladores y datos locales de IDE.

Después de clonar:

```powershell
pnpm --dir backend install
pnpm --dir frontend-cliente install
pnpm --dir frontend-restaurante install
```

Luego crear `backend/.env`, restaurar PostgreSQL, restaurar `backend/imagen producto`, iniciar backend/ngrok y recompilar con la URL pública vigente.
