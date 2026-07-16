import ApiResponse from "../helpers/ApiResponse.js";

import {
    creditoUsuarioService
}
from "../services/index.js";

export default class CreditoUsuarioController {

    static async listar(req,res,next){

        try{

            const creditos=
                await creditoUsuarioService.listar();

            return ApiResponse.success(

                res,

                "Créditos obtenidos.",

                creditos

            );

        }

        catch(error){

            next(error);

        }

    }

    static async misCreditos(req,res,next){

        try{

            const creditos=

            await creditoUsuarioService.listarPorUsuario(

                req.usuario.idUsuario

            );

            return ApiResponse.success(

                res,

                "Créditos del usuario.",

                creditos

            );

        }

        catch(error){

            next(error);

        }

    }

    static async crear(req,res,next){

        try{

            const credito=

            await creditoUsuarioService.crear(

                req.body

            );

            return ApiResponse.created(

                res,

                "Crédito generado.",

                credito

            );

        }

        catch(error){

            next(error);

        }

    }

    static async consumir(req,res,next){

        try{

            const {idCredito}=req.params;

            const credito=

            await creditoUsuarioService.consumir(

                Number(idCredito),

                req.body.monto

            );

            return ApiResponse.success(

                res,

                "Crédito aplicado.",

                credito

            );

        }

        catch(error){

            next(error);

        }

    }

}