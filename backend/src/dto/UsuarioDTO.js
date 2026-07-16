export default class UsuarioDTO {

    static fromDatabase(usuario) {

        if (!usuario) {
            return null;
        }

        return {
            idUsuario: usuario.idUsuario,
            idRol: usuario.idRol,
            rol: usuario.rol || usuario.nombreRol || null,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            telefono: usuario.telefono,
            activo: usuario.activo,
            ultimoLogin: usuario.ultimoLogin,
            fechaCreacion: usuario.fechaCreacion
        };

    }

}