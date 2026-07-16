import BaseRepository from "./BaseRepository.js";

export default class CajaRepository extends BaseRepository {

    async listar() {

        return await this.query(`
            SELECT
                c.id_caja AS "idCaja",
                c.id_sucursal AS "idSucursal",
                s.nombre AS sucursal,
                c.id_usuario_apertura AS "idUsuarioApertura",
                CONCAT_WS(' ', ua.nombre, ua.apellido) AS "usuarioApertura",
                c.id_usuario_cierre AS "idUsuarioCierre",
                CONCAT_WS(' ', uc.nombre, uc.apellido) AS "usuarioCierre",
                c.fecha_apertura AS "fechaApertura",
                c.fecha_cierre AS "fechaCierre",
                c.monto_inicial AS "montoInicial",
                c.monto_final_declarado AS "montoFinal",
                c.total_ventas AS "totalVentas",
                c.total_efectivo AS "totalEfectivo",
                c.total_mercado_pago AS "totalMercadoPago",
                c.total_payway AS "totalPayway",
                c.estado,
                c.observaciones,
                c.fecha_creacion AS "fechaCreacion",
                c.fecha_modificacion AS "fechaModificacion"
            FROM cajas c
            INNER JOIN sucursales s
                ON s.id_sucursal = c.id_sucursal
            INNER JOIN usuarios ua
                ON ua.id_usuario = c.id_usuario_apertura
            LEFT JOIN usuarios uc
                ON uc.id_usuario = c.id_usuario_cierre
            ORDER BY c.fecha_apertura DESC
        `);

    }

    async obtenerPorId(idCaja) {

        const query = `
            SELECT
                c.id_caja AS "idCaja",
                c.id_sucursal AS "idSucursal",
                s.nombre AS sucursal,
                c.id_usuario_apertura AS "idUsuarioApertura",
                CONCAT_WS(' ', ua.nombre, ua.apellido) AS "usuarioApertura",
                c.id_usuario_cierre AS "idUsuarioCierre",
                CONCAT_WS(' ', uc.nombre, uc.apellido) AS "usuarioCierre",
                c.fecha_apertura AS "fechaApertura",
                c.fecha_cierre AS "fechaCierre",
                c.monto_inicial AS "montoInicial",
                c.monto_final_declarado AS "montoFinal",
                c.total_ventas AS "totalVentas",
                c.total_efectivo AS "totalEfectivo",
                c.total_mercado_pago AS "totalMercadoPago",
                c.total_payway AS "totalPayway",
                c.estado,
                c.observaciones,
                c.fecha_creacion AS "fechaCreacion",
                c.fecha_modificacion AS "fechaModificacion"
            FROM cajas c
            INNER JOIN sucursales s
                ON s.id_sucursal = c.id_sucursal
            INNER JOIN usuarios ua
                ON ua.id_usuario = c.id_usuario_apertura
            LEFT JOIN usuarios uc
                ON uc.id_usuario = c.id_usuario_cierre
            WHERE c.id_caja = $1
            LIMIT 1
        `;

        return await this.queryOne(query, [idCaja]);

    }

    async obtenerCajaAbierta(idSucursal) {

        const query = `
            SELECT
                id_caja AS "idCaja",
                id_sucursal AS "idSucursal",
                estado
            FROM cajas
            WHERE id_sucursal = $1
              AND estado = 'ABIERTA'
            ORDER BY fecha_apertura DESC
            LIMIT 1
        `;

        return await this.queryOne(query, [idSucursal]);

    }

    async abrir(data) {

        const query = `
            INSERT INTO cajas
            (
                id_sucursal,
                id_usuario_apertura,
                monto_inicial,
                estado,
                observaciones
            )
            VALUES ($1, $2, $3, 'ABIERTA', $4)
            RETURNING id_caja AS "idCaja"
        `;

        return await this.queryOne(
            query,
            [
                data.idSucursal,
                data.idUsuarioApertura,
                data.montoInicial,
                data.observaciones
            ]
        );

    }

    async cerrar(data) {

        const query = `
            UPDATE cajas
            SET
                id_usuario_cierre = $1,
                monto_final_declarado = $2,
                fecha_cierre = CURRENT_TIMESTAMP,
                estado = 'CERRADA',
                observaciones = $3,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_caja = $4
        `;

        return await this.execute(
            query,
            [
                data.idUsuarioCierre,
                data.montoFinal,
                data.observaciones,
                data.idCaja
            ]
        );

    }

}
