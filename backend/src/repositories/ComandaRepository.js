import BaseRepository from "./BaseRepository.js";

export default class ComandaRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                c.id_comanda,
                c.id_pedido,
                c.id_sucursal,
                s.nombre AS sucursal,
                c.estado,
                c.tiempo_estimado_minutos,
                c.observaciones,
                c.fecha_inicio,
                c.fecha_lista AS "fechaFinalizacion",
                c.fecha_creacion,
                c.fecha_modificacion
            FROM comandas c
            INNER JOIN sucursales s
                ON s.id_sucursal = c.id_sucursal
            ORDER BY c.fecha_creacion DESC
        `;

        return await this.query(query);

    }

    async listarPorSucursal(idSucursal) {

        const query = `
            SELECT
                c.id_comanda,
                c.id_pedido,
                c.id_sucursal,
                s.nombre AS sucursal,
                c.estado,
                c.tiempo_estimado_minutos,
                c.observaciones,
                c.fecha_inicio,
                c.fecha_lista AS "fechaFinalizacion",
                c.fecha_creacion,
                c.fecha_modificacion
            FROM comandas c
            INNER JOIN sucursales s
                ON s.id_sucursal = c.id_sucursal
            WHERE c.id_sucursal = $1
            ORDER BY c.fecha_creacion DESC
        `;

        return await this.query(query, [idSucursal]);

    }

    async obtenerPorId(idComanda) {

        const query = `
            SELECT
                c.id_comanda,
                c.id_pedido,
                c.id_sucursal,
                s.nombre AS sucursal,
                c.estado,
                c.tiempo_estimado_minutos,
                c.observaciones,
                c.fecha_inicio,
                c.fecha_lista AS "fechaFinalizacion",
                c.fecha_creacion,
                c.fecha_modificacion
            FROM comandas c
            INNER JOIN sucursales s
                ON s.id_sucursal = c.id_sucursal
            WHERE c.id_comanda = $1
        `;

        const result = await this.query(query, [idComanda]);

        return result[0] || null;

    }

    async crear(data) {

        const query = `
            INSERT INTO comandas
            (
                id_pedido,
                id_sucursal,
                estado,
                tiempo_estimado_minutos,
                observaciones,
                fecha_creacion
            )
            VALUES
            (
                $1,
                $2,
                $3,
                $4,
                $5,
                CURRENT_TIMESTAMP
            )
            RETURNING id_comanda AS "id_comanda"
        `;

        const result = await this.query(query, [data.idPedido, data.idSucursal, data.estado, data.tiempoEstimadoMinutos, data.observaciones]);

        return result[0];

    }

    async cambiarEstado(idComanda, estado, tiempoEstimadoMinutos = null) {

        const query = `
            UPDATE comandas
            SET
                estado = $1::VARCHAR,
                tiempo_estimado_minutos = COALESCE($2, tiempo_estimado_minutos),
                fecha_inicio = CASE
                    WHEN $1::VARCHAR = 'EN_PREPARACION' AND fecha_inicio IS NULL THEN CURRENT_TIMESTAMP
                    ELSE fecha_inicio
                END,
                fecha_lista = CASE
                    WHEN $1::VARCHAR IN ('LISTA', 'ENTREGADA') THEN CURRENT_TIMESTAMP
                    ELSE fecha_lista
                END,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_comanda = $3
        `;

        await this.execute(query, [estado, tiempoEstimadoMinutos, idComanda]);

    }

}
