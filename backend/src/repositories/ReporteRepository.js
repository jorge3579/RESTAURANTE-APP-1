import BaseRepository from "./BaseRepository.js";

export default class ReporteRepository extends BaseRepository {

    async ventasPorRango(fechaDesde, fechaHasta, idSucursal = null) {

        const query = `
            SELECT
                CAST(p.fecha_creacion AS DATE) AS fecha,
                s.nombre AS sucursal,
                COUNT(p.id_pedido) AS cantidad_pedidos,
                SUM(p.subtotal) AS subtotal,
                SUM(p.descuento) AS descuento,
                SUM(p.total) AS total
            FROM pedidos p
            INNER JOIN sucursales s
                ON s.id_sucursal = p.id_sucursal
            WHERE CAST(p.fecha_creacion AS DATE) BETWEEN $1 AND $2
              AND p.estado <> 'CANCELADO'
              AND ($3::INTEGER IS NULL OR p.id_sucursal = $3::INTEGER)
            GROUP BY CAST(p.fecha_creacion AS DATE), s.nombre
            ORDER BY fecha ASC
        `;

        return await this.query(query, [fechaDesde, fechaHasta, idSucursal]);

    }

    async productosVendidos(fechaDesde, fechaHasta, idSucursal = null) {

        const query = `
            SELECT
                pr.id_producto,
                pr.nombre AS producto,
                c.nombre AS categoria,
                SUM(pd.cantidad) AS cantidad_vendida,
                SUM(pd.subtotal) AS total_vendido
            FROM pedido_detalles pd
            INNER JOIN pedidos p
                ON p.id_pedido = pd.id_pedido
            INNER JOIN productos pr
                ON pr.id_producto = pd.id_producto
            INNER JOIN categorias c
                ON c.id_categoria = pr.id_categoria
            WHERE CAST(p.fecha_creacion AS DATE) BETWEEN $1 AND $2
              AND p.estado <> 'CANCELADO'
              AND ($3::INTEGER IS NULL OR p.id_sucursal = $3::INTEGER)
            GROUP BY pr.id_producto, pr.nombre, c.nombre
            ORDER BY cantidad_vendida DESC
        `;

        return await this.query(query, [fechaDesde, fechaHasta, idSucursal]);

    }

    async reservasPorRango(fechaDesde, fechaHasta, idSucursal = null) {

        const query = `
            SELECT
                r.fecha_reserva,
                s.nombre AS sucursal,
                r.estado,
                COUNT(r.id_reserva) AS cantidad
            FROM reservas r
            INNER JOIN sucursales s
                ON s.id_sucursal = r.id_sucursal
            WHERE r.fecha_reserva BETWEEN $1 AND $2
              AND ($3::INTEGER IS NULL OR r.id_sucursal = $3::INTEGER)
            GROUP BY r.fecha_reserva, s.nombre, r.estado
            ORDER BY r.fecha_reserva ASC
        `;

        return await this.query(query, [fechaDesde, fechaHasta, idSucursal]);

    }

    async pagosPorRango(fechaDesde, fechaHasta, idSucursal = null) {

        const query = `
            SELECT
                pg.metodo_pago,
                pg.estado,
                COUNT(pg.id_pago) AS cantidad,
                SUM(pg.monto) AS total
            FROM pagos pg
            INNER JOIN pedidos p
                ON p.id_pedido = pg.id_pedido
            WHERE CAST(pg.fecha_creacion AS DATE) BETWEEN $1 AND $2
              AND ($3::INTEGER IS NULL OR p.id_sucursal = $3::INTEGER)
            GROUP BY pg.metodo_pago, pg.estado
            ORDER BY pg.metodo_pago ASC
        `;

        return await this.query(query, [fechaDesde, fechaHasta, idSucursal]);

    }

}
