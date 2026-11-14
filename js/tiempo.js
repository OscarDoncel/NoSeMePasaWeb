// tiempo.js · Cálculos con fechas y estados de una actividad (sin tocar el DOM)

const DIA_MS = 24 * 60 * 60 * 1000;

export function vencimiento(act) {
  return new Date(`${act.fecha}T${act.hora || '23:59'}`);
}

export function estadoDe(act, ahora = new Date()) {
  if (act.completada) return 'completada';
  const diff = vencimiento(act) - ahora;
  if (diff < 0) return 'vencida';
  if (diff <= DIA_MS) return 'proxima';
  return 'pendiente';
}

export const ETIQUETA_ESTADO = {
  completada: 'Completada',
  vencida: 'Vencida',
  proxima: 'Vence pronto',
  pendiente: 'Pendiente'
};

export function textoRestante(act, ahora = new Date()) {
  const diff = vencimiento(act) - ahora;
  const min = Math.floor(Math.abs(diff) / 60000);
  const h = Math.floor(min / 60);
  const d = Math.floor(h / 24);
  const t = d >= 1 ? `${d} d ${h % 24} h` : h >= 1 ? `${h} h ${min % 60} min` : `${min} min`;
  return diff < 0 ? `venció hace ${t}` : `faltan ${t}`;
}

export function formatoFecha(act) {
  return vencimiento(act).toLocaleString('es-CO', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}
