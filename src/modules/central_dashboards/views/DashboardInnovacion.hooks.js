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
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
  const [proyectosActivosSeries, setProyectosActivosSeries] = useState([]);
  const [proyectosFinalizadosSeries, setProyectosFinalizadosSeries] = useState([]);
  const [proyectosAreasBreakdown, setProyectosAreasBreakdown] = useState([]);
  const [seccionesBreakdown, setSeccionesBreakdown] = useState([]);
  const [docentesSeries, setDocentesSeries] = useState([]);
  const [financiamientoSeries, setFinanciamientoSeries] = useState([]);

  // Tooltip interactivo
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    label: '',
    detail: ''
  });

  // Fetch de filtros del departamento
  useEffect(() => {
    getDepartmentFilters('innovacion')
      .then(res => {
        if (res?.data?.filters) {
          setApiFilters(res.data.filters);
          const years = res.data.filters.years ?? [];
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
    if (selectedChips.estado.length > 0) params.estado = selectedChips.estado;
    if (selectedChips.area.length > 0) params.area = selectedChips.area;
    if (selectedChips.tipo.length > 0) params.tipo = selectedChips.tipo;
    if (selectedChips.semestre.length > 0) params.semesters = selectedChips.semestre;

    Promise.allSettled([
      getDashboardSummary(params),
      getIndicatorSeries('proyectos_activos', params),
      getIndicatorSeries('proyectos_finalizados', params),
      getIndicatorBreakdown('total_proyectos', { ...params, groupBy: 'areaTematica' }),
      getIndicatorBreakdown('secciones_curso', { ...params, groupBy: 'semestre' }),
      getIndicatorSeries('docentes_involucrados', params),
      getIndicatorSeries('financiamiento_obtenido', params)
    ])
      .then(([summaryRes, activosRes, finalizadosRes, areasRes, seccionesRes, docentesRes, finRes]) => {
        console.group('🔍 [DEBUG INNOVACIÓN - Respuestas de la API]');
        console.log('📡 Parámetros enviados:', params);
        console.log('📊 1. Proyectos Activos:', activosRes.status === 'fulfilled' ? activosRes.value : activosRes.reason);
        console.log('📊 2. Proyectos Finalizados:', finalizadosRes.status === 'fulfilled' ? finalizadosRes.value : finalizadosRes.reason);
        console.log('📊 3. Áreas Temáticas:', areasRes.status === 'fulfilled' ? areasRes.value : areasRes.reason);
        console.log('📊 4. Secciones Curso:', seccionesRes.status === 'fulfilled' ? seccionesRes.value : seccionesRes.reason);
        console.log('📊 5. Docentes Involucrados:', docentesRes.status === 'fulfilled' ? docentesRes.value : docentesRes.reason);
        console.log('💰 6. Financiamiento Obtenido (FDI):', finRes.status === 'fulfilled' ? finRes.value : finRes.reason);
        console.groupEnd();

        if (summaryRes.status === 'fulfilled' && summaryRes.value?.data) {
          setApiSummary(summaryRes.value.data);
        } else {
          setApiSummary(null);
        }

        if (activosRes.status === 'fulfilled' && activosRes.value?.data?.points) {
          setProyectosActivosSeries(activosRes.value.data.points);
        } else {
          setProyectosActivosSeries([]);
        }

        if (finalizadosRes.status === 'fulfilled' && finalizadosRes.value?.data?.points) {
          setProyectosFinalizadosSeries(finalizadosRes.value.data.points);
        } else {
          setProyectosFinalizadosSeries([]);
        }

        if (areasRes.status === 'fulfilled' && areasRes.value?.data?.items) {
          setProyectosAreasBreakdown(areasRes.value.data.items);
        } else {
          setProyectosAreasBreakdown([]);
        }

        if (seccionesRes.status === 'fulfilled' && seccionesRes.value?.data?.items) {
          setSeccionesBreakdown(seccionesRes.value.data.items);
        } else {
          setSeccionesBreakdown([]);
        }

        if (docentesRes.status === 'fulfilled' && docentesRes.value?.data?.points) {
          setDocentesSeries(docentesRes.value.data.points);
        } else {
          setDocentesSeries([]);
        }

        if (finRes.status === 'fulfilled' && finRes.value?.data?.points) {
          setFinanciamientoSeries(finRes.value.data.points);
        } else {
          setFinanciamientoSeries([]);
        }
      })
      .catch(err => {
        console.error('Error cargando datos de Innovación:', err);
      })
      .finally(() => {
        setApiLoading(false);
      });

    // Función auxiliar disponible globalmente en la consola (F12) para pruebas directas
    window.debugFinanciamiento = async () => {
      console.log('🔄 Ejecutando prueba directa de financiamiento_obtenido...');
      try {
        const res = await getIndicatorSeries('financiamiento_obtenido', params);
        console.log('✅ Resultado directo de /api/indicators/financiamiento_obtenido/series:', res);
        return res;
      } catch (err) {
        console.error('❌ Error en prueba directa:', err);
      }
    };
  }, [yearRange, selectedChips]);

  // Listas dinámicas obtenidas de la base de datos (apiFilters)
  const dynamicEstados = useMemo(() => {
    return (apiFilters?.estados ?? []).map(e => ({ label: e, value: e }));
  }, [apiFilters]);

  const dynamicAreas = useMemo(() => {
    return (apiFilters?.areas ?? []).map(a => ({ label: a, value: a }));
  }, [apiFilters]);

  const dynamicTipos = useMemo(() => {
    return (apiFilters?.tipos ?? []).map(t => ({ label: t, value: t }));
  }, [apiFilters]);

  const dynamicSemestres = useMemo(() => {
    return (apiFilters?.semesters ?? []).map(s => ({ label: s, value: s }));
  }, [apiFilters]);

  const dynamicFuentes = useMemo(() => {
    return (apiFilters?.fuentes ?? []).map(f => ({ label: f, value: f }));
  }, [apiFilters]);

  const dynamicExternos = useMemo(() => {
    return (apiFilters?.externos ?? []).map(ex => ({ label: ex, value: ex }));
  }, [apiFilters]);

  // Años disponibles calculados dinámicamente desde la BD
  const availableYears = useMemo(() => {
    const years = apiFilters?.years ?? [];
    return years.length > 0 ? [...years].sort((a, b) => a - b) : YEARS;
  }, [apiFilters]);

  const minYear = useMemo(() => {
    return availableYears.length > 0 ? availableYears[0] : 2023;
  }, [availableYears]);

  const maxYear = useMemo(() => {
    return availableYears.length > 0 ? availableYears[availableYears.length - 1] : 2026;
  }, [availableYears]);

  // Años activos en el rango seleccionado
  const visibleYears = useMemo(() => {
    const list = [];
    for (let y = yearRange[0]; y <= yearRange[1]; y++) {
      list.push(y);
    }
    return list.length > 0 ? list : availableYears;
  }, [yearRange, availableYears]);

  // Verificación estricta de existencia de datos reales
  const hasData = useMemo(() => {
    const hasActivos = proyectosActivosSeries.length > 0 && proyectosActivosSeries.some(p => p.value > 0);
    const hasFinalizados = proyectosFinalizadosSeries.length > 0 && proyectosFinalizadosSeries.some(p => p.value > 0);
    const hasAreas = proyectosAreasBreakdown.length > 0 && proyectosAreasBreakdown.some(a => a.value > 0);
    const hasSecciones = seccionesBreakdown.length > 0 && seccionesBreakdown.some(s => s.value > 0);
    const hasDocentes = docentesSeries.length > 0 && docentesSeries.some(d => d.value > 0);
    const hasFin = financiamientoSeries.length > 0 && financiamientoSeries.some(f => f.value > 0);
    return hasActivos || hasFinalizados || hasAreas || hasSecciones || hasDocentes || hasFin;
  }, [proyectosActivosSeries, proyectosFinalizadosSeries, proyectosAreasBreakdown, seccionesBreakdown, docentesSeries, financiamientoSeries]);

  // 1. Proyectos activos por año
  const proyActivos = useMemo(() => {
    const pointsMap = new Map(proyectosActivosSeries.map(p => [Number(p.year), Number(p.value)]));
    return visibleYears.map(y => pointsMap.get(y) ?? 0);
  }, [proyectosActivosSeries, visibleYears]);

  // 2. Proyectos finalizados por año
  const proyFinalizados = useMemo(() => {
    const pointsMap = new Map(proyectosFinalizadosSeries.map(p => [Number(p.year), Number(p.value)]));
    return visibleYears.map(y => pointsMap.get(y) ?? 0);
  }, [proyectosFinalizadosSeries, visibleYears]);

  // 3. Áreas temáticas de proyectos (Donut / PieChart)
  const proyAreas = useMemo(() => {
    return proyectosAreasBreakdown
      .filter(item => Number(item.value) > 0)
      .map(item => ({ label: item.label, value: Number(item.value) }));
  }, [proyectosAreasBreakdown]);

  // 4. Secciones del curso
  const seccionesCurso = useMemo(() => {
    return seccionesBreakdown
      .filter(item => Number(item.value) > 0)
      .map(item => ({ label: item.label, value: Number(item.value) }));
  }, [seccionesBreakdown]);

  // 5. Docentes involucrados por año
  const docentes = useMemo(() => {
    const pointsMap = new Map(docentesSeries.map(p => [Number(p.year), Number(p.value)]));
    return visibleYears.map(y => pointsMap.get(y) ?? 0);
  }, [docentesSeries, visibleYears]);

  // 6. Proyectos con financiamiento externo por año
  const finExterno = useMemo(() => {
    const pointsMap = new Map(financiamientoSeries.map(f => [Number(f.year), Number(f.value)]));
    return visibleYears.map(y => pointsMap.get(y) ?? 0);
  }, [financiamientoSeries, visibleYears]);

  // KPIs dinámicos calculados por año actual (límite superior) vs año base (límite inferior)
  const kpis = useMemo(() => {
    if (!hasData) {
      return {
        activos: { val: '—', baseVal: '—', evo: null, isPositive: true, compareText: null },
        finalizados: { val: '—', baseVal: '—', evo: null, isPositive: true, compareText: null },
        docentes: { val: '—', baseVal: '—', evo: null, isPositive: true, compareText: null }
      };
    }

    const yHasta = yearRange[1];
    const yDesde = yearRange[0];
    const isSingleYear = yDesde === yHasta;

    const calcKpi = (seriesPoints) => {
      const pointsMap = new Map(seriesPoints.map(p => [Number(p.year), Number(p.value)]));
      const vHasta = pointsMap.get(yHasta) ?? 0;
      const vDesde = pointsMap.get(yDesde) ?? 0;

      if (isSingleYear) {
        return {
          val: String(vHasta),
          baseYear: yDesde,
          baseVal: vDesde,
          compareText: `Línea base (${yDesde})`,
          evo: null,
          isPositive: true
        };
      }

      let evo = null;
      let isPositive = true;

      if (vDesde > 0) {
        const diff = vHasta - vDesde;
        const pct = Math.round((diff / vDesde) * 100);
        evo = `${pct >= 0 ? '+' : ''}${pct}%`;
        isPositive = pct >= 0;
      } else if (vHasta > 0) {
        evo = '+100%';
        isPositive = true;
      } else {
        evo = '0%';
        isPositive = true;
      }

      return {
        val: String(vHasta),
        baseYear: yDesde,
        baseVal: vDesde,
        compareText: `vs base (${yDesde}): ${vDesde}`,
        evo,
        isPositive
      };
    };

    return {
      activos: calcKpi(proyectosActivosSeries),
      finalizados: calcKpi(proyectosFinalizadosSeries),
      docentes: calcKpi(docentesSeries)
    };
  }, [hasData, yearRange, proyectosActivosSeries, proyectosFinalizadosSeries, docentesSeries]);

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
    setYearRange([minYear, maxYear]);
    setSelectedChips({
      estado: [],
      area: [],
      tipo: [],
      semestre: [],
      externo: [],
      fuente: []
    });
  }, [minYear, maxYear]);

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
    mobileFiltersOpen,
    setMobileFiltersOpen,
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
    availableYears,
    minYear,
    maxYear,
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
