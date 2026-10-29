import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import {
  getDashboardSummary,
  getDepartmentFilters,
  getIndicatorSeries,
  getIndicatorBreakdown,
  getIndicatorDetail,
} from '../../../services/piadiApi';

export const YEARS = [2023, 2024, 2025, 2026];

export const UI_TO_BACKEND_KEY = {
  'aprobacion': 'tasa_aprobacion_asignatura',
  'reprobacion': 'tasa_reprobacion_asignatura',
  'reprobacion-asignatura': 'tasa_reprobacion_asignatura',
  'asignaturas-criticas': 'asignaturas_criticas',
  'practicas': 'practicas_inscritas',
  'practicas-tipo': 'practicas_aprobadas',
  'titulacion-cohorte': 'tasa_titulacion_cohorte',
  'titulacion-tiempo': 'tasa_titulacion_cohorte',
  'titulados-anio': 'titulados_por_anio',
  'tiempo-titulacion': 'tiempo_promedio_titulacion',
};

export const MOCK_INDICATORS = {
  'aprobacion': {
    title: 'Tasa de aprobación por asignatura',
    desc: 'Porcentaje de estudiantes que aprueban cada asignatura en el semestre.',
    metric: { label: 'Tasa de aprobación global (%)', value: 83.8 },
    trend: { delta: -0.4, baseline: '2023', isPositive: false },
    rows: [
      ['2023', '84,2 %'],
      ['2024', '86,2 %'],
      ['2025', '82,2 %'],
      ['2026', '83,1 %'],
    ],
    colLabels: ['Año', 'Tasa de aprobación (%)'],
    state: 'data',
  },
  'reprobacion-asignatura': {
    title: 'Tasa de reprobación por asignatura',
    desc: 'Porcentaje de reprobados por asignatura. Permite identificar asignaturas críticas.',
    metric: { label: 'Reprobación global 2026 (%)', value: 16.9 },
    trend: { delta: 1.1, baseline: '2023', isPositive: false, badWhenUp: true },
    rows: [
      ['Gestión de Personas', '22,2 %'],
      ['Auditoría', '18,8 %'],
      ['Economía', '18,5 %'],
      ['Finanzas', '17.8 %'],
      ['Taller de Titulación', '16,2 %'],
      ['Derecho Tributario', '16,1 %'],
      ['Contabilidad I', '15,3 %'],
      ['Contabilidad II', '14,7 %'],
      ['Estadística', '13,2 %'],
      ['Costos', '9,8 %'],
    ],
    colLabels: ['Asignatura', 'Tasa de reprobación (%)'],
    state: 'data',
  },
  'asignaturas-criticas': {
    title: 'Asignaturas críticas',
    desc: 'Listado de asignaturas con tasa de reprobación superior al umbral definido por la institución.',
    metric: { label: 'Asignaturas críticas (reprobación ≥ 20 %)', value: 1 },
    trend: null,
    rows: [
      ['Gestión de Personas', '22,2 %'],
    ],
    colLabels: ['Asignatura', 'Tasa de reprobación'],
    state: 'data',
  },
  'practicas': {
    title: 'Prácticas: inscritas vs. aprobadas',
    desc: 'Número de estudiantes inscritos en práctica profesional por semestre.',
    metric: { label: 'Inscritas 2026', value: 11 },
    trend: { delta: 7, baseline: '2025', isPositive: true },
    rows: [
      ['2024', 2, 3],
      ['2025', 4, 23],
      ['2026', 11, 34],
    ],
    colLabels: ['Año', 'Inscritas', 'Aprobadas'],
    state: 'data',
  },
  'practicas-tipo': {
    title: 'Prácticas por tipo',
    desc: 'Número de estudiantes que aprueban su práctica profesional.',
    metric: { label: 'Aprobadas — Práctica Profesional', value: 16 },
    trend: null,
    rows: [
      ['Práctica I', 6, 24],
      ['Práctica II', 5, 20],
      ['Práctica Profesional', 6, 16],
    ],
    colLabels: ['Tipo de práctica', 'Inscritas', 'Aprobadas'],
    state: 'data',
  },
  'titulacion-cohorte': {
    title: 'Tasa de titulación por cohorte',
    desc: 'Porcentaje de estudiantes de una cohorte que se titulan dentro del tiempo normativo y con desfase.',
    metric: { label: 'Tasa en tiempo normativo (%)', value: 50 },
    trend: null,
    rows: [
      ['Cohorte 2021', 13, '7 (54 %)', '6 (46 %)'],
      ['Cohorte 2022', 9, '4 (44 %)', '5 (56 %)'],
      ['Total', 22, '11 (50 %)', '11 (50 %)'],
    ],
    colLabels: ['Cohorte', 'Titulados', 'En tiempo normativo', 'Con desfase'],
    state: 'data',
  },
  'titulacion-tiempo': {
    title: 'Titulados en tiempo normativo',
    desc: 'Porcentaje de estudiantes de una cohorte que se titulan dentro del tiempo normativo y con desfase.',
    metric: { label: 'Titulados en tiempo normativo (%)', value: 50 },
    trend: null,
    rows: [
      ['Cohorte 2021', 13, '7 (54 %)', '6 (46 %)'],
      ['Cohorte 2022', 9, '4 (44 %)', '5 (56 %)'],
      ['Total', 22, '11 (50 %)', '11 (50 %)'],
    ],
    colLabels: ['Cohorte', 'Titulados', 'En tiempo normativo', 'Con desfase'],
    state: 'data',
  },
  'titulados-anio': {
    title: 'Titulados por año',
    desc: 'Total de titulados por carrera y año calendario.',
    metric: { label: 'Titulados 2026', value: 12 },
    trend: { delta: 2, baseline: '2025', isPositive: true },
    rows: [
      ['2023', 0],
      ['2024', 0],
      ['2025', 10],
      ['2026', 12],
    ],
    colLabels: ['Año', 'Titulados'],
    state: 'data',
  },
  'tiempo-titulacion': {
    title: 'Tiempo promedio de titulación',
    desc: 'Promedio de semestres cursados hasta el título, por carrera.',
    metric: { label: 'Tiempo promedio (semestres)', value: 8.68 },
    trend: null,
    rows: [
      ['Promedio institucional', 8.68],
      ['Tiempo normativo', 8],
    ],
    colLabels: ['Indicador', 'Semestres'],
    state: 'data',
  },
};

