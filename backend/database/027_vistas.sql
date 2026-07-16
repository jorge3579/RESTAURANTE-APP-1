/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Vistas de consulta
=========================================================
*/


/*
---------------------------------------------------------
 Vista de usuarios y roles
---------------------------------------------------------
*/

CREATE OR REPLACE VIEW vw_usuarios
AS
SELECT
    u.id_usuario,
    u.id_rol_principal,
    r.nombre AS rol_principal,
    u.nombre,
    u.apellido,
    CONCAT(
        u.nombre,
        ' ',
        u.apellido
    ) AS nombre_completo,
    u.dni,
    u.email,
    u.telefono,
    u.email_verificado,
    u.ultimo_login,
    u.activo,
    u.fecha_registro,
    u.fecha_modificacion
FROM usuarios u
INNER JOIN roles r
    ON r.id_rol = u.id_rol_principal;


/*
---------------------------------------------------------
 Vista de productos y categorías
---------------------------------------------------------
*/

CREATE OR REPLACE VIEW vw_productos
AS
SELECT
    p.id_producto,
    p.id_categoria,
    c.nombre AS categoria,
    p.codigo,
    p.nombre,
    p.descripcion,
    p.precio,
    p.costo,
    p.imagen_url,
    p.tiempo_preparacion_minutos,
    p.disponible,
    p.permite_take_away,
    p.permite_consumo_local,
    p.controla_stock,
    p.destacado,
    p.activo,
    p.fecha_creacion,
    p.fecha_modificacion
FROM productos p
INNER JOIN categorias c
    ON c.id_categoria = p.id_categoria;


/*
---------------------------------------------------------
 Vista de reservas
---------------------------------------------------------
*/

CREATE OR REPLACE VIEW vw_reservas
AS
SELECT
    r.id_reserva,
    r.codigo_reserva,
    r.id_usuario,
    CONCAT(
        u.nombre,
        ' ',
        u.apellido
    ) AS cliente,
    u.email,
    u.telefono,
    r.id_sucursal,
    s.nombre AS sucursal,
    r.fecha_reserva,
    r.hora_reserva,
    r.cantidad_personas,
    r.tipo_consumo,
    r.estado,
    r.observaciones,
    r.fecha_confirmacion,
    r.fecha_cancelacion,
    r.fecha_llegada,
    r.fecha_finalizacion,
    r.fecha_creacion,
    r.fecha_modificacion,
    COALESCE
    (
        STRING_AGG(
            m.numero,
            ', '
            ORDER BY m.numero
        ),
        ''
    ) AS mesas
FROM reservas r
INNER JOIN usuarios u
    ON u.id_usuario = r.id_usuario
INNER JOIN sucursales s
    ON s.id_sucursal = r.id_sucursal
LEFT JOIN reserva_mesas rm
    ON rm.id_reserva = r.id_reserva
LEFT JOIN mesas m
    ON m.id_mesa = rm.id_mesa
GROUP BY
    r.id_reserva,
    u.id_usuario,
    s.id_sucursal;


/*
---------------------------------------------------------
 Vista de pedidos
---------------------------------------------------------
*/

CREATE OR REPLACE VIEW vw_pedidos
AS
SELECT
    p.id_pedido,
    p.numero_pedido,
    p.id_usuario,
    CONCAT(
        u.nombre,
        ' ',
        u.apellido
    ) AS cliente,
    p.id_sucursal,
    s.nombre AS sucursal,
    p.id_reserva,
    p.tipo_consumo,
    p.estado,
    p.subtotal,
    p.descuento,
    p.recargo,
    p.total,
    p.observaciones,
    p.fecha_confirmacion,
    p.fecha_inicio_preparacion,
    p.fecha_listo,
    p.fecha_entrega,
    p.fecha_cancelacion,
    p.fecha_creacion,
    p.fecha_modificacion,
    COUNT(pd.id_pedido_detalle) AS cantidad_items
FROM pedidos p
INNER JOIN usuarios u
    ON u.id_usuario = p.id_usuario
INNER JOIN sucursales s
    ON s.id_sucursal = p.id_sucursal
LEFT JOIN pedido_detalles pd
    ON pd.id_pedido = p.id_pedido
GROUP BY
    p.id_pedido,
    u.id_usuario,
    s.id_sucursal;


/*
---------------------------------------------------------
 Vista de detalle de pedidos
---------------------------------------------------------
*/

CREATE OR REPLACE VIEW vw_pedido_detalles
AS
SELECT
    pd.id_pedido_detalle,
    pd.id_pedido,
    pd.id_producto,
    p.codigo AS codigo_producto,
    pd.nombre_producto,
    pd.cantidad,
    pd.precio_unitario,
    pd.descuento,
    pd.subtotal,
    pd.observaciones,
    pd.estado_cocina,
    pd.fecha_creacion,
    pd.fecha_modificacion
