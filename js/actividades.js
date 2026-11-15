// actividades.js · Página de actividades: conecta el formulario, la lista y los filtros con la lógica
import { actividadesBase } from './datos.js';
import { cargarActividades, guardarActividades } from './storage.js';
import {
  mostrarMensaje, llenarSelectoresFrente, renderActividades, llenarFormActividad,
  limpiarFormActividad, marcarInvalido, foco, restaurarFoco, confirmarEliminar, limpiarFiltros
} from './ui.js';
import { faltantesActividad } from './validar.js';
import { crearActividad, filtrarYOrdenar } from './logica.js';
import { generarCSV, generarICS } from './exportar.js';
import { iniciarTema } from './tema.js';
import { $, descargarTexto } from './dom.js';

let actividades = cargarActividades(actividadesBase);

/** Redibuja la lista aplicando los filtros, sin que quien usa teclado pierda el foco. */
function dibujarLista(resaltarId = null) {
  const guardado = foco();
  const filtros = { texto: $('#buscar').value, frente: $('#f-frente').value, estado: $('#f-estado').value };
  renderActividades(filtrarYOrdenar(actividades, filtros), actividades.length, resaltarId);
  restaurarFoco(guardado);
}

function persistir(resaltarId = null) {
  if (!guardarActividades(actividades)) {
    mostrarMensaje('No se pudo guardar en este navegador: los cambios se perderán al cerrar.', 'error', '#mensaje-actividad');
  }
  dibujarLista(resaltarId);
}

/* ---------- Crear / editar ---------- */
$('#form-actividad').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const d = new FormData(evento.target);
  const act = crearActividad(Object.fromEntries(d));

  const faltan = faltantesActividad(act);
  for (const campo of ['titulo', 'fecha', 'hora']) marcarInvalido(campo, faltan.some((f) => f.campo === campo));
  if (faltan.length) {
    mostrarMensaje(`Falta completar: ${faltan.map((f) => f.texto).join(', ')}.`, 'error', '#mensaje-actividad');
    evento.target.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  const idx = actividades.findIndex((a) => a.id === act.id);
  if (idx >= 0) {
    act.completada = actividades[idx].completada;
    actividades[idx] = act;
    mostrarMensaje('Actividad actualizada.', 'ok', '#mensaje-actividad');
  } else {
    actividades.push(act);
    mostrarMensaje('Actividad agregada.', 'ok', '#mensaje-actividad');
  }
  persistir(act.id);
  limpiarFormActividad();
});

$('#btn-cancelar').addEventListener('click', () => {
  limpiarFormActividad();
  mostrarMensaje('', 'ok', '#mensaje-actividad');
});

/* ---------- Lista: acciones por delegación de eventos ---------- */
$('#lista').addEventListener('click', (evento) => {
  const control = evento.target.closest('[data-accion]');
  if (!control) return;
  const id = control.closest('.item').dataset.id;
  const act = actividades.find((a) => a.id === id);
  if (!act) return;

  if (control.dataset.accion === 'alternar') {
    act.completada = control.checked;
    persistir();
    mostrarMensaje(`${act.completada ? 'Completada' : 'Pendiente de nuevo'}: ${act.titulo}.`, 'ok', '#mensaje-lista');
  } else if (control.dataset.accion === 'recordar') {
    const nombre = act.titulo.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, '-').replace(/^-|-$/g, '').slice(0, 40) || 'actividad';
    descargarTexto(`recordatorio-${nombre}.ics`, generarICS(act), 'text/calendar;charset=utf-8');
    mostrarMensaje(`Recordatorio descargado: ábrelo para agregarlo a tu calendario (avisa 24 h y 1 h antes).`, 'ok', '#mensaje-lista');
  } else if (control.dataset.accion === 'editar') {
    llenarFormActividad(act);
  } else if (control.dataset.accion === 'eliminar') {
    confirmarEliminar(act.titulo).then((confirmado) => {
      if (!confirmado) return;
      actividades = actividades.filter((a) => a.id !== id);
      persistir();
      $('#t-lista').focus();
      mostrarMensaje(`Actividad eliminada: ${act.titulo}.`, 'ok', '#mensaje-lista');
    });
  }
});

/* ---------- Filtros y exportación ---------- */
$('#btn-limpiar').addEventListener('click', () => {
  limpiarFiltros();
  dibujarLista();
  $('#buscar').focus();
});
['#buscar', '#f-frente', '#f-estado'].forEach((s) => $(s).addEventListener('input', () => dibujarLista()));

$('#btn-csv').addEventListener('click', () => {
  const dia = new Date().toISOString().slice(0, 10);
  descargarTexto(`nosemepasa-actividades-${dia}.csv`, generarCSV(actividades), 'text/csv;charset=utf-8');
});

/* ---------- Arranque ---------- */
iniciarTema();
llenarSelectoresFrente();
limpiarFormActividad(); // deja la fecha de hoy por defecto
dibujarLista();
setInterval(() => dibujarLista(), 60 * 1000); // actualiza «faltan X h» cada minuto
