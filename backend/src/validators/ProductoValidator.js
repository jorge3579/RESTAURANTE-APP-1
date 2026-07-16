import { body } from "express-validator";

export const crearProductoValidator = [

    body("idCategoria")
        .isInt({ min: 1 })
        .withMessage("La categoría es obligatoria."),

    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre del producto es obligatorio.")
        .isLength({ min: 2, max: 150 })
        .withMessage("El nombre debe tener entre 2 y 150 caracteres."),

    body("descripcion")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 500 })
        .withMessage("La descripción no puede superar los 500 caracteres."),

    body("precio")
        .isFloat({ min: 0 })
        .withMessage("El precio debe ser mayor o igual a 0."),

    body("imagenUrl")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 500 })
        .withMessage("La URL de imagen no puede superar los 500 caracteres."),

    body("disponible")
        .optional()
        .isBoolean()
        .withMessage("El campo disponible debe ser booleano."),

    body("activo")
        .optional()
        .isBoolean()
        .withMessage("El campo activo debe ser booleano.")

];

export const actualizarProductoValidator = crearProductoValidator;