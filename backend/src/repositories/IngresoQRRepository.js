import BaseRepository from "./BaseRepository.js";

export default class IngresoQRRepository extends BaseRepository {

    async obtenerPorId(idIngresoQR) {

        const query = `
            SELECT
                id_ingreso_qr AS "idIngresoQR",
                id_reserva,
                codigo_qr AS "codigoQR",
                fecha_generacion,
                fecha_utilizacion AS "fechaEscaneo",
                estado,
                dispositivo_validacion AS dispositivo,
                ip_validacion AS ip,
                observaciones
            FROM ingresos_qr
            WHERE id_ingreso_qr = $1
        `;

        const result = await this.query(query, [idIngresoQR]);

        return result[0] || null;

    }

    async obtenerPorCodigo(codigoQR) {

        const query = `
            SELECT
                id_ingreso_qr AS "idIngresoQR",
                id_reserva,
                codigo_qr AS "codigoQR",
                fecha_generacion,
                fecha_utilizacion AS "fechaEscaneo",
                estado,
                dispositivo_validacion AS dispositivo,
                ip_validacion AS ip,
                observaciones
            FROM ingresos_qr
            WHERE codigo_qr = $1
        `;

        const result = await this.query(query, [codigoQR]);

        return result[0] || null;

    }

    async obtenerPorReserva(idReserva) {

        const query = `
            SELECT
                id_ingreso_qr AS "idIngresoQR",
                id_reserva,
                codigo_qr AS "codigoQR",
                fecha_generacion,
                fecha_utilizacion AS "fechaEscaneo",
                estado,
                dispositivo_validacion AS dispositivo,
                ip_validacion AS ip,
                observaciones
            FROM ingresos_qr
            WHERE id_reserva = $1
        `;

        const result = await this.query(query, [idReserva]);

        return result[0] || null;

    }

    async crear(data) {

        const query = `
            INSERT INTO ingresos_qr
            (
                id_reserva,
                codigo_qr,
                estado,
                dispositivo_validacion,
                ip_validacion,
                observaciones,
                fecha_generacion
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
            RETURNING id_ingreso_qr AS "idIngresoQR"
        `;

        const result = await this.query(query, [data.idReserva, data.codigoQR, data.estado, data.dispositivo, data.ip, data.observaciones]);

        return result[0];

    }

    async registrarEscaneo(codigoQR, dispositivo, ip) {

        const query = `
            UPDATE ingresos_qr
            SET
                estado = 'UTILIZADO',
                fecha_utilizacion = CURRENT_TIMESTAMP,
                dispositivo_validacion = $1,
                ip_validacion = $2
            WHERE codigo_qr = $3
        `;

        await this.execute(query, [dispositivo, ip, codigoQR]);

    }

}
