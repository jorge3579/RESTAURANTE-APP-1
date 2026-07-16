import BaseRepository from "./BaseRepository.js";

export default class CreditoUsuarioRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                c.id_credito,
                c.id_usuario,
                CONCAT(u.nombre, ' ', u.apellido) AS cliente,
                c.id_reserva_origen AS "idReserva",
                c.monto_original AS monto,
                c.saldo_disponible AS saldo,
                c.motivo,
                (c.estado = 'DISPONIBLE') AS activo,
                c.fecha_creacion,
                c.fecha_modificacion
            FROM creditos_usuario c
            INNER JOIN usuarios u
                ON u.id_usuario = c.id_usuario
            ORDER BY c.fecha_creacion DESC
        `;

        return await this.query(query);

    }

    async listarPorUsuario(idUsuario) {

        const query = `
            SELECT
                c.id_credito,
                c.id_usuario,
                CONCAT(u.nombre, ' ', u.apellido) AS cliente,
                c.id_reserva_origen AS "idReserva",
                c.monto_original AS monto,
                c.saldo_disponible AS saldo,
                c.motivo,
                (c.estado = 'DISPONIBLE') AS activo,
                c.fecha_creacion,
                c.fecha_modificacion
            FROM creditos_usuario c
            INNER JOIN usuarios u
                ON u.id_usuario = c.id_usuario
            WHERE c.id_usuario = $1
            ORDER BY c.fecha_creacion DESC
        `;

        return await this.query(query, [idUsuario]);

    }

    async obtenerPorId(idCredito) {

        const query = `
            SELECT
                c.id_credito,
                c.id_usuario,
                CONCAT(u.nombre, ' ', u.apellido) AS cliente,
                c.id_reserva_origen AS "idReserva",
                c.monto_original AS monto,
                c.saldo_disponible AS saldo,
                c.motivo,
                (c.estado = 'DISPONIBLE') AS activo,
                c.fecha_creacion,
                c.fecha_modificacion
            FROM creditos_usuario c
            INNER JOIN usuarios u
                ON u.id_usuario = c.id_usuario
            WHERE c.id_credito = $1
        `;

        const result = await this.query(query, [idCredito]);

        return result[0] || null;

    }

    async crear(data) {

        const query = `
            INSERT INTO creditos_usuario
            (
                id_usuario,
                id_reserva_origen,
                monto_original,
                saldo_disponible,
                motivo,
                estado,
                fecha_creacion
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                'DISPONIBLE',
                CURRENT_TIMESTAMP
            )
            RETURNING id_credito AS "id_credito"
        `;

        const result = await this.query(query, [data.idUsuario, data.idReserva, data.monto, data.saldo, data.motivo]);

        return result[0];

    }

    async consumir(idCredito, nuevoSaldo) {

        const query = `
            UPDATE creditos_usuario
            SET
                saldo_disponible = $1,
                estado = CASE WHEN $1 <= 0 THEN 'AGOTADO' ELSE estado END,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_credito = $2
        `;

        await this.execute(query, [nuevoSaldo, idCredito]);

    }

}
