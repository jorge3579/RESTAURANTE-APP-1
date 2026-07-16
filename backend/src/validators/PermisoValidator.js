import { body } from "express-validator";

export const asignarPermisosValidator = [

    body("permisos")
        .isArray()
        .withMessage("Permisos debe ser un arreglo."),

    body("permisos.*")
        .isInt({ min: 1 })
        .withMessage("Cada permiso debe ser un ID válido.")

];