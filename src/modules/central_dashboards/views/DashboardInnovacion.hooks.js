import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { 
  getDepartmentFilters, 
  getDashboardSummary, 
  getIndicatorSeries, 
  getIndicatorBreakdown,
  getIndicatorDetail
} from '../../../services/piadiApi';

export const YEARS = [2023, 2024, 2025, 2026];

export const CAT_COLORS = [
  '#3EC9FF', '#1FA8D9', '#2563EB', '#7C6FF0', '#4CD18F', '#F5A623', '#6B7280', '#0E86B8'
];

export const UI_TO_BACKEND_KEY = {
  'proyectos-activos': 'proyectos_activos',
  'total-proyectos': 'total_proyectos',
  'proy-area': 'total_proyectos',
  'financiamiento-obtenido': 'financiamiento_obtenido',
  'proyectos-externos': 'proyectos_con_financiamiento_externo',
  'proyectos-con-financiamiento-externo': 'proyectos_con_financiamiento_externo',
  'fin-externo': 'proyectos_con_financiamiento_externo',
  'proyectos-finalizados': 'proyectos_finalizados',
  'secciones-curso': 'secciones_curso',
  'secciones-hbar': 'secciones_curso',
  'docentes-involucrados': 'docentes_involucrados',
  'doc-line': 'docentes_involucrados'
};

export const INDICATOR_SPECIFIC_DIMENSION = {
  'proyectos-activos': null,
  'total-proyectos': 'areaTematica',
  'proy-area': 'areaTematica',
  'financiamiento-obtenido': 'fuente',
  'proyectos-externos': null,
  'proyectos-con-financiamiento-externo': null,
  'fin-externo': null,
  'proyectos-finalizados': null,
  'secciones-curso': 'semestre',
  'secciones-hbar': 'semestre',
  'docentes-involucrados': null,
  'doc-line': null
};

