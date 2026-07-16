import { body } from "express-validator";

export const crearReservaValidator = [

    body("idSucursal")
        .isInt({ min: 1 })
        .withMessage("La sucursal es obligatoria."),

    body("fechaReserva")
        .notEmpty()
        .withMessage("La fecha de reserva es obligatoria.")
        .isISO8601()
        .withMessage("La fecha debe tener formato válido YYYY-MM-DD."),

    body("horaReserva")
        .notEmpty()
        .withMessage("La hora de reserva es obligatoria.")
        .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/)
        .withMessage("La hora debe tener formato HH:mm o HH:mm:ss."),

    body("cantidadPersonas")
        .isInt({ min: 1, max: 50 })
        .withMessage("La cantidad de personas debe ser entre 1 y 50."),

    body("observaciones")
        .optional({ nullable: true, checkFalsy: true })
        .isLength({ max: 500 })
        .withMessage("Las observaciones no pueden superar los 500 caracteres.")

];