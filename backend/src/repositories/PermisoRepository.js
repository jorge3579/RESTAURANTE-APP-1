import BaseRepository from "./BaseRepository.js";

export default class PermisoRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                id_permiso AS "idPermiso",
                codigo,
                nombre,
                descripcion,
                activo,
                fecha_creacion AS "fechaCreacion",
                fecha_modificacion AS "fechaModificacion"
            FROM permisos
            ORDER BY codigo ASC
        `;

        return await this.query(query);

    }

    async listarActivos() {

        const query = `
            SELECT
                id_permiso AS "idPermiso",
                codigo,
                nombre,
                descripcion,
                activo,
                fecha_creacion AS "fechaCreacion",
                fecha_modificacion AS "fechaModificacion"
            FROM permisos
            WHERE activo = TRUE
            ORDER BY codigo ASC
        `;

        return await this.query(query);

    }

    async obtenerPorId(idPermiso) {

        const query = `
            SELECT
                id_permiso AS "idPermiso",
                codigo,
                nombre,
                descripcion,
                activo,
                fecha_creacion AS "fechaCreacion",
                fecha_modificacion AS "fechaModificacion"
            FROM permisos
            WHERE id_permiso = $1
            LIMIT 1
        `;

        return await this.queryOne(
            query,
            [idPermiso]
        );

    }

    async buscarPorCodigo(codigo) {

        const query = `
            SELECT
                id_permiso AS "idPermiso",
                codigo,
                nombre,
                descripcion,
                activo,
                fecha_creacion AS "fechaCreacion",
                fecha_modificacion AS "fechaModificacion"
            FROM permisos
            WHERE codigo = $1
            LIMIT 1
        `;

        return await this.queryOne(
            query,
            [codigo]
        );

    }

    async listarPorRol(idRol, transaction = null) {

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
              AND p.activo = TRUE
            ORDER BY p.codigo ASC
        `;

        return await this.query(
            query,
            [idRol],
            transaction
        );

    }

    async usuarioTienePermiso(
        idUsuario,
        codigoPermiso
    ) {

        const query = `
            SELECT EXISTS
            (
                SELECT 1
                FROM usuarios u

                INNER JOIN usuario_roles ur
                    ON ur.id_usuario = u.id_usuario
                   AND ur.activo = TRUE

                INNER JOIN roles r
                    ON r.id_rol = ur.id_rol
                   AND r.activo = TRUE

                INNER JOIN rol_permisos rp
                    ON rp.id_rol = r.id_rol

                INNER JOIN permisos p
                    ON p.id_permiso = rp.id_permiso
                   AND p.activo = TRUE

                WHERE u.id_usuario = $1
                  AND u.activo = TRUE
                  AND p.codigo = $2
            ) AS existe
        `;

        const resultado = await this.queryOne(
            query,
            [idUsuario, codigoPermiso]
        );

        return resultado?.existe === true;

    }

    async usuarioTieneAlgunPermiso(
        idUsuario,
        codigosPermiso
    ) {

        if (
            !Array.isArray(codigosPermiso) ||
            codigosPermiso.length === 0
        ) {

            return false;

        }

        const query = `
            SELECT EXISTS
            (
                SELECT 1
                FROM usuarios u

                INNER JOIN usuario_roles ur
                    ON ur.id_usuario = u.id_usuario
                   AND ur.activo = TRUE

                INNER JOIN roles r
                    ON r.id_rol = ur.id_rol
                   AND r.activo = TRUE

                INNER JOIN rol_permisos rp
                    ON rp.id_rol = r.id_rol

                INNER JOIN permisos p
                    ON p.id_permiso = rp.id_permiso
                   AND p.activo = TRUE

                WHERE u.id_usuario = $1
                  AND u.activo = TRUE
                  AND p.codigo = ANY($2)
            ) AS existe
        `;

        const resultado = await this.queryOne(
            query,
            [idUsuario, codigosPermiso]
        );

        return resultado?.existe === true;

    }

    async crear(data) {

        const query = `
            INSERT INTO permisos
            (
                codigo,
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
                $4,
                CURRENT_TIMESTAMP
            )
            RETURNING
                id_permiso AS "idPermiso"
        `;

        return await this.queryOne(
            query,
            [data.codigo, data.nombre, data.descripcion ?? null, data.activo ?? true]
        );

    }

    async actualizar(idPermiso, data) {

        const query = `
            UPDATE permisos
            SET
                codigo = $1,
                nombre = $2,
                descripcion = $3,
                activo = $4,
                fecha_modificacion =
                    CURRENT_TIMESTAMP
            WHERE id_permiso = $5
            RETURNING
                id_permiso AS "idPermiso",
                codigo,
                nombre,
                descripcion,
                activo,
                fecha_creacion AS "fechaCreacion",
                fecha_modificacion AS "fechaModificacion"
        `;

        return await this.queryOne(
            query,
            [data.codigo, data.nombre, data.descripcion ?? null, data.activo, idPermiso]
        );

    }

    async eliminar(idPermiso) {

        const query = `
            UPDATE permisos
            SET
                activo = FALSE,
                fecha_modificacion =
                    CURRENT_TIMESTAMP
            WHERE id_permiso = $1
            RETURNING
                id_permiso AS "idPermiso",
                activo
        `;

        return await this.queryOne(
            query,
            [idPermiso]
        );

    }

    async reactivar(idPermiso) {

        const query = `
            UPDATE permisos
            SET
                activo = TRUE,
                fecha_modificacion =
                    CURRENT_TIMESTAMP
            WHERE id_permiso = $1
            RETURNING
                id_permiso AS "idPermiso",
                activo
        `;

        return await this.queryOne(
            query,
            [idPermiso]
        );

    }

    async eliminarPermisosDeRol(
        idRol,
        transaction = null
    ) {

        const query = `
            DELETE FROM rol_permisos
            WHERE id_rol = $1
        `;

        return await this.execute(
            query,
            [idRol],
            transaction
        );

    }

    async asignarPermisoARol(
        idRol,
        idPermiso,
        transaction = null
    ) {

        const query = `
            INSERT INTO rol_permisos
            (
                id_rol,
                id_permiso,
                fecha_creacion
            )
            VALUES
            (
                $1,
                $2,
                CURRENT_TIMESTAMP
            )
            ON CONFLICT
            (
                id_rol,
                id_permiso
            )
            DO NOTHING
        `;

        return await this.execute(
            query,
            [idRol, idPermiso],
            transaction
        );

    }

    async reemplazarPermisosDeRol(
        idRol,
        idsPermisos
    ) {

        if (!Array.isArray(idsPermisos)) {

            throw new TypeError(
                "idsPermisos debe ser un arreglo."
            );

        }

        return await this.databaseManager.transaction(
            async (transaction) => {

                await this.eliminarPermisosDeRol(
                    idRol,
                    transaction
                );

                for (
                    const idPermiso
                    of idsPermisos
                ) {

                    await this.asignarPermisoARol(
                        idRol,
                        idPermiso,
                        transaction
                    );

                }

                return await this.listarPorRol(
                    idRol,
                    transaction
                );

            }
        );

    }

}
