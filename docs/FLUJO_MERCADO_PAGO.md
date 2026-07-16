# Flujo Mercado Pago

1. Cliente crea pedido.
2. App solicita preferencia al backend.
3. Backend crea pago pendiente.
4. Backend genera preferencia en Mercado Pago.
5. Cliente paga.
6. Mercado Pago envía webhook.
7. Backend procesa webhook.
8. Backend aprueba pago.
9. Backend confirma reserva.
10. Backend genera QR.
11. Backend suma puntos.
12. Backend genera notificación.