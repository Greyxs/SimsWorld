const JSON_BASE = 'data/'; // Archivos JSON locales

/**
 * Renderiza cards desde un archivo JSON local en un contenedor dado
 * @param {string} archivo      - nombre del archivo JSON, e.g. 'mods.json'
 * @param {string} clave        - clave raíz del JSON, e.g. 'mods'
 * @param {string} contenedorId - id del div donde se pinta
 * @param {function} plantilla  - función que recibe un item y devuelve HTML
 */
async function cargarAPI(archivo, clave, contenedorId, plantilla) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Cargando datos...</p>
    </div>
  `;

  try {
    const res = await fetch(`${JSON_BASE}${archivo}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const datos = json[clave]

    if (!datos || !datos.length) {
      contenedor.innerHTML = `<p class="loading-state">No hay datos disponibles.</p>`;
      return;
    }

    contenedor.innerHTML = datos.map(plantilla).join('');

  } catch (err) {
    contenedor.innerHTML = `
      <div class="error-state">
        <p>No se pudieron cargar los datos.</p>
        <p style="font-size:0.85rem; margin-top:0.5rem;">
          Asegurate de abrir el sitio desde un servidor local (Live Server o similar)
          y no directamente como archivo (<code>file://</code>).
        </p>
      </div>
    `;
    console.error('Error al cargar JSON:', err);
  }
}

/* Plantillas HTML por tipo */

function plantillaMod(mod) {
  return `
    <div class="api-card">
      <div class="api-card-img-placeholder">[ Mod ]</div>
      <div class="api-card-body">
        <span class="tag tag-verde">${mod.categoria}</span>
        <h3>${mod.nombre}</h3>
        <p>${mod.descripcion}</p>
      </div>
      <div class="api-card-footer">
        <a href="${mod.link}" target="_blank" rel="noopener" class="btn btn-primary" style="width:100%; justify-content:center;">
          Ir al sitio
        </a>
      </div>
    </div>
  `;
}

function plantillaCC(item) {
   const imgHtml = item.imagen
  ? `<img class="api-card-img"
          src="${item.imagen}"
          alt="${item.nombre}"
          onerror="this.style.display='none'">`
  : `<div class="api-card-img-placeholder">CC</div>`;
  return `
    <div class="api-card">
      ${imgHtml}
       <div class="api-card-body">
        <span class="tag tag-rosa">${item.categoria}</span>
        <h3>${item.nombre}</h3>
        <p>${item.descripcion}</p>
      </div>
      <div class="api-card-footer">
        <a href="${item.link}" target="_blank" rel="noopener" class="btn btn-primary" style="width:100%; justify-content:center;">
          Ver creadora
        </a>
      </div>
    </div>
  `;
}

function plantillaManager(mgr) {
  const plataformas = Array.isArray(mgr.plataforma) ? mgr.plataforma.join(', ') : mgr.plataforma;
  return `
    <div class="api-card">
      <div class="api-card-img-placeholder">Tool</div>
      <div class="api-card-body">
        <span class="tag tag-azul">${mgr.categoria}</span>
        <h3>${mgr.nombre}</h3>
        <p>${mgr.descripcion}</p>
        <p style="font-size:0.8rem; color:var(--verde-claro); margin-top:0.3rem;">${plataformas} · ${mgr.gratuito ? 'Gratuito' : 'De pago'}</p>
      </div>
      <div class="api-card-footer">
        <a href="${mgr.link}" target="_blank" rel="noopener" class="btn btn-primary" style="width:100%; justify-content:center;">
          Descargar
        </a>
      </div>
    </div>
  `;
}
