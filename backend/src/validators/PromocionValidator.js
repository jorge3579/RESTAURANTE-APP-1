import { body } from "express-validator";

import TIPO_PROMOCION from "../constants/tipoPromocion.js";

export const crearPromocionValidator = [

    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre de la promoción es obligatorio.")
        .isLength({ min: 2, max: 150 })
        .withMessage("El nombre debe tener entre 2 y 150 caracteres."),

    body("descripcion")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 500 })
        .withMessage("La descripción no puede superar los 500 caracteres."),

    body("tipo")
        .isIn(Object.values(TIPO_PROMOCION))
        .withMessage("Tipo de promoción inválido."),

    body("valor")
        .isFloat({ min: 0 })
        .withMessage("El valor debe ser mayor o igual a 0."),

    body("fechaInicio")
        .isISO8601()
        .withMessage("La fecha de inicio debe tener formato válido."),

    body("fechaFin")
        .isISO8601()
        .withMessage("La fecha de fin debe tener formato válido."),

    body("activa")
        .optional()
        .isBoolean()
        .withMessage("El campo activa debe ser booleano."),

    body("combinable")
        .optional()
        .isBoolean()
        .withMessage("El campo combinable debe ser booleano.")

];

export const actualizarPromocionValidator = crearPromocionValidator;