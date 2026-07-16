# Plan de Pruebas SmartRestaurantQR

## Objetivo

Validar que el sistema funcione correctamente en backend, app cliente y app restaurante.

---

## Pruebas Backend

### Auth

- Registrar usuario.
- Login correcto.
- Login incorrecto.
- Token inválido.
- Logout.

### Reservas

- Crear reserva.
- Crear reserva sin mesa disponible.
- Cancelar reserva.
- Confirmar reserva.
- Marcar no asistió.

### Pedidos

- Crear pedido.
- Consultar pedido.
- Cambiar estado.
- Ver detalle.

### Pagos

- Crear pago.
- Aprobar pago.
- Rechazar pago.
- Integrar Mercado Pago.

### QR

- Generar QR.
- Validar QR.
- Reutilizar QR.

### Cocina

- Crear comanda.
- Cambiar estado.
- Notificación por Socket.IO.

### Caja

- Abrir caja.
- Cerrar caja.
- Evitar doble caja abierta.

---

## Pruebas Frontend Cliente

- Login.
- Registro.
- Crear reserva.
- Consultar reservas.
- Crear pedido.
- Pagar.
- Ver QR.
- Ver puntos.
- Ver créditos.
- Ver promociones.

---

## Pruebas Frontend Restaurante

- Login.
- Dashboard.
- Pedidos.
- Cocina.
- Validar QR.
- Caja.