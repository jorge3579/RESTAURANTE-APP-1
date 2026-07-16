import httpClient from "./httpClient";

class DashboardService {

    async obtenerDashboard() {

        const response = await httpClient.get(

            "/dashboard/resumen"

        );

        return response.data.data.resumenGeneral;

    }

}

export default new DashboardService();