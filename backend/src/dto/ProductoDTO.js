export default class ProductoDTO {

    static fromDatabase(producto) {

        if (!producto) {
            return null;
        }

        return {
            idProducto: producto.idProducto,
            idCategoria: producto.idCategoria,
            categoria: producto.categoria || producto.nombreCategoria || null,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: Number(producto.precio),
            imagenUrl: producto.imagenUrl,
            disponible: producto.disponible,
            activo: producto.activo,
            fechaCreacion: producto.fechaCreacion,
            fechaModificacion: producto.fechaModificacion
        };

    }

}