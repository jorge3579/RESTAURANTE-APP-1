import { body } from "express-validator";

export const crearRolValidator = [

    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre del rol es obligatorio.")
        .isLength({ min: 2, max: 50 })
        .withMessage("El nombre debe tener entre 2 y 50 caracteres."),

    body("descripcion")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 200 })
        .withMessage("La descripción no puede superar los 200 caracteres."),

    body("activo")
        .optional()
        .isBoolean()
        .withMessage("El campo activo debe ser booleano.")

];

export const actualizarRolValidator = crearRolValidator;