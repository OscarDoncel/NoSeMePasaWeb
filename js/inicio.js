// inicio.js · Página de inicio: resumen de avance, gráfica y lo más urgente
import { actividadesBase } from './datos.js';
import { cargarActividades } from './storage.js';
import { renderResumen, renderUrgentes } from './ui.js';
import { renderGrafica } from './grafica.js';
import { iniciarTema } from './tema.js';

let actividades = cargarActividades(actividadesBase);

function refrescar() {
  renderResumen(actividades);
  renderGrafica(actividades);
  renderUrgentes(actividades);
}

// Si las actividades cambian en otra pestaña, se actualiza el inicio
addEventListener('storage', () => {
  actividades = cargarActividades(actividadesBase);
  refrescar();
});

iniciarTema();
refrescar();
setInterval(refrescar, 60 * 1000); // actualiza «faltan X h» cada minuto
