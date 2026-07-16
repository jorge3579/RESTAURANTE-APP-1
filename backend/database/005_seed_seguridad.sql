/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Datos iniciales de seguridad
=========================================================
*/

INSERT INTO roles
(
    nombre,
    descripcion
)
VALUES
    (
        'Administrador',
        'Acceso completo al sistema.'
    ),
    (
        'Gerente',
        'Acceso a dashboard, reportes, caja y configuración.'
    ),
    (
        'Encargado',
        'Gestión operativa de la sucursal.'
    ),
    (
        'Cajero',
        'Gestión de caja, cobros y pagos.'
    ),
    (
        'Mozo',
        'Gestión de mesas, pedidos y atención.'
    ),
    (
        'Cocina',
        'Gestión de comandas y preparación.'
    ),
    (
        'Cliente',
        'Usuario de la aplicación móvil del cliente.'
    )
ON CONFLICT (nombre)
DO UPDATE
SET
    descripcion = EXCLUDED.descripcion,
    activo = TRUE,
    fecha_modificacion = CURRENT_TIMESTAMP;


INSERT INTO permisos
(
    codigo,
    nombre,
    descripcion
)
VALUES
    (
        'USUARIOS_VER',
        'Ver usuarios',
        'Permite consultar usuarios.'
    ),
    (
        'USUARIOS_CREAR',
        'Crear usuarios',
        'Permite crear usuarios.'
    ),
    (
        'USUARIOS_EDITAR',
        'Editar usuarios',
        'Permite modificar usuarios.'
    ),
    (
        'USUARIOS_ELIMINAR',
        'Desactivar usuarios',
        'Permite desactivar usuarios.'
    ),
    (
        'ROLES_GESTIONAR',
        'Gestionar roles',
        'Permite administrar roles y permisos.'
    ),
    (
        'SUCURSALES_GESTIONAR',
        'Gestionar sucursales',
        'Permite administrar sucursales.'
    ),
    (
        'MESAS_GESTIONAR',
        'Gestionar mesas',
        'Permite administrar mesas.'
    ),
    (
        'PRODUCTOS_GESTIONAR',
        'Gestionar productos',
        'Permite administrar productos y categorías.'
    ),
    (
        'RESERVAS_VER',
        'Ver reservas',
        'Permite consultar reservas.'
    ),
    (
        'RESERVAS_GESTIONAR',
        'Gestionar reservas',
        'Permite confirmar, modificar y cancelar reservas.'
    ),
    (
        'PEDIDOS_VER',
        'Ver pedidos',
        'Permite consultar pedidos.'
    ),
    (
        'PEDIDOS_GESTIONAR',
        'Gestionar pedidos',
        'Permite crear y cambiar estados de pedidos.'
    ),
    (
        'COCINA_GESTIONAR',
        'Gestionar cocina',
        'Permite administrar comandas.'
    ),
    (
        'PAGOS_GESTIONAR',
        'Gestionar pagos',
        'Permite consultar y administrar pagos.'
    ),
    (
        'CAJA_GESTIONAR',
        'Gestionar caja',
        'Permite abrir y cerrar cajas.'
    ),
    (
        'DASHBOARD_VER',
        'Ver dashboard',
        'Permite consultar indicadores.'
    ),
    (
        'REPORTES_VER',
        'Ver reportes',
        'Permite generar y descargar reportes.'
    ),
    (
        'CONFIGURACION_GESTIONAR',
        'Gestionar configuración',
        'Permite modificar parámetros del sistema.'
    ),
    (
        'AUDITORIA_VER',
        'Ver auditoría',
        'Permite consultar el registro de auditoría.'
    ),
    (
        'CLIENTE_OPERAR',
        'Operaciones de cliente',
        'Permite reservar, pedir, pagar y consultar beneficios.'
    )
ON CONFLICT (codigo)
DO UPDATE
SET
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    activo = TRUE,
    fecha_modificacion = CURRENT_TIMESTAMP;


/*
Todos los permisos para Administrador.
*/

INSERT INTO rol_permisos
(
    id_rol,
    id_permiso
)
SELECT
    r.id_rol,
    p.id_permiso
FROM roles r
CROSS JOIN permisos p
WHERE r.nombre = 'Administrador'
ON CONFLICT (id_rol, id_permiso)
DO NOTHING;


/*
Permisos para Gerente.
*/

INSERT INTO rol_permisos
(
    id_rol,
    id_permiso
)
SELECT
    r.id_rol,
    p.id_permiso
FROM roles r
INNER JOIN permisos p
    ON p.codigo IN
    (
        'USUARIOS_VER',
        'SUCURSALES_GESTIONAR',
        'MESAS_GESTIONAR',
        'PRODUCTOS_GESTIONAR',
        'RESERVAS_VER',
        'RESERVAS_GESTIONAR',
        'PEDIDOS_VER',
        'PEDIDOS_GESTIONAR',
        'PAGOS_GESTIONAR',
        'CAJA_GESTIONAR',
        'DASHBOARD_VER',
        'REPORTES_VER',
        'AUDITORIA_VER'
    )
WHERE r.nombre = 'Gerente'
ON CONFLICT (id_rol, id_permiso)
DO NOTHING;


/*
Permisos para Cliente.
*/

INSERT INTO rol_permisos
(
    id_rol,
    id_permiso
)
SELECT
    r.id_rol,
    p.id_permiso
FROM roles r
INNER JOIN permisos p
    ON p.codigo = 'CLIENTE_OPERAR'
WHERE r.nombre = 'Cliente'
ON CONFLICT (id_rol, id_permiso)
DO NOTHING;