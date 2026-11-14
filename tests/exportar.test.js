import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generarCSV } from '../js/exportar.js';

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
