import httpClient from "./httpClient";

class CreditoService {

    async misCreditos() {

        const response = await httpClient.get("/creditos/mis-creditos");

        return response.data.data;

    }

}

export default new CreditoService();