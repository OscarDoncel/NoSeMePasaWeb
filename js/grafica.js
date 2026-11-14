// grafica.js · Dibuja la gráfica SVG de actividades por frente
import { FRENTES } from './datos.js';
import { $ } from './dom.js';

const NS = 'http://www.w3.org/2000/svg';

function svg(etiqueta, atributos = {}, texto) {
  const el = document.createElementNS(NS, etiqueta);
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
  if (texto !== undefined) el.textContent = texto;
  return el;
}

export function renderGrafica(todas) {
  const grafica = $('#grafica');
  const maxTotal = Math.max(1, ...FRENTES.map((f) => todas.filter((a) => a.frente === f).length));
  const anchoMax = 190;
  const resumen = [];
  const partes = FRENTES.flatMap((f, i) => {
    const total = todas.filter((a) => a.frente === f).length;
    const hechas = todas.filter((a) => a.frente === f && a.completada).length;
    const y = 8 + i * 32;
    resumen.push(`${f}: ${hechas} de ${total}`);
    return [
      svg('text', { x: 0, y: y + 16 }, f),
      svg('rect', { class: 'barra-fondo', x: 62, y, width: anchoMax, height: 22, rx: 5 }),
      svg('rect', { class: `barra-total f-${f}`, x: 62, y, width: (total / maxTotal) * anchoMax, height: 22, rx: 5 }),
      svg('rect', { class: `barra-hechas f-${f}`, x: 62, y, width: (hechas / maxTotal) * anchoMax, height: 22, rx: 5 }),
      svg('text', { x: 62 + anchoMax + 8, y: y + 16 }, `${hechas}/${total}`)
    ];
  });
  grafica.replaceChildren(...partes);
  // Los lectores de pantalla no ven el dibujo: reciben los mismos datos como texto
  grafica.setAttribute('aria-label', `Actividades completadas por frente. ${resumen.join('; ')}.`);
}
