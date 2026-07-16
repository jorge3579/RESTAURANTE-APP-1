import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";


import env from "./env.js";
import requestIdMiddleware from "../middlewares/requestIdMiddleware.js";

export function configureCoreMiddlewares(app) {

    app.use(helmet());

    app.use(compression());

    app.use(
        cors({
            origin: env.cors.origin,
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