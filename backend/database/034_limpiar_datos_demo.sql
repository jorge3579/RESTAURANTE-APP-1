/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Limpiar datos funcionales de demostración
=========================================================
*/

BEGIN;


DELETE FROM notificacion_dispositivos
WHERE id_notificacion IN
(
    SELECT id_notificacion
    FROM notificaciones
    WHERE id_usuario IN
    (
        SELECT id_usuario
        FROM usuarios
        WHERE email =
            'cliente.demo@smartrestaurantqr.com'
    )
);


DELETE FROM notificaciones
WHERE id_usuario IN
(
    SELECT id_usuario
    FROM usuarios
    WHERE email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM impresiones_comanda
WHERE id_comanda IN
(
    SELECT c.id_comanda
    FROM comandas c
    INNER JOIN pedidos p
        ON p.id_pedido = c.id_pedido
    INNER JOIN usuarios u
        ON u.id_usuario = p.id_usuario
    WHERE u.email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM historial_comandas
WHERE id_comanda IN
(
    SELECT c.id_comanda
    FROM comandas c
    INNER JOIN pedidos p
        ON p.id_pedido = c.id_pedido
    INNER JOIN usuarios u
        ON u.id_usuario = p.id_usuario
    WHERE u.email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM comanda_detalles
WHERE id_comanda IN
(
    SELECT c.id_comanda
    FROM comandas c
    INNER JOIN pedidos p
        ON p.id_pedido = c.id_pedido
    INNER JOIN usuarios u
        ON u.id_usuario = p.id_usuario
    WHERE u.email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM comandas
WHERE id_pedido IN
(
    SELECT p.id_pedido
    FROM pedidos p
    INNER JOIN usuarios u
        ON u.id_usuario = p.id_usuario
    WHERE u.email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM mercado_pago_preferencias
WHERE id_pedido IN
(
    SELECT p.id_pedido
    FROM pedidos p
    INNER JOIN usuarios u
        ON u.id_usuario = p.id_usuario
    WHERE u.email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM pagos
WHERE id_usuario IN
(
    SELECT id_usuario
    FROM usuarios
    WHERE email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM historial_pedidos
WHERE id_pedido IN
(
    SELECT p.id_pedido
    FROM pedidos p
    INNER JOIN usuarios u
        ON u.id_usuario = p.id_usuario
    WHERE u.email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM pedido_detalles
WHERE id_pedido IN
(
    SELECT p.id_pedido
    FROM pedidos p
    INNER JOIN usuarios u
        ON u.id_usuario = p.id_usuario
    WHERE u.email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM pedidos
WHERE id_usuario IN
(
    SELECT id_usuario
    FROM usuarios
    WHERE email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM validaciones_qr
WHERE id_ingreso_qr IN
(
    SELECT iq.id_ingreso_qr
    FROM ingresos_qr iq
    INNER JOIN reservas r
        ON r.id_reserva = iq.id_reserva
    INNER JOIN usuarios u
        ON u.id_usuario = r.id_usuario
    WHERE u.email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM ingresos_qr
WHERE id_reserva IN
(
    SELECT r.id_reserva
    FROM reservas r
    INNER JOIN usuarios u
        ON u.id_usuario = r.id_usuario
    WHERE u.email =
        'cliente.demo@smartrestaurantqr.com'
);


UPDATE mesas
SET estado = 'LIBRE'
WHERE id_mesa IN
(
    SELECT rm.id_mesa
    FROM reserva_mesas rm
    INNER JOIN reservas r
        ON r.id_reserva = rm.id_reserva
    INNER JOIN usuarios u
        ON u.id_usuario = r.id_usuario
    WHERE u.email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM reserva_mesas
WHERE id_reserva IN
(
    SELECT r.id_reserva
    FROM reservas r
    INNER JOIN usuarios u
        ON u.id_usuario = r.id_usuario
    WHERE u.email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM historial_reservas
WHERE id_reserva IN
(
    SELECT r.id_reserva
    FROM reservas r
    INNER JOIN usuarios u
        ON u.id_usuario = r.id_usuario
    WHERE u.email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM reservas
WHERE id_usuario IN
(
    SELECT id_usuario
    FROM usuarios
    WHERE email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM historial_puntos
WHERE id_usuario IN
(
    SELECT id_usuario
    FROM usuarios
    WHERE email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM puntos_usuario
WHERE id_usuario IN
(
    SELECT id_usuario
    FROM usuarios
    WHERE email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM usuario_roles
WHERE id_usuario IN
(
    SELECT id_usuario
    FROM usuarios
    WHERE email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM refresh_tokens
WHERE id_usuario IN
(
    SELECT id_usuario
    FROM usuarios
    WHERE email =
        'cliente.demo@smartrestaurantqr.com'
);


DELETE FROM usuarios
WHERE email =
    'cliente.demo@smartrestaurantqr.com';


COMMIT;