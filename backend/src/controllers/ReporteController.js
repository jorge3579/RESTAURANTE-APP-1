import ApiResponse from "../helpers/ApiResponse.js";
import { reporteService } from "../services/index.js";

import { generarExcelDesdeHojas } from "../helpers/excelHelper.js";
import { generarReportePDF } from "../helpers/pdfHelper.js";

export default class ReporteController {

    static obtenerParametros(req) {

        return {
            fechaDesde: req.query.fechaDesde,
            fechaHasta: req.query.fechaHasta,
            idSucursal: req.query.idSucursal
                ? Number(req.query.idSucursal)
                : null
        };

    }

    static async general(req, res, next) {

        try {

            const {
                fechaDesde,
                fechaHasta,
                idSucursal
            } = ReporteController.obtenerParametros(req);

            const reporte = await reporteService.general(
                fechaDesde,
                fechaHasta,
                idSucursal
            );

            return ApiResponse.success(
                res,
                "Reporte general obtenido correctamente.",
                reporte
            );

        } catch (error) {

            next(error);

        }

    }

    static async excel(req, res, next) {

        try {

            const {
                fechaDesde,
                fechaHasta,
                idSucursal
            } = ReporteController.obtenerParametros(req);

            const reporte = await reporteService.general(
                fechaDesde,
                fechaHasta,
                idSucursal
            );

            const buffer = generarExcelDesdeHojas([
                {
                    nombre: "Ventas",
                    data: reporte.ventas
                },
                {
                    nombre: "Productos",
                    data: reporte.productos
                },
                {
                    nombre: "Reservas",
                    data: reporte.reservas
                },
                {
                    nombre: "Pagos",
                    data: reporte.pagos
                }
            ]);

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );

            res.setHeader(
                "Content-Disposition",
                "attachment; filename=reporte_smartrestaurantqr.xlsx"
            );

            return res.send(buffer);

        } catch (error) {

            next(error);

        }

    }

    static async pdf(req, res, next) {

        try {

            const {
                fechaDesde,
                fechaHasta,
                idSucursal
            } = ReporteController.obtenerParametros(req);

            const reporte = await reporteService.general(
                fechaDesde,
                fechaHasta,
                idSucursal
            );

            const buffer = await generarReportePDF(
                "Reporte SmartRestaurantQR",
                [
                    {
                        titulo: "Ventas",
                        data: reporte.ventas
                    },
                    {
                        titulo: "Productos",
                        data: reporte.productos
                    },
                    {
                        titulo: "Reservas",
                        data: reporte.reservas
                    },
                    {
                        titulo: "Pagos",
                        data: reporte.pagos
                    }
                ]
            );

            res.setHeader(
                "Content-Type",
                "application/pdf"
            );

            res.setHeader(
                "Content-Disposition",
                "attachment; filename=reporte_smartrestaurantqr.pdf"
            );

            return res.send(buffer);

        } catch (error) {

            next(error);

        }

    }

}