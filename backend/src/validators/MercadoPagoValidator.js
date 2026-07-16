import { body } from "express-validator";

export const crearPreferenciaValidator = [

    body("idPedido")
        .isInt({ min: 1 })
        .withMessage("El pedido es obligatorio.")

];