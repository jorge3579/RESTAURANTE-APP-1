import databaseManager from "../src/config/databaseManager.js";
import { closeDatabase } from "../src/config/database.js";

async function probarPostgreSQL() {

    try {

        console.log(
            "========================================"
        );

        console.log(
            "SmartRestaurantQR - Prueba PostgreSQL"
        );

        console.log(
            "========================================"
        );

        const conexion =
            await databaseManager.healthCheck();

        console.log(
            "Conexión correcta:"
        );

        console.table(
            [conexion]
        );


        const tablas =
            await databaseManager.query(`
                SELECT
                    table_name AS "tabla"
                FROM information_schema.tables
                WHERE table_schema = 'public'
                  AND table_type = 'BASE TABLE'
                ORDER BY table_name
            `);

        console.log(
            `Cantidad de tablas: ${tablas.length}`
        );


        const resumen =
            await databaseManager.queryOne(`
                SELECT
                    (SELECT COUNT(*) FROM usuarios)::INTEGER
                        AS "usuarios",

                    (SELECT COUNT(*) FROM roles)::INTEGER
                        AS "roles",

                    (SELECT COUNT(*) FROM sucursales)::INTEGER
                        AS "sucursales",

                    (SELECT COUNT(*) FROM mesas)::INTEGER
                        AS "mesas",

                    (SELECT COUNT(*) FROM productos)::INTEGER
                        AS "productos",

                    (SELECT COUNT(*) FROM pedidos)::INTEGER
                        AS "pedidos"
            `);

        console.log(
            "Resumen de datos:"
        );

        console.table(
            [resumen]
        );


        const administrador =
            await databaseManager.queryOne(`
                SELECT
                    u.id_usuario AS "idUsuario",
                    u.nombre,
                    u.apellido,
                    u.email,
                    r.nombre AS "rol",
                    u.activo
                FROM usuarios u
                INNER JOIN roles r
                    ON r.id_rol =
                       u.id_rol_principal
                WHERE u.email =
                    'admin@smartrestaurantqr.com'
            `);

        console.log(
            "Administrador:"
        );

        console.table(
            administrador
                ? [administrador]
                : []
        );

        console.log(
            "Prueba PostgreSQL finalizada correctamente."
        );

    } catch (error) {

        console.error(
            "Error al probar PostgreSQL:"
        );

        console.error(
            error
        );

        process.exitCode = 1;

    } finally {

        await closeDatabase();

    }

}

probarPostgreSQL();