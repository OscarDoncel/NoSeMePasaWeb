// app.js · La conexión: escucha los eventos y llama a las demás funciones
import { estudianteBase, actividadesBase } from './datos.js';
import {
  cargarFicha, guardarFicha, cargarActividades, guardarActividades, cargarTema, guardarTema
} from './storage.js';
import {
  renderTarjeta, llenarFormFicha, mostrarMensaje, llenarSelectoresFrente,
  renderActividades, renderResumen, llenarFormActividad, limpiarFormActividad,
  marcarInvalido, aplicarTema, estadoDe, vencimiento
} from './ui.js';

const $ = (s) => document.querySelector(s);

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

function refrescar() {
  renderActividades(filtradas());
  renderResumen(actividades);
}

function persistir() {
  if (!guardarActividades(actividades)) {
    mostrarMensaje('No se pudo guardar en este navegador.', 'error', '#mensaje-actividad');
  }
  refrescar();
}

/* ---------- Ficha ---------- */
$('#form-ficha').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const datos = new FormData(evento.target);
  const nombre = datos.get('nombre').trim();
  if (!nombre) {
    mostrarMensaje('El nombre no puede estar vacío.', 'error');
    return;
  }
  ficha = {
    ...ficha,
    nombre,
    programa: datos.get('programa').trim(),
    correo: datos.get('correo').trim(),
    frase: datos.get('frase').trim()
  };
  guardarFicha(ficha);
  renderTarjeta(ficha, 'Ficha guardada ✔');
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

  const errores = [];
  const invalidos = { titulo: !act.titulo, fecha: !act.fecha, hora: !act.hora };
  for (const [campo, malo] of Object.entries(invalidos)) marcarInvalido(campo, malo);
  if (invalidos.titulo) errores.push('el título');
  if (invalidos.fecha) errores.push('la fecha');
  if (invalidos.hora) errores.push('la hora');
  if (errores.length) {
    mostrarMensaje(`Falta completar: ${errores.join(', ')}.`, 'error', '#mensaje-actividad');
    return;
  }

  const idx = actividades.findIndex((a) => a.id === act.id);
  if (idx >= 0) {
    act.completada = actividades[idx].completada;
    actividades[idx] = act;
    mostrarMensaje('Actividad actualizada ✔', 'ok', '#mensaje-actividad');
  } else {
    actividades.push(act);
    mostrarMensaje('Actividad agregada ✔', 'ok', '#mensaje-actividad');
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
  const boton = evento.target.closest('[data-accion]');
  if (!boton) return;
  const id = boton.closest('.item').dataset.id;
  const act = actividades.find((a) => a.id === id);
  if (!act) return;

  if (boton.dataset.accion === 'alternar') {
    act.completada = boton.checked;
    persistir();
  } else if (boton.dataset.accion === 'editar') {
    llenarFormActividad(act);
  } else if (boton.dataset.accion === 'eliminar') {
    if (confirm(`¿Eliminar «${act.titulo}»?`)) {
      actividades = actividades.filter((a) => a.id !== id);
      persistir();
    }
  }
});

/* ---------- Filtros ---------- */
['#buscar', '#f-frente', '#f-estado'].forEach((s) => {
  $(s).addEventListener('input', () => renderActividades(filtradas()));
});

/* ---------- Exportar CSV ---------- */
$('#btn-csv').addEventListener('click', () => {
  const celda = (v) => `"${String(v ?? '').replaceAll('"', '""')}"`;
  const filas = [['Título', 'Frente', 'Fecha', 'Hora', 'Estado', 'Notas']];
  const ahora = new Date();
  actividades.forEach((a) => filas.push([a.titulo, a.frente, a.fecha, a.hora, estadoDe(a, ahora), a.notas]));
  const csv = '﻿' + filas.map((f) => f.map(celda).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const enlace = Object.assign(document.createElement('a'), { href: url, download: 'nosemepasa-actividades.csv' });
  enlace.click();
  URL.revokeObjectURL(url);
});

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
setInterval(refrescar, 60 * 1000); // actualiza "faltan X h" cada minuto
