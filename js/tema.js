// tema.js · Modo claro/oscuro: aplica, cambia y recuerda el tema (lo usan las 3 páginas)
import { cargarTema, guardarTema } from './storage.js';
import { aplicarTema } from './ui.js';
import { $ } from './dom.js';

export function iniciarTema() {
  let tema = cargarTema() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro');
  aplicarTema(tema);
  $('#btn-tema').addEventListener('click', () => {
    tema = tema === 'oscuro' ? 'claro' : 'oscuro';
    aplicarTema(tema);
    guardarTema(tema);
  });
}
