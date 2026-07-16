# Puesta en producción

## Backend y PostgreSQL

1. Copiar `.env.example` a `.env` y completar los secretos locales.
2. Revisar `backend/.env` y configurar `JWT_SECRET`, CORS y Mercado Pago.
3. Iniciar los servicios con `docker compose up -d --build`.
4. Verificar `GET https://TU_DOMINIO/api/health`.

PostgreSQL se inicializa con `backend/database/031_ejecutar_todo_postgres.sql` cuando el volumen está vacío. Los secretos reales permanecen en archivos `.env` ignorados por Git.

## Variables de las aplicaciones

Configurar en EAS, para el entorno `production`:

- Cliente: `EXPO_PUBLIC_API_URL=https://TU_DOMINIO/api`
- Restaurante: `EXPO_PUBLIC_API_URL=https://TU_DOMINIO/api`
- Restaurante: `EXPO_PUBLIC_SOCKET_URL=https://TU_DOMINIO`

La API de producción debe usar HTTPS. Socket.IO comparte el mismo certificado y dominio.

## Generación de APK

En cada aplicación:

```powershell
pnpm install --frozen-lockfile
pnpm dlx eas-cli login
pnpm run build:apk
```

Los perfiles `production` de ambos `eas.json` generan APK. Antes de publicar una nueva versión se debe incrementar `android.versionCode` en `app.json`.

## Comprobaciones previas

```powershell
cd backend
pnpm db:test
pnpm lint
pnpm test

cd ../frontend-cliente
pnpm run export:android

cd ../frontend-restaurante
pnpm run export:android
```

No incluir contraseñas, tokens, archivos `.env` ni credenciales de firma en el repositorio.
