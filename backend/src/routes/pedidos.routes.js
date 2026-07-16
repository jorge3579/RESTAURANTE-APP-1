import { Router } from "express";

import PedidoController
from "../controllers/PedidoController.js";

import authMiddleware
from "../middlewares/authMiddleware.js";

import validateRequest
from "../validators/validateRequest.js";

import {

    crearPedidoValidator,

    cambiarEstadoValidator

}
from "../validators/PedidoValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    PedidoController.listar
);

router.get(
    "/mis-pedidos",
    PedidoController.listarMios
);

router.get(
    "/:idPedido",
    PedidoController.obtenerPorId
);

router.post(
    "/",
    crearPedidoValidator,
    validateRequest,
    PedidoController.crear
);

router.put(
    "/:idPedido/estado",
    cambiarEstadoValidator,
    validateRequest,
    PedidoController.cambiarEstado
);

export default router;
