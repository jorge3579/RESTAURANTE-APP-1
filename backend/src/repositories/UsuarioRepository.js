import BaseRepository from "./BaseRepository.js";

export default class UsuarioRepository extends BaseRepository {

    async listar() {

        const query = `
            SELECT
                u.id_usuario AS "idUsuario",
                u.id_rol_principal AS "idRol",
                r.nombre AS rol,
                u.nombre,
                u.apellido,
                u.dni,
                u.email::TEXT AS email,
                u.telefono,
                u.email_verificado AS "emailVerificado",
                u.ultimo_login AS "ultimoLogin",
                u.activo,
                u.fecha_registro AS "fechaCreacion",
                u.fecha_modificacion AS "fechaModificacion"
            FROM usuarios u
            INNER JOIN roles r
                ON r.id_rol = u.id_rol_principal
            ORDER BY
                u.apellido ASC,
                u.nombre ASC
        `;

        return await this.query(query);

    }

    async obtenerPorId(idUsuario, transaction = null) {

        const query = `
            SELECT
                u.id_usuario AS "idUsuario",
                u.id_rol_principal AS "idRol",
                r.nombre AS rol,
                u.nombre,
                u.apellido,
                u.dni,
                u.email::TEXT AS email,
                u.telefono,
                u.password_hash AS "passwordHash",
                u.email_verificado AS "emailVerificado",
                u.ultimo_login AS "ultimoLogin",
                u.activo,
                u.fecha_registro AS "fechaCreacion",
                u.fecha_modificacion AS "fechaModificacion"
            FROM usuarios u
            INNER JOIN roles r
                ON r.id_rol = u.id_rol_principal
            WHERE u.id_usuario = $1
            LIMIT 1
        `;

        return await this.queryOne(
            query,
            [idUsuario],
            transaction
        );

    }

    async obtenerPorEmail(email) {

        const query = `
            SELECT
                u.id_usuario AS "idUsuario",
                u.id_rol_principal AS "idRol",
                r.nombre AS rol,
                u.nombre,
                u.apellido,
                u.dni,
                u.email::TEXT AS email,
                u.telefono,
                u.password_hash AS "passwordHash",
                u.email_verificado AS "emailVerificado",
                u.ultimo_login AS "ultimoLogin",
                u.activo,
                u.fecha_registro AS "fechaCreacion",
                u.fecha_modificacion AS "fechaModificacion"
            FROM usuarios u
            INNER JOIN roles r
                ON r.id_rol = u.id_rol_principal
            WHERE u.email = $1
            LIMIT 1
        `;

        return await this.queryOne(
            query,
            [email]
        );

    }

    async obtenerPorDni(dni) {

        const query = `
            SELECT
                u.id_usuario AS "idUsuario",
                u.id_rol_principal AS "idRol",
                r.nombre AS rol,
                u.nombre,
                u.apellido,
                u.dni,
                u.email::TEXT AS email,
                u.telefono,
                u.email_verificado AS "emailVerificado",
                u.ultimo_login AS "ultimoLogin",
                u.activo,
                u.fecha_registro AS "fechaCreacion",
                u.fecha_modificacion AS "fechaModificacion"
            FROM usuarios u
            INNER JOIN roles r
                ON r.id_rol = u.id_rol_principal
            WHERE u.dni = $1
            LIMIT 1
        `;

        return await this.queryOne(
            query,
            [dni]
        );

    }

