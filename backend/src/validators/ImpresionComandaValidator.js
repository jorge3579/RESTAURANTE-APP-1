import { body } from "express-validator";

export const crearImpresionValidator = [

    body("idComanda")
        .isInt({ min: 1 })
        .withMessage("La comanda es obligatoria."),

    body("tipo")
        .trim()
        .notEmpty()
        .withMessage("El tipo de impresión es obligatorio.")
        .isLength({ max: 30 })
        .withMessage("El tipo no puede superar los 30 caracteres."),

    body("impresora")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 150 })
        .withMessage("La impresora no puede superar los 150 caracteres."),

    body("copias")
        .optional()
        .isInt({ min: 1, max: 10 })
        .withMessage("Las copias deben ser entre 1 y 10.")

];