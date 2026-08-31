import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { getMetas, deleteMeta, getDepartments } from '../../../services/piadiApi';

const PRIORIDAD_RANK = { alta: 0, media: 1, baja: 2 };

export const useVisualizacionMetas = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Dynamic metas state from backend
  const [metas, setMetas] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBackendMetas = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMetas();
      if (res.success && Array.isArray(res.data)) {
        const DEPT_MAP = {
          'educacion_continua': 'Educación Continua',
          'vinculacion_medio': 'Vinculación con el Medio',
          'admision': 'Admisión',
          'relaciones_estudiantiles': 'Relaciones Estudiantiles',
          'desarrollo_curricular': 'Desarrollo Curricular',
          'innovacion': 'Innovación',
          'institucional': 'Institucional'
        };

        const mapped = res.data.map(m => {
          // Map backend status to frontend state
          let estado = 'en-curso';
          if (m.status === 'cumplida') estado = 'completada';
          else if (m.status === 'en_riesgo' || m.status === 'no_cumplida') estado = 'alerta';

          const firstMetric = m.metrics?.[0] || {};
          const actual = firstMetric.currentValue !== undefined && firstMetric.currentValue !== null ? Number(firstMetric.currentValue) : 0;
          const objetivo = Number(m.valorMeta || firstMetric.targetValue || 0);

          const deptName = DEPT_MAP[m.departmentId] || m.departmentId || 'Institucional';

          return {
            id: m.id,
            nombre: m.nombre || `Meta de ${deptName}`,
            area: deptName,
            departamento: deptName,
            departmentId: m.departmentId,
            estado: estado,
            actual: actual,
            objetivo: objetivo,
            progreso: Number(m.totalProgress || 0),
            prioridad: m.prioridad || 'media',
            inicio: (m.fechaInicio || m.inicio || '').slice(0, 10),
            fechaLimite: (m.fechaLimite || m.limite || '').slice(0, 10),
            comportamiento: firstMetric.behavior || m.comportamiento || 'debe-superar',
            lowerLimit: firstMetric.lowerLimit !== undefined ? firstMetric.lowerLimit : null,
            upperLimit: firstMetric.upperLimit !== undefined ? firstMetric.upperLimit : null,
            tipoValor: firstMetric.valueType || 'number'
          };
        });
        setMetas(mapped);
      }
    } catch (err) {
      console.error('Error loading metas:', err);
      setError('No se pudieron obtener las metas desde el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendMetas();
    const fetchDepts = async () => {
      try {
        const res = await getDepartments();
        if (res.success && Array.isArray(res.data)) {
          setDepartmentsList(res.data);
        }
      } catch (err) {
        console.error('Error loading departments:', err);
      }
    };
    fetchDepts();
  }, []);

  // Navigation and menus
  const [activeMenu, setActiveMenu] = useState('Metas');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [metaToDelete, setMetaToDelete] = useState(null);

  // Filter Collapse
  const [filtersVisible, setFiltersVisible] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('todas');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');

  // Sorting State
  const [sortField, setSortField] = useState('prioridad');
  const [sortDir, setSortDir] = useState('asc');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  // Pagination State
  const [paginaActual, setPaginaActual] = useState(1);
  const pageSize = 5;

  // Toggle drawer/sidebar in mobile
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Toggle filters visibility
  const handleToggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Reset all filters to defaults
  const handleResetFilters = () => {
    setSearchQuery('');
    setFiltroDepartamento('todas');
    setFiltroEstado('todos');
    setFiltroDesde('');
    setFiltroHasta('');
    setPaginaActual(1);
  };

  // Compare function for sorting
  const compareMetas = (a, b) => {
    let r = 0;
    if (sortField === 'prioridad') {
      r = PRIORIDAD_RANK[a.prioridad] - PRIORIDAD_RANK[b.prioridad];
      if (sortDir === 'desc') r = -r;
      if (r !== 0) return r;
      // Empate por prioridad -> fecha límite más cercana
      return a.fechaLimite < b.fechaLimite ? -1 : a.fechaLimite > b.fechaLimite ? 1 : 0;
    }
    if (sortField === 'fecha') {
      r = a.fechaLimite < b.fechaLimite ? -1 : a.fechaLimite > b.fechaLimite ? 1 : 0;
      return sortDir === 'desc' ? -r : r;
    }
    if (sortField === 'progreso') {
      r = a.progreso - b.progreso;
      return sortDir === 'desc' ? -r : r;
    }
    // Default: nombre
    r = a.nombre.localeCompare(b.nombre, 'es');
    return sortDir === 'desc' ? -r : r;
  };

  // Filtered and sorted metas
  const processedMetas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    
    const filtered = metas.filter(m => {
      if (q && !m.nombre.toLowerCase().includes(q) && !m.area.toLowerCase().includes(q)) return false;
      if (filtroDepartamento !== 'todas' && m.departmentId !== filtroDepartamento) return false;
      if (filtroEstado !== 'todos' && m.estado !== filtroEstado) return false;
      if (filtroDesde && m.fechaLimite < filtroDesde) return false;
      if (filtroHasta && m.fechaLimite > filtroHasta) return false;
      return true;
    });

    return filtered.sort(compareMetas);
  }, [metas, searchQuery, filtroDepartamento, filtroEstado, filtroDesde, filtroHasta, sortField, sortDir]);

  // Reset pagination on filter or search changes
  useEffect(() => {
    setPaginaActual(1);
  }, [searchQuery, filtroDepartamento, filtroEstado, filtroDesde, filtroHasta, sortField, sortDir]);

  // Paginated Metas
  const paginatedMetas = useMemo(() => {
    const start = (paginaActual - 1) * pageSize;
    return processedMetas.slice(start, start + pageSize);
  }, [processedMetas, paginaActual]);

  const totalPages = Math.ceil(processedMetas.length / pageSize) || 1;

  // Sorting action handlers
  const handleSortFieldChange = (field) => {
    setSortField(field);
    setSortDir('asc'); // Default asc when changing sort field
    setSortMenuOpen(false);
  };

  const handleToggleSortDir = () => {
    setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Helper date formatter
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const fmtFecha = (iso) => {
    if (!iso) return '';
    const p = iso.split('-');
    return `${parseInt(p[2], 10)} ${MESES[parseInt(p[1], 10) - 1]} ${p[0]}`;
  };

  // Calculate days remaining helper
  const diasHasta = (iso) => {
    if (!iso) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const limite = new Date(iso + 'T00:00:00');
    const diffTime = limite - hoy;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 0 ? null : diffDays;
  };

  // FAQ Data for Help Dialog
  const faqData = [
    {
      q: '¿Qué son las metas y cómo se usan?',
      a: 'Las metas son objetivos específicos que puedes rastrear a lo largo del tiempo. Cada meta tiene un progreso medido en porcentaje, fechas de inicio y término, prioridad (Alta, Media, Baja) y un estado (Completada, En progreso, o Requiere atención). Las barras de progreso muestran visualmente qué tan cerca estás de cumplir cada meta.'
    },
    {
      q: '¿Cómo interpreto los indicadores?',
      a: 'Los indicadores muestran métricas clave como "Total de cursos dictados" o "Tasa de ejecución". El número principal es el valor actual, y la flecha con porcentaje indica el cambio comparado con el periodo anterior. Una flecha verde hacia arriba significa mejora.'
    },
    {
      q: '¿Cómo navego entre secciones?',
      a: 'Usa el menú lateral izquierdo para moverte entre Inicio, Dashboards, Metas y otras secciones. La sección activa se muestra con fondo verde azulado y una barra blanca en el borde izquierdo.'
    },
    {
      q: '¿Qué significan los colores en las metas?',
      a: 'Verde indica meta completada (100% o más), azul indica meta en progreso (menos de 100%), y rojo indica que requiere atención (alerta).'
    }
  ];

  const handleOpenDeleteDialog = (metaId) => {
    setMetaToDelete(metaId);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setMetaToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!metaToDelete) return;
    try {
      await deleteMeta(metaToDelete);
      await fetchBackendMetas();
    } catch (err) {
      console.error('Error deleting meta:', err);
      alert('Hubo un error al eliminar la meta en el servidor.');
    } finally {
      handleCloseDeleteDialog();
    }
  };

  const kpis = useMemo(() => {
    const total = metas.length;
    if (total === 0) {
      return { total: 0, cumplimiento: 0, riesgo: 0 };
    }
    const sumProgress = metas.reduce((sum, m) => sum + Number(m.progreso || 0), 0);
    const cumplimiento = Math.round((metas.filter(m => m.estado === 'completada').length / total) * 100);
    const riesgo = metas.filter(m => m.estado === 'alerta').length;
    
    return { total, cumplimiento, riesgo };
  }, [metas]);

  return {
    navigate,
    user,
    logout,
    activeMenu,
    setActiveMenu,
    mobileOpen,
    setMobileOpen,
    openHelpDialog,
    setOpenHelpDialog,
    filtersVisible,
    handleToggleFilters,
    handleResetFilters,
    searchQuery,
    setSearchQuery,
    filtroDepartamento,
    setFiltroDepartamento,
    filtroEstado,
    setFiltroEstado,
    filtroDesde,
    setFiltroDesde,
    filtroHasta,
    setFiltroHasta,
    sortField,
    sortDir,
    sortMenuOpen,
    setSortMenuOpen,
    handleSortFieldChange,
    handleToggleSortDir,
    paginaActual,
    setPaginaActual,
    pageSize,
    totalPages,
    paginatedMetas,
    totalMetas: processedMetas.length,
    totalMetasOriginal: metas.length,
    loading,
    error,
    kpis,
    departmentsList,
    deleteDialogOpen,
    metaToDelete,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    handleDrawerToggle,
    fmtFecha,
    diasHasta,
    faqData
  };
};
