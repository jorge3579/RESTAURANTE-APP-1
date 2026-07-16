import { body } from "express-validator";

export const crearUsuarioValidator = [

    body("idRol")
        .isInt({ min: 1 })
        .withMessage("Rol inválido."),

    body("nombre")
        .trim()
        .isLength({
            min: 2,
            max: 100
        })
        .withMessage("Nombre inválido."),

    body("apellido")
        .trim()
        .isLength({
            min: 2,
            max: 100
        })
        .withMessage("Apellido inválido."),

    body("email")
        .isEmail()
        .withMessage("Correo inválido."),

    body("telefono")
        .optional()
        .isLength({
            max: 30
        }),

    body("password")
        .isLength({
            min: 6
        })
        .withMessage("La contraseña debe tener al menos 6 caracteres.")

];

export const actualizarUsuarioValidator = [

    body("idRol")
        .isInt(),

    body("nombre")
        .trim()
        .notEmpty(),

    body("apellido")
        .trim()
        .notEmpty(),

    body("telefono")
        .optional(),

    body("activo")
        .isBoolean()

];

export const cambiarPasswordValidator = [

    body("password")
        .isLength({
            min: 6
        })

];