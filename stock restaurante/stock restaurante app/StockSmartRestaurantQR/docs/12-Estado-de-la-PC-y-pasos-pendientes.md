# Estado comprobado de la PC y pasos pendientes

Comprobado el 12 de octubre de 2026:

- SDK .NET 10.0.401 instalado.
- Visual Studio Community 2026 versión 18.10.3 instalado.
- La carga de trabajo **ASP.NET y desarrollo web** no figura instalada.
- MariaDB Server no estaba instalado y el puerto 3306 no estaba escuchando.
- MongoDB Server no estaba instalado y el puerto 27017 no estaba escuchando.
- La solución compila en Release mediante la línea de comandos de .NET.

Windows no concedió elevación administrativa a la automatización, por lo que las instalaciones deben terminarse manualmente:

1. Abra **Visual Studio Installer**, pulse **Modificar** en Visual Studio Community 2026, marque **ASP.NET y desarrollo web** y pulse **Modificar**.
2. Ejecute como administrador el instalador firmado de MariaDB. Mantenga el puerto 3306, instálelo como servicio y cree la contraseña `root` cuando la solicite.
3. Ejecute como administrador el instalador firmado de MongoDB. Seleccione instalación completa y **Install MongoD as a Service**; MongoDB Compass es opcional.
4. Siga `11-Contraseñas-y-primer-arranque.md`.
5. Abra `StockSmartRestaurantQR.sln` y ejecute `StockSmartRestaurantQR.Web`.

La aplicación de stock es independiente. No se modificó ni se configuró una conexión con la aplicación de restaurante existente.
