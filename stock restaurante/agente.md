# AGENTE.MD - Instrucciones Completas para Generar el Proyecto StockSmartRestaurantQR

**IMPORTANTE PARA LA IA RECEPTORA:**
- Este documento contiene **TODA** la información necesaria para generar el proyecto completo.
- Debes generar código **100% compatible con Visual Studio Community 2022** (versión 17.8 o superior).
- Usa **.NET 8** exclusivamente.
- No uses características preview, experimental o que requieran Visual Studio Professional/Enterprise.
- Todo el código debe compilar y ejecutarse sin errores en un entorno limpio de Visual Studio Community.
- Crea la Solution completa, todos los proyectos, archivos, scripts y la carpeta `docs`.
- El proyecto debe quedar listo para abrir en Visual Studio Community, restaurar paquetes NuGet y ejecutarse con F5.

---

## 1. INFORMACIÓN GENERAL DEL PROYECTO

**Nombre del Sistema:** StockSmartRestaurantQR  
**Nombre de la Solution:** `StockSmartRestaurantQR.sln`  
**Descripción:** Sistema de Gestión de Inventario + Ventas orientado a restaurantes (con capacidad de futura integración con aplicaciones que no poseen control de stock, por ejemplo sistemas de pedidos QR, POS, delivery, etc.).

**Objetivo:** Control de stock, productos, categorías, proveedores, ventas, movimientos de inventario, reportes PDF/Excel, con autenticación robusta.

**Usuarios iniciales:**
- 1 Administrador
- 5 Empleados

**Moneda:** Pesos Argentinos (ARS) – formato `$ 1.234,56`

**Almacén:** Un solo almacén (no multi-almacén).

**Soft Delete:** Sí (todas las entidades principales usan `IsDeleted` + `DeletedAt`).

**Imágenes de productos:** Se guardan físicamente en `wwwroot/uploads/productos/`.

---

## 2. STACK TECNOLÓGICO (OBLIGATORIO)

| Componente              | Tecnología / Paquete                          | Versión recomendada |
|-------------------------|-----------------------------------------------|---------------------|
| Framework               | .NET 8                                        | 8.0                 |
| UI                      | Blazor Server + MudBlazor                     | MudBlazor 7.x o 8.x compatible con .NET 8 |
| ORM MariaDB             | Pomelo.EntityFrameworkCore.MySql              | 8.0.x               |
| MongoDB                 | MongoDB.Driver                                | 2.28.x o superior   |
| Hash de contraseñas     | BCrypt.Net-Next                               | 4.0.3 o superior    |
| Autenticación           | JWT + Cookies (híbrido)                       | Microsoft.AspNetCore.Authentication.JwtBearer |
| PDF                     | QuestPDF                                      | Última estable compatible .NET 8 |
| Excel                   | ClosedXML                                     | Última estable      |
| Logging                 | Serilog (opcional pero recomendado)           | -                   |
| Validaciones            | FluentValidation                              | -                   |

**Bases de datos:**
- **MariaDB** → Datos de negocio (productos, categorías, proveedores, ventas, movimientos, etc.)
  - Host: `localhost`
  - Usuario: `root`
  - Contraseña: `root`
  - Base de datos: `stock_smartrestaurantqr`
- **MongoDB** → Solo usuarios, roles y sesiones
  - Host: `localhost:27017`
  - Base de datos: `StockSmartRestaurantQR_Auth`

---

## 3. ESTRUCTURA DE LA SOLUTION (Clean Architecture)

```
StockSmartRestaurantQR.sln
│
├── src/
│   ├── StockSmartRestaurantQR.Domain/               (Class Library)
│   ├── StockSmartRestaurantQR.Application/          (Class Library)
│   ├── StockSmartRestaurantQR.Infrastructure/       (Class Library)
│   └── StockSmartRestaurantQR.Web/                  (Blazor Server - Proyecto de inicio)
│
├── docs/                                            (Carpeta de documentación completa)
│   ├── 01-Instalacion-y-Configuracion.md
│   ├── 02-Arquitectura.md
│   ├── 03-Base-de-Datos.md
│   ├── 04-Usuarios-y-Roles.md
│   ├── 05-Funcionalidades.md
│   ├── 06-API-y-Endpoints.md
│   ├── 07-Manual-de-Usuario.md
│   ├── 08-Manual-Tecnico.md
│   ├── 09-Integracion-Futura-con-Apps-Externas.md
│   └── 10-Guia-Despliegue.md
│
├── scripts/
│   ├── mariadb_init.sql
│   └── mongodb_seed.js
│
└── README.md
```

