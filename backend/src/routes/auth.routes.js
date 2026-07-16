import { Router } from "express";

import AuthController from "../controllers/AuthController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    registrarValidator,
    loginValidator,
    refreshValidator,
    logoutValidator
} from "../validators/AuthValidator.js";

const router = Router();

router.post(
    "/registrar",
    registrarValidator,
    validateRequest,
    AuthController.registrar
);

router.post(
    "/login",
    loginValidator,
    validateRequest,
    AuthController.login
);

router.post(
    "/refresh",
    refreshValidator,
    validateRequest,
    AuthController.refresh
);

router.post(
    "/logout",
    logoutValidator,
    validateRequest,
    AuthController.logout
);

router.post(
    "/logout-all",
    authMiddleware,
    AuthController.logoutAll
);

router.get(
    "/me",
    authMiddleware,
    AuthController.me
);

export default router;