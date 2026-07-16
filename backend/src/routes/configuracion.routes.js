import { Router } from "express";

import ConfiguracionSistemaController from "../controllers/ConfiguracionSistemaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    actualizarConfiguracionValidator
} from "../validators/ConfiguracionSistemaValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    ConfiguracionSistemaController.listar
);

router.get(
    "/:clave",
    ConfiguracionSistemaController.obtenerPorClave
);

router.put(
    "/:clave",
    actualizarConfiguracionValidator,
    validateRequest,
    ConfiguracionSistemaController.actualizar
);

export default router;