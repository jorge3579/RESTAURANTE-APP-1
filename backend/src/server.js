import "dotenv/config";
import { createServer } from "node:http";

import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import databaseManager from "./config/databaseManager.js";
import { stockProxy } from "./config/stockProxy.js";
import { iniciarJobs } from "./jobs/index.js";
import { initSocket } from "./sockets/socketServer.js";

const PORT = Number(process.env.PORT || 3000);
const httpServer = createServer(app);

// Las conexiones interactivas de Blazor usan WebSocket y no atraviesan el
// ciclo normal de middleware de Express.
httpServer.on("upgrade", stockProxy.upgrade);

async function iniciarServidor() {
    try {
        await connectDatabase();
        initSocket(httpServer);
        iniciarJobs();

        httpServer.listen(PORT, "0.0.0.0", () => {
            console.log(`Servidor iniciado en puerto ${PORT}`);
            console.log(`API: http://127.0.0.1:${PORT}/api`);
        });
    } catch (error) {
        console.error(`No se pudo iniciar el servidor: ${error.message}`);
        await databaseManager.close().catch(() => {});
        process.exit(1);
    }
}

async function shutdown(signal) {
    console.log(`\nSeñal ${signal} recibida.`);
    httpServer.close(async () => {
        await databaseManager.close().catch(console.error);
        process.exit(0);
    });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

await iniciarServidor();
