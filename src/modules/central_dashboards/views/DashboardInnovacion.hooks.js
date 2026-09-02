import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { 
  getDepartmentFilters, 
  getDashboardSummary, 
  getIndicatorSeries, 
  getIndicatorBreakdown 
} from '../../../services/piadiApi';

export const YEARS = [2023, 2024, 2025, 2026];

export const CAT_COLORS = [
  '#3EC9FF', '#1FA8D9', '#2563EB', '#7C6FF0', '#4CD18F', '#F5A623', '#6B7280', '#0E86B8'
];

export const INDICATORS = {
  'proyectos-activos': {
    title: 'Proyectos de innovación en curso',
    desc: 'Número de proyectos activos durante el período. Se considera activo si el año de inicio es menor o igual al año de reporte y el año de término es mayor o igual.',
    metric: { label: 'Proyectos en curso', value: 0 },
    trend: { delta: 0, baseline: '2025' },
    meta: { target: 20 },
    rows: [],
    state: 'data'
  },
  'proyectos-finalizados': {
    title: 'Proyectos finalizados',
    desc: 'Proyectos concluidos en el período, con resultados principales y evidencia de cierre.',
    metric: { label: 'Proyectos finalizados', value: 0 },
    trend: { delta: 0, baseline: '2025' },
    meta: { target: 10 },
    rows: [],
    state: 'data'
  },
  'proyectos-areas': {
    title: 'Áreas temáticas de innovación',
    desc: 'Clasificación de proyectos según área temática: pedagógica, tecnológica, gestión institucional, inclusión, articulación TP, empleabilidad, tributaria/contable o sostenibilidad.',
    metric: { label: 'Proyectos', value: 0 },
    rows: [],
    colLabels: ['Área temática', 'Proyectos'],
    state: 'data'
  },
  'secciones': {
    title: 'Secciones del curso de innovación',
    desc: 'Número de secciones del curso Emprendimiento e Innovación por semestre.',
    metric: { label: 'Secciones', value: 0 },
    trend: { delta: 0, baseline: '2025' },
    rows: [],
    colLabels: ['Semestre', 'Secciones'],
    state: 'data'
  },
  'docentes': {
    title: 'Docentes/funcionarios involucrados',
    desc: 'Número de personas institucionales que participan en proyectos de innovación durante el año.',
    metric: { label: 'Personas', value: 0 },
    trend: { delta: 0, baseline: '2025' },
    meta: { target: 50 },
    rows: [],
    state: 'data'
  },
  'financiamiento': {
    title: 'Proyectos con financiamiento externo',
    desc: 'Proyectos con fondos concursables u otras fuentes externas.',
    metric: { label: 'Proyectos FDI', value: 0 },
    trend: { delta: 0, baseline: '2025' },
    meta: { target: 8 },
    rows: [],
    colLabels: ['Año', 'Proyectos'],
    state: 'data'
  }
};

