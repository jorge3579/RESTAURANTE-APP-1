import AppError from "../utils/AppError.js";

export default function roleMiddleware(...rolesPermitidos) {

    return function validarRol(req, res, next) {

        if (!req.usuario) {
            return next(new AppError("Usuario no autenticado.", 401));
        }

        if (!rolesPermitidos.includes(req.usuario.idRol)) {
            return next(new AppError("No posee permisos para acceder a este recurso.", 403));
        }

        next();

    };

}