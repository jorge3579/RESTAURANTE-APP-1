import BaseRepository from "./BaseRepository.js";

export default class FidelizacionRepository extends BaseRepository {

    async listarNivelesVIP() {

        const query = `
            SELECT
                id_nivel_vip,
                nombre,
                compras_minimas,
                descuento_porcentaje,
                activo,
                fecha_creacion
            FROM niveles_vip
            WHERE activo = TRUE
            ORDER BY compras_minimas ASC
        `;

        return await this.query(query);

    }

    async obtenerNivelPorCompras(comprasAcumuladas) {

        const query = `
            SELECT
                id_nivel_vip,
                nombre,
                compras_minimas,
                descuento_porcentaje,
                activo,
                fecha_creacion
            FROM niveles_vip
            WHERE activo = TRUE
              AND compras_minimas <= $1
            ORDER BY compras_minimas DESC
            LIMIT 1
        `;

        const result = await this.query(query, [comprasAcumuladas]);

        return result[0] || null;

    }

    async obtenerPuntosUsuario(idUsuario) {

        const query = `
            SELECT
                pu.id_puntos_usuario,
                pu.id_usuario,
                CONCAT(u.nombre, ' ', u.apellido) AS cliente,
                pu.puntos_disponibles AS puntos,
                pu.compras_acumuladas,
                pu.id_nivel_vip,
                nv.nombre AS nivel_vip,
                nv.descuento_porcentaje,
                pu.fecha_creacion,
                pu.fecha_modificacion
            FROM puntos_usuario pu
            INNER JOIN usuarios u
                ON u.id_usuario = pu.id_usuario
            LEFT JOIN niveles_vip nv
                ON nv.id_nivel_vip = pu.id_nivel_vip
            WHERE pu.id_usuario = $1
        `;

        const result = await this.query(query, [idUsuario]);

        return result[0] || null;

    }

    async crearPuntosUsuario(idUsuario, idNivelVIP) {

        const query = `
            INSERT INTO puntos_usuario
            (
                id_usuario,
                puntos_disponibles,
                compras_acumuladas,
                id_nivel_vip,
                fecha_creacion
            )
            VALUES
            (
                $1,
                0,
                0,
                $2,
                CURRENT_TIMESTAMP
            )
            RETURNING id_puntos_usuario AS "id_puntos_usuario"
        `;

        const result = await this.query(query, [idUsuario, idNivelVIP]);

        return result[0];

    }

    async actualizarPuntosUsuario(idUsuario, data) {

        const query = `
            UPDATE puntos_usuario
            SET
                puntos_disponibles = $1,
                compras_acumuladas = $2,
                id_nivel_vip = $3,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_usuario = $4
        `;

        await this.execute(query, [data.puntos, data.comprasAcumuladas, data.idNivelVIP, idUsuario]);

    }

    async registrarMovimiento(data) {

        const query = `
            INSERT INTO historial_puntos
            (
                id_usuario,
                id_pedido,
                puntos,
                tipo_movimiento,
                descripcion,
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
        `;

        await this.execute(query, [data.idUsuario, data.idPedido, data.puntos, data.tipoMovimiento, data.descripcion]);

    }

    async listarHistorial(idUsuario) {

        const query = `
            SELECT
                hp.id_historial_puntos,
                hp.id_usuario,
                CONCAT(u.nombre, ' ', u.apellido) AS cliente,
                hp.id_pedido,
                hp.puntos,
                hp.tipo_movimiento,
                hp.descripcion,
                hp.fecha_creacion
            FROM historial_puntos hp
            INNER JOIN usuarios u
                ON u.id_usuario = hp.id_usuario
            WHERE hp.id_usuario = $1
            ORDER BY hp.fecha_creacion DESC
        `;

        return await this.query(query, [idUsuario]);

    }

}
