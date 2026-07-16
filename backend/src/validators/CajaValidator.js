import { body } from "express-validator";

export const abrirCajaValidator = [

    body("idSucursal")
        .isInt({ min: 1 })
        .withMessage("La sucursal es obligatoria."),

    body("montoInicial")
        .isFloat({ min: 0 })
        .withMessage("Monto inicial inválido.")

];

export const cerrarCajaValidator = [

    body("montoFinal")
        .isFloat({ min: 0 })
        .withMessage("Monto final inválido.")

];