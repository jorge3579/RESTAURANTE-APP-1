import { Router } from "express";

import SystemVersionController from "../controllers/SystemVersionController.js";

const router = Router();

router.get(

    "/",

    SystemVersionController.obtener

);

export default router;