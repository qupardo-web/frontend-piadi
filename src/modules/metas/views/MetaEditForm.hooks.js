// =========================================================================
// ARCHIVO DE HOOKS: MetaEditForm.hooks.js
// =========================================================================

import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth';
import { getDepartments, getDepartmentKpis, updateMeta, getMetaById, closeMeta } from '../../../services/piadiApi';
import { isRectoria } from '../metaAccess';
import { deriveAnio, derivePeriodo } from '../metaDateUtils';

export const useMetaEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Mode is always 'editar'
  const modo = 'editar';

  // Lifecycle status & read-only state
  const [lifecycleStatus, setLifecycleStatus] = useState('ACTIVA');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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
  const [metricLimitAlert, setMetricLimitAlert] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [successDesc, setSuccessDesc] = useState('');

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
  const [metricLowerLimit, setMetricLowerLimit] = useState('');
  const [metricUpperLimit, setMetricUpperLimit] = useState('');
  const [metricModalError, setMetricModalError] = useState(null);

  // Load departments from database on mount and filter by role
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await getDepartments();
        if (res.success && Array.isArray(res.data)) {
          if (isRectoria(user)) {
            setDepartmentsList(res.data);
          } else {
            if (user?.departmentId) {
              const filtered = res.data.filter(d => d.key === user.departmentId);
              setDepartmentsList(filtered);
            } else {
              setDepartmentsList([]);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    };
    fetchDepts();
  }, [user]);

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
          const status = m.lifecycleStatus || 'ACTIVA';
          setLifecycleStatus(status);

          const isClosed = status === 'CERRADA';
          if (!isClosed && m.permissions?.canEdit !== true) {
            navigate('/metas', { replace: true });
            return;
          }
          setIsReadOnly(isClosed);

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
          setCreadaPor(user?.username || 'Jane Doe');
          
          const rawMetrics = (status === 'BORRADOR' && Array.isArray(m.draftMetrics) && m.draftMetrics.length > 0)
            ? m.draftMetrics
            : (Array.isArray(m.metrics) ? m.metrics : []);

          const mappedMetrics = rawMetrics.map((metric, index) => ({
            id: metric.id || index,
            nombre: metric.indicatorKey, // resolved dynamically in render using kpisList
            key: metric.indicatorKey,
            aporte: metric.weight !== undefined && metric.weight !== null ? Number(metric.weight) : '',
            comportamiento: metric.behavior || 'no-debe-superar',
            valor: metric.targetValue !== undefined && metric.targetValue !== null ? Number(metric.targetValue) : '',
            tipoValor: metric.valueType === 'percentage' ? 'porcentaje' : 'numerico',
            lowerLimit: metric.lowerLimit !== undefined && metric.lowerLimit !== null ? Number(metric.lowerLimit) : null,
            upperLimit: metric.upperLimit !== undefined && metric.upperLimit !== null ? Number(metric.upperLimit) : null
          }));
          setMetricas(mappedMetrics);
        }
      } catch (err) {
        console.error('Error fetching meta from backend:', err);
      }
    };
    fetchMeta();
  }, [id, navigate, user]);

  // Compute Total Metrics Aporte Percentage
  const totalAporte = useMemo(() => {
    return metricas.reduce((acc, curr) => acc + Number(curr.aporte), 0);
  }, [metricas]);

  // Limpiar aviso de límite de métricas cuando el total baje de 100%
  useEffect(() => {
    if (totalAporte < 100 && metricLimitAlert) {
      setMetricLimitAlert('');
    }
  }, [totalAporte, metricLimitAlert]);

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
    if (totalAporte >= 100) {
      setMetricLimitAlert('La suma de aportes ya alcanza el 100%. Para añadir otra métrica, reduce o edita el porcentaje de las existentes.');
      return;
    }
    setMetricLimitAlert('');
    setEditMetricIndex(null);
    setMetricSearch('');
    setMetricNombre('');
    setMetricAporte('');
    setMetricComportamiento('no-debe-superar');
    setMetricValorTipo('numerico');
    setMetricValor('');
    setMetricLowerLimit('');
    setMetricUpperLimit('');
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
    setMetricLowerLimit(item.lowerLimit !== undefined && item.lowerLimit !== null ? item.lowerLimit : '');
    setMetricUpperLimit(item.upperLimit !== undefined && item.upperLimit !== null ? item.upperLimit : '');
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

    let targetVal = Number(metricValor);
    let lowerLim = null;
    let upperLim = null;

    if (metricComportamiento === 'debe-mantenerse-en-rango') {
      if (metricLowerLimit === '' || isNaN(Number(metricLowerLimit)) || Number(metricLowerLimit) < 0) {
        setMetricModalError('El límite inferior debe ser un número positivo o cero');
        return;
      }
      if (metricUpperLimit === '' || isNaN(Number(metricUpperLimit)) || Number(metricUpperLimit) <= 0) {
        setMetricModalError('El límite superior debe ser un número positivo');
        return;
      }
      lowerLim = Number(metricLowerLimit);
      upperLim = Number(metricUpperLimit);
      if (lowerLim >= upperLim) {
        setMetricModalError('El límite inferior debe ser menor al límite superior');
        return;
      }
      // Para cumplir con la restricción del backend, targetValue se asigna al límite superior
      targetVal = upperLim;
    } else {
      if (!metricValor || Number(metricValor) <= 0) {
        setMetricModalError('El valor esperado debe ser un número positivo');
        return;
      }
    }

    const selectedKpiObj = kpisList.find(k => k.name === metricNombre);
    const payload = {
      id: editMetricIndex !== null ? metricas[editMetricIndex].id : Date.now(),
      nombre: metricNombre,
      key: selectedKpiObj ? selectedKpiObj.key : '',
      aporte: valAporte,
      comportamiento: metricComportamiento,
      valor: targetVal,
      tipoValor: metricValorTipo,
      lowerLimit: lowerLim,
      upperLimit: upperLim
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
  const validateDraftForm = () => {
    const isDateInvalid = inicio && limite && new Date(limite) < new Date(inicio);
    const nextErrors = {
      nombre: !nombre.trim(),
      departamento: !departamento,
      inicio: !inicio,
      limite: !limite || isDateInvalid,
    };
    setErrors(nextErrors);
    const hasFieldErrors = Object.values(nextErrors).some(Boolean);
    if (hasFieldErrors) {
      setShowSaveAlert(true);
      return false;
    }
    setShowSaveAlert(false);
    return true;
  };

  const handleSaveDraft = async () => {
    if (isReadOnly) return;
    if (!validateDraftForm()) return;
    try {
      const derivedAnio = deriveAnio(inicio);
      const derivedPeriodo = derivePeriodo(inicio, limite);

      const payload = {
        lifecycleStatus: 'BORRADOR',
        departmentId: departamento || null,
        anio: derivedAnio,
        periodo: derivedPeriodo,
        nombre: nombre,
        inicio: inicio || null,
        limite: limite || null,
        fechaInicio: inicio || null,
        fechaLimite: limite || null,
        prioridad: prioridad || null,
        comportamiento: comportamiento || null,
        draftMetrics: metricas.map((m) => ({
          indicatorKey: m.key || null,
          weight: m.aporte !== '' && m.aporte !== null && m.aporte !== undefined ? Number(m.aporte) : null,
          behavior: m.comportamiento || null,
          targetValue: m.valor !== '' && m.valor !== null && m.valor !== undefined ? Number(m.valor) : null,
          valueType: m.tipoValor === 'numerico' ? 'number' : (m.tipoValor === 'porcentaje' ? 'percentage' : (m.tipoValor || null)),
          lowerLimit: m.lowerLimit !== undefined && m.lowerLimit !== null && m.lowerLimit !== '' ? Number(m.lowerLimit) : null,
          upperLimit: m.upperLimit !== undefined && m.upperLimit !== null && m.upperLimit !== '' ? Number(m.upperLimit) : null
        }))
      };

      await updateMeta(id, payload);

      setSuccessMsg('Borrador actualizado con éxito');
      setSuccessDesc('Los cambios en el borrador se han guardado correctamente.');
      setShowSuccessAlert(true);
    } catch (err) {
      console.error('Error updating draft meta:', err);
      alert(err.message || 'Hubo un error al guardar el borrador.');
    }
  };

  const validateForm = () => {
    const isDateInvalid = inicio && limite && new Date(limite) < new Date(inicio);
    const nextErrors = {
      nombre: !nombre.trim(),
      departamento: !departamento,
      inicio: !inicio,
      limite: !limite || isDateInvalid,
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

  const handlePublishMeta = async () => {
    if (isReadOnly) return;
    if (!validateForm()) return;
    try {
      const derivedAnio = deriveAnio(inicio);
      const derivedPeriodo = derivePeriodo(inicio, limite);

      const payload = {
        lifecycleStatus: 'ACTIVA',
        departmentId: departamento || null,
        anio: derivedAnio,
        periodo: derivedPeriodo,
        nombre: nombre,
        inicio: inicio || null,
        limite: limite || null,
        fechaInicio: inicio || null,
        fechaLimite: limite || null,
        prioridad: prioridad || null,
        comportamiento: comportamiento || null,
        metrics: metricas.map((m) => ({
          indicatorKey: m.key,
          weight: Number(m.aporte),
          behavior: m.comportamiento,
          targetValue: Number(m.valor),
          valueType: m.tipoValor === 'numerico' ? 'number' : (m.tipoValor === 'porcentaje' ? 'percentage' : m.tipoValor),
          lowerLimit: m.lowerLimit !== undefined && m.lowerLimit !== null ? Number(m.lowerLimit) : null,
          upperLimit: m.upperLimit !== undefined && m.upperLimit !== null ? Number(m.upperLimit) : null
        }))
      };

      await updateMeta(id, payload);
      setLifecycleStatus('ACTIVA');

      setSuccessMsg('Meta publicada con éxito');
      setSuccessDesc('La meta se ha publicado correctamente. Ya se encuentra activa.');
      setShowSuccessAlert(true);
    } catch (err) {
      console.error('Error publishing meta:', err);
      alert(err.message || 'Hubo un error al publicar la meta.');
    }
  };

  const handleSaveMeta = async () => {
    if (isReadOnly) return;
    if (lifecycleStatus === 'BORRADOR') {
      return handlePublishMeta();
    }
    if (!validateForm()) return;
    try {
      const derivedAnio = deriveAnio(inicio);
      const derivedPeriodo = derivePeriodo(inicio, limite);

      const payload = {
        lifecycleStatus: 'ACTIVA',
        departmentId: departamento || null,
        anio: derivedAnio,
        periodo: derivedPeriodo,
        nombre: nombre,
        inicio: inicio || null,
        limite: limite || null,
        fechaInicio: inicio || null,
        fechaLimite: limite || null,
        prioridad: prioridad || null,
        comportamiento: comportamiento || null,
        metrics: metricas.map((m) => ({
          indicatorKey: m.key,
          weight: Number(m.aporte),
          behavior: m.comportamiento,
          targetValue: Number(m.valor),
          valueType: m.tipoValor === 'numerico' ? 'number' : (m.tipoValor === 'porcentaje' ? 'percentage' : m.tipoValor),
          lowerLimit: m.lowerLimit !== undefined && m.lowerLimit !== null ? Number(m.lowerLimit) : null,
          upperLimit: m.upperLimit !== undefined && m.upperLimit !== null ? Number(m.upperLimit) : null
        }))
      };

      await updateMeta(id, payload);

      setSuccessMsg('Meta guardada con éxito');
      setSuccessDesc('La meta se ha editado correctamente.');
      setShowSuccessAlert(true);
    } catch (err) {
      console.error('Error saving meta:', err);
      alert(err.message || 'Hubo un error al guardar la meta.');
    }
  };

  const handleCloseMeta = async () => {
    try {
      setIsClosing(true);
      await closeMeta(id);
      setLifecycleStatus('CERRADA');
      setIsReadOnly(true);
      setCloseConfirmOpen(false);
      setSuccessMsg('Meta cerrada definitivamente');
      setSuccessDesc('La meta se ha cerrado y sus resultados finales han quedado congelados de forma inmutable.');
      setShowSuccessAlert(true);
    } catch (err) {
      console.error('Error closing meta:', err);
      alert(err.message || 'Hubo un error al cerrar la meta.');
    } finally {
      setIsClosing(false);
    }
  };

  const handleOpenPreview = () => {
    if (!validateForm()) return;
    setPreviewModalOpen(true);
  };

  const filteredDepartments = useMemo(() => {
    if (isRectoria(user)) {
      return departmentsList;
    }
    return departmentsList.filter(d => d.key !== 'institucional');
  }, [departmentsList, user]);

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
    departmentsList: filteredDepartments,
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
    metricLimitAlert,
    setMetricLimitAlert,
    showSuccessAlert,
    setShowSuccessAlert,
    successMsg,
    successDesc,
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
    metricLowerLimit,
    setMetricLowerLimit,
    metricUpperLimit,
    setMetricUpperLimit,
    metricModalError,
    totalAporte,
    filteredMetricsPool,
    handleOpenAddMetric,
    handleOpenEditMetric,
    handleSaveMetric,
    handleDeleteMetric,
    handleSaveDraft,
    handlePublishMeta,
    handleSaveMeta,
    handleCloseMeta,
    closeConfirmOpen,
    setCloseConfirmOpen,
    isClosing,
    lifecycleStatus,
    isReadOnly,
    handleOpenPreview
  };
};
