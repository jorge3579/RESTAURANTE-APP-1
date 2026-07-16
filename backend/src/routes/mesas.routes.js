import { Router } from "express";

import MesaController from "../controllers/MesaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    crearMesaValidator,
    actualizarMesaValidator
} from "../validators/MesaValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    MesaController.listar
);

router.get(
    "/sucursal/:idSucursal",
    MesaController.listarPorSucursal
);

router.get(
    "/:idMesa",
    MesaController.obtenerPorId
);

router.post(
    "/",
    crearMesaValidator,
    validateRequest,
    MesaController.crear
);

router.put(
    "/:idMesa",
    actualizarMesaValidator,
    validateRequest,
    MesaController.actualizar
);

router.delete(
    "/:idMesa",
    MesaController.eliminar
);

export default router;