import cron from "node-cron";

import Logger from "../utils/Logger.js";
import databaseManager from "../config/databaseManager.js";

export function iniciarPromocionesJob() {

    cron.schedule("0 1 * * *", async () => {

        try {

            const query = `
                UPDATE promociones
                SET
                    activa = 0,
                    fecha_modificacion = CURRENT_TIMESTAMP
                WHERE activa = 1
                  AND fecha_fin < CURRENT_DATE
            `;

            await databaseManager.execute(query);

            Logger.info("Job promociones ejecutado correctamente.");

        } catch (error) {

            Logger.error(`Error en job promociones: ${error.message}`);

        }

    });

}
