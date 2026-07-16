# Criterios de Aceptación

## Reserva

Una reserva será aceptada cuando:

- El usuario esté autenticado.
- Exista sucursal.
- Exista mesa disponible.
- La fecha y hora sean válidas.
- La anticipación mínima sea respetada.

## Pedido

Un pedido será aceptado cuando:

- El usuario esté autenticado.
- Exista sucursal.
- Tenga al menos un producto.
- El total sea calculado correctamente.

## Pago

Un pago será aceptado cuando:

- Exista pedido.
- El monto sea válido.
- El estado sea controlado.
- Mercado Pago confirme el pago.

## QR

Un QR será aceptado cuando:

- Pertenezca a una reserva válida.
- No haya sido utilizado.
- No esté cancelado.

## Caja

Una caja será aceptada cuando:

- No exista otra caja abierta para la sucursal.
- El monto inicial sea válido.
- El usuario tenga sesión iniciada.