from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Inches, Pt, RGBColor


ROOT = Path(r"D:\RESTAURANTE-APP-1")
OUTPUT = ROOT / "docs" / "Resumen_Tecnico_SmartRestaurantQR.docx"


def set_cell_shading(cell, fill):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.find(qn("w:shd"))
    if shd is None:
        shd = OxmlElement("w:shd")
        tc_pr.append(shd)
    shd.set(qn("w:fill"), fill)


def set_cell_margins(cell, top=110, start=130, bottom=110, end=130):
    tc = cell._tc
    tc_pr = tc.get_or_add_tcPr()
    tc_mar = tc_pr.first_child_found_in("w:tcMar")
    if tc_mar is None:
        tc_mar = OxmlElement("w:tcMar")
        tc_pr.append(tc_mar)
    for name, value in (("top", top), ("start", start), ("bottom", bottom), ("end", end)):
        node = tc_mar.find(qn(f"w:{name}"))
        if node is None:
            node = OxmlElement(f"w:{name}")
            tc_mar.append(node)
        node.set(qn("w:w"), str(value))
        node.set(qn("w:type"), "dxa")


def set_repeat_table_header(row):
    tr_pr = row._tr.get_or_add_trPr()
    tbl_header = OxmlElement("w:tblHeader")
    tbl_header.set(qn("w:val"), "true")
    tr_pr.append(tbl_header)


def keep_with_next(paragraph):
    p_pr = paragraph._p.get_or_add_pPr()
    keep = OxmlElement("w:keepNext")
    p_pr.append(keep)


def set_font(run, name="Aptos", size=None, bold=None, color=None):
    run.font.name = name
    run._element.get_or_add_rPr().rFonts.set(qn("w:ascii"), name)
    run._element.get_or_add_rPr().rFonts.set(qn("w:hAnsi"), name)
    if size is not None:
        run.font.size = Pt(size)
    if bold is not None:
        run.bold = bold
    if color is not None:
        run.font.color.rgb = RGBColor.from_string(color)


def add_table(doc, headers, rows, widths=None):
    table = doc.add_table(rows=1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = "Table Grid"
    header = table.rows[0]
    set_repeat_table_header(header)
    for i, text in enumerate(headers):
        cell = header.cells[i]
        set_cell_shading(cell, "203864")
        set_cell_margins(cell)
        cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r = p.add_run(text)
        set_font(r, size=9, bold=True, color="FFFFFF")
        if widths:
            cell.width = Cm(widths[i])
    for row_i, values in enumerate(rows):
        cells = table.add_row().cells
        for i, value in enumerate(values):
            cell = cells[i]
            set_cell_margins(cell)
            cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
            if row_i % 2:
                set_cell_shading(cell, "EEF3F8")
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(str(value))
            set_font(r, size=8.7)
            if widths:
                cell.width = Cm(widths[i])
    doc.add_paragraph().paragraph_format.space_after = Pt(2)
    return table


def add_bullets(doc, items, level=0):
    for item in items:
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Cm(0.72 if level == 0 else 1.2)
        p.paragraph_format.first_line_indent = Cm(-0.42)
        p.paragraph_format.space_after = Pt(2)
        p.add_run(f"•  {item}")


def add_numbered(doc, items):
    for index, item in enumerate(items, start=1):
        p = doc.add_paragraph()
        p.paragraph_format.left_indent = Cm(0.72)
        p.paragraph_format.first_line_indent = Cm(-0.52)
        p.paragraph_format.space_after = Pt(2)
        p.add_run(f"{index}.  {item}")


def add_code(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Cm(0.6)
    p.paragraph_format.right_indent = Cm(0.6)
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(7)
    p_pr = p._p.get_or_add_pPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), "F2F4F6")
    p_pr.append(shd)
    for idx, line in enumerate(text.splitlines()):
        r = p.add_run(line)
        set_font(r, "Consolas", 8.4, color="1F1F1F")
        if idx < len(text.splitlines()) - 1:
            r.add_break()


def add_heading(doc, text, level=1):
    p = doc.add_heading(text, level=level)
    keep_with_next(p)
    return p


doc = Document()
section = doc.sections[0]
section.top_margin = Cm(2.0)
section.bottom_margin = Cm(1.8)
section.left_margin = Cm(2.1)
section.right_margin = Cm(2.1)

