/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Usuario administrador inicial
=========================================================

USUARIO:
    admin@smartrestaurantqr.com

CONTRASEÑA TEMPORAL:
    Admin1234!

IMPORTANTE:
    Cambiar la contraseña después del primer ingreso.
=========================================================
*/

DO
$$
DECLARE

    v_id_rol INTEGER;

    v_id_usuario INTEGER;

BEGIN

    SELECT id_rol
    INTO v_id_rol
    FROM roles
    WHERE nombre = 'Administrador';

    IF v_id_rol IS NULL
    THEN

        RAISE EXCEPTION
            'No existe el rol Administrador. Ejecute primero 005_seed_seguridad.sql';

    END IF;


    SELECT id_usuario
    INTO v_id_usuario
    FROM usuarios
    WHERE email =
        'admin@smartrestaurantqr.com';


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
            v_id_rol,
            'Administrador',
            'Sistema',
            NULL,
            'admin@smartrestaurantqr.com',
            '2910000000',
            CRYPT(
                'Admin1234!',
                GEN_SALT(
                    'bf',
                    12
                )
            ),
            TRUE,
            TRUE
        )
        RETURNING id_usuario
        INTO v_id_usuario;

    ELSE

        UPDATE usuarios
        SET
            id_rol_principal = v_id_rol,
            nombre = 'Administrador',
            apellido = 'Sistema',
            telefono = '2910000000',
            password_hash =
                CRYPT(
                    'Admin1234!',
                    GEN_SALT(
                        'bf',
                        12
                    )
                ),
            email_verificado = TRUE,
            activo = TRUE
        WHERE id_usuario = v_id_usuario;

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
        v_id_rol,
        TRUE,
        TRUE
    )
    ON CONFLICT
    (
        id_usuario,
        id_rol
    )
    DO UPDATE
    SET
        es_principal = TRUE,
        activo = TRUE,
        fecha_modificacion =
            CURRENT_TIMESTAMP;


    INSERT INTO puntos_usuario
    (
        id_usuario,
        id_nivel_vip,
        puntos_disponibles,
        puntos_acumulados,
        compras_acumuladas,
        monto_acumulado
    )
    SELECT
        v_id_usuario,
        nv.id_nivel_vip,
        0,
        0,
        0,
        0
    FROM niveles_vip nv
    WHERE nv.nombre = 'Bronce'
    ON CONFLICT (id_usuario)
    DO NOTHING;


    RAISE NOTICE
        'Administrador creado o actualizado correctamente.';

END
$$;