// storage.js · Acceso al navegador (localStorage + JSON)

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
  return { ...estudianteBase, ...leer(CLAVE_FICHA, {}) };
}

export function guardarActividades(lista) {
  return escribir(CLAVE_ACTIVIDADES, lista);
}

export function cargarActividades(actividadesBase = []) {
  return leer(CLAVE_ACTIVIDADES, actividadesBase);
}

export function guardarTema(tema) {
  return escribir(CLAVE_TEMA, tema);
}

export function cargarTema() {
  return leer(CLAVE_TEMA, null);
}
