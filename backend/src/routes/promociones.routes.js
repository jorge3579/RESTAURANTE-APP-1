import { Router } from "express";

import PromocionController from "../controllers/PromocionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    crearPromocionValidator,
    actualizarPromocionValidator
} from "../validators/PromocionValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    PromocionController.listar
);

router.get(
    "/activas",
    PromocionController.listarActivas
);

router.get(
    "/:idPromocion",
    PromocionController.obtenerPorId
);

router.post(
    "/",
    crearPromocionValidator,
    validateRequest,
    PromocionController.crear
);

router.put(
    "/:idPromocion",
    actualizarPromocionValidator,
    validateRequest,
    PromocionController.actualizar
);

router.delete(
    "/:idPromocion",
    PromocionController.eliminar
);

export default router;