import BaseService from "./BaseService.js";

import MesaDTO from "../dto/MesaDTO.js";

import AppError from "../utils/AppError.js";

import ESTADO_MESA from "../constants/estadoMesa.js";

export default class MesaService extends BaseService {

    async listar() {

        const mesas = await this.repository.listar();

        return mesas.map(MesaDTO.fromDatabase);

    }

    async listarPorSucursal(idSucursal) {

        const mesas = await this.repository.listarPorSucursal(
            idSucursal
        );

        return mesas.map(MesaDTO.fromDatabase);

    }

    async obtenerPorId(idMesa) {

        const mesa = await this.repository.obtenerPorId(
            idMesa
        );

        if (!mesa) {

            throw new AppError(
                "Mesa no encontrada.",
                404
            );

        }

        return MesaDTO.fromDatabase(mesa);

    }

    async crear(data) {

        const resultado = await this.repository.crear({

            idSucursal: data.idSucursal,

            numero: data.numero,

            capacidad: data.capacidad,

            ubicacion: data.ubicacion || null,

            estado: ESTADO_MESA.LIBRE,

            activa: true

        });

        return await this.obtenerPorId(
            resultado.idMesa
        );

    }

    async actualizar(idMesa, data) {

        await this.obtenerPorId(idMesa);

        await this.repository.actualizar(idMesa, {

            numero: data.numero,

            capacidad: data.capacidad,

            ubicacion: data.ubicacion,

            estado: data.estado,

            activa: data.activa

        });

        return await this.obtenerPorId(idMesa);

    }

    async eliminar(idMesa) {

        await this.obtenerPorId(idMesa);

        await this.repository.eliminar(idMesa);

        return true;

    }

}