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
    title: 'Tasa de aprobación por año',
    desc: 'Porcentaje de estudiantes que aprueban cada asignatura en el semestre.',
    metric: { label: 'Tasa de aprobación global (%)', value: null },
    trend: null,
    rows: [],
    colLabels: ['Año', 'Tasa de aprobación (%)'],
    state: 'empty',
  },
  'reprobacion': {
    title: 'Tasa de reprobación por año',
    desc: 'Porcentaje de estudiantes que reprueban cada asignatura en el período académico.',
    metric: { label: 'Tasa de reprobación global (%)', value: null },
    trend: null,
    rows: [],
    colLabels: ['Año', 'Tasa de reprobación (%)'],
    state: 'empty',
  },
  'reprobacion-asignatura': {
    title: 'Tasa de reprobación por asignatura',
    desc: 'Porcentaje de reprobados por asignatura. Permite identificar asignaturas críticas.',
    metric: { label: 'Reprobación global (%)', value: null },
    trend: null,
    rows: [],
    colLabels: ['Asignatura', 'Tasa de reprobación (%)'],
    state: 'empty',
  },
  'asignaturas-criticas': {
    title: 'Asignaturas críticas',
    desc: 'Listado de asignaturas con tasa de reprobación superior al umbral definido por la institución.',
    metric: { label: 'Asignaturas críticas (reprobación ≥ 20 %)', value: null },
    trend: null,
    rows: [],
    colLabels: ['Asignatura', 'Tasa de reprobación (%)'],
    state: 'empty',
  },
  'practicas': {
    title: 'Prácticas: inscritas vs. aprobadas',
    desc: 'Número de estudiantes inscritos en práctica profesional por semestre.',
    metric: { label: 'Inscritas', value: null },
    trend: null,
    rows: [],
    colLabels: ['Año', 'Inscritas', 'Aprobadas'],
    state: 'empty',
  },
  'practicas-tipo': {
    title: 'Prácticas por tipo',
    desc: 'Número de estudiantes que aprueban su práctica profesional.',
    metric: { label: 'Aprobadas', value: null },
    trend: null,
    rows: [],
    colLabels: ['Tipo de práctica', 'Inscritas', 'Aprobadas'],
    state: 'empty',
  },
  'titulacion-cohorte': {
    title: 'Tasa de titulación por cohorte',
    desc: 'Porcentaje de estudiantes de una cohorte que se titulan dentro del tiempo normativo y con desfase.',
    metric: { label: 'Tasa en tiempo normativo (%)', value: null },
    trend: null,
    rows: [],
    colLabels: ['Cohorte', 'Titulados', 'En tiempo normativo', 'Con desfase'],
    state: 'empty',
  },
  'titulacion-tiempo': {
    title: 'Titulados en tiempo normativo',
    desc: 'Porcentaje de estudiantes de una cohorte que se titulan dentro del tiempo normativo y con desfase.',
    metric: { label: 'Titulados en tiempo normativo (%)', value: null },
    trend: null,
    rows: [],
    colLabels: ['Cohorte', 'Titulados', 'En tiempo normativo', 'Con desfase'],
    state: 'empty',
  },
  'titulados-anio': {
    title: 'Titulados por año',
    desc: 'Total de titulados por carrera y año calendario.',
    metric: { label: 'Titulados', value: null },
    trend: null,
    rows: [],
    colLabels: ['Año', 'Titulados'],
    state: 'empty',
  },
  'tiempo-titulacion': {
    title: 'Tiempo promedio de titulación',
    desc: 'Promedio de semestres cursados hasta el título, por carrera.',
    metric: { label: 'Tiempo promedio (semestres)', value: null },
    trend: null,
    rows: [],
    colLabels: ['Indicador', 'Semestres'],
    state: 'empty',
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
  const [apiPracticasInscritasTipo, setApiPracticasInscritasTipo] = useState(null);
  const [apiPracticasAprobadasTipo, setApiPracticasAprobadasTipo] = useState(null);
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
      getIndicatorBreakdown('practicas_inscritas', { ...breakdownParams, groupBy: 'tipoPractica' }).catch(() => null),
      getIndicatorBreakdown('practicas_aprobadas', { ...breakdownParams, groupBy: 'tipoPractica' }).catch(() => null),
      getIndicatorSeries('titulados_por_anio', seriesParams).catch(() => null),
    ])
      .then(([
        summaryRes,
        aprobacionSeriesRes,
        reprobacionSeriesRes,
        reprobacionBreakdownRes,
        practicasInscritasSeriesRes,
        practicasAprobadasSeriesRes,
        practicasInscritasTipoRes,
        practicasAprobadasTipoRes,
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
        if (practicasInscritasTipoRes?.success && practicasInscritasTipoRes.data?.items) {
          setApiPracticasInscritasTipo(practicasInscritasTipoRes.data.items);
        }
        if (practicasAprobadasTipoRes?.success && practicasAprobadasTipoRes.data?.items) {
          setApiPracticasAprobadasTipo(practicasAprobadasTipoRes.data.items);
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
      (apiTituladosSeries && apiTituladosSeries.some((p) => p.value !== null && p.value > 0)) ||
      (apiPracticasInscritasSeries && apiPracticasInscritasSeries.some((p) => p.value !== null && p.value > 0)) ||
      (apiPracticasAprobadasSeries && apiPracticasAprobadasSeries.some((p) => p.value !== null && p.value > 0))
    );
    const hasBreakdown = Boolean(
      (apiReprobacionBreakdown && apiReprobacionBreakdown.some((i) => i.value !== null)) ||
      (apiPracticasInscritasTipo && apiPracticasInscritasTipo.some((i) => i.value !== null)) ||
      (apiPracticasAprobadasTipo && apiPracticasAprobadasTipo.some((i) => i.value !== null))
    );
    return Boolean(hasSummaryData || hasSeries || hasBreakdown);
  }, [
    apiSummary,
    apiAprobacionSeries,
    apiReprobacionSeries,
    apiTituladosSeries,
    apiPracticasInscritasSeries,
    apiPracticasAprobadasSeries,
    apiReprobacionBreakdown,
    apiPracticasInscritasTipo,
    apiPracticasAprobadasTipo,
  ]);

  // 5. KPIs superiores dinámicos calculados desde el Summary y Series (100% datos reales)
  const kpiCards = useMemo(() => {
    const dept = apiSummary?.departments?.find((d) => d.departmentId === 'desarrollo_curricular');
    const cards = dept?.cards || [];
    const getCard = (key) => cards.find((c) => c.indicatorKey === key);

    const cardAprobacion = getCard('tasa_aprobacion_asignatura');
    const cardCriticas = getCard('asignaturas_criticas');
    const cardTiempo = getCard('tiempo_promedio_titulacion');

    // --- CÁLCULO DINÁMICO PARA TASA DE APROBACIÓN GLOBAL ---
    const yDesde = yearRange[0];
    const yHasta = yearRange[1];
    const isSingleYear = yDesde === yHasta;
    const isAccumulated = periodoAcumulado && !isSingleYear;
    const minAvailableYear = availableYears.length > 0 ? Math.min(...availableYears) : 2023;
    const isBaseline = isSingleYear && yDesde === minAvailableYear;

    const getValForYear = (yr) => {
      if (apiAprobacionSeries && apiAprobacionSeries.length > 0) {
        const found = apiAprobacionSeries.find((p) => Number(p.year) === Number(yr));
        return found && found.value != null ? Number(found.value) : null;
      }
      return null;
    };

    let aprobacionValNumber = null;
    let aprobacionFormattedValue = null;
    let compareText = undefined;
    let evolution = undefined;
    let isPositive = true;
    let hasAprobacionData = Boolean(cardAprobacion?.hasData && cardAprobacion?.value != null);

    if (apiAprobacionSeries && apiAprobacionSeries.length > 0) {
      if (isAccumulated) {
        const inRangeVals = [];
        for (let y = yDesde; y <= yHasta; y++) {
          const val = getValForYear(y);
          if (val !== null && !isNaN(val)) inRangeVals.push(val);
        }
        if (inRangeVals.length > 0) {
          const avg = inRangeVals.reduce((acc, v) => acc + v, 0) / inRangeVals.length;
          aprobacionValNumber = avg;
          aprobacionFormattedValue = `${avg.toFixed(1).replace('.', ',')} %`;
          hasAprobacionData = true;

          const baseVal = getValForYear(yDesde);
          if (baseVal != null) {
            const diff = Number((avg - baseVal).toFixed(1));
            evolution = `${diff >= 0 ? '+' : '−'}${Math.abs(diff).toFixed(1).replace('.', ',')} pp`;
            isPositive = diff >= 0;
            compareText = `vs Año base (${yDesde}): ${baseVal.toFixed(1).replace('.', ',')} %`;
          } else {
            compareText = `Acumulado período ${yDesde} — ${yHasta}`;
          }
        }
      } else {
        const valHasta = getValForYear(yHasta);
        if (valHasta != null) {
          aprobacionValNumber = valHasta;
          aprobacionFormattedValue = `${valHasta.toFixed(1).replace('.', ',')} %`;
          hasAprobacionData = true;

          if (isBaseline) {
            compareText = `Año ${yDesde} es la línea base`;
            evolution = null;
            isPositive = true;
          } else {
            const compareYear = isSingleYear ? yDesde - 1 : yDesde;
            const baseVal = getValForYear(compareYear);
            if (baseVal != null) {
              const diff = Number((valHasta - baseVal).toFixed(1));
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
      }
    }

    if (!hasAprobacionData && cardAprobacion) {
      hasAprobacionData = Boolean(cardAprobacion.hasData && cardAprobacion.value != null);
      if (hasAprobacionData) {
        aprobacionFormattedValue = cardAprobacion.formattedValue || `${cardAprobacion.value} %`;
        aprobacionValNumber = cardAprobacion.value;
      }
    }

    const hasCriticasData = Boolean(cardCriticas?.hasData && cardCriticas?.value != null);
    const criticasValue = hasCriticasData
      ? (cardCriticas.formattedValue || String(cardCriticas.value))
      : null;

    const hasTiempoData = Boolean(cardTiempo?.hasData && cardTiempo?.value != null);
    const tiempoValue = hasTiempoData
      ? (cardTiempo.formattedValue || Number(cardTiempo.value).toLocaleString('es-CL', { maximumFractionDigits: 2 }))
      : null;

    return {
      aprobacion: {
        value: aprobacionFormattedValue,
        hasData: hasAprobacionData,
        raw: aprobacionValNumber,
        compareText: hasAprobacionData ? compareText : undefined,
        evolution: hasAprobacionData ? evolution : undefined,
        isPositive,
      },
      criticas: {
        value: criticasValue,
        hasData: hasCriticasData,
        raw: cardCriticas?.value ?? null,
      },
      tiempo: {
        value: tiempoValue,
        hasData: hasTiempoData,
        raw: cardTiempo?.value ?? null,
      },
    };
  }, [
    apiSummary,
    apiAprobacionSeries,
    yearRange,
    periodoAcumulado,
    availableYears,
  ]);

  // 6. Asignación de datos finales para gráficos (100% API real sin mockups)
  const finalAprobacionYear = useMemo(() => {
    if (apiAprobacionSeries && apiAprobacionSeries.length > 0) {
      return apiAprobacionSeries
        .filter((p) => p.year >= yearRange[0] && p.year <= yearRange[1])
        .map((p) => ({
          year: String(p.year),
          value: p.value != null ? Number(p.value.toFixed(1)) : 0,
        }));
    }
    return [];
  }, [apiAprobacionSeries, yearRange]);

  const finalReprobacionYear = useMemo(() => {
    if (apiReprobacionSeries && apiReprobacionSeries.length > 0) {
      return apiReprobacionSeries
        .filter((p) => p.year >= yearRange[0] && p.year <= yearRange[1])
        .map((p) => ({
          year: String(p.year),
          value: p.value != null ? Number(p.value.toFixed(1)) : 0,
        }));
    }
    return [];
  }, [apiReprobacionSeries, yearRange]);

  const finalReprobacionAsignaturas = useMemo(() => {
    if (apiReprobacionBreakdown && apiReprobacionBreakdown.length > 0) {
      return apiReprobacionBreakdown.map((i) => ({
        label: i.label,
        value: Number(Number(i.value || 0).toFixed(1)),
      }));
    }
    return [];
  }, [apiReprobacionBreakdown]);

  const finalAsignaturasCriticas = useMemo(() => {
    return finalReprobacionAsignaturas.filter((d) => d.value >= 20);
  }, [finalReprobacionAsignaturas]);

  const finalPracticasYear = useMemo(() => {
    if (apiPracticasInscritasSeries?.length || apiPracticasAprobadasSeries?.length) {
      const allYears = [...new Set([
        ...(apiPracticasInscritasSeries || []).map((p) => p.year),
        ...(apiPracticasAprobadasSeries || []).map((p) => p.year),
      ])].sort((a, b) => a - b).filter((y) => y >= yearRange[0] && y <= yearRange[1]);

      if (allYears.length === 0) return { labels: [], series: [] };

      const inscritasMap = Object.fromEntries((apiPracticasInscritasSeries || []).map((p) => [p.year, p.value || 0]));
      const aprobadasMap = Object.fromEntries((apiPracticasAprobadasSeries || []).map((p) => [p.year, p.value || 0]));

      return {
        labels: allYears.map(String),
        series: [
          { label: 'Inscritas', values: allYears.map((y) => inscritasMap[y] ?? 0) },
          { label: 'Aprobadas', values: allYears.map((y) => aprobadasMap[y] ?? 0) },
        ],
      };
    }
    return { labels: [], series: [] };
  }, [apiPracticasInscritasSeries, apiPracticasAprobadasSeries, yearRange]);

  const practicasPorTipo = useMemo(() => {
    if (!apiPracticasInscritasTipo?.length && !apiPracticasAprobadasTipo?.length) return [];
    const tipos = [...new Set([
      ...(apiPracticasInscritasTipo || []).map((i) => i.label),
      ...(apiPracticasAprobadasTipo || []).map((i) => i.label),
    ])].filter(Boolean);
    const inscritasMap = Object.fromEntries((apiPracticasInscritasTipo || []).map((i) => [i.label, i.value || 0]));
    const aprobadasMap = Object.fromEntries((apiPracticasAprobadasTipo || []).map((i) => [i.label, i.value || 0]));
    return tipos.map((tipo) => ({
      tipo,
      inscritas: inscritasMap[tipo] ?? 0,
      aprobadas: aprobadasMap[tipo] ?? 0,
    }));
  }, [apiPracticasInscritasTipo, apiPracticasAprobadasTipo]);

  const finalTituladosYear = useMemo(() => {
    if (apiTituladosSeries && apiTituladosSeries.length > 0) {
      return apiTituladosSeries
        .filter((p) => p.year >= yearRange[0] && p.year <= yearRange[1])
        .map((p) => ({
          year: String(p.year),
          value: p.value != null ? Number(p.value) : 0,
        }));
    }
    return [];
  }, [apiTituladosSeries, yearRange]);

  const finalTiempoTitulacion = useMemo(() => {
    if (kpiCards.tiempo.hasData && kpiCards.tiempo.raw != null) {
      return Number(kpiCards.tiempo.raw);
    }
    return null;
  }, [kpiCards.tiempo]);

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
    if (key === 'aprobacion' || key === 'reprobacion') {
      params.groupBy = 'year';
    }

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
      if (['aprobacion', 'reprobacion', 'asignaturas-criticas', 'tiempo-titulacion', 'reprobacion-asignatura', 'practicas', 'practicas-tipo', 'titulacion-cohorte'].includes(hashKey)) {
        handleOpenIndicator(hashKey);
      }
    }
  }, []);

  const handleDrawerPeriodChange = (val) => {
    setDrawerPeriod(val);
    setDrawerLoading(true);
    const backendKey = UI_TO_BACKEND_KEY[currentIndicatorKey] || currentIndicatorKey;
    const params = { department: 'desarrollo_curricular', year: parseInt(val, 10) };
    if (currentIndicatorKey === 'aprobacion' || currentIndicatorKey === 'reprobacion') {
      params.groupBy = 'year';
    }
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

  const drawerPeriodText = useMemo(() => {
    return drawerPeriod ? `Año: ${drawerPeriod}` : '';
  }, [drawerPeriod]);

  const currentIndicator = useMemo(() => {
    const meta = MOCK_INDICATORS[currentIndicatorKey] || MOCK_INDICATORS['aprobacion'];
    if (apiDrawerDetail) {
      const rows = Array.isArray(apiDrawerDetail.table)
        ? apiDrawerDetail.table.map((r) => [
            r.label || String(r.year || '-'),
            typeof r.value === 'number'
              ? (apiDrawerDetail.unit === '%' ? `${Number(r.value.toFixed(2)).toLocaleString('es-CL')} %` : String(Number(r.value.toFixed(2)).toLocaleString('es-CL')))
              : String(r.value || '-'),
          ])
        : [];
      const customTitles = {
        'aprobacion': 'Tasa de aprobación por año',
        'reprobacion': 'Tasa de reprobación por año',
        'reprobacion-asignatura': 'Tasa de reprobación por asignatura',
      };
      const title = customTitles[currentIndicatorKey] || apiDrawerDetail.name || apiDrawerDetail.title || meta?.title || 'Indicador';
      return {
        title,
        desc: apiDrawerDetail.description || meta?.desc || '',
        metric: {
          label: `${title} (${apiDrawerDetail.unit || ''})`,
          value: apiDrawerDetail.total != null
            ? (apiDrawerDetail.unit === '%' ? `${Number(apiDrawerDetail.total.toFixed(2)).toLocaleString('es-CL')} %` : Number(apiDrawerDetail.total.toFixed(2)).toLocaleString('es-CL'))
            : (apiDrawerDetail.formattedTotal ?? '-'),
        },
        trend: apiDrawerDetail.comparison
          ? {
              delta: typeof apiDrawerDetail.comparison.diff === 'number'
                ? Math.round(apiDrawerDetail.comparison.diff * 100) / 100
                : apiDrawerDetail.comparison.diff,
              baseline: String(apiDrawerDetail.comparison.previousYear),
              isPositive: apiDrawerDetail.comparison.diff >= 0,
            }
          : null,
        rows: rows,
        colLabels: [
          apiDrawerDetail.dimensionLabels?.[apiDrawerDetail.groupBy] || (apiDrawerDetail.groupBy === 'year' ? 'Año' : 'Categoría'),
          apiDrawerDetail.unit ? `Valor (${apiDrawerDetail.unit})` : 'Valor',
        ],
        state: rows.length > 0 ? 'data' : 'empty',
      };
    }
    return {
      title: meta?.title || 'Indicador',
      desc: meta?.desc || '',
      metric: {
        label: meta?.title || 'Valor',
        value: '-',
      },
      trend: null,
      rows: [],
      colLabels: meta?.colLabels || ['Categoría', 'Valor'],
      state: 'empty',
    };
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
    practicasPorTipo,
    titulacionCohorte: { labels: [], series: [] },
    tituladosYear: finalTituladosYear,
    tiempoTitulacion: finalTiempoTitulacion,
  };
};
