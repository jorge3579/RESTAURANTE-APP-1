import pool from "./database.js";

function camelizarNombre(nombre) {

    return nombre.replace(
        /_([a-z0-9])/g,
        (_, caracter) => caracter.toUpperCase()
    );

}

function normalizarFila(fila) {

    if (!fila || typeof fila !== "object") {
        return fila;
    }

    return Object.fromEntries(
        Object.entries(fila).map(([clave, valor]) => [
            camelizarNombre(clave),
            valor
        ])
    );

}

function normalizarFilas(filas = []) {

    return filas.map(normalizarFila);

}

class DatabaseManager {

    async query(
        sql,
        valores = [],
        cliente = null
    ) {

        const ejecutor = cliente || pool;

        const resultado = await ejecutor.query(
            sql,
            valores
        );

        return normalizarFilas(resultado.rows);

    }

    async queryOne(
        sql,
        valores = [],
        cliente = null
    ) {

        const filas = await this.query(
            sql,
            valores,
            cliente
        );

        return filas[0] || null;

    }

    async execute(
        sql,
        valores = [],
        cliente = null
    ) {

        const ejecutor = cliente || pool;

        const resultado = await ejecutor.query(
            sql,
            valores
        );

        return {

            rowCount:
                resultado.rowCount,

            rows:
                normalizarFilas(resultado.rows),

            command:
                resultado.command

        };

    }

    async exists(
        sql,
        valores = [],
        cliente = null
    ) {

        const resultado = await this.queryOne(
            sql,
            valores,
            cliente
        );

        return Boolean(resultado);

    }

    async transaction(callback) {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            const transaccion = {

                query: async (
                    sql,
                    valores = []
                ) => {

                    const resultado =
                        await client.query(
                            sql,
                            valores
                        );

                    return normalizarFilas(resultado.rows);

                },

                queryOne: async (
                    sql,
                    valores = []
                ) => {

                    const resultado =
                        await client.query(
                            sql,
                            valores
                        );

                    return normalizarFila(resultado.rows[0]) || null;

                },

                execute: async (
                    sql,
                    valores = []
                ) => {

                    const resultado =
                        await client.query(
                            sql,
                            valores
                        );

                    return {

                        rowCount:
                            resultado.rowCount,

                        rows:
                            normalizarFilas(resultado.rows),

                        command:
                            resultado.command

                    };

                }

            };

            const resultado =
                await callback(transaccion);

            await client.query("COMMIT");

            return resultado;

        } catch (error) {

            try {

                await client.query("ROLLBACK");

            } catch {

                /*
                El error original es más importante que
                un posible error al ejecutar ROLLBACK.
                */

            }

            throw error;

        } finally {

            client.release();

        }

    }

    async healthCheck() {

        const resultado = await this.queryOne(`
            SELECT
                CURRENT_DATABASE() AS "baseDatos",
                CURRENT_USER AS usuario,
                CURRENT_TIMESTAMP AS fecha,
                1 AS estado
        `);

        return resultado;

    }

    async close() {

        await pool.end();

    }

}

const databaseManager =
    new DatabaseManager();

export default databaseManager;
