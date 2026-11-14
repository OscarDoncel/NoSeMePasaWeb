// exportar.js · Descarga de datos como archivo CSV
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

export function descargarCSV(actividades) {
  const url = URL.createObjectURL(new Blob([generarCSV(actividades)], { type: 'text/csv;charset=utf-8' }));
  const enlace = Object.assign(document.createElement('a'), {
    href: url,
    download: 'nosemepasa-actividades.csv'
  });
  enlace.click();
  URL.revokeObjectURL(url);
}
