import BaseRepository from "./BaseRepository.js";

export default class ProductoRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                p.id_producto,
                p.id_categoria,
                c.nombre AS nombre_categoria,
                p.nombre,
                p.descripcion,
                p.precio,
                p.imagen_url,
                p.disponible,
                p.activo,
                p.fecha_creacion,
                p.fecha_modificacion
            FROM productos p
            INNER JOIN categorias c
                ON c.id_categoria = p.id_categoria
            ORDER BY c.nombre ASC, p.nombre ASC
        `;

        return await this.query(query);

    }

    async listarDisponibles() {

        const query = `
            SELECT
                p.id_producto,
                p.id_categoria,
                c.nombre AS nombre_categoria,
                p.nombre,
                p.descripcion,
                p.precio,
                p.imagen_url,
                p.disponible,
                p.activo,
                p.fecha_creacion,
                p.fecha_modificacion
            FROM productos p
            INNER JOIN categorias c
                ON c.id_categoria = p.id_categoria
            WHERE p.disponible = TRUE
              AND p.activo = TRUE
              AND c.activa = TRUE
            ORDER BY c.nombre ASC, p.nombre ASC
        `;

        return await this.query(query);

    }

    async obtenerPorId(idProducto) {

        const query = `
            SELECT
                p.id_producto,
                p.id_categoria,
                c.nombre AS nombre_categoria,
                p.nombre,
                p.descripcion,
                p.precio,
                p.imagen_url,
                p.disponible,
                p.activo,
                p.fecha_creacion,
                p.fecha_modificacion
            FROM productos p
            INNER JOIN categorias c
                ON c.id_categoria = p.id_categoria
            WHERE p.id_producto = $1
        `;

        const result = await this.query(query, [idProducto]);

        return result[0] || null;

    }

    async listarPorCategoria(idCategoria) {

        const query = `
            SELECT
                p.id_producto,
                p.id_categoria,
                c.nombre AS nombre_categoria,
                p.nombre,
                p.descripcion,
                p.precio,
                p.imagen_url,
                p.disponible,
                p.activo,
                p.fecha_creacion,
                p.fecha_modificacion
            FROM productos p
            INNER JOIN categorias c
                ON c.id_categoria = p.id_categoria
            WHERE p.id_categoria = $1
            ORDER BY p.nombre ASC
        `;

        return await this.query(query, [idCategoria]);

    }

    async crear(data) {

        const query = `
            INSERT INTO productos
            (
                id_categoria,
                nombre,
                descripcion,
                precio,
                imagen_url,
                disponible,
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
            RETURNING id_producto AS "id_producto"
        `;

        const result = await this.query(query, [data.idCategoria, data.nombre, data.descripcion, data.precio, data.imagenUrl, data.disponible, data.activo]);

        return result[0];

    }

    async actualizar(idProducto, data) {

        const query = `
            UPDATE productos
            SET
                id_categoria = $1,
                nombre = $2,
                descripcion = $3,
                precio = $4,
                imagen_url = $5,
                disponible = $6,
                activo = $7,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_producto = $8
        `;

        await this.execute(query, [data.idCategoria, data.nombre, data.descripcion, data.precio, data.imagenUrl, data.disponible, data.activo, idProducto]);

    }

    async eliminar(idProducto) {

        const query = `
            UPDATE productos
            SET
                activo = FALSE,
                fecha_modificacion = CURRENT_TIMESTAMP
            WHERE id_producto = $1
        `;

        await this.execute(query, [idProducto]);

    }

}
