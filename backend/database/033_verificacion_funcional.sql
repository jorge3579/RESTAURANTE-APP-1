/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Pruebas funcionales de la base
=========================================================
*/


/*
---------------------------------------------------------
 1. Verificar usuario administrador
---------------------------------------------------------
*/

SELECT
    u.id_usuario,
    u.nombre,
    u.apellido,
    u.email,
    r.nombre AS rol,
    u.activo
FROM usuarios u
INNER JOIN roles r
    ON r.id_rol = u.id_rol_principal
WHERE u.email = 'admin@smartrestaurantqr.com';


/*
---------------------------------------------------------
 2. Verificar contraseña del administrador
---------------------------------------------------------
*/

SELECT
    email,
    password_hash =
        CRYPT(
            'Admin1234!',
            password_hash
        ) AS password_correcta
FROM usuarios
WHERE email = 'admin@smartrestaurantqr.com';


/*
---------------------------------------------------------
 3. Verificar cliente demo
---------------------------------------------------------
*/

SELECT
    u.id_usuario,
    u.nombre,
    u.apellido,
    u.email,
    r.nombre AS rol
FROM usuarios u
INNER JOIN roles r
    ON r.id_rol = u.id_rol_principal
WHERE u.email =
    'cliente.demo@smartrestaurantqr.com';


/*
---------------------------------------------------------
 4. Verificar reserva demo
---------------------------------------------------------
*/

SELECT
    id_reserva,
    codigo_reserva,
    cliente,
    sucursal,
    fecha_reserva,
    hora_reserva,
    cantidad_personas,
    estado,
    mesas
FROM vw_reservas
WHERE email =
    'cliente.demo@smartrestaurantqr.com';


/*
---------------------------------------------------------
 5. Verificar pedido demo
---------------------------------------------------------
*/

SELECT
    id_pedido,
    numero_pedido,
    cliente,
    sucursal,
    estado,
    subtotal,
    descuento,
    recargo,
    total,
    cantidad_items
FROM vw_pedidos
WHERE cliente =
    'Cliente Demostración';


/*
---------------------------------------------------------
 6. Verificar detalle
---------------------------------------------------------
*/

SELECT
    pd.id_pedido_detalle,
    p.numero_pedido,
    pd.nombre_producto,
    pd.cantidad,
    pd.precio_unitario,
    pd.descuento,
    pd.subtotal,
    pd.estado_cocina
FROM vw_pedido_detalles pd
INNER JOIN pedidos p
    ON p.id_pedido = pd.id_pedido
ORDER BY pd.id_pedido_detalle;


/*
---------------------------------------------------------
 7. Verificar comanda
---------------------------------------------------------
*/

SELECT
    id_comanda,
    numero_comanda,
    numero_pedido,
    sucursal,
    prioridad,
    estado,
    tiempo_estimado_minutos,
    cantidad_items
FROM vw_comandas
ORDER BY id_comanda;


/*
---------------------------------------------------------
 8. Verificar mesa
---------------------------------------------------------
*/

SELECT
    m.id_mesa,
    s.nombre AS sucursal,
    m.numero,
    m.capacidad,
    m.estado,
    m.activa
FROM mesas m
INNER JOIN sucursales s
    ON s.id_sucursal = m.id_sucursal
ORDER BY m.numero;


/*
---------------------------------------------------------
 9. Verificar dashboard
---------------------------------------------------------
*/

SELECT *
FROM vw_dashboard_diario;


/*
---------------------------------------------------------
 10. Verificar totales
---------------------------------------------------------
*/

SELECT
    (SELECT COUNT(*) FROM usuarios)
        AS usuarios,

    (SELECT COUNT(*) FROM sucursales)
        AS sucursales,

    (SELECT COUNT(*) FROM mesas)
        AS mesas,

    (SELECT COUNT(*) FROM productos)
        AS productos,

    (SELECT COUNT(*) FROM reservas)
        AS reservas,

    (SELECT COUNT(*) FROM pedidos)
        AS pedidos,

    (SELECT COUNT(*) FROM comandas)
        AS comandas;