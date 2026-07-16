import { body } from "express-validator";

import ESTADO_COMANDA from "../constants/estadoComanda.js";

export const crearComandaValidator = [

    body("idPedido")
        .isInt({ min: 1 })
        .withMessage("El pedido es obligatorio."),

    body("idSucursal")
        .isInt({ min: 1 })
        .withMessage("La sucursal es obligatoria."),

    body("tiempoEstimadoMinutos")
        .optional({ nullable: true })
        .isInt({ min: 1, max: 300 })
        .withMessage("El tiempo estimado debe ser entre 1 y 300 minutos."),

    body("observaciones")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 500 })
        .withMessage("Las observaciones no pueden superar los 500 caracteres.")

];

export const cambiarEstadoComandaValidator = [

    body("estado")
        .isIn(Object.values(ESTADO_COMANDA))
        .withMessage("Estado de comanda inválido."),

    body("tiempoEstimadoMinutos")
        .optional({ nullable: true })
        .isInt({ min: 1, max: 300 })
        .withMessage("El tiempo estimado debe ser entre 1 y 300 minutos.")

];