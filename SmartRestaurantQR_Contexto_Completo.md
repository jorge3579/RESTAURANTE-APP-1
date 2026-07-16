# SmartRestaurantQR
## Documento Maestro del Proyecto

Versión: 2.0
Estado: En desarrollo
Base de datos: PostgreSQL
Backend: Node.js + Express
Frontend Cliente: React Native + Expo
Frontend Restaurante: React Native + Expo

---

# Objetivo

SmartRestaurantQR es un sistema completo de administración para restaurantes.

Consta de:

- Backend REST API
- Aplicación Cliente
- Aplicación Restaurante
- PostgreSQL
- Integración Mercado Pago
- Sistema QR
- Programa de Fidelización
- Administración
- Dashboard

---

# Arquitectura

Cliente Android
        │
        ▼

React Native

        │

REST API

        │

Node.js + Express

        │

PostgreSQL

---

# Tecnologías

## Backend

Node.js

Express

JavaScript ES Modules

JWT

bcrypt

pg

pnpm

Swagger

Express Validator

Morgan

Helmet

Cors

dotenv

---

## Frontend

React Native

Expo

React Navigation

Axios

AsyncStorage

React Hook Form

---

## Base de datos

PostgreSQL 18

pgAdmin 4

---

# Convenciones

## Idioma

Todo el código se escribe en español.

Variables:

nombre

apellido

fechaReserva

idUsuario

Métodos

crear()

actualizar()

eliminar()

listar()

buscar()

obtenerPorId()

---

# Base de datos

NO existe compatibilidad con SQL Server.

Toda consulta debe escribirse únicamente para PostgreSQL.

Nunca utilizar:

dbo

TOP

OUTPUT INSERTED

GETDATE()

ISNULL()

DATEADD()

IDENTITY

SCOPE_IDENTITY()

Siempre utilizar:

RETURNING

CURRENT_TIMESTAMP

CURRENT_DATE

LIMIT

OFFSET

COALESCE

ILIKE

ANY

ARRAY

---

# Estructura de carpetas

backend

src

config

controllers

repositories

services

routes

middlewares

helpers

validators

database

scripts

frontend-cliente

frontend-restaurante

docs

---

# Estado de la migración

La base SQL Server fue eliminada completamente.

La base PostgreSQL es la única soportada.

---

## Scripts PostgreSQL

Completados

000

...

037

Todos funcionan correctamente.

Administrador creado.

Cliente demo creado.

Datos demo funcionando.

Triggers funcionando.

Vistas funcionando.

Permisos funcionando.

---

# Backend

Configuración PostgreSQL terminada.

Archivos terminados

env.js

database.js

databaseManager.js

BaseRepository.js

---

# Repositorios migrados

AuthRepository

UsuarioRepository

RolRepository

PermisoRepository

---

# Repositorios pendientes

AuditoriaRepository

CajaRepository

CategoriaRepository

ConfiguracionRepository

DashboardRepository

FidelizacionRepository

HorarioRepository

IngredienteRepository

IngresoQRRepository

MesaRepository

MercadoPagoRepository

NotificacionRepository

PagoRepository

PedidoRepository

ProductoRepository

PromocionRepository

ReservaRepository

SucursalRepository

---

# Reglas para los repositorios

No modificar servicios.

No modificar controladores.

No modificar rutas.

Cada repositorio debe mantenerse compatible con la arquitectura existente.

El BaseRepository convierte automáticamente

@param

en

$1

$2

...

No modificar este comportamiento.

---

# BaseRepository

Siempre utilizar

query()

queryOne()

execute()

exists()

Nunca usar pool.query() directamente.

---

# Nombres de tablas PostgreSQL

usuarios

roles

usuario_roles

permisos

rol_permisos

sucursales

mesas

categorias

productos

ingredientes

producto_ingredientes

reservas

reserva_mesas

pedidos

pedido_detalles

pagos

mercado_pago_preferencias

creditos_usuario

configuracion_fidelizacion

niveles_vip

puntos_usuario

historial_puntos

comandas

comanda_detalles

impresiones_comanda

cajas

configuracion_sistema

politicas_sistema

notificaciones

refresh_tokens

auditoria

---

# Vistas

vw_usuarios

vw_productos

vw_reservas

vw_pedidos

vw_pedido_detalles

vw_comandas

vw_cajas

vw_creditos_activos

vw_dashboard_diario

---

# Login administrador

Email

admin@smartrestaurantqr.com

Contraseña

Admin1234!

---

# Usuario demo

cliente.demo@smartrestaurantqr.com

Contraseña

Cliente1234!

---

# Regla de trabajo

Cada archivo debe entregarse completo.

Nunca entregar fragmentos.

Nunca mezclar SQL Server con PostgreSQL.

Si un archivo necesita cambios completos, reescribirlo desde cero.

---

# Objetivo actual

Migrar todos los repositorios restantes a PostgreSQL.

Orden:

1 AuthRepository ✔

2 UsuarioRepository ✔

3 RolRepository ✔

4 PermisoRepository ✔

5 AuditoriaRepository

6 CajaRepository

7 CategoriaRepository

8 ConfiguracionRepository

9 DashboardRepository

10 FidelizacionRepository

11 HorarioRepository

12 IngredienteRepository

13 IngresoQRRepository

14 MesaRepository

15 MercadoPagoRepository

16 NotificacionRepository

17 PagoRepository

18 PedidoRepository

19 ProductoRepository

20 PromocionRepository

21 ReservaRepository

22 SucursalRepository

Después continuar con Services.

Luego Controllers.

Luego pruebas completas.

Finalmente generar versión estable v2 PostgreSQL.

---

# Instrucción para cualquier IA

Antes de modificar cualquier archivo:

Leer completamente este documento.

Respetar todas las reglas aquí definidas.

No introducir código SQL Server.

Mantener la arquitectura actual.

Mantener compatibilidad con el resto del proyecto.

Entregar siempre el archivo completo listo para reemplazar.