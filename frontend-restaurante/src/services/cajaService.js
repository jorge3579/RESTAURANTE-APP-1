import httpClient from "./httpClient";

class CajaService {

    async listar() {

        const response = await httpClient.get("/cajas");

        return response.data.data;

    }

    async abrir(data) {

        const response = await httpClient.post(
            "/cajas/abrir",
            data
        );

        return response.data.data;

    }

    async cerrar(idCaja, data) {

        const response = await httpClient.put(
            `/cajas/${idCaja}/cerrar`,
            data
        );

        return response.data.data;

    }

}

export default new CajaService();