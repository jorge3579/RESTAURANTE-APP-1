import env from "./env.js";

const application = {
    app: {
        name: env.app.name,
        version: env.app.version,
        environment: env.app.environment,
        port: env.app.port
    },
    jwt: {
        secret: env.jwt.secret,
        expiresIn: env.jwt.expires,
        refreshExpiresIn: env.jwt.refreshExpires
    },
    database: {
        host: env.database.host,
        port: env.database.port,
        name: env.database.name,
        user: env.database.user,
        password: env.database.password,
        ssl: env.database.ssl
    },
    uploads: {
        path: process.env.UPLOAD_PATH || "./uploads"
    },
    logs: {
        path: process.env.LOG_PATH || "./logs"
    }
};

export default application;
