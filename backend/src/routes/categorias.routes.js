import { Router } from "express";

import CategoriaController from "../controllers/CategoriaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    crearCategoriaValidator,
    actualizarCategoriaValidator
} from "../validators/CategoriaValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    CategoriaController.listar
);

router.get(
    "/:idCategoria",
    CategoriaController.obtenerPorId
);

router.post(
    "/",
    crearCategoriaValidator,
    validateRequest,
    CategoriaController.crear
);

router.put(
    "/:idCategoria",
    actualizarCategoriaValidator,
    validateRequest,
    CategoriaController.actualizar
);

router.delete(
    "/:idCategoria",
    CategoriaController.eliminar
);

export default router;