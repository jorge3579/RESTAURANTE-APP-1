import httpClient from "./httpClient";

class ReservaService {

    async listar() {

        const response =

            await httpClient.get(

                "/reservas/mis-reservas"

            );

        return response.data.data;

    }

    async obtener(id) {

        const response =

            await httpClient.get(

                `/reservas/${id}`

            );

        return response.data.data;

    }

    async crear(data) {

        const response =

            await httpClient.post(

                "/reservas",

                data

            );

        return response.data.data;

    }

    async cancelar(id) {

        const response =

            await httpClient.put(

                `/reservas/${id}/cancelar`

            );

        return response.data.data;

    }

}

export default new ReservaService();
