import ApiResponse from "../helpers/ApiResponse.js";

import {

    impresionComandaService

}
from "../services/index.js";

export default class ImpresionComandaController{

    static async pendientes(req,res,next){

        try{

            const lista=

            await impresionComandaService
            .listarPendientes();

            return ApiResponse.success(

                res,

                "Impresiones pendientes.",

                lista

            );

        }

        catch(error){

            next(error);

        }

    }

    static async crear(req,res,next){

        try{

            const dato=

            await impresionComandaService
            .crear(req.body);

            return ApiResponse.created(

                res,

                "Trabajo de impresión creado.",

                dato

            );

        }

        catch(error){

            next(error);

        }

    }

}