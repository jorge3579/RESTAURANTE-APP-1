# Usuarios y roles

`Admin` administra productos, categorías, proveedores y usuarios. `Employee` consulta stock, registra movimientos y ventas. Ambos pueden cambiar su propia contraseña.

Para el primer inicio agregue objetos a `BootstrapUsers:Users` en `appsettings.json` con `Username`, `Password`, `FullName`, `Email` y `Role`. Use contraseñas únicas de al menos 10 caracteres. Inicie la aplicación una vez y, tras verificar el acceso, deje nuevamente el arreglo vacío para no conservar contraseñas en claro.

El ejemplo completo y el orden seguro de configuración se encuentran en `11-Contraseñas-y-primer-arranque.md`.
