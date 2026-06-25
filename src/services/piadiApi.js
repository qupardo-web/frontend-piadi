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

export const getDepartmentFilters = (deptKey) =>
  apiFetch(`/api/departments/${deptKey}/filters`);

export const getIndicatorValues = (key, params) =>
  apiFetch(`/api/indicators/${key}/values${buildParams(params)}`);

export const getIndicatorSeries = (key, params) =>
  apiFetch(`/api/indicators/${key}/series${buildParams(params)}`);

export const getIndicatorBreakdown = (key, params) =>
  apiFetch(`/api/indicators/${key}/breakdown${buildParams(params)}`);