### Proyectos y responsabilidades

**StockSmartRestaurantQR.Domain**
- Entidades
- Enums
- Interfaces de repositorios (opcional)
- Value Objects si es necesario

**StockSmartRestaurantQR.Application**
- DTOs
- Interfaces de servicios
- Servicios de aplicación
- Validadores (FluentValidation)
- Mapeos (si usas AutoMapper o mapeo manual)

**StockSmartRestaurantQR.Infrastructure**
- Implementación de DbContext (MariaDB)
- Repositorios
- Servicio de MongoDB (usuarios)
- Generación de JWT
- Servicios de archivos (imágenes)
- Servicios de reportes (QuestPDF + ClosedXML)
- Seeders

**StockSmartRestaurantQR.Web**
- Proyecto Blazor Server
- Páginas / Componentes MudBlazor
- Controllers (si se necesitan endpoints API adicionales)
- Program.cs / Startup
- wwwroot/uploads/productos/ (crear la carpeta)
- appsettings.json

---

## 4. ENTIDADES PRINCIPALES (MariaDB)

Todas las entidades de negocio deben heredar o implementar Soft Delete:

```csharp
public abstract class BaseEntity
{
    public int Id { get; set; }
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
```

### Entidades requeridas:

1. **Category**
   - Id, Name, Description, IsDeleted, CreatedAt, UpdatedAt, DeletedAt

2. **Supplier** (Proveedor)
   - Id, Name, ContactName, Phone, Email, Address, IsDeleted, ...

3. **Product**
   - Id, Code (SKU), Name, Description, CategoryId, SupplierId
   - Price (decimal), Cost (decimal)
   - Stock (decimal o int – usar decimal por flexibilidad)
   - MinStock (stock mínimo)
   - ImagePath (string – ruta relativa)
   - Unit (string: "unidad", "kg", "lt", etc.)
   - IsDeleted, ...

4. **StockMovement**
   - Id, ProductId, MovementType (Enum: Entry, Exit, Sale, Adjustment)
   - Quantity, PreviousStock, NewStock
   - Reference (número de venta o nota)
   - UserId (quién hizo el movimiento – string del MongoDB)
   - Notes, CreatedAt

5. **Sale**
   - Id, SaleNumber (string único), SaleDate
   - TotalAmount, UserId (quién vendió)
   - CustomerName (opcional), Notes
   - IsDeleted

6. **SaleDetail**
   - Id, SaleId, ProductId, Quantity, UnitPrice, SubTotal

7. **AuditLog** (opcional pero recomendado)
   - Id, UserId, Action, EntityName, EntityId, OldValues, NewValues, Timestamp

---

## 5. USUARIOS Y AUTENTICACIÓN (MongoDB)

**Colección:** `Users`

```csharp
public class User
{
    public string Id { get; set; }                  // ObjectId de Mongo
    public string Username { get; set; }
    public string PasswordHash { get; set; }        // BCrypt
    public string FullName { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }                // "Admin" o "Employee"
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLogin { get; set; }
}
```

### Usuarios de seed (contraseñas hasheadas con BCrypt workFactor 12):

| Username    | Rol       | Contraseña en claro | FullName              |
|-------------|-----------|---------------------|-----------------------|
| admin       | Admin     | Admin123!           | Administrador Sistema |
| empleado1   | Employee  | Emp123!             | Empleado Uno          |
| empleado2   | Employee  | Emp123!             | Empleado Dos          |
| empleado3   | Employee  | Emp123!             | Empleado Tres         |
| empleado4   | Employee  | Emp123!             | Empleado Cuatro       |
| empleado5   | Employee  | Emp123!             | Empleado Cinco        |

**Instrucción:** En el seeder de MongoDB debes generar los hashes con:
```csharp
BCrypt.Net.BCrypt.HashPassword("Admin123!", workFactor: 12)
```

### Autenticación híbrida (JWT + Cookies)

