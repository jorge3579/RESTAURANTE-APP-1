import httpClient from "./httpClient";

const promocionService = {
    listar: async () => {
        const response = await httpClient.get("/promociones");
        return response.data.data;
    },

    obtenerPorId: async (id) => {
        const response = await httpClient.get(`/promociones/${id}`);
        return response.data.data;
    },

    crear: async (data) => {
        const response = await httpClient.post("/promociones", data);
        return response.data.data;
    },

    actualizar: async (id, data) => {
        const response = await httpClient.put(`/promociones/${id}`, data);
        return response.data.data;
    },

    eliminar: async (id) => {
        const response = await httpClient.delete(`/promociones/${id}`);
        return response.data.data;
    }
};

export default promocionService;