    async crear(data) {

        return await this.databaseManager.transaction(
            async (transaction) => {

                const queryUsuario = `
                    INSERT INTO usuarios
                    (
                        id_rol_principal,
                        nombre,
                        apellido,
                        dni,
                        email,
                        telefono,
                        password_hash,
                        email_verificado,
                        activo,
                        fecha_registro
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
                        CURRENT_TIMESTAMP
                    )
                    RETURNING
                        id_usuario AS "idUsuario"
                `;

                const usuarioCreado =
                    await this.queryOne(
                        queryUsuario,
                        [data.idRol, data.nombre, data.apellido, data.dni ?? null, data.email, data.telefono ?? null, data.passwordHash, data.emailVerificado ?? false, data.activo ?? true],
                        transaction
                    );

                const queryRol = `
                    INSERT INTO usuario_roles
                    (
                        id_usuario,
                        id_rol,
                        es_principal,
                        activo,
                        fecha_asignacion
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        TRUE,
                        TRUE,
                        CURRENT_TIMESTAMP
                    )
                    ON CONFLICT
                    (
                        id_usuario,
                        id_rol
                    )
                    DO UPDATE
                    SET
                        es_principal = TRUE,
                        activo = TRUE,
                        fecha_modificacion =
                            CURRENT_TIMESTAMP
                `;

                await this.execute(
                    queryRol,
                    [usuarioCreado.idUsuario, data.idRol],
                    transaction
                );

                return usuarioCreado;

            }
        );

    }

    async actualizar(idUsuario, data) {

        return await this.databaseManager.transaction(
            async (transaction) => {

                const queryUsuario = `
                    UPDATE usuarios
                    SET
                        id_rol_principal = $1,
                        nombre = $2,
                        apellido = $3,
                        dni = $4,
                        email = $5,
                        telefono = $6,
                        email_verificado =
                            $7,
                        activo = $8,
                        fecha_modificacion =
                            CURRENT_TIMESTAMP
                    WHERE id_usuario = $9
                `;

                await this.execute(
                    queryUsuario,
                    [data.idRol, data.nombre, data.apellido, data.dni ?? null, data.email, data.telefono ?? null, data.emailVerificado ?? false, data.activo, idUsuario],
                    transaction
                );

                const queryQuitarPrincipal = `
                    UPDATE usuario_roles
                    SET
                        es_principal = FALSE,
                        fecha_modificacion =
                            CURRENT_TIMESTAMP
                    WHERE id_usuario = $1
                      AND es_principal = TRUE
                `;

                await this.execute(
                    queryQuitarPrincipal,
                    [idUsuario],
                    transaction
                );

                const queryAsignarRol = `
                    INSERT INTO usuario_roles
                    (
                        id_usuario,
                        id_rol,
                        es_principal,
                        activo,
                        fecha_asignacion
                    )
                    VALUES
                    (
                        $1,
                        $2,
                        TRUE,
                        TRUE,
                        CURRENT_TIMESTAMP
                    )
                    ON CONFLICT
                    (
                        id_usuario,
                        id_rol
                    )
                    DO UPDATE
                    SET
                        es_principal = TRUE,
                        activo = TRUE,
                        fecha_modificacion =
                            CURRENT_TIMESTAMP
                `;

                await this.execute(
                    queryAsignarRol,
                    [idUsuario, data.idRol],
                    transaction
                );

                return await this.obtenerPorId(
                    idUsuario,
                    transaction
                );

            }
        );

    }

    async actualizarPassword(
        idUsuario,
        passwordHash
    ) {

        const query = `
            UPDATE usuarios
            SET
                password_hash = $1,
                fecha_modificacion =
                    CURRENT_TIMESTAMP
            WHERE id_usuario = $2
        `;

        return await this.execute(
            query,
            [passwordHash, idUsuario]
        );

    }

    async actualizarUltimoAcceso(idUsuario) {

        const query = `
            UPDATE usuarios
            SET
                ultimo_login =
                    CURRENT_TIMESTAMP,
                fecha_modificacion =
                    CURRENT_TIMESTAMP
            WHERE id_usuario = $1
        `;

        return await this.execute(
            query,
            [idUsuario]
        );

    }

    async verificarEmail(idUsuario) {

        const query = `
            UPDATE usuarios
            SET
                email_verificado = TRUE,
                fecha_modificacion =
                    CURRENT_TIMESTAMP
            WHERE id_usuario = $1
        `;

        return await this.execute(
            query,
            [idUsuario]
        );

    }

    async eliminar(idUsuario) {

        const query = `
            UPDATE usuarios
            SET
                activo = FALSE,
                fecha_modificacion =
                    CURRENT_TIMESTAMP
            WHERE id_usuario = $1
        `;

        return await this.execute(
            query,
            [idUsuario]
        );

    }

}
