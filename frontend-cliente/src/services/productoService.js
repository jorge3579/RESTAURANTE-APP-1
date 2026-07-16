import httpClient from "./httpClient";

class ProductoService {

    async listar() {

        const response =

            await httpClient.get(

                "/productos/disponibles"

            );

        return response.data.data;

    }

    async obtener(id) {

        const response =

            await httpClient.get(

                `/productos/${id}`

            );

        return response.data.data;

    }

}

export default new ProductoService();
