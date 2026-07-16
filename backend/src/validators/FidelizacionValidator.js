import { body } from "express-validator";

export const sumarCompraValidator = [

    body("idUsuario")
        .isInt({ min: 1 })
        .withMessage("El usuario es obligatorio."),

    body("idPedido")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("El pedido debe ser válido."),

    body("totalPedido")
        .isFloat({ min: 0 })
        .withMessage("El total del pedido debe ser mayor o igual a 0.")

];