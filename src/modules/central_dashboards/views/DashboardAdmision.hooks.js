import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { 
  getDepartmentFilters, 
  getDashboardSummary, 
  getIndicatorSeries, 
  getIndicatorBreakdown,
  getIndicatorDetail
} from '../../../services/piadiApi';

export const UI_TO_BACKEND_KEY = {
  'matricula-total': 'matricula_total',
  'nuevos-antiguos': 'nuevos_vs_antiguos',
  'via-acceso-kpi': 'via_acceso',
  'via-acceso': 'via_acceso',
  'matricula-asignatura': 'matricula_por_asignatura',
  'matricula-seccion': 'matricula_por_seccion',
  'estado-academico': 'matricula_por_estado_academico',
  'nivel-socioeconomico': 'nivel_socioeconomico',
  'situacion-familiar': 'situacion_familiar',
  'procedencia-geografica': 'procedencia_geografica',
  'tipo-colegio': 'tipo_colegio',
  'beneficios-becas': 'beneficios_becas',
  'distribucion-sexo': 'distribucion_sexo',
  'distribucion-edad': 'rango_etario',
};

export const INDICATOR_SPECIFIC_DIMENSION = {
  'matricula-total': null,
  'nuevos-antiguos': 'nuevoAntiguo',
  'via-acceso-kpi': 'viaAcceso',
  'via-acceso': 'viaAcceso',
  'matricula-asignatura': 'asignatura',
  'matricula-seccion': 'seccion',
  'estado-academico': 'estadoAcademico',
  'nivel-socioeconomico': 'nivelSocioeconomico',
  'situacion-familiar': 'situacionFamiliar',
  'procedencia-geografica': 'region',
  'tipo-colegio': 'tipoColegio',
  'beneficios-becas': 'beneficios',
  'distribucion-sexo': 'sexo',
  'distribucion-edad': 'rangoEtario',
};

export const YEARS = [2023, 2024, 2025, 2026];

export const formatSexoLabel = (raw) => {
  if (!raw) return 'OTROS';
  const str = String(raw).trim().toUpperCase();
  if (str === 'M' || str === 'MASCULINO') return 'MASCULINO';
  if (str === 'F' || str === 'FEMENINO') return 'FEMENINO';
  if (str === 'O' || str === 'OTRO' || str === 'OTROS') return 'OTROS';
  return str;
};

export const CAT_COLORS = [
  '#171796', '#5151CC', '#8181DE', '#8A4BD6', '#C24BC9', '#3E8FD9', '#2FB8A6', '#E0A63B'
];

export const RAMP_COLORS = [
  '#171796', '#3E50B4', '#667ACF', '#8F9FE0', '#B4B4EC'
];

export const INDICATORS = {
  'matricula-total': {
    title: 'Matrícula total por período',
    desc: 'Matrícula total de la carrera Contador Auditor al cierre de cada período, desagregada por semestre. Se calcula sumando los estudiantes matriculados en Semestre 1 y Semestre 2 de cada año.',
    metric: { label: 'Matrícula total', value: null },
    colLabels: ['Año', 'Estudiantes'],
    state: 'data'
  },
  'nuevos-antiguos': {
    title: 'Matrícula nuevos vs antiguos',
    desc: 'Comparación entre estudiantes que ingresan por primera vez (nuevos) y estudiantes que continúan (antiguos) en cada período.',
    metric: { label: 'Estudiantes nuevos', value: null },
    colLabels: ['Tipo de estudiante', 'Estudiantes'],
    state: 'data'
  },
  'via-acceso-kpi': {
    title: 'Vía de acceso principal',
    desc: 'Mecanismo por el cual el estudiante ingresó a la carrera. PAES corresponde a la vía de ingreso regular mayoritaria.',
    metric: { label: 'Ingreso regular PAES', value: null },
    colLabels: ['Vía de acceso', 'Estudiantes'],
    state: 'data'
  },
  'matricula-asignatura': {
    title: 'Matrícula por asignatura',
    desc: 'Número de estudiantes inscritos en cada asignatura del plan de estudios. Ordenado de mayor a menor matrícula.',
    metric: { label: 'Asignaturas con matrícula', value: null },
    colLabels: ['Asignatura', 'Estudiantes'],
    state: 'data'
  },
  'matricula-seccion': {
    title: 'Matrícula por sección',
    desc: 'Distribución de estudiantes por sección de la carrera. Permite dimensionar el tamaño de cada grupo-curso.',
    metric: { label: 'Secciones activas', value: null },
    colLabels: ['Sección', 'Estudiantes'],
    state: 'data'
  },
  'estado-academico': {
    title: 'Matrícula por estado académico',
    desc: 'Clasificación de los estudiantes según su situación académica vigente al cierre del período.',
    metric: { label: 'Estudiantes regulares', value: null },
    colLabels: ['Estado', 'Estudiantes'],
    state: 'data'
  },
  'nivel-socioeconomico': {
    title: 'Nivel socioeconómico (quintiles)',
    desc: 'Distribución de estudiantes según quintil de ingreso del hogar, estimado a partir de la ficha socioeconómica de admisión.',
    metric: { label: 'Estudiantes caracterizados', value: null },
    colLabels: ['Quintil', 'Estudiantes'],
    state: 'data'
  },
  'situacion-familiar': {
    title: 'Situación familiar',
    desc: 'Composición del hogar declarada por el estudiante al momento de la matrícula.',
    metric: { label: 'Estudiantes', value: null },
    colLabels: ['Situación', 'Estudiantes'],
    state: 'data'
  },
  'procedencia-geografica': {
    title: 'Procedencia geográfica',
    desc: 'Región de origen de los estudiantes matriculados. Se muestra el ranking de regiones con mayor matrícula.',
    metric: { label: 'Regiones representadas', value: null },
    colLabels: ['Región', 'Estudiantes'],
    state: 'data'
  },
  'tipo-colegio': {
    title: 'Tipo de colegio',
    desc: 'Dependencia administrativa del establecimiento de educación media de origen.',
    metric: { label: 'Estudiantes', value: null },
    colLabels: ['Tipo de colegio', 'Estudiantes'],
    state: 'data'
  },
  'via-acceso': {
    title: 'Vía de acceso',
    desc: 'Mecanismo por el cual el estudiante ingresó a la carrera. PAES corresponde a la admisión regular.',
    metric: { label: 'Ingreso vía PAES', value: null },
    colLabels: ['Vía de acceso', 'Estudiantes'],
    state: 'data'
  },
  'beneficios-becas': {
    title: 'Beneficios y becas',
    desc: 'Tipo de beneficio estudiantil asignado al momento de la matrícula (gratuidad, beca interna o sin beneficio).',
    metric: { label: 'Estudiantes con beneficio', value: null },
    colLabels: ['Beneficio', 'Estudiantes'],
    state: 'data'
  },
  'distribucion-sexo': {
    title: 'Distribución por sexo',
    desc: 'Composición de la matrícula según sexo registrado.',
    metric: { label: 'Matrícula femenina', value: null },
    colLabels: ['Sexo', 'Estudiantes'],
    state: 'data'
  },
  'distribucion-edad': {
    title: 'Distribución por edad',
    desc: 'Distribución de estudiantes por rango de edad al momento de la matrícula.',
    metric: { label: 'Estudiantes', value: null },
    colLabels: ['Rango de edad', 'Estudiantes'],
    state: 'data'
  }
};

