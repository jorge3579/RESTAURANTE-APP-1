import ApiResponse from "../helpers/ApiResponse.js";

import {

    ingresoQRService

}
from "../services/index.js";

export default class IngresoQRController {

    static async generar(req,res,next){

        try{

            const {idReserva}=req.params;

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