export const INDICATORS = {
  'proyectos-activos': {
    title: 'Proyectos de innovación activos',
    desc: 'Cantidad de proyectos de innovación activos durante el período consultado.',
    metric: { label: 'Proyectos activos', value: null },
    colLabels: ['Año', 'Proyectos'],
    state: 'data'
  },
  'proyectos-finalizados': {
    title: 'Proyectos finalizados',
    desc: 'Cantidad de proyectos de innovación finalizados en el año consultado con resultados validados.',
    metric: { label: 'Proyectos finalizados', value: null },
    colLabels: ['Año', 'Proyectos'],
    state: 'data'
  },
  'proy-area': {
    title: 'Áreas temáticas de innovación',
    desc: 'Distribución de proyectos según área temática abordada (desarrollo tecnológico, social, ambiental, etc.).',
    metric: { label: 'Área con más proyectos', value: null },
    colLabels: ['Área Temática', 'Proyectos'],
    state: 'data'
  },
  'secciones-curso': {
    title: 'Secciones del curso de innovación',
    desc: 'Cantidad de secciones del curso Emprendimiento e Innovación, agrupables por año y semestre.',
    metric: { label: 'Secciones activas', value: null },
    colLabels: ['Semestre', 'Secciones'],
    state: 'data'
  },
  'docentes-involucrados': {
    title: 'Docentes involucrados',
    desc: 'Cantidad de docentes y funcionarios involucrados en proyectos de innovación iniciados en el período.',
    metric: { label: 'Docentes involucrados', value: null },
    colLabels: ['Año', 'Docentes'],
    state: 'data'
  },
  'proyectos-con-financiamiento-externo': {
    title: 'Proyectos con financiamiento externo',
    desc: 'Cantidad de proyectos de Innovación que cuentan con adjudicación de financiamiento externo o fondos concursables.',
    metric: { label: 'Proyectos con financiamiento externo', value: null },
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

  const [periodoAcumulado, setPeriodoAcumulado] = useState(false);

  // Drawer de Detalle del indicador (PIADI-409)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentIndicatorKey, setCurrentIndicatorKey] = useState('proyectos-activos');
  const [drawerPeriod, setDrawerPeriod] = useState('2026');
  const [drawerGroupBy, setDrawerGroupBy] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState(null);
  const [apiIndicatorDetail, setApiIndicatorDetail] = useState(null);

  // Estados de API y carga real
  const [apiSummary, setApiSummary] = useState(null);
  const [apiFilters, setApiFilters] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [proyectosActivosSeries, setProyectosActivosSeries] = useState([]);
  const [proyectosFinalizadosSeries, setProyectosFinalizadosSeries] = useState([]);
  const [proyectosAreasBreakdown, setProyectosAreasBreakdown] = useState([]);
  const [seccionesOtonoSeries, setSeccionesOtonoSeries] = useState([]);
  const [seccionesPrimaveraSeries, setSeccionesPrimaveraSeries] = useState([]);
  const [seccionesBreakdown, setSeccionesBreakdown] = useState([]);
  const [docentesSeries, setDocentesSeries] = useState([]);
  const [financiamientoSeries, setFinanciamientoSeries] = useState([]);

  // Fetch de filtros del departamento
  useEffect(() => {
    getDepartmentFilters('innovacion')
      .then(res => {
        if (res?.data?.filters) {
          setApiFilters(res.data.filters);
          const years = res.data.filters.years ?? [];
          if (years.length > 0) {
            const min = Math.min(...years);
            const max = Math.max(...years);
            setYearRange([min, max]);
            setDrawerPeriod(String(max));
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

    const hasSemFilter = selectedChips.semestre.length > 0;
    const includeOtono = !hasSemFilter || selectedChips.semestre.some(s => s.toLowerCase().includes('otoño') || s.toLowerCase().includes('otono'));
    const includePrimavera = !hasSemFilter || selectedChips.semestre.some(s => s.toLowerCase().includes('primavera'));

    const otonoParams = includeOtono ? { ...params, semesters: ['Otoño'] } : null;
    const primaveraParams = includePrimavera ? { ...params, semesters: ['Primavera'] } : null;

    Promise.allSettled([
      getDashboardSummary(params),
      getIndicatorSeries('proyectos_activos', params),
      getIndicatorSeries('proyectos_finalizados', params),
      getIndicatorBreakdown('total_proyectos', { ...params, groupBy: 'areaTematica' }),
      otonoParams ? getIndicatorSeries('secciones_curso', otonoParams) : Promise.resolve({ data: { points: [] } }),
      primaveraParams ? getIndicatorSeries('secciones_curso', primaveraParams) : Promise.resolve({ data: { points: [] } }),
      getIndicatorBreakdown('secciones_curso', { ...params, groupBy: 'semestre' }),
      getIndicatorSeries('docentes_involucrados', params),
      getIndicatorSeries('proyectos_con_financiamiento_externo', params)
    ])
      .then(([summaryRes, activosRes, finalizadosRes, areasRes, otonoRes, primaveraRes, seccionesRes, docentesRes, finRes]) => {
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

        if (otonoRes.status === 'fulfilled' && otonoRes.value?.data?.points) {
          setSeccionesOtonoSeries(otonoRes.value.data.points);
        } else {
          setSeccionesOtonoSeries([]);
        }

        if (primaveraRes.status === 'fulfilled' && primaveraRes.value?.data?.points) {
          setSeccionesPrimaveraSeries(primaveraRes.value.data.points);
        } else {
          setSeccionesPrimaveraSeries([]);
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
    const hasSecciones = (seccionesOtonoSeries.length > 0 && seccionesOtonoSeries.some(s => s.value > 0)) ||
      (seccionesPrimaveraSeries.length > 0 && seccionesPrimaveraSeries.some(s => s.value > 0)) ||
      (seccionesBreakdown.length > 0 && seccionesBreakdown.some(s => s.value > 0));
    const hasDocentes = docentesSeries.length > 0 && docentesSeries.some(d => d.value > 0);
    const hasFin = financiamientoSeries.length > 0 && financiamientoSeries.some(f => f.value > 0);
    return hasActivos || hasFinalizados || hasAreas || hasSecciones || hasDocentes || hasFin;
  }, [proyectosActivosSeries, proyectosFinalizadosSeries, proyectosAreasBreakdown, seccionesOtonoSeries, seccionesPrimaveraSeries, seccionesBreakdown, docentesSeries, financiamientoSeries]);

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

  // 4. Secciones del curso por año (Otoño y Primavera)
  const seccionesOtono = useMemo(() => {
    const pointsMap = new Map(seccionesOtonoSeries.map(s => [Number(s.year), Number(s.value)]));
    return visibleYears.map(y => pointsMap.get(y) ?? 0);
  }, [seccionesOtonoSeries, visibleYears]);

  const seccionesPrimavera = useMemo(() => {
    const pointsMap = new Map(seccionesPrimaveraSeries.map(s => [Number(s.year), Number(s.value)]));
    return visibleYears.map(y => pointsMap.get(y) ?? 0);
  }, [seccionesPrimaveraSeries, visibleYears]);

  const totalSeccionesMax = useMemo(() => {
    return Math.max(...visibleYears.map((_, i) => (seccionesOtono[i] || 0) + (seccionesPrimavera[i] || 0)), 0);
  }, [visibleYears, seccionesOtono, seccionesPrimavera]);

  // 4.1 Desglose de secciones del curso
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
          compareText: `Año ${yDesde} es la línea base`,
          evo: null,
          isPositive: true
        };
      }

      if (periodoAcumulado) {
        const sumVal = seriesPoints.reduce((sum, p) => {
          const yr = Number(p.year);
          if (yr >= yDesde && yr <= yHasta) {
            return sum + Number(p.value || 0);
          }
          return sum;
        }, 0);

        let evo = null;
        let isPositive = true;

        if (vDesde > 0) {
          const diff = sumVal - vDesde;
          const pct = Math.round((diff / vDesde) * 100);
          evo = `${pct >= 0 ? '+' : ''}${pct}%`;
          isPositive = pct >= 0;
        } else if (sumVal > 0) {
          evo = '+100%';
          isPositive = true;
        } else {
          evo = '0%';
          isPositive = true;
        }

        return {
          val: String(sumVal),
          baseYear: yDesde,
          baseVal: vDesde,
          compareText: `vs Año base (${yDesde}): ${vDesde}`,
          evo,
          isPositive
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
        compareText: `vs Año más anterior (${yDesde}): ${vDesde}`,
        evo,
        isPositive
      };
    };

    return {
      activos: calcKpi(proyectosActivosSeries),
      finalizados: calcKpi(proyectosFinalizadosSeries),
      docentes: calcKpi(docentesSeries)
    };
  }, [hasData, yearRange, proyectosActivosSeries, proyectosFinalizadosSeries, docentesSeries, periodoAcumulado]);

  // Conteo de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (yearRange[0] !== 2023 || yearRange[1] !== 2026) count += 1;
    if (periodoAcumulado) count += 1;
    Object.values(selectedChips).forEach(arr => {
      count += arr.length;
    });
    return count;
  }, [yearRange, selectedChips, periodoAcumulado]);

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
    setPeriodoAcumulado(false);
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

  const handleDrawerToggle = () => setMobileOpen(prev => !prev);

  // Drawer handlers
  const handleOpenIndicator = useCallback((key) => {
    setCurrentIndicatorKey(key);
    const mostRecentYear = availableYears.length > 0 ? Math.max(...availableYears) : 2026;
    setDrawerPeriod(String(mostRecentYear));
    const defaultDim = INDICATOR_SPECIFIC_DIMENSION[key] || null;
    setDrawerGroupBy(defaultDim);
    setDrawerOpen(true);
  }, [availableYears]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleDrawerPeriodChange = useCallback((val) => {
    setDrawerPeriod(val);
  }, []);

  // Petición al endpoint GET /api/indicators/:key/detail (PIADI-409)
  useEffect(() => {
    if (!drawerOpen || !currentIndicatorKey) return;

    setDrawerLoading(true);
    setDrawerError(null);
    const backendKey = UI_TO_BACKEND_KEY[currentIndicatorKey] || currentIndicatorKey.replace(/-/g, '_');
    const params = {};

    if (drawerPeriod) {
      params.year = String(drawerPeriod);
    }
    if (drawerGroupBy) {
      params.groupBy = drawerGroupBy;
    }

    getIndicatorDetail(backendKey, params)
      .then((res) => {
        const detail = (res && res.data && typeof res.data === 'object' && !Array.isArray(res.data) && (res.data.title || res.data.indicatorKey))
          ? res.data 
          : res;

        setApiIndicatorDetail(detail || null);
        setDrawerError(null);
      })
      .catch((err) => {
        setApiIndicatorDetail(null);
        setDrawerError(err?.message || 'Error al obtener la información del indicador desde el servidor');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  }, [drawerOpen, currentIndicatorKey, drawerPeriod, drawerGroupBy]);

  // Años disponibles para el selector del Drawer
  const drawerYears = useMemo(() => {
    const yearsSet = new Set(availableYears || []);
    if (apiIndicatorDetail?.period?.from && apiIndicatorDetail?.period?.to) {
      const { from, to } = apiIndicatorDetail.period;
      for (let y = from; y <= to; y++) {
        yearsSet.add(y);
      }
    }
    if (minYear && maxYear) {
      for (let y = minYear; y <= maxYear; y++) {
        yearsSet.add(y);
      }
    }
    const yrs = Array.from(yearsSet).filter(Number.isFinite).sort((a, b) => a - b);
    return yrs.length > 0 ? yrs : [2023, 2024, 2025, 2026];
  }, [apiIndicatorDetail, availableYears, minYear, maxYear]);

  // Indicador actual para el Drawer (PIADI-409)
  const currentIndicator = useMemo(() => {
    const baseDef = INDICATORS[currentIndicatorKey] || INDICATORS['proyectos-activos'];

    if (apiIndicatorDetail) {
      const {
        title,
        description,
        total,
        formattedTotal,
        hasData: detailHasData,
        disaggregated,
        groupBy,
        allowedGroupBy,
        dimensionLabels,
        period,
        comparison,
        table,
        unit
      } = apiIndicatorDetail;

      // Dimensiones categóricas para los tabs del Drawer
      const specificDim = INDICATOR_SPECIFIC_DIMENSION[currentIndicatorKey];
      const matchingDims = (allowedGroupBy || [])
        .filter(dim => dim !== 'year' && dim !== 'periodo' && dim !== 'period')
        .filter(dim => {
          if (!specificDim) return false;
          return dim.toLowerCase() === specificDim.toLowerCase();
        });

      const allowedTabs = matchingDims.map(dim => ({
        key: dim,
        label: dimensionLabels?.[dim] || dim
      }));

      // Columnas y filas para la tabla
      let colLabels = baseDef.colLabels || ['Año', 'Valor'];
      if (currentIndicatorKey === 'proy-area' || currentIndicatorKey === 'total-proyectos' || groupBy === 'areaTematica') {
        colLabels = ['Área Temática', 'Proyectos'];
      } else if (currentIndicatorKey === 'secciones-curso' || currentIndicatorKey === 'secciones-hbar' || groupBy === 'semestre') {
        colLabels = ['Semestre', 'Secciones'];
      } else if (currentIndicatorKey === 'docentes-involucrados' || currentIndicatorKey === 'doc-line') {
        colLabels = ['Año', 'Docentes'];
      } else if (currentIndicatorKey === 'financiamiento-obtenido' || groupBy === 'fuente') {
        colLabels = ['Fuente', 'Monto (CLP)'];
      } else if (disaggregated && groupBy) {
        colLabels = [dimensionLabels?.[groupBy] || 'Categoría', 'Valor'];
      } else if (!disaggregated && !groupBy) {
        colLabels = ['Año', 'Total'];
      }

      let rows = (table || []).map(row => {
        let label = '';
        let value = 0;
        if (row.label !== undefined) { label = row.label; value = row.value; }
        else if (row.year !== undefined) { label = String(row.year); value = row.value; }
        else if (row.categoria !== undefined) { label = row.categoria; value = row.value; }
        else { label = row[0] || ''; value = row[1] || 0; }

        return [label, value];
      });

      // Si es una tabla anual (no desagregada por dimensión cualitativa), aseguramos que todos los años aparezcan con 0 si no tienen datos
      const isAnnualTable = (!groupBy || groupBy === 'year') && (
        rows.length === 0 || rows.every(r => /^\d{4}$/.test(String(r[0])))
      );

      if (isAnnualTable) {
        const rowsMap = new Map(rows.map(r => [Number(r[0]), r[1]]));
        const allYrs = Array.from(new Set([...drawerYears, ...rows.map(r => Number(r[0]))])).sort((a, b) => a - b);
        rows = allYrs.map(yr => [String(yr), rowsMap.has(yr) ? rowsMap.get(yr) : 0]);
      }

      // Si el indicador corresponde a Secciones del curso (agrupado por semestre), completamos con 0 los semestres faltantes (Otoño / Primavera)
      if (currentIndicatorKey === 'secciones-curso' || currentIndicatorKey === 'secciones-hbar' || groupBy === 'semestre') {
        const standardSemestres = (apiFilters?.semesters && apiFilters.semesters.length > 0)
          ? apiFilters.semesters
          : ['Otoño', 'Primavera'];

        const existingMap = new Map();
        rows.forEach(r => {
          const normKey = String(r[0]).trim().toLowerCase();
          existingMap.set(normKey, Number(r[1]) || 0);
        });

        const filledRows = standardSemestres.map(sem => {
          const normSem = sem.trim().toLowerCase();
          let val = 0;
          if (existingMap.has(normSem)) {
            val = existingMap.get(normSem);
          } else {
            const foundKey = Array.from(existingMap.keys()).find(k => 
              (normSem.includes('oto') && k.includes('oto')) || 
              (normSem.includes('prim') && k.includes('prim'))
            );
            if (foundKey) {
              val = existingMap.get(foundKey);
            }
          }
          return [sem, val];
        });

        rows.forEach(r => {
          const normLabel = String(r[0]).trim().toLowerCase();
          const alreadyIncluded = filledRows.some(fr => fr[0].trim().toLowerCase() === normLabel);
          if (!alreadyIncluded) {
            filledRows.push(r);
          }
        });

        rows = filledRows;
      }

      // Identificar el elemento con mayor cantidad dentro de las filas
      let topItem = null;
      if (rows && rows.length > 0) {
        rows.forEach(r => {
          const val = Number(r[1]) || 0;
          if (!topItem || val > topItem.value) {
            topItem = { label: String(r[0]), value: val };
          }
        });
      }

      // Tendencia / Comparación oficial enviada por backend o calculada de forma reactiva con las filas anuales
      let trend = null;
      if (comparison && comparison.diff !== null && comparison.diff !== undefined) {
        const diffNum = Number(comparison.diff) || 0;
        const isPos = diffNum > 0;
        const isNeutral = diffNum === 0;
        trend = {
          delta: diffNum,
          formattedDelta: isPos ? `+${diffNum.toLocaleString('es-CL')}` : (isNeutral ? '0' : diffNum.toLocaleString('es-CL')),
          baseline: String(comparison.previousYear),
          isPositive: isNeutral ? null : isPos,
          isNeutral
        };
      } else if (isAnnualTable && drawerPeriod) {
        const selYr = Number(drawerPeriod);
        const prevYr = selYr - 1;
        const rowsMap = new Map(rows.map(r => [Number(r[0]), Number(r[1]) || 0]));
        if (rowsMap.has(selYr) && rowsMap.has(prevYr)) {
          const currV = rowsMap.get(selYr);
          const prevV = rowsMap.get(prevYr);
          const diffNum = currV - prevV;
          const isPos = diffNum > 0;
          const isNeutral = diffNum === 0;
          trend = {
            delta: diffNum,
            formattedDelta: isPos ? `+${diffNum.toLocaleString('es-CL')}` : (isNeutral ? '0' : String(diffNum)),
            baseline: String(prevYr),
            isPositive: isNeutral ? null : isPos,
            isNeutral
          };
        }
      }

      // Valor a desplegar en la métrica destacada
      const selectedYearRowVal = isAnnualTable && drawerPeriod ? (rows.find(r => r[0] === drawerPeriod)?.[1] ?? 0) : total;
      const finalTotal = (total !== null && total !== undefined) ? total : (selectedYearRowVal ?? 0);

      let customMetric = {
        label: unit ? `Total (${unit})` : (baseDef.metric?.label || 'Total'),
        value: (typeof finalTotal === 'number') ? finalTotal.toLocaleString('es-CL') : (formattedTotal ?? finalTotal)
      };
      let customTrend = trend;

      switch (currentIndicatorKey) {
        case 'proyectos-activos': {
          customMetric = {
            label: 'Proyectos de innovación en curso',
            value: finalTotal
          };
          break;
        }

        case 'proyectos-finalizados': {
          customMetric = {
            label: 'Proyectos finalizados',
            value: finalTotal
          };
          break;
        }

        case 'proy-area':
        case 'total-proyectos': {
          customMetric = {
            label: 'Área con más proyectos',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} proyectos`,
            isPositive: true
          } : null;
          break;
        }

        case 'secciones-curso':
        case 'secciones-hbar': {
          customMetric = {
            label: 'Semestre con más secciones',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} secciones`,
            isPositive: true
          } : null;
          break;
        }

        case 'docentes-involucrados':
        case 'doc-line': {
          customMetric = {
            label: 'Docentes involucrados',
            value: finalTotal
          };
          break;
        }

        case 'proyectos-con-financiamiento-externo':
        case 'fin-externo':
        case 'proyectos-externos': {
          customMetric = {
            label: 'Proyectos con financiamiento externo',
            value: finalTotal
          };
          break;
        }

        default:
          break;
      }

      return {
        key: currentIndicatorKey,
        title: title || baseDef.title,
        desc: description || baseDef.desc,
        hasData: detailHasData !== false || rows.length > 0 || (total !== null && total !== undefined),
        isError: false,
        errorMessage: null,
        metric: customMetric,
        trend: customTrend,
        colLabels,
        rows,
        allowedTabs,
        activeGroupBy: groupBy,
        period
      };
    }

    return {
      key: currentIndicatorKey,
      title: baseDef.title,
      desc: baseDef.desc,
      hasData: false,
      isError: Boolean(drawerError),
      errorMessage: drawerError || (drawerLoading ? null : 'Error: no se encontraron datos cargados en el servidor para este indicador.'),
      metric: null,
      trend: null,
      colLabels: ['Año', 'Valor'],
      rows: [],
      allowedTabs: []
    };
  }, [
    currentIndicatorKey,
    apiIndicatorDetail,
    drawerError,
    drawerLoading,
    drawerYears,
    drawerPeriod
  ]);

  const isSimpleYearRows = useCallback((ind) => {
    return ind?.rows && ind.rows.length > 0 && ind.rows.every(r => /^\d{4}$/.test(String(r[0])));
  }, []);

  const displayRows = useMemo(() => {
    if (!currentIndicator || !currentIndicator.rows) return [];
    if (apiIndicatorDetail) {
      return currentIndicator.rows;
    }
    if (drawerPeriod === 'all' || !isSimpleYearRows(currentIndicator)) {
      return currentIndicator.rows;
    }
    const filtered = currentIndicator.rows.filter(r => String(r[0]) === drawerPeriod);
    return filtered.length > 0 ? filtered : currentIndicator.rows;
  }, [currentIndicator, drawerPeriod, isSimpleYearRows, apiIndicatorDetail]);

  const drawerPeriodText = useMemo(() => {
    return drawerPeriod ? `Año: ${drawerPeriod}` : '';
  }, [drawerPeriod]);

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
      a: 'Puedes utilizar los controles del panel lateral de filtros para segmentar los datos por año, estado del proyecto, área temática o fuente de financiamiento.'
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
    periodoAcumulado,
    setPeriodoAcumulado,
    selectedChips,
    handleToggleChip,
    handleResetFilters,
    activeFiltersCount,
    accordionsOpen,
    handleToggleAccordion,
    collapsedSections,
    handleToggleSection,
    drawerOpen,
    currentIndicator,
    drawerPeriod,
    handleDrawerPeriodChange,
    drawerGroupBy,
    setDrawerGroupBy,
    drawerYears,
    displayRows,
    drawerPeriodText,
    drawerLoading,
    drawerError,
    handleOpenIndicator,
    handleCloseDrawer,
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
    seccionesOtono,
    seccionesPrimavera,
    totalSeccionesMax,
    seccionesCurso,
    docentes,
    finExterno,
    activeMenu: 'Dashboards',
  };
};
