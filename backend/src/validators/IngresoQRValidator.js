import { body } from "express-validator";

export const validarQRValidator = [

    body("codigoQR")
        .notEmpty(),

    body("dispositivo")
        .optional()

];