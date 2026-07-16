import jwt from "jsonwebtoken";

import env from "../config/env.js";
import AppError from "../utils/AppError.js";

export default function authMiddleware(req, res, next) {
    try {
        const authorization = req.headers.authorization;

        if (!authorization) {
            throw new AppError(
                "Token de autenticación no proporcionado.",
                401
            );
        }

        const [scheme, token] = authorization.split(" ");

        if (scheme !== "Bearer" || !token) {
            throw new AppError(
                "Formato de token inválido. Use: Bearer TOKEN",
                401
            );
        }

        const payload = jwt.verify(
            token,
            env.jwt.secret
        );

        req.user = payload;
        req.usuario = payload;

        next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return next(
                new AppError(
                    "Token inválido o expirado.",
                    401
                )
            );
        }

        return next(error);
    }
}