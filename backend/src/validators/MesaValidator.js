import { body } from "express-validator";
import ESTADO_MESA from "../constants/estadoMesa.js";

export const crearMesaValidator = [

    body("idSucursal")
        .isInt({ min: 1 })
        .withMessage("La sucursal es obligatoria."),

    body("numero")
        .trim()
        .notEmpty()
        .withMessage("El número de mesa es obligatorio.")
        .isLength({ max: 20 })
        .withMessage("El número de mesa no puede superar los 20 caracteres."),

    body("capacidad")
        .isInt({ min: 1, max: 50 })
        .withMessage("La capacidad debe ser entre 1 y 50 personas."),

    body("ubicacion")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage("La ubicación no puede superar los 100 caracteres.")

];

export const actualizarMesaValidator = [

    body("numero")
        .trim()
        .notEmpty()
        .withMessage("El número de mesa es obligatorio.")
        .isLength({ max: 20 })
        .withMessage("El número de mesa no puede superar los 20 caracteres."),

    body("capacidad")
        .isInt({ min: 1, max: 50 })
        .withMessage("La capacidad debe ser entre 1 y 50 personas."),

    body("ubicacion")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 100 })
        .withMessage("La ubicación no puede superar los 100 caracteres."),

    body("estado")
        .isIn(Object.values(ESTADO_MESA))
        .withMessage("Estado de mesa inválido."),

    body("activa")
        .isBoolean()
        .withMessage("El campo activa debe ser booleano.")

];