export const useDashboardInnovacion = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Estados de layout y diálogo
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // Estados de filtros
  const [yearRange, setYearRange] = useState([2023, 2026]);
  const [selectedChips, setSelectedChips] = useState({
    estado: [],
    area: [],
    tipo: [],
    semestre: [],
    externo: [],
    fuente: []
  });

  // Acordeones abiertos
  const [accordionsOpen, setAccordionsOpen] = useState({
    estado: true,
    area: true,
    tipo: false,
    semestre: false,
    financiamiento: false
  });

  // Secciones colapsadas
  const [collapsedSections, setCollapsedSections] = useState({
    'proy-year': false,
    'fin-year': false,
    'proy-area': false,
    'secciones-hbar': false,
    'doc-line': false,
    'fin-externo': false
  });

  // Estado del Drawer de Indicador
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentIndicatorKey, setCurrentIndicatorKey] = useState('proyectos-activos');
  const [drawerPeriodIndex, setDrawerPeriodIndex] = useState(YEARS.length - 1);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Estados de API y carga real
  const [apiSummary, setApiSummary] = useState(null);
  const [apiFilters, setApiFilters] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiProyectos, setApiProyectos] = useState([]);

  // Fetch de filtros del departamento
  useEffect(() => {
    getDepartmentFilters('innovacion')
      .then(res => {
        if (res?.success && res.data) {
          setApiFilters(res.data);
          const years = res.data?.filters?.years ?? [];
          if (years.length > 0) {
            setYearRange([Math.min(...years), Math.max(...years)]);
          }
        }
      })
      .catch(err => console.error('Error cargando filtros de Innovación:', err));
  }, []);

  // Fetch de datos del dashboard desde la API
  useEffect(() => {
    setApiLoading(true);
    const params = {
      department: 'innovacion',
      fromYear: String(yearRange[0]),
      toYear: String(yearRange[1]),
    };
    if (yearRange[0] === yearRange[1]) {
      params.year = String(yearRange[0]);
      delete params.fromYear;
      delete params.toYear;
    }

    getDashboardSummary(params)
      .then(res => {
        if (res?.success && res.data) {
          setApiSummary(res.data.summary || null);
          setApiProyectos(res.data.items || res.data.proyectos || []);
        } else {
          setApiSummary(null);
          setApiProyectos([]);
        }
      })
      .catch(err => {
        console.error('Error cargando datos de Innovación:', err);
        setApiSummary(null);
        setApiProyectos([]);
      })
      .finally(() => {
        setApiLoading(false);
      });
  }, [yearRange, selectedChips]);

  // Tooltip interactivo global
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    label: '',
    detail: ''
  });

  // Helper para coincidencia flexible de chips
  const matchVal = (selectedArr, itemVal) => {
    if (!selectedArr || selectedArr.length === 0) return true;
    const normalize = (s) => String(s || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
    const target = normalize(itemVal);
    return selectedArr.some(sel => {
      const nSel = normalize(sel);
      return nSel === target || target.includes(nSel) || nSel.includes(target);
    });
  };

  // Listas dinámicas obtenidas de la base de datos (apiFilters)
  const dynamicEstados = useMemo(() => {
    return (apiFilters?.filters?.estados ?? []).map(e => ({ label: e, value: e }));
  }, [apiFilters]);

  const dynamicAreas = useMemo(() => {
    return (apiFilters?.filters?.areas ?? []).map(a => ({ label: a, value: a }));
  }, [apiFilters]);

  const dynamicTipos = useMemo(() => {
    return (apiFilters?.filters?.tipos ?? []).map(t => ({ label: t, value: t }));
  }, [apiFilters]);

  const dynamicSemestres = useMemo(() => {
    return (apiFilters?.filters?.semesters ?? []).map(s => ({ label: s, value: s }));
  }, [apiFilters]);

  const dynamicFuentes = useMemo(() => {
    return (apiFilters?.filters?.fuentes ?? []).map(f => ({ label: f, value: f }));
  }, [apiFilters]);

  const dynamicExternos = useMemo(() => {
    return (apiFilters?.filters?.externos ?? []).map(ex => ({ label: ex, value: ex }));
  }, [apiFilters]);

  // Filtrado reactivo de proyectos desde la API
  const filteredProjects = useMemo(() => {
    if (!apiProyectos || apiProyectos.length === 0) return [];
    return apiProyectos.filter(item => {
      const itemYear = Number(item.year || item.anio || item.periodo || 0);
      if (itemYear && (itemYear < yearRange[0] || itemYear > yearRange[1])) return false;
      if (!matchVal(selectedChips.estado, item.estado)) return false;
      if (!matchVal(selectedChips.area, item.area || item.areaTematica)) return false;
      if (!matchVal(selectedChips.tipo, item.tipo || item.tipoProyecto)) return false;
      if (!matchVal(selectedChips.semestre, item.semestre)) return false;
      if (!matchVal(selectedChips.externo, item.externo || item.financiamientoExterno)) return false;
      if (!matchVal(selectedChips.fuente, item.fuente || item.fuenteFinanciamiento)) return false;
      return true;
    });
  }, [apiProyectos, yearRange, selectedChips]);

  const hasData = useMemo(() => {
    if (apiSummary) {
      return Object.values(apiSummary).some(card => card.hasData || (card.value !== undefined && card.value !== null && card.value !== 0));
    }
    return filteredProjects.length > 0;
  }, [apiSummary, filteredProjects]);

  // Años activos en el rango
  const visibleYears = useMemo(() => {
    return YEARS.filter(y => y >= yearRange[0] && y <= yearRange[1]);
  }, [yearRange]);

  // Series calculadas dinámicamente según filtros
  const proyActivos = useMemo(() => {
    if (!hasData) return visibleYears.map(() => 0);
    return visibleYears.map(y => {
      return filteredProjects.filter(p => p.year === y && p.estado === 'En curso').length;
    });
  }, [filteredProjects, visibleYears, hasData]);

  const proyFinalizados = useMemo(() => {
    if (!hasData) return visibleYears.map(() => 0);
    return visibleYears.map(y => {
      return filteredProjects.filter(p => p.year === y && p.estado === 'Finalizado').length;
    });
  }, [filteredProjects, visibleYears, hasData]);

  const proyAreas = useMemo(() => {
    if (!hasData) return [];
    const counts = {};
    filteredProjects.forEach(p => {
      counts[p.area] = (counts[p.area] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredProjects, hasData]);

  const seccionesCurso = useMemo(() => {
    if (!hasData) return [];
    const baseSemestres = [
      { label: 'Otoño 2025', count: 4, year: 2025, sem: 'Otoño' },
      { label: 'Primavera 2025', count: 4, year: 2025, sem: 'Primavera' },
      { label: 'Otoño 2026', count: 5, year: 2026, sem: 'Otoño' },
      { label: 'Primavera 2026', count: 5, year: 2026, sem: 'Primavera' }
    ];
    return baseSemestres
      .filter(s => s.year >= yearRange[0] && s.year <= yearRange[1])
      .filter(s => selectedChips.semestre.length === 0 || selectedChips.semestre.includes(s.sem))
      .map(s => ({ label: s.label, value: s.count }));
  }, [yearRange, selectedChips.semestre, hasData]);

  const docentes = useMemo(() => {
    if (!hasData) return visibleYears.map(() => 0);
    return visibleYears.map(y => {
      return filteredProjects
        .filter(p => p.year === y)
        .reduce((sum, p) => sum + (p.docentes || 0), 0);
    });
  }, [filteredProjects, visibleYears, hasData]);

  const finExterno = useMemo(() => {
    if (!hasData) return visibleYears.map(() => 0);
    return visibleYears.map(y => {
      return filteredProjects.filter(p => p.year === y && p.externo === 'Sí').length;
    });
  }, [filteredProjects, visibleYears, hasData]);

  // KPIs dinámicos
  const kpis = useMemo(() => {
    if (!hasData) {
      return {
        activos: { val: '—', baseVal: '—', evo: null, isPositive: true },
        finalizados: { val: '—', baseVal: '—', evo: null, isPositive: true },
        docentes: { val: '—', baseVal: '—', evo: null, isPositive: true }
      };
    }
    const totActivos = filteredProjects.filter(p => p.estado === 'En curso').length;
    const totFinalizados = filteredProjects.filter(p => p.estado === 'Finalizado').length;
    const totDocentes = filteredProjects.reduce((sum, p) => sum + (p.docentes || 0), 0);

    const firstYear = visibleYears[0];
    const lastYear = visibleYears[visibleYears.length - 1];

    const activosBase = filteredProjects.filter(p => p.year === firstYear && p.estado === 'En curso').length;
    const finalizadosBase = filteredProjects.filter(p => p.year === firstYear && p.estado === 'Finalizado').length;
    const docentesBase = filteredProjects.filter(p => p.year === firstYear).reduce((sum, p) => sum + (p.docentes || 0), 0);

    const activosNow = filteredProjects.filter(p => p.year === lastYear && p.estado === 'En curso').length;
    const finalizadosNow = filteredProjects.filter(p => p.year === lastYear && p.estado === 'Finalizado').length;
    const docentesNow = filteredProjects.filter(p => p.year === lastYear).reduce((sum, p) => sum + (p.docentes || 0), 0);

    const calcEvo = (now, base) => {
      if (base === 0) return now > 0 ? 100 : 0;
      return Math.round(((now - base) / base) * 100);
    };

    return {
      activos: {
        val: totActivos,
        baseYear: firstYear,
        baseVal: activosBase,
        evo: firstYear !== lastYear ? calcEvo(activosNow, activosBase) : null,
        isPositive: activosNow >= activosBase
      },
      finalizados: {
        val: totFinalizados,
        baseYear: firstYear,
        baseVal: finalizadosBase,
        evo: firstYear !== lastYear ? calcEvo(finalizadosNow, finalizadosBase) : null,
        isPositive: finalizadosNow >= finalizadosBase
      },
      docentes: {
        val: totDocentes,
        baseYear: firstYear,
        baseVal: docentesBase,
        evo: firstYear !== lastYear ? calcEvo(docentesNow, docentesBase) : null,
        isPositive: docentesNow >= docentesBase
      }
    };
  }, [filteredProjects, visibleYears, hasData]);

  // Conteo de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (yearRange[0] !== 2023 || yearRange[1] !== 2026) count += 1;
    Object.values(selectedChips).forEach(arr => {
      count += arr.length;
    });
    return count;
  }, [yearRange, selectedChips]);

  // Manejo de Chips
  const handleToggleChip = useCallback((group, value) => {
    setSelectedChips(prev => {
      const current = prev[group] || [];
      const exists = current.includes(value);
      return {
        ...prev,
        [group]: exists ? current.filter(v => v !== value) : [...current, value]
      };
    });
  }, []);

  // Restablecer filtros
  const handleResetFilters = useCallback(() => {
    setYearRange([2023, 2026]);
    setSelectedChips({
      estado: [],
      area: [],
      tipo: [],
      semestre: [],
      externo: [],
      fuente: []
    });
  }, []);

  // Toggle de secciones de gráficos
  const handleToggleSection = useCallback((key) => {
    setCollapsedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  // Toggle de acordeones de filtros
  const handleToggleAccordion = useCallback((accKey) => {
    setAccordionsOpen(prev => ({
      ...prev,
      [accKey]: !prev[accKey]
    }));
  }, []);

  // Manejo de apertura de Drawer
  const handleOpenIndicator = useCallback((key) => {
    setCurrentIndicatorKey(key || 'proyectos-activos');
    setDrawerPeriodIndex(YEARS.length - 1);
    setDrawerLoading(true);
    setDrawerOpen(true);

    setTimeout(() => {
      setDrawerLoading(false);
    }, 350);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleDrawerStep = useCallback((dir) => {
    setDrawerPeriodIndex(prev => {
      const next = prev + dir;
      if (next < 0 || next >= YEARS.length) return prev;
      return next;
    });
  }, []);

  // Manejo de Tooltip
  const showTooltip = useCallback((label, detail, e) => {
    const rect = e.currentTarget?.getBoundingClientRect?.() || { left: e.clientX, top: e.clientY };
    setTooltip({
      visible: true,
      x: e.clientX || rect.left + 10,
      y: e.clientY || rect.top - 10,
      label,
      detail
    });
  }, []);

  const moveTooltip = useCallback((e) => {
    setTooltip(prev => ({
      ...prev,
      x: e.clientX,
      y: e.clientY
    }));
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  const handleDrawerToggle = () => setMobileOpen(prev => !prev);

  // FAQ Data
  const faqData = [
    {
      q: '¿Qué mide el Dashboard de Innovación?',
      a: 'Presenta el avance cuantitativo y cualitativo de proyectos de innovación, docentes involucrados, distribución temática y proyectos financiados institucionalmente o por fondos externos.'
    },
    {
      q: '¿Cómo se definen los proyectos en curso vs finalizados?',
      a: 'Un proyecto en curso se encuentra activo en el período actual y dentro de su ventana de vigencia. Los proyectos finalizados corresponden a iniciativas con cierre formal y resultados validados.'
    },
    {
      q: '¿Cómo interactúo con los gráficos?',
      a: 'Puedes hacer clic en cualquier tarjeta KPI o barra/segmento de los gráficos para abrir el panel de detalle lateral con su tabla histórica y métricas asociadas.'
    }
  ];

  return {
    navigate,
    user,
    logout,
    mobileOpen,
    handleDrawerToggle,
    openHelpDialog,
    setOpenHelpDialog,
    filtersCollapsed,
    setFiltersCollapsed,
    yearRange,
    setYearRange,
    selectedChips,
    handleToggleChip,
    handleResetFilters,
    activeFiltersCount,
    accordionsOpen,
    handleToggleAccordion,
    collapsedSections,
    handleToggleSection,
    drawerOpen,
    currentIndicator: INDICATORS[currentIndicatorKey] || INDICATORS['proyectos-activos'],
    drawerPeriodIndex,
    drawerLoading,
    handleOpenIndicator,
    handleCloseDrawer,
    handleDrawerStep,
    tooltip,
    showTooltip,
    moveTooltip,
    hideTooltip,
    faqData,
    apiLoading,
    apiFilters,
    dynamicEstados,
    dynamicAreas,
    dynamicTipos,
    dynamicSemestres,
    dynamicFuentes,
    dynamicExternos,
    // Datos
    hasData,
    kpis,
    visibleYears,
    proyActivos,
    proyFinalizados,
    proyAreas,
    seccionesCurso,
    docentes,
    finExterno,
    activeMenu: 'Dashboards',
  };
};
