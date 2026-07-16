import { Router } from "express";

import ReservaController from "../controllers/ReservaController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    crearReservaValidator
} from "../validators/ReservaValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    ReservaController.listar
);

router.get(
    "/mis-reservas",
    ReservaController.misReservas
);

router.get(
    "/:idReserva",
    ReservaController.obtenerPorId
);

router.post(
    "/",
    crearReservaValidator,
    validateRequest,
    ReservaController.crear
);

router.put(
    "/:idReserva/confirmar",
    ReservaController.confirmar
);

router.put(
    "/:idReserva/cancelar",
    ReservaController.cancelar
);

router.put(
    "/:idReserva/finalizar",
    ReservaController.finalizar
);

router.put(
    "/:idReserva/no-asistio",
    ReservaController.marcarNoAsistio
);

export default router;
