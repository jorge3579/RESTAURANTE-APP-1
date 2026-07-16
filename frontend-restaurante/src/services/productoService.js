import httpClient from "./httpClient";

const productoService = {
    listar: async () => {
        const response = await httpClient.get("/productos");
        return response.data.data;
    },

    obtenerPorId: async (id) => {
        const response = await httpClient.get(`/productos/${id}`);
        return response.data.data;
    },

    crear: async (data) => {
        const response = await httpClient.post("/productos", data);
        return response.data.data;
    },

    actualizar: async (id, data) => {
        const response = await httpClient.put(`/productos/${id}`, data);
        return response.data.data;
    },

    eliminar: async (id) => {
        const response = await httpClient.delete(`/productos/${id}`);
        return response.data.data;
    },

    listarCategorias: async () => {
        const response = await httpClient.get("/categorias");
        return response.data.data;
    },

    subirImagen: async (asset) => {
        const formData = new FormData();
        formData.append("imagen", {
            uri: asset.uri,
            name: asset.fileName || `producto-${Date.now()}.jpg`,
            type: asset.mimeType || "image/jpeg"
        });
        const response = await httpClient.post("/productos/imagen", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 30000
        });
        return response.data.data;
    },

    crearCategoria: async (data) => {
        const response = await httpClient.post("/categorias", data);
        return response.data.data;
    },

    actualizarCategoria: async (id, data) => {
        const response = await httpClient.put(`/categorias/${id}`, data);
        return response.data.data;
    },

    eliminarCategoria: async (id) => {
        const response = await httpClient.delete(`/categorias/${id}`);
        return response.data.data;
    }
};

export default productoService;