FROM pedido_detalles pd
INNER JOIN productos p
    ON p.id_producto = pd.id_producto;


/*
---------------------------------------------------------
 Vista de comandas
---------------------------------------------------------
*/

CREATE OR REPLACE VIEW vw_comandas
AS
SELECT
    c.id_comanda,
    c.numero_comanda,
    c.id_pedido,
    p.numero_pedido,
    c.id_sucursal,
    s.nombre AS sucursal,
    c.prioridad,
    c.estado,
    c.tiempo_estimado_minutos,
    c.observaciones,
    c.fecha_recepcion,
    c.fecha_inicio,
    c.fecha_lista,
    c.fecha_entrega,
    c.fecha_cancelacion,
    c.fecha_creacion,
    c.fecha_modificacion,
    COUNT(cd.id_comanda_detalle) AS cantidad_items
FROM comandas c
INNER JOIN pedidos p
    ON p.id_pedido = c.id_pedido
INNER JOIN sucursales s
    ON s.id_sucursal = c.id_sucursal
LEFT JOIN comanda_detalles cd
    ON cd.id_comanda = c.id_comanda
GROUP BY
    c.id_comanda,
    p.id_pedido,
    s.id_sucursal;


/*
---------------------------------------------------------
 Vista de cajas
---------------------------------------------------------
*/

CREATE OR REPLACE VIEW vw_cajas
AS
SELECT
    c.id_caja,
    c.id_sucursal,
    s.nombre AS sucursal,
    c.id_usuario_apertura,
    CONCAT(
        ua.nombre,
        ' ',
        ua.apellido
    ) AS usuario_apertura,
    c.id_usuario_cierre,
    CASE
        WHEN uc.id_usuario IS NULL
        THEN NULL
        ELSE CONCAT(
            uc.nombre,
            ' ',
            uc.apellido
        )
    END AS usuario_cierre,
    c.fecha_apertura,
    c.fecha_cierre,
    c.monto_inicial,
    c.monto_final_declarado,
    c.monto_final_calculado,
    c.diferencia,
    c.total_ventas,
    c.total_efectivo,
    c.total_mercado_pago,
    c.total_payway,
    c.total_transferencias,
    c.total_creditos,
    c.estado,
    c.observaciones,
    c.fecha_creacion,
    c.fecha_modificacion
FROM cajas c
INNER JOIN sucursales s
    ON s.id_sucursal = c.id_sucursal
INNER JOIN usuarios ua
    ON ua.id_usuario = c.id_usuario_apertura
LEFT JOIN usuarios uc
    ON uc.id_usuario = c.id_usuario_cierre;


/*
---------------------------------------------------------
 Vista de créditos activos
---------------------------------------------------------
*/

CREATE OR REPLACE VIEW vw_creditos_activos
AS
SELECT
    c.id_credito,
    c.id_usuario,
    CONCAT(
        u.nombre,
        ' ',
        u.apellido
    ) AS usuario,
    c.monto_original,
    c.saldo_disponible,
    c.motivo,
    c.estado,
    c.fecha_vencimiento,
    c.fecha_creacion
FROM creditos_usuario c
INNER JOIN usuarios u
    ON u.id_usuario = c.id_usuario
WHERE c.estado = 'ACTIVO'
  AND c.saldo_disponible > 0
  AND
  (
      c.fecha_vencimiento IS NULL
      OR c.fecha_vencimiento >
          CURRENT_TIMESTAMP
  );


/*
---------------------------------------------------------
 Vista resumen de dashboard diario
---------------------------------------------------------
*/

CREATE OR REPLACE VIEW vw_dashboard_diario
AS
SELECT
    CURRENT_DATE AS fecha,

    (
        SELECT COUNT(*)
        FROM reservas
        WHERE fecha_reserva =
            CURRENT_DATE
    ) AS reservas_hoy,

    (
        SELECT COUNT(*)
        FROM pedidos
        WHERE fecha_creacion::DATE =
            CURRENT_DATE
    ) AS pedidos_hoy,

    (
        SELECT COALESCE(
            SUM(total),
            0
        )
        FROM pedidos
        WHERE fecha_creacion::DATE =
            CURRENT_DATE
          AND estado NOT IN
          (
              'CANCELADO'
          )
    ) AS ventas_hoy,

    (
        SELECT COUNT(*)
        FROM mesas
        WHERE estado = 'LIBRE'
          AND activa = TRUE
    ) AS mesas_libres,

    (
        SELECT COUNT(*)
        FROM mesas
        WHERE estado = 'OCUPADA'
          AND activa = TRUE
    ) AS mesas_ocupadas,

    (
        SELECT COUNT(*)
        FROM comandas
        WHERE estado IN
        (
            'PENDIENTE',
            'EN_PREPARACION'
        )
    ) AS comandas_pendientes;