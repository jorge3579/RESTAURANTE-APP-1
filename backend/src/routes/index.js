import { Router } from "express";

import ApiResponse from "../helpers/ApiResponse.js";

import authRoutes from "./auth.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import rolesRoutes from "./roles.routes.js";
import permisosRoutes from "./permisos.routes.js";
import sucursalesRoutes from "./sucursales.routes.js";
import mesasRoutes from "./mesas.routes.js";
import categoriasRoutes from "./categorias.routes.js";
import productosRoutes from "./productos.routes.js";
import reservasRoutes from "./reservas.routes.js";
import pedidosRoutes from "./pedidos.routes.js";
import pagosRoutes from "./pagos.routes.js";
import ingresosQRRoutes from "./ingresosQR.routes.js";
import promocionesRoutes from "./promociones.routes.js";
import creditosRoutes from "./creditos.routes.js";
import fidelizacionRoutes from "./fidelizacion.routes.js";
import notificacionesRoutes from "./notificaciones.routes.js";
import mercadoPagoRoutes from "./mercadoPago.routes.js";
import comandasRoutes from "./comandas.routes.js";
import impresionesRoutes from "./impresiones.routes.js";
import cajasRoutes from "./cajas.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import auditoriaRoutes from "./auditoria.routes.js";
import configuracionRoutes from "./configuracion.routes.js";
import docsRoutes from "./docs.routes.js";
import systemRoutes from "./system.routes.js";
import reportesRoutes from "./reportes.routes.js";

const router = Router();

router.get("/", (req, res) => {
    return ApiResponse.success(
        res,
        "SmartRestaurantQR API",
        {
            version: "2.0.0",
            docs: "/api/docs"
        }
    );
});

router.get("/health", (req, res) => {
    return ApiResponse.success(
        res,
        "Servidor funcionando",
        {
            status: "UP",
            timestamp: new Date()
        }
    );
});

router.use("/docs", docsRoutes);
router.use("/system", systemRoutes);
router.use("/auth", authRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/roles", rolesRoutes);
router.use("/permisos", permisosRoutes);
router.use("/sucursales", sucursalesRoutes);
router.use("/mesas", mesasRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/productos", productosRoutes);
router.use("/reservas", reservasRoutes);
router.use("/pedidos", pedidosRoutes);
router.use("/pagos", pagosRoutes);
router.use("/ingresos-qr", ingresosQRRoutes);
router.use("/promociones", promocionesRoutes);
router.use("/creditos", creditosRoutes);
router.use("/fidelizacion", fidelizacionRoutes);
router.use("/notificaciones", notificacionesRoutes);
router.use("/mercado-pago", mercadoPagoRoutes);
router.use("/comandas", comandasRoutes);
router.use("/impresiones", impresionesRoutes);
router.use("/cajas", cajasRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/auditoria", auditoriaRoutes);
router.use("/configuracion", configuracionRoutes);
router.use("/reportes", reportesRoutes);

export default router;