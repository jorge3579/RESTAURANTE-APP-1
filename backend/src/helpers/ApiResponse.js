export default class ApiResponse {

    static success(res, message = "OK", data = {}) {

        return res.status(200).json({
            success: true,
            message,
            data
        });

    }

    static created(res, message = "Registro creado correctamente.", data = {}) {

        return res.status(201).json({
            success: true,
            message,
            data
        });

    }

    static badRequest(res, message = "Solicitud inválida.", errors = []) {

        return res.status(400).json({
            success: false,
            message,
            errors
        });

    }

    static unauthorized(res, message = "No autorizado.") {

        return res.status(401).json({
            success: false,
            message
        });

    }

    static forbidden(res, message = "Acceso denegado.") {

        return res.status(403).json({
            success: false,
            message
        });

    }

    static notFound(res, message = "Registro no encontrado.") {

        return res.status(404).json({
            success: false,
            message
        });

    }

    static conflict(res, message = "Conflicto de datos.") {

        return res.status(409).json({
            success: false,
            message
        });

    }

    static serverError(res, message = "Error interno del servidor.") {

        return res.status(500).json({
            success: false,
            message
        });

    }

}