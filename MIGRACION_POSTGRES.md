# Migración PostgreSQL

SmartRestaurantQR utiliza exclusivamente PostgreSQL mediante `node-postgres`.

## Estado completado

- Configuración `pg`, pool y `databaseManager`.
- Inyección explícita de `databaseManager` en los repositories.
- Transacciones PostgreSQL.
- Scripts SQL `000` a `034`.
- AuthRepository, UsuarioRepository, RolRepository y PermisoRepository.
- AuditoriaRepository, CajaRepository y CategoriaRepository.
- ComandaRepository, ConfiguracionSistemaRepository y CreditoUsuarioRepository.
- DashboardRepository, FidelizacionRepository e ImpresionComandaRepository.
- IngresoQRRepository, MercadoPagoRepository y MesaRepository.
- NotificacionRepository, PagoRepository y PedidoRepository.
- ProductoRepository, PromocionRepository y ReporteRepository.
- ReservaRepository y SucursalRepository.
- Jobs de reservas y promociones.

## Validación

Los métodos de lectura de todos los repositories fueron comprobados contra la base PostgreSQL local. No quedan referencias `dbo`, funciones SQL Server ni dependencia `mssql` en `backend/src`.

## Reglas vigentes

- Usar tablas y columnas PostgreSQL en `snake_case`.
- Usar parámetros `$1`, `$2`, etc.
- Usar `RETURNING`, `CURRENT_TIMESTAMP`, `CURRENT_DATE`, `LIMIT` y `COALESCE`.
- No introducir `dbo`, `TOP`, `OUTPUT INSERTED`, `GETDATE`, `DATEADD`, `ISNULL` ni `SCOPE_IDENTITY`.
