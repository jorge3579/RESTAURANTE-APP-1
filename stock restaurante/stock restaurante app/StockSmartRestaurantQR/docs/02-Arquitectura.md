# Arquitectura

La solución aplica cuatro capas: `Domain` contiene entidades y reglas centrales; `Application` contratos, DTO y validación; `Infrastructure` persistencia, autenticación, archivos y reportes; `Web` interfaz Blazor y endpoints HTTP.

Flujo: navegador/API → autenticación Cookie o JWT → servicios de aplicación → EF Core/MariaDB o MongoDB. Las referencias avanzan hacia el dominio; el dominio no depende de infraestructura. Las operaciones de venta y stock usan transacciones serializables.