export const useDashboardAdmision = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Estados de layout y diálogo
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // Pestaña activa: 'matricula' (Matrícula y Académico) o 'caracterizacion' (Caracterización del Estudiante)
  const [activeTab, setActiveTab] = useState('matricula');

  // Estados de filtros
  const [yearRange, setYearRange] = useState([2023, 2026]);
  const [periodoAcumulado, setPeriodoAcumulado] = useState(false);
  const [selectedChips, setSelectedChips] = useState({
    semestre: [],
    estado: [],
    colegio: [],
    via: [],
    sexo: [],
    nse: []
  });

  // Acordeones abiertos
  const [accordionsOpen, setAccordionsOpen] = useState({
    semestre: true,
    estado: true,
    colegio: true,
    via: true,
    sexo: false,
    nse: false
  });

  // Secciones colapsadas
  const [collapsedSections, setCollapsedSections] = useState({
    'mat-total': false,
    'mat-nuevos': false,
    'mat-asignatura': false,
    'mat-seccion': false,
    'mat-estado': false,
    'car-nse': false,
    'car-familiar': false,
    'car-region': false,
    'car-colegio': false,
    'car-via': false,
    'car-becas': false,
    'car-sexo': false,
    'car-edad': false
  });

  // Drawer de Detalle del indicador (PIADI-409)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentIndicatorKey, setCurrentIndicatorKey] = useState('matricula-total');
  const [drawerPeriod, setDrawerPeriod] = useState('2026');
  const [drawerGroupBy, setDrawerGroupBy] = useState(null);
  const [drawerSemesterFilter, setDrawerSemesterFilter] = useState('all');
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState(null);
  const [apiIndicatorDetail, setApiIndicatorDetail] = useState(null);

  // Estados de API para Admisión
  const [apiLoading, setApiLoading] = useState(false);
  const [apiFilters, setApiFilters] = useState(null);
  const [apiSummary, setApiSummary] = useState(null);
  const [apiPrevSummary, setApiPrevSummary] = useState(null);

  // Series y breakdowns
  const [apiMatTotalSeries, setApiMatTotalSeries] = useState(null);
  const [apiMatNuevosSeries, setApiMatNuevosSeries] = useState(null);
  const [apiMatAsignaturaBreakdown, setApiMatAsignaturaBreakdown] = useState(null);
  const [apiMatSeccionBreakdown, setApiMatSeccionBreakdown] = useState(null);
  const [apiMatEstadoBreakdown, setApiMatEstadoBreakdown] = useState(null);
  const [apiCarNseBreakdown, setApiCarNseBreakdown] = useState(null);
  const [apiCarFamiliarBreakdown, setApiCarFamiliarBreakdown] = useState(null);
  const [apiCarRegionBreakdown, setApiCarRegionBreakdown] = useState(null);
  const [apiCarColegioBreakdown, setApiCarColegioBreakdown] = useState(null);
  const [apiCarViaBreakdown, setApiCarViaBreakdown] = useState(null);
  const [apiCarBecasBreakdown, setApiCarBecasBreakdown] = useState(null);
  const [apiCarSexoBreakdown, setApiCarSexoBreakdown] = useState(null);
  const [apiCarEdadBreakdown, setApiCarEdadBreakdown] = useState(null);

  // Carga inicial de filtros desde la API
  useEffect(() => {
    getDepartmentFilters('admision')
      .then((res) => {
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
      .catch((err) => {
        console.error('Error cargando filtros del departamento Admisión:', err);
      });
  }, []);

  // Parámetros calculados para las peticiones API
  const apiParams = useMemo(() => {
    const params = { department: 'admision' };
    const desde = yearRange[0];
    const hasta = yearRange[1];
    
    if (desde === hasta) {
      params.year = String(desde);
    } else {
      params.fromYear = String(desde);
      params.toYear = String(hasta);
    }

    if (selectedChips.semestre.length > 0) {
      params.periodo = selectedChips.semestre.join(',');
    }
    if (selectedChips.estado.length > 0) {
      params.estadoAcademico = selectedChips.estado.join(',');
    }
    if (selectedChips.colegio.length > 0) {
      params.tipoColegio = selectedChips.colegio.join(',');
    }
    if (selectedChips.via.length > 0) {
      params.viaAcceso = selectedChips.via.join(',');
    }
    if (selectedChips.sexo.length > 0) {
      params.sexo = selectedChips.sexo.join(',');
    }
    if (selectedChips.nse.length > 0) {
      params.nivelSocioeconomico = selectedChips.nse.join(',');
    }

    return params;
  }, [yearRange, selectedChips]);

  // Carga de datos reales desde la API
  useEffect(() => {
    setApiLoading(true);

    const desde = yearRange[0];
    const hasta = yearRange[1];
    const years = apiFilters?.years ?? [2023, 2024, 2025, 2026];
    const minAvailableYear = years.length > 0 ? Math.min(...years) : 2023;

    const seriesParams = { ...apiParams };
    delete seriesParams.year;
    seriesParams.fromYear = String(desde);
    seriesParams.toYear = String(hasta);

    const prevYear = desde > minAvailableYear ? desde - 1 : null;
    const prevParams = prevYear ? { ...apiParams, year: String(prevYear), fromYear: undefined, toYear: undefined } : null;

    const baseBreakdownParams = { ...apiParams };
    delete baseBreakdownParams.fromYear;
    delete baseBreakdownParams.toYear;

    const fetchBreakdown = (key, groupBy) => {
      if (desde === hasta) {
        return getIndicatorBreakdown(key, { ...baseBreakdownParams, year: String(desde), groupBy }).catch(() => null);
      }
      const yearsInRange = (apiFilters?.years ?? [2023, 2024, 2025, 2026]).filter(y => y >= desde && y <= hasta);
      return Promise.all(
        yearsInRange.map(y => getIndicatorBreakdown(key, { ...baseBreakdownParams, year: String(y), groupBy }).catch(() => null))
      ).then(responses => {
        const map = {};
        responses.forEach(res => {
          const items = res?.data?.items || res?.items || [];
          items.forEach(item => {
            const label = item.label || item.categoria || '';
            const val = Number(item.value) || 0;
            if (label && val > 0) {
              map[label] = (map[label] || 0) + val;
            }
          });
        });
        const items = Object.entries(map).map(([label, value]) => ({ label, value }));
        return { data: { items }, success: true };
      });
    };

    Promise.all([
      getDashboardSummary(apiParams).catch(() => null),
      prevParams ? getDashboardSummary(prevParams).catch(() => null) : Promise.resolve(null),
      getIndicatorSeries('matricula_total', { ...seriesParams, groupBy: 'periodo' }).catch(() => null),
      getIndicatorSeries('nuevos_vs_antiguos', { ...seriesParams, groupBy: 'nuevoAntiguo' }).catch(() => null),
      fetchBreakdown('matricula_por_asignatura', 'asignatura'),
      fetchBreakdown('matricula_por_seccion', 'seccion'),
      fetchBreakdown('matricula_por_estado_academico', 'estadoAcademico'),
      fetchBreakdown('nivel_socioeconomico', 'nivelSocioeconomico'),
      fetchBreakdown('situacion_familiar', 'situacionFamiliar'),
      fetchBreakdown('procedencia_geografica', 'region'),
      fetchBreakdown('tipo_colegio', 'tipoColegio'),
      fetchBreakdown('via_acceso', 'viaAcceso'),
      fetchBreakdown('beneficios_becas', 'beneficios'),
      fetchBreakdown('distribucion_sexo', 'sexo'),
      fetchBreakdown('rango_etario', 'rangoEtario'),
    ])
      .then(([
        summary,
        prevSummary,
        matTotalSeries,
        matNuevosSeries,
        matAsignatura,
        matSeccion,
        matEstado,
        carNse,
        carFamiliar,
        carRegion,
        carColegio,
        carVia,
        carBecas,
        carSexo,
        carEdad
      ]) => {
        setApiSummary(summary?.data || null);
        setApiPrevSummary(prevSummary?.data || null);
        setApiMatTotalSeries(matTotalSeries?.data || null);
        setApiMatNuevosSeries(matNuevosSeries?.data || null);
        setApiMatAsignaturaBreakdown(matAsignatura?.data || null);
        setApiMatSeccionBreakdown(matSeccion?.data || null);
        setApiMatEstadoBreakdown(matEstado?.data || null);
        setApiCarNseBreakdown(carNse?.data || null);
        setApiCarFamiliarBreakdown(carFamiliar?.data || null);
        setApiCarRegionBreakdown(carRegion?.data || null);
        setApiCarColegioBreakdown(carColegio?.data || null);
        setApiCarViaBreakdown(carVia?.data || null);
        setApiCarBecasBreakdown(carBecas?.data || null);
        setApiCarSexoBreakdown(carSexo?.data || null);
        setApiCarEdadBreakdown(carEdad?.data || null);
      })
      .catch((err) => {
        console.error('Error cargando métricas de Admisión:', err);
      })
      .finally(() => {
        setApiLoading(false);
      });
  }, [apiParams, apiFilters, yearRange]);

  // Manejadores de interacción
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const handleToggleAccordion = useCallback((key) => {
    setAccordionsOpen(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleToggleSection = useCallback((key) => {
    setCollapsedSections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleToggleChip = useCallback((category, value) => {
    setSelectedChips(prev => {
      const currentList = prev[category] || [];
      const exists = currentList.includes(value);
      const updatedList = exists 
        ? currentList.filter(item => item !== value)
        : [...currentList, value];
      return { ...prev, [category]: updatedList };
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedChips({
      semestre: [],
      estado: [],
      colegio: [],
      via: [],
      sexo: [],
      nse: []
    });
    setPeriodoAcumulado(false);
    const years = apiFilters?.years ?? YEARS;
    if (years.length > 0) {
      setYearRange([Math.min(...years), Math.max(...years)]);
    } else {
      setYearRange([2023, 2026]);
    }
  }, [apiFilters]);

  // Determinar si existen datos reales cargados en la base de datos
  const hasRealData = useMemo(() => {
    const hasSummaryData = Boolean(
      apiSummary?.departments?.some(d => 
        d.departmentId === 'admision' && d.cards?.some(c => c.hasData && c.value > 0)
      )
    );
    const hasSeries = Boolean(
      (apiMatTotalSeries?.series?.some(s => s.points?.some(p => p.value > 0))) ||
      (apiMatTotalSeries?.points?.some(p => p.value > 0)) ||
      (apiMatNuevosSeries?.series?.some(s => s.points?.some(p => p.value > 0)))
    );
    const hasBreakdowns = Boolean(
      (apiMatAsignaturaBreakdown?.items?.some(i => i.value > 0)) ||
      (apiMatSeccionBreakdown?.items?.some(i => i.value > 0)) ||
      (apiMatEstadoBreakdown?.items?.some(i => i.value > 0)) ||
      (apiCarNseBreakdown?.items?.some(i => i.value > 0)) ||
      (apiCarFamiliarBreakdown?.items?.some(i => i.value > 0)) ||
      (apiCarRegionBreakdown?.items?.some(i => i.value > 0)) ||
      (apiCarColegioBreakdown?.items?.some(i => i.value > 0)) ||
      (apiCarViaBreakdown?.items?.some(i => i.value > 0)) ||
      (apiCarBecasBreakdown?.items?.some(i => i.value > 0)) ||
      (apiCarSexoBreakdown?.items?.some(i => i.value > 0)) ||
      (apiCarEdadBreakdown?.items?.some(i => i.value > 0))
    );
    const hasAdmissionFilters = Boolean(
      (apiFilters?.years && apiFilters.years.length > 0) ||
      (apiFilters?.asignaturas && apiFilters.asignaturas.length > 0) ||
      (apiFilters?.estadosAcademicos && apiFilters.estadosAcademicos.length > 0) ||
      (apiFilters?.viasAcceso && apiFilters.viasAcceso.length > 0)
    );
    return Boolean(hasSummaryData || hasSeries || hasBreakdowns || hasAdmissionFilters);
  }, [
    apiSummary,
    apiMatTotalSeries,
    apiMatNuevosSeries,
    apiMatAsignaturaBreakdown,
    apiMatSeccionBreakdown,
    apiMatEstadoBreakdown,
    apiCarNseBreakdown,
    apiCarFamiliarBreakdown,
    apiCarRegionBreakdown,
    apiCarColegioBreakdown,
    apiCarViaBreakdown,
    apiCarBecasBreakdown,
    apiCarSexoBreakdown,
    apiCarEdadBreakdown,
    apiFilters
  ]);

  const isNoData = useMemo(() => !hasRealData, [hasRealData]);

  // Años disponibles según filtros
  const availableYears = useMemo(() => {
    if (apiFilters?.years?.length) return apiFilters.years;
    return YEARS;
  }, [apiFilters]);

  const minYear = useMemo(() => Math.min(...availableYears), [availableYears]);
  const maxYear = useMemo(() => Math.max(...availableYears), [availableYears]);

  const visibleYears = useMemo(() => {
    return availableYears.filter(y => y >= yearRange[0] && y <= yearRange[1]);
  }, [availableYears, yearRange]);

  // Contador de filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    Object.values(selectedChips).forEach(arr => {
      count += arr.length;
    });
    if (periodoAcumulado) count += 1;
    if (yearRange[0] !== minYear || yearRange[1] !== maxYear) count += 1;
    return count;
  }, [selectedChips, periodoAcumulado, yearRange, minYear, maxYear]);

  // 1. Matrícula total por período (Semestre 1 / Semestre 2)
  const matTotalData = useMemo(() => {
    if (!hasRealData || !apiMatTotalSeries) return [];
    
    // Si viene agrupado por serie (periodo 1 y 2)
    const s1Series = apiMatTotalSeries.series?.find(s => String(s.label) === '1' || s.label?.toLowerCase().includes('primer') || s.label?.toLowerCase().includes('1'));
    const s2Series = apiMatTotalSeries.series?.find(s => String(s.label) === '2' || s.label?.toLowerCase().includes('segundo') || s.label?.toLowerCase().includes('2'));

    // Si viene como puntos planos por año
    if (apiMatTotalSeries.points && (!apiMatTotalSeries.series || apiMatTotalSeries.series.length === 0)) {
      return apiMatTotalSeries.points
        .filter(p => p.year >= yearRange[0] && p.year <= yearRange[1])
        .map(p => ({
          year: p.year,
          s1: p.value,
          s2: 0
        }));
    }

    const yearsSet = new Set([
      ...(s1Series?.points?.map(p => p.year) || []),
      ...(s2Series?.points?.map(p => p.year) || []),
      ...visibleYears
    ]);

    const sortedYears = [...yearsSet].filter(y => y >= yearRange[0] && y <= yearRange[1]).sort((a, b) => a - b);
    return sortedYears.map(y => {
      const p1 = s1Series?.points?.find(p => p.year === y);
      const p2 = s2Series?.points?.find(p => p.year === y);
      return {
        year: y,
        s1: p1 ? p1.value : 0,
        s2: p2 ? p2.value : 0
      };
    }).filter(d => (d.s1 + d.s2) > 0 || (yearRange[0] === yearRange[1] && d.year === yearRange[0]));
  }, [hasRealData, apiMatTotalSeries, visibleYears, yearRange]);

  // Matrícula total consolidada de todos los años disponibles (desglosada por s1 y s2)
  const allYearsMatTotal = useMemo(() => {
    if (!apiMatTotalSeries) return [];
    const s1Series = apiMatTotalSeries.series?.find(s => String(s.label) === '1' || s.label?.toLowerCase().includes('primer') || s.label?.toLowerCase().includes('1'));
    const s2Series = apiMatTotalSeries.series?.find(s => String(s.label) === '2' || s.label?.toLowerCase().includes('segundo') || s.label?.toLowerCase().includes('2'));

    if (apiMatTotalSeries.points && (!apiMatTotalSeries.series || apiMatTotalSeries.series.length === 0)) {
      return apiMatTotalSeries.points.map(p => ({
        year: p.year,
        s1: p.value,
        s2: 0
      }));
    }

    const yearsSet = new Set([
      ...(s1Series?.points?.map(p => p.year) || []),
      ...(s2Series?.points?.map(p => p.year) || []),
      ...availableYears
    ]);

    const sortedYears = [...yearsSet].sort((a, b) => a - b);
    return sortedYears.map(y => {
      const p1 = s1Series?.points?.find(p => p.year === y);
      const p2 = s2Series?.points?.find(p => p.year === y);
      return {
        year: y,
        s1: p1 ? p1.value : 0,
        s2: p2 ? p2.value : 0
      };
    }).filter(d => (d.s1 + d.s2) > 0);
  }, [apiMatTotalSeries, availableYears]);

  // 2. Matrícula nuevos vs antiguos
  const matNuevosData = useMemo(() => {
    if (!hasRealData || !apiMatNuevosSeries) return [];
    const nuevoSeries = apiMatNuevosSeries.series?.find(s => String(s.label).toLowerCase().includes('nuevo'));
    const antiguoSeries = apiMatNuevosSeries.series?.find(s => String(s.label).toLowerCase().includes('antiguo'));

    const yearsSet = new Set([
      ...(nuevoSeries?.points?.map(p => p.year) || []),
      ...(antiguoSeries?.points?.map(p => p.year) || []),
      ...visibleYears
    ]);

    const sortedYears = [...yearsSet].filter(y => y >= yearRange[0] && y <= yearRange[1]).sort((a, b) => a - b);
    return sortedYears.map(y => {
      const pN = nuevoSeries?.points?.find(p => p.year === y);
      const pA = antiguoSeries?.points?.find(p => p.year === y);
      return {
        year: y,
        nuevos: pN ? pN.value : 0,
        antiguos: pA ? pA.value : 0
      };
    }).filter(d => (d.nuevos + d.antiguos) > 0 || (yearRange[0] === yearRange[1] && d.year === yearRange[0]));
  }, [hasRealData, apiMatNuevosSeries, visibleYears, yearRange]);

  // 3. Matrícula por asignatura
  const matAsignaturaData = useMemo(() => {
    if (!hasRealData || !apiMatAsignaturaBreakdown?.items) return [];
    return apiMatAsignaturaBreakdown.items
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(item => ({ label: item.label, value: item.value }));
  }, [hasRealData, apiMatAsignaturaBreakdown]);

  // 4. Matrícula por sección
  const matSeccionData = useMemo(() => {
    if (!hasRealData || !apiMatSeccionBreakdown?.items) return [];
    return apiMatSeccionBreakdown.items
      .filter(item => item.value > 0)
      .map(item => ({ 
        label: String(item.label).toLowerCase().startsWith('secc') ? String(item.label) : `Sección ${item.label}`, 
        value: item.value 
      }))
      .sort((a, b) => b.value - a.value);
  }, [hasRealData, apiMatSeccionBreakdown]);

  // 5. Matrícula por estado académico
  const matEstadoData = useMemo(() => {
    if (!hasRealData || !apiMatEstadoBreakdown?.items) return [];
    return apiMatEstadoBreakdown.items
      .filter(item => item.value > 0)
      .map(item => ({ label: item.label, value: item.value }))
      .sort((a, b) => b.value - a.value);
  }, [hasRealData, apiMatEstadoBreakdown]);

  // 6. Nivel socioeconómico (quintiles)
  const carNseData = useMemo(() => {
    if (!hasRealData || !apiCarNseBreakdown?.items) return [];
    return apiCarNseBreakdown.items
      .filter(item => item.value > 0)
      .map(item => ({ label: item.label, value: item.value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [hasRealData, apiCarNseBreakdown]);

  // 7. Situación familiar
  const carFamiliarData = useMemo(() => {
    if (!hasRealData || !apiCarFamiliarBreakdown?.items) return [];
    return apiCarFamiliarBreakdown.items
      .filter(item => item.value > 0)
      .map(item => ({ label: item.label, value: item.value }))
      .sort((a, b) => b.value - a.value);
  }, [hasRealData, apiCarFamiliarBreakdown]);

  // 8. Procedencia geográfica
  const carRegionData = useMemo(() => {
    if (!hasRealData || !apiCarRegionBreakdown?.items) return [];
    return apiCarRegionBreakdown.items
      .filter(item => item.value > 0)
      .map(item => ({ label: item.label, value: item.value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [hasRealData, apiCarRegionBreakdown]);

  // 9. Tipo de colegio
  const carColegioData = useMemo(() => {
    if (!hasRealData || !apiCarColegioBreakdown?.items) return [];
    return apiCarColegioBreakdown.items
      .filter(item => item.value > 0)
      .map(item => ({ label: item.label, value: item.value }))
      .sort((a, b) => b.value - a.value);
  }, [hasRealData, apiCarColegioBreakdown]);

  // 10. Vía de acceso
  const carViaData = useMemo(() => {
    if (!hasRealData || !apiCarViaBreakdown?.items) return [];
    return apiCarViaBreakdown.items
      .filter(item => item.value > 0)
      .map(item => ({ label: item.label, value: item.value }))
      .sort((a, b) => b.value - a.value);
  }, [hasRealData, apiCarViaBreakdown]);

  // 11. Beneficios y becas
  const carBecasData = useMemo(() => {
    if (!hasRealData || !apiCarBecasBreakdown?.items) return [];
    return apiCarBecasBreakdown.items
      .filter(item => item.value > 0)
      .map(item => ({ label: item.label, value: item.value }))
      .sort((a, b) => b.value - a.value);
  }, [hasRealData, apiCarBecasBreakdown]);

  // 12. Distribución por sexo
  const carSexoData = useMemo(() => {
    if (!hasRealData || !apiCarSexoBreakdown?.items) return [];
    return apiCarSexoBreakdown.items
      .filter(item => item.value > 0)
      .map(item => ({ label: formatSexoLabel(item.label), value: item.value }))
      .sort((a, b) => b.value - a.value);
  }, [hasRealData, apiCarSexoBreakdown]);

  // 13. Distribución por edad
  const carEdadData = useMemo(() => {
    if (!hasRealData || !apiCarEdadBreakdown?.items) {
      return [];
    }
    return apiCarEdadBreakdown.items
      .filter(item => item.value > 0)
      .map(item => ({ label: item.label, value: item.value }));
  }, [hasRealData, apiCarEdadBreakdown]);

  // KPIs calculados (con soporte de período acumulado reactivo como en VcM)
  const kpis = useMemo(() => {
    const yDesde = yearRange[0];
    const yHasta = yearRange[1];
    const isSingleYear = yDesde === yHasta;
    const isAccumulated = periodoAcumulado && !isSingleYear;
    const minAvailableYear = availableYears.length > 0 ? Math.min(...availableYears) : 2023;
    const isBaseline = isSingleYear && yDesde === minAvailableYear;
    const prevYear = yHasta - 1;
    
    if (!hasRealData) {
      return {
        matriculaTotal: { title: 'Matrícula total', val: null, compareText: 'Sin datos disponibles', evo: null, isPositive: true },
        nuevosAntiguos: { title: 'Nuevos vs antiguos', val: null, compareText: 'Sin datos disponibles', evo: null, isPositive: true },
        viaAcceso: { title: 'Vía de acceso principal', val: null, compareText: 'Sin datos disponibles', evo: null, isPositive: true }
      };
    }

    // 1. Matrícula total
    let matVal = null;
    let matCompareText = '';
    let matEvo = null;
    let matPositive = true;
    let matTitle = 'Matrícula total';

    if (isAccumulated) {
      const accumulatedTotal = matTotalData.reduce((acc, d) => acc + (d.s1 + d.s2), 0);
      const baseRow = matTotalData.find(r => r.year === yDesde);
      const baseTotal = baseRow ? (baseRow.s1 + baseRow.s2) : 0;
      matVal = accumulatedTotal > 0 ? accumulatedTotal : null;
      if (baseTotal > 0 && accumulatedTotal > 0) {
        const diff = (((accumulatedTotal - baseTotal) / baseTotal) * 100).toFixed(1);
        matEvo = Number(diff) >= 0 ? `+${diff}%` : `${diff}%`;
        matPositive = Number(diff) >= 0;
        matCompareText = `vs Año base (${yDesde}): ${baseTotal.toLocaleString('es-CL')}`;
      } else {
        matCompareText = `Acumulado total de cohortes ${yDesde} a ${yHasta}`;
      }
    } else {
      const latestRow = matTotalData.find(r => r.year === yHasta) || matTotalData[matTotalData.length - 1];
      const latestTotal = latestRow ? (latestRow.s1 + latestRow.s2) : 0;
      const prevRow = matTotalData.find(r => r.year === prevYear);
      const prevTotal = prevRow ? (prevRow.s1 + prevRow.s2) : 0;
      matVal = latestTotal > 0 ? latestTotal : null;

      if (isBaseline) {
        matCompareText = `Año ${yDesde} es la línea base`;
        matEvo = null;
      } else if (prevTotal > 0 && latestTotal > 0) {
        const diff = (((latestTotal - prevTotal) / prevTotal) * 100).toFixed(1);
        matEvo = Number(diff) >= 0 ? `+${diff}%` : `${diff}%`;
        matPositive = Number(diff) >= 0;
        matCompareText = `vs año anterior (${prevYear}): ${prevTotal.toLocaleString('es-CL')}`;
      } else {
        matCompareText = latestTotal > 0 ? `Total matriculados en ${yHasta}` : 'Sin datos disponibles';
      }
    }

    // 2. Nuevos vs antiguos (mantiene el ratio real del año seleccionado sin distorsión por acumulación de cohortes)
    let nuevosVal = null;
    let nuevosCompareText = '';
    let nuevosEvo = null;
    let nuevosPositive = true;
    let nuevosTitle = 'Nuevos vs antiguos';

    const latestNuevosRow = matNuevosData.find(r => r.year === yHasta) || matNuevosData[matNuevosData.length - 1];
    const totalEst = latestNuevosRow ? (latestNuevosRow.nuevos + latestNuevosRow.antiguos) : 0;
    const pctNuevos = (latestNuevosRow && totalEst > 0) ? ((latestNuevosRow.nuevos / totalEst) * 100).toFixed(1) : null;
    nuevosVal = pctNuevos !== null ? `${pctNuevos}%` : null;
    nuevosCompareText = latestNuevosRow && totalEst > 0 
      ? `nuevos (${latestNuevosRow.nuevos.toLocaleString('es-CL')}) sobre matrícula total (${totalEst.toLocaleString('es-CL')})` 
      : 'Sin datos disponibles';

    const prevNuevosRow = matNuevosData.find(r => r.year === prevYear);
    const latestNuevos = latestNuevosRow ? latestNuevosRow.nuevos : 0;
    const prevNuevos = prevNuevosRow ? prevNuevosRow.nuevos : 0;

    if (!isBaseline && prevNuevos > 0 && latestNuevos > 0) {
      const diff = (((latestNuevos - prevNuevos) / prevNuevos) * 100).toFixed(1);
      nuevosEvo = Number(diff) >= 0 ? `+${diff}%` : `${diff}%`;
      nuevosPositive = Number(diff) >= 0;
    } else {
      nuevosEvo = null;
    }

    // 3. Vía de acceso principal
    const topVia = carViaData.length > 0 ? carViaData[0] : null;
    const totalVia = carViaData.reduce((acc, v) => acc + v.value, 0);
    const pctTopVia = (topVia && totalVia > 0) ? ((topVia.value / totalVia) * 100).toFixed(1) : null;
    const viaTitle = 'Vía de acceso principal';

    return {
      matriculaTotal: {
        title: matTitle,
        val: matVal,
        compareText: matCompareText,
        evo: matEvo,
        isPositive: matPositive
      },
      nuevosAntiguos: {
        title: nuevosTitle,
        val: nuevosVal,
        compareText: nuevosCompareText,
        evo: nuevosEvo,
        isPositive: nuevosPositive
      },
      viaAcceso: {
        title: viaTitle,
        val: topVia ? topVia.label : null,
        compareText: topVia && totalVia > 0 
          ? `${topVia.value.toLocaleString('es-CL')} de ${totalVia.toLocaleString('es-CL')} estudiantes (${pctTopVia}%)` 
          : 'Sin datos disponibles',
        evo: pctTopVia ? `${pctTopVia}%` : null,
        isPositive: true
      }
    };
  }, [hasRealData, matTotalData, matNuevosData, carViaData, yearRange, periodoAcumulado, availableYears]);

  // Drawer handlers
  const handleOpenIndicator = useCallback((key) => {
    setCurrentIndicatorKey(key);
    const mostRecentYear = availableYears.length > 0 ? Math.max(...availableYears) : 2026;
    setDrawerPeriod(String(mostRecentYear));
    const defaultDim = INDICATOR_SPECIFIC_DIMENSION[key] || null;
    setDrawerGroupBy(defaultDim);
    setDrawerSemesterFilter('all');
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
    const baseDef = INDICATORS[currentIndicatorKey] || INDICATORS['matricula-total'];

    // 1. Integración con endpoint oficial GET /api/indicators/:key/detail (PIADI-409)
    if (apiIndicatorDetail) {
      const {
        title,
        description,
        total,
        formattedTotal,
        hasData,
        disaggregated,
        groupBy,
        allowedGroupBy,
        dimensionLabels,
        period,
        comparison,
        table,
        unit
      } = apiIndicatorDetail;

      // Dimensiones categóricas para los tabs del Drawer (filtradas a la dimensión correspondiente al gráfico)
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

      // Tendencia / Comparación oficial enviada por backend
      let trend = null;
      if (comparison && comparison.diff !== null && comparison.diff !== undefined) {
        const diffNum = comparison.diff;
        const isPos = diffNum > 0;
        const isNeutral = diffNum === 0;
        trend = {
          delta: diffNum,
          formattedDelta: isNeutral ? '0' : (isPos ? `+${diffNum.toLocaleString('es-CL')}` : diffNum.toLocaleString('es-CL')),
          baseline: String(comparison.previousYear),
          isPositive: isNeutral ? null : isPos,
          isNeutral
        };
      }

      // Columnas y filas para la tabla
      let colLabels = baseDef.colLabels || ['Año', 'Estudiantes'];
      if (currentIndicatorKey === 'nuevos-antiguos') {
        colLabels = ['Tipo de estudiante', 'Estudiantes'];
      } else if (disaggregated && groupBy) {
        colLabels = [dimensionLabels?.[groupBy] || 'Categoría', 'Estudiantes'];
      } else if (!disaggregated && !groupBy) {
        colLabels = ['Año', 'Estudiantes'];
      }

      let rows = (table || []).map(row => {
        let label = '';
        let value = 0;
        if (row.label !== undefined) { label = row.label; value = row.value; }
        else if (row.year !== undefined) { label = String(row.year); value = row.value; }
        else if (row.categoria !== undefined) { label = row.categoria; value = row.value; }
        else { label = row[0] || ''; value = row[1] || 0; }

        if (currentIndicatorKey === 'distribucion-sexo' || groupBy === 'sexo') {
          label = formatSexoLabel(label);
        }

        if (currentIndicatorKey === 'nuevos-antiguos' || groupBy === 'nuevoAntiguo') {
          label = typeof label === 'string' ? label.toUpperCase() : label;
        }

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

      // Identificar el elemento con mayor cantidad de estudiantes dentro de las filas
      let topItem = null;
      let totalRowsVal = 0;
      if (rows && rows.length > 0) {
        rows.forEach(r => {
          const val = Number(r[1]) || 0;
          totalRowsVal += val;
          if (!topItem || val > topItem.value) {
            topItem = { label: String(r[0]), value: val };
          }
        });
      }

      // Cálculo de métrica destacada específica y contextual según el indicador
      let customMetric = {
        label: unit ? `Total (${unit})` : (baseDef.metric?.label || 'Total'),
        value: formattedTotal ?? (typeof total === 'number' ? total.toLocaleString('es-CL') : total)
      };
      let customTrend = trend;

      switch (currentIndicatorKey) {
        case 'matricula-total': {
          customMetric = {
            label: 'Matrícula total',
            value: total
          };
          break;
        }

        case 'nuevos-antiguos': {
          customMetric = {
            label: 'Tipo con más estudiantes',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} estudiantes`,
            isPositive: true
          } : null;
          break;
        }

        case 'matricula-asignatura': {
          customMetric = {
            label: 'Asignatura con más estudiantes',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} estudiantes`,
            isPositive: true
          } : null;
          break;
        }

        case 'matricula-seccion': {
          customMetric = {
            label: 'Sección con más estudiantes',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} estudiantes`,
            isPositive: true
          } : null;
          break;
        }

        case 'estado-academico': {
          customMetric = {
            label: 'Estado con más estudiantes',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} estudiantes`,
            isPositive: true
          } : null;
          break;
        }

        case 'nivel-socioeconomico': {
          customMetric = {
            label: 'Quintil con más estudiantes',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} estudiantes`,
            isPositive: true
          } : null;
          break;
        }

        case 'situacion-familiar': {
          customMetric = {
            label: 'Situación con más estudiantes',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} estudiantes`,
            isPositive: true
          } : null;
          break;
        }

        case 'procedencia-geografica': {
          customMetric = {
            label: 'Región con más estudiantes',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} estudiantes`,
            isPositive: true
          } : null;
          break;
        }

        case 'tipo-colegio': {
          customMetric = {
            label: 'Tipo de colegio con más estudiantes',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} estudiantes`,
            isPositive: true
          } : null;
          break;
        }

        case 'via-acceso':
        case 'via-acceso-kpi': {
          customMetric = {
            label: 'Vía con más estudiantes',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} estudiantes`,
            isPositive: true
          } : null;
          break;
        }

        case 'beneficios-becas': {
          customMetric = {
            label: 'Beneficio con más estudiantes',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} estudiantes`,
            isPositive: true
          } : null;
          break;
        }

        case 'distribucion-sexo': {
          customMetric = {
            label: 'Género con más estudiantes',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} estudiantes`,
            isPositive: true
          } : null;
          break;
        }

        case 'distribucion-edad': {
          customMetric = {
            label: 'Rango con más estudiantes',
            value: topItem ? topItem.label : 'Sin datos'
          };
          customTrend = topItem ? {
            rawText: `${topItem.value.toLocaleString('es-CL')} estudiantes`,
            isPositive: true
          } : null;
          break;
        }

        default:
          break;
      }

      return {
        key: currentIndicatorKey,
        title: title || baseDef.title,
        desc: description || baseDef.desc,
        hasData: hasData !== false && (rows.length > 0 || (total !== null && total !== undefined)),
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

    // 2. Si falló la petición o no hay datos, se reporta error/sin datos sin fallback calculado
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
    matTotalData,
    drawerPeriod,
    allYearsMatTotal,
    availableYears
  ]);

  // Helper para detectar si las filas del indicador son por año simple
  const isSimpleYearRows = useCallback((ind) => {
    return ind?.rows && ind.rows.length > 0 && ind.rows.every(r => /^\d{4}$/.test(String(r[0])));
  }, []);

  // Filas a mostrar en la tabla según el período seleccionado
  const displayRows = useMemo(() => {
    if (!currentIndicator || !currentIndicator.rows) return [];
    if (currentIndicatorKey === 'matricula-total') {
      const dataSrc = allYearsMatTotal.length > 0 ? allYearsMatTotal : matTotalData;
      if (dataSrc.length > 0) {
        if (drawerSemesterFilter === '1') {
          return dataSrc.map(d => [String(d.year), d.s1]);
        }
        if (drawerSemesterFilter === '2') {
          return dataSrc.map(d => [String(d.year), d.s2]);
        }
        return dataSrc.map(d => [String(d.year), d.s1 + d.s2]);
      }
      return currentIndicator.rows;
    }
    if (apiIndicatorDetail) {
      return currentIndicator.rows;
    }
    if (drawerPeriod === 'all' || !isSimpleYearRows(currentIndicator)) {
      return currentIndicator.rows;
    }
    const filtered = currentIndicator.rows.filter(r => String(r[0]) === drawerPeriod);
    return filtered.length > 0 ? filtered : currentIndicator.rows;
  }, [currentIndicator, drawerPeriod, isSimpleYearRows, apiIndicatorDetail, currentIndicatorKey, drawerSemesterFilter, allYearsMatTotal, matTotalData]);

  // Texto descriptivo del período para el footer del drawer
  const drawerPeriodText = useMemo(() => {
    return drawerPeriod ? `Año: ${drawerPeriod}` : '';
  }, [drawerPeriod]);

  // Opciones dinámicas para los acordeones de filtros
  const semestresList = useMemo(() => {
    if (apiFilters?.semesters?.length) {
      return apiFilters.semesters.map(s => ({ label: `Semestre ${s}`, value: String(s) }));
    }
    return [
      { label: 'Semestre 1', value: '1' },
      { label: 'Semestre 2', value: '2' }
    ];
  }, [apiFilters]);

  const estadosList = useMemo(() => {
    if (apiFilters?.estadosAcademicos?.length) {
      return apiFilters.estadosAcademicos.map(e => ({ label: e.toUpperCase(), value: e.toLowerCase() }));
    }
    return [
      { label: 'EGRESADO', value: 'egresado' },
      { label: 'TITULADO', value: 'titulado' },
      { label: 'VIGENTE', value: 'vigente' }
    ];
  }, [apiFilters]);

  const colegiosList = useMemo(() => {
    if (apiFilters?.tiposColegio?.length) {
      return apiFilters.tiposColegio.map(c => ({ label: c.toUpperCase(), value: c.toLowerCase() }));
    }
    return [
      { label: 'MUNICIPAL', value: 'municipal' },
      { label: 'PARTICULAR SUBVENCIONADO', value: 'subvencionado' },
      { label: 'PARTICULAR PAGADO', value: 'particular' }
    ];
  }, [apiFilters]);

  const viasList = useMemo(() => {
    if (apiFilters?.viasAcceso?.length) {
      return apiFilters.viasAcceso.map(v => ({ label: v.toUpperCase(), value: v.toLowerCase() }));
    }
    return [
      { label: 'PAES', value: 'paes' },
      { label: 'RANKING', value: 'ranking' },
      { label: 'CUPO ESPECIAL', value: 'cupo-especial' },
      { label: 'CONVALIDACIÓN', value: 'convalidacion' },
      { label: 'TRASLADO', value: 'traslado' },
      { label: 'OTRA', value: 'otra' }
    ];
  }, [apiFilters]);

  const sexosList = useMemo(() => {
    if (apiFilters?.sexos?.length) {
      return apiFilters.sexos.map(s => ({ label: formatSexoLabel(s), value: s.toLowerCase() }));
    }
    return [
      { label: 'FEMENINO', value: 'femenino' },
      { label: 'MASCULINO', value: 'masculino' },
      { label: 'OTROS', value: 'otro' }
    ];
  }, [apiFilters]);

  const nseList = useMemo(() => {
    if (apiFilters?.nivelesSocioeconomicos?.length) {
      return apiFilters.nivelesSocioeconomicos.map(n => ({ label: n.toUpperCase(), value: n.toLowerCase() }));
    }
    return [
      { label: 'QUINTIL 1', value: 'quintil 1' },
      { label: 'QUINTIL 2', value: 'quintil 2' },
      { label: 'QUINTIL 3', value: 'quintil 3' },
      { label: 'QUINTIL 4', value: 'quintil 4' },
      { label: 'QUINTIL 5', value: 'quintil 5' }
    ];
  }, [apiFilters]);

  // Preguntas Frecuentes (FAQ) del Centro de Ayuda
  const faqData = useMemo(() => [
    {
      q: '¿Qué mide el Dashboard de Admisión?',
      a: 'Visualiza la evolución de la matrícula institucional (total, semestral, nuevos y antiguos) y la caracterización integral de los estudiantes de pregrado de la carrera Contador Auditor (nivel socioeconómico, procedencia, tipo de colegio, vía de acceso, edad y sexo).'
    },
    {
      q: '¿Cómo funciona la opción de "Período acumulado"?',
      a: 'Al habilitar el período acumulado en un rango de varios años, los datos de matrícula y distribución consolidan la suma total de cohortes históricas ingresadas en dicho lapso.'
    },
    {
      q: '¿Cómo puedo ver el detalle numérico de una métrica?',
      a: 'Puedes hacer clic directamente sobre cualquier tarjeta KPI superior o en el botón "Ver detalle" ubicado en las secciones de gráficos para abrir el panel lateral con datos desglosados y tablas históricas.'
    },
    {
      q: '¿Cómo restablezco los filtros a su estado original?',
      a: 'Haz clic en el botón "Restablecer filtros" en la parte inferior del panel lateral de filtros para volver al rango de años completo y limpiar todas las selecciones de chips.'
    }
  ], []);

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
    activeTab,
    setActiveTab,
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
    drawerSemesterFilter,
    setDrawerSemesterFilter,
    drawerYears,
    displayRows,
    drawerPeriodText,
    YEARS,
    drawerLoading,
    drawerError,
    handleOpenIndicator,
    handleCloseDrawer,
    faqData,
    apiLoading,
    hasRealData,
    isNoData,
    kpis,
    availableYears,
    minYear,
    maxYear,
    visibleYears,
    matTotalData,
    matNuevosData,
    matAsignaturaData,
    matSeccionData,
    matEstadoData,
    carNseData,
    carFamiliarData,
    carRegionData,
    carColegioData,
    carViaData,
    carBecasData,
    carSexoData,
    carEdadData,
    semestresList,
    estadosList,
    colegiosList,
    viasList,
    sexosList,
    nseList
  };
};
