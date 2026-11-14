// validar.js · Reglas para decidir si un dato guardado o escrito es confiable (sin DOM)
import { FRENTES } from './datos.js';

const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const FORMATO_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;

/** «2026-02-30» tiene buen formato pero no existe: se compara contra el calendario real. */
export function esFechaValida(texto) {
  if (typeof texto !== 'string' || !FORMATO_FECHA.test(texto)) return false;
  const [anio, mes, dia] = texto.split('-').map(Number);
  const f = new Date(anio, mes - 1, dia);
  return f.getFullYear() === anio && f.getMonth() === mes - 1 && f.getDate() === dia;
}

export function esHoraValida(texto) {
  return typeof texto === 'string' && FORMATO_HORA.test(texto);
}

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function esCorreoValido(texto) {
  return typeof texto === 'string' && FORMATO_CORREO.test(texto.trim());
}

export function esActividadValida(a) {
  return (
    typeof a === 'object' && a !== null &&
    typeof a.id === 'string' && a.id.length > 0 &&
    typeof a.titulo === 'string' && a.titulo.trim().length > 0 &&
    FRENTES.includes(a.frente) &&
    esFechaValida(a.fecha) &&
    esHoraValida(a.hora)
  );
}

/** Devuelve una actividad con exactamente los campos esperados y los tipos correctos. */
export function normalizarActividad(a) {
  return {
    id: a.id,
    titulo: a.titulo.trim().slice(0, 80),
    frente: a.frente,
    fecha: a.fecha,
    hora: a.hora,
    notas: typeof a.notas === 'string' ? a.notas.slice(0, 200) : '',
    completada: a.completada === true
  };
}

/** Deja solo los cuatro campos de la ficha y solo si son texto. */
export function normalizarFicha(f, respaldo) {
  const salida = { ...respaldo };
  if (typeof f !== 'object' || f === null) return salida;
  for (const campo of ['nombre', 'programa', 'correo', 'frase']) {
    if (typeof f[campo] === 'string') salida[campo] = f[campo];
  }
  return salida;
}

/** Lo que falta o está mal en una actividad del formulario: [{ campo, texto }]. Vacía = todo bien. */
export function faltantesActividad(a) {
  const reglas = [
    ['titulo', 'el título', Boolean(a.titulo)],
    ['fecha', 'una fecha válida', esFechaValida(a.fecha)],
    ['hora', 'una hora válida', esHoraValida(a.hora)]
  ];
  return reglas.filter(([, , ok]) => !ok).map(([campo, texto]) => ({ campo, texto }));
}
