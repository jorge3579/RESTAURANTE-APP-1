import BaseService from "./BaseService.js";

export default class DashboardService extends BaseService {

    async resumen(idSucursal = null) {

        const [
            resumenGeneral,
            ventasPorDia,
            productosMasVendidos,
            reservasPorEstado,
            pagosPorMetodo
        ] = await Promise.all([
            this.repository.resumenGeneral(idSucursal),
            this.repository.ventasPorDia(idSucursal),
            this.repository.productosMasVendidos(idSucursal),
            this.repository.reservasPorEstado(idSucursal),
            this.repository.pagosPorMetodo(idSucursal)
        ]);

        return {
            resumenGeneral: {
                reservasHoy: Number(resumenGeneral.reservasHoy),
                pedidosHoy: Number(resumenGeneral.pedidosHoy),
                ventasHoy: Number(resumenGeneral.ventasHoy),
                mesasOcupadas: Number(resumenGeneral.mesasOcupadas),
                mesasLibres: Number(resumenGeneral.mesasLibres)
            },
            ventasPorDia: ventasPorDia.map((item) => ({
                fecha: item.fecha,
                cantidadPedidos: Number(item.cantidadPedidos),
                totalVentas: Number(item.totalVentas)
            })),
            productosMasVendidos: productosMasVendidos.map((item) => ({
                idProducto: item.idProducto,
                producto: item.producto,
                cantidadVendida: Number(item.cantidadVendida),
                totalVendido: Number(item.totalVendido)
            })),
            reservasPorEstado: reservasPorEstado.map((item) => ({
                estado: item.estado,
                cantidad: Number(item.cantidad)
            })),
            pagosPorMetodo: pagosPorMetodo.map((item) => ({
                metodoPago: item.metodoPago,
                cantidad: Number(item.cantidad),
                total: Number(item.total)
            }))
        };

    }

}