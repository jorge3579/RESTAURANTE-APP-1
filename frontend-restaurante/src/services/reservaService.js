import httpClient from "./httpClient";

const reservaService = {
    listar: async () => {
        const response = await httpClient.get("/reservas");
        return response.data.data;
    },
    confirmar: async (id) => {
        const response = await httpClient.put(`/reservas/${id}/confirmar`);
        return response.data.data;
    },
    cancelar: async (id) => {
        const response = await httpClient.put(`/reservas/${id}/cancelar`);
        return response.data.data;
    },
    finalizar: async (id) => {
        const response = await httpClient.put(`/reservas/${id}/finalizar`);
        return response.data.data;
    },
    noAsistio: async (id) => {
        const response = await httpClient.put(`/reservas/${id}/no-asistio`);
        return response.data.data;
    }
};

export default reservaService;
