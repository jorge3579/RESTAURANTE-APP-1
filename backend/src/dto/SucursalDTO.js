export default class SucursalDTO {

    static fromDatabase(sucursal) {

        if (!sucursal) {
            return null;
        }

        return {
            idSucursal: sucursal.idSucursal,
            nombre: sucursal.nombre,
            direccion: sucursal.direccion,
            telefono: sucursal.telefono,
            email: sucursal.email,
            ciudad: sucursal.ciudad,
            provincia: sucursal.provincia,
            activo: sucursal.activo,
            fechaCreacion: sucursal.fechaCreacion,
            fechaModificacion: sucursal.fechaModificacion
        };

    }

}