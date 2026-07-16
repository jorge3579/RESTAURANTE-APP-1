import httpClient from "./httpClient";

class SucursalService {
    async listar() {
        const response = await httpClient.get("/sucursales");
        return response.data.data;
    }

    async listarHorarios(idSucursal) {
        const response = await httpClient.get(`/sucursales/${idSucursal}/horarios`);
        return response.data.data;
    }

    async guardarHorarios(idSucursal, horarios) {
        const response = await httpClient.put(`/sucursales/${idSucursal}/horarios`, { horarios });
        return response.data.data;
    }
}

export default new SucursalService();
