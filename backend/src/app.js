import express from "express";
import { configureCoreMiddlewares } from "./config/middlewares.js";
import routes from "./routes/index.js";
import { productoImagenDirectory } from "./middlewares/productoImagenMiddleware.js";



const app = express();

// La API se publica mediante un único proxy HTTPS (ngrok). Esto permite que
// express-rate-limit use la IP real sin rechazar X-Forwarded-For.
app.set("trust proxy", 1);

configureCoreMiddlewares(app);

app.use(
    "/imagenes-productos",
    express.static(productoImagenDirectory, {
        fallthrough: false,
        maxAge: "7d",
        setHeaders: (res) => res.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
    })
);

app.use("/api", routes);
app.use((error, req, res, _next) => {
    const statusCode = error.statusCode || error.status || 500;

    if (statusCode >= 500) {
        console.error(error);
    }

    return res.status(statusCode).json({
        success: false,
        message:
            statusCode === 500
                ? "Ocurrió un error interno en el servidor."
                : error.message
    });
});
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`
    });
});

export default app;
