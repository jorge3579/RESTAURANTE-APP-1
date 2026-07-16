export default class RolDTO {

    static fromDatabase(rol) {

        if (!rol) {
            return null;
        }

        return {
            idRol: rol.idRol,
            nombre: rol.nombre,
            descripcion: rol.descripcion,
            activo: rol.activo,
            fechaCreacion: rol.fechaCreacion
        };

    }

}