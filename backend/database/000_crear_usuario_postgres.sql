/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Creación del usuario de la aplicación
=========================================================

EJECUTAR CONECTADO COMO:
    postgres

BASE DE DATOS DE CONEXIÓN:
    postgres
*/

DO
$$
BEGIN

    IF NOT EXISTS
    (
        SELECT 1
        FROM pg_roles
        WHERE rolname = 'smartrestaurant_app'
    )
    THEN

        CREATE ROLE smartrestaurant_app
        WITH
        (
            LOGIN,
            PASSWORD 'CAMBIAR_CONTRASENA_SEGURA',
            NOSUPERUSER,
            NOCREATEDB,
            NOCREATEROLE,
            INHERIT
        );

        RAISE NOTICE
            'Usuario smartrestaurant_app creado correctamente.';

    ELSE

        ALTER ROLE smartrestaurant_app
        WITH
        (
            LOGIN,
            PASSWORD 'CAMBIAR_CONTRASENA_SEGURA',
            NOSUPERUSER,
            NOCREATEDB,
            NOCREATEROLE,
            INHERIT
        );

        RAISE NOTICE
            'El usuario smartrestaurant_app ya existía. Se actualizó su configuración.';

    END IF;

END
$$;
