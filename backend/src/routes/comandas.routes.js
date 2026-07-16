import { Router } from "express";

import ComandaController from "../controllers/ComandaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    crearComandaValidator,
    cambiarEstadoComandaValidator
} from "../validators/ComandaValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    ComandaController.listar
);

router.get(
    "/sucursal/:idSucursal",
    ComandaController.listarPorSucursal
);

router.get(
    "/:idComanda",
    ComandaController.obtenerPorId
);

router.post(
    "/",
    crearComandaValidator,
    validateRequest,
    ComandaController.crear
);

router.put(
    "/:idComanda/estado",
    cambiarEstadoComandaValidator,
    validateRequest,
    ComandaController.cambiarEstado
);

export default router;