import { Router } from "express";

import ProductoController from "../controllers/ProductoController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";
import productoImagenMiddleware from "../middlewares/productoImagenMiddleware.js";

import {
    crearProductoValidator,
    actualizarProductoValidator
} from "../validators/ProductoValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    ProductoController.listar
);

router.post(
    "/imagen",
    productoImagenMiddleware,
    ProductoController.subirImagen
);

router.get(
    "/disponibles",
    ProductoController.listarDisponibles
);

router.get(
    "/categoria/:idCategoria",
    ProductoController.listarPorCategoria
);

router.get(
    "/:idProducto",
    ProductoController.obtenerPorId
);

router.post(
    "/",
    crearProductoValidator,
    validateRequest,
    ProductoController.crear
);

router.put(
    "/:idProducto",
    actualizarProductoValidator,
    validateRequest,
    ProductoController.actualizar
);

router.delete(
    "/:idProducto",
    ProductoController.eliminar
);

export default router;
