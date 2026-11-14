// ficha.js · Página de la ficha del estudiante
import { estudianteBase } from './datos.js';
import { cargarFicha, guardarFicha } from './storage.js';
import { esCorreoValido } from './validar.js';
import { renderTarjeta, llenarFormFicha, marcarCampoFicha, mostrarMensaje } from './ui.js';
import { iniciarTema } from './tema.js';
import { $ } from './dom.js';

let ficha = cargarFicha(estudianteBase);

$('#form-ficha').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const datos = new FormData(evento.target);
  const nombre = datos.get('nombre').trim();
  const correo = datos.get('correo').trim();
  const errores = [];
  if (!nombre) errores.push(['nombre', 'El nombre es obligatorio.']);
  if (correo && !esCorreoValido(correo)) errores.push(['correo', 'El correo no tiene un formato válido (ejemplo: nombre@dominio.com).']);
  marcarCampoFicha('nombre', !nombre);
  marcarCampoFicha('correo', Boolean(correo) && !esCorreoValido(correo));
  if (errores.length) {
    mostrarMensaje(errores.map((e) => e[1]).join(' '), 'error');
    $(`#${errores[0][0]}`).focus();
    return;
  }
  ficha = {
    ...ficha,
    nombre,
    programa: datos.get('programa').trim(),
    correo,
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
