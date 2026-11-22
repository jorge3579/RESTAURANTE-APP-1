import dotenv from "dotenv";

// El archivo local del backend es la fuente de configuración del proyecto.
// Evita que variables DB_* antiguas del entorno de Windows lo sobrescriban.
dotenv.config({ override: true });

function obtenerVariableObligatoria(nombre) {

    const valor = process.env[nombre];

    if (
        valor === undefined ||
        valor === null ||
        String(valor).trim() === ""
    ) {

        throw new Error(
            `La variable de entorno ${nombre} es obligatoria.`
        );

    }

    return String(valor).trim();

}

function obtenerVariableOpcional(
    nombre,
    valorPredeterminado = null
) {

    const valor = process.env[nombre];

    if (
        valor === undefined ||
        valor === null ||
        String(valor).trim() === ""
    ) {

        return valorPredeterminado;

    }

    return String(valor).trim();

}

function obtenerNumero(
    nombre,
    valorPredeterminado
) {

    const valor = obtenerVariableOpcional(
        nombre,
        String(valorPredeterminado)
    );

    const numero = Number(valor);

    if (!Number.isFinite(numero)) {

        throw new Error(
            `La variable de entorno ${nombre} debe ser numérica.`
        );

    }

    return numero;

}

function obtenerBooleano(
    nombre,
    valorPredeterminado = false
) {

    const valor = obtenerVariableOpcional(
        nombre,
        String(valorPredeterminado)
    );

    return ["true", "1", "yes", "si", "sí"].includes(
        valor.toLowerCase()
    );

}

const env = Object.freeze({

    app: Object.freeze({

        name: obtenerVariableOpcional(
            "APP_NAME",
            "SmartRestaurantQR"
        ),

        version: obtenerVariableOpcional(
            "APP_VERSION",
            "2.0.0"
        ),

        environment: obtenerVariableOpcional(
            "NODE_ENV",
            "development"
        ),

        port: obtenerNumero(
            "PORT",
            3000
        )

    }),

    database: Object.freeze({

        host: obtenerVariableObligatoria(
            "DB_HOST"
        ),

        port: obtenerNumero(
            "DB_PORT",
            5432
        ),

        name: obtenerVariableObligatoria(
            "DB_NAME"
        ),

        user: obtenerVariableObligatoria(
            "DB_USER"
        ),

        password: obtenerVariableObligatoria(
            "DB_PASSWORD"
        ),

        poolMin: obtenerNumero(
            "DB_POOL_MIN",
            0
        ),

        poolMax: obtenerNumero(
            "DB_POOL_MAX",
            20
        ),

        idleTimeout: obtenerNumero(
            "DB_IDLE_TIMEOUT",
            30000
        ),

        connectionTimeout: obtenerNumero(
            "DB_CONNECTION_TIMEOUT",
            10000
        ),

        ssl: obtenerBooleano(
            "DB_SSL",
            false
        ),

        timezone: obtenerVariableOpcional(
            "DB_TIMEZONE",
            "America/Argentina/Buenos_Aires"
        )

    }),

    jwt: Object.freeze({

        secret: obtenerVariableObligatoria(
            "JWT_SECRET"
        ),

        expires: obtenerVariableOpcional(
            "JWT_EXPIRES",
            "8h"
        ),

        refreshExpires: obtenerVariableOpcional(
            "JWT_REFRESH_EXPIRES",
            "30d"
        )

    }),

    cors: Object.freeze({

        // Lista de orígenes permitidos. El valor "*" conserva el
        // comportamiento histórico de desarrollo; en producción se
        // enumeran los dominios separados por coma.
        origins: Object.freeze(
            obtenerVariableOpcional(
                "CORS_ORIGIN",
                "*"
            )
                .split(",")
                .map((origen) => origen.trim())
                .filter((origen) => origen.length > 0)
        )

    }),

    log: Object.freeze({

        level: obtenerVariableOpcional(
            "LOG_LEVEL",
            "info"
        )

    }),

    mercadoPago: Object.freeze({

        accessToken: obtenerVariableOpcional(
            "MERCADO_PAGO_ACCESS_TOKEN"
        ),

        publicKey: obtenerVariableOpcional(
            "MERCADO_PAGO_PUBLIC_KEY"
        ),

        successUrl: obtenerVariableOpcional(
            "MERCADO_PAGO_SUCCESS_URL"
        ),

        failureUrl: obtenerVariableOpcional(
            "MERCADO_PAGO_FAILURE_URL"
        ),

        pendingUrl: obtenerVariableOpcional(
            "MERCADO_PAGO_PENDING_URL"
        ),

        webhookUrl: obtenerVariableOpcional(
            "MERCADO_PAGO_WEBHOOK_URL"
        )

    })

});

export default env;
