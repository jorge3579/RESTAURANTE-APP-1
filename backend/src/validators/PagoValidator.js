import { body } from "express-validator";

import METODO_PAGO from "../constants/metodoPago.js";

export const crearPagoValidator = [

    body("idPedido")
        .isInt({ min: 1 })
        .withMessage("El pedido es obligatorio."),

    body("metodoPago")
        .isIn(Object.values(METODO_PAGO))
        .withMessage("Método de pago inválido."),

    body("proveedor")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 50 })
        .withMessage("El proveedor no puede superar los 50 caracteres."),

    body("referenciaExterna")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 255 })
        .withMessage("La referencia externa no puede superar los 255 caracteres."),

    body("monto")
        .isFloat({ min: 0.01 })
        .withMessage("El monto debe ser mayor a 0.")

];

export const actualizarEstadoPagoValidator = [

    body("referenciaExterna")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 255 })
        .withMessage("La referencia externa no puede superar los 255 caracteres.")

];