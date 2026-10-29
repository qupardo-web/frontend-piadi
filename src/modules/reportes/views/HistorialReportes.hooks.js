import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  getReportesEjecuciones,
  getReportes,
  descargarEjecucionReporte,
} from '../../../services/piadiApi';

export const useHistorialReportes = () => {
  const { user } = useAuth();

  // Estados de datos
  const [ejecuciones, setEjecuciones] = useState([]);
  const [reportesList, setReportesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReporteId, setSelectedReporteId] = useState('todos');
  const [selectedEstado, setSelectedEstado] = useState('todos');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // Paginación
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Feedback Toast
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = useCallback((message, severity = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  // Cargar lista de reportes disponibles para el dropdown de filtros
  const fetchReportesList = useCallback(async () => {
    try {
      const res = await getReportes();
      const list = res?.data || res || [];
      setReportesList(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('No se pudo cargar el listado de reportes para el filtro:', err);
    }
  }, []);

  // Carga de historial de ejecuciones desde el backend
  const fetchEjecuciones = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};

      if (selectedReporteId && selectedReporteId !== 'todos') {
        params.reporteId = selectedReporteId;
      }
      if (selectedEstado && selectedEstado !== 'todos') {
        params.estado = selectedEstado;
      }
      if (fromDate) {
        params.fromDate = fromDate;
      }
      if (toDate) {
        params.toDate = toDate;
      }

      const res = await getReportesEjecuciones(params);
      const data = res?.data || res || [];
      setEjecuciones(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al cargar historial de reportes:', err);
      showToast(err.message || 'Error al conectar con el historial de ejecuciones', 'error');
      setEjecuciones([]);
    } finally {
      setLoading(false);
    }
  }, [selectedReporteId, selectedEstado, fromDate, toDate, showToast]);

  // Carga inicial
  useEffect(() => {
    fetchReportesList();
  }, [fetchReportesList]);

  useEffect(() => {
    fetchEjecuciones();
  }, [fetchEjecuciones]);

  // Formateador de fechas
  const formatFecha = useCallback((iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return iso;
      const dia = String(d.getDate()).padStart(2, '0');
      const mes = String(d.getMonth() + 1).padStart(2, '0');
      const anio = d.getFullYear();
      const horas = String(d.getHours()).padStart(2, '0');
      const minutos = String(d.getMinutes()).padStart(2, '0');
      return `${dia}/${mes}/${anio} ${horas}:${minutos} hrs`;
    } catch {
      return iso;
    }
  }, []);

  // Descarga directa del archivo de ejecución sin recalcular
  const handleDescargar = useCallback(
    async (ejecucion) => {
      if (!ejecucion) return;

      if (!ejecucion.archivoDisponible) {
        showToast(
          'El archivo generado anteriormente ya no se encuentra almacenado en el servidor.',
          'warning'
        );
        return;
      }

      try {
        setDownloadingId(ejecucion.id);
        showToast('Iniciando descarga del archivo...', 'info');

        const fallbackName =
          ejecucion.archivoNombre ||
          `reporte-${ejecucion.reporteId || ejecucion.id}.xlsx`;

        await descargarEjecucionReporte(ejecucion.id, fallbackName);
        showToast('Archivo descargado con éxito.', 'success');
      } catch (err) {
        console.error('Error al descargar archivo de ejecución:', err);
        showToast(`Error al descargar archivo: ${err.message}`, 'error');
      } finally {
        setDownloadingId(null);
      }
    },
    [showToast]
  );

  // Filtro en memoria por término de búsqueda y orden descendente
  const filteredEjecuciones = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return ejecuciones
      .filter((e) => {
        if (!term) return true;
        const nombreRep = (e.reporte?.nombre || '').toLowerCase();
        const archNombre = (e.archivoNombre || '').toLowerCase();
        const solicitanteName = (e.solicitante?.name || '').toLowerCase();
        const solicitanteEmail = (e.solicitante?.email || '').toLowerCase();
        const ejecId = String(e.id);
        const repId = String(e.reporteId || '');

        return (
          nombreRep.includes(term) ||
          archNombre.includes(term) ||
          solicitanteName.includes(term) ||
          solicitanteEmail.includes(term) ||
          ejecId.includes(term) ||
          repId.includes(term)
        );
      })
      .sort((a, b) => {
        const timeA = a.generadoEn ? new Date(a.generadoEn).getTime() : 0;
        const timeB = b.generadoEn ? new Date(b.generadoEn).getTime() : 0;
        return timeB - timeA;
      });
  }, [ejecuciones, searchTerm]);

  // Cálculos de KPIs
  const kpis = useMemo(() => {
    const total = ejecuciones.length;
    let listos = 0;
    let enProceso = 0;
    let errores = 0;

    ejecuciones.forEach((e) => {
      if (e.estado === 'LISTO') listos += 1;
      else if (e.estado === 'GENERANDO' || e.estado === 'PENDIENTE') enProceso += 1;
      else if (e.estado === 'ERROR') errores += 1;
    });

    return { total, listos, enProceso, errores };
  }, [ejecuciones]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filteredEjecuciones.length / rowsPerPage));
  const paginatedEjecuciones = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredEjecuciones.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredEjecuciones, page, rowsPerPage]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedReporteId('todos');
    setSelectedEstado('todos');
    setFromDate('');
    setToDate('');
    setPage(1);
  }, []);

  return {
    user,
    loading,
    downloadingId,
    ejecuciones: paginatedEjecuciones,
    totalRecords: filteredEjecuciones.length,
    reportesList,
    searchTerm,
    setSearchTerm,
    selectedReporteId,
    setSelectedReporteId,
    selectedEstado,
    setSelectedEstado,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    kpis,
    toast,
    showToast,
    closeToast,
    fetchEjecuciones,
    formatFecha,
    handleDescargar,
    handleResetFilters,
    filtersCollapsed,
    setFiltersCollapsed,
  };
};
