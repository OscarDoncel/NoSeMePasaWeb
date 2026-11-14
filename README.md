# NoSeMePasa · Agenda de actividades

**Autor:** Oscar Norvey Doncel López
**Curso:** Desarrollo Web · Instituto Técnico Cofrem (ITC)
**Entregables:** Tarea 9 · Aplicación Web Integrada (v1.0.0) y Tarea 10 · Publicación Web en GitHub Pages (v1.1.0 a v1.3.0)

## Enlace público
🔗 **https://oscardoncel.github.io/NoSeMePasaWeb/**

Código: https://github.com/OscarDoncel/NoSeMePasaWeb
**Idea elegida:** Agenda de tareas (nivel básico) con las ampliaciones: modo oscuro con preferencia guardada, exportar a CSV, buscador con filtros combinados y gráfica simple en SVG.

## Las 3 páginas
| Página | Archivo | Qué contiene |
|---|---|---|
| **Inicio** | `index.html` | Presentación, resumen de avance (contadores, barra y gráfica SVG por frente) y las 3 actividades más urgentes |
| **Actividades** | `actividades.html` | Crear, editar, eliminar y completar actividades; filtros combinados; exportar a CSV |
| **Mi ficha** | `ficha.html` | Ficha del estudiante con validación y sección «Acerca de NoSeMePasa» (uso, tecnologías, alcance) |

Las tres comparten encabezado con menú (la página actual se marca con `aria-current`), modo oscuro y los datos guardados en `localStorage`.

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
index.html          Página 1 · Inicio
actividades.html    Página 2 · Actividades
ficha.html          Página 3 · Mi ficha y acerca del proyecto
favicon.svg         Ícono del sitio
assets/             Imagen para compartir el enlace (og-image.jpg) e ícono para iPhone
css/styles.css      Variables, diseño adaptable, animaciones, modo oscuro, impresión
js/datos.js         Datos base (estudianteBase, actividadesBase, FRENTES)
js/validar.js       Reglas para aceptar o descartar datos (fechas reales, horas, frentes)
js/storage.js       Acceso a localStorage; nunca rompe la app si los datos están dañados
js/tiempo.js        Fechas y estados de una actividad (vencida, próxima, etc.)
js/dom.js           Utilidades para buscar y crear elementos con textContent
js/ui.js            Cambios visibles: tarjeta, lista, diálogo, resumen, gráfica SVG, mensajes
js/exportar.js      Generación y descarga del CSV
js/comun.js         Lo que comparten las 3 páginas (modo oscuro)
js/tema-inicial.js  Aplica el tema antes de pintar (evita el destello claro)
js/inicio.js        Conexión de la página Inicio
js/actividades.js   Conexión de la página Actividades: eventos, validación y filtros
js/ficha.js         Conexión de la página Mi ficha
tests/              Pruebas unitarias (node --test)
```

## Accesibilidad, SEO y buenas prácticas (Tarea 10)
Resultado de Lighthouse en cada una de las 3 páginas (móvil, configuración por defecto): **Rendimiento 100 · Accesibilidad 100 · Buenas prácticas 100 · SEO 100**. Además se revisó con axe-core (0 violaciones en modo claro y oscuro) y con prueba de teclado.

| Punto de la lista de revisión | Cómo se cumple |
|---|---|
| Sin errores en consola | Verificado en las 3 páginas, también con la política de seguridad (CSP) activa |
| Rutas relativas | `css/styles.css`, `js/app.js`, `favicon.svg` |
| Un solo `h1` por página, encabezados en orden, elementos semánticos | `h1` → `h2` por sección → `h3` en la tarjeta; `header`, `nav`, `main`, `section`, `article`, `footer` |
| Idioma | `<html lang="es">` |
| Formularios | Todos los campos con `label for`/`id`; errores en texto dentro de `role="status"`, con `aria-invalid` y foco en el campo con error |
| Contraste ≥ 4.5:1 | Paleta recalculada para modo claro y oscuro; el estado se indica con texto, no solo con color |
| Teclado y foco | Todo se usa con Tab, Enter y Espacio; `:focus-visible` con contorno; el foco se conserva al marcar o redibujar la lista |
| «Saltar al contenido» | Primer elemento de la página, lleva a `main` |
| Movimiento y adaptable | `prefers-reduced-motion`; sin scroll horizontal desde 320 px en las 3 páginas; fuentes en `rem` |
| JavaScript | Un módulo por responsabilidad; sin `innerHTML` con datos del usuario (todo con `textContent`); errores de `localStorage` capturados y mostrados |
| Seguridad | CSP en cada página (`script-src 'self'`, sin estilos ni scripts en línea); `textContent` en vez de `innerHTML`; datos guardados validados al leerlos |
| Diálogo accesible | Confirmación de eliminar con `<dialog>` nativo: atrapa el foco, se cierra con Esc y el foco regresa al botón |
| Avisos de estado | Cada acción (agregar, completar, eliminar) se anuncia en una región `role="status"` |
| SEO básico | `title`, `description`, `canonical` y Open Graph propios en cada página, imagen para compartir, datos estructurados JSON-LD, `robots`, `theme-color` |

## Alcance y trabajo futuro
Es un sitio estático, sin servidor. La versión completa de NoSeMePasa (hecha en Softr) incluye registro de usuarios, alertas por correo y datos por usuario; esas funciones quedan como trabajo futuro (versión móvil y con backend).

## Pruebas
Las reglas de fechas, validación, almacenamiento y CSV tienen pruebas unitarias que no necesitan instalar nada (solo Node.js 18 o superior):
```
npm test
```
Cubren, por ejemplo, el límite exacto de 24 horas, fechas inexistentes como 30 de febrero, `localStorage` dañado o lleno y el escape de comillas en el CSV.

## Cómo publicar (GitHub Pages)
1. Repositorio público con `index.html` en la raíz.
2. **Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save**.
3. Para actualizar: `git add .`, `git commit`, `git push` y esperar uno o dos minutos.

## Flujo de trabajo con git
- `main`: siempre contiene la última versión que funciona (la que se entrega).
- Cada taller o mejora se trabaja en una rama (`taller-11`, `mejora-alertas`, …) y se une a `main` al terminar.
- Al cerrar cada taller se crea una etiqueta: `v1.0.0` (Tarea 9), `v1.1.0` (taller 11), etc.
- Los cambios de cada versión se anotan en [`CHANGELOG.md`](CHANGELOG.md).
