import { Router } from "express";

import AuditoriaController from "../controllers/AuditoriaController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/",
    AuditoriaController.listar
);

export default router;