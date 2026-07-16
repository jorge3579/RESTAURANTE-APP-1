export default class PermisoDTO {

    static fromDatabase(permiso) {

        if (!permiso) {
            return null;
        }

        return {
            idPermiso: permiso.idPermiso,
            codigo: permiso.codigo,
            nombre: permiso.nombre,
            descripcion: permiso.descripcion,
            activo: permiso.activo,
            fechaCreacion: permiso.fechaCreacion
        };

    }

}