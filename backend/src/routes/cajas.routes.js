import { Router } from "express";

import CajaController from "../controllers/CajaController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

import validateRequest from "../validators/validateRequest.js";

import {
    abrirCajaValidator,
    cerrarCajaValidator
} from "../validators/CajaValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    CajaController.listar
);

router.post(
    "/abrir",
    abrirCajaValidator,
    validateRequest,
    CajaController.abrir
);

router.put(
    "/:idCaja/cerrar",
    cerrarCajaValidator,
    validateRequest,
    CajaController.cerrar
);

export default router;