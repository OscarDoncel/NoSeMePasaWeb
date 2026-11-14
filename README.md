# NoSeMePasa · Agenda de actividades

**Estudiante:** Oscar Norvey Doncel López · **Programa:** Desarrollo de Software · Instituto Técnico Cofrem (ITC)
**Entrega:** Evaluación final · Proyecto integrador de sitio web (versión 1.4.0)

## Descripción
NoSeMePasa es un sitio web de tres páginas para organizar las actividades académicas (ITC, UCC, CUN), laborales y personales con fecha y hora de vencimiento. Cada actividad muestra cuánto tiempo falta y su estado (pendiente, vence en 24 h, vencida o completada), y el inicio resume el avance con contadores y una gráfica. Todo funciona con HTML, CSS y JavaScript puros, y los datos se guardan en el navegador con `localStorage`.

## Enlace público
🔗 **https://oscardoncel.github.io/NoSeMePasaWeb/**
Código: https://github.com/OscarDoncel/NoSeMePasaWeb

## Cómo ejecutarlo en local (Live Server)
Los módulos de JavaScript (`import`/`export`) **solo funcionan con un servidor local**, por eso no basta con abrir el archivo con doble clic:
1. Descomprime el ZIP y abre la carpeta en VS Code.
2. Instala la extensión **Live Server** (si no la tienes).
3. Clic derecho sobre `index.html` → **Open with Live Server**.

## Las 3 páginas
| Página | Archivo | Qué contiene |
|---|---|---|
| **Inicio** | `index.html` | Presentación, resumen de avance (contadores, barra y gráfica SVG por frente) y las 3 actividades más urgentes |
| **Actividades** | `actividades.html` | Crear, editar, eliminar y completar actividades; filtros combinados; exportar a CSV |
| **Mi ficha** | `ficha.html` | Ficha del estudiante con validación y sección «Acerca de NoSeMePasa» |

Las tres comparten encabezado con menú (la página actual se marca con `aria-current`), modo oscuro y los mismos datos guardados.

## Funciones: completas y pendientes
| Función | Estado | Detalle |
|---|---|---|
| Crear, editar, eliminar y completar actividades | ✅ Completa | Con confirmación accesible al eliminar y aviso de cada acción |
| Estados automáticos y tiempo restante | ✅ Completa | Se actualiza cada minuto |
| Filtros combinados (texto + frente + estado) | ✅ Completa | Con mensaje distinto para «no hay nada» y «sin resultados» |
| Resumen de avance y gráfica por frente | ✅ Completa | La gráfica SVG tiene versión en texto para lectores de pantalla |
| Ficha del estudiante con validación | ✅ Completa | Nombre obligatorio y correo con formato válido, con mensajes en texto |
| Datos persistentes (`localStorage`) | ✅ Completa | Se validan al leerlos; si están dañados la app no se rompe |
| Modo claro / oscuro | ✅ Completa | Recuerda la preferencia y respeta la del sistema |
| Exportar a CSV | ✅ Completa | Abre bien en Excel (tildes) |
| Registro e inicio de sesión de usuarios | ⏳ Pendiente | Requiere servidor y base de datos; el sitio es estático |
| Alertas por correo o notificaciones | ⏳ Pendiente | Requiere servidor; la versión Softr de NoSeMePasa sí las tiene |
| Sincronizar entre dispositivos | ⏳ Pendiente | `localStorage` guarda solo en el navegador donde se usa |
| Adjuntar archivos a una actividad | ⏳ Pendiente | Fuera del alcance de un sitio sin servidor |

## Mapa de módulos (`js/`)
Cada archivo tiene una sola responsabilidad. Las páginas cargan su script con `<script type="module">`.
| Archivo | Responsabilidad | Exporta |
|---|---|---|
| `datos.js` | Datos iniciales | `FRENTES`, `estudianteBase`, `actividadesBase` |
| `validar.js` | Reglas para aceptar o rechazar datos | `esFechaValida`, `esHoraValida`, `esCorreoValido`, `faltantesActividad`, `normalizarActividad`, `normalizarFicha` |
| `storage.js` | Único lugar que toca `localStorage` | `cargar/guardarFicha`, `cargar/guardarActividades`, `cargar/guardarTema` |
| `tiempo.js` | Fechas y estado de una actividad | `estadoDe`, `textoRestante`, `formatoFecha`, `vencimiento`, `fechaHoy` |
| `logica.js` | Reglas de negocio sin DOM | `crearActividad`, `filtrarYOrdenar`, `masUrgentes`, `contarPorEstado`, `nuevoId` |
| `exportar.js` | Convierte las actividades en texto CSV | `generarCSV` |
| `dom.js` | Utilidades del navegador | `$`, `crear`, `descargarTexto` |
| `ui.js` | Lo que se ve: tarjeta, lista, diálogo, resumen, formularios, mensajes | `renderActividades`, `renderResumen`, `renderUrgentes`, `confirmarEliminar`, … |
| `grafica.js` | Gráfica SVG por frente | `renderGrafica` |
| `tema.js` | Aplica, cambia y recuerda el modo claro/oscuro | `iniciarTema` |
| `tema-inicial.js` | Aplica el tema antes de pintar (evita el destello claro); no es módulo | — |
| `inicio.js`, `actividades.js`, `ficha.js` | Conectan cada página con los módulos de arriba (eventos) | — |

