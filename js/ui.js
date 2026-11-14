// ui.js · Cambios visibles en la pantalla (sin lógica de datos ni de fechas)
import { FRENTES } from './datos.js';
import { $, crear } from './dom.js';
import { estadoDe, ETIQUETA_ESTADO, textoRestante, formatoFecha } from './tiempo.js';

/* ---------- Mensajes ---------- */
export function mostrarMensaje(texto, tipo = 'ok', selector = '#mensaje') {
  const p = $(selector);
  if (!p) return;
  p.textContent = texto;
  p.className = `mensaje ${texto ? `mensaje--${tipo}` : ''}`;
}

/* ---------- Ficha ---------- */
export function renderTarjeta(ficha, mensaje = '') {
  $('#t-nombre').textContent = ficha.nombre || 'Tu nombre';
  $('#t-programa').textContent = ficha.programa || 'Programa';
  $('#t-correo').textContent = ficha.correo || 'correo@ejemplo.com';
  $('#t-frase').textContent = ficha.frase || 'Tu frase';
  mostrarMensaje(mensaje, 'ok');
}

export function llenarFormFicha(ficha) {
  for (const campo of ['nombre', 'programa', 'correo', 'frase']) {
    $(`#form-ficha [name="${campo}"]`).value = ficha[campo] ?? '';
  }
}

export function marcarCampoFicha(nombre, esInvalido) {
  const campo = $(`#form-ficha [name="${nombre}"]`);
  if (!campo) return;
  campo.setAttribute('aria-invalid', String(esInvalido));
}

/* ---------- Selectores de frente ---------- */
function opciones(select, lista) {
  select.replaceChildren(...lista.map(([valor, texto]) => crear('option', { texto, atributos: { value: valor } })));
}

export function llenarSelectoresFrente() {
  opciones($('#frente'), FRENTES.map((f) => [f, f]));
  opciones($('#f-frente'), [['todos', 'Todos los frentes'], ...FRENTES.map((f) => [f, f])]);
}

/* ---------- Lista de actividades ---------- */
function icono(emoji) {
  return crear('span', { texto: emoji, atributos: { 'aria-hidden': 'true' } });
}

function crearItem(act, ahora) {
  const est = estadoDe(act, ahora);
  const li = crear('li', { clase: `item item--${est}`, datos: { id: act.id, frente: act.frente } });
  li.dataset.frente = act.frente;

  const check = crear('input', {
    clase: 'item__check',
    atributos: { type: 'checkbox', 'aria-label': `Marcar como completada: ${act.titulo}` },
    datos: { accion: 'alternar' }
  });
  check.checked = act.completada;

  const estado = crear('span', {
    clase: `estado estado--${est}`,
    texto: est === 'completada' ? ETIQUETA_ESTADO[est] : `${ETIQUETA_ESTADO[est]} · ${textoRestante(act, ahora)}`
  });
  const fecha = crear('span');
  fecha.append(icono('📅 '), formatoFecha(act));

  const meta = crear('p', { clase: 'item__meta' });
  meta.append(crear('span', { clase: 'etiqueta', texto: act.frente }), fecha, estado);

  const cuerpo = crear('div');
  cuerpo.append(crear('p', { clase: 'item__titulo', texto: act.titulo }), meta);
  if (act.notas) cuerpo.append(crear('p', { clase: 'item__notas', texto: act.notas }));

  const botonEditar = crear('button', {
    clase: 'icono', atributos: { type: 'button', 'aria-label': `Editar: ${act.titulo}` }, datos: { accion: 'editar' }
  });
  botonEditar.append(icono('✏️'));
  const botonEliminar = crear('button', {
    clase: 'icono', atributos: { type: 'button', 'aria-label': `Eliminar: ${act.titulo}` }, datos: { accion: 'eliminar' }
  });
  botonEliminar.append(icono('🗑️'));
  const acciones = crear('div', { clase: 'item__acciones' });
  acciones.append(botonEditar, botonEliminar);

  li.append(check, cuerpo, acciones);
  return li;
}

export function renderActividades(lista) {
  const ahora = new Date();
  $('#lista').replaceChildren(...lista.map((a) => crearItem(a, ahora)));
  $('#vacio').hidden = lista.length > 0;
}

/** Devuelve qué elemento de la lista tiene el foco, para devolvérselo tras redibujar. */
export function foco() {
  const activo = document.activeElement;
  const item = activo?.closest?.('#lista .item');
  if (!item) return null;
  return { id: item.dataset.id, accion: activo.dataset.accion };
}

