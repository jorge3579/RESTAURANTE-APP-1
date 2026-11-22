import { Router } from "express";

import MercadoPagoController from "../controllers/MercadoPagoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    crearPreferenciaValidator
} from "../validators/MercadoPagoValidator.js";

const router = Router();

router.post(
    "/webhook",
    MercadoPagoController.webhook
);

router.use(authMiddleware);

router.post(
    "/simulacion/aprobar",
    crearPreferenciaValidator,
    validateRequest,
    MercadoPagoController.simularAprobacion
);

router.post(
    "/preferencia",
    crearPreferenciaValidator,
    validateRequest,
    MercadoPagoController.crearPreferencia
);

router.get(
    "/preferencia/pedido/:idPedido",
    MercadoPagoController.obtenerPorPedido
);

export default router;