Si mañana los datos fueran a un servidor en vez de `localStorage`, solo habría que cambiar `storage.js`.

## Estructura de carpetas
```
index.html · actividades.html · ficha.html   Las 3 páginas
favicon.svg                                  Ícono del sitio
assets/                                      og-image.jpg (vista previa al compartir) y apple-touch-icon.png
css/styles.css                               Variables, diseño adaptable, modo oscuro, animaciones, impresión
js/                                          Módulos (ver mapa)
tests/                                       Pruebas unitarias (opcional, ver abajo)
package.json                                 Solo define el comando `npm test`
```

## Criterios de la evaluación y dónde se cumplen
| Criterio | Evidencia en el proyecto |
|---|---|
| Estructura HTML semántica | `header`, `nav`, `main`, `section`, `article`, `footer`; un `h1` por página y encabezados en orden |
| Estilos y diseño adaptable | `css/styles.css` con variables, rejilla y `@media`; sin desbordes desde 320 px |
| Accesibilidad | Contraste ≥ 4.5:1 (tabla abajo), `label` en cada campo, foco visible, «Saltar al contenido», `aria-current`, mensajes en `role="status"`, `<dialog>` nativo |
| Animación con propósito | Resaltado de la actividad recién agregada o editada, y entrada suave al cambiar de página; ambas se desactivan con `prefers-reduced-motion` |
| JavaScript modular | 12 módulos de una responsabilidad (mapa arriba), `type="module"` |
| Validación de formularios | Título, fecha y hora de la actividad; nombre y correo de la ficha; errores en texto con `aria-invalid` y foco en el campo |
| Persistencia | `localStorage` con `JSON.stringify` / `JSON.parse` y manejo de errores |
| Sin errores en consola | Verificado en las 3 páginas con la política de seguridad activa |
| Publicación | GitHub Pages (enlace arriba) |

### Contraste (fórmula WCAG; mínimo exigido 4.5:1)
| Modo claro | Colores | Contraste |
|---|---|---|
| Texto principal | `#1c2434` sobre `#f4f6fb` | 14.4:1 |
| Texto secundario | `#566074` sobre `#ffffff` | 6.3:1 |
| Botón primario | `#ffffff` sobre `#3b5bdb` | 5.7:1 |
| Estado completada | `#1b7535` sobre `#ffffff` | 5.8:1 |
| Estado próxima | `#8f5200` sobre `#ffffff` | 6.2:1 |
| Estado vencida | `#c0182a` sobre `#ffffff` | 6.2:1 |
| Etiquetas ITC / UCC / CUN / Trabajo / Personal | blanco sobre cada color | 5.7 / 5.6 / 5.8 / 5.8 / 5.3:1 |

| Modo oscuro | Colores | Contraste |
|---|---|---|
| Texto principal | `#e7ebf5` sobre `#1a2133` | 13.4:1 |
| Texto secundario | `#aab4cc` sobre `#1a2133` | 7.7:1 |
| Botón primario | `#0f1420` sobre `#748ffc` | 6.2:1 |
| Estados completada / próxima / vencida | `#51cf66` / `#ffa94d` / `#ff8787` sobre `#1a2133` | 8.0 / 8.4 / 6.9:1 |

Además se comprobó con Lighthouse (Rendimiento, Accesibilidad, Buenas prácticas y SEO en 100 en las 3 páginas) y con axe-core (0 violaciones en modo claro y oscuro). El estado de una actividad siempre se indica también con texto, no solo con color.

## Pruebas (opcional)
Con Node.js 18 o superior y sin instalar nada: `npm test`. Son 32 pruebas unitarias de las reglas de fechas, validación, filtros, almacenamiento y CSV. La página no las necesita para funcionar.

## Publicar una actualización (GitHub Pages)
`git add .` → `git commit -m "mensaje"` → `git push`, y esperar uno o dos minutos. Los cambios de cada versión están en [`CHANGELOG.md`](CHANGELOG.md).
