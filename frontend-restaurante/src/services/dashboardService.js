import httpClient from "./httpClient";

class DashboardService {

    async resumen() {

        const response = await httpClient.get("/dashboard/resumen");

        return response.data.data;

    }

}

export default new DashboardService();