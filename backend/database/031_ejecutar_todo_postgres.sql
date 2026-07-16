/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Ejecución completa de la base de datos
=========================================================

EJECUTAR DESDE LA CARPETA backend:

psql ^
    -h localhost ^
    -p 5432 ^
    -U postgres ^
    -d smartrestaurantqr ^
    -v ON_ERROR_STOP=1 ^
    -f database/031_ejecutar_todo_postgres.sql
=========================================================
*/

\set ON_ERROR_STOP on

\echo ''
\echo '========================================================='
\echo ' SmartRestaurantQR - Instalación PostgreSQL'
\echo '========================================================='
\echo ''

\echo '[01/29] Extensiones...'
\ir 002_extensiones.sql

\echo '[02/29] Seguridad...'
\ir 003_seguridad.sql

\echo '[03/29] Usuarios...'
\ir 004_usuarios.sql

\echo '[04/29] Datos iniciales de seguridad...'
\ir 005_seed_seguridad.sql

\echo '[05/29] Sucursales...'
\ir 006_sucursales.sql

\echo '[06/29] Mesas...'
\ir 007_mesas.sql

\echo '[07/29] Categorías y productos...'
\ir 008_categorias_productos.sql

\echo '[08/29] Stock...'
\ir 009_stock.sql

\echo '[09/29] Datos iniciales de sucursal y productos...'
\ir 010_seed_sucursales_productos.sql

\echo '[10/29] Reservas...'
\ir 011_reservas.sql

\echo '[11/29] Pedidos...'
\ir 012_pedidos.sql

\echo '[12/29] Pagos...'
\ir 013_pagos.sql

\echo '[13/29] Ingresos QR...'
\ir 014_ingresos_qr.sql

\echo '[14/29] Mercado Pago...'
\ir 015_mercado_pago.sql

\echo '[15/29] Promociones...'
\ir 016_promociones.sql

\echo '[16/29] Créditos...'
\ir 017_creditos.sql

\echo '[17/29] Fidelización...'
\ir 018_fidelizacion.sql

\echo '[18/29] Datos iniciales de fidelización...'
\ir 019_seed_fidelizacion.sql

\echo '[19/29] Notificaciones...'
\ir 020_notificaciones.sql

\echo '[20/29] Comandas...'
\ir 021_comandas.sql

\echo '[21/29] Cajas...'
\ir 022_cajas.sql

\echo '[22/29] Auditoría...'
\ir 023_auditoria.sql

\echo '[23/29] Configuración y políticas...'
\ir 024_configuracion_politicas.sql

\echo '[24/29] Datos iniciales de configuración...'
\ir 025_seed_configuracion.sql

\echo '[25/29] Funciones y triggers...'
\ir 026_funciones_triggers.sql

\echo '[26/29] Vistas...'
\ir 027_vistas.sql

\echo '[27/29] Usuario administrador...'
\ir 028_seed_admin.sql

\echo '[28/29] Permisos PostgreSQL...'
\ir 029_permisos_postgres.sql

\echo '[29/29] Verificación final...'
\ir 030_verificacion.sql

\echo ''
\echo '========================================================='
\echo ' SmartRestaurantQR instalado correctamente en PostgreSQL'
\echo '========================================================='
\echo ''