import { auditoriaService } from "../services/index.js";

export default async function auditoriaMiddleware(
    req,
    res,
    next
) {

    const metodos = [
        "POST",
        "PUT",
        "PATCH",
        "DELETE"
    ];

    if (!metodos.includes(req.method)) {
        return next();
    }

    res.on("finish", async () => {

        try {

            if (res.statusCode >= 200 && res.statusCode < 400) {

                await auditoriaService.registrar({

                    idUsuario:
                        req.usuario?.idUsuario || null,

                    modulo:
                        req.baseUrl,

                    accion:
                        req.method,

                    descripcion:
                        `${req.method} ${req.originalUrl}`,

                    entidad:
                        req.baseUrl,

                    idEntidad:
                        req.params.id || null,

                    ip:
                        req.ip,

                    userAgent:
                        req.headers["user-agent"],

                    requestId:
                        req.headers["x-request-id"] || null

                });

            }

        } catch (error) {

            console.error(error);

        }

    });

    next();

}