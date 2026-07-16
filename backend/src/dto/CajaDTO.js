export default class CajaDTO {

    static fromDatabase(caja) {

        if (!caja) {
            return null;
        }

        return {
            idCaja: caja.idCaja,
            idSucursal: caja.idSucursal,
            sucursal: caja.sucursal || null,
            idUsuarioApertura: caja.idUsuarioApertura,
            usuarioApertura: caja.usuarioApertura || null,
            idUsuarioCierre: caja.idUsuarioCierre,
            usuarioCierre: caja.usuarioCierre || null,
            fechaApertura: caja.fechaApertura,
            fechaCierre: caja.fechaCierre,
            montoInicial: Number(caja.montoInicial),
            montoFinal: caja.montoFinal !== null ? Number(caja.montoFinal) : null,
            totalVentas: Number(caja.totalVentas),
            totalEfectivo: Number(caja.totalEfectivo),
            totalMercadoPago: Number(caja.totalMercadoPago),
            totalPayway: Number(caja.totalPayway),
            estado: caja.estado,
            observaciones: caja.observaciones,
            fechaCreacion: caja.fechaCreacion,
            fechaModificacion: caja.fechaModificacion
        };

    }

}