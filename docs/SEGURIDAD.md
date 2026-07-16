# Seguridad

## JWT

El sistema usa tokens JWT para autenticar usuarios.

## Contraseñas

Las contraseñas se guardan con hash bcrypt.

## Variables sensibles

Nunca subir `.env`.

## CORS

Configurar `CORS_ORIGIN` según ambiente.

## Rate Limit

El backend limita solicitudes para evitar abuso.

## Auditoría

Las acciones importantes quedan registradas en la tabla `Auditoria`.