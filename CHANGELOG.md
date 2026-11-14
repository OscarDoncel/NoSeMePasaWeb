# Historial de cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Cada taller cierra con una versión y una etiqueta (tag) en git.

## [Sin publicar]
### Ideas para el próximo taller
- (Anota aquí las mejoras que pida el docente)

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
