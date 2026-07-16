import ApiResponse from "../helpers/ApiResponse.js";

import {
    notificacionService
}
from "../services/index.js";

export default class NotificacionController {

    static async listar(req,res,next){

        try{

            const resultado=

            await notificacionService.listar(

                req.usuario.idUsuario

            );

            return ApiResponse.success(

                res,

                "Notificaciones obtenidas.",

                resultado

            );

        }

        catch(error){

            next(error);

        }

    }

    static async crear(req,res,next){

        try{

            const resultado=

            await notificacionService.crear(

                req.body

            );

            return ApiResponse.created(

                res,

                "Notificación creada.",

                resultado

            );

        }

        catch(error){

            next(error);

        }

    }

    static async marcarLeida(req,res,next){

        try{

            const resultado=

            await notificacionService.marcarLeida(

                Number(req.params.idNotificacion)

            );

            return ApiResponse.success(

                res,

                "Notificación leída.",

                resultado

            );

        }

        catch(error){

            next(error);

        }

    }

    static async eliminar(req,res,next){

        try{

            await notificacionService.eliminar(

                Number(req.params.idNotificacion)

            );

            return ApiResponse.success(

                res,

                "Notificación eliminada."

            );

        }

        catch(error){

            next(error);

        }

    }

}