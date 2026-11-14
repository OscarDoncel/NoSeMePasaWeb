# NoSeMePasa · Agenda de actividades

**Autor:** Oscar Norvey Doncel López
**Curso:** Desarrollo Web · Instituto Técnico Cofrem (ITC) · Sesión 10 (proyecto final integrado)
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
css/styles.css      Variables, diseño adaptable (grid/flex), animaciones, modo oscuro
js/datos.js         Datos base (estudianteBase, actividadesBase, FRENTES)
js/storage.js       Acceso a localStorage (guardar/cargar ficha, actividades, tema)
js/ui.js            Cambios visibles: tarjeta, lista, resumen, gráfica SVG, mensajes
js/app.js           Conexión: eventos, validación, filtros, exportar CSV
```

## Alcance y trabajo futuro
Es un sitio estático, sin servidor. La versión completa de NoSeMePasa (hecha en Softr) incluye registro de usuarios, alertas por correo y datos por usuario; esas funciones quedan como trabajo futuro (versión móvil y con backend).

## Flujo de trabajo con git
- `main`: siempre contiene la última versión que funciona (la que se entrega).
- Cada taller o mejora se trabaja en una rama (`taller-11`, `mejora-alertas`, …) y se une a `main` al terminar.
- Al cerrar cada taller se crea una etiqueta: `v1.0.0` (taller 10), `v1.1.0` (taller 11), etc.
- Los cambios de cada versión se anotan en [`CHANGELOG.md`](CHANGELOG.md).