styles = doc.styles
normal = styles["Normal"]
normal.font.name = "Aptos"
normal._element.rPr.rFonts.set(qn("w:ascii"), "Aptos")
normal._element.rPr.rFonts.set(qn("w:hAnsi"), "Aptos")
normal.font.size = Pt(10.5)
normal.font.color.rgb = RGBColor(31, 31, 31)
normal.paragraph_format.space_after = Pt(6)
normal.paragraph_format.line_spacing = 1.08

for style_name, size, before, after in (("Title", 26, 0, 14), ("Heading 1", 17, 14, 7), ("Heading 2", 13, 11, 5), ("Heading 3", 11, 8, 3)):
    style = styles[style_name]
    style.font.name = "Aptos Display" if style_name != "Normal" else "Aptos"
    style._element.rPr.rFonts.set(qn("w:ascii"), style.font.name)
    style._element.rPr.rFonts.set(qn("w:hAnsi"), style.font.name)
    style.font.size = Pt(size)
    style.font.bold = True
    style.font.color.rgb = RGBColor(0, 0, 0)
    style.paragraph_format.space_before = Pt(before)
    style.paragraph_format.space_after = Pt(after)
    style.paragraph_format.keep_with_next = True

# Word puede heredar un borde inferior del estilo Title de la plantilla normal.
title_ppr = styles["Title"]._element.get_or_add_pPr()
title_border = title_ppr.find(qn("w:pBdr"))
if title_border is not None:
    title_ppr.remove(title_border)

# Cover
p = doc.add_paragraph(style="Title")
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(115)
p.add_run("Resumen técnico de SmartRestaurantQR")

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Arquitectura tecnologías conexiones y funcionamiento integral")
set_font(r, "Aptos", 15, color="404040")

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(24)
r = p.add_run("Documento de estudio")
set_font(r, "Aptos", 11, bold=True, color="203864")

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run("Estado técnico verificado el 19 de octubre de 2026")
set_font(r, "Aptos", 10, color="666666")

doc.add_page_break()

add_heading(doc, "Propósito y alcance", 1)
doc.add_paragraph(
    "Este documento explica la estructura real de SmartRestaurantQR, las tecnologías que utiliza, "
    "cómo se conectan sus componentes y cómo circula la información desde los teléfonos hasta las bases de datos. "
    "También diferencia la integración visual de Stock de una integración de datos, describe el pago simulado, "
    "el QR de reservas, el acceso remoto mediante ngrok y la secuencia de arranque y reconexión."
)
doc.add_paragraph(
    "La conclusión principal es que SmartRestaurantQR es una arquitectura distribuida. Las aplicaciones móviles, "
    "el backend Node, PostgreSQL y StockSmartRestaurantQR pueden funcionar como sistemas separados, mientras que "
    "el proxy y la WebView ofrecen una experiencia unificada en la aplicación Restaurante."
)

add_heading(doc, "Contenido", 1)
toc_items = [
    "1  Arquitectura general",
    "2  Tecnologías y lenguajes",
    "3  Aplicaciones móviles",
    "4  Backend Node y Express",
    "5  PostgreSQL",
    "6  Aplicación StockSmartRestaurantQR",
    "7  MariaDB y MongoDB",
    "8  Integración de Stock dentro de Restaurante",
    "9  API REST autenticación y sesiones",
    "10  Reservas pago simulado y QR",
    "11  Comunicación en tiempo real",
    "12  ngrok y acceso remoto",
    "13  Arranque y reconexión",
    "14  Seguridad",
    "15  Integración actual y límites",
    "16  Compilación y distribución",
    "17  Flujo completo del sistema",
    "18  Glosario y guía de estudio",
]
for item in toc_items:
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Cm(0.4)
    p.paragraph_format.space_after = Pt(2)
    p.add_run(item)

doc.add_page_break()

add_heading(doc, "1 Arquitectura general", 1)
doc.add_paragraph(
    "La plataforma está formada por dos aplicaciones móviles, un backend principal y una aplicación web de stock. "
    "Los teléfonos nunca se conectan directamente a una base de datos. Toda operación llega primero a un servidor, "
    "que aplica autenticación, validaciones y reglas de negocio."
)
add_code(doc, "TELÉFONOS ANDROID\n  ├─ Aplicación Cliente\n  └─ Aplicación Restaurante\n          │ HTTPS\n          ▼\nDOMINIO PÚBLICO NGROK\n          │ túnel hacia la PC 192.168.0.7\n          ▼\nNODE.JS + EXPRESS  puerto 3000\n  ├─ /api/*    → reglas del restaurante → PostgreSQL 5432\n  ├─ /socket.io → eventos en tiempo real\n  └─ /stock/*  → proxy → ASP.NET Core 5050\n                              ├─ MariaDB 3306\n                              └─ MongoDB 27017")

