// exportar.js · Convierte la lista de actividades en texto CSV (no toca el navegador)
import { estadoDe } from './tiempo.js';

const celda = (valor) => `"${String(valor ?? '').replaceAll('"', '""')}"`;

export function generarCSV(actividades, ahora = new Date()) {
  const filas = [['Título', 'Frente', 'Fecha', 'Hora', 'Estado', 'Notas']];
  actividades.forEach((a) =>
    filas.push([a.titulo, a.frente, a.fecha, a.hora, estadoDe(a, ahora), a.notas])
  );
  // ﻿ (BOM) hace que Excel muestre bien las tildes
  return '﻿' + filas.map((f) => f.map(celda).join(',')).join('\r\n');
}
