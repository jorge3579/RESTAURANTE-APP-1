import BaseRepository from "./BaseRepository.js";

export default class ConfiguracionSistemaRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                id_configuracion,
                clave,
                valor,
                descripcion,
                editable,
                fecha_creacion,
                fecha_modificacion
            FROM configuracion_sistema
            ORDER BY clave ASC
        `;

        return await this.query(query);

    }

    async obtenerPorClave(clave) {

        const query = `
            SELECT
                id_configuracion,
                clave,
                valor,
                descripcion,
                editable,
                fecha_creacion,
                fecha_modificacion
            FROM configuracion_sistema
            WHERE clave = $1
        `;

        const result = await this.query(query, [clave]);

        return result[0] || null;

    }

    async actualizar(clave, valor) {

        const query = `
            UPDATE configuracion_sistema
            SET
                valor = $1,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE clave = $2
              AND editable = TRUE
        `;

        await this.execute(query, [valor, clave]);

    }

}
