export default function errorHandlerMiddleware(error, req, res, _next) {

    const statusCode = error.statusCode || error.status || 500;

    const response = {
        success: false,
        message: error.message || "Error interno del servidor",
        requestId: req.requestId || null
    };

    if (Array.isArray(error.errors) && error.errors.length > 0) {
        response.errors = error.errors;
    }

    if (process.env.NODE_ENV === "development") {
        response.stack = error.stack;
    }

    return res.status(statusCode).json(response);

}
