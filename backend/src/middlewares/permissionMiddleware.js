import AppError from "../utils/AppError.js";
import { permisoService } from "../services/index.js";

export default function permissionMiddleware(codigoPermiso) {

    return async function validarPermiso(req, res, next) {

        try {

            if (!req.usuario) {
                throw new AppError("Usuario no autenticado.", 401);
            }

            const tienePermiso = await permisoService.usuarioTienePermiso(
                req.usuario.idUsuario,
                codigoPermiso
            );

            if (!tienePermiso) {
                throw new AppError("No posee permisos para realizar esta acción.", 403);
            }

            next();

        } catch (error) {

            next(error);

        }

    };

}