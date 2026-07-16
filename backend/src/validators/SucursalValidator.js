import { body } from "express-validator";

export const crearSucursalValidator = [

    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre de la sucursal es obligatorio.")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres."),

    body("direccion")
        .trim()
        .notEmpty()
        .withMessage("La dirección es obligatoria.")
        .isLength({ min: 3, max: 200 })
        .withMessage("La dirección debe tener entre 3 y 200 caracteres."),

    body("telefono")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 30 })
        .withMessage("El teléfono no puede superar los 30 caracteres."),

    body("email")
        .optional({ nullable: true, checkFalsy: true })
        .isEmail()
        .withMessage("El email no es válido."),

    body("ciudad")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage("La ciudad no puede superar los 100 caracteres."),

    body("provincia")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage("La provincia no puede superar los 100 caracteres."),

    body("activo")
        .optional()
        .isBoolean()
        .withMessage("El campo activo debe ser booleano.")

];

export const actualizarSucursalValidator = crearSucursalValidator;