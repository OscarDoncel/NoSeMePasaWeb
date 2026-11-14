import test from 'node:test';
import assert from 'node:assert/strict';
import { nuevoId, crearActividad, filtrarYOrdenar, masUrgentes, contarPorEstado } from '../js/logica.js';

const ahora = new Date('2026-11-14T12:00:00');
const act = (id, titulo, frente, fecha, extra = {}) =>
  ({ id, titulo, frente, fecha, hora: '12:00', notas: '', completada: false, ...extra });

const lista = [
  act('1', 'Entregar taller', 'ITC', '2026-11-20'),
  act('2', 'Informe vencido', 'Trabajo', '2026-11-10'),
  act('3', 'Examen mañana', 'UCC', '2026-11-15', { notas: 'repasar' }),
  act('4', 'Ya hecha', 'ITC', '2026-11-12', { completada: true })
];

test('nuevoId: textos distintos', () => assert.notEqual(nuevoId(), nuevoId()));

test('crearActividad: limpia espacios y genera id', () => {
  const a = crearActividad({ id: '', titulo: '  Hola ', frente: 'ITC', fecha: '2026-01-01', hora: '10:00', notas: ' n ' });
  assert.equal(a.titulo, 'Hola');
  assert.equal(a.notas, 'n');
  assert.equal(a.completada, false);
  assert.ok(a.id);
});

test('filtrarYOrdenar: sin filtros ordena pendientes por vencimiento y deja completadas al final', () => {
  assert.deepEqual(filtrarYOrdenar(lista, {}, ahora).map((a) => a.id), ['2', '3', '1', '4']);
});

test('filtrarYOrdenar: combina texto, frente y estado', () => {
  assert.deepEqual(filtrarYOrdenar(lista, { texto: 'REPASAR' }, ahora).map((a) => a.id), ['3']);
  assert.deepEqual(filtrarYOrdenar(lista, { frente: 'ITC' }, ahora).map((a) => a.id), ['1', '4']);
  assert.deepEqual(filtrarYOrdenar(lista, { estado: 'vencidas' }, ahora).map((a) => a.id), ['2']);
  assert.deepEqual(filtrarYOrdenar(lista, { estado: 'proximas' }, ahora).map((a) => a.id), ['3']);
  assert.deepEqual(filtrarYOrdenar(lista, { estado: 'pendientes' }, ahora).map((a) => a.id), ['3', '1']);
  assert.deepEqual(filtrarYOrdenar(lista, { estado: 'completadas' }, ahora).map((a) => a.id), ['4']);
  assert.deepEqual(filtrarYOrdenar(lista, { frente: 'ITC', estado: 'pendientes' }, ahora).map((a) => a.id), ['1']);
});

test('filtrarYOrdenar: no modifica la lista original', () => {
  const copia = lista.map((a) => a.id);
  filtrarYOrdenar(lista, {}, ahora);
  assert.deepEqual(lista.map((a) => a.id), copia);
});

test('masUrgentes: solo pendientes, la más cercana primero', () => {
  assert.deepEqual(masUrgentes(lista, 2).map((a) => a.id), ['2', '3']);
});

test('contarPorEstado', () => {
  assert.deepEqual(contarPorEstado(lista, ahora), { total: 4, completada: 1, vencida: 1, proxima: 1, pendiente: 1 });
});