- Al hacer login exitoso:
  1. Generar JWT (con claims: UserId, Username, Role)
  2. Guardar cookie de autenticación (para Blazor Server)
  3. El JWT puede usarse también para futuras integraciones API

- Tiempo de expiración JWT: 8 horas
- Cookie: HttpOnly, Secure (en producción), SameSite=Strict

---

## 6. FUNCIONALIDADES REQUERIDAS (14+)

### Comunes a todos los usuarios autenticados
1. Login / Logout
2. Cambiar contraseña propia
3. Dashboard (stock crítico, ventas del día, productos más vendidos)

### Solo Administrador
4. CRUD completo de Productos (con subida de imagen)
5. CRUD de Categorías
6. CRUD de Proveedores
7. Gestión de usuarios (activar/desactivar empleados – no se pueden eliminar)
8. Reportes avanzados (ventas por período, inventario valorizado, movimientos)
9. Configuración básica del sistema (stock mínimo global, etc.)
10. Visualización de auditoría de acciones

### Empleados + Administrador
11. Realizar Ventas (carrito + facturación)
12. Consultar stock en tiempo real + búsqueda
13. Registrar entradas de mercadería (compras / reposición)
14. Ver historial de movimientos de un producto

**Adicionales recomendados:**
15. Exportar reportes a PDF y Excel
16. Búsqueda global con filtros y paginación
17. Notificaciones visuales de stock bajo mínimo

---

## 7. SCRIPT DE MARIADB (`scripts/mariadb_init.sql`)

El script debe:
- Crear la base de datos `stock_smartrestaurantqr`
- Crear todas las tablas con Soft Delete
- Crear índices necesarios
- Insertar datos de ejemplo (categorías, proveedores, productos con stock)

**Comando de ejecución esperado:**
```bash
mysql -u root -proot < scripts/mariadb_init.sql
```

Incluir al menos:
- 5-6 categorías (Bebidas, Carnes, Verduras, Lácteos, Limpieza, Packaging...)
- 4-5 proveedores
- 15-20 productos de ejemplo con stock y stock mínimo
- Algunos movimientos iniciales

---

## 8. SEED DE MONGODB

Crear un seeder en C# (Infrastructure) o un script `mongodb_seed.js` que inserte los 6 usuarios con las contraseñas hasheadas correctamente.

---

## 9. CONFIGURACIÓN DE appsettings.json

```json
{
  "ConnectionStrings": {
    "MariaDb": "Server=localhost;Port=3306;Database=stock_smartrestaurantqr;User=root;Password=root;",
    "MongoDb": "mongodb://localhost:27017"
  },
  "MongoDbSettings": {
    "DatabaseName": "StockSmartRestaurantQR_Auth",
    "UsersCollection": "Users"
  },
  "JwtSettings": {
    "Secret": "ClaveSuperSecretaDeAlMenos32CaracteresParaJWT2026!",
    "Issuer": "StockSmartRestaurantQR",
    "Audience": "StockSmartRestaurantQRUsers",
    "ExpirationHours": 8
  },
  "FileStorage": {
    "ProductImagesPath": "wwwroot/uploads/productos"
  }
}
```

---

## 10. PAQUETES NUGET OBLIGATORIOS POR PROYECTO

### Domain
- Ninguno especial (solo .NET 8)

### Application
- FluentValidation
- FluentValidation.DependencyInjectionExtensions

### Infrastructure
- Pomelo.EntityFrameworkCore.MySql
- MongoDB.Driver
- BCrypt.Net-Next
- Microsoft.AspNetCore.Authentication.JwtBearer
- QuestPDF
- ClosedXML
- Microsoft.EntityFrameworkCore.Tools (si se usan migraciones)

### Web
- MudBlazor
- Todos los de Infrastructure + Application (referencias de proyecto)

---

## 11. REGLAS DE NEGOCIO IMPORTANTES

- Al realizar una **venta**: descontar stock y registrar movimiento tipo `Sale`.
- Al registrar **entrada de mercadería**: aumentar stock y registrar movimiento tipo `Entry`.
- No permitir ventas si el stock es insuficiente.
- Soft Delete: nunca borrar físicamente productos, categorías, proveedores ni ventas.
- Las imágenes se renombran con GUID + extensión original al subirlas.
- Crear la carpeta `wwwroot/uploads/productos` automáticamente si no existe.
- Formato de moneda en toda la UI: cultura `es-AR`.

