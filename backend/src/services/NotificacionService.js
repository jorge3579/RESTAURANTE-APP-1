import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import NotificacionDTO from "../dto/NotificacionDTO.js";

export default class NotificacionService extends BaseService {

    async listar(idUsuario) {

        const resultado =
            await this.repository.listar(
                idUsuario
            );

        return resultado.map(
            NotificacionDTO.fromDatabase
        );

    }

    async obtenerPorId(idNotificacion) {

        const resultado =
            await this.repository.obtenerPorId(
                idNotificacion
            );

        if (!resultado) {

            throw new AppError(
                "Notificación no encontrada.",
                404
            );

        }

        return NotificacionDTO.fromDatabase(
            resultado
        );

    }

    async crear(data) {

        const resultado =
            await this.repository.crear({

                idUsuario: data.idUsuario,

                titulo: data.titulo,

                mensaje: data.mensaje,

                tipo: data.tipo

            });

        return await this.obtenerPorId(
            resultado.idNotificacion
        );

    }

    async marcarLeida(idNotificacion) {

        await this.obtenerPorId(
            idNotificacion
        );

        await this.repository.marcarLeida(
            idNotificacion
        );

        return await this.obtenerPorId(
            idNotificacion
        );

    }

    async eliminar(idNotificacion) {

        await this.obtenerPorId(
            idNotificacion
        );

        await this.repository.eliminar(
            idNotificacion
        );

        return true;

    }

}