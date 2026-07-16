/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Verificación de estructura
=========================================================
*/


SELECT
    CURRENT_DATABASE() AS base_datos,
    CURRENT_USER AS usuario_conectado,
    CURRENT_TIMESTAMP AS fecha_verificacion;


SELECT
    COUNT(*) AS cantidad_tablas
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';


SELECT
    COUNT(*) AS cantidad_vistas
FROM information_schema.views
WHERE table_schema = 'public';


SELECT
    COUNT(*) AS cantidad_funciones
FROM information_schema.routines
WHERE routine_schema = 'public';


SELECT
    COUNT(*) AS cantidad_triggers
FROM information_schema.triggers
WHERE trigger_schema = 'public';


SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;


SELECT
    table_name
FROM information_schema.views
WHERE table_schema = 'public'
ORDER BY table_name;


SELECT
    id_rol,
    nombre,
    activo
FROM roles
ORDER BY id_rol;


SELECT
    id_usuario,
    nombre,
    apellido,
    email,
    activo
FROM usuarios
ORDER BY id_usuario;


SELECT
    id_sucursal,
    nombre,
    ciudad,
    activo
FROM sucursales
ORDER BY id_sucursal;


SELECT
    COUNT(*) AS cantidad_mesas
FROM mesas;


SELECT
    COUNT(*) AS cantidad_productos
FROM productos;


SELECT
    COUNT(*) AS cantidad_configuraciones
FROM configuracion_sistema;


SELECT
    COUNT(*) AS cantidad_niveles_vip
FROM niveles_vip;


/*
Buscar claves foráneas inválidas o pendientes.
*/

SELECT
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS tabla_referenciada,
    ccu.column_name AS columna_referenciada
FROM information_schema.table_constraints tc
INNER JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name =
        kcu.constraint_name
    AND tc.constraint_schema =
        kcu.constraint_schema
INNER JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name =
        tc.constraint_name
    AND ccu.constraint_schema =
        tc.constraint_schema
WHERE tc.constraint_type =
    'FOREIGN KEY'
  AND tc.table_schema =
    'public'
ORDER BY
    tc.table_name,
    tc.constraint_name;