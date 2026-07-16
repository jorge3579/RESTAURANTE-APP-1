import { Router } from "express";

import RolController from "../controllers/RolController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    crearRolValidator,
    actualizarRolValidator
} from "../validators/RolValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    RolController.listar
);

router.get(
    "/:idRol",
    RolController.obtenerPorId
);

router.post(
    "/",
    crearRolValidator,
    validateRequest,
    RolController.crear
);

router.put(
    "/:idRol",
    actualizarRolValidator,
    validateRequest,
    RolController.actualizar
);

router.delete(
    "/:idRol",
    RolController.eliminar
);

export default router;