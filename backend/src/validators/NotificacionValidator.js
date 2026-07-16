import { body } from "express-validator";

import TIPO_NOTIFICACION
from "../constants/tipoNotificacion.js";

export const crearNotificacionValidator=[

    body("idUsuario")
        .isInt(),

    body("titulo")
        .trim()
        .notEmpty()
        .isLength({
            max:150
        }),

    body("mensaje")
        .trim()
        .notEmpty()
        .isLength({
            max:1000
        }),

    body("tipo")
        .isIn(
            Object.values(
                TIPO_NOTIFICACION
            )
        )

];