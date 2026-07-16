import { body } from "express-validator";

export const registrarValidator = [

    body("nombre")
        .notEmpty()
        .withMessage("El nombre es obligatorio.")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres."),

    body("apellido")
        .notEmpty()
        .withMessage("El apellido es obligatorio.")
        .isLength({ min: 2, max: 100 })
        .withMessage("El apellido debe tener entre 2 y 100 caracteres."),

    body("email")
        .notEmpty()
        .withMessage("El email es obligatorio.")
        .isEmail()
        .withMessage("El email no es válido.")
        .normalizeEmail(),

    body("telefono")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 30 })
        .withMessage("El teléfono no puede superar los 30 caracteres."),

    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria.")
        .isLength({ min: 6, max: 100 })
        .withMessage("La contraseña debe tener entre 6 y 100 caracteres.")

];

export const loginValidator = [

    body("email")
        .notEmpty()
        .withMessage("El email es obligatorio.")
        .isEmail()
        .withMessage("El email no es válido.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria.")

];

export const refreshValidator = [

    body("refreshToken")
        .notEmpty()
        .withMessage("El refresh token es obligatorio.")

];

export const logoutValidator = refreshValidator;