---

## 12. CARPETA `docs` – DOCUMENTACIÓN OBLIGATORIA

Debes generar **todos** estos archivos dentro de la carpeta `docs/`:

1. **01-Instalacion-y-Configuracion.md**  
   - Requisitos (Visual Studio Community 2022, .NET 8 SDK, MariaDB, MongoDB)  
   - Cómo clonar/abrir la solution  
   - Cómo ejecutar los scripts de base de datos  
   - Cómo restaurar NuGet y ejecutar

2. **02-Arquitectura.md**  
   - Explicación de Clean Architecture aplicada  
   - Diagrama de capas  
   - Flujo de autenticación

3. **03-Base-de-Datos.md**  
   - Modelo de datos MariaDB  
   - Modelo de usuarios MongoDB  
   - Scripts y cómo ejecutarlos

4. **04-Usuarios-y-Roles.md**  
   - Lista de usuarios de prueba  
   - Permisos por rol

5. **05-Funcionalidades.md**  
   - Detalle de cada una de las 14+ funcionalidades

6. **06-API-y-Endpoints.md**  
   - Lista de endpoints (aunque sea Blazor Server, documentar los servicios y posibles APIs futuras)

7. **07-Manual-de-Usuario.md**  
   - Guía paso a paso para Admin y para Empleados

8. **08-Manual-Tecnico.md**  
   - Cómo agregar nuevas entidades  
   - Cómo extender reportes  
   - Convenciones de código

9. **09-Integracion-Futura-con-Apps-Externas.md**  ← **MUY IMPORTANTE**
   - Explicar cómo otras aplicaciones (sistemas de pedidos QR, POS, delivery, apps móviles) que **no tienen control de stock** pueden integrarse con este sistema.
   - Endpoints recomendados para:
     - Consultar stock de un producto
     - Descontar stock (venta externa)
     - Registrar entrada de mercadería
     - Webhooks o eventos futuros
   - Autenticación vía JWT para sistemas externos
   - Ejemplo de payload JSON para integración
   - Consideraciones de concurrencia y consistencia de stock

10. **10-Guia-Despliegue.md**
    - Publicación en IIS / Linux / Docker (básico)

---

## 13. INSTRUCCIONES ESPECÍFICAS PARA LA IA GENERADORA

1. Crea la Solution y los 4 proyectos con las referencias correctas.
2. Implementa **todo** el código necesario (no dejes TODOs críticos).
3. Usa nombres en inglés para código (clases, métodos, propiedades) y español para la UI y documentación.
4. Aplica Soft Delete en todas las consultas (filtros globales de EF Core recomendados).
5. Implementa paginación, búsqueda y ordenamiento en listados.
6. El Dashboard debe mostrar al menos:
   - Productos con stock bajo mínimo
   - Ventas del día (cantidad y monto)
   - Últimos movimientos
7. Genera los reportes PDF con QuestPDF y Excel con ClosedXML de forma profesional.
8. En el login usa BCrypt.Verify.
9. Crea un `DataSeeder` que se ejecute al iniciar la aplicación (solo si las tablas están vacías).
10. Asegúrate de que la carpeta `wwwroot/uploads/productos` se cree al inicio.
11. Configura la cultura `es-AR` globalmente.
12. Todo debe funcionar con Visual Studio Community → F5.

---

## 14. CRITERIOS DE ACEPTACIÓN

El proyecto se considera correcto cuando:

- Se abre en Visual Studio Community 2022 sin errores.
- Se restauran los paquetes NuGet correctamente.
- Al ejecutar los scripts, las bases de datos quedan listas.
- Se puede iniciar sesión con `admin` / `Admin123!` y con cualquiera de los empleados.
- Se pueden crear productos con imagen.
- Se puede realizar una venta y el stock se descuenta correctamente.
- Se pueden generar reportes PDF y Excel.
- Existe la carpeta `docs` con los 10 manuales completos.
- El archivo de integración futura (09) está bien explicado.

---

**FIN DEL DOCUMENTO AGENTE.MD**

Este archivo contiene toda la información necesaria.  
Procede a generar el proyecto completo siguiendo estrictamente estas especificaciones.
