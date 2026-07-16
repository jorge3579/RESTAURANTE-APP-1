import BaseRepository from "./BaseRepository.js";

export default class ImpresionComandaRepository extends BaseRepository {

    async listarPendientes() {

        const query = `
            SELECT
                *
            FROM impresiones_comanda
            WHERE estado='PENDIENTE'
            ORDER BY fecha_creacion
        `;

        return await this.query(query);

    }

    async obtenerPorId(idImpresion) {

        const query = `
            SELECT *
            FROM impresiones_comanda
            WHERE id_impresion=$1
        `;

        const result =
            await this.query(query,[idImpresion]);

        return result[0] || null;

    }

    async crear(data){

        const query=`
            INSERT INTO impresiones_comanda
            (
                id_comanda,
                tipo,
                impresora,
                copias,
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
                CURRENT_TIMESTAMP
            )
            RETURNING id_impresion AS "id_impresion"
        `;

        const result=
            await this.query(query,[data.idComanda, data.tipo, data.impresora, data.copias, data.estado]);

        return result[0];

    }

    async actualizarEstado(

        idImpresion,

        estado,

        error=null

    ){

        const query=`
            UPDATE impresiones_comanda

            SET

                estado=$1,

                error=$2,

                fecha_impresion=
                    CASE
                        WHEN $1='IMPRESA'
                        THEN CURRENT_TIMESTAMP
                        ELSE fecha_impresion
                    END,

                fecha_modificacion=CURRENT_TIMESTAMP

            WHERE id_impresion=$3
        `;

        await this.execute(query,[estado, error, idImpresion]);

    }

}