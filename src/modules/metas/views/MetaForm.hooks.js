// =========================================================================
// ARCHIVO DE HOOKS: MetaForm.hooks.js
// =========================================================================

import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../auth';

export const METRICAS_POOL = [
  'Total de deserciones', 
  'Tasa de abandono', 
  'Matriculados nuevos', 
  'Estudiantes con beneficios',
  'Cursos ejecutados', 
  'Actividades VcM', 
  'Participantes en actividades', 
  'Convenios vigentes',
  'Convenios firmados', 
  'Articulaciones TP', 
  'Docentes capacitados', 
  'Titulados ECAS',
  'Empresas vinculadas', 
  'Visitas técnicas', 
  'Charlas especializadas', 
  'Proyectos de innovación',
  'Estudiantes EMTP', 
  'Apoderados participantes'
];

const MOCK_EDITAR = {
  nombre: 'Menos de 40 deserciones en el primer semestre',
  departamento: 'Admisión',
  comportamiento: 'no-debe-superar',
  inicio: '2026-03-13',
  limite: '2026-06-28',
  prioridad: 'alta',
  creadaPor: 'Jane Doe',
  metricas: [
    { id: 1, nombre: 'Total de deserciones', aporte: 100, comportamiento: 'no-debe-superar', valor: 40, tipoValor: 'numerico' }
  ]
};

export const useMetaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Form Mode: 'crear' or 'editar'
  const [modo, setModo] = useState(id ? 'editar' : 'crear');

  // Sidebar controls
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('Metas');

  // Form Fields State
  const [nombre, setNombre] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [comportamiento, setComportamiento] = useState('no-debe-superar');
  const [inicio, setInicio] = useState('');
  const [limite, setLimite] = useState('');
  const [prioridad, setPrioridad] = useState('media');
  const [creadaPor, setCreadaPor] = useState('');
  const [metricas, setMetricas] = useState([]);

  // Load Edit Data if applicable
  useEffect(() => {
    if (modo === 'editar') {
      // In a real app we'd fetch this meta by ID. Here we load mock editing data.
      setNombre(MOCK_EDITAR.nombre);
      setDepartamento(MOCK_EDITAR.departamento);
      setComportamiento(MOCK_EDITAR.comportamiento);
      setInicio(MOCK_EDITAR.inicio);
      setLimite(MOCK_EDITAR.limite);
      setPrioridad(MOCK_EDITAR.prioridad);
      setCreadaPor(MOCK_EDITAR.creadaPor);
      setMetricas(MOCK_EDITAR.metricas);
    } else {
      setNombre('');
      setDepartamento('');
      setComportamiento('no-debe-superar');
      setInicio('');
      setLimite('');
      setPrioridad('media');
      setCreadaPor(user?.username || 'Jane Doe');
      setMetricas([]);
    }
  }, [modo, user]);

  // Form validation errors
  const [errors, setErrors] = useState({
    nombre: false,
    departamento: false,
    inicio: false,
    limite: false,
  });
  const [showSaveAlert, setShowSaveAlert] = useState(false);

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

  // Compute Total Metrics Aporte Percentage
  const totalAporte = useMemo(() => {
    return metricas.reduce((acc, curr) => acc + Number(curr.aporte), 0);
  }, [metricas]);

  // Filter metrics pool for search
  const filteredMetricsPool = useMemo(() => {
    if (!metricSearch) return METRICAS_POOL;
    return METRICAS_POOL.filter(m => m.toLowerCase().includes(metricSearch.toLowerCase()));
  }, [metricSearch]);

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
    setMetricSearch(item.nombre);
    setMetricNombre(item.nombre);
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

    const payload = {
      id: editMetricIndex !== null ? metricas[editMetricIndex].id : Date.now(),
      nombre: metricNombre,
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

  // Form Actions (Save, Preview, Mode change)
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

  const handleSaveMeta = () => {
    if (!validateForm()) return;
    alert(modo === 'crear' ? 'Meta creada con éxito' : 'Meta guardada con éxito');
    navigate('/metas');
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
    setModo,
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
