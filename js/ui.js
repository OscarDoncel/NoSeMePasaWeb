// ui.js · Cambios visibles en la pantalla
import { FRENTES } from './datos.js';

const $ = (selector) => document.querySelector(selector);
const COLORES = {
  ITC: '#3b5bdb', UCC: '#0c8599', CUN: '#9c36b5', Trabajo: '#e8590c', Personal: '#2f9e44'
};

/* ---------- Utilidades de tiempo ---------- */
export function vencimiento(act) {
  return new Date(`${act.fecha}T${act.hora || '23:59'}`);
}

export function estadoDe(act, ahora = new Date()) {
  if (act.completada) return 'completada';
  const diff = vencimiento(act) - ahora;
  if (diff < 0) return 'vencida';
  if (diff <= 24 * 60 * 60 * 1000) return 'proxima';
  return 'pendiente';
}

function textoRestante(act, ahora = new Date()) {
  const diff = vencimiento(act) - ahora;
  const abs = Math.abs(diff);
  const min = Math.floor(abs / 60000);
  const h = Math.floor(min / 60);
  const d = Math.floor(h / 24);
  let t;
  if (d >= 1) t = `${d} d ${h % 24} h`;
  else if (h >= 1) t = `${h} h ${min % 60} min`;
  else t = `${min} min`;
  return diff < 0 ? `venció hace ${t}` : `faltan ${t}`;
}

function formatoFecha(act) {
  return vencimiento(act).toLocaleString('es-CO', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

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

/* ---------- Selectores de frente ---------- */
export function llenarSelectoresFrente() {
  $('#frente').innerHTML = FRENTES.map((f) => `<option value="${f}">${f}</option>`).join('');
  $('#f-frente').innerHTML =
    '<option value="todos">Todos los frentes</option>' +
    FRENTES.map((f) => `<option value="${f}">${f}</option>`).join('');
}

/* ---------- Lista de actividades ---------- */
function escapar(texto) {
  const d = document.createElement('div');
  d.textContent = texto ?? '';
  return d.innerHTML;
}

export function renderActividades(lista) {
  const ul = $('#lista');
  const ahora = new Date();
  ul.innerHTML = lista.map((a) => {
    const est = estadoDe(a, ahora);
    const etiquetaEstado = {
      completada: '✔ Completada', vencida: '⚠ Vencida', proxima: '⏳ Próxima', pendiente: 'Pendiente'
    }[est];
    return `
      <li class="item item--${est}" data-id="${a.id}" style="--color-frente:${COLORES[a.frente] || '#3b5bdb'}">
        <input class="item__check" type="checkbox" data-accion="alternar" ${a.completada ? 'checked' : ''} aria-label="Marcar como completada: ${escapar(a.titulo)}">
        <div>
          <p class="item__titulo">${escapar(a.titulo)}</p>
          <p class="item__meta">
            <span class="etiqueta">${escapar(a.frente)}</span>
            <span>📅 ${formatoFecha(a)}</span>
            <span class="estado estado--${est}">${etiquetaEstado}${est === 'completada' ? '' : ' · ' + textoRestante(a, ahora)}</span>
          </p>
          ${a.notas ? `<p class="item__notas">${escapar(a.notas)}</p>` : ''}
        </div>
        <div class="item__acciones">
          <button class="icono" type="button" data-accion="editar" aria-label="Editar">✏️</button>
          <button class="icono" type="button" data-accion="eliminar" aria-label="Eliminar">🗑️</button>
        </div>
      </li>`;
  }).join('');
  $('#vacio').hidden = lista.length > 0;
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
  document.querySelector('.progreso').setAttribute('aria-valuenow', pct);

  renderGrafica(todas);
}

function renderGrafica(todas) {
  const svg = $('#grafica');
  const maxTotal = Math.max(1, ...FRENTES.map((f) => todas.filter((a) => a.frente === f).length));
  const anchoMax = 250;
  const filas = FRENTES.map((f, i) => {
    const total = todas.filter((a) => a.frente === f).length;
    const hechas = todas.filter((a) => a.frente === f && a.completada).length;
    const y = 12 + i * 30;
    const wTotal = (total / maxTotal) * anchoMax;
    const wHechas = (hechas / maxTotal) * anchoMax;
    return `
      <text x="0" y="${y + 14}">${f}</text>
      <rect x="70" y="${y}" width="${anchoMax}" height="20" rx="5" fill="currentColor" opacity=".08"></rect>
      <rect x="70" y="${y}" width="${wTotal}" height="20" rx="5" fill="${COLORES[f]}" opacity=".35"></rect>
      <rect x="70" y="${y}" width="${wHechas}" height="20" rx="5" fill="${COLORES[f]}"></rect>
      <text x="${78 + anchoMax}" y="${y + 14}">${hechas}/${total}</text>`;
  }).join('');
  svg.innerHTML = filas;
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
  f.querySelectorAll('.invalido').forEach((e) => e.classList.remove('invalido'));
}

export function marcarInvalido(nombre, esInvalido) {
  const campo = $('#form-actividad').elements[nombre];
  if (campo) campo.classList.toggle('invalido', esInvalido);
}

/* ---------- Tema ---------- */
export function aplicarTema(tema) {
  if (tema === 'oscuro') document.documentElement.dataset.tema = 'oscuro';
  else delete document.documentElement.dataset.tema;
}
