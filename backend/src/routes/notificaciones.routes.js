import {Router} from "express";

import NotificacionController
from "../controllers/NotificacionController.js";

import authMiddleware
from "../middlewares/authMiddleware.js";

import validateRequest
from "../validators/validateRequest.js";

import{
    crearNotificacionValidator
}
from "../validators/NotificacionValidator.js";

const router=Router();

router.use(authMiddleware);

router.get(
    "/",
    NotificacionController.listar
);

router.post(
    "/",
    crearNotificacionValidator,
    validateRequest,
    NotificacionController.crear
);

router.put(
    "/:idNotificacion/leida",
    NotificacionController.marcarLeida
);

router.delete(
    "/:idNotificacion",
    NotificacionController.eliminar
);

export default router;