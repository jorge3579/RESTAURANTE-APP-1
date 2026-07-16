import { Router } from "express";

import PermisoController from "../controllers/PermisoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import permissionMiddleware from "../middlewares/permissionMiddleware.js";
import validateRequest from "../validators/validateRequest.js";
import PERMISOS from "../constants/permisos.js";

import {
    asignarPermisosValidator
} from "../validators/PermisoValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    permissionMiddleware(PERMISOS.PERMISOS_LISTAR),
    PermisoController.listar
);

router.get(
    "/rol/:idRol",
    permissionMiddleware(PERMISOS.PERMISOS_LISTAR),
    PermisoController.listarPorRol
);

router.put(
    "/rol/:idRol",
    permissionMiddleware(PERMISOS.PERMISOS_ASIGNAR),
    asignarPermisosValidator,
    validateRequest,
    PermisoController.asignarPermisosARol
);

export default router;