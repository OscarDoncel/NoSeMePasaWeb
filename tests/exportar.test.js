import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCSV, generarICS } from '../js/exportar.js';

const ahora = new Date(2026, 10, 14, 12, 0);

test('generarCSV: BOM, encabezado, CRLF y comillas escapadas', () => {
  const csv = generarCSV([
    { titulo: 'Dijo "hola", y siguió', frente: 'ITC', fecha: '2026-11-20', hora: '08:00', notas: 'línea', completada: false }
  ], ahora);
  assert.equal(csv.charCodeAt(0), 0xfeff);
  const filas = csv.slice(1).split('\r\n');
  assert.equal(filas[0], '"Título","Frente","Fecha","Hora","Estado","Notas"');
  assert.equal(filas[1], '"Dijo ""hola"", y siguió","ITC","2026-11-20","08:00","pendiente","línea"');
});

test('generarCSV: lista vacía solo trae el encabezado', () => {
  assert.equal(generarCSV([], ahora).slice(1).split('\r\n').length, 1);
});

test('generarICS: evento con dos alarmas, fechas y texto escapado', () => {
  const ics = generarICS(
    { id: 'abc', titulo: 'Taller, final; ITC', frente: 'ITC', fecha: '2026-11-20', hora: '23:59', notas: 'línea1\nlínea2' },
    new Date('2026-11-14T12:00:00Z')
  );
  const lineas = ics.split('\r\n');
  assert.equal(lineas[0], 'BEGIN:VCALENDAR');
  assert.equal(lineas.at(-1), 'END:VCALENDAR');
  assert.ok(lineas.includes('DTSTART:20261120T235900'));
  assert.ok(lineas.includes('DTSTAMP:20261114T120000Z'));
  assert.ok(lineas.includes('SUMMARY:Vence: Taller\\, final\\; ITC'));
  assert.ok(lineas.includes('TRIGGER:-PT24H') && lineas.includes('TRIGGER:-PT1H'));
  assert.ok(lineas.some((l) => l.includes('línea1\\nlínea2')));
});
