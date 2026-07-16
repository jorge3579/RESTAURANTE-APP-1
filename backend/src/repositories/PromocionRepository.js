import BaseRepository from "./BaseRepository.js";

export default class PromocionRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                id_promocion,
                nombre,
                descripcion,
                tipo,
                valor,
                fecha_inicio,
                fecha_fin,
                activa,
                acumulable AS combinable,
                fecha_creacion,
                fecha_modificacion
            FROM promociones
            ORDER BY fecha_creacion DESC
        `;

        return await this.query(query);

    }

    async listarActivas() {

        const query = `
            SELECT
                id_promocion,
                nombre,
                descripcion,
                tipo,
                valor,
                fecha_inicio,
                fecha_fin,
                activa,
                acumulable AS combinable,
                fecha_creacion,
                fecha_modificacion
            FROM promociones
            WHERE activa = TRUE
              AND CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin
            ORDER BY fecha_fin ASC
        `;

        return await this.query(query);

    }

    async obtenerPorId(idPromocion) {

        const query = `
            SELECT
                id_promocion,
                nombre,
                descripcion,
                tipo,
                valor,
                fecha_inicio,
                fecha_fin,
                activa,
                acumulable AS combinable,
                fecha_creacion,
                fecha_modificacion
            FROM promociones
            WHERE id_promocion = $1
        `;

        const result = await this.query(query, [idPromocion]);

        return result[0] || null;

    }

    async crear(data) {

        const query = `
            INSERT INTO promociones
            (
                nombre,
                descripcion,
                tipo,
                valor,
                fecha_inicio,
                fecha_fin,
                activa,
                acumulable,
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
            RETURNING id_promocion AS "id_promocion"
        `;

        const result = await this.query(query, [data.nombre, data.descripcion, data.tipo, data.valor, data.fechaInicio, data.fechaFin, data.activa, data.combinable]);

        return result[0];

    }

    async actualizar(idPromocion, data) {

        const query = `
            UPDATE promociones
            SET
                nombre = $1,
                descripcion = $2,
                tipo = $3,
                valor = $4,
                fecha_inicio = $5,
                fecha_fin = $6,
                activa = $7,
                acumulable = $8,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_promocion = $9
        `;

        await this.execute(query, [data.nombre, data.descripcion, data.tipo, data.valor, data.fechaInicio, data.fechaFin, data.activa, data.combinable, idPromocion]);

    }

    async eliminar(idPromocion) {

        const query = `
            UPDATE promociones
            SET
                activa = FALSE,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_promocion = $1
        `;

        await this.execute(query, [idPromocion]);

    }

}
