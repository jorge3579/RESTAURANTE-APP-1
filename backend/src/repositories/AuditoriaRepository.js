import BaseRepository from "./BaseRepository.js";

export default class AuditoriaRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                a.id_auditoria AS "idAuditoria",
                a.id_usuario AS "idUsuario",
                CONCAT_WS(
                    ' ',
                    u.nombre,
                    u.apellido
                ) AS usuario,
                a.modulo,
                a.accion,
                a.descripcion,
                a.entidad,
                a.id_entidad AS "idEntidad",
                a.ip,
                a.user_agent AS "userAgent",
                a.request_id AS "requestId",
                a.fecha_creacion AS "fechaCreacion"
            FROM auditoria a
            LEFT JOIN usuarios u
                ON u.id_usuario = a.id_usuario
            ORDER BY a.fecha_creacion DESC
            LIMIT 500
        `;

        return await this.query(query);

    }

    async crear(data) {

        const query = `
            INSERT INTO auditoria
            (
                id_usuario,
                modulo,
                accion,
                descripcion,
                entidad,
                id_entidad,
                ip,
                user_agent,
                request_id,
                fecha_creacion
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8,
                $9,
                CURRENT_TIMESTAMP
            )
        `;

        return await this.execute(
            query,
            [
                data.idUsuario,
                data.modulo,
                data.accion,
                data.descripcion,
                data.entidad,
                data.idEntidad,
                data.ip,
                data.userAgent,
                data.requestId
            ]
        );

    }

}