export function restaurarFoco(guardado) {
  if (!guardado) return;
  const destino =
    $(`#lista [data-id="${CSS.escape(guardado.id)}"] [data-accion="${guardado.accion}"]`) || $('#t-lista');
  destino?.focus();
}

/* ---------- Resumen y gráfica ---------- */
export function renderResumen(todas) {
  const ahora = new Date();
  const hechas = todas.filter((a) => a.completada).length;
  const vencidas = todas.filter((a) => estadoDe(a, ahora) === 'vencida').length;
  const proximas = todas.filter((a) => estadoDe(a, ahora) === 'proxima').length;
  const pct = todas.length ? Math.round((hechas / todas.length) * 100) : 0;

  $('#r-total').textContent = todas.length;
  $('#r-hechas').textContent = hechas;
  $('#r-proximas').textContent = proximas;
  $('#r-vencidas').textContent = vencidas;
  $('#barra').style.width = `${pct}%`;
  $('#barra-txt').textContent = `${pct} % completado`;
  $('.progreso').setAttribute('aria-valuenow', pct);
  renderGrafica(todas);
}

const NS = 'http://www.w3.org/2000/svg';
function svg(etiqueta, atributos = {}, texto) {
  const el = document.createElementNS(NS, etiqueta);
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
  if (texto !== undefined) el.textContent = texto;
  return el;
}

function renderGrafica(todas) {
  const grafica = $('#grafica');
  const maxTotal = Math.max(1, ...FRENTES.map((f) => todas.filter((a) => a.frente === f).length));
  const anchoMax = 250;
  const resumen = [];
  const partes = FRENTES.flatMap((f, i) => {
    const total = todas.filter((a) => a.frente === f).length;
    const hechas = todas.filter((a) => a.frente === f && a.completada).length;
    const y = 12 + i * 30;
    const color = `fill:var(--f-${f})`;
    resumen.push(`${f}: ${hechas} de ${total}`);
    return [
      svg('text', { x: 0, y: y + 14 }, f),
      svg('rect', { x: 70, y, width: anchoMax, height: 20, rx: 5, fill: 'currentColor', opacity: '.08' }),
      svg('rect', { x: 70, y, width: (total / maxTotal) * anchoMax, height: 20, rx: 5, style: color, opacity: '.35' }),
      svg('rect', { x: 70, y, width: (hechas / maxTotal) * anchoMax, height: 20, rx: 5, style: color }),
      svg('text', { x: 78 + anchoMax, y: y + 14 }, `${hechas}/${total}`)
    ];
  });
  grafica.replaceChildren(...partes);
  grafica.setAttribute('aria-label', `Actividades completadas por frente. ${resumen.join('; ')}.`);
}

/* ---------- Formulario de actividad ---------- */
export function llenarFormActividad(act) {
  const f = $('#form-actividad');
  f.elements.id.value = act.id;
  f.elements.titulo.value = act.titulo;
  f.elements.frente.value = act.frente;
  f.elements.fecha.value = act.fecha;
  f.elements.hora.value = act.hora;
  f.elements.notas.value = act.notas || '';
  $('#btn-guardar').textContent = 'Guardar cambios';
  $('#btn-cancelar').hidden = false;
  $('#t-nueva').textContent = 'Editar actividad';
  f.scrollIntoView({ behavior: 'smooth', block: 'center' });
  f.elements.titulo.focus();
}

export function limpiarFormActividad() {
  const f = $('#form-actividad');
  f.reset();
  f.elements.id.value = '';
  f.elements.hora.value = '23:59';
  $('#btn-guardar').textContent = 'Agregar actividad';
  $('#btn-cancelar').hidden = true;
  $('#t-nueva').textContent = 'Nueva actividad';
  f.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
}

export function marcarInvalido(nombre, esInvalido) {
  const campo = $('#form-actividad').elements[nombre];
  if (!campo) return;
  if (esInvalido) campo.setAttribute('aria-invalid', 'true');
  else campo.removeAttribute('aria-invalid');
}

/* ---------- Tema ---------- */
export function aplicarTema(tema) {
  if (tema === 'oscuro') document.documentElement.dataset.tema = 'oscuro';
  else delete document.documentElement.dataset.tema;
  const boton = $('#btn-tema');
  boton.setAttribute('aria-pressed', String(tema === 'oscuro'));
}
