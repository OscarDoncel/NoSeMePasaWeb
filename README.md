# NoSeMePasa · Agenda de actividades

**Autor:** Oscar Norvey Doncel López
**Curso:** Desarrollo Web · Instituto Técnico Cofrem (ITC)
**Entregables:** Tarea 9 · Aplicación Web Integrada (v1.0.0) y Tarea 10 · Publicación Web en GitHub Pages (v1.1.0)

## Enlace público
🔗 **https://oscardoncel.github.io/NoSeMePasaWeb/**

Código: https://github.com/OscarDoncel/NoSeMePasaWeb
**Idea elegida:** Agenda de tareas (nivel básico) con las ampliaciones: modo oscuro con preferencia guardada, exportar a CSV, buscador con filtros combinados y gráfica simple en SVG.

## ¿Qué hace?
Organiza actividades académicas (ITC, UCC, CUN), laborales y personales con **fecha y hora de vencimiento**:
- Crear, editar, eliminar y marcar actividades como completadas.
- Estados automáticos: pendiente, vence en 24 h, vencida y completada, con el tiempo restante.
- Filtros combinados por frente, estado y texto.
- Resumen de avance: contadores, barra de progreso y gráfica SVG por frente.
- Ficha personal (nombre, programa, correo, frase) con validación.
- Los datos quedan guardados en el navegador (`localStorage`).

## Cómo ejecutarlo
Los módulos de JavaScript (`import`/`export`) **solo funcionan con un servidor local**:
1. Abre la carpeta en VS Code.
2. Clic derecho en `index.html` → **Open with Live Server**.
3. (No abras `index.html` con doble clic: la consola mostraría un error de módulos.)

## Estructura
```
index.html          Estructura semántica (header, nav, main, section, article, form, footer)
favicon.svg         Ícono del sitio
css/styles.css      Variables, diseño adaptable (grid/flex), animaciones, modo oscuro
js/datos.js         Datos base (estudianteBase, actividadesBase, FRENTES)
js/storage.js       Acceso a localStorage (guardar/cargar ficha, actividades, tema)
js/tiempo.js        Fechas y estados de una actividad (vencida, próxima, etc.)
js/dom.js           Utilidades para buscar y crear elementos con textContent
js/ui.js            Cambios visibles: tarjeta, lista, resumen, gráfica SVG, mensajes
js/exportar.js      Generación y descarga del CSV
js/app.js           Conexión: eventos, validación y filtros
```

## Accesibilidad, SEO y buenas prácticas (Tarea 10)
Resultado de Lighthouse sobre la versión local (móvil, configuración por defecto): **Rendimiento 100 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100**. Además se revisó con axe-core (0 violaciones en modo claro y oscuro) y con prueba de teclado.

| Punto de la lista de revisión | Cómo se cumple |
|---|---|
| Sin errores en consola | Verificado; el favicon se declara con `favicon.svg` para evitar el 404 |
| Rutas relativas | `css/styles.css`, `js/app.js`, `favicon.svg` |
| Un solo `h1`, encabezados en orden, elementos semánticos | `h1` → `h2` por sección → `h3` en la tarjeta; `header`, `nav`, `main`, `section`, `article`, `footer` |
| Idioma | `<html lang="es">` |
| Formularios | Todos los campos con `label for`/`id`; errores en texto dentro de `role="status"`, con `aria-invalid` y foco en el campo con error |
| Contraste ≥ 4.5:1 | Paleta recalculada para modo claro y oscuro; el estado se indica con texto, no solo con color |
| Teclado y foco | Todo se usa con Tab, Enter y Espacio; `:focus-visible` con contorno; el foco se conserva al marcar o redibujar la lista |
| «Saltar al contenido» | Primer elemento de la página, lleva a `main` |
| Movimiento y adaptable | `prefers-reduced-motion`; sin scroll horizontal desde 320 px; fuentes en `rem` |
| JavaScript | Un módulo por responsabilidad; sin `innerHTML` con datos del usuario (todo con `textContent`); errores de `localStorage` capturados y mostrados |
| SEO básico | `title`, `description`, `canonical`, Open Graph, `robots`, `theme-color` |

## Alcance y trabajo futuro
Es un sitio estático, sin servidor. La versión completa de NoSeMePasa (hecha en Softr) incluye registro de usuarios, alertas por correo y datos por usuario; esas funciones quedan como trabajo futuro (versión móvil y con backend).

## Cómo publicar (GitHub Pages)
1. Repositorio público con `index.html` en la raíz.
2. **Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save**.
3. Para actualizar: `git add .`, `git commit`, `git push` y esperar uno o dos minutos.

## Flujo de trabajo con git
- `main`: siempre contiene la última versión que funciona (la que se entrega).
- Cada taller o mejora se trabaja en una rama (`taller-11`, `mejora-alertas`, …) y se une a `main` al terminar.
- Al cerrar cada taller se crea una etiqueta: `v1.0.0` (Tarea 9), `v1.1.0` (taller 11), etc.
- Los cambios de cada versión se anotan en [`CHANGELOG.md`](CHANGELOG.md).
