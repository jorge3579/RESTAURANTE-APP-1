# Diagnóstico de runtimes

Fecha de relevamiento: 22 de noviembre de 2026.

Este documento registra las versiones instaladas, las últimas disponibles y el
riesgo de actualizar. **Conclusión: no se actualiza ningún runtime por ahora.**
Las tres aplicaciones están operativas y una actualización de runtime es un
riesgo real sin beneficio inmediato.

## Resumen

| Runtime | Instalado | Última estable | ¿Actualizar? |
| --- | --- | --- | --- |
| Node.js | v24.15.0 | v26.13.1 (LTS "Lithium", 10/11/2026) | **No** |
| Java (JDK del sistema) | JDK 8u251 | JDK 21 LTS | **No por ahora** |
| Java (JBR de Android Studio) | OpenJDK 21.0.10 | JDK 21 LTS | Ya en rama 21 |
| .NET SDK | 10.0.404 | 10.0.404 | Ya en la última |
| pnpm | 11.11.0 | 11.11.0 (fijado en `packageManager`) | Ya en la última |

## Node.js

- **Instalado:** v24.15.0 con npm 11.12.1.
- **Última LTS:** v26.13.1 "Lithium", publicada el 10/11/2026.

**Motivo para no actualizar:** los dos frontends dependen de `expo ~52.0.0` y
`react-native 0.76.5`, versiones de 2024. Metro, el bundler de React Native, y
las herramientas de Expo no están probadas contra Node 26; los fallos típicos
son de resolución de módulos y de compilación de Hermes. Actualizar Node
obligaría a subir Expo y React Native en cascada, lo que implica recompilar y
volver a probar ambos APK: un cambio de alcance mucho mayor que "actualizar
Node".

**Cuándo revisarlo:** al planificar la migración a Expo SDK 54 o superior, que
es el momento natural para subir también Node.

## Java

Existen dos instalaciones con propósitos distintos:

- **JDK 8u251 (sistema):** sin soporte público desde 2019. No lo usa el build
  de las apps: Gradle compila los APK con el JBR de Android Studio.
- **JBR de Android Studio 21.0.10:** es el que usa `gradlew` al compilar los APK
  y ya está en la rama 21 LTS.

**Motivo para no tocar el JDK 8:** es inofensivo si nada lo invoca, y
desinstalarlo podría romper alguna herramienta que dependa de él (por ejemplo
un driver o un utilitario de terceros). Antes de quitarlo hay que confirmar que
ningún proceso lo referencia con `JAVA_HOME` ni con rutas absolutas.

**Nota operativa:** `JAVA_HOME` y `ANDROID_HOME` no están definidos en el
entorno. Para compilar APK hay que definirlos en la sesión, como indica
`readmefinal.md`, sección 8.

## .NET

- **SDK:** 10.0.404 (la última disponible).
- **Runtimes instalados:** 10.0.15, 8.0.34, 6.0.36 y 3.1.32.

El proyecto de Stock y la worklist PACS compilan con .NET 10; el instalador de
compatibilidad con Windows 7 de la worklist apunta a `net6.0-windows`. Los
runtimes 3.1 y 6.0 están fuera de soporte, pero **quitarlos rompería** el
instalador de compatibilidad y cualquier binario ya distribuido que dependa de
ellos. Se mantienen.

## Riesgo de actualizar ahora

| Acción | Riesgo | Impacto |
| --- | --- | --- |
| Subir Node a 26 | Alto | Rompe Metro/Expo; exige migrar Expo SDK y recompilar los dos APK |
| Quitar JDK 8 | Bajo-medio | Puede romper herramientas que lo usen; requiere auditar procesos |
| Quitar .NET 3.1/6.0 | Medio | Rompe el instalador de compatibilidad de la worklist |
| Actualizar .NET / pnpm | Nulo | Ya están en la última versión |

## Recomendación

Dejar los runtimes como están y revisar la actualización de Node **solo** junto
con una migración planificada de Expo/React Native, en una rama aparte y con
pruebas en emulador antes de recompilar los APK que hoy se distribuyen.
