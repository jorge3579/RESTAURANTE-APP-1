import BaseService from "./BaseService.js";

export default class ReporteService extends BaseService {

    async ventas(fechaDesde, fechaHasta, idSucursal = null) {

        return await this.repository.ventasPorRango(
            fechaDesde,
            fechaHasta,
            idSucursal
        );

    }

    async productos(fechaDesde, fechaHasta, idSucursal = null) {

        return await this.repository.productosVendidos(
            fechaDesde,
            fechaHasta,
            idSucursal
        );

    }

    async reservas(fechaDesde, fechaHasta, idSucursal = null) {

        return await this.repository.reservasPorRango(
            fechaDesde,
            fechaHasta,
            idSucursal
        );

    }

    async pagos(fechaDesde, fechaHasta, idSucursal = null) {

        return await this.repository.pagosPorRango(
            fechaDesde,
            fechaHasta,
            idSucursal
        );

    }

    async general(fechaDesde, fechaHasta, idSucursal = null) {

        const [
            ventas,
            productos,
            reservas,
            pagos
        ] = await Promise.all([
            this.ventas(fechaDesde, fechaHasta, idSucursal),
            this.productos(fechaDesde, fechaHasta, idSucursal),
            this.reservas(fechaDesde, fechaHasta, idSucursal),
            this.pagos(fechaDesde, fechaHasta, idSucursal)
        ]);

        return {
            ventas,
            productos,
            reservas,
            pagos
        };

    }

}