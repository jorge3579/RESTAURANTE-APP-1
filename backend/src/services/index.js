import AuditoriaService from "./AuditoriaService.js";
import AuthService from "./AuthService.js";
import CajaService from "./CajaService.js";
import CategoriaService from "./CategoriaService.js";
import ComandaService from "./ComandaService.js";
import ConfiguracionSistemaService from "./ConfiguracionSistemaService.js";
import CreditoUsuarioService from "./CreditoUsuarioService.js";
import DashboardService from "./DashboardService.js";
import FidelizacionService from "./FidelizacionService.js";
import ImpresionComandaService from "./ImpresionComandaService.js";
import IngresoQRService from "./IngresoQRService.js";
import MercadoPagoService from "./MercadoPagoService.js";
import MesaService from "./MesaService.js";
import NotificacionService from "./NotificacionService.js";
import PagoService from "./PagoService.js";
import PermisoService from "./PermisoService.js";
import ProductoService from "./ProductoService.js";
import PromocionService from "./PromocionService.js";
import ReservaService from "./ReservaService.js";
import RolService from "./RolService.js";
import SucursalService from "./SucursalService.js";
import UsuarioService from "./UsuarioService.js";
import PedidoService from "./PedidoService.js";
import ReporteService from "./ReporteService.js";

import {
    auditoriaRepository,
    authRepository,
    cajaRepository,
    categoriaRepository,
    comandaRepository,
    configuracionSistemaRepository,
    creditoUsuarioRepository,
    dashboardRepository,
    fidelizacionRepository,
    impresionComandaRepository,
    ingresoQRRepository,
    mercadoPagoRepository,
    mesaRepository,
    notificacionRepository,
    pagoRepository,
    permisoRepository,
    productoRepository,
    promocionRepository,
    reservaRepository,
    rolRepository,
    sucursalRepository,
    usuarioRepository,
    pedidoRepository,
    reporteRepository,
} from "../repositories/index.js";

export const auditoriaService =
    new AuditoriaService(auditoriaRepository);

export const authService =
    new AuthService(authRepository);

export const cajaService =
    new CajaService(cajaRepository);

export const categoriaService =
    new CategoriaService(categoriaRepository);

export const comandaService =
    new ComandaService(comandaRepository, pedidoRepository);

export const configuracionSistemaService =
    new ConfiguracionSistemaService(
        configuracionSistemaRepository
    );

export const creditoUsuarioService =
    new CreditoUsuarioService(
        creditoUsuarioRepository
    );

export const dashboardService =
    new DashboardService(dashboardRepository);

export const fidelizacionService =
    new FidelizacionService(
        fidelizacionRepository
    );

export const impresionComandaService =
    new ImpresionComandaService(
        impresionComandaRepository
    );

export const ingresoQRService =
    new IngresoQRService(ingresoQRRepository);

export const mercadoPagoService =
    new MercadoPagoService(
        mercadoPagoRepository
    );

export const mesaService =
    new MesaService(mesaRepository);

export const notificacionService =
    new NotificacionService(
        notificacionRepository
    );

export const pagoService =
    new PagoService(pagoRepository);

export const permisoService =
    new PermisoService(permisoRepository);

export const productoService =
    new ProductoService(productoRepository);

export const promocionService =
    new PromocionService(promocionRepository);

export const reservaService =
    new ReservaService(reservaRepository, ingresoQRService, sucursalRepository);

export const rolService =
    new RolService(rolRepository);

export const sucursalService =
    new SucursalService(sucursalRepository);

export const usuarioService =
    new UsuarioService(usuarioRepository);

export const pedidoService =
    new PedidoService(
        pedidoRepository,
        productoRepository,
        comandaService
    );

export const reporteService =
    new ReporteService(reporteRepository);

export const configuracionService =
    configuracionSistemaService;

export const creditoService =
    creditoUsuarioService;

export const impresionService =
    impresionComandaService;
