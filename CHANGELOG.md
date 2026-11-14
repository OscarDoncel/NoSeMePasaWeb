# Historial de cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Cada taller cierra con una versión y una etiqueta (tag) en git.

## [Sin publicar]
### Ideas para el próximo taller
- (Anota aquí las mejoras que pida el docente)

## [1.4.0] - 2026-11-14 · Evaluación final
### Agregado
- Validación del correo en la ficha con mensaje en texto; límites de longitud en nombre y correo.
- `js/logica.js` (crear, filtrar, ordenar y contar actividades, sin DOM) y `js/grafica.js` (gráfica SVG).
- Animación con propósito: resaltado de la actividad recién agregada o editada (respeta `prefers-reduced-motion`).
- Pruebas de `logica.js`, `esCorreoValido` y `faltantesActividad` (32 en total).
- README con tabla de funciones completas y pendientes, mapa de módulos, criterios de evaluación y tabla de contraste.
### Cambiado
- `comun.js` pasa a llamarse `tema.js`; `exportar.js` solo genera el CSV y la descarga vive en `dom.js`.
- `actividades.js` queda como conexión de eventos; el filtrado salió a `logica.js`.
- Todos los colores fijos del CSS pasaron a variables.

## [1.3.0] - 2026-11-14 · Pulido y calidad
### Agregado
- Pruebas unitarias (`npm test`, sin dependencias) para fechas, validación, almacenamiento y CSV.
- `js/validar.js`: las actividades guardadas se validan al leerlas (se descartan datos dañados, fechas inexistentes, frentes desconocidos).
- Política de seguridad de contenido (CSP) en las 3 páginas.
- Diálogo nativo accesible para confirmar la eliminación (reemplaza `confirm()`).
- Avisos de estado al completar o eliminar una actividad; estados vacíos distintos («sin actividades» y «sin resultados») y botón «Limpiar filtros».
- La fecha de hoy aparece por defecto al crear una actividad.
- Imagen para compartir el enlace (`og-image.jpg`), ícono para iPhone y datos estructurados JSON-LD.
- Estilos de impresión y de contraste forzado.
- `.gitattributes`, `.editorconfig` y `.nojekyll`.
### Cambiado
- El tema oscuro se aplica antes de pintar (sin destello claro).
- La gráfica usa clases CSS en lugar de estilos en línea y se lee mejor en pantallas pequeñas.
- `localStorage` lleno o dañado ya no rompe la app.

## [1.2.0] - 2026-11-14 · Tres páginas (requisito del docente)
### Cambiado
- El proyecto pasa de una sola página a **tres**: `index.html` (Inicio), `actividades.html` y `ficha.html`.
- Encabezado, menú y pie compartidos; la página actual se marca con `aria-current="page"`.
- Cada página tiene su propio `h1`, `title`, `description`, `canonical` y Open Graph.
- `js/app.js` se divide en `inicio.js`, `actividades.js` y `ficha.js`; el modo oscuro pasa a `comun.js`.
### Agregado
- Inicio: sección «Lo más urgente» (3 actividades pendientes con vencimiento más cercano, solo lectura).
- Mi ficha: sección «Acerca de NoSeMePasa».
- Enlace al repositorio en el pie de página.
### Eliminado
- `js/app.js` (reemplazado por los scripts de cada página).

## [1.1.0] - 2026-11-14 · Tarea 10: Publicación Web en GitHub Pages
### Agregado
- Enlace «Saltar al contenido», `favicon.svg` y metadatos SEO (description, canonical, Open Graph, robots, theme-color).
- Módulos `tiempo.js`, `dom.js` y `exportar.js` (una responsabilidad por módulo).
- Estado `aria-pressed` en el botón de modo oscuro y resumen de la gráfica para lectores de pantalla.
### Cambiado
- Paleta con contraste mínimo 4.5:1 en modo claro y oscuro.
- La lista se construye con `textContent` (sin `innerHTML`); el foco del teclado se conserva al redibujar.
- Foco visible con `:focus-visible`, etiquetas reales en filtros y errores con `aria-invalid`.
- Sin desborde horizontal desde 320 px.
- El correo de ejemplo de `datos.js` ahora es genérico.
### Corregido
- Texto de la barra de progreso sobre fondo variable (ahora debajo de la barra).
- Título de actividades completadas con contraste insuficiente.

## [1.0.0] - 2026-11-14 · Tarea 9: Aplicación Web Integrada (HTML + CSS + JS)
### Agregado
- Estructura HTML5 semántica: resumen, formulario de actividades, lista con filtros y ficha personal.
- Estilos con variables CSS, diseño adaptable, animación de entrada y modo oscuro.
- Lógica modular en `js/` (`datos`, `storage`, `ui`, `app`) con `import`/`export`.
- CRUD de actividades con fecha y hora de vencimiento, estados automáticos y validación.
- Persistencia en `localStorage`, exportación a CSV y gráfica SVG por frente.
