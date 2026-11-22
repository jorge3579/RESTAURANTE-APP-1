import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";


import env from "./env.js";
import requestIdMiddleware from "../middlewares/requestIdMiddleware.js";

// Las aplicaciones móviles nativas no envían la cabecera Origin, por lo que
// denegar las peticiones sin Origin rompería los APK ya distribuidos.
// Solo se restringen los orígenes de navegador, que son los que aplican CORS.
function crearValidadorOrigen(origenesPermitidos) {

    if (origenesPermitidos.includes("*")) {

        return true;

    }

    return (origin, callback) => {

        if (!origin) {

            return callback(null, true);

        }

        return callback(
            null,
            origenesPermitidos.includes(origin)
        );

    };

}

const validarOrigen = crearValidadorOrigen(
    env.cors.origins
);

export function configureCoreMiddlewares(app) {

    app.use(helmet());

    app.use(compression());

    app.use(
        cors({
            origin: validarOrigen,
            credentials: true
        })
    );

    app.use(cookieParser());

    app.use(
        express.json({
            limit: "10mb"
        })
    );

    app.use(
        express.urlencoded({
            extended: true,
            limit: "10mb"
        })
    );

    app.use(requestIdMiddleware);

    app.use(morgan("dev"));

    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 500,
            standardHeaders: true,
            legacyHeaders: false,
            message: {
                success: false,
                message: "Demasiadas solicitudes. Intente nuevamente más tarde."
            }
        })
    );

}