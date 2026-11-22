# Instalación y configuración

## Requisitos

- Windows x64, Visual Studio Community con **ASP.NET y desarrollo web** y SDK .NET 10.
- MariaDB Server en `localhost:3306`.
- MongoDB Community Server en `localhost:27017`.

Abra `StockSmartRestaurantQR.sln`, restaure los paquetes y seleccione `StockSmartRestaurantQR.Web` como proyecto de inicio. La configuración está en `appsettings.json`. Para crear MariaDB manualmente: `mariadb -u root -p < scripts/mariadb_init.sql`. Para MongoDB: `mongosh scripts/mongodb_seed.js`.

Antes del primer inicio siga `11-Contraseñas-y-primer-arranque.md`. Allí se indica exactamente cuándo crear la contraseña de MariaDB, la clave JWT y las contraseñas de los usuarios. No envíe esas claves por chat.
