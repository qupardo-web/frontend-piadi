import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';

const INITIAL_METAS = [
  { id: 1, nombre: 'Total de 200 matriculados en cursos', area: 'Vicerrectoría Académica', estado: 'completada', actual: 240, objetivo: 200, progreso: 120.00, departamento: 'Admisión', prioridad: 'media', inicio: '2025-08-01', fechaLimite: '2026-06-14' },
  { id: 2, nombre: 'Total de 20 cursos ejecutados', area: 'Dir. Educación Continua', estado: 'en-curso', actual: 8, objetivo: 20, progreso: 40.00, departamento: 'Educación Continua', prioridad: 'alta', inicio: '2025-09-01', fechaLimite: '2026-08-20' },
  { id: 3, nombre: 'Reducir tasa de abandono bajo 30%', area: 'Dir. Relaciones Estudiantiles', estado: 'alerta', actual: 35, objetivo: 30, progreso: 85.00, departamento: 'Relaciones Estudiantiles', prioridad: 'alta', inicio: '2025-10-01', fechaLimite: '2026-06-14' },
  { id: 4, nombre: 'Aumentar matrícula nueva 15% Primavera', area: 'Vicerrectoría Académica', estado: 'en-curso', actual: 850, objetivo: 1250, progreso: 68.00, departamento: 'Admisión', prioridad: 'media', inicio: '2026-01-01', fechaLimite: '2026-07-31' },
  { id: 5, nombre: 'Alcanzar 80% estudiantes con beneficios', area: 'Vicerrectoría Académica', estado: 'completada', actual: 2880, objetivo: 3200, progreso: 90.00, departamento: 'Admisión', prioridad: 'baja', inicio: '2025-07-01', fechaLimite: '2026-06-30' },
  { id: 6, nombre: 'Reducir deserción primer año bajo 20%', area: 'Vicerrectoría Académica', estado: 'alerta', actual: 28, objetivo: 20, progreso: 45.00, departamento: 'Admisión', prioridad: 'alta', inicio: '2026-01-15', fechaLimite: '2026-12-31' }
];

const PRIORIDAD_RANK = { alta: 0, media: 1, baja: 2 };

export const useVisualizacionMetas = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Navigation and menus
  const [activeMenu, setActiveMenu] = useState('Metas');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);

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
    
    const filtered = INITIAL_METAS.filter(m => {
      if (q && !m.nombre.toLowerCase().includes(q) && !m.area.toLowerCase().includes(q)) return false;
      if (filtroDepartamento !== 'todas' && m.departamento !== filtroDepartamento) return false;
      if (filtroEstado !== 'todos' && m.estado !== filtroEstado) return false;
      if (filtroDesde && m.fechaLimite < filtroDesde) return false;
      if (filtroHasta && m.fechaLimite > filtroHasta) return false;
      return true;
    });

    return filtered.sort(compareMetas);
  }, [searchQuery, filtroDepartamento, filtroEstado, filtroDesde, filtroHasta, sortField, sortDir]);

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
      a: 'Las metas son objetivos específicos que puedes rastrear a lo largo del tiempo. Cada meta tiene un progreso medido en porcentaje, fechas de inicio y término, y un estado (Completada, En progreso, o Requiere atención). Las barras de progreso muestran visualmente qué tan cerca estás de cumplir cada meta.'
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
    totalMetasOriginal: INITIAL_METAS.length,
    handleDrawerToggle,
    fmtFecha,
    diasHasta,
    faqData
  };
};
