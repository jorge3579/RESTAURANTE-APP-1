/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Permisos del usuario de aplicación
=========================================================
*/

GRANT CONNECT
ON DATABASE smartrestaurantqr
TO smartrestaurant_app;


GRANT USAGE
ON SCHEMA public
TO smartrestaurant_app;


GRANT SELECT,
      INSERT,
      UPDATE,
      DELETE
ON ALL TABLES
IN SCHEMA public
TO smartrestaurant_app;


GRANT USAGE,
      SELECT,
      UPDATE
ON ALL SEQUENCES
IN SCHEMA public
TO smartrestaurant_app;


GRANT EXECUTE
ON ALL FUNCTIONS
IN SCHEMA public
TO smartrestaurant_app;


/*
Permisos automáticos para futuras tablas.
*/

ALTER DEFAULT PRIVILEGES
IN SCHEMA public
GRANT SELECT,
      INSERT,
      UPDATE,
      DELETE
ON TABLES
TO smartrestaurant_app;


ALTER DEFAULT PRIVILEGES
IN SCHEMA public
GRANT USAGE,
      SELECT,
      UPDATE
ON SEQUENCES
TO smartrestaurant_app;


ALTER DEFAULT PRIVILEGES
IN SCHEMA public
GRANT EXECUTE
ON FUNCTIONS
TO smartrestaurant_app;