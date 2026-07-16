export default function notFoundMiddleware(req, res, _next) {

    return res.status(404).json({
        success: false,
        message: "Ruta no encontrada",
        requestId: req.requestId || null
    });

}
