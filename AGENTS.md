# SmartRestaurantQR - Instrucciones para Codex

## Proyecto

SmartRestaurantQR es una plataforma para restaurantes compuesta por:

- Backend Node.js y Express.
- Base de datos PostgreSQL.
- Aplicación móvil cliente con React Native y Expo.
- Aplicación móvil restaurante con React Native y Expo.
- Administrador web, si corresponde.
- Gestor de paquetes pnpm.

## Reglas generales

- Utilizar JavaScript con ES Modules.
- Utilizar import y export.
- No utilizar require.
- No migrar nuevamente a SQL Server.
- Mantener PostgreSQL como base de datos.
- Utilizar consultas parametrizadas.
- No incluir contraseñas dentro del código.
- No modificar archivos .env sin autorización.
- No eliminar funciones existentes sin comprobar sus referencias.
- No crear implementaciones duplicadas.
- Buscar primero si ya existe una clase, servicio o helper.
- Mantener la arquitectura repository-service-controller-route.
- Mantener respuestas JSON consistentes.
- Ejecutar pruebas o verificaciones después de cada cambio.
- Utilizar pnpm, no npm.
- Explicar los archivos modificados.
- Mostrar los errores encontrados.
- No realizar cambios ajenos a la tarea solicitada.

## Backend

La estructura principal es:

- src/config
- src/controllers
- src/helpers
- src/middlewares
- src/repositories
- src/routes
- src/services
- src/validators

Los repositories reciben databaseManager mediante inyección de dependencias.

Los controllers utilizan services.

Los services utilizan repositories.

Los archivos index.js centralizan y construyen las dependencias.

## Base de datos

- Motor: PostgreSQL.
- Las consultas deben utilizar sintaxis PostgreSQL.
- Evitar sintaxis de SQL Server.
- Utilizar RETURNING cuando corresponda.
- Utilizar parámetros $1, $2, $3 en consultas con node-postgres.
- Respetar transacciones y conexiones del pool.

## Seguridad

- No mostrar contraseñas, tokens ni secretos.
- No subir .env al repositorio.
- Validar entradas.
- Utilizar bcrypt para contraseñas.
- Utilizar JWT de forma segura.
- No registrar tokens completos en logs.

## Ejecución

Utilizar:

```bash
pnpm install
pnpm dev
pnpm test
pnpm lint