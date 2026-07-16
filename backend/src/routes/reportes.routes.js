import { Router } from "express";

import ReporteController from "../controllers/ReporteController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validateRequest from "../validators/validateRequest.js";

import {
    reporteRangoValidator
} from "../validators/ReporteValidator.js";

const router = Router();

router.use(authMiddleware);

router.get(
    "/general",
    reporteRangoValidator,
    validateRequest,
    ReporteController.general
);

router.get(
    "/excel",
    reporteRangoValidator,
    validateRequest,
    ReporteController.excel
);

router.get(
    "/pdf",
    reporteRangoValidator,
    validateRequest,
    ReporteController.pdf
);

export default router;