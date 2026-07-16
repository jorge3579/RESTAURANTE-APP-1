import BaseRepository from "./BaseRepository.js";

export default class PedidoRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                p.id_pedido,
                p.id_reserva,
                p.id_usuario,
                CONCAT(u.nombre,' ',u.apellido) AS cliente,
                p.id_sucursal,
                s.nombre AS sucursal,
                p.tipo_consumo,
                p.estado,
                p.subtotal,
                p.descuento,
                p.total,
                p.observaciones,
                p.fecha_creacion,
                p.fecha_modificacion
            FROM pedidos p
            INNER JOIN usuarios u
                ON u.id_usuario = p.id_usuario
            INNER JOIN sucursales s
                ON s.id_sucursal = p.id_sucursal
            ORDER BY p.fecha_creacion DESC
        `;

        return await this.query(query);

    }

    async listarPorUsuario(idUsuario) {
        const query = `
            SELECT
                p.id_pedido,
                p.id_reserva,
                p.id_usuario,
                CONCAT(u.nombre,' ',u.apellido) AS cliente,
                p.id_sucursal,
                s.nombre AS sucursal,
                p.tipo_consumo,
                p.estado,
                p.subtotal,
                p.descuento,
                p.total,
                p.observaciones,
                p.fecha_creacion,
                p.fecha_modificacion
            FROM pedidos p
            INNER JOIN usuarios u ON u.id_usuario = p.id_usuario
            INNER JOIN sucursales s ON s.id_sucursal = p.id_sucursal
            WHERE p.id_usuario = $1
            ORDER BY p.fecha_creacion DESC
        `;
        return await this.query(query, [idUsuario]);
    }

    async obtenerPorId(idPedido) {

        const query = `
            SELECT
                p.id_pedido,
                p.id_reserva,
                p.id_usuario,
                CONCAT(u.nombre,' ',u.apellido) AS cliente,
                p.id_sucursal,
                s.nombre AS sucursal,
                p.tipo_consumo,
                p.estado,
                p.subtotal,
                p.descuento,
                p.total,
                p.observaciones,
                p.fecha_creacion,
                p.fecha_modificacion
            FROM pedidos p
            INNER JOIN usuarios u
                ON u.id_usuario = p.id_usuario
            INNER JOIN sucursales s
                ON s.id_sucursal = p.id_sucursal
            WHERE p.id_pedido = $1
        `;

        const result = await this.query(query, [idPedido]);

        return result[0] || null;

    }

    async obtenerDetalles(idPedido) {

        const query = `
            SELECT
                pd.id_pedido_detalle,
                pd.id_pedido,
                pd.id_producto,
                pr.nombre AS producto,
                pd.cantidad,
                pd.precio_unitario,
                pd.subtotal,
                pd.observaciones,
                pd.fecha_creacion
            FROM pedido_detalles pd
            INNER JOIN productos pr
                ON pr.id_producto = pd.id_producto
            WHERE pd.id_pedido = $1
            ORDER BY pd.id_pedido_detalle
        `;

        return await this.query(query, [idPedido]);

    }

    async crear(data, transaction = null) {

        const query = `
            INSERT INTO pedidos
            (
                id_reserva,
                id_usuario,
                id_sucursal,
                numero_pedido,
                tipo_consumo,
                estado,
                subtotal,
                descuento,
                total,
                observaciones,
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
                $8,
                $9,
                $10,
                CURRENT_TIMESTAMP
            )
            RETURNING id_pedido AS "id_pedido"
        `;

        const result = await this.query(query, [data.idReserva, data.idUsuario, data.idSucursal, data.numeroPedido, data.tipoConsumo, data.estado, data.subtotal, data.descuento, data.total, data.observaciones], transaction);

        return result[0];

    }

    async agregarDetalle(detalle, transaction = null) {

        const query = `
            INSERT INTO pedido_detalles
            (
                id_pedido,
                id_producto,
                nombre_producto,
                cantidad,
                precio_unitario,
                subtotal,
                observaciones,
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
        `;

        await this.execute(query, [detalle.idPedido, detalle.idProducto, detalle.nombreProducto, detalle.cantidad, detalle.precioUnitario, detalle.subtotal, detalle.observaciones], transaction);

    }

    async actualizarEstado(idPedido, estado) {

        const query = `
            UPDATE pedidos
            SET
                estado = $1,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_pedido = $2
        `;

        await this.execute(query, [estado, idPedido]);

    }

}
