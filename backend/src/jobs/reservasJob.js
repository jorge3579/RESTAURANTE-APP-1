import cron from "node-cron";

import Logger from "../utils/Logger.js";
import databaseManager from "../config/databaseManager.js";

export function iniciarReservasJob() {

    cron.schedule("*/10 * * * *", async () => {

        try {

            const query = `
                UPDATE reservas
                SET
                    estado = 'NO_ASISTIO',
                    fecha_modificacion = CURRENT_TIMESTAMP
                WHERE estado = 'CONFIRMADA'
                  AND fecha_reserva + hora_reserva + INTERVAL '30 minutes' < CURRENT_TIMESTAMP
            `;

            await databaseManager.execute(query);

            Logger.info("Job reservas ejecutado correctamente.");

        } catch (error) {

            Logger.error(`Error en job reservas: ${error.message}`);

        }

    });

}