add_table(doc, ["Componente", "Responsabilidad", "Persistencia"], [
    ["Aplicación Cliente", "Reservas, pedidos, pago simulado, QR y perfil del comensal", "AsyncStorage local para sesión"],
    ["Aplicación Restaurante", "Operación del local, cocina, caja, QR, gestión y acceso a Stock", "AsyncStorage local para sesión"],
    ["Backend Node", "API, reglas de negocio, autenticación y Socket.IO", "PostgreSQL"],
    ["StockSmartRestaurantQR", "Inventario, ventas, reportes, usuarios y auditoría de Stock", "MariaDB y MongoDB"],
    ["ngrok", "Publicación HTTPS del servidor local", "No almacena los datos del negocio"],
], [3.2, 9.0, 4.5])

add_heading(doc, "2 Tecnologías y lenguajes", 1)
add_table(doc, ["Área", "Tecnologías verificadas", "Uso"], [
    ["Móvil", "JavaScript, React 18.3.1, React Native 0.76.5, Expo SDK 52", "Interfaz Android de Cliente y Restaurante"],
    ["Navegación", "React Navigation 7", "Pilas de pantallas y pestañas inferiores"],
    ["Red móvil", "Axios y Socket.IO Client", "API REST y eventos en tiempo real"],
    ["Backend", "Node.js, Express 5.2.1, ES Modules", "Servidor HTTP y lógica del restaurante"],
    ["Base principal", "PostgreSQL y node-postgres pg", "Datos operativos del restaurante"],
    ["Stock web", "C#, .NET 10, ASP.NET Core, Blazor Server, MudBlazor", "Interfaz y lógica de inventario"],
    ["Datos Stock", "MariaDB, Entity Framework Core, MongoDB Driver", "Inventario, ventas y usuarios de Stock"],
    ["Build móvil", "Gradle, Kotlin 1.9.25, EAS Build", "Generación de APK Android"],
    ["Paquetes JS", "pnpm 11.11.0", "Instalación y bloqueo de dependencias"],
], [3.0, 6.2, 7.5])

add_heading(doc, "3 Aplicaciones móviles", 1)
add_heading(doc, "3.1 Aplicación Cliente", 2)
doc.add_paragraph(
    "La aplicación Cliente permite que el comensal se registre, inicie sesión, consulte sucursales y productos, "
    "cree una reserva, asocie un pedido, simule el pago y muestre el QR de ingreso. También incluye promociones, "
    "créditos, fidelización, notificaciones y perfil."
)
add_bullets(doc, [
    "Axios realiza peticiones HTTP a la API.",
    "AsyncStorage conserva access token, refresh token y datos del usuario.",
    "react-native-qrcode-svg convierte el código recibido en una imagen QR.",
    "DateTimePicker y Picker permiten elegir fecha, hora, sucursal y cantidad de personas.",
    "La versión Android configurada es 1.1.1 con el paquete com.smartrestaurantqr.cliente.",
])

add_heading(doc, "3.2 Aplicación Restaurante", 2)
doc.add_paragraph(
    "La aplicación Restaurante concentra la operación del local: dashboard, pedidos, cocina, escáner QR, caja, "
    "reservas, productos, categorías, promociones, perfil y la pestaña Stock."
)
add_bullets(doc, [
    "react-native-webview muestra Stock dentro de la aplicación.",
    "socket.io-client recibe eventos asociados a la sucursal.",
    "expo-barcode-scanner permite leer los QR de ingreso.",
    "expo-image-picker permite seleccionar imágenes de productos.",
    "La versión Android configurada es 1.1.2 con el paquete com.smartrestaurantqr.restaurante.",
    "La pestaña Stock existe solo en Restaurante, no en Cliente.",
])

add_heading(doc, "4 Backend Node y Express", 1)
doc.add_paragraph(
    "El backend escucha en 0.0.0.0:3000. Esa dirección permite atender localhost, la red local y las solicitudes "
    "reenviadas por ngrok. Antes de comenzar a escuchar, verifica la conexión PostgreSQL, inicializa Socket.IO y "
    "pone en marcha los trabajos programados."
)
add_heading(doc, "4.1 Arquitectura por capas", 2)
add_code(doc, "RUTA HTTP\n  ↓\nMIDDLEWARE Y VALIDADORES\n  ↓\nCONTROLLER\n  ↓\nSERVICE\n  ↓\nREPOSITORY\n  ↓\nDATABASE MANAGER\n  ↓\nPOSTGRESQL")
add_table(doc, ["Capa", "Función"], [
    ["Route", "Define URL, método HTTP, validación y middleware de autorización."],
    ["Controller", "Adapta req y res, llama al servicio y produce la respuesta JSON."],
    ["Service", "Aplica las reglas de negocio y coordina varios repositorios o servicios."],
    ["Repository", "Ejecuta SQL parametrizado y transforma resultados."],
    ["DatabaseManager", "Gestiona pool, consultas, transacciones y normalización snake case a camelCase."],
], [3.5, 13.2])

