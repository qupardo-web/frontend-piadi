// =========================================================================
// ARCHIVO DE HOOKS: MetaEditForm.hooks.js
// =========================================================================

import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth';
import { getDepartments, getDepartmentKpis, updateMeta, getMetaById } from '../../../services/piadiApi';

export const useMetaEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Mode is always 'editar'
  const modo = 'editar';

  // Sidebar controls
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Metas');

  // Dynamic Data Lists
  const [departmentsList, setDepartmentsList] = useState([]);
  const [kpisList, setKpisList] = useState([]);

  // Form Fields State
  const [nombre, setNombre] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [comportamiento, setComportamiento] = useState('no-debe-superar');
  const [inicio, setInicio] = useState('');
  const [limite, setLimite] = useState('');
  const [prioridad, setPrioridad] = useState('media');
  const [creadaPor, setCreadaPor] = useState('');
  const [metricas, setMetricas] = useState([]);

  // Form validation errors
  const [errors, setErrors] = useState({
    nombre: false,
    departamento: false,
    inicio: false,
    limite: false,
  });
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Modals Visibility
  const [metricModalOpen, setMetricModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editMetricIndex, setEditMetricIndex] = useState(null);

  // Metric Form State (Inside Modal)
  const [metricSearch, setMetricSearch] = useState('');
  const [metricNombre, setMetricNombre] = useState('');
  const [metricDropdownOpen, setMetricDropdownOpen] = useState(false);
  const [metricAporte, setMetricAporte] = useState('');
  const [metricComportamiento, setMetricComportamiento] = useState('no-debe-superar');
  const [metricValorTipo, setMetricValorTipo] = useState('numerico');
  const [metricValor, setMetricValor] = useState('');
  const [metricModalError, setMetricModalError] = useState(null);

  // Load departments from database on mount
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await getDepartments();
        if (res.success && Array.isArray(res.data)) {
          setDepartmentsList(res.data);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepts();
  }, []);

  // Load KPIs whenever the selected department changes
  useEffect(() => {
    if (!departamento) {
      setKpisList([]);
      return;
    }
    const fetchKpis = async () => {
      try {
        const res = await getDepartmentKpis(departamento);
        if (res.success && res.data && Array.isArray(res.data.kpis)) {
          setKpisList(res.data.kpis);
        } else {
          setKpisList([]);
        }
      } catch (err) {
        console.error('Error fetching KPIs:', err);
        setKpisList([]);
      }
    };
    fetchKpis();
  }, [departamento]);

  // Load meta data from backend
  useEffect(() => {
    if (!id) return;
    const fetchMeta = async () => {
      try {
        const res = await getMetaById(id);
        if (res.success && res.data) {
          const m = res.data;
          setNombre(m.nombre || '');
          setDepartamento(m.departmentId || '');
          setComportamiento(m.comportamiento || 'no-debe-superar');
          const formatToInputDate = (dateStr) => {
            if (!dateStr) return '';
            return dateStr.split(/[T ]/)[0];
          };
          setInicio(formatToInputDate(m.fechaInicio || m.inicio));
          setLimite(formatToInputDate(m.fechaLimite || m.limite));
          setPrioridad(m.prioridad || 'media');
          setCreadaPor(`Usuario ID: ${m.creatorId || 'N/A'}`);
          
          if (Array.isArray(m.metrics)) {
            const mappedMetrics = m.metrics.map((metric, index) => ({
              id: metric.id || index,
              nombre: metric.indicatorKey, // resolved dynamically in render using kpisList
              key: metric.indicatorKey,
              aporte: Number(metric.weight || 0),
              comportamiento: metric.behavior,
              valor: Number(metric.targetValue || 0),
              tipoValor: metric.valueType === 'percentage' ? 'porcentaje' : 'numerico'
            }));
            setMetricas(mappedMetrics);
          }
        }
      } catch (err) {
        console.error('Error fetching meta from backend:', err);
      }
    };
    fetchMeta();
  }, [id]);

  // Compute Total Metrics Aporte Percentage
  const totalAporte = useMemo(() => {
    return metricas.reduce((acc, curr) => acc + Number(curr.aporte), 0);
  }, [metricas]);

  // Filter metrics pool for search
  const filteredMetricsPool = useMemo(() => {
    const pool = kpisList.map(k => k.name);
    if (!metricSearch) return pool;
    return pool.filter(m => m.toLowerCase().includes(metricSearch.toLowerCase()));
  }, [kpisList, metricSearch]);

  // Navigation Sidebar trigger
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Add/Edit Metric Modal Actions
  const handleOpenAddMetric = () => {
    setEditMetricIndex(null);
    setMetricSearch('');
    setMetricNombre('');
    setMetricAporte('');
    setMetricComportamiento('no-debe-superar');
    setMetricValorTipo('numerico');
    setMetricValor('');
    setMetricModalError(null);
    setMetricModalOpen(true);
  };

  const handleOpenEditMetric = (index) => {
    const item = metricas[index];
    setEditMetricIndex(index);
    const kpiObj = kpisList.find(k => k.key === item.key);
    const prettyName = kpiObj ? kpiObj.name : (item.nombre || item.key);
    setMetricSearch(prettyName);
    setMetricNombre(prettyName);
    setMetricAporte(item.aporte);
    setMetricComportamiento(item.comportamiento);
    setMetricValorTipo(item.tipoValor);
    setMetricValor(item.valor);
    setMetricModalError(null);
    setMetricModalOpen(true);
  };

  const handleSaveMetric = () => {
    if (!metricNombre) {
      setMetricModalError('Selecciona una métrica');
      return;
    }
    const valAporte = Number(metricAporte);
    if (!metricAporte || valAporte <= 0 || valAporte > 100) {
      setMetricModalError('El aporte debe ser entre 1% y 100%');
      return;
    }

    // Check total limit
    const currentMetricAporte = editMetricIndex !== null ? metricas[editMetricIndex].aporte : 0;
    const nextTotal = totalAporte - currentMetricAporte + valAporte;
    if (nextTotal > 100) {
      setMetricModalError(`El total acumulado no puede superar el 100% (Quedaría en ${nextTotal}%)`);
      return;
    }

    if (!metricValor || Number(metricValor) <= 0) {
      setMetricModalError('El valor esperado debe ser un número positivo');
      return;
    }

    const selectedKpiObj = kpisList.find(k => k.name === metricNombre);
    const payload = {
      id: editMetricIndex !== null ? metricas[editMetricIndex].id : Date.now(),
      nombre: metricNombre,
      key: selectedKpiObj ? selectedKpiObj.key : '',
      aporte: valAporte,
      comportamiento: metricComportamiento,
      valor: Number(metricValor),
      tipoValor: metricValorTipo
    };

    if (editMetricIndex !== null) {
      const copy = [...metricas];
      copy[editMetricIndex] = payload;
      setMetricas(copy);
    } else {
      setMetricas([...metricas, payload]);
    }

    setMetricModalOpen(false);
  };

  const handleDeleteMetric = (index) => {
    const copy = [...metricas];
    copy.splice(index, 1);
    setMetricas(copy);
  };

  // Form Actions
  const validateForm = () => {
    const nextErrors = {
      nombre: !nombre.trim(),
      departamento: !departamento,
      inicio: !inicio,
      limite: !limite,
    };
    setErrors(nextErrors);
    const hasFieldErrors = Object.values(nextErrors).some(Boolean);
    const hasMetricErrors = metricas.length === 0 || totalAporte !== 100;
    
    if (hasFieldErrors || hasMetricErrors) {
      setShowSaveAlert(true);
      return false;
    }
    setShowSaveAlert(false);
    return true;
  };

  const handleSaveMeta = async () => {
    if (!validateForm()) return;
    try {
      const payload = {
        departmentId: departamento || null,
        anio: 2026,
        periodo: 'Anual',
        nombre: nombre,
        inicio: inicio || null,
        limite: limite || null,
        prioridad: prioridad || null,
        comportamiento: comportamiento || null,
        metrics: metricas.map((m) => ({
          indicatorKey: m.key,
          weight: Number(m.aporte),
          behavior: m.comportamiento,
          targetValue: Number(m.valor),
          valueType: m.tipoValor === 'numerico' ? 'number' : (m.tipoValor === 'porcentaje' ? 'percentage' : m.tipoValor)
        }))
      };

      await updateMeta(id, payload);

      setSuccessMsg('Meta guardada con éxito');
      setShowSuccessAlert(true);
    } catch (err) {
      console.error('Error saving meta:', err);
      alert('Hubo un error al guardar la meta en el servidor.');
    }
  };

  const handleOpenPreview = () => {
    if (!validateForm()) return;
    setPreviewModalOpen(true);
  };

  return {
    navigate,
    user,
    logout,
    activeMenu,
    setActiveMenu,
    mobileOpen,
    setMobileOpen,
    handleDrawerToggle,
    modo,
    departmentsList,
    kpisList,
    nombre,
    setNombre,
    departamento,
    setDepartamento,
    comportamiento,
    setComportamiento,
    inicio,
    setInicio,
    limite,
    setLimite,
    prioridad,
    setPrioridad,
    creadaPor,
    metricas,
    errors,
    showSaveAlert,
    setShowSaveAlert,
    showSuccessAlert,
    setShowSuccessAlert,
    successMsg,
    metricModalOpen,
    setMetricModalOpen,
    previewModalOpen,
    setPreviewModalOpen,
    editMetricIndex,
    metricSearch,
    setMetricSearch,
    metricNombre,
    setMetricNombre,
    metricDropdownOpen,
    setMetricDropdownOpen,
    metricAporte,
    setMetricAporte,
    metricComportamiento,
    setMetricComportamiento,
    metricValorTipo,
    setMetricValorTipo,
    metricValor,
    setMetricValor,
    metricModalError,
    totalAporte,
    filteredMetricsPool,
    handleOpenAddMetric,
    handleOpenEditMetric,
    handleSaveMetric,
    handleDeleteMetric,
    handleSaveMeta,
    handleOpenPreview
  };
};
