// storage.js · Acceso al navegador (localStorage + JSON). Nunca lanza errores hacia afuera.
import { esActividadValida, normalizarActividad, normalizarFicha } from './validar.js';

const CLAVE_FICHA = 'nsmp_ficha';
const CLAVE_ACTIVIDADES = 'nsmp_actividades';
const CLAVE_TEMA = 'nsmp_tema';

function leer(clave, porDefecto) {
  try {
    const texto = localStorage.getItem(clave);
    return texto ? JSON.parse(texto) : porDefecto;
  } catch (error) {
    console.warn('No se pudo leer', clave, error);
    return porDefecto;
  }
}

function escribir(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
    return true;
  } catch (error) {
    console.warn('No se pudo guardar', clave, error);
    return false;
  }
}

export function guardarFicha(ficha) {
  return escribir(CLAVE_FICHA, ficha);
}

export function cargarFicha(estudianteBase) {
  return normalizarFicha(leer(CLAVE_FICHA, null), estudianteBase);
}

export function guardarActividades(lista) {
  return escribir(CLAVE_ACTIVIDADES, lista);
}

/** Si lo guardado no es una lista, usa la base; si trae elementos dañados, los descarta. */
export function cargarActividades(actividadesBase = []) {
  const guardado = leer(CLAVE_ACTIVIDADES, null);
  if (!Array.isArray(guardado)) return actividadesBase.map(normalizarActividad);
  return guardado.filter(esActividadValida).map(normalizarActividad);
}

export function guardarTema(tema) {
  return escribir(CLAVE_TEMA, tema);
}

export function cargarTema() {
  const tema = leer(CLAVE_TEMA, null);
  return tema === 'oscuro' || tema === 'claro' ? tema : null;
}
