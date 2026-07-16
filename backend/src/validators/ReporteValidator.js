import { query } from "express-validator";

export const reporteRangoValidator = [

    query("fechaDesde")
        .isISO8601()
        .withMessage("fechaDesde debe tener formato válido YYYY-MM-DD."),

    query("fechaHasta")
        .isISO8601()
        .withMessage("fechaHasta debe tener formato válido YYYY-MM-DD."),

    query("idSucursal")
        .optional()
        .isInt({ min: 1 })
        .withMessage("idSucursal debe ser válido.")

];