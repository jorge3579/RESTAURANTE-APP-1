# Endpoints independientes y uso futuro

La aplicación no está integrada con la app de restaurante. Los endpoints REST son propios del sistema de stock y quedan disponibles para clientes autorizados futuros.

Una venta externa usa `POST /api/sales` con `externalReference` única e `items` (`productId`, `quantity`). Las entradas o salidas usan `POST /api/stock/movements`. El servidor valida JWT, existencia, cantidad y stock dentro de transacciones serializables. No hay webhooks activos.
