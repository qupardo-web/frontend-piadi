export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getAuthHeaders() {
  const token = sessionStorage.getItem('auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

function buildParams(params = {}) {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== null && v !== undefined && v !== '' && v !== 'Todos'
  );
  if (!entries.length) return '';
  return '?' + new URLSearchParams(Object.fromEntries(entries)).toString();
}

async function parseErrorMessage(res) {
  try {
    const errJson = await res.json();
    return errJson?.error?.message || errJson?.message || `HTTP ${res.status}`;
  } catch {
    return `HTTP ${res.status}`;
  }
}

async function apiFetch(path) {
  const res = await fetch(`${API_URL}${path}`, { headers: getAuthHeaders() });
  if (!res.ok) {
    const msg = await parseErrorMessage(res);
    throw new Error(msg);
  }
  return res.json();
}

export const getDashboardSummary = (params) =>
  apiFetch(`/api/dashboard/summary${buildParams(params)}`);

export const getDepartmentKpis = (deptKey) =>
  apiFetch(`/api/departments/${deptKey}/kpis`);

export const getDepartments = () =>
  apiFetch('/api/departments');

export const getDepartmentFilters = (deptKey) =>
  apiFetch(`/api/departments/${deptKey}/filters`);

export const getRoles = () =>
  apiFetch('/api/roles');

export const getIndicatorValues = (key, params) =>
  apiFetch(`/api/indicators/${key}/values${buildParams(params)}`);

export const getIndicatorSeries = (key, params) =>
  apiFetch(`/api/indicators/${key}/series${buildParams(params)}`);

export const getIndicatorBreakdown = (key, params) =>
  apiFetch(`/api/indicators/${key}/breakdown${buildParams(params)}`);

export const getIndicatorDetail = (key, params) =>
  apiFetch(`/api/indicators/${key}/detail${buildParams(params)}`);

export const getIndicatorDetailView = (key, params) =>
  apiFetch(`/api/indicators/${key}/detail/view${buildParams(params)}`);

async function apiMutate(path, method, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const msg = await parseErrorMessage(res);
    throw new Error(msg);
  }
  if (res.status === 204) return { success: true };
  return res.json();
}

export const createMeta = (body) => apiMutate('/api/metas', 'POST', body);
export const updateMeta = (id, body) => apiMutate(`/api/metas/${id}`, 'PUT', body);
export const getMetas = (params) => apiFetch(`/api/metas${buildParams(params)}`);
export const getMetaById = (id) => apiFetch(`/api/metas/${id}`);
export const deleteMeta = (id) => apiMutate(`/api/metas/${id}`, 'DELETE');
export const closeMeta = (id) => apiMutate(`/api/metas/${id}/cerrar`, 'POST');

export const getPlantillas = () => apiFetch('/api/plantillas');
export const getPlantillaById = (id) => apiFetch(`/api/plantillas/${id}`);

// Módulo de Reportes (PIADI-418 / PIADI-425)
export const getReportes = (params) => apiFetch(`/api/reportes${buildParams(params)}`);
export const getReporteById = (id) => apiFetch(`/api/reportes/${id}`);
export const createReporte = (body) => apiMutate('/api/reportes', 'POST', body);
export const updateReporte = (id, body) => apiMutate(`/api/reportes/${id}`, 'PUT', body);
export const deleteReporte = (id) => apiMutate(`/api/reportes/${id}`, 'DELETE');
export const getReporteEjecuciones = (id, params) => apiFetch(`/api/reportes/${id}/ejecuciones${buildParams(params)}`);
export const getReportesEjecuciones = (params) => apiFetch(`/api/reportes/ejecuciones${buildParams(params)}`);
export const createReporteEjecucion = (id, body = { formato: 'PDF' }) => apiMutate(`/api/reportes/${id}/ejecuciones`, 'POST', body);
export const getReporteAreas = () => apiFetch('/api/reportes/areas');
export const getReporteTipos = () => apiFetch('/api/reportes/tipos');
export const getReporteFormatos = () => apiFetch('/api/reportes/formatos');

export const descargarReporte = async (id, fallbackName = 'reporte.xlsx') => {
  const token = sessionStorage.getItem('auth_token');
  const res = await fetch(`${API_URL}/api/reportes/${id}/descargar`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  if (!res.ok) {
    let errMessage = `Error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson?.error?.message) errMessage = errJson.error.message;
    } catch {
      // ignore
    }
    throw new Error(errMessage);
  }

  let filename = fallbackName;
  const disposition = res.headers.get('content-disposition');
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  return { success: true, filename };
};

export const descargarEjecucionReporte = async (ejecucionId, fallbackName = 'reporte.xlsx') => {
  const token = sessionStorage.getItem('auth_token');
  const res = await fetch(`${API_URL}/api/reportes/ejecuciones/${ejecucionId}/descargar`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  if (!res.ok) {
    let errMessage = `Error ${res.status}`;
    try {
      const errJson = await res.json();
      if (errJson?.error?.message) errMessage = errJson.error.message;
    } catch {
      // ignore
    }
    throw new Error(errMessage);
  }

  let filename = fallbackName;
  const disposition = res.headers.get('content-disposition');
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  return { success: true, filename };
};

// Centro de Ayuda (PIADI-459)
export const getHelpEntries = (modulo) =>
  apiFetch(`/api/help?modulo=${encodeURIComponent(modulo)}`);

