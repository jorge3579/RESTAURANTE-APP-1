# Resumen Técnico

SmartRestaurantQR está desarrollado bajo arquitectura cliente-servidor.

## Backend

El backend utiliza Node.js con Express, organizado por capas:

- Routes
- Controllers
- Services
- Repositories
- DTOs
- Middlewares
- Validators
- Constants
- Config

## Base de datos

SQL Server con tablas relacionales, claves primarias, claves foráneas e índices.

## Frontend

Dos aplicaciones móviles:

- Cliente
- Restaurante

Ambas desarrolladas con React Native y Expo.

## Comunicación

- REST API mediante Axios.
- Socket.IO para eventos en tiempo real.

## Seguridad

- JWT.
- bcrypt.
- Rate limit.
- Helmet.
- Auditoría.

## Integraciones

- Mercado Pago.
- QR.
- Swagger.