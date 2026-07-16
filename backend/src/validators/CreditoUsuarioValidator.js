import { body } from "express-validator";

export const crearCreditoValidator=[

    body("idUsuario")
        .isInt(),

    body("monto")
        .isFloat({
            min:0.01
        }),

    body("motivo")
        .trim()
        .notEmpty()

];

export const consumirCreditoValidator=[

    body("monto")
        .isFloat({
            min:0.01
        })

];