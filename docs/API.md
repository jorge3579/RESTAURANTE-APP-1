# API SmartRestaurantQR

## Base URL

```text
http://localhost:3000/api

POST /auth/registrar
POST /auth/login
POST /auth/logout
GET /auth/me

GET /usuarios
POST /usuarios
PUT /usuarios/:idUsuario
DELETE /usuarios/:idUsuario

GET /reservas
POST /reservas
PUT /reservas/:idReserva/confirmar
PUT /reservas/:idReserva/cancelar

GET /pedidos
POST /pedidos
PUT /pedidos/:idPedido/estado

GET /pagos
POST /pagos
PUT /pagos/:idPago/aprobar

POST /mercado-pago/preferencia
POST /mercado-pago/webhook

POST /ingresos-qr/reserva/:idReserva/generar
POST /ingresos-qr/validar

GET /dashboard/resumen

GET /reportes/general
GET /reportes/excel
GET /reportes/pdf