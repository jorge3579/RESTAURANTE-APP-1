import { Router } from "express";

import UsuarioController from "../controllers/UsuarioController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

import validateRequest from "../validators/validateRequest.js";

import {

    crearUsuarioValidator,

    actualizarUsuarioValidator,

    cambiarPasswordValidator

} from "../validators/UsuarioValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    UsuarioController.listar
);

router.get(
    "/:idUsuario",
    UsuarioController.obtenerPorId
);

router.post(
    "/",
    crearUsuarioValidator,
    validateRequest,
    UsuarioController.crear
);

router.put(
    "/:idUsuario",
    actualizarUsuarioValidator,
    validateRequest,
    UsuarioController.actualizar
);

router.put(
    "/:idUsuario/password",
    cambiarPasswordValidator,
    validateRequest,
    UsuarioController.cambiarPassword
);

router.delete(
    "/:idUsuario",
    UsuarioController.eliminar
);

export default router;