// dom.js · Utilidades mínimas para buscar y crear elementos (sin innerHTML)

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
