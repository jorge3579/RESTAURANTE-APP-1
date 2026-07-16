import AuditoriaRepository from "./AuditoriaRepository.js";
import AuthRepository from "./AuthRepository.js";
import CajaRepository from "./CajaRepository.js";
import CategoriaRepository from "./CategoriaRepository.js";
import ComandaRepository from "./ComandaRepository.js";
import ConfiguracionSistemaRepository from "./ConfiguracionSistemaRepository.js";
import CreditoUsuarioRepository from "./CreditoUsuarioRepository.js";
import DashboardRepository from "./DashboardRepository.js";
import FidelizacionRepository from "./FidelizacionRepository.js";
import ImpresionComandaRepository from "./ImpresionComandaRepository.js";
import IngresoQRRepository from "./IngresoQRRepository.js";
import MercadoPagoRepository from "./MercadoPagoRepository.js";
import MesaRepository from "./MesaRepository.js";
import NotificacionRepository from "./NotificacionRepository.js";
import PagoRepository from "./PagoRepository.js";
import PedidoRepository from "./PedidoRepository.js";
import PermisoRepository from "./PermisoRepository.js";
import ProductoRepository from "./ProductoRepository.js";
import PromocionRepository from "./PromocionRepository.js";
import ReporteRepository from "./ReporteRepository.js";
import ReservaRepository from "./ReservaRepository.js";
import RolRepository from "./RolRepository.js";
import SucursalRepository from "./SucursalRepository.js";
import UsuarioRepository from "./UsuarioRepository.js";
import databaseManager from "../config/databaseManager.js";

export const auditoriaRepository =
    new AuditoriaRepository(databaseManager);

export const authRepository =
    new AuthRepository(databaseManager);

export const cajaRepository =
    new CajaRepository(databaseManager);

export const categoriaRepository =
    new CategoriaRepository(databaseManager);

export const comandaRepository =
    new ComandaRepository(databaseManager);

export const configuracionSistemaRepository =
    new ConfiguracionSistemaRepository(databaseManager);

export const creditoUsuarioRepository =
    new CreditoUsuarioRepository(databaseManager);

export const dashboardRepository =
    new DashboardRepository(databaseManager);

export const fidelizacionRepository =
    new FidelizacionRepository(databaseManager);

export const impresionComandaRepository =
    new ImpresionComandaRepository(databaseManager);

export const ingresoQRRepository =
    new IngresoQRRepository(databaseManager);

export const mercadoPagoRepository =
    new MercadoPagoRepository(databaseManager);

export const mesaRepository =
    new MesaRepository(databaseManager);

export const notificacionRepository =
    new NotificacionRepository(databaseManager);

export const pagoRepository =
    new PagoRepository(databaseManager);

export const pedidoRepository =
    new PedidoRepository(databaseManager);

export const permisoRepository =
    new PermisoRepository(databaseManager);

export const productoRepository =
    new ProductoRepository(databaseManager);

export const promocionRepository =
    new PromocionRepository(databaseManager);

export const reporteRepository =
    new ReporteRepository(databaseManager);

export const reservaRepository =
    new ReservaRepository(databaseManager);

export const rolRepository =
    new RolRepository(databaseManager);

export const sucursalRepository =
    new SucursalRepository(databaseManager);

export const usuarioRepository =
    new UsuarioRepository(databaseManager);
