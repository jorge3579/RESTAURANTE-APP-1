import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

import env from "../config/env.js";

export function generarAccessToken(usuario) {

    return jwt.sign(
        {
            idUsuario: usuario.idUsuario,
            idRol: usuario.idRol,
            email: usuario.email,
            nombre: usuario.nombre,
            apellido: usuario.apellido
        },
        env.jwt.secret,
        {
            expiresIn: env.jwt.expires
        }
    );

}

export function generarRefreshToken() {

    return uuid();

}

export function verificarAccessToken(token) {

    return jwt.verify(token, env.jwt.secret);

}