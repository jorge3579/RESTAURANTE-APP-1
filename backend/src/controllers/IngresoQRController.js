import ApiResponse from "../helpers/ApiResponse.js";
import AppError from "../utils/AppError.js";

import {

    ingresoQRService,
    reservaService

}
from "../services/index.js";

export default class IngresoQRController {

    static async generar(req,res,next){

        try{

            const {idReserva}=req.params;

            const reserva = await reservaService.obtenerPorId(Number(idReserva));

            if (Number(reserva.idUsuario) !== Number(req.usuario.idUsuario)) {
                throw new AppError("La reserva no pertenece al usuario autenticado.", 403);
            }

            if (reserva.estado !== "CONFIRMADA") {
                throw new AppError("El QR se habilita despuÃ©s de aprobar el pago.", 409);
            }

            const qr=

            await ingresoQRService.generarQR(

                Number(idReserva)

            );

            return ApiResponse.success(

                res,

                "QR generado correctamente.",

                qr

            );

        }

        catch(error){

            next(error);

        }

    }

    static async validar(req,res,next){

        try{

            const resultado=

            await ingresoQRService.validarIngreso(

                req.body.codigoQR,

                req.body.dispositivo,

                req.ip

            );

            return ApiResponse.success(

                res,

                "Ingreso autorizado.",

                resultado

            );

        }

        catch(error){

            next(error);

        }

    }

}
