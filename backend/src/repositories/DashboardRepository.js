import BaseRepository from "./BaseRepository.js";

export default class DashboardRepository extends BaseRepository {

    async resumenGeneral(idSucursal = null) {

        const query = `
            SELECT
                (
                    SELECT COUNT(1)
                    FROM reservas r
                    WHERE CAST(r.fecha_creacion AS DATE) = CURRENT_DATE
                    AND ($1::INTEGER IS NULL OR r.id_sucursal = $1::INTEGER)
                ) AS reservas_hoy,

                (
                    SELECT COUNT(1)
                    FROM pedidos p
                    WHERE CAST(p.fecha_creacion AS DATE) = CURRENT_DATE
                    AND ($1::INTEGER IS NULL OR p.id_sucursal = $1::INTEGER)
                ) AS pedidos_hoy,

                (
                    SELECT COALESCE(SUM(p.total), 0)
                    FROM pedidos p
                    WHERE CAST(p.fecha_creacion AS DATE) = CURRENT_DATE
                    AND p.estado <> 'CANCELADO'
                    AND ($1::INTEGER IS NULL OR p.id_sucursal = $1::INTEGER)
                ) AS ventas_hoy,

                (
                    SELECT COUNT(1)
                    FROM mesas m
                    WHERE m.estado = 'OCUPADA'
                    AND m.activa = TRUE
                    AND ($1::INTEGER IS NULL OR m.id_sucursal = $1::INTEGER)
                ) AS mesas_ocupadas,

                (
                    SELECT COUNT(1)
                    FROM mesas m
                    WHERE m.estado = 'LIBRE'
                    AND m.activa = TRUE
                    AND ($1::INTEGER IS NULL OR m.id_sucursal = $1::INTEGER)
                ) AS mesas_libres
        `;

        const result = await this.query(query, [idSucursal]);

        return result[0];

    }

    async ventasPorDia(idSucursal = null) {

        const query = `
            SELECT
                CAST(fecha_creacion AS DATE) AS fecha,
                COUNT(1) AS cantidad_pedidos,
                COALESCE(SUM(total), 0) AS total_ventas
            FROM pedidos
            WHERE fecha_creacion >= CURRENT_TIMESTAMP - INTERVAL '30 days'
              AND estado <> 'CANCELADO'
              AND ($1::INTEGER IS NULL OR id_sucursal = $1::INTEGER)
            GROUP BY CAST(fecha_creacion AS DATE)
            ORDER BY fecha ASC
        `;

        return await this.query(query, [idSucursal]);

    }

    async productosMasVendidos(idSucursal = null) {

        const query = `
            SELECT
                pr.id_producto,
                pr.nombre AS producto,
                SUM(pd.cantidad) AS cantidad_vendida,
                SUM(pd.subtotal) AS total_vendido
            FROM pedido_detalles pd
            INNER JOIN pedidos p
                ON p.id_pedido = pd.id_pedido
            INNER JOIN productos pr
                ON pr.id_producto = pd.id_producto
            WHERE p.estado <> 'CANCELADO'
              AND p.fecha_creacion >= CURRENT_TIMESTAMP - INTERVAL '30 days'
              AND ($1::INTEGER IS NULL OR p.id_sucursal = $1::INTEGER)
            GROUP BY pr.id_producto, pr.nombre
            ORDER BY cantidad_vendida DESC
            LIMIT 10
        `;

        return await this.query(query, [idSucursal]);

    }

    async reservasPorEstado(idSucursal = null) {

        const query = `
            SELECT
                estado,
                COUNT(1) AS cantidad
            FROM reservas
            WHERE fecha_reserva >= CURRENT_DATE - INTERVAL '30 days'
              AND ($1::INTEGER IS NULL OR id_sucursal = $1::INTEGER)
            GROUP BY estado
            ORDER BY estado ASC
        `;

        return await this.query(query, [idSucursal]);

    }

    async pagosPorMetodo(idSucursal = null) {

        const query = `
            SELECT
                pg.metodo_pago,
                COUNT(1) AS cantidad,
                COALESCE(SUM(pg.monto), 0) AS total
            FROM pagos pg
            INNER JOIN pedidos p
                ON p.id_pedido = pg.id_pedido
            WHERE pg.estado = 'APROBADO'
              AND pg.fecha_creacion >= CURRENT_TIMESTAMP - INTERVAL '30 days'
              AND ($1::INTEGER IS NULL OR p.id_sucursal = $1::INTEGER)
            GROUP BY pg.metodo_pago
            ORDER BY total DESC
        `;

        return await this.query(query, [idSucursal]);

    }

}
