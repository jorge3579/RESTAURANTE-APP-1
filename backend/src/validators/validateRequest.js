import { validationResult } from "express-validator";

import AppError from "../utils/AppError.js";

export default function validateRequest(req, res, next) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        const formattedErrors = errors.array().map((error) => ({
            field: error.path,
            message: error.msg
        }));

        return next(
            new AppError(
                "Error de validación.",
                422,
                formattedErrors
            )
        );

    }

    next();

}