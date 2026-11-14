import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  cargarActividades, guardarActividades, cargarFicha, guardarFicha, cargarTema, guardarTema
} from '../js/storage.js';

// localStorage falso en memoria (Node no lo trae)
let datos;
let fallar;
beforeEach(() => {
  datos = new Map();
  fallar = false;
  globalThis.localStorage = {
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => { if (fallar) throw new Error('lleno'); datos.set(k, String(v)); }
  };
});

const buena = { id: 'a1', titulo: 'Parcial', frente: 'UCC', fecha: '2026-11-20', hora: '08:30', notas: '', completada: false };
const base = [{ ...buena, id: 'demo' }];

test('cargarActividades: sin datos guardados usa la base', () => {
  assert.deepEqual(cargarActividades(base), base);
});

test('guardar y cargar actividades: ida y vuelta', () => {
  assert.equal(guardarActividades([buena]), true);
  assert.deepEqual(cargarActividades(base), [buena]);
});

test('una lista vacía guardada se respeta (no vuelve la base)', () => {
  guardarActividades([]);
  assert.deepEqual(cargarActividades(base), []);
});

test('JSON dañado: no lanza error y usa la base', () => {
  datos.set('nsmp_actividades', '{no es json');
  assert.deepEqual(cargarActividades(base), base);
});

test('lo guardado no es una lista: usa la base', () => {
  datos.set('nsmp_actividades', JSON.stringify({ a: 1 }));
  assert.deepEqual(cargarActividades(base), base);
});

test('elementos dañados se descartan y los buenos se conservan', () => {
  guardarActividades([buena, { id: 'x' }, null, { ...buena, id: 'b', fecha: '2026-02-30' }]);
  assert.deepEqual(cargarActividades(base), [buena]);
});

test('si localStorage está lleno, guardar devuelve false en vez de lanzar', () => {
  fallar = true;
  assert.equal(guardarActividades([buena]), false);
  assert.equal(guardarFicha({ nombre: 'A' }), false);
});

test('ficha: mezcla lo guardado con el respaldo', () => {
  const respaldo = { nombre: 'N', programa: 'P', correo: 'C', frase: 'F' };
  guardarFicha({ nombre: 'Otro', programa: 123 });
  assert.deepEqual(cargarFicha(respaldo), { ...respaldo, nombre: 'Otro' });
});

test('tema: solo acepta claro u oscuro', () => {
  assert.equal(cargarTema(), null);
  guardarTema('oscuro');
  assert.equal(cargarTema(), 'oscuro');
  datos.set('nsmp_tema', JSON.stringify('rosa'));
  assert.equal(cargarTema(), null);
});
