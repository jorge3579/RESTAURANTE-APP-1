import { body } from "express-validator";

export const actualizarConfiguracionValidator = [

    body("valor")
        .notEmpty()
        .withMessage("El valor es obligatorio.")

];