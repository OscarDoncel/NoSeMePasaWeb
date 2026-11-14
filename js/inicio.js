// inicio.js · Página de inicio: resumen de avance y lo más urgente
import { actividadesBase } from './datos.js';
import { cargarActividades } from './storage.js';
import { renderResumen, renderUrgentes } from './ui.js';
import { iniciarTema } from './comun.js';

let actividades = cargarActividades(actividadesBase);

function refrescar() {
  renderResumen(actividades);
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
