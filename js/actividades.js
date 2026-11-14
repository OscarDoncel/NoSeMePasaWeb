// actividades.js · Página de actividades: crear, editar, filtrar y exportar
import { actividadesBase } from './datos.js';
import { cargarActividades, guardarActividades } from './storage.js';
import {
  mostrarMensaje, llenarSelectoresFrente, renderActividades, llenarFormActividad,
  limpiarFormActividad, marcarInvalido, foco, restaurarFoco, confirmarEliminar, limpiarFiltros
} from './ui.js';
import { esFechaValida, esHoraValida, nuevoId } from './validar.js';
import { estadoDe, vencimiento } from './tiempo.js';
import { descargarCSV } from './exportar.js';
import { iniciarTema } from './comun.js';
import { $ } from './dom.js';

/* ---------- Estado ---------- */
let actividades = cargarActividades(actividadesBase);

/* ---------- Render general ---------- */
function filtradas() {
  const texto = $('#buscar').value.trim().toLowerCase();
  const frente = $('#f-frente').value;
  const estado = $('#f-estado').value;
  const ahora = new Date();

  return actividades
    .filter((a) => frente === 'todos' || a.frente === frente)
    .filter((a) => !texto || `${a.titulo} ${a.notas || ''}`.toLowerCase().includes(texto))
    .filter((a) => {
      const e = estadoDe(a, ahora);
      if (estado === 'todas') return true;
      if (estado === 'pendientes') return e === 'pendiente' || e === 'proxima';
      if (estado === 'proximas') return e === 'proxima';
      if (estado === 'vencidas') return e === 'vencida';
      return e === 'completada';
    })
    .sort((a, b) => Number(a.completada) - Number(b.completada) || vencimiento(a) - vencimiento(b));
}

/** Redibuja la lista sin que quien usa teclado pierda el foco. */
function dibujarLista() {
  const guardado = foco();
  renderActividades(filtradas(), actividades.length);
  restaurarFoco(guardado);
}

function persistir() {
  if (!guardarActividades(actividades)) {
    mostrarMensaje('No se pudo guardar en este navegador: los cambios se perderán al cerrar.', 'error', '#mensaje-actividad');
  }
  dibujarLista();
}

/* ---------- Actividades: crear / editar ---------- */
$('#form-actividad').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const d = new FormData(evento.target);
  const act = {
    id: d.get('id') || nuevoId(),
    titulo: d.get('titulo').trim(),
    frente: d.get('frente'),
    fecha: d.get('fecha'),
    hora: d.get('hora'),
    notas: d.get('notas').trim(),
    completada: false
  };

  const reglas = [
    ['titulo', 'el título', Boolean(act.titulo)],
    ['fecha', 'una fecha válida', esFechaValida(act.fecha)],
    ['hora', 'una hora válida', esHoraValida(act.hora)]
  ];
  for (const [campo, , ok] of reglas) marcarInvalido(campo, !ok);
  const faltan = reglas.filter(([, , ok]) => !ok).map(([, texto]) => texto);
  if (faltan.length) {
    mostrarMensaje(`Falta completar: ${faltan.join(', ')}.`, 'error', '#mensaje-actividad');
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
  persistir();
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

$('#btn-limpiar').addEventListener('click', () => {
  limpiarFiltros();
  dibujarLista();
  $('#buscar').focus();
});

/* ---------- Filtros ---------- */
['#buscar', '#f-frente', '#f-estado'].forEach((s) => $(s).addEventListener('input', dibujarLista));

/* ---------- Exportar CSV ---------- */
$('#btn-csv').addEventListener('click', () => descargarCSV(actividades));

/* ---------- Inicio ---------- */
iniciarTema();
llenarSelectoresFrente();
limpiarFormActividad(); // deja la fecha de hoy por defecto
dibujarLista();
setInterval(dibujarLista, 60 * 1000); // actualiza «faltan X h» cada minuto
