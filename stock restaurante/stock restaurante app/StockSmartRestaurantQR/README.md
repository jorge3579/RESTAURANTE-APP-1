# StockSmartRestaurantQR

Aplicación independiente de inventario y ventas para restaurantes. No modifica ni se conecta con la aplicación de restaurante existente.

## Tecnología

- .NET 10 LTS, Blazor Web App con interactividad de servidor y MudBlazor.
- MariaDB para catálogo, inventario, ventas, movimientos, auditoría y configuración.
- MongoDB para usuarios y autenticación.
- Cookies para la interfaz web y JWT para los endpoints REST.
- QuestPDF y ClosedXML para reportes PDF/Excel.

## Inicio rápido

1. Instalar MariaDB y MongoDB como servicios locales.
2. Leer `docs/12-Estado-de-la-PC-y-pasos-pendientes.md`.
3. Crear las claves localmente siguiendo `docs/11-Contraseñas-y-primer-arranque.md`.
4. Abrir `StockSmartRestaurantQR.sln`, restaurar NuGet y ejecutar el proyecto Web.

Las tablas y datos de ejemplo se crean automáticamente si la base está vacía. También se incluye `scripts/mariadb_init.sql` para creación manual.
