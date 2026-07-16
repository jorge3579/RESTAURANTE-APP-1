import BaseRepository from "./BaseRepository.js";

export default class SucursalRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                id_sucursal,
                nombre,
                direccion,
                telefono,
                email,
                ciudad,
                provincia,
                activo,
                fecha_creacion,
                fecha_modificacion
            FROM sucursales
            ORDER BY nombre ASC
        `;

        return await this.query(query);

    }

    async obtenerPorId(idSucursal) {

        const query = `
            SELECT
                id_sucursal,
                nombre,
                direccion,
                telefono,
                email,
                ciudad,
                provincia,
                activo,
                fecha_creacion,
                fecha_modificacion
            FROM sucursales
            WHERE id_sucursal = $1
        `;

        const result = await this.query(query, [idSucursal]);

        return result[0] || null;

    }

    async crear(data) {

        const query = `
            INSERT INTO sucursales
            (
                nombre,
                direccion,
                telefono,
                email,
                ciudad,
                provincia,
                activo,
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
                CURRENT_TIMESTAMP
            )
            RETURNING id_sucursal AS "id_sucursal"
        `;

        const result = await this.query(query, [data.nombre, data.direccion, data.telefono, data.email, data.ciudad, data.provincia, data.activo]);

        return result[0];

    }

    async actualizar(idSucursal, data) {

        const query = `
            UPDATE sucursales
            SET
                nombre = $1,
                direccion = $2,
                telefono = $3,
                email = $4,
                ciudad = $5,
                provincia = $6,
                activo = $7,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_sucursal = $8
        `;

        await this.execute(query, [data.nombre, data.direccion, data.telefono, data.email, data.ciudad, data.provincia, data.activo, idSucursal]);

    }

    async eliminar(idSucursal) {

        const query = `
            UPDATE sucursales
            SET
                activo = FALSE,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_sucursal = $1
        `;

        await this.execute(query, [idSucursal]);

    }

    async listarHorarios(idSucursal) {
        return await this.query(`
            SELECT
                dia_semana,
                hora_apertura,
                hora_cierre,
                hora_apertura_2,
                hora_cierre_2,
                cerrado
            FROM horarios_sucursal
            WHERE id_sucursal = $1 AND activo = TRUE
            ORDER BY dia_semana
        `, [idSucursal]);
    }

    async guardarHorarios(idSucursal, horarios) {
        return await this.databaseManager.transaction(async (transaction) => {
            for (const horario of horarios) {
                await transaction.execute(`
                    INSERT INTO horarios_sucursal
                    (id_sucursal, dia_semana, hora_apertura, hora_cierre,
                     hora_apertura_2, hora_cierre_2, cerrado, activo, fecha_creacion)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, CURRENT_TIMESTAMP)
                    ON CONFLICT (id_sucursal, dia_semana)
                    DO UPDATE SET
                        hora_apertura = EXCLUDED.hora_apertura,
                        hora_cierre = EXCLUDED.hora_cierre,
                        hora_apertura_2 = EXCLUDED.hora_apertura_2,
                        hora_cierre_2 = EXCLUDED.hora_cierre_2,
                        cerrado = EXCLUDED.cerrado,
                        activo = TRUE,
                        fecha_modificacion = CURRENT_TIMESTAMP
                `, [
                    idSucursal,
                    horario.diaSemana,
                    horario.horaApertura || null,
                    horario.horaCierre || null,
                    horario.horaApertura2 || null,
                    horario.horaCierre2 || null,
                    horario.cerrado ?? false
                ]);
            }
        });
    }

}
