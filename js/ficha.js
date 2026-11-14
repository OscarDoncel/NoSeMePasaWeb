// ficha.js · Página de la ficha del estudiante
import { estudianteBase } from './datos.js';
import { cargarFicha, guardarFicha } from './storage.js';
import { renderTarjeta, llenarFormFicha, marcarCampoFicha, mostrarMensaje } from './ui.js';
import { iniciarTema } from './comun.js';
import { $ } from './dom.js';

let ficha = cargarFicha(estudianteBase);

$('#form-ficha').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const datos = new FormData(evento.target);
  const nombre = datos.get('nombre').trim();
  marcarCampoFicha('nombre', !nombre);
  if (!nombre) {
    mostrarMensaje('El nombre es obligatorio.', 'error');
    $('#nombre').focus();
    return;
  }
  ficha = {
    ...ficha,
    nombre,
    programa: datos.get('programa').trim(),
    correo: datos.get('correo').trim(),
    frase: datos.get('frase').trim()
  };
  if (guardarFicha(ficha)) renderTarjeta(ficha, 'Ficha guardada.');
  else {
    renderTarjeta(ficha);
    mostrarMensaje('No se pudo guardar la ficha en este navegador.', 'error');
  }
});

iniciarTema();
llenarFormFicha(ficha);
renderTarjeta(ficha);
