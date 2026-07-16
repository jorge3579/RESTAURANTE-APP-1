import BaseRepository from "./BaseRepository.js";

export default class PagoRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                p.id_pago,
                p.id_pedido,
                p.id_usuario,
                CONCAT(u.nombre, ' ', u.apellido) AS cliente,
                p.metodo_pago,
                p.proveedor,
                p.referencia_externa,
                p.monto,
                p.estado,
                p.fecha_aprobacion AS "fechaPago",
                p.fecha_creacion,
                p.fecha_modificacion
            FROM pagos p
            INNER JOIN usuarios u
                ON u.id_usuario = p.id_usuario
            ORDER BY p.fecha_creacion DESC
        `;

        return await this.query(query);

    }

    async obtenerPorId(idPago) {

        const query = `
            SELECT
                p.id_pago,
                p.id_pedido,
                p.id_usuario,
                CONCAT(u.nombre, ' ', u.apellido) AS cliente,
                p.metodo_pago,
                p.proveedor,
                p.referencia_externa,
                p.monto,
                p.estado,
                p.fecha_aprobacion AS "fechaPago",
                p.fecha_creacion,
                p.fecha_modificacion
            FROM pagos p
            INNER JOIN usuarios u
                ON u.id_usuario = p.id_usuario
            WHERE p.id_pago = $1
        `;

        const result = await this.query(query, [idPago]);

        return result[0] || null;

    }

    async listarPorPedido(idPedido) {

        const query = `
            SELECT
                p.id_pago,
                p.id_pedido,
                p.id_usuario,
                CONCAT(u.nombre, ' ', u.apellido) AS cliente,
                p.metodo_pago,
                p.proveedor,
                p.referencia_externa,
                p.monto,
                p.estado,
                p.fecha_aprobacion AS "fechaPago",
                p.fecha_creacion,
                p.fecha_modificacion
            FROM pagos p
            INNER JOIN usuarios u
                ON u.id_usuario = p.id_usuario
            WHERE p.id_pedido = $1
            ORDER BY p.fecha_creacion DESC
        `;

        return await this.query(query, [idPedido]);

    }

    async crear(data) {

        const query = `
            INSERT INTO pagos
            (
                id_pedido,
                id_usuario,
                metodo_pago,
                proveedor,
                referencia_externa,
                monto,
                estado,
                fecha_aprobacion,
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
                CURRENT_TIMESTAMP
            )
            RETURNING id_pago AS "id_pago"
        `;

        const result = await this.query(query, [data.idPedido, data.idUsuario, data.metodoPago, data.proveedor, data.referenciaExterna, data.monto, data.estado, data.fechaPago]);

        return result[0];

    }

    async actualizarEstado(idPago, estado, referenciaExterna = null) {

        const query = `
            UPDATE pagos
            SET
                estado = $1,
                referencia_externa = COALESCE($2, referencia_externa),
                fecha_aprobacion = CASE
                    WHEN $1 = 'APROBADO' THEN CURRENT_TIMESTAMP
                    ELSE fecha_aprobacion
                END,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_pago = $3
        `;

        await this.execute(query, [estado, referenciaExterna, idPago]);

    }

}
