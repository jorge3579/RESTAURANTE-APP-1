import os from "os";

import env from "../config/env.js";

export default class AppInfo {

    static obtener() {

        return {

            nombre: "SmartRestaurantQR",

            version: env.app.version,

            entorno: env.app.environment,

            plataforma: os.platform(),

            arquitectura: os.arch(),

            hostname: os.hostname(),

            memoriaLibre: os.freemem(),

            memoriaTotal: os.totalmem(),

            uptime: process.uptime(),

            node: process.version

        };

    }

}