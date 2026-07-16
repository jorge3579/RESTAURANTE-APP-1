import { body } from "express-validator";

import TIPO_CONSUMO
from "../constants/tipoConsumo.js";

import ESTADO_PEDIDO
from "../constants/estadoPedido.js";

export const crearPedidoValidator = [

    body("idSucursal")
        .isInt(),

    body("tipoConsumo")
        .isIn(
            Object.values(
                TIPO_CONSUMO
            )
        ),

    body("detalles")
        .isArray({
            min: 1
        }),

    body("detalles.*.idProducto")
        .isInt(),

    body("detalles.*.cantidad")
        .isInt({
            min: 1
        }),

    body("detalles.*.precioUnitario")
        .optional()
        .isFloat({
            min: 0
        })

];

export const cambiarEstadoValidator = [

    body("estado")
        .isIn(
            Object.values(
                ESTADO_PEDIDO
            )
        )

];
