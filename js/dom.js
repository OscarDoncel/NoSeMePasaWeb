// dom.js · Utilidades mínimas del navegador: buscar, crear elementos y descargar un archivo

export const $ = (selector, raiz = document) => raiz.querySelector(selector);

/** Crea un elemento. Todo texto entra por textContent, nunca como HTML. */
export function crear(etiqueta, { clase, texto, atributos = {}, datos = {} } = {}) {
  const el = document.createElement(etiqueta);
  if (clase) el.className = clase;
  if (texto !== undefined) el.textContent = texto;
  for (const [k, v] of Object.entries(atributos)) el.setAttribute(k, v);
  for (const [k, v] of Object.entries(datos)) el.dataset[k] = v;
  return el;
}

/** Hace que el navegador descargue `contenido` como un archivo llamado `nombre`. */
export function descargarTexto(nombre, contenido, tipo = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const enlace = Object.assign(document.createElement('a'), { href: url, download: nombre });
  enlace.click();
  URL.revokeObjectURL(url);
}
