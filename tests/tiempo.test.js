import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoDe, textoRestante, fechaHoy, vencimiento } from '../js/tiempo.js';

// «Ahora» fijo (hora local) para que las pruebas no dependan del reloj real
const ahora = new Date(2026, 10, 14, 12, 0, 0); // 14 nov 2026, 12:00
const act = (fecha, hora, extra = {}) => ({ fecha, hora, completada: false, ...extra });

test('estadoDe: completada gana sobre cualquier fecha', () => {
  assert.equal(estadoDe(act('2020-01-01', '08:00', { completada: true }), ahora), 'completada');
});

test('estadoDe: vencida si ya pasó la hora', () => {
  assert.equal(estadoDe(act('2026-11-14', '11:59'), ahora), 'vencida');
});

test('estadoDe: «próxima» incluye exactamente 24 horas', () => {
  assert.equal(estadoDe(act('2026-11-15', '12:00'), ahora), 'proxima');
  assert.equal(estadoDe(act('2026-11-14', '12:30'), ahora), 'proxima');
});

test('estadoDe: pendiente si falta más de 24 horas', () => {
  assert.equal(estadoDe(act('2026-11-15', '12:01'), ahora), 'pendiente');
});

test('textoRestante: minutos, horas y días', () => {
  assert.equal(textoRestante(act('2026-11-14', '12:45'), ahora), 'faltan 45 min');
  assert.equal(textoRestante(act('2026-11-14', '14:30'), ahora), 'faltan 2 h 30 min');
  assert.equal(textoRestante(act('2026-11-17', '15:00'), ahora), 'faltan 3 d 3 h');
  assert.equal(textoRestante(act('2026-11-14', '11:55'), ahora), 'venció hace 5 min');
});

test('vencimiento: sin hora usa el final del día', () => {
  const d = vencimiento({ fecha: '2026-11-14' });
  assert.equal(d.getHours(), 23);
  assert.equal(d.getMinutes(), 59);
});

test('fechaHoy: formato AAAA-MM-DD con ceros', () => {
  assert.equal(fechaHoy(new Date(2026, 0, 5)), '2026-01-05');
  assert.equal(fechaHoy(new Date(2026, 11, 31)), '2026-12-31');
});
