export default class CategoriaDTO {

    static fromDatabase(categoria) {

        if (!categoria) {
            return null;
        }

        return {
            idCategoria: categoria.idCategoria,
            nombre: categoria.nombre,
            descripcion: categoria.descripcion,
            activa: categoria.activa,
            fechaCreacion: categoria.fechaCreacion,
            fechaModificacion: categoria.fechaModificacion
        };

    }

}