export const useDashboardDesarrolloCurricular = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Estados de navegación y modal de ayuda
  const [mobileOpen, setMobileOpen] = useState(false);

  // Estados de colapso de secciones de gráficos
  const [collapsedSections, setCollapsedSections] = useState({});

  const handleToggleSection = (sectionKey) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  // Estados de Filtros
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [yearRange, setYearRange] = useState([2023, 2026]);
  const [periodoAcumulado, setPeriodoAcumulado] = useState(false);

  const [selectedChips, setSelectedChips] = useState({
    cohorte: [],
    estado: [],
    periodo: [],
    asignatura: [],
    tipoPractica: [],
  });

  const [accordionsOpen, setAccordionsOpen] = useState({
    cohorte: false,
    estado: false,
    periodo: false,
    asignatura: false,
    tipoPractica: false,
  });

  const handleToggleAccordion = (key) => {
    setAccordionsOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleToggleChip = (group, value) => {
    setSelectedChips((prev) => {
      const list = prev[group] || [];
      const isSelected = list.includes(value);
      return {
        ...prev,
        [group]: isSelected ? list.filter((v) => v !== value) : [...list, value],
      };
    });
  };

  // Estados de API y Backend
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiFilters, setApiFilters] = useState(null);
  const [apiSummary, setApiSummary] = useState(null);

  // Años disponibles dinámicos según API (PostgreSQL) con fallback seguro
  const availableYears = useMemo(() => {
    const apiYears = apiFilters?.filters?.years;
    if (apiYears && apiYears.length > 0) {
      return [...apiYears].map(Number).filter(Number.isFinite).sort((a, b) => a - b);
    }
    return YEARS;
  }, [apiFilters]);

  const minYear = useMemo(() => (availableYears.length > 0 ? Math.min(...availableYears) : 2023), [availableYears]);
  const maxYear = useMemo(() => (availableYears.length > 0 ? Math.max(...availableYears) : 2026), [availableYears]);

  const handleResetFilters = () => {
    setYearRange([minYear, maxYear]);
    setPeriodoAcumulado(false);
    setSelectedChips({
      cohorte: [],
      estado: [],
      periodo: [],
      asignatura: [],
      tipoPractica: [],
    });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (yearRange[0] !== minYear || yearRange[1] !== maxYear) count += 1;
    if (periodoAcumulado) count += 1;
    Object.values(selectedChips).forEach((arr) => {
      count += arr.length;
    });
    return count;
  }, [yearRange, minYear, maxYear, periodoAcumulado, selectedChips]);

  const [apiAprobacionSeries, setApiAprobacionSeries] = useState(null);
  const [apiReprobacionSeries, setApiReprobacionSeries] = useState(null);
  const [apiReprobacionBreakdown, setApiReprobacionBreakdown] = useState(null);
  const [apiPracticasInscritasSeries, setApiPracticasInscritasSeries] = useState(null);
  const [apiPracticasAprobadasSeries, setApiPracticasAprobadasSeries] = useState(null);
  const [apiTituladosSeries, setApiTituladosSeries] = useState(null);
  const [apiDrawerDetail, setApiDrawerDetail] = useState(null);

  // Estados del Drawer de Detalle (PIADI-306)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [currentIndicatorKey, setCurrentIndicatorKey] = useState('aprobacion');
  const [drawerPeriod, setDrawerPeriod] = useState(2026);

  // 1. Cargar filtros disponibles del departamento desde PostgreSQL
  useEffect(() => {
    getDepartmentFilters('desarrollo_curricular')
      .then((res) => {
        if (res?.success && res?.data) {
          setApiFilters(res.data);
          const years = res.data?.filters?.years ?? [];
          if (years.length > 0) {
            const min = Math.min(...years);
            const max = Math.max(...years);
            setYearRange([min, max]);
          }
        }
      })
      .catch((err) => {
        console.warn('No se pudieron obtener filtros de Desarrollo Curricular desde API:', err);
      });
  }, []);

  // 2. Parámetros serializados para llamadas a la API
  const apiParams = useMemo(() => {
    const params = { department: 'desarrollo_curricular' };
    const [from, to] = yearRange;
    if (from === to) {
      params.year = from;
    } else {
      params.fromYear = from;
      params.toYear = to;
    }

    if (selectedChips.cohorte.length > 0) params.cohorte = selectedChips.cohorte.join(',');
    if (selectedChips.estado.length > 0) params.estado = selectedChips.estado.join(',');
    if (selectedChips.periodo.length > 0) params.periodo = selectedChips.periodo.join(',');
    if (selectedChips.asignatura.length > 0) params.asignatura = selectedChips.asignatura.join(',');
    if (selectedChips.tipoPractica.length > 0) params.tipoPractica = selectedChips.tipoPractica.join(',');

    return params;
  }, [yearRange, selectedChips]);

  // 3. Consultas en paralelo de Resumen, Series y Desgloses
  useEffect(() => {
    setApiLoading(true);
    setApiError(null);

    const seriesParams = { ...apiParams };
    const breakdownParams = { ...apiParams };

    Promise.all([
      getDashboardSummary(apiParams).catch(() => null),
      getIndicatorSeries('tasa_aprobacion_asignatura', seriesParams).catch(() => null),
      getIndicatorSeries('tasa_reprobacion_asignatura', seriesParams).catch(() => null),
      getIndicatorBreakdown('tasa_reprobacion_asignatura', { ...breakdownParams, groupBy: 'asignatura' }).catch(() => null),
      getIndicatorSeries('practicas_inscritas', seriesParams).catch(() => null),
      getIndicatorSeries('practicas_aprobadas', seriesParams).catch(() => null),
      getIndicatorSeries('titulados_por_anio', seriesParams).catch(() => null),
    ])
      .then(([
        summaryRes,
        aprobacionSeriesRes,
        reprobacionSeriesRes,
        reprobacionBreakdownRes,
        practicasInscritasSeriesRes,
        practicasAprobadasSeriesRes,
        tituladosSeriesRes,
      ]) => {
        if (summaryRes?.success && summaryRes.data) {
          setApiSummary(summaryRes.data);
        }
        if (aprobacionSeriesRes?.success && aprobacionSeriesRes.data?.points) {
          setApiAprobacionSeries(aprobacionSeriesRes.data.points);
        }
        if (reprobacionSeriesRes?.success && reprobacionSeriesRes.data?.points) {
          setApiReprobacionSeries(reprobacionSeriesRes.data.points);
        }
        if (reprobacionBreakdownRes?.success && reprobacionBreakdownRes.data?.items) {
          setApiReprobacionBreakdown(reprobacionBreakdownRes.data.items);
        }
        if (practicasInscritasSeriesRes?.success && practicasInscritasSeriesRes.data?.points) {
          setApiPracticasInscritasSeries(practicasInscritasSeriesRes.data.points);
        }
        if (practicasAprobadasSeriesRes?.success && practicasAprobadasSeriesRes.data?.points) {
          setApiPracticasAprobadasSeries(practicasAprobadasSeriesRes.data.points);
        }
        if (tituladosSeriesRes?.success && tituladosSeriesRes.data?.points) {
          setApiTituladosSeries(tituladosSeriesRes.data.points);
        }
      })
      .catch((err) => {
        console.error('Error cargando indicadores de Desarrollo Curricular:', err);
        setApiError(err.message);
      })
      .finally(() => {
        setApiLoading(false);
      });
  }, [apiParams]);

  // Evaluador de presencia de datos reales
  const hasRealData = useMemo(() => {
    const dept = apiSummary?.departments?.find((d) => d.departmentId === 'desarrollo_curricular');
    const hasSummaryData = Boolean(dept && dept.cards?.some((c) => c.hasData && c.value !== null));
    const hasSeries = Boolean(
      (apiAprobacionSeries && apiAprobacionSeries.some((p) => p.value !== null)) ||
      (apiReprobacionSeries && apiReprobacionSeries.some((p) => p.value !== null)) ||
      (apiTituladosSeries && apiTituladosSeries.some((p) => p.value !== null && p.value > 0))
    );
    const hasBreakdown = Boolean(
      apiReprobacionBreakdown && apiReprobacionBreakdown.some((i) => i.value !== null)
    );
    return Boolean(hasSummaryData || hasSeries || hasBreakdown);
  }, [apiSummary, apiAprobacionSeries, apiReprobacionSeries, apiTituladosSeries, apiReprobacionBreakdown]);

  // 4. Datos base de fallback (Mock)
  const mockAprobacionYear = [
    { year: '2023', value: 84.2 },
    { year: '2024', value: 86.2 },
    { year: '2025', value: 82.2 },
    { year: '2026', value: 83.1 },
  ];

  const mockReprobacionYear = [
    { year: '2023', value: 15.8 },
    { year: '2024', value: 13.8 },
    { year: '2025', value: 17.8 },
    { year: '2026', value: 16.9 },
  ];

  const mockReprobacionAsignaturas = [
    { label: 'Gestión de Personas', value: 22.2 },
    { label: 'Auditoría', value: 18.8 },
    { label: 'Economía', value: 18.5 },
    { label: 'Finanzas', value: 17.8 },
    { label: 'Taller de Titulación', value: 16.2 },
    { label: 'Derecho Tributario', value: 16.1 },
    { label: 'Contabilidad I', value: 15.3 },
    { label: 'Contabilidad II', value: 14.7 },
    { label: 'Estadística', value: 13.2 },
    { label: 'Costos', value: 9.8 },
  ];

  const mockPracticasYear = {
    labels: ['2024', '2025', '2026'],
    series: [
      { label: 'Inscritas', values: [2, 4, 11] },
      { label: 'Aprobadas', values: [3, 23, 34] },
    ],
  };

  const mockTitulacionCohorte = {
    labels: ['Cohorte 2021', 'Cohorte 2022'],
    series: [
      { label: 'En tiempo normativo', values: [7, 4] },
      { label: 'Con desfase', values: [6, 5] },
    ],
  };

  const mockTituladosYear = [
    { year: '2023', value: 0 },
    { year: '2024', value: 0 },
    { year: '2025', value: 10 },
    { year: '2026', value: 12 },
  ];

  const mockTiempoTitulacion = 8.68;

  // 5. KPIs superiores dinámicos calculados desde el Summary y Series
  const kpiCards = useMemo(() => {
    const dept = apiSummary?.departments?.find((d) => d.departmentId === 'desarrollo_curricular');
    const cards = dept?.cards || [];
    const getCard = (key) => cards.find((c) => c.indicatorKey === key);

    const cardAprobacion = getCard('tasa_aprobacion_asignatura');
    const cardCriticas = getCard('asignaturas_criticas');
    const cardTiempo = getCard('tiempo_promedio_titulacion');

    // --- CÁLCULO DINÁMICO EXCLUSIVO PARA TASA DE APROBACIÓN GLOBAL (interactivo con período acumulado y año base) ---
    const yDesde = yearRange[0];
    const yHasta = yearRange[1];
    const isSingleYear = yDesde === yHasta;
    const isAccumulated = periodoAcumulado && !isSingleYear;
    const minAvailableYear = availableYears.length > 0 ? Math.min(...availableYears) : 2023;
    const isBaseline = isSingleYear && yDesde === minAvailableYear;

    const getValForYear = (yr) => {
      if (hasRealData && apiAprobacionSeries && apiAprobacionSeries.length > 0) {
        const found = apiAprobacionSeries.find((p) => Number(p.year) === Number(yr));
        return found && found.value != null ? Number(found.value) : null;
      }
      const foundMock = mockAprobacionYear.find((d) => Number(d.year) === Number(yr));
      return foundMock != null ? Number(foundMock.value) : null;
    };

    let aprobacionValNumber;
    let aprobacionFormattedValue;
    let compareText = undefined;
    let evolution = undefined;
    let isPositive = true;

    if (isAccumulated) {
      // Período acumulado: promedio de las tasas del período seleccionado
      const inRangeVals = [];
      for (let y = yDesde; y <= yHasta; y++) {
        const val = getValForYear(y);
        if (val !== null && !isNaN(val)) inRangeVals.push(val);
      }
      const avg = inRangeVals.length > 0
        ? inRangeVals.reduce((acc, v) => acc + v, 0) / inRangeVals.length
        : (cardAprobacion?.value ?? 83.8);

      aprobacionValNumber = avg;
      aprobacionFormattedValue = `${avg.toFixed(1).replace('.', ',')} %`;

      // Comparación con el año base (yDesde)
      const baseVal = getValForYear(yDesde);
      if (baseVal != null) {
        const diff = Number((avg - baseVal).toFixed(1));
        evolution = `${diff >= 0 ? '+' : '−'}${Math.abs(diff).toFixed(1).replace('.', ',')} pp`;
        isPositive = diff >= 0;
        compareText = `vs Año base (${yDesde}): ${baseVal.toFixed(1).replace('.', ',')} %`;
      } else {
        compareText = `Acumulado período ${yDesde} — ${yHasta}`;
      }
    } else {
      // Período individual o rango estándar: muestra el año más reciente (yHasta)
      const valHasta = getValForYear(yHasta);
      const activeVal = valHasta ?? (cardAprobacion?.value ?? 83.8);
      aprobacionValNumber = activeVal;
      aprobacionFormattedValue = `${activeVal.toFixed(1).replace('.', ',')} %`;

      if (isBaseline) {
        compareText = `Año ${yDesde} es la línea base`;
        evolution = null;
        isPositive = true;
      } else {
        const compareYear = isSingleYear ? yDesde - 1 : yDesde;
        const baseVal = getValForYear(compareYear);
        if (baseVal != null) {
          const diff = Number((activeVal - baseVal).toFixed(1));
          evolution = `${diff >= 0 ? '+' : '−'}${Math.abs(diff).toFixed(1).replace('.', ',')} pp`;
          isPositive = diff >= 0;
          compareText = isSingleYear
            ? `vs año anterior (${compareYear}): ${baseVal.toFixed(1).replace('.', ',')} %`
            : `vs Año base (${compareYear}): ${baseVal.toFixed(1).replace('.', ',')} %`;
        } else {
          compareText = `Tasa global de aprobación en ${yHasta}`;
        }
      }
    }

    return {
      aprobacion: {
        value: aprobacionFormattedValue,
        hasData: cardAprobacion?.hasData ?? (hasRealData ? Boolean(aprobacionValNumber) : true),
        raw: aprobacionValNumber,
        compareText,
        evolution,
        isPositive,
      },
      criticas: {
        value: cardCriticas?.formattedValue || (cardCriticas?.value != null ? String(cardCriticas.value) : '1'),
        hasData: hasRealData ? (cardCriticas?.hasData ?? true) : true,
        raw: cardCriticas?.value ?? 1,
      },
      tiempo: {
        value: cardTiempo?.formattedValue || (cardTiempo?.value != null ? `${cardTiempo.value}` : '8,68'),
        hasData: hasRealData ? (cardTiempo?.hasData ?? true) : true,
        raw: cardTiempo?.value ?? 8.68,
      },
    };
  }, [
    apiSummary,
    hasRealData,
    apiAprobacionSeries,
    yearRange,
    periodoAcumulado,
    availableYears,
  ]);

  // 6. Asignación de datos finales para gráficos (API real con fallback a Mock)
  const finalAprobacionYear = useMemo(() => {
    if (hasRealData && apiAprobacionSeries && apiAprobacionSeries.length > 0) {
      return apiAprobacionSeries
        .filter((p) => p.year >= yearRange[0] && p.year <= yearRange[1])
        .map((p) => ({
          year: String(p.year),
          value: p.value != null ? Number(p.value.toFixed(1)) : 0,
        }));
    }
    return mockAprobacionYear.filter((d) => {
      const y = parseInt(d.year, 10);
      return y >= yearRange[0] && y <= yearRange[1];
    });
  }, [hasRealData, apiAprobacionSeries, yearRange]);

  const finalReprobacionYear = useMemo(() => {
    if (hasRealData && apiReprobacionSeries && apiReprobacionSeries.length > 0) {
      return apiReprobacionSeries
        .filter((p) => p.year >= yearRange[0] && p.year <= yearRange[1])
        .map((p) => ({
          year: String(p.year),
          value: p.value != null ? Number(p.value.toFixed(1)) : 0,
        }));
    }
    return mockReprobacionYear.filter((d) => {
      const y = parseInt(d.year, 10);
      return y >= yearRange[0] && y <= yearRange[1];
    });
  }, [hasRealData, apiReprobacionSeries, yearRange]);

  const finalReprobacionAsignaturas = useMemo(() => {
    if (hasRealData && apiReprobacionBreakdown && apiReprobacionBreakdown.length > 0) {
      return apiReprobacionBreakdown.map((i) => ({
        label: i.label,
        value: Number(Number(i.value || 0).toFixed(1)),
      }));
    }
    return mockReprobacionAsignaturas;
  }, [hasRealData, apiReprobacionBreakdown]);

  const finalAsignaturasCriticas = useMemo(() => {
    return finalReprobacionAsignaturas.filter((d) => d.value >= 20);
  }, [finalReprobacionAsignaturas]);

  const finalPracticasYear = useMemo(() => {
    if (hasRealData && apiPracticasInscritasSeries?.length && apiPracticasAprobadasSeries?.length) {
      const allYears = [...new Set([
        ...apiPracticasInscritasSeries.map((p) => p.year),
        ...apiPracticasAprobadasSeries.map((p) => p.year),
      ])].sort((a, b) => a - b).filter((y) => y >= yearRange[0] && y <= yearRange[1]);

      const inscritasMap = Object.fromEntries(apiPracticasInscritasSeries.map((p) => [p.year, p.value || 0]));
      const aprobadasMap = Object.fromEntries(apiPracticasAprobadasSeries.map((p) => [p.year, p.value || 0]));

      return {
        labels: allYears.map(String),
        series: [
          { label: 'Inscritas', values: allYears.map((y) => inscritasMap[y] ?? 0) },
          { label: 'Aprobadas', values: allYears.map((y) => aprobadasMap[y] ?? 0) },
        ],
      };
    }
    return mockPracticasYear;
  }, [hasRealData, apiPracticasInscritasSeries, apiPracticasAprobadasSeries, yearRange]);

  const finalTituladosYear = useMemo(() => {
    if (hasRealData && apiTituladosSeries && apiTituladosSeries.length > 0) {
      return apiTituladosSeries
        .filter((p) => p.year >= yearRange[0] && p.year <= yearRange[1])
        .map((p) => ({
          year: String(p.year),
          value: p.value != null ? Number(p.value) : 0,
        }));
    }
    return mockTituladosYear.filter((d) => {
      const y = parseInt(d.year, 10);
      return y >= yearRange[0] && y <= yearRange[1];
    });
  }, [hasRealData, apiTituladosSeries, yearRange]);

  const finalTiempoTitulacion = useMemo(() => {
    if (hasRealData && kpiCards.tiempo.raw != null) {
      return Number(kpiCards.tiempo.raw);
    }
    return mockTiempoTitulacion;
  }, [hasRealData, kpiCards.tiempo.raw]);

  // 7. Opciones de filtros dinámicas
  const filterOptions = useMemo(() => {
    const af = apiFilters?.filters;
    return {
      cohorte: af?.cohortes?.length ? af.cohortes.map(String) : ['2021', '2022'],
      estado: af?.estados?.length ? af.estados : ['Aprobado', 'Reprobado'],
      periodo: af?.semesters?.length ? af.semesters.map(String) : ['1', '2'],
      asignatura: af?.asignaturas?.length ? af.asignaturas : [
        'Gestión de Personas',
        'Auditoría',
        'Economía',
        'Finanzas',
        'Taller de Titulación',
        'Derecho Tributario',
        'Contabilidad I',
        'Contabilidad II',
        'Estadística',
        'Costos',
      ],
      tipoPractica: af?.tiposPractica?.length ? af.tiposPractica : ['Práctica I', 'Práctica II', 'Práctica Profesional'],
    };
  }, [apiFilters]);

  // 8. Manejo del Drawer Lateral con API y fallback
  const drawerYears = useMemo(() => {
    return availableYears;
  }, [availableYears]);

  const handleOpenIndicator = (key) => {
    setCurrentIndicatorKey(key);
    const backendKey = UI_TO_BACKEND_KEY[key] || key;
    const defaultYear = drawerYears.length > 0 ? Math.max(...drawerYears) : yearRange[1];
    setDrawerPeriod(String(defaultYear));
    setDrawerLoading(true);
    setDrawerOpen(true);

    const params = {
      department: 'desarrollo_curricular',
      year: defaultYear,
    };

    getIndicatorDetail(backendKey, params)
      .then((res) => {
        const detail = res?.data || res;
        if (detail && (detail.name || detail.title || detail.indicatorKey)) {
          setApiDrawerDetail(detail);
        } else {
          setApiDrawerDetail(null);
        }
      })
      .catch((err) => {
        console.warn('Detalle no disponible en API para:', backendKey, err);
        setApiDrawerDetail(null);
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setApiDrawerDetail(null);
  };

  // Abrir automáticamente el drawer si se ingresa con un hash (p.ej. desde la Landing Page)
  useEffect(() => {
    if (window.location.hash) {
      const hashKey = window.location.hash.replace('#', '');
      if (['aprobacion', 'asignaturas-criticas', 'tiempo-titulacion', 'reprobacion-asignatura', 'practicas', 'practicas-tipo', 'titulacion-cohorte'].includes(hashKey)) {
        handleOpenIndicator(hashKey);
      }
    }
  }, []);

  const handleDrawerPeriodChange = (val) => {
    setDrawerPeriod(val);
    setDrawerLoading(true);
    const backendKey = UI_TO_BACKEND_KEY[currentIndicatorKey] || currentIndicatorKey;
    getIndicatorDetail(backendKey, { department: 'desarrollo_curricular', year: parseInt(val, 10) })
      .then((res) => {
        const detail = res?.data || res;
        if (detail && (detail.name || detail.title || detail.indicatorKey)) {
          setApiDrawerDetail(detail);
        } else {
          setApiDrawerDetail(null);
        }
      })
      .catch((err) => {
        console.warn('Detalle no disponible en API para:', backendKey, err);
        setApiDrawerDetail(null);
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  };

  const drawerPeriodText = useMemo(() => {
    return drawerPeriod ? `Año: ${drawerPeriod}` : '';
  }, [drawerPeriod]);

  const currentIndicator = useMemo(() => {
    if (apiDrawerDetail) {
      const rows = Array.isArray(apiDrawerDetail.table)
        ? apiDrawerDetail.table.map((r) => [
            r.label || String(r.year || '-'),
            typeof r.value === 'number'
              ? (apiDrawerDetail.unit === '%' ? `${r.value} %` : String(r.value))
              : String(r.value || '-'),
          ])
        : [];
      const title = apiDrawerDetail.name || apiDrawerDetail.title || MOCK_INDICATORS[currentIndicatorKey]?.title;
      return {
        title,
        desc: apiDrawerDetail.description || MOCK_INDICATORS[currentIndicatorKey]?.desc,
        metric: {
          label: `${title || 'Valor'} (${apiDrawerDetail.unit || ''})`,
          value: apiDrawerDetail.total ?? apiDrawerDetail.formattedTotal ?? '-',
        },
        trend: apiDrawerDetail.comparison
          ? {
              delta: apiDrawerDetail.comparison.diff,
              baseline: String(apiDrawerDetail.comparison.previousYear),
              isPositive: apiDrawerDetail.comparison.diff >= 0,
            }
          : null,
        rows: rows.length > 0 ? rows : (MOCK_INDICATORS[currentIndicatorKey]?.rows || []),
        colLabels: [
          apiDrawerDetail.dimensionLabels?.[apiDrawerDetail.groupBy] || 'Categoría',
          apiDrawerDetail.unit ? `Valor (${apiDrawerDetail.unit})` : 'Valor',
        ],
        state: 'data',
      };
    }
    return MOCK_INDICATORS[currentIndicatorKey] || MOCK_INDICATORS['aprobacion'];
  }, [apiDrawerDetail, currentIndicatorKey]);

  const displayRows = useMemo(() => {
    return currentIndicator?.rows || [];
  }, [currentIndicator]);

  return {
    navigate,
    user,
    logout,
    mobileOpen,
    setMobileOpen,
    collapsedSections,
    handleToggleSection,
    filtersCollapsed,
    setFiltersCollapsed,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    yearRange,
    setYearRange,
    periodoAcumulado,
    setPeriodoAcumulado,
    availableYears,
    minYear,
    maxYear,
    selectedChips,
    handleToggleChip,
    accordionsOpen,
    handleToggleAccordion,
    handleResetFilters,
    activeFiltersCount,
    filterOptions,
    apiLoading,
    apiError,
    hasRealData,
    kpiCards,
    drawerOpen,
    drawerLoading,
    currentIndicator,
    currentIndicatorKey,
    drawerPeriod,
    drawerYears,
    handleDrawerPeriodChange,
    drawerPeriodText,
    displayRows,
    handleOpenIndicator,
    handleCloseDrawer,
    aprobacionYear: finalAprobacionYear,
    reprobacionYear: finalReprobacionYear,
    reprobacionAsignaturas: finalReprobacionAsignaturas,
    asignaturasCriticas: finalAsignaturasCriticas,
    practicasYear: finalPracticasYear,
    titulacionCohorte: mockTitulacionCohorte,
    tituladosYear: finalTituladosYear,
    tiempoTitulacion: finalTiempoTitulacion,
  };
};
