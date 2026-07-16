import pg from "pg";

import env from "./env.js";
import Logger from "../utils/Logger.js";

const { Pool } = pg;

const pool = new Pool({

    host: env.database.host,

    port: env.database.port,

    database: env.database.name,

    user: env.database.user,

    password: env.database.password,

    min: env.database.poolMin,

    max: env.database.poolMax,

    idleTimeoutMillis:
        env.database.idleTimeout,

    connectionTimeoutMillis:
        env.database.connectionTimeout,

    allowExitOnIdle:
        env.app.environment === "test",

    application_name:
        env.app.name,

    options:
        `-c timezone=${env.database.timezone}`,

    ssl: env.database.ssl
        ? {
              rejectUnauthorized: false
          }
        : false

});

pool.on("error", (error) => {

    Logger.error(
        `Error inesperado en el pool PostgreSQL: ${error.message}`
    );

});

export async function connectDatabase() {

    const client = await pool.connect();

    try {

        const resultado = await client.query(`
            SELECT
                CURRENT_DATABASE() AS base_datos,
                CURRENT_USER AS usuario,
                CURRENT_SETTING('server_version') AS version,
                CURRENT_SETTING('TimeZone') AS zona_horaria,
                CURRENT_TIMESTAMP AS fecha_hora
        `);

        const informacion = resultado.rows[0];

        Logger.info(
            `PostgreSQL conectado correctamente.`
        );

        Logger.info(
            `Base: ${informacion.base_datos}`
        );

        Logger.info(
            `Usuario: ${informacion.usuario}`
        );

        Logger.info(
            `Versión PostgreSQL: ${informacion.version}`
        );

        Logger.info(
            `Zona horaria: ${informacion.zona_horaria}`
        );

        return informacion;

    } finally {

        client.release();

    }

}

export async function closeDatabase() {

    await pool.end();

    Logger.info(
        "Pool PostgreSQL cerrado correctamente."
    );

}

export default pool;
