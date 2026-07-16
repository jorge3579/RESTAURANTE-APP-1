import { body } from "express-validator";

export const crearCategoriaValidator = [

    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre de la categoría es obligatorio.")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres."),

    body("descripcion")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 255 })
        .withMessage("La descripción no puede superar los 255 caracteres."),

    body("activa")
        .optional()
        .isBoolean()
        .withMessage("El campo activa debe ser booleano.")

];

export const actualizarCategoriaValidator = crearCategoriaValidator;