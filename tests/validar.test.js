import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  esFechaValida, esHoraValida, esActividadValida, normalizarActividad, normalizarFicha, esCorreoValido, faltantesActividad
} from '../js/validar.js';

const buena = { id: 'a1', titulo: 'Parcial', frente: 'UCC', fecha: '2026-11-20', hora: '08:30', notas: 'x', completada: false };

test('esFechaValida: rechaza fechas que no existen en el calendario', () => {
  assert.equal(esFechaValida('2026-11-20'), true);
  assert.equal(esFechaValida('2028-02-29'), true);   // bisiesto
  assert.equal(esFechaValida('2026-02-29'), false);  // no bisiesto
  assert.equal(esFechaValida('2026-13-01'), false);
  assert.equal(esFechaValida('2026-11-31'), false);
  assert.equal(esFechaValida('20/11/2026'), false);
  assert.equal(esFechaValida(null), false);
});

test('esHoraValida', () => {
  assert.equal(esHoraValida('00:00'), true);
  assert.equal(esHoraValida('23:59'), true);
  assert.equal(esHoraValida('24:00'), false);
  assert.equal(esHoraValida('9:30'), false);
  assert.equal(esHoraValida(''), false);
});

test('esActividadValida: acepta una buena y rechaza datos dañados', () => {
  assert.equal(esActividadValida(buena), true);
  assert.equal(esActividadValida({ ...buena, titulo: '   ' }), false);
  assert.equal(esActividadValida({ ...buena, frente: 'Otro' }), false);
  assert.equal(esActividadValida({ ...buena, id: '' }), false);
  assert.equal(esActividadValida({ ...buena, fecha: '2026-02-30' }), false);
  assert.equal(esActividadValida(null), false);
  assert.equal(esActividadValida('texto'), false);
});

test('normalizarActividad: tipos correctos y límites de longitud', () => {
  const n = normalizarActividad({ ...buena, titulo: ' ' + 'a'.repeat(100), notas: 5, completada: 'si' });
  assert.equal(n.titulo.length, 80);
  assert.equal(n.notas, '');
  assert.equal(n.completada, false);
});

test('normalizarFicha: ignora campos que no son texto', () => {
  const base = { nombre: 'A', programa: 'B', correo: 'C', frase: 'D' };
  assert.deepEqual(normalizarFicha({ nombre: 'Z', programa: 7, otro: 1 }, base), { ...base, nombre: 'Z' });
  assert.deepEqual(normalizarFicha(null, base), base);
});

test('esCorreoValido: acepta formatos normales y rechaza los rotos', () => {
  assert.equal(esCorreoValido('ana@correo.com'), true);
  assert.equal(esCorreoValido(' ana@correo.co '), true);
  for (const malo of ['', 'ana', 'ana@', '@correo.com', 'ana@correo', 'a na@correo.com', null]) {
    assert.equal(esCorreoValido(malo), false, String(malo));
  }
});

test('faltantesActividad: lista lo que falta', () => {
  assert.deepEqual(faltantesActividad({ titulo: 'x', fecha: '2026-01-01', hora: '10:00' }), []);
  const f = faltantesActividad({ titulo: '', fecha: '2026-13-01', hora: '25:00' });
  assert.deepEqual(f.map((x) => x.campo), ['titulo', 'fecha', 'hora']);
});