add_heading(doc, "4.2 Funciones del backend", 2)
add_bullets(doc, [
    "Autenticación, roles y permisos.",
    "Sucursales, horarios y mesas.",
    "Categorías, productos e imágenes.",
    "Reservas, pedidos, pagos, comandas y caja.",
    "QR de ingreso y validaciones.",
    "Promociones, créditos, fidelización y notificaciones.",
    "Mercado Pago simulado y estructura para Mercado Pago real.",
    "Reportes, auditoría, configuración y documentación Swagger.",
    "Proxy inverso de Stock y reenvío de WebSocket de Blazor.",
])

add_heading(doc, "5 PostgreSQL", 1)
doc.add_paragraph(
    "PostgreSQL es la fuente de datos principal del restaurante. Node accede mediante el paquete pg. Las consultas "
    "usan parámetros posicionales como $1 y $2, lo que reduce el riesgo de inyección SQL. El DatabaseManager puede "
    "ejecutar transacciones con BEGIN, COMMIT y ROLLBACK."
)
add_table(doc, ["Grupo", "Tablas o datos principales"], [
    ["Seguridad", "usuarios, roles, permisos, usuario_roles, rol_permisos, refresh_tokens"],
    ["Local", "sucursales, horarios_sucursal, mesas y grupos de mesas"],
    ["Catálogo", "categorias, productos y productos_sucursal"],
    ["Operación", "reservas, pedidos, detalles, historiales, pagos, comandas y cajas"],
    ["Experiencia", "promociones, créditos, fidelización y notificaciones"],
    ["Acceso", "ingresos_qr y validaciones_qr"],
    ["Control", "auditoria, configuracion_sistema y politicas_sistema"],
    ["Esquema de inventario", "ingredientes, producto_ingredientes y movimientos_stock"],
], [4.0, 12.7])
doc.add_paragraph(
    "Advertencia técnica: las tablas PostgreSQL de ingredientes y movimientos existen, pero la pestaña Stock actual "
    "trabaja con el sistema C# y sus propias bases. La existencia de esas tablas no implica una sincronización automática."
)

add_heading(doc, "6 Aplicación StockSmartRestaurantQR", 1)
doc.add_paragraph(
    "StockSmartRestaurantQR es un sistema web independiente escrito en C#. Sus proyectos actuales apuntan a .NET 10. "
    "La interfaz utiliza Blazor Server interactivo y MudBlazor. El servidor escucha en el puerto 5050 y utiliza el "
    "prefijo /stock."
)
add_heading(doc, "6.1 Capas del proyecto C sharp", 2)
add_table(doc, ["Proyecto", "Responsabilidad"], [
    ["Domain", "Entidades del dominio como Product, Category, Supplier, Sale y StockMovement."],
    ["Application", "DTO, interfaces, resultados paginados y validadores FluentValidation."],
    ["Infrastructure", "Entity Framework, MongoDB, autenticación, archivos, inventario y reportes."],
    ["Web", "Razor Components, Blazor, endpoints HTTP, cookies, JWT y presentación MudBlazor."],
], [5.1, 11.6])
add_heading(doc, "6.2 Funciones", 2)
add_bullets(doc, [
    "Administración de productos, categorías y proveedores.",
    "Entradas, salidas y consulta de movimientos de inventario.",
    "Registro y consulta de ventas.",
    "Dashboard y productos bajo stock mínimo.",
    "Usuarios, roles y activación de cuentas.",
    "Auditoría y configuración.",
    "Reportes PDF mediante QuestPDF.",
    "Reportes Excel mediante ClosedXML.",
    "Carga y almacenamiento de imágenes de productos.",
])

add_heading(doc, "7 MariaDB y MongoDB", 1)
add_heading(doc, "7.1 MariaDB", 2)
doc.add_paragraph(
    "MariaDB guarda los datos relacionales y transaccionales de Stock: categorías, proveedores, productos, "
    "movimientos, ventas, detalles, auditoría y configuración. Entity Framework Core accede mediante Pomelo."
)
add_heading(doc, "7.2 MongoDB", 2)
doc.add_paragraph(
    "MongoDB almacena los documentos de usuario de Stock: nombre de usuario, hash de contraseña, nombre completo, "
    "correo, rol, estado y último acceso. El código usa MongoDB.Driver e IMongoCollection."
)
add_heading(doc, "7.3 Separación respecto de PostgreSQL", 2)
doc.add_paragraph(
    "PostgreSQL, MariaDB y MongoDB no ejecutan consultas cruzadas entre sí. Cada aplicación controla sus propias "
    "entidades. La integración actual permite acceder a todo desde una interfaz, pero no convierte las tres bases "
    "en una sola base lógica."
)

add_heading(doc, "8 Integración de Stock dentro de Restaurante", 1)
add_numbered(doc, [
    "ASP.NET Core publica Stock localmente en http://127.0.0.1:5050/stock/.",
    "Express recibe solicitudes que comienzan con /stock en el puerto 3000.",
    "El proxy inverso reenvía HTTP, formularios y WebSocket al servidor C#.",
    "ngrok publica el puerto 3000 bajo un dominio HTTPS estable.",
    "La pestaña Stock abre la URL pública dentro de react-native-webview.",
    "El usuario inicia una sesión de Stock independiente dentro de la WebView.",
])
doc.add_paragraph(
    "El proxy se registra antes que los analizadores de cuerpos de Express. Esto evita que Express consuma el POST "
    "del formulario antes de que llegue a ASP.NET Core. El backend también reenvía la actualización WebSocket que "
    "Blazor necesita para mantener la interfaz interactiva."
)
add_table(doc, ["Sesión", "Tecnología", "Base de usuarios", "Persistencia en el dispositivo"], [
    ["Cliente y Restaurante", "JWT y refresh token", "PostgreSQL", "AsyncStorage"],
    ["Stock web", "Cookie ASP.NET Core y JWT para API", "MongoDB", "Cookie de WebView o navegador"],
], [3.5, 4.8, 4.0, 4.4])

add_heading(doc, "9 API REST autenticación y sesiones", 1)
add_heading(doc, "9.1 API REST", 2)
doc.add_paragraph(
    "Las aplicaciones envían y reciben JSON mediante HTTPS. Las rutas protegidas esperan un encabezado Authorization "
    "con formato Bearer. Las respuestas mantienen una estructura JSON consistente de éxito, mensaje y datos."
)
add_code(doc, "Authorization: Bearer ACCESS_TOKEN\nContent-Type: application/json")
add_heading(doc, "9.2 Inicio y renovación de sesión", 2)
add_numbered(doc, [
    "El usuario envía correo o nombre de usuario y contraseña.",
    "El backend compara la contraseña con bcrypt.",
    "Si es válida, genera access token, refresh token y datos del usuario.",
    "La aplicación guarda los tres valores en AsyncStorage.",
    "Axios agrega el access token a cada solicitud protegida.",
    "Si el token vence, la aplicación usa /api/auth/refresh y reintenta la solicitud.",
    "Si la renovación falla, elimina la sesión local.",
])

add_heading(doc, "10 Reservas pago simulado y QR", 1)
add_heading(doc, "10.1 Creación de la reserva", 2)
doc.add_paragraph(
    "El cliente elige sucursal, fecha, hora, cantidad de personas, productos y observaciones. El backend exige al "
    "menos 60 minutos de anticipación, verifica el horario del local y busca una mesa disponible. La reserva se crea "
    "como PENDIENTE_PAGO y luego se crea un pedido asociado de tipo LOCAL."
)
add_heading(doc, "10.2 Simulación de Mercado Pago", 2)
doc.add_paragraph(
    "La ruta POST /api/mercado-pago/simulacion/aprobar no contacta a Mercado Pago ni mueve dinero. Está diseñada "
    "para demostrar el recorrido funcional completo."
)
add_numbered(doc, [
    "Comprueba que el pedido pertenezca al usuario autenticado.",
    "Comprueba que el pedido tenga una reserva asociada.",
    "Verifica que la reserva admita pago.",
    "Busca un pago aprobado existente para evitar duplicarlo.",
    "Crea y aprueba un pago con proveedor Mercado Pago simulado.",
    "Activa el pedido después del pago.",
    "Confirma la reserva.",
    "Genera o recupera su QR.",
    "Suma fidelización y genera una notificación solo cuando corresponde.",
])
add_heading(doc, "10.3 Mercado Pago real", 2)
doc.add_paragraph(
    "El backend conserva rutas de preferencia y webhook para una integración real. Esas rutas requieren credenciales "
    "externas y configuración de URLs. No deben confundirse con la simulación usada en la demostración."
)
add_heading(doc, "10.4 QR de ingreso", 2)
doc.add_paragraph(
    "El backend genera un UUID, lo guarda en PostgreSQL y lo devuelve a Cliente. react-native-qrcode-svg representa "
    "ese texto como imagen. Restaurante escanea el código y llama a /api/ingresos-qr/validar. El servidor comprueba "
    "que exista y que todavía esté en estado GENERADO antes de registrar su utilización."
)

add_heading(doc, "11 Comunicación en tiempo real", 1)
doc.add_paragraph(
    "Socket.IO comparte el mismo servidor HTTP y dominio que la API. Restaurante se une a una sala identificada como "
    "sucursal-ID. Así, un evento se dirige a la sucursal correspondiente y no a todos los dispositivos."
)
add_table(doc, ["Evento", "Origen", "Efecto"], [
    ["joinSucursal", "Aplicación Restaurante", "Incorpora el dispositivo a la sala de su sucursal."],
    ["nuevoPedido", "Servicio de pedidos", "Avisa que hay un pedido nuevo."],
    ["nuevaReserva", "Servicio de reservas", "Avisa que una reserva fue confirmada."],
], [4.0, 5.0, 7.7])
doc.add_paragraph(
    "Varias pantallas también consultan periódicamente, por ejemplo cada 30 segundos. Ese polling sirve como respaldo "
    "si el evento en tiempo real se pierde o el teléfono recupera la conexión después de una interrupción."
)

add_heading(doc, "12 ngrok y acceso remoto", 1)
doc.add_paragraph(
    "La PC del servidor tiene la dirección local 192.168.0.7, pero esa dirección solo funciona dentro de la misma red. "
    "ngrok crea un túnel HTTPS para que los teléfonos puedan conectarse mediante Wi Fi externo o datos móviles."
)
add_code(doc, "https://emphasis-expanse-evolution.ngrok-free.dev/api\nhttps://emphasis-expanse-evolution.ngrok-free.dev/socket.io/\nhttps://emphasis-expanse-evolution.ngrok-free.dev/stock/")
doc.add_paragraph(
    "El APK Restaurante envía el encabezado ngrok-skip-browser-warning y un agente de usuario propio al cargar Stock. "
    "Esto permite que la página y sus recursos CSS y JavaScript lleguen a la WebView sin ser reemplazados por la "
    "advertencia del servicio gratuito de ngrok."
)

add_heading(doc, "13 Arranque y reconexión", 1)
doc.add_paragraph(
    "RECONECTAR-APLICACIONES.bat solicita elevación administrativa y ejecuta activar-servidor-completo.ps1. "
    "ACTIVAR-SERVIDOR-Y-NGROK.bat utiliza el mismo procedimiento."
)
add_numbered(doc, [
    "Detectar e iniciar los servicios PostgreSQL.",
    "Detectar e iniciar MariaDB o MySQL y MongoDB.",
    "Comprobar Stock en localhost:5050.",
    "Ejecutar INICIAR-APLICACION.cmd si Stock no responde.",
    "Obtener el token antifalsificación y probar el POST de login de Stock.",
    "Comprobar o reiniciar el backend Node en el puerto 3000.",
    "Validar /api/health y /stock/ a través de Express.",
    "Detectar o iniciar el túnel ngrok hacia el puerto 3000.",
    "Comprobar API, Stock y login desde la URL pública.",
    "Confirmar que la URL pública coincide con la incorporada en los APK.",
    "Iniciar el monitor automático de conexión.",
])
doc.add_paragraph(
    "La prueba de login usa credenciales de health check deliberadamente inválidas. Si el servidor vuelve a la página "
    "con el error esperado, queda demostrado que la ruta, las cookies, el token antifalsificación y el POST funcionan, "
    "sin exponer contraseñas reales."
)

add_heading(doc, "14 Seguridad", 1)
add_table(doc, ["Área", "Controles implementados"], [
    ["Backend Node", "JWT, refresh tokens, bcrypt, Helmet, CORS, rate limiting, validadores y SQL parametrizado."],
    ["Stock", "BCrypt, cookies HttpOnly, antiforgery, roles, JWT para API, FluentValidation y Data Protection."],
    ["Transporte", "HTTPS público de ngrok y proxy con encabezados reenviados."],
    ["Datos", "Separación de responsabilidades entre PostgreSQL, MariaDB y MongoDB."],
], [4.2, 12.5])
add_heading(doc, "14.1 Consideraciones para producción real", 2)
add_bullets(doc, [
    "Usar dominio y servidor persistentes.",
    "Gestionar secretos con un almacén dedicado y rotación periódica.",
    "Aplicar TLS y firewall con reglas restrictivas.",
    "Automatizar backups y restauraciones probadas.",
    "Agregar monitoreo, alertas y alta disponibilidad.",
    "Usar almacenamiento seguro del sistema operativo para tokens móviles.",
    "Revisar política CORS y límites según el despliegue real.",
])

add_heading(doc, "15 Integración actual y límites", 1)
add_table(doc, ["Integrado", "Permanece independiente"], [
    ["Stock aparece dentro de Restaurante.", "Usuarios de Restaurante y usuarios de Stock."],
    ["API, Socket.IO y Stock comparten dominio público.", "PostgreSQL, MariaDB y MongoDB."],
    ["Un script inicia y comprueba los componentes.", "Productos del menú y productos de inventario."],
    ["WebView conserva la sesión web de Stock.", "Pedidos del restaurante y ventas de Stock."],
    ["Blazor atraviesa el proxy HTTP y WebSocket.", "Stock PostgreSQL e inventario MariaDB."],
], [8.35, 8.35])
doc.add_paragraph(
    "La definición correcta es integración de presentación, acceso e infraestructura. No existe todavía una integración "
    "automática de datos comerciales e inventario. Una venta del restaurante no descuenta por sí sola productos o "
    "ingredientes en StockSmartRestaurantQR."
)
add_heading(doc, "15.1 Qué requeriría una sincronización futura", 2)
add_bullets(doc, [
    "Elegir una única fuente de verdad para el inventario.",
    "Relacionar los productos del menú con insumos o recetas.",
    "Definir reserva, consumo y devolución de existencias.",
    "Usar transacciones e idempotencia para evitar dobles descuentos.",
    "Definir compensaciones cuando una base está disponible y otra falla.",
    "Auditar toda modificación cruzada.",
    "Agregar pruebas de concurrencia y fallos parciales.",
])

add_heading(doc, "16 Compilación y distribución", 1)
add_table(doc, ["Acción", "Comando o mecanismo"], [
    ["Instalar dependencias", "pnpm install"],
    ["Iniciar Expo", "pnpm start"],
    ["Ejecutar Android", "pnpm android o expo run:android"],
    ["APK local", "Gradle assembleRelease mediante pnpm build:local"],
    ["APK EAS", "pnpm build:apk con el perfil production"],
    ["Backend desarrollo", "pnpm dev"],
    ["Backend pruebas", "pnpm test"],
    ["Backend lint", "pnpm lint"],
], [5.0, 11.7])
doc.add_paragraph(
    "El perfil EAS production incorpora en tiempo de compilación las variables EXPO_PUBLIC_API_URL, "
    "EXPO_PUBLIC_SOCKET_URL y EXPO_PUBLIC_STOCK_WEB_URL. Por eso el APK sabe qué dominio público debe utilizar."
)

add_heading(doc, "17 Flujo completo del sistema", 1)
add_numbered(doc, [
    "El usuario abre Cliente e inicia sesión contra Node.",
    "Node valida al usuario mediante PostgreSQL y devuelve tokens.",
    "Cliente selecciona sucursal, fecha, hora, personas y productos.",
    "El backend verifica horarios y mesa y crea una reserva PENDIENTE_PAGO.",
    "Cliente crea un pedido asociado a la reserva.",
    "La ruta de demostración simula la aprobación de Mercado Pago.",
    "PostgreSQL registra el pago y activa el pedido.",
    "El backend confirma la reserva y genera el QR.",
    "Socket.IO emite nuevaReserva a la sala de la sucursal.",
    "Restaurante consulta o recibe la reserva confirmada.",
    "Cliente muestra el QR y Restaurante lo escanea.",
    "El backend valida y registra el uso del código.",
    "El encargado abre Stock desde la segunda pestaña de Restaurante.",
    "La WebView solicita /stock/ al dominio ngrok.",
    "ngrok entrega la solicitud al puerto 3000.",
    "Express la reenvía a ASP.NET Core en el puerto 5050.",
    "Stock autentica al usuario contra MongoDB.",
    "Stock consulta inventario y ventas en MariaDB.",
])

add_heading(doc, "18 Glosario y guía de estudio", 1)
add_table(doc, ["Concepto", "Definición aplicada al proyecto"], [
    ["Frontend", "Interfaz que utiliza el usuario en Cliente, Restaurante o Blazor."],
    ["Backend", "Servidor que aplica reglas y accede a las bases de datos."],
    ["API REST", "Conjunto de rutas HTTP que intercambian datos JSON."],
    ["JWT", "Token firmado que identifica al usuario de las aplicaciones móviles."],
    ["Refresh token", "Credencial de mayor duración usada para renovar el access token."],
    ["Hash", "Representación irreversible usada para verificar contraseñas sin guardarlas en texto plano."],
    ["Repository", "Capa que ejecuta las consultas de persistencia."],
    ["Service", "Capa que contiene las reglas de negocio."],
    ["DTO", "Objeto diseñado para transportar datos entre capas."],
    ["WebView", "Navegador embebido que muestra Stock dentro de Restaurante."],
    ["Proxy inverso", "Servidor que recibe una solicitud y la reenvía a otro servidor interno."],
    ["WebSocket", "Conexión persistente y bidireccional usada por Blazor y tiempo real."],
    ["Socket.IO", "Biblioteca de eventos en tiempo real usada por Restaurante."],
    ["ORM", "Herramienta que relaciona objetos C# con tablas MariaDB."],
    ["Transacción", "Conjunto de operaciones que se confirma o revierte como una unidad."],
    ["Idempotencia", "Propiedad que evita duplicar efectos al repetir una operación."],
    ["ngrok", "Túnel que publica en Internet el servidor local de la PC."],
    ["EAS Build", "Servicio de Expo que compila el proyecto y entrega el APK."],
    ["Antiforgery", "Protección de formularios contra solicitudes generadas por sitios externos."],
], [4.2, 12.5])

add_heading(doc, "18.1 Preguntas de repaso", 2)
questions = [
    "¿Por qué los teléfonos no se conectan directamente a PostgreSQL?",
    "¿Qué diferencia existe entre un Controller, un Service y un Repository?",
    "¿Qué datos pertenecen a PostgreSQL, MariaDB y MongoDB?",
    "¿Por qué la integración de Stock utiliza WebView y proxy inverso?",
    "¿Qué diferencia hay entre el JWT del restaurante y la cookie de Stock?",
    "¿Qué pasos ejecuta la simulación de Mercado Pago?",
    "¿Por qué el texto del QR debe verificarse en el backend?",
    "¿Qué función cumplen Socket.IO y el polling de 30 segundos?",
    "¿Por qué ngrok permite usar las aplicaciones desde otra red?",
    "¿Qué tendría que cambiar para descontar inventario automáticamente?",
]
add_numbered(doc, questions)

add_heading(doc, "18.2 Respuesta breve para exposición", 2)
doc.add_paragraph(
    "SmartRestaurantQR es una plataforma distribuida con dos aplicaciones React Native y Expo, un backend Node.js "
    "con Express y PostgreSQL, y una aplicación de inventario en C# con ASP.NET Core Blazor, MariaDB y MongoDB. "
    "Las aplicaciones consumen una API REST protegida con JWT y Restaurante usa Socket.IO para eventos en tiempo real. "
    "Stock se integra mediante una WebView; Node funciona como proxy inverso y ngrok publica API, Socket.IO y Blazor "
    "bajo un único dominio HTTPS. El pago de demostración registra una aprobación simulada, confirma la reserva, activa "
    "el pedido y genera un QR verificable. Las bases permanecen separadas, por lo que la solución unifica la experiencia "
    "y la infraestructura, pero todavía no sincroniza automáticamente las existencias con las ventas del restaurante."
)

# Header and footer
for sec in doc.sections:
    header = sec.header
    hp = header.paragraphs[0]
    hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    hr = hp.add_run("SmartRestaurantQR  Resumen técnico")
    set_font(hr, "Aptos", 8, color="666666")
    footer = sec.footer
    fp = footer.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    fr = fp.add_run("Documento de estudio técnico")
    set_font(fr, "Aptos", 8, color="777777")

doc.core_properties.title = "Resumen técnico de SmartRestaurantQR"
doc.core_properties.subject = "Arquitectura tecnologías conexiones y funcionamiento integral"
doc.core_properties.author = "SmartRestaurantQR"
doc.core_properties.keywords = "SmartRestaurantQR, React Native, Expo, Node.js, PostgreSQL, Blazor, MariaDB, MongoDB, ngrok"

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
doc.save(OUTPUT)
print(OUTPUT)
