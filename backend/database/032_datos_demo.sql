/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Datos funcionales de demostración
=========================================================
*/

DO
$$
DECLARE

    v_id_rol_cliente INTEGER;
    v_id_usuario INTEGER;
    v_id_nivel_bronce INTEGER;
    v_id_sucursal INTEGER;
    v_id_mesa INTEGER;
    v_id_producto INTEGER;
    v_id_reserva BIGINT;
    v_id_pedido BIGINT;
    v_id_pedido_detalle BIGINT;
    v_id_comanda BIGINT;

BEGIN

    /*
    -----------------------------------------------------
    Rol Cliente
    -----------------------------------------------------
    */

    SELECT id_rol
    INTO v_id_rol_cliente
    FROM roles
    WHERE nombre = 'Cliente';

    IF v_id_rol_cliente IS NULL
    THEN

        RAISE EXCEPTION
            'No existe el rol Cliente.';

    END IF;


    /*
    -----------------------------------------------------
    Usuario cliente de prueba
    -----------------------------------------------------
    */

    SELECT id_usuario
    INTO v_id_usuario
    FROM usuarios
    WHERE email = 'cliente.demo@smartrestaurantqr.com';

    IF v_id_usuario IS NULL
    THEN

        INSERT INTO usuarios
        (
            id_rol_principal,
            nombre,
            apellido,
            dni,
            email,
            telefono,
            password_hash,
            email_verificado,
            activo
        )
        VALUES
        (
            v_id_rol_cliente,
            'Cliente',
            'Demostración',
            '99999999',
            'cliente.demo@smartrestaurantqr.com',
            '2911111111',
            CRYPT(
                'Cliente1234!',
                GEN_SALT('bf', 12)
            ),
            TRUE,
            TRUE
        )
        RETURNING id_usuario
        INTO v_id_usuario;

    END IF;


    INSERT INTO usuario_roles
    (
        id_usuario,
        id_rol,
        es_principal,
        activo
    )
    VALUES
    (
        v_id_usuario,
        v_id_rol_cliente,
        TRUE,
        TRUE
    )
    ON CONFLICT (id_usuario, id_rol)
    DO UPDATE
    SET
        es_principal = TRUE,
        activo = TRUE;


    /*
    -----------------------------------------------------
    Puntos iniciales
    -----------------------------------------------------
    */

    SELECT id_nivel_vip
    INTO v_id_nivel_bronce
    FROM niveles_vip
    WHERE nombre = 'Bronce';

    INSERT INTO puntos_usuario
    (
        id_usuario,
        id_nivel_vip,
        puntos_disponibles,
        puntos_acumulados,
        compras_acumuladas,
        monto_acumulado
    )
    VALUES
    (
        v_id_usuario,
        v_id_nivel_bronce,
        0,
        0,
        0,
        0
    )
    ON CONFLICT (id_usuario)
    DO NOTHING;


    /*
    -----------------------------------------------------
    Obtener sucursal y mesa
    -----------------------------------------------------
    */

    SELECT id_sucursal
    INTO v_id_sucursal
    FROM sucursales
    WHERE nombre = 'Sucursal Centro';

    SELECT id_mesa
    INTO v_id_mesa
    FROM mesas
    WHERE id_sucursal = v_id_sucursal
      AND numero = '1';


    /*
    -----------------------------------------------------
    Crear reserva de mañana
    -----------------------------------------------------
    */

    SELECT id_reserva
    INTO v_id_reserva
    FROM reservas
    WHERE id_usuario = v_id_usuario
      AND fecha_reserva = CURRENT_DATE + 1
      AND hora_reserva = TIME '20:00';

    IF v_id_reserva IS NULL
    THEN

        INSERT INTO reservas
        (
            id_usuario,
            id_sucursal,
            fecha_reserva,
            hora_reserva,
            cantidad_personas,
            tipo_consumo,
            estado,
            observaciones,
            acepta_politica_cancelacion,
            acepta_politica_no_show
        )
        VALUES
        (
            v_id_usuario,
            v_id_sucursal,
            CURRENT_DATE + 1,
            TIME '20:00',
            2,
            'LOCAL',
            'CONFIRMADA',
            'Reserva creada para demostración.',
            TRUE,
            TRUE
        )
        RETURNING id_reserva
        INTO v_id_reserva;

    END IF;


    INSERT INTO reserva_mesas
    (
        id_reserva,
        id_mesa
    )
    VALUES
    (
        v_id_reserva,
        v_id_mesa
    )
    ON CONFLICT (id_reserva, id_mesa)
    DO NOTHING;


    UPDATE mesas
    SET estado = 'RESERVADA'
    WHERE id_mesa = v_id_mesa;


    /*
    -----------------------------------------------------
    Crear pedido
    -----------------------------------------------------
    */

    SELECT id_pedido
    INTO v_id_pedido
    FROM pedidos
    WHERE id_reserva = v_id_reserva;

    IF v_id_pedido IS NULL
    THEN

        INSERT INTO pedidos
        (
            id_usuario,
            id_sucursal,
            id_reserva,
            tipo_consumo,
            estado,
            subtotal,
            descuento,
            recargo,
            total,
            observaciones
        )
        VALUES
        (
            v_id_usuario,
            v_id_sucursal,
            v_id_reserva,
            'LOCAL',
            'CONFIRMADO',
            0,
            0,
            0,
            0,
            'Pedido de demostración.'
        )
        RETURNING id_pedido
        INTO v_id_pedido;

    END IF;


    /*
    -----------------------------------------------------
    Agregar producto
    -----------------------------------------------------
    */

    SELECT id_producto
    INTO v_id_producto
    FROM productos
    WHERE codigo = 'HAMB-001';

    SELECT id_pedido_detalle
    INTO v_id_pedido_detalle
    FROM pedido_detalles
    WHERE id_pedido = v_id_pedido
      AND id_producto = v_id_producto;

    IF v_id_pedido_detalle IS NULL
    THEN

        INSERT INTO pedido_detalles
        (
            id_pedido,
            id_producto,
            nombre_producto,
            cantidad,
            precio_unitario,
            descuento,
            subtotal,
            observaciones
        )
        SELECT
            v_id_pedido,
            p.id_producto,
            p.nombre,
            2,
            p.precio,
            0,
            p.precio * 2,
            'Sin cebolla.'
        FROM productos p
        WHERE p.id_producto = v_id_producto
        RETURNING id_pedido_detalle
        INTO v_id_pedido_detalle;

    END IF;


    /*
    -----------------------------------------------------
    Crear comanda
    -----------------------------------------------------
    */

    SELECT id_comanda
    INTO v_id_comanda
    FROM comandas
    WHERE id_pedido = v_id_pedido;

    IF v_id_comanda IS NULL
    THEN

        INSERT INTO comandas
        (
            id_pedido,
            id_sucursal,
            prioridad,
            estado,
            tiempo_estimado_minutos,
            observaciones
        )
        VALUES
        (
            v_id_pedido,
            v_id_sucursal,
            'NORMAL',
            'PENDIENTE',
            20,
            'Comanda de demostración.'
        )
        RETURNING id_comanda
        INTO v_id_comanda;

    END IF;


    INSERT INTO comanda_detalles
    (
        id_comanda,
        id_pedido_detalle,
        estado,
        observaciones
    )
    VALUES
    (
        v_id_comanda,
        v_id_pedido_detalle,
        'PENDIENTE',
        'Preparar sin cebolla.'
    )
    ON CONFLICT
    (
        id_comanda,
        id_pedido_detalle
    )
    DO NOTHING;


    RAISE NOTICE
        'Datos de demostración creados correctamente.';

END
$$;