import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Información del sistema",
        data: {
            name: "SmartRestaurantQR",
            version: "2.0.0",
            uptimeSeconds: Math.floor(process.uptime()),
            timestamp: new Date().toISOString()
        }
    });
});

export default router;
