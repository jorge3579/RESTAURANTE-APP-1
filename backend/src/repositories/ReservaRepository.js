import BaseRepository from "./BaseRepository.js";

export default class ReservaRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                r.id_reserva,
                r.id_usuario,
                CONCAT(u.nombre, ' ', u.apellido) AS cliente,
                r.id_sucursal,
                s.nombre AS sucursal,
                rm.id_mesa,
                m.numero AS mesa,
                r.fecha_reserva,
                r.hora_reserva,
                r.cantidad_personas,
                r.estado,
                r.observaciones,
                r.codigo_reserva AS "codigoQR",
                r.fecha_creacion,
                r.fecha_modificacion
            FROM reservas r
            INNER JOIN usuarios u
                ON u.id_usuario = r.id_usuario
            INNER JOIN sucursales s
                ON s.id_sucursal = r.id_sucursal
            LEFT JOIN reserva_mesas rm
                ON rm.id_reserva = r.id_reserva
               AND rm.liberada = FALSE
            LEFT JOIN mesas m
                ON m.id_mesa = rm.id_mesa
            ORDER BY r.fecha_reserva DESC, r.hora_reserva DESC
        `;

        return await this.query(query);

    }

    async listarPorUsuario(idUsuario) {

        const query = `
            SELECT
                r.id_reserva,
                r.id_usuario,
                CONCAT(u.nombre, ' ', u.apellido) AS cliente,
                r.id_sucursal,
                s.nombre AS sucursal,
                rm.id_mesa,
                m.numero AS mesa,
                r.fecha_reserva,
                r.hora_reserva,
                r.cantidad_personas,
                r.estado,
                r.observaciones,
                r.codigo_reserva AS "codigoQR",
                r.fecha_creacion,
                r.fecha_modificacion
            FROM reservas r
            INNER JOIN usuarios u
                ON u.id_usuario = r.id_usuario
            INNER JOIN sucursales s
                ON s.id_sucursal = r.id_sucursal
            LEFT JOIN reserva_mesas rm
                ON rm.id_reserva = r.id_reserva
               AND rm.liberada = FALSE
            LEFT JOIN mesas m
                ON m.id_mesa = rm.id_mesa
            WHERE r.id_usuario = $1
            ORDER BY r.fecha_reserva DESC, r.hora_reserva DESC
        `;

        return await this.query(query, [idUsuario]);

    }

    async obtenerPorId(idReserva) {

        const query = `
            SELECT
                r.id_reserva,
                r.id_usuario,
                CONCAT(u.nombre, ' ', u.apellido) AS cliente,
                r.id_sucursal,
                s.nombre AS sucursal,
                rm.id_mesa,
                m.numero AS mesa,
                r.fecha_reserva,
                r.hora_reserva,
                r.cantidad_personas,
                r.estado,
                r.observaciones,
                r.codigo_reserva AS "codigoQR",
                r.fecha_creacion,
                r.fecha_modificacion
            FROM reservas r
            INNER JOIN usuarios u
                ON u.id_usuario = r.id_usuario
            INNER JOIN sucursales s
                ON s.id_sucursal = r.id_sucursal
            LEFT JOIN reserva_mesas rm
                ON rm.id_reserva = r.id_reserva
               AND rm.liberada = FALSE
            LEFT JOIN mesas m
                ON m.id_mesa = rm.id_mesa
            WHERE r.id_reserva = $1
        `;

        const result = await this.query(query, [idReserva]);

        return result[0] || null;

    }

    async buscarMesaDisponible(idSucursal, fechaReserva, horaReserva, cantidadPersonas) {

        const query = `
            SELECT
                m.id_mesa,
                m.id_sucursal,
                m.numero,
                m.capacidad,
                m.ubicacion,
                m.estado,
                m.activa
            FROM mesas m
            WHERE m.id_sucursal = $1
              AND m.activa = TRUE
              AND m.capacidad >= $2
              AND m.id_mesa NOT IN
              (
                    SELECT rm.id_mesa
                    FROM reservas r
                    INNER JOIN reserva_mesas rm
                        ON rm.id_reserva = r.id_reserva
                       AND rm.liberada = FALSE
                    WHERE r.id_sucursal = $1
                      AND r.fecha_reserva = $3
                      AND r.hora_reserva = $4
                      AND r.estado IN ('PENDIENTE', 'CONFIRMADA')
              )
            ORDER BY m.capacidad ASC
            LIMIT 1
        `;

        const result = await this.query(query, [idSucursal, cantidadPersonas, fechaReserva, horaReserva]);

        return result[0] || null;

    }

    async crear(data) {

        return await this.databaseManager.transaction(
            async (transaction) => {
                const reserva = await this.queryOne(
                    `
                        INSERT INTO reservas
                        (
                            id_usuario,
                            id_sucursal,
                            fecha_reserva,
                            hora_reserva,
                            cantidad_personas,
                            estado,
                            observaciones
                        )
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                        RETURNING id_reserva AS "idReserva"
                    `,
                    [
                        data.idUsuario,
                        data.idSucursal,
                        data.fechaReserva,
                        data.horaReserva,
                        data.cantidadPersonas,
                        data.estado,
                        data.observaciones
                    ],
                    transaction
                );

                await this.execute(
                    `
                        INSERT INTO reserva_mesas
                        (id_reserva, id_mesa, liberada)
                        VALUES ($1, $2, FALSE)
                    `,
                    [reserva.idReserva, data.idMesa],
                    transaction
                );

                return reserva;
            }
        );

    }

    async actualizarEstado(idReserva, estado) {

        const query = `
            UPDATE reservas
            SET
                estado = $1,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_reserva = $2
        `;

        await this.execute(query, [estado, idReserva]);

    }

    async cancelar(idReserva) {

        const query = `
            UPDATE reservas
            SET
                estado = 'CANCELADA',
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_reserva = $1
        `;

        await this.execute(query, [idReserva]);

    }

}
