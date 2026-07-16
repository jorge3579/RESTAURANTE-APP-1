import { Router } from "express";

import FidelizacionController from "../controllers/FidelizacionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    sumarCompraValidator
} from "../validators/FidelizacionValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/niveles-vip",
    FidelizacionController.listarNivelesVIP
);

router.get(
    "/mis-puntos",
    FidelizacionController.misPuntos
);

router.get(
    "/historial",
    FidelizacionController.historial
);

router.get(
    "/usuario/:idUsuario",
    FidelizacionController.puntosUsuario
);

router.post(
    "/sumar-compra",
    sumarCompraValidator,
    validateRequest,
    FidelizacionController.sumarCompra
);

router.post(
    "/canjear-premio",
    FidelizacionController.canjearPremio
);

export default router;