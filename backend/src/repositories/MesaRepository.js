import BaseRepository from "./BaseRepository.js";

export default class MesaRepository extends BaseRepository {

    async listar() {

        const query = `

            SELECT

                m.*,

                s.nombre AS sucursal

            FROM mesas m

            INNER JOIN sucursales s

                ON s.id_sucursal = m.id_sucursal

            ORDER BY

                s.nombre,

                m.numero

        `;

        return await this.query(query);

    }

    async listarPorSucursal(idSucursal) {

        const query = `

            SELECT *

            FROM mesas

            WHERE id_sucursal=$1

            ORDER BY numero

        `;

        return await this.query(query, [idSucursal]);

    }

    async obtenerPorId(idMesa) {

        const query = `

            SELECT *

            FROM mesas

            WHERE id_mesa=$1

        `;

        const result = await this.query(query, [idMesa]);

        return result[0] || null;

    }

    async crear(data) {

        const query = `

            INSERT INTO mesas
            (
                id_sucursal,
                numero,
                capacidad,
                ubicacion,
                estado,
                activa,
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
            RETURNING id_mesa AS "id_mesa"

        `;

        const result = await this.query(query, [data.idSucursal, data.numero, data.capacidad, data.ubicacion, data.estado, data.activa]);

        return result[0];

    }

    async actualizar(idMesa, data) {

        const query = `

            UPDATE mesas

            SET

                numero=$1,

                capacidad=$2,

                ubicacion=$3,

                estado=$4,

                activa=$5,

                fecha_modificacion=CURRENT_TIMESTAMP

            WHERE

                id_mesa=$6

        `;

        await this.execute(query, [data.numero, data.capacidad, data.ubicacion, data.estado, data.activa, idMesa]);

    }

    async eliminar(idMesa) {

        const query = `

            UPDATE mesas

            SET

                activa=FALSE,

                fecha_modificacion=CURRENT_TIMESTAMP

            WHERE

                id_mesa=$1

        `;

        await this.execute(query, [idMesa]);

    }

}
