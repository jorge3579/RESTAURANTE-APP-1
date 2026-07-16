/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Creación de la base de datos
=========================================================

IMPORTANTE:

1. Ejecutar conectado a la base postgres.
2. No ejecutar dentro de BEGIN / COMMIT.
3. No seleccionar varias instrucciones junto con DROP DATABASE.
4. pgAdmin debe tener Auto-commit activado.
*/

CREATE DATABASE smartrestaurantqr
WITH
    OWNER = smartrestaurant_app
    ENCODING = 'UTF8'
    TEMPLATE = template0;