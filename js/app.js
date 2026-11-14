// app.js · La conexión: escucha los eventos y llama a las demás funciones
import { estudianteBase, actividadesBase } from './datos.js';
import {
  cargarFicha, guardarFicha, cargarActividades, guardarActividades, cargarTema, guardarTema
} from './storage.js';
import {
  renderTarjeta, llenarFormFicha, marcarCampoFicha, mostrarMensaje, llenarSelectoresFrente,
  renderActividades, renderResumen, llenarFormActividad, limpiarFormActividad,
  marcarInvalido, aplicarTema, foco, restaurarFoco
} from './ui.js';
import { estadoDe, vencimiento } from './tiempo.js';
import { descargarCSV } from './exportar.js';
import { $ } from './dom.js';

/* ---------- Estado ---------- */
let ficha = cargarFicha(estudianteBase);
let actividades = cargarActividades(actividadesBase);
let tema = cargarTema() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro');

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
  renderActividades(filtradas());
  restaurarFoco(guardado);
}

function refrescar() {
  dibujarLista();
  renderResumen(actividades);
}

function persistir() {
  if (!guardarActividades(actividades)) {
    mostrarMensaje('No se pudo guardar en este navegador: los cambios se perderán al cerrar.', 'error', '#mensaje-actividad');
  }
  refrescar();
}

/* ---------- Ficha ---------- */
$('#form-ficha').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const datos = new FormData(evento.target);
  const nombre = datos.get('nombre').trim();
  marcarCampoFicha('nombre', !nombre);
  if (!nombre) {
    mostrarMensaje('El nombre es obligatorio.', 'error');
    $('#nombre').focus();
    return;
  }
  ficha = {
    ...ficha,
    nombre,
    programa: datos.get('programa').trim(),
    correo: datos.get('correo').trim(),
    frase: datos.get('frase').trim()
  };
  if (guardarFicha(ficha)) renderTarjeta(ficha, 'Ficha guardada.');
  else {
    renderTarjeta(ficha);
    mostrarMensaje('No se pudo guardar la ficha en este navegador.', 'error');
  }
});

/* ---------- Actividades: crear / editar ---------- */
$('#form-actividad').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const d = new FormData(evento.target);
  const act = {
    id: d.get('id') || crypto.randomUUID(),
    titulo: d.get('titulo').trim(),
    frente: d.get('frente'),
    fecha: d.get('fecha'),
    hora: d.get('hora'),
    notas: d.get('notas').trim(),
    completada: false
  };

  const faltan = [['titulo', 'el título'], ['fecha', 'la fecha'], ['hora', 'la hora']].filter(([campo]) => !act[campo]);
  for (const campo of ['titulo', 'fecha', 'hora']) marcarInvalido(campo, !act[campo]);
  if (faltan.length) {
    mostrarMensaje(`Falta completar: ${faltan.map(([, t]) => t).join(', ')}.`, 'error', '#mensaje-actividad');
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
  } else if (control.dataset.accion === 'editar') {
    llenarFormActividad(act);
  } else if (control.dataset.accion === 'eliminar') {
    if (confirm(`¿Eliminar «${act.titulo}»?`)) {
      actividades = actividades.filter((a) => a.id !== id);
      persistir();
      $('#t-lista').focus();
    }
  }
});

/* ---------- Filtros ---------- */
['#buscar', '#f-frente', '#f-estado'].forEach((s) => $(s).addEventListener('input', dibujarLista));

/* ---------- Exportar CSV ---------- */
$('#btn-csv').addEventListener('click', () => descargarCSV(actividades));

/* ---------- Tema ---------- */
$('#btn-tema').addEventListener('click', () => {
  tema = tema === 'oscuro' ? 'claro' : 'oscuro';
  aplicarTema(tema);
  guardarTema(tema);
});

/* ---------- Inicio ---------- */
aplicarTema(tema);
llenarSelectoresFrente();
llenarFormFicha(ficha);
renderTarjeta(ficha);
refrescar();
setInterval(refrescar, 60 * 1000); // actualiza «faltan X h» cada minuto
