import BaseRepository from "./BaseRepository.js";

export default class AuthRepository extends BaseRepository {

    async buscarUsuarioPorEmail(email) {

        const query = `
            SELECT
                u.id_usuario AS "idUsuario",
                u.id_rol_principal AS "idRol",
                r.nombre AS "nombreRol",
                u.nombre,
                u.apellido,
                u.email::TEXT AS email,
                u.telefono,
                u.password_hash AS "passwordHash",
                u.email_verificado AS "emailVerificado",
                u.activo,
                u.ultimo_login AS "ultimoLogin",
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

    async buscarRolPorNombre(nombreRol) {

        const query = `
            SELECT
                id_rol AS "idRol",
                nombre,
                descripcion,
                activo,
                fecha_creacion AS "fechaCreacion",
                fecha_modificacion AS "fechaModificacion"
            FROM roles
            WHERE nombre = $1
              AND activo = TRUE
            LIMIT 1
        `;

        return await this.queryOne(
            query,
            [nombreRol]
        );

    }

    async crearUsuario(usuario) {

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
                        FALSE,
                        TRUE,
                        CURRENT_TIMESTAMP
                    )
                    RETURNING
                        id_usuario AS "idUsuario"
                `;

                const usuarioCreado =
                    await this.queryOne(
                        queryUsuario,
                        [usuario.idRol, usuario.nombre, usuario.apellido, usuario.dni ?? null, usuario.email, usuario.telefono ?? null, usuario.passwordHash],
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
                    [usuarioCreado.idUsuario, usuario.idRol],
                    transaction
                );

                return usuarioCreado;

            }
        );

    }

    async actualizarUltimoLogin(idUsuario) {

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

    async guardarRefreshToken(data) {

        const query = `
            INSERT INTO refresh_tokens
            (
                id_usuario,
                token_hash,
                fecha_expiracion,
                fecha_creacion,
                revocado,
                dispositivo,
                ip
            )
            VALUES
            (
                $1,
                $2,
                $3,
                CURRENT_TIMESTAMP,
                FALSE,
                $4,
                $5
            )
            RETURNING
                id_refresh_token AS "idRefreshToken"
        `;

        return await this.queryOne(
            query,
            [data.idUsuario, data.token, data.fechaExpiracion, data.dispositivo ?? null, data.ip ?? null]
        );

    }

    async buscarRefreshToken(token) {

        const query = `
            SELECT
                rt.id_refresh_token
                    AS "idRefreshToken",

                rt.id_usuario
                    AS "idUsuario",

                rt.token_hash
                    AS token,

                rt.fecha_expiracion
                    AS "fechaExpiracion",

                rt.fecha_creacion
                    AS "fechaCreacion",

                rt.fecha_revocacion
                    AS "fechaRevocacion",

                rt.revocado,

                rt.dispositivo,

                rt.ip,

                u.id_rol_principal
                    AS "idRol",

                r.nombre
                    AS "nombreRol",

                u.nombre,

                u.apellido,

                u.email::TEXT
                    AS email,

                u.telefono,

                u.email_verificado
                    AS "emailVerificado",

                u.activo

            FROM refresh_tokens rt

            INNER JOIN usuarios u
                ON u.id_usuario =
                   rt.id_usuario

            INNER JOIN roles r
                ON r.id_rol =
                   u.id_rol_principal

            WHERE rt.token_hash = $1

            LIMIT 1
        `;

        return await this.queryOne(
            query,
            [token]
        );

    }

    async revocarRefreshToken(token) {

        const query = `
            UPDATE refresh_tokens
            SET
                revocado = TRUE,

                fecha_revocacion =
                    COALESCE(
                        fecha_revocacion,
                        CURRENT_TIMESTAMP
                    )
            WHERE token_hash = $1
              AND revocado = FALSE
        `;

        return await this.execute(
            query,
            [token]
        );

    }

    async revocarTodosLosTokens(idUsuario) {

        const query = `
            UPDATE refresh_tokens
            SET
                revocado = TRUE,

                fecha_revocacion =
                    COALESCE(
                        fecha_revocacion,
                        CURRENT_TIMESTAMP
                    )
            WHERE id_usuario = $1
              AND revocado = FALSE
        `;

        return await this.execute(
            query,
            [idUsuario]
        );

    }

    async eliminarTokensVencidos() {

        const query = `
            DELETE FROM refresh_tokens
            WHERE fecha_expiracion <
                  CURRENT_TIMESTAMP
        `;

        return await this.execute(query);

    }

}
