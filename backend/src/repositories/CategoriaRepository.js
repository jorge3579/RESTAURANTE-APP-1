import BaseRepository from "./BaseRepository.js";

export default class CategoriaRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                id_categoria,
                nombre,
                descripcion,
                activa,
                fecha_creacion,
                fecha_modificacion
            FROM categorias
            ORDER BY nombre ASC
        `;

        return await this.query(query);

    }

    async obtenerPorId(idCategoria) {

        const query = `
            SELECT
                id_categoria,
                nombre,
                descripcion,
                activa,
                fecha_creacion,
                fecha_modificacion
            FROM categorias
            WHERE id_categoria = $1
        `;

        const result = await this.query(query, [idCategoria]);

        return result[0] || null;

    }

    async crear(data) {

        const query = `
            INSERT INTO categorias
            (
                nombre,
                descripcion,
                activa,
                fecha_creacion
            )
            VALUES
            (
                $1,
                $2,
                $3,
                CURRENT_TIMESTAMP
            )
            RETURNING id_categoria AS "idCategoria"
        `;

        const result = await this.query(query, [data.nombre, data.descripcion, data.activa]);

        return result[0];

    }

    async actualizar(idCategoria, data) {

        const query = `
            UPDATE categorias
            SET
                nombre = $1,
                descripcion = $2,
                activa = $3,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_categoria = $4
        `;

        await this.execute(query, [data.nombre, data.descripcion, data.activa, idCategoria]);

    }

    async eliminar(idCategoria) {

        const query = `
            UPDATE categorias
            SET
                activa = FALSE,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_categoria = $1
        `;

        await this.execute(query, [idCategoria]);

    }

}
