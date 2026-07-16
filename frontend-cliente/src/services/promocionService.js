import httpClient from "./httpClient";

class PromocionService {

    async listarActivas() {

        const response = await httpClient.get("/promociones/activas");

        return response.data.data;

    }

}

export default new PromocionService();