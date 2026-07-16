import BaseRepository from "./BaseRepository.js";

export default class MercadoPagoRepository extends BaseRepository {

    async guardarPreferencia(data) {

        const query = `
            INSERT INTO mercado_pago_preferencias
            (
                id_pedido,
                id_pago,
                preference_id,
                init_point,
                sandbox_init_point,
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
                $6,
                CURRENT_TIMESTAMP
            )
            RETURNING id_preferencia AS "idPreferencia"
        `;

        const result = await this.query(query, [data.idPedido, data.idPago, data.preferenceId, data.initPoint, data.sandboxInitPoint, data.estado]);

        return result[0];

    }

    async obtenerPreferenciaPorId(idPreferencia) {

        const query = `
            SELECT
                id_preferencia AS "idPreferencia",
                id_pedido,
                id_pago,
                preference_id,
                init_point,
                sandbox_init_point,
                estado,
                fecha_creacion,
                fecha_modificacion
            FROM mercado_pago_preferencias
            WHERE id_preferencia = $1
        `;

        const result = await this.query(query, [idPreferencia]);

        return result[0] || null;

    }

    async obtenerPreferenciaPorPedido(idPedido) {

        const query = `
            SELECT
                id_preferencia AS "idPreferencia",
                id_pedido,
                id_pago,
                preference_id,
                init_point,
                sandbox_init_point,
                estado,
                fecha_creacion,
                fecha_modificacion
            FROM mercado_pago_preferencias
            WHERE id_pedido = $1
            ORDER BY fecha_creacion DESC
            LIMIT 1
        `;

        const result = await this.query(query, [idPedido]);

        return result[0] || null;

    }

    async registrarWebhook(data) {

        const query = `
            INSERT INTO mercado_pago_webhooks
            (
                tipo,
                accion,
                data_id,
                payload,
                procesado,
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
            RETURNING id_webhook AS "idWebhook"
        `;

        const result = await this.query(query, [data.tipo, data.accion, data.dataId, data.payload]);

        return result[0];

    }

    async marcarWebhookProcesado(idWebhook) {

        const query = `
            UPDATE mercado_pago_webhooks
            SET
                procesado = TRUE,
                fecha_procesado = CURRENT_TIMESTAMP
            WHERE id_webhook = $1
        `;

        await this.execute(query, [idWebhook]);

    }

}
