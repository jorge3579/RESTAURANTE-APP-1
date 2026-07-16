import BaseService from "./BaseService.js";

import AppError from "../utils/AppError.js";

import ImpresionComandaDTO
from "../dto/ImpresionComandaDTO.js";

import ESTADO_IMPRESION
from "../constants/estadoImpresion.js";

export default class ImpresionComandaService
extends BaseService{

    async listarPendientes(){

        const lista=
            await this.repository.listarPendientes();

        return lista.map(
            ImpresionComandaDTO.fromDatabase
        );

    }

    async obtenerPorId(id){

        const dato=
            await this.repository.obtenerPorId(id);

        if(!dato){

            throw new AppError(
                "Impresión inexistente.",
                404
            );

        }

        return ImpresionComandaDTO.fromDatabase(
            dato
        );

    }

    async crear(data){

        const resultado=
            await this.repository.crear({

                idComanda:data.idComanda,

                tipo:data.tipo,

                impresora:data.impresora,

                copias:data.copias||1,

                estado:
                    ESTADO_IMPRESION.PENDIENTE

            });

        return await this.obtenerPorId(
            resultado.idImpresion
        );

    }

    async marcarImpresa(id){

        await this.repository.actualizarEstado(

            id,

            ESTADO_IMPRESION.IMPRESA

        );

        return await this.obtenerPorId(id);

    }

    async marcarError(id,error){

        await this.repository.actualizarEstado(

            id,

            ESTADO_IMPRESION.ERROR,

            error

        );

        return await this.obtenerPorId(id);

    }

}