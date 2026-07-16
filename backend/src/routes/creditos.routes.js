import {Router} from "express";

import CreditoUsuarioController
from "../controllers/CreditoUsuarioController.js";

import authMiddleware
from "../middlewares/authMiddleware.js";

import validateRequest
from "../validators/validateRequest.js";

import{

    crearCreditoValidator,

    consumirCreditoValidator

}
from "../validators/CreditoUsuarioValidator.js";

const router=Router();

router.use(authMiddleware);

router.get(
    "/",
    CreditoUsuarioController.listar
);

router.get(
    "/mis-creditos",
    CreditoUsuarioController.misCreditos
);

router.post(
    "/",
    crearCreditoValidator,
    validateRequest,
    CreditoUsuarioController.crear
);

router.put(
    "/:idCredito/consumir",
    consumirCreditoValidator,
    validateRequest,
    CreditoUsuarioController.consumir
);

export default router;