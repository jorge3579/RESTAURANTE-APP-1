# Guía de despliegue

Para IIS instale el Hosting Bundle de .NET 10, publique en carpeta y configure un Application Pool sin código administrado. Conceda escritura sólo a `wwwroot/uploads/productos`. En Linux publique con `dotnet publish`, ejecute detrás de Nginx y use systemd. Para contenedores, separe Web, MariaDB y MongoDB y use volúmenes persistentes.

En producción cambie la clave JWT, credenciales de base de datos y política de cookies; habilite HTTPS, copias de seguridad y una cuenta MariaDB con privilegios limitados.
