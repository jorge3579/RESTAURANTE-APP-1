import BaseRepository from "./BaseRepository.js";

export default class NotificacionRepository extends BaseRepository {

    async listar(idUsuario) {

        const query = `
            SELECT
                id_notificacion,
                id_usuario,
                titulo,
                mensaje,
                tipo,
                leida,
                fecha_lectura,
                fecha_creacion
            FROM notificaciones
            WHERE id_usuario = $1
            ORDER BY fecha_creacion DESC
        `;

        return await this.query(query, [idUsuario]);

    }

    async obtenerPorId(idNotificacion) {

        const query = `
            SELECT
                id_notificacion,
                id_usuario,
                titulo,
                mensaje,
                tipo,
                leida,
                fecha_lectura,
                fecha_creacion
            FROM notificaciones
            WHERE id_notificacion = $1
        `;

        const result = await this.query(query, [idNotificacion]);

        return result[0] || null;

    }

    async crear(data) {

        const query = `
            INSERT INTO notificaciones
            (
                id_usuario,
                titulo,
                mensaje,
                tipo,
                leida,
                fecha_creacion
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                FALSE,
                CURRENT_TIMESTAMP
            )
            RETURNING id_notificacion AS "idNotificacion"
        `;

        const result = await this.query(query, [data.idUsuario, data.titulo, data.mensaje, data.tipo]);

        return result[0];

    }

    async marcarLeida(idNotificacion) {

        const query = `
            UPDATE notificaciones
            SET
                leida = TRUE,
                fecha_lectura = CURRENT_TIMESTAMP
            WHERE id_notificacion = $1
        `;

        await this.execute(query, [idNotificacion]);

    }

    async eliminar(idNotificacion) {

        const query = `
            DELETE
            FROM notificaciones
            WHERE id_notificacion = $1
        `;

        await this.execute(query, [idNotificacion]);

    }

}
