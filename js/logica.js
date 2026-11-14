// logica.js · Reglas de negocio de las actividades: crear, filtrar, ordenar y contar (sin DOM)
import { estadoDe, vencimiento } from './tiempo.js';

export function nuevoId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Arma una actividad nueva a partir de lo que escribió la persona en el formulario. */
export function crearActividad({ id, titulo, frente, fecha, hora, notas }) {
  return { id: id || nuevoId(), titulo: titulo.trim(), frente, fecha, hora, notas: notas.trim(), completada: false };
}

const porVencimiento = (a, b) => vencimiento(a) - vencimiento(b);

function coincideEstado(estadoActividad, filtro) {
  if (filtro === 'todas') return true;
  if (filtro === 'pendientes') return estadoActividad === 'pendiente' || estadoActividad === 'proxima';
  if (filtro === 'proximas') return estadoActividad === 'proxima';
  if (filtro === 'vencidas') return estadoActividad === 'vencida';
  return estadoActividad === 'completada';
}

/** Aplica los tres filtros a la vez y ordena: primero las pendientes, por fecha de vencimiento. */
export function filtrarYOrdenar(actividades, { texto = '', frente = 'todos', estado = 'todas' } = {}, ahora = new Date()) {
  const buscado = texto.trim().toLowerCase();
  return actividades
    .filter((a) => frente === 'todos' || a.frente === frente)
    .filter((a) => !buscado || `${a.titulo} ${a.notas || ''}`.toLowerCase().includes(buscado))
    .filter((a) => coincideEstado(estadoDe(a, ahora), estado))
    .sort((a, b) => Number(a.completada) - Number(b.completada) || porVencimiento(a, b));
}

/** Las pendientes con el vencimiento más cercano (incluye las ya vencidas, que son las más urgentes). */
export function masUrgentes(actividades, max = 3) {
  return actividades.filter((a) => !a.completada).sort(porVencimiento).slice(0, max);
}

export function contarPorEstado(actividades, ahora = new Date()) {
  const cuenta = { total: actividades.length, completada: 0, vencida: 0, proxima: 0, pendiente: 0 };
  for (const a of actividades) cuenta[estadoDe(a, ahora)] += 1;
  return cuenta;
}
