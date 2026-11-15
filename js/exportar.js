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

const escaparICS = (t) => String(t ?? '').replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([,;])/g, '\\$1');

/**
 * Evento de calendario (.ics) con dos alarmas: 24 h y 1 h antes del vencimiento.
 * Google Calendar, Outlook y el calendario del celular lo abren y son ellos quienes avisan.
 */
export function generarICS(act, ahora = new Date()) {
  const compacta = (f, h) => `${f.replaceAll('-', '')}T${h.replace(':', '')}00`;
  const sello = ahora.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const alarma = (antes, texto) => [
    'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${escaparICS(texto)}`, `TRIGGER:-${antes}`, 'END:VALARM'
  ];
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//NoSeMePasa//ES', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${act.id}@nosemepasa`,
    `DTSTAMP:${sello}`,
    `DTSTART:${compacta(act.fecha, act.hora)}`,
    'DURATION:PT30M',
    `SUMMARY:${escaparICS(`Vence: ${act.titulo}`)}`,
    `DESCRIPTION:${escaparICS(`${act.frente}${act.notas ? ' · ' + act.notas : ''}`)}`,
    ...alarma('PT24H', `Mañana vence: ${act.titulo}`),
    ...alarma('PT1H', `En 1 hora vence: ${act.titulo}`),
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
}
