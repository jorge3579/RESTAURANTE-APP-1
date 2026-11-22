# API y endpoints

Obtenga JWT con `POST /api/auth/token`. Envíelo como `Authorization: Bearer <token>`.

- `GET/POST/DELETE /api/products`
- `GET/POST /api/categories` y `/api/suppliers`
- `GET/POST /api/stock/movements`
- `GET/POST /api/sales`
- `GET /api/sales/{id}/receipt.pdf`
- `GET /api/dashboard`
- `GET /api/reports/inventory.pdf|xlsx` y `/api/reports/sales.pdf|xlsx`
- `GET/POST/PUT /api/users` (administrador)
- `POST /api/auth/change-password`

`ExternalReference` en ventas permite idempotencia: repetir una referencia devuelve la venta ya registrada.
