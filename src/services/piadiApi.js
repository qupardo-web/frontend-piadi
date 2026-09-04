const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

async function apiFetch(path) {
  const res = await fetch(`${API_URL}${path}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
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

async function apiMutate(path, method, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (res.status === 204) return { success: true };
  return res.json();
}

export const createMeta = (body) => apiMutate('/api/metas', 'POST', body);
export const updateMeta = (id, body) => apiMutate(`/api/metas/${id}`, 'PUT', body);
export const getMetas = (params) => apiFetch(`/api/metas${buildParams(params)}`);
export const getMetaById = (id) => apiFetch(`/api/metas/${id}`);
export const deleteMeta = (id) => apiMutate(`/api/metas/${id}`, 'DELETE');

export const getPlantillas = () => apiFetch('/api/plantillas');
export const getPlantillaById = (id) => apiFetch(`/api/plantillas/${id}`);
