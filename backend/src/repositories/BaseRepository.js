export default class BaseRepository {

    constructor(databaseManager) {

        if (!databaseManager) {

            throw new Error(
                "BaseRepository requiere databaseManager."
            );

        }

        this.databaseManager =
            databaseManager;

    }

    convertirParametros(
        sql,
        parametros = {}
    ) {

        if (Array.isArray(parametros)) {

            return {

                sql,

                valores:
                    parametros.map(
                        (valor) =>
                            valor === undefined
                                ? null
                                : valor
                    )

            };

        }

        if (
            parametros === null ||
            parametros === undefined
        ) {

            return {
                sql,
                valores: []
            };

        }

        if (typeof parametros !== "object") {

            throw new TypeError(
                "Los parámetros SQL deben ser un objeto o un arreglo."
            );

        }

        const valores = [];

        const posiciones =
            new Map();

        const sqlConvertido = sql.replace(

            /@([a-zA-Z_][a-zA-Z0-9_]*)/g,

            (
                coincidencia,
                nombreParametro
            ) => {

                if (
                    !Object.prototype.hasOwnProperty.call(
                        parametros,
                        nombreParametro
                    )
                ) {

                    throw new Error(
                        `Falta el parámetro SQL @${nombreParametro}.`
                    );

                }

                if (
                    !posiciones.has(
                        nombreParametro
                    )
                ) {

                    const valor =
                        parametros[nombreParametro];

                    valores.push(
                        valor === undefined
                            ? null
                            : valor
                    );

                    posiciones.set(
                        nombreParametro,
                        valores.length
                    );

                }

                return `$${posiciones.get(
                    nombreParametro
                )}`;

            }

        );

        return {

            sql: sqlConvertido,

            valores

        };

    }

    prepararConsulta(
        sql,
        parametros = {}
    ) {

        if (
            typeof sql !== "string" ||
            sql.trim() === ""
        ) {

            throw new TypeError(
                "La consulta SQL no puede estar vacía."
            );

        }

        return this.convertirParametros(
            sql,
            parametros
        );

    }

    async query(
        sql,
        parametros = {},
        transaction = null
    ) {

        const consulta =
            this.prepararConsulta(
                sql,
                parametros
            );

        const ejecutor =
            transaction ||
            this.databaseManager;

        return await ejecutor.query(
            consulta.sql,
            consulta.valores
        );

    }

    async queryOne(
        sql,
        parametros = {},
        transaction = null
    ) {

        const consulta =
            this.prepararConsulta(
                sql,
                parametros
            );

        const ejecutor =
            transaction ||
            this.databaseManager;

        if (
            typeof ejecutor.queryOne ===
            "function"
        ) {

            return await ejecutor.queryOne(
                consulta.sql,
                consulta.valores
            );

        }

        const filas =
            await ejecutor.query(
                consulta.sql,
                consulta.valores
            );

        return filas[0] || null;

    }

    async execute(
        sql,
        parametros = {},
        transaction = null
    ) {

        const consulta =
            this.prepararConsulta(
                sql,
                parametros
            );

        const ejecutor =
            transaction ||
            this.databaseManager;

        return await ejecutor.execute(
            consulta.sql,
            consulta.valores
        );

    }

    async exists(
        sql,
        parametros = {},
        transaction = null
    ) {

        const resultado =
            await this.queryOne(
                sql,
                parametros,
                transaction
            );

        return Boolean(resultado);

    }

}
