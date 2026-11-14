// tema-inicial.js · Se ejecuta en el <head>, antes de pintar, para evitar el destello del tema claro.
// Es un script clásico (no módulo) a propósito: debe correr de inmediato y sin esperar.
(function () {
  try {
    var guardado = JSON.parse(localStorage.getItem('nsmp_tema'));
    var oscuro = guardado === 'oscuro' || (!guardado && matchMedia('(prefers-color-scheme: dark)').matches);
    if (oscuro) document.documentElement.dataset.tema = 'oscuro';
  } catch (error) { /* sin localStorage: se queda en claro */ }
})();
