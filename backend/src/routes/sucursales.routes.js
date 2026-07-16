import { Router } from "express";

import SucursalController from "../controllers/SucursalController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    crearSucursalValidator,
    actualizarSucursalValidator
} from "../validators/SucursalValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    SucursalController.listar
);

router.get(
    "/:idSucursal/horarios",
    SucursalController.listarHorarios
);

router.put(
    "/:idSucursal/horarios",
    SucursalController.guardarHorarios
);

router.get(
    "/:idSucursal",
    SucursalController.obtenerPorId
);

router.post(
    "/",
    crearSucursalValidator,
    validateRequest,
    SucursalController.crear
);

router.put(
    "/:idSucursal",
    actualizarSucursalValidator,
    validateRequest,
    SucursalController.actualizar
);

router.delete(
    "/:idSucursal",
    SucursalController.eliminar
);

export default router;
