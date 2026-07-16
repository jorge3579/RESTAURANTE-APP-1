import BaseRepository from "./BaseRepository.js";

export default class RolRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                id_rol AS "idRol",
                nombre,
                descripcion,
                activo,
                fecha_creacion AS "fechaCreacion",
                fecha_modificacion AS "fechaModificacion"
            FROM roles
            ORDER BY id_rol ASC
        `;

        return await this.query(query);

    }

    async listarActivos() {

        const query = `
            SELECT
                id_rol AS "idRol",
                nombre,
                descripcion,
                activo,
                fecha_creacion AS "fechaCreacion",
                fecha_modificacion AS "fechaModificacion"
            FROM roles
            WHERE activo = TRUE
            ORDER BY nombre ASC
        `;

        return await this.query(query);

    }

    async obtenerPorId(idRol) {

        const query = `
            SELECT
                id_rol AS "idRol",
                nombre,
                descripcion,
                activo,
                fecha_creacion AS "fechaCreacion",
                fecha_modificacion AS "fechaModificacion"
            FROM roles
            WHERE id_rol = $1
            LIMIT 1
        `;

        return await this.queryOne(
            query,
            [idRol]
        );

    }

    async buscarPorNombre(nombre) {

        const query = `
            SELECT
                id_rol AS "idRol",
                nombre,
                descripcion,
                activo,
                fecha_creacion AS "fechaCreacion",
                fecha_modificacion AS "fechaModificacion"
            FROM roles
            WHERE LOWER(nombre) = LOWER($1)
            LIMIT 1
        `;

        return await this.queryOne(
            query,
            [nombre]
        );

    }

    async crear(data) {

        const query = `
            INSERT INTO roles
            (
                nombre,
                descripcion,
                activo,
                fecha_creacion
            )
            VALUES
            (
                $1,
                $2,
                $3,
                CURRENT_TIMESTAMP
            )
            RETURNING
                id_rol AS "idRol"
        `;

        return await this.queryOne(
            query,
            [data.nombre, data.descripcion ?? null, data.activo ?? true]
        );

    }

    async actualizar(idRol, data) {

        const query = `
            UPDATE roles
            SET
                nombre = $1,
                descripcion = $2,
                activo = $3,
                fecha_modificacion =
                    CURRENT_TIMESTAMP
            WHERE id_rol = $4
            RETURNING
                id_rol AS "idRol",
                nombre,
                descripcion,
                activo,
                fecha_creacion AS "fechaCreacion",
                fecha_modificacion AS "fechaModificacion"
        `;

        return await this.queryOne(
            query,
            [data.nombre, data.descripcion ?? null, data.activo, idRol]
        );

    }

    async eliminar(idRol) {

        const query = `
            UPDATE roles
            SET
                activo = FALSE,
                fecha_modificacion =
                    CURRENT_TIMESTAMP
            WHERE id_rol = $1
            RETURNING
                id_rol AS "idRol",
                activo
        `;

        return await this.queryOne(
            query,
            [idRol]
        );

    }

    async reactivar(idRol) {

        const query = `
            UPDATE roles
            SET
                activo = TRUE,
                fecha_modificacion =
                    CURRENT_TIMESTAMP
            WHERE id_rol = $1
            RETURNING
                id_rol AS "idRol",
                activo
        `;

        return await this.queryOne(
            query,
            [idRol]
        );

    }

    async tieneUsuariosAsignados(idRol) {

        const query = `
            SELECT EXISTS
            (
                SELECT 1
                FROM usuarios
                WHERE id_rol_principal = $1

                UNION ALL

                SELECT 1
                FROM usuario_roles
                WHERE id_rol = $1
                  AND activo = TRUE
            ) AS existe
        `;

        const resultado = await this.queryOne(
            query,
            [idRol]
        );

        return resultado?.existe === true;

    }

    async obtenerPermisos(idRol) {

        const query = `
            SELECT
                p.id_permiso AS "idPermiso",
                p.codigo,
                p.nombre,
                p.descripcion,
                p.activo,
                p.fecha_creacion AS "fechaCreacion",
                p.fecha_modificacion AS "fechaModificacion"
            FROM rol_permisos rp
            INNER JOIN permisos p
                ON p.id_permiso = rp.id_permiso
            WHERE rp.id_rol = $1
            ORDER BY p.codigo ASC
        `;

        return await this.query(
            query,
            [idRol]
        );

    }

}
