# Contraseñas y primer arranque

No hay contraseñas de usuarios predefinidas. Las claves se crean localmente y no deben enviarse por chat.

## 1. Durante la instalación de MariaDB

Cuando el instalador solicite la contraseña de `root`, cree una contraseña nueva y guárdela en su administrador de contraseñas. Después abra:

`src/StockSmartRestaurantQR.Web/appsettings.json`

En `ConnectionStrings:MariaDb`, reemplace únicamente `CREAR_Y_REEMPLAZAR_AQUI` por esa contraseña. Si la contraseña contiene `;`, use otra sin ese carácter para no romper el formato de la cadena de conexión.

## 2. Antes de iniciar la aplicación por primera vez

En el mismo archivo, reemplace `JwtSettings:Secret` por una cadena aleatoria de al menos 64 caracteres. Es una clave interna de la API, no una contraseña para iniciar sesión. No la reutilice en otros servicios.

Luego reemplace temporalmente el arreglo vacío de `BootstrapUsers` por los usuarios que quiera crear:

```json
"BootstrapUsers": {
  "Users": [
    {
      "Username": "admin",
      "Password": "REEMPLAZAR_POR_SU_CLAVE_ADMIN",
      "FullName": "Administrador",
      "Email": "admin@local",
      "Role": "Admin"
    },
    {
      "Username": "empleado1",
      "Password": "REEMPLAZAR_POR_SU_CLAVE_DE_EMPLEADO",
      "FullName": "Empleado 1",
      "Email": "empleado1@local",
      "Role": "Employee"
    }
  ]
}
```

Cada contraseña debe ser única y tener 10 caracteres o más. El sistema la almacena en MongoDB como hash BCrypt, no como texto legible.

## 3. Después del primer acceso correcto

Detenga la aplicación y vuelva a dejar:

```json
"BootstrapUsers": {
  "Users": []
}
```

Los usuarios ya creados permanecen en MongoDB. Al vaciar el arreglo se eliminan las contraseñas en claro del archivo. Desde la interfaz, el administrador puede crear más usuarios y cada usuario puede cambiar su propia contraseña.

## MongoDB

La instalación local propuesta usa MongoDB como servicio accesible únicamente desde la misma PC y no exige crear una contraseña durante el primer montaje. Antes de exponer el sistema a otra computadora o a Internet, debe habilitarse la autenticación de MongoDB y cambiarse su cadena de conexión.
