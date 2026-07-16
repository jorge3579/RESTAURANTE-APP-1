import swaggerJSDoc from "swagger-jsdoc";

import env from "../config/env.js";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SmartRestaurantQR API",
            version: env.app.version,
            description: "Documentación oficial del backend SmartRestaurantQR"
        },
        servers: [
            {
                url: `http://localhost:${env.app.port}/api`,
                description: "Servidor local"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        "./src/routes/*.js"
    ]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;