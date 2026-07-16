import { Router } from "express";

import PagoController from "../controllers/PagoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    crearPagoValidator,
    actualizarEstadoPagoValidator
} from "../validators/PagoValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    PagoController.listar
);

router.get(
    "/:idPago",
    PagoController.obtenerPorId
);

router.get(
    "/pedido/:idPedido",
    PagoController.listarPorPedido
);

router.post(
    "/",
    crearPagoValidator,
    validateRequest,
    PagoController.crear
);

router.put(
    "/:idPago/aprobar",
    actualizarEstadoPagoValidator,
    validateRequest,
    PagoController.aprobar
);

router.put(
    "/:idPago/rechazar",
    actualizarEstadoPagoValidator,
    validateRequest,
    PagoController.rechazar
);

router.put(
    "/:idPago/cancelar",
    PagoController.cancelar
);

export default router;