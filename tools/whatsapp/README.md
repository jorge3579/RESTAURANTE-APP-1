# Canal de consultas por WhatsApp

Herramientas para consultar al responsable del proyecto por WhatsApp Desktop y
leer sus respuestas cuando no está frente a la PC.

## Cómo funciona

WhatsApp Desktop usa WebView2 y **no expone su contenido** a las APIs de
accesibilidad de Windows. Por eso estas herramientas trabajan con la ventana
visible: escriben en el cuadro de mensaje y capturan la pantalla para leer.

## Requisitos

- WhatsApp Desktop abierto y con sesión iniciada.
- El chat con el contacto de consultas seleccionado (por defecto es el chat
  propio: `@electronicobahia`, `+54 9 291 535-5023`).
- La ventana de WhatsApp debe estar visible, no minimizada.

## Scripts

### `whatsapp-enviar.ps1`

Escribe y envía un mensaje en el chat abierto.

```powershell
powershell -ExecutionPolicy Bypass -File whatsapp-enviar.ps1 -Mensaje "Texto de la consulta"
```

Con `-NoEnviar` deja el texto escrito sin enviarlo, útil para revisar.

### `whatsapp-capturar.ps1`

Guarda una imagen del panel de mensajes en `runtime\chat-actual.png`.

```powershell
powershell -ExecutionPolicy Bypass -File whatsapp-capturar.ps1
```

### `whatsapp-detectar.ps1`

Comprueba si llegó un mensaje nuevo comparando los píxeles de la zona de
mensajes contra la captura anterior.

```powershell
powershell -ExecutionPolicy Bypass -File whatsapp-detectar.ps1
```

- Sale con código `0` cuando hay una novedad real (y deja `runtime\chat-nuevo.png`).
- Sale con código `1` cuando no hay cambios.
- Sale con código `2` si no puede capturar la ventana.

Ignora el encabezado (reloj y estado de conexión) y el cuadro de escritura
(cursor parpadeante) para no generar falsos positivos. El umbral se ajusta con
`-UmbralPixeles`, y `-Forzar` salta la comparación.

## Automatización

La tarea programada **"Revisar respuestas de WhatsApp del proyecto"** ejecuta el
detector cada 10 minutos y, cuando encuentra una novedad, lee la captura y
continúa el trabajo según la respuesta.

## Limitaciones

- **No lee texto**: interpreta la captura como imagen. Una respuesta escrita en
  una sola línea larga puede ser difícil de leer; conviene que las respuestas
  sean breves y claras.
- Requiere que la ventana permanezca visible y que WhatsApp no cambie de chat.
- Si se cierra WhatsApp o se bloquea la sesión, el detector informa el fallo.
- No reemplaza una conversación en vivo: es un canal de respaldo.
