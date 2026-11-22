# Base de datos

MariaDB contiene Categories, Suppliers, Products, StockMovements, Sales, SaleDetails, AuditLogs y SystemSettings. Las entidades principales usan `IsDeleted` y `DeletedAt`; EF Core aplica filtros globales.

MongoDB contiene `StockSmartRestaurantQR_Auth.Users`, con identificador ObjectId, usuario, hash BCrypt, nombre, email, rol, estado y último acceso. Nunca se guardan contraseñas en claro en MongoDB.

La aplicación crea el esquema con `EnsureCreated` y carga datos de ejemplo sólo cuando las tablas están vacías.
