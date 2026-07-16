import { Router } from "express";

import ImpresionComandaController from "../controllers/ImpresionComandaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    crearImpresionValidator
} from "../validators/ImpresionComandaValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/pendientes",
    ImpresionComandaController.pendientes
);

router.post(
    "/",
    crearImpresionValidator,
    validateRequest,
    ImpresionComandaController.crear
);

export default router;