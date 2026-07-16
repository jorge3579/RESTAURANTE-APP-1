import { Router } from "express";

import IngresoQRController from "../controllers/IngresoQRController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    validarQRValidator
} from "../validators/IngresoQRValidator.js";

const router = Router();

router.use(authMiddleware);

router.post(
    "/reserva/:idReserva/generar",
    IngresoQRController.generar
);

router.post(
    "/validar",
    validarQRValidator,
    validateRequest,
    IngresoQRController.validar
);

export default router;