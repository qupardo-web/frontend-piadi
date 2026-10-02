import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { 
  getDashboardSummary, 
  getIndicatorSeries, 
  getIndicatorBreakdown, 
  getDepartmentFilters,
  getIndicatorDetail 
} from '../../../services/piadiApi';
import { BookOpen, CheckCircle, Users, DollarSign } from 'lucide-react';

export const SEMESTRES_LIST = ['Primer semestre', 'Segundo semestre'];
export const SEXO_LIST = ['Femenino', 'Masculino', 'No binario', 'Prefiere no responder'];
export const MESES_LIST = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const TIPOS_LIST = ['Curso', 'Diplomado', 'Seminario', 'Postítulo'];
export const MODALIDADES_LIST = ['Presencial', 'Online', 'Semipresencial', 'Híbrida'];
export const AREAS_LIST = ['Auditoría', 'Contabilidad', 'Finanzas', 'Tributación', 'Gestión', 'Tecnología'];

export const OFERTA_GROUP_BY_MAP = {
  total: null,
  area: 'area',
  tipo: 'tipo',
  modalidad: 'modalidad'
};

export const INGRESOS_GROUP_BY_MAP = {
  area: 'area',
  tipo: 'tipo',
  modalidad: 'modalidad'
};

export const MATRICULA_GROUP_BY_MAP = {
  total: null,
  area: 'area',
  modalidad: 'modalidad',
  tipo: 'tipo'
};

export const PERFIL_GROUP_BY_MAP = {
  region: 'region',
  sector: 'sectorEconomico',
  escolaridad: 'nivelDeEstudio',
  edad: 'rangoEdad',
  genero: 'sexo',
  tipo: 'tipoParticipante'
};

export const INDICATOR_SPECIFIC_DIMENSION = {
  'oferta-programada': 'area',
  'ingresos-generados': 'area',
  'matricula-por-programa': 'area',
  'tasa-aprobacion': 'area',
  'perfil-participante': 'region',
  'participantes-unicos': null,
  'recurrencia-formativa': null,
  'cursos-dictados': null,
  'tasa-ejecucion': null,
  'cursos-ofertados': 'area',
  'participantes-matriculados': 'area',
  'ingresos-totales': 'area'
};

export const UI_TO_BACKEND_KEY = {
  'oferta-programada': 'oferta_programada',
  'cursos-dictados': 'cursos_dictados',
  'tasa-ejecucion': 'tasa_ejecucion',
  'ingresos-generados': 'ingresos_generados',
  'matricula-por-programa': 'matricula_por_programa',
  'tasa-aprobacion': 'tasa_aprobacion',
  'perfil-participante': 'perfil_participante',
  'participantes-unicos': 'participantes_unicos',
  'recurrencia-formativa': 'recurrencia_formativa',
  'cursos-ofertados': 'oferta_programada',
  'participantes-matriculados': 'matricula_por_programa',
  'ingresos-totales': 'ingresos_generados'
};

export const INDICATORS = {
  'oferta-programada': {
    title: 'Oferta de cursos programada',
    desc: 'Cantidad total de cursos y programas planificados por el departamento para el período.',
    metric: { label: 'Oferta total programada', value: null },
    colLabels: ['Año', 'Programas ofertados'],
    state: 'data'
  },
  'cursos-dictados': {
    title: 'Cursos efectivamente dictados',
    desc: 'Cantidad de cursos y programas impartidos en comparación a los inicialmente planificados.',
    metric: { label: 'Cursos dictados', value: null },
    colLabels: ['Año', 'Cursos'],
    state: 'data'
  },
  'tasa-ejecucion': {
    title: 'Tasa de ejecución (%)',
    desc: 'Porcentaje de programas dictados respecto al total de programas programados en el período.',
    metric: { label: 'Tasa de ejecución promedio', value: null },
    colLabels: ['Año', 'Tasa (%)'],
    state: 'data'
  },
  'ingresos-generados': {
    title: 'Ingresos generados',
    desc: 'Monto total de ingresos brutos percibidos por concepto de matrícula en Educación Continua.',
    metric: { label: 'Total ingresos generados', value: null },
    colLabels: ['Área', 'Ingresos (CLP)'],
    state: 'data'
  },
  'matricula-por-programa': {
    title: 'Matrícula por programa',
    desc: 'Distribución de alumnos y participantes inscritos en los distintos programas y cursos.',
    metric: { label: 'Total matrículas', value: null },
    colLabels: ['Área', 'Matrículas'],
    state: 'data'
  },
  'tasa-aprobacion': {
    title: 'Tasa de aprobación',
    desc: 'Porcentaje de estudiantes que finalizaron y aprobaron satisfactoriamente las exigencias del programa.',
    metric: { label: 'Área con más tasa de aprobación', value: null },
    colLabels: ['Área / Programa', 'Aprobación (%)'],
    state: 'data'
  },
  'perfil-participante': {
    title: 'Perfil del participante',
    desc: 'Caracterización demográfica y procedencia de los alumnos inscritos (región, sector, escolaridad, edad, etc.).',
    metric: { label: 'Participantes caracterizados', value: null },
    colLabels: ['Categoría', 'Participantes'],
    state: 'data'
  },
  'participantes-unicos': {
    title: 'Pictograma: Participantes Únicos',
    desc: 'Número de personas individuales registradas en actividades formativas durante el año analizado.',
    metric: { label: 'Participantes únicos', value: null },
    colLabels: ['Rango de edad', 'Personas'],
    state: 'data'
  },
  'recurrencia-formativa': {
    title: 'Pictograma: Frecuencia de Matrículas',
    desc: 'Proporción de estudiantes que se han matriculado en más de un programa a lo largo de los años.',
    metric: { label: 'Estudiantes recurrentes', value: null },
    colLabels: ['Frecuencia', 'Personas'],
    state: 'data'
  },
  'cursos-ofertados': {
    title: 'Cursos ofertados',
    desc: 'Total de programas formativos ofrecidos durante el ciclo anual.',
    metric: { label: 'Cursos ofertados', value: null },
    colLabels: ['Año', 'Cursos'],
    state: 'data'
  },
  'participantes-matriculados': {
    title: 'Participantes matriculados',
    desc: 'Total acumulado de participantes matriculados en programas de Educación Continua.',
    metric: { label: 'Participantes matriculados', value: null },
    colLabels: ['Año', 'Participantes'],
    state: 'data'
  },
  'ingresos-totales': {
    title: 'Ingresos totales',
    desc: 'Monto total percibido por programas de formación continua en el período.',
    metric: { label: 'Ingresos totales', value: null },
    colLabels: ['Año', 'Monto ($M CLP)'],
    state: 'data'
  }
};

export const useDashboardEducacionContinua = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ESTADOS DE FILTROS PERSISTENTES (SIDEBAR DERECHO)
  const [cohorteDesde, setCohorteDesde] = useState('2023');
  const [cohorteHasta, setCohorteHasta] = useState('2026');
  const [semestresSeleccionados, setSemestresSeleccionados] = useState([]);
  const [mesDesde, setMesDesde] = useState('Enero');
  const [mesHasta, setMesHasta] = useState('Diciembre');
  const [tipoSeleccionado, setTipoSeleccionado] = useState([]);
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState([]);

  // ESTADOS DE CONTROL DE VISTA DE GRÁFICOS
  const [ofertaViewMode, setOfertaViewMode] = useState('total'); // 'total', 'area', 'tipo', 'modalidad'
  const [ingresosViewMode, setIngresosViewMode] = useState('area'); // 'area', 'tipo', 'modalidad'
  const [matriculaViewMode, setMatriculaViewMode] = useState('total'); // 'total', 'area', 'modalidad', 'tipo'
  const [perfilViewMode, setPerfilViewMode] = useState('region'); // 'region', 'sector', 'escolaridad', 'edad', 'genero', 'tipo'

  // Local states for Unique Participants
  const [localSexoFilter, setLocalSexoFilter] = useState('Todos');
  const [localEdadFilter, setLocalEdadFilter] = useState('Todos');

  // MODALES DE DETALLE
  const [activeModal, setActiveModal] = useState(null);

  // DATOS REALES DESDE API
  const [apiSummary, setApiSummary] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiOfertaSeries, setApiOfertaSeries] = useState(null);
  const [apiDictadosSeries, setApiDictadosSeries] = useState(null);
  const [apiEjecucionSeries, setApiEjecucionSeries] = useState(null);
  const [apiOfertaBreakdown, setApiOfertaBreakdown] = useState(null);
  const [apiTasaAprobacionBreakdown, setApiTasaAprobacionBreakdown] = useState(null);
  const [apiPerfilBreakdown, setApiPerfilBreakdown] = useState(null);
  const [apiParticipantesSeries, setApiParticipantesSeries] = useState(null);
  const [apiParticipantesBreakdown, setApiParticipantesBreakdown] = useState(null);
  const [apiRecurrenciaSeries, setApiRecurrenciaSeries] = useState(null);
  const [apiIngresosBreakdown, setApiIngresosBreakdown] = useState(null);
  const [apiMatriculaBreakdown, setApiMatriculaBreakdown] = useState(null);
  const [apiRecurrenciaBreakdown, setApiRecurrenciaBreakdown] = useState(null);
  const [apiPerfilMap, setApiPerfilMap] = useState({});
  const [apiMatriculaSeries, setApiMatriculaSeries] = useState(null);
  const [apiIngresosSeries, setApiIngresosSeries] = useState(null);
  const [apiOfertaByYear, setApiOfertaByYear] = useState({});
  const [apiIngresosByYear, setApiIngresosByYear] = useState({});
  const [apiMatriculaByYear, setApiMatriculaByYear] = useState({});

  // Filtros dinámicos cargados desde el backend
  const [dynamicAreas, setDynamicAreas] = useState([]);
  const [dynamicTipos, setDynamicTipos] = useState([]);
  const [dynamicModalidades, setDynamicModalidades] = useState([]);
  const [dynamicSemestres, setDynamicSemestres] = useState([]);

  // Fetch de los filtros dinámicos basados en la metadata real de las plantillas/cargas
  useEffect(() => {
    getDepartmentFilters('educacion_continua')
      .then((res) => {
        if (res?.success && res.data?.filters) {
          const f = res.data.filters;
          if (Array.isArray(f.areas)) {
            setDynamicAreas(f.areas);
          }
          if (Array.isArray(f.tipos)) {
            setDynamicTipos(f.tipos);
          }
          if (Array.isArray(f.modalidades)) {
            setDynamicModalidades(f.modalidades);
          }
          if (Array.isArray(f.semesters)) {
            setDynamicSemestres(f.semesters);
          }
        }
      })
      .catch((err) => console.error('Error cargando filtros del departamento:', err));
  }, []);

  const apiParams = useMemo(() => {
    const params = { department: 'educacion_continua' };
    const desde = parseInt(cohorteDesde);
    const hasta = parseInt(cohorteHasta);
    if (desde === hasta) {
      params.year = cohorteDesde;
    } else {
      params.fromYear = cohorteDesde;
      params.toYear = cohorteHasta;
    }
    if (areaSeleccionada.length > 0) params.area = areaSeleccionada.join(',');
    if (tipoSeleccionado.length > 0) params.tipo = tipoSeleccionado.join(',');
    if (modalidadSeleccionada.length > 0) params.modalidad = modalidadSeleccionada.join(',');
    if (semestresSeleccionados.length > 0) params.semester = semestresSeleccionados.join(',');
    
    // Convertir nombres de mes a números del 1 al 12
    const startIdx = MESES_LIST.indexOf(mesDesde) + 1;
    const endIdx = MESES_LIST.indexOf(mesHasta) + 1;
    if (startIdx > 0 && endIdx > 0) {
      const monthRange = [];
      for (let i = startIdx; i <= endIdx; i++) {
        monthRange.push(i);
      }
      params.startMonth = monthRange.join(',');
    }
    return params;
  }, [cohorteDesde, cohorteHasta, areaSeleccionada, tipoSeleccionado, modalidadSeleccionada, semestresSeleccionados, mesDesde, mesHasta]);

  useEffect(() => {
    setApiLoading(true);
    const extraParams = {};
    if (areaSeleccionada.length > 0) extraParams.area = areaSeleccionada.join(',');
    if (tipoSeleccionado.length > 0) extraParams.tipo = tipoSeleccionado.join(',');
    if (modalidadSeleccionada.length > 0) extraParams.modalidad = modalidadSeleccionada.join(',');
    if (semestresSeleccionados.length > 0) extraParams.semester = semestresSeleccionados.join(',');

    const startIdx = MESES_LIST.indexOf(mesDesde) + 1;
    const endIdx = MESES_LIST.indexOf(mesHasta) + 1;
    if (startIdx > 0 && endIdx > 0) {
      const monthRange = [];
      for (let i = startIdx; i <= endIdx; i++) {
        monthRange.push(i);
      }
      extraParams.startMonth = monthRange.join(',');
    }

    const baseParams = {};
    if (cohorteDesde === cohorteHasta) {
      baseParams.year = cohorteDesde;
    } else {
      baseParams.fromYear = cohorteDesde;
      baseParams.toYear = cohorteHasta;
    }

    const seriesParams = { department: 'educacion_continua', ...baseParams, ...extraParams };
    const breakdownParams = { department: 'educacion_continua', ...baseParams, ...extraParams };

    Promise.all([
      getDashboardSummary(apiParams).catch(() => null),
      getIndicatorSeries('oferta_programada', seriesParams).catch(() => null),
      getIndicatorSeries('cursos_dictados', seriesParams).catch(() => null),
      getIndicatorSeries('tasa_ejecucion', seriesParams).catch(() => null),
      getIndicatorBreakdown('tasa_aprobacion', { ...breakdownParams, groupBy: 'area' }).catch(() => null),
      getIndicatorSeries('participantes_unicos', seriesParams).catch(() => null),
      getIndicatorBreakdown('participantes_unicos', { ...breakdownParams, groupBy: 'rangoEdad' }).catch(() => null),
      getIndicatorBreakdown('recurrencia_formativa', { ...breakdownParams, groupBy: 'year' }).catch(() => null),
      getIndicatorBreakdown('matricula_por_programa', { ...breakdownParams, groupBy: 'area' }).catch(() => null),
      getIndicatorSeries('matricula_por_programa', seriesParams).catch(() => null),
      getIndicatorSeries('ingresos_generados', seriesParams).catch(() => null),
    ]).then(([summary, oferta, dictados, ejecucion, aprobacionBreakdown, participantesSeries, participantesBreakdown, recurrenciaBreakdown, matriculaBreakdown, matriculaSeries, ingresosSeries]) => {
      if (summary?.success && summary.data) {
        const deptData = summary.data?.departments?.find(d => d.departmentId === 'educacion_continua');
        const cards = deptData?.cards ?? [];
        if (cards.some(c => c.hasData)) {
          const map = {};
          cards.forEach(c => { map[c.indicatorKey] = c; });
          setApiSummary(map);
        }
      }

      if (oferta?.success) setApiOfertaSeries(oferta.data?.points?.length > 0 ? oferta.data.points : null);
      if (dictados?.success) setApiDictadosSeries(dictados.data?.points?.length > 0 ? dictados.data.points : null);
      if (ejecucion?.success) setApiEjecucionSeries(ejecucion.data?.points?.length > 0 ? ejecucion.data.points : null);
      if (aprobacionBreakdown?.success && aprobacionBreakdown.data?.items?.length) setApiTasaAprobacionBreakdown(aprobacionBreakdown.data);
      if (participantesSeries?.success) setApiParticipantesSeries(participantesSeries.data?.points?.length > 0 ? participantesSeries.data.points : null);
      if (participantesBreakdown?.success && participantesBreakdown.data?.items?.length) setApiParticipantesBreakdown(participantesBreakdown.data);
      if (recurrenciaBreakdown?.success && recurrenciaBreakdown.data?.items?.length) setApiRecurrenciaBreakdown(recurrenciaBreakdown.data.items);
      if (matriculaBreakdown?.success && matriculaBreakdown.data?.items?.length) setApiMatriculaBreakdown(matriculaBreakdown.data.items);
      if (matriculaSeries?.success) setApiMatriculaSeries(matriculaSeries.data?.points?.length > 0 ? matriculaSeries.data.points : null);
      if (ingresosSeries?.success) setApiIngresosSeries(ingresosSeries.data?.points?.length > 0 ? ingresosSeries.data.points : null);
    }).finally(() => setApiLoading(false));
  }, [apiParams, cohorteDesde, cohorteHasta, areaSeleccionada, tipoSeleccionado, modalidadSeleccionada, semestresSeleccionados, mesDesde, mesHasta]);

  // Oferta breakdown por año según modo seleccionado (multi-año para ver evolución)
  useEffect(() => {
    if (ofertaViewMode === 'total') {
      setApiOfertaByYear({});
      return;
    }
    const years = ['2023', '2024', '2025', '2026'].filter(yr => parseInt(yr) >= parseInt(cohorteDesde) && parseInt(yr) <= parseInt(cohorteHasta));
    const base = { department: 'educacion_continua', groupBy: ofertaViewMode };
    Promise.all(years.map(yr => getIndicatorBreakdown('oferta_programada', { ...base, year: yr }).catch(() => null)))
      .then(results => {
        const byYear = {};
        results.forEach((r, i) => { if (r?.success && r.data?.items?.length) byYear[years[i]] = r.data.items; });
        setApiOfertaByYear(byYear);
      });
  }, [ofertaViewMode, cohorteDesde, cohorteHasta]);

  // Ingresos breakdown por año según modo seleccionado (multi-año para ver evolución)
  useEffect(() => {
    const years = ['2023', '2024', '2025', '2026'].filter(yr => parseInt(yr) >= parseInt(cohorteDesde) && parseInt(yr) <= parseInt(cohorteHasta));
    const base = { department: 'educacion_continua', groupBy: ingresosViewMode };
    Promise.all(years.map(yr => getIndicatorBreakdown('ingresos_generados', { ...base, year: yr }).catch(() => null)))
      .then(results => {
        const byYear = {};
        results.forEach((r, i) => { if (r?.success && r.data?.items?.length) byYear[years[i]] = r.data.items; });
        setApiIngresosByYear(byYear);
      });
  }, [ingresosViewMode, cohorteDesde, cohorteHasta]);

  // Matrícula breakdown por año según modo seleccionado (multi-año para ver evolución)
  useEffect(() => {
    if (matriculaViewMode === 'total') {
      setApiMatriculaByYear({});
      return;
    }
    const years = ['2023', '2024', '2025', '2026'].filter(yr => parseInt(yr) >= parseInt(cohorteDesde) && parseInt(yr) <= parseInt(cohorteHasta));
    const base = { department: 'educacion_continua', groupBy: matriculaViewMode };
    Promise.all(years.map(yr => getIndicatorBreakdown('matricula_por_programa', { ...base, year: yr }).catch(() => null)))
      .then(results => {
        const byYear = {};
        results.forEach((r, i) => { if (r?.success && r.data?.items?.length) byYear[years[i]] = r.data.items; });
        setApiMatriculaByYear(byYear);
      });
  }, [matriculaViewMode, cohorteDesde, cohorteHasta]);

  // Perfil del participante — todas las dimensiones al cargar
  useEffect(() => {
    const bp = { department: 'educacion_continua' };
    if (cohorteDesde === cohorteHasta) {
      bp.year = cohorteDesde;
    } else {
      bp.fromYear = cohorteDesde;
      bp.toYear = cohorteHasta;
    }
    const dims = [
      { key: 'region', groupBy: 'region' },
      { key: 'sector', groupBy: 'sectorEconomico' },
      { key: 'escolaridad', groupBy: 'nivelDeEstudio' },
      { key: 'edad', groupBy: 'rangoEdad' },
      { key: 'genero', groupBy: 'sexo' },
      { key: 'tipo', groupBy: 'tipoParticipante' },
    ];
    Promise.all(dims.map(d => getIndicatorBreakdown('perfil_participante', { ...bp, groupBy: d.groupBy }).catch(() => null)))
      .then(results => {
        const map = {};
        dims.forEach((d, i) => {
          const r = results[i];
          if (r?.success && r.data?.items?.length) map[d.key] = r.data.items;
        });
        setApiPerfilMap(map);
      });
  }, [cohorteDesde, cohorteHasta]);

  const activeMenu = 'Dashboards';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleResetFilters = () => {
    setCohorteDesde('2023');
    setCohorteHasta('2026');
    setSemestresSeleccionados([]);
    setMesDesde('Enero');
    setMesHasta('Diciembre');
    setTipoSeleccionado([]);
    setModalidadSeleccionada([]);
    setAreaSeleccionada([]);
  };

  // --- LÓGICA DE DATOS REALES ---
  const filteredNominalGroup1 = useMemo(() => [], []);
  const filteredNominalGroup2 = useMemo(() => [], []);
  const filteredCohorteData = useMemo(() => [], []);
  const filteredRetencionData = useMemo(() => [], []);

  // Oferta programada — usa datos reales de API, filtrada por año seleccionado
  const filteredProgramasData = useMemo(() => {
    if (!apiOfertaSeries?.length) return [];
    return apiOfertaSeries
      .filter(s => {
        const yr = parseInt(s.year ?? s.period ?? 0);
        return yr >= parseInt(cohorteDesde) && yr <= parseInt(cohorteHasta);
      })
      .map(s => ({
        cohorte: String(s.year ?? s.period ?? s.label ?? ''),
        total: s.value ?? 0,
      }));
  }, [apiOfertaSeries, cohorteDesde, cohorteHasta]);

  const ofertaChartData = useMemo(() => {
    if (ofertaViewMode === 'total') {
      return {
        labels: filteredProgramasData.map(d => d.cohorte),
        series: [{ data: filteredProgramasData.map(d => d.total), label: 'Total programado', color: '#1E2875' }],
      };
    }
    const years = ['2023', '2024', '2025', '2026'].filter(yr => parseInt(yr) >= parseInt(cohorteDesde) && parseInt(yr) <= parseInt(cohorteHasta));
    const allLabels = [...new Set(years.flatMap(yr => (apiOfertaByYear[yr] ?? []).map(i => i.label)))];
    if (!allLabels.length) return { labels: [], series: [] };
    const yearColors = { '2023': '#93c5fd', '2024': '#60a5fa', '2025': '#3b82f6', '2026': '#1E2875' };
    return {
      labels: allLabels,
      series: years.map(yr => ({
        data: allLabels.map(lbl => (apiOfertaByYear[yr] ?? []).find(i => i.label === lbl)?.value ?? 0),
        label: yr,
        color: yearColors[yr] || '#1E2875',
      })),
    };
  }, [filteredProgramasData, ofertaViewMode, apiOfertaByYear, cohorteDesde, cohorteHasta]);

  const dictadosSummaryData = useMemo(() => [], []);

  const effectiveDictadosSeries = useMemo(() => {
    if (apiOfertaSeries?.length > 0 && apiDictadosSeries?.length > 0) {
      const getKey = s => String(s.year ?? s.period ?? s.label ?? '');
      const years = [...new Set(apiOfertaSeries.map(getKey))];
      return years.map(yr => {
        const plan = apiOfertaSeries.find(s => getKey(s) === yr);
        const dict = apiDictadosSeries.find(s => getKey(s) === yr);
        const planVal = plan?.value ?? 0;
        const dictVal = dict?.value ?? 0;
        return {
          cohorte: yr,
          planificados: planVal,
          dictados: dictVal,
          tasa: planVal > 0 ? parseFloat(((dictVal / planVal) * 100).toFixed(1)) : 0,
        };
      });
    }
    return null;
  }, [apiOfertaSeries, apiDictadosSeries]);

  const effectiveEjecucionSeries = useMemo(() => {
    if (apiEjecucionSeries?.length > 0) {
      return apiEjecucionSeries.map(s => ({
        cohorte: String(s.year ?? s.period ?? s.label ?? ''),
        tasa: s.value ?? 0,
      }));
    }
    return null;
  }, [apiEjecucionSeries]);

  const kpiStats = useMemo(() => ({
    totalMatriculas: apiSummary?.matricula_por_programa?.value ?? 0,
    avgRetencion: 0,
    avgTasaEjecucion: apiSummary?.tasa_ejecucion?.value ?? 0,
  }), [apiSummary]);

  const kpiCardsData = useMemo(() => {
    const yHasta = Number(cohorteHasta);
    const yDesde = Number(cohorteDesde);
    
    // Función para obtener la suma de los valores de la serie en el rango seleccionado
    const getRangeSum = (series) => {
      if (!series) return null;
      const filtered = series.filter(p => {
        const yr = Number(p.year);
        return yr >= yDesde && yr <= yHasta;
      });
      if (!filtered.length) return null;
      return filtered.reduce((acc, curr) => acc + (curr.value ?? 0), 0);
    };

    const getValForYear = (series, year) => series?.find(p => Number(p.year) === year)?.value ?? null;

    // Los valores principales de las tarjetas serán el total acumulado en el rango seleccionado
    const oVal = apiSummary?.oferta_programada?.value ?? getRangeSum(apiOfertaSeries);
    const dVal = apiSummary?.cursos_dictados?.value ?? getRangeSum(apiDictadosSeries);
    const mVal = apiSummary?.matricula_por_programa?.value ?? getRangeSum(apiMatriculaSeries);
    const iVal = apiSummary?.ingresos_generados?.value ?? getRangeSum(apiIngresosSeries);

    // Para la evolución, comparamos el último año con el primero en el rango
    const evo = (key, series) => {
      if (apiSummary?.[key]?.evolution != null) {
        return apiSummary[key].evolution;
      }
      const vHasta = getValForYear(series, yHasta);
      const vDesde = getValForYear(series, yDesde);
      return (vDesde != null && vHasta != null && vDesde !== 0) ? parseFloat(((vHasta - vDesde) / vDesde * 100).toFixed(1)) : null;
    };

    const oDesde = getValForYear(apiOfertaSeries, yDesde);
    const dDesde = getValForYear(apiDictadosSeries, yDesde);
    const mDesde = getValForYear(apiMatriculaSeries, yDesde);
    const iDesde = getValForYear(apiIngresosSeries, yDesde);

    return [
      { key: 'oferta', label: 'Oferta programada', Icon: BookOpen, color: '#1E2875', borderColor: '#1E2875', valHasta: oVal, valDesde: oDesde, yHasta, yDesde, evo: evo('oferta_programada', apiOfertaSeries), fmt: v => v != null ? String(v) : null },
      { key: 'dictados', label: 'Cursos dictados', Icon: CheckCircle, color: '#047857', borderColor: '#10B981', valHasta: dVal, valDesde: dDesde, yHasta, yDesde, evo: evo('cursos_dictados', apiDictadosSeries), fmt: v => v != null ? String(v) : null },
      { key: 'matricula', label: 'Matrícula total', Icon: Users, color: '#6d28d9', borderColor: '#8b5cf6', valHasta: mVal, valDesde: mDesde, yHasta, yDesde, evo: evo('matricula_por_programa', apiMatriculaSeries), fmt: v => v != null ? Number(v).toLocaleString('es-CL') : null },
      { key: 'ingresos', label: 'Ingresos netos', Icon: DollarSign, color: '#b45309', borderColor: '#F59E0B', valHasta: iVal, valDesde: iDesde, yHasta, yDesde, evo: evo('ingresos_generados', apiIngresosSeries), fmt: v => v != null ? `$${Number(v).toLocaleString('es-CL')}` : null },
    ];
  }, [apiOfertaSeries, apiDictadosSeries, apiMatriculaSeries, apiIngresosSeries, apiSummary, cohorteDesde, cohorteHasta]);

  const uniqueParticipantsData = useMemo(() => {
    const map = new Map();
    filteredNominalGroup2.forEach(reg => {
      if (!map.has(reg.rut)) {
        map.set(reg.rut, {
          rut: reg.rut,
          nombre: reg.nombre,
          edad: reg.edad,
          region: reg.region,
          sector: reg.sector,
          genero: reg.genero,
          programas: [reg.programa]
        });
      } else {
        const existing = map.get(reg.rut);
        if (!existing.programas.includes(reg.programa)) {
          existing.programas.push(reg.programa);
        }
      }
    });
    return Array.from(map.values());
  }, [filteredNominalGroup2]);

  const filteredUniqueParticipantsLocal = useMemo(() => {
    return uniqueParticipantsData.filter(p => {
      if (localSexoFilter !== 'Todos' && p.genero !== localSexoFilter) {
        return false;
      }
      if (localEdadFilter !== 'Todos') {
        if (localEdadFilter === '18-35') {
          if (p.edad < 18 || p.edad > 35) return false;
        } else if (localEdadFilter === '36-50') {
          if (p.edad < 36 || p.edad > 50) return false;
        } else if (localEdadFilter === 'Más de 50') {
          if (p.edad <= 50) return false;
        }
      }
      return true;
    });
  }, [uniqueParticipantsData, localSexoFilter, localEdadFilter]);

  const uniqueParticipantsAgeDist = useMemo(() => {
    const items = Array.isArray(apiParticipantesBreakdown?.items) ? apiParticipantesBreakdown.items : [];
    if (!items.length) return [];
    return items.map(item => ({
      range: item.label ?? 'Sin dato',
      count: Number(item.value ?? 0),
    }));
  }, [apiParticipantesBreakdown]);

  const recurrenceFreqDist = useMemo(() => {
    const items = Array.isArray(apiRecurrenciaBreakdown) ? apiRecurrenciaBreakdown : [];
    if (!items.length) return [];
    return items.map(item => ({
      category: String(item.label ?? ''),
      count: Number(item.value ?? 0),
    }));
  }, [apiRecurrenciaBreakdown]);

  const uniqueParticipantsTotal = useMemo(() => {
    return uniqueParticipantsAgeDist.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
  }, [uniqueParticipantsAgeDist]);

  const recurrenciaStats = useMemo(() => {
    const unicos = uniqueParticipantsData.length;
    const recurrentesList = uniqueParticipantsData.filter(p => p.programas.length > 1);
    const totalRecurrentes = recurrentesList.length;
    const tasa = unicos > 0 ? parseFloat(((totalRecurrentes / unicos) * 100).toFixed(1)) : 0;

    return {
      totalUnicos: unicos,
      totalRecurrentes,
      tasaRecurrencia: tasa,
      recurrentesList
    };
  }, [uniqueParticipantsData]);

  const matriculaChartData = useMemo(() => {
    if (matriculaViewMode === 'total') {
      const points = (apiMatriculaSeries ?? []).filter(p => {
        const yr = Number(p.year);
        return yr >= parseInt(cohorteDesde) && yr <= parseInt(cohorteHasta);
      });
      if (!points.length) return { labels: [], series: [] };
      return {
        labels: points.map(p => String(p.year)),
        series: [{ data: points.map(p => Number(p.value)), label: 'Matrículas', color: '#1E2875' }],
      };
    }
    const years = ['2023', '2024', '2025', '2026'].filter(yr => parseInt(yr) >= parseInt(cohorteDesde) && parseInt(yr) <= parseInt(cohorteHasta));
    const allLabels = [...new Set(years.flatMap(yr => (apiMatriculaByYear[yr] ?? []).map(i => i.label)))];
    if (!allLabels.length) return { labels: [], series: [] };
    const yearColors = { '2023': '#93c5fd', '2024': '#60a5fa', '2025': '#3b82f6', '2026': '#1E2875' };
    return {
      labels: allLabels,
      series: years.map(yr => ({
        data: allLabels.map(lbl => (apiMatriculaByYear[yr] ?? []).find(i => i.label === lbl)?.value ?? 0),
        label: yr,
        color: yearColors[yr] || '#1E2875',
      })),
    };
  }, [matriculaViewMode, apiMatriculaSeries, apiMatriculaByYear, cohorteDesde, cohorteHasta]);

  const aprobacionProgramasData = useMemo(() => {
    const items = Array.isArray(apiTasaAprobacionBreakdown?.items) ? apiTasaAprobacionBreakdown.items : [];
    if (!items.length) return [];

    return items.map(item => ({
      area: item.label ?? 'Sin dato',
      tasa: Number(item.value ?? 0),
      promedioHistorico: Number(item.value ?? 0),
      matriculas: 0,
      aprobados: 0,
    }));
  }, [apiTasaAprobacionBreakdown]);

  const ingresosChartData = useMemo(() => {
    const years = ['2023', '2024', '2025', '2026'].filter(yr => parseInt(yr) >= parseInt(cohorteDesde) && parseInt(yr) <= parseInt(cohorteHasta));
    const allLabels = [...new Set(years.flatMap(yr => (apiIngresosByYear[yr] ?? []).map(i => i.label)))];
    if (!allLabels.length) return { labels: [], series: [] };
    const yearColors = { '2023': '#6ee7b7', '2024': '#34d399', '2025': '#10B981', '2026': '#047857' };
    return {
      labels: allLabels,
      series: years.map(yr => ({
        data: allLabels.map(lbl => {
          const item = (apiIngresosByYear[yr] ?? []).find(i => i.label === lbl);
          return item ? parseFloat((item.value / 1000000).toFixed(1)) : 0;
        }),
        label: yr,
        color: yearColors[yr] || '#10B981',
        valueFormatter: v => `$${v}M`,
      })),
    };
  }, [apiIngresosByYear, cohorteDesde, cohorteHasta, ingresosViewMode]);

  const ingresosGeneradosData = useMemo(() => {
    const latestYear = String(cohorteHasta);
    const items = apiIngresosByYear[latestYear] ?? [];
    return items.map(item => ({
      area: item.label ?? 'Sin dato',
      ingresosCLP: Number(item.value ?? 0),
      ingresosM: parseFloat((Number(item.value ?? 0) / 1000000).toFixed(1)),
    }));
  }, [apiIngresosByYear, cohorteHasta]);

  const totalRevenueCLP = useMemo(() => {
    return ingresosGeneradosData.reduce((acc, curr) => acc + curr.ingresosCLP, 0);
  }, [ingresosGeneradosData]);

  const perfilParticipantesData = useMemo(() => {
    const items = apiPerfilMap[perfilViewMode] ?? [];
    if (!items.length) return null;
    return items.map((item, id) => ({
      id,
      label: item.label ?? 'Sin dato',
      value: Number(item.value ?? 0),
    }));
  }, [apiPerfilMap, perfilViewMode]);

  const activePeriodosText = useMemo(() => {
    let text = `Años: ${cohorteDesde} a ${cohorteHasta}`;
    if (semestresSeleccionados.length > 0) {
      text += ` | Semestres: ${semestresSeleccionados.join(', ')}`;
    } else {
      text += ` | Todos los semestres`;
    }

    text += ` | Meses: ${mesDesde} a ${mesHasta}`;

    const filtersActive = [];
    if (areaSeleccionada.length > 0) filtersActive.push(`Áreas: ${areaSeleccionada.join(', ')}`);
    if (modalidadSeleccionada.length > 0) filtersActive.push(`Modalidades: ${modalidadSeleccionada.join(', ')}`);
    if (tipoSeleccionado.length > 0) filtersActive.push(`Tipos: ${tipoSeleccionado.join(', ')}`);

    if (filtersActive.length > 0) {
      text += ` | Filtros Activos (${filtersActive.join('; ')})`;
    }

    return text;
  }, [cohorteDesde, cohorteHasta, semestresSeleccionados, mesDesde, mesHasta, areaSeleccionada, modalidadSeleccionada, tipoSeleccionado]);

  // -------------------------------------------------------------
  // DRAWER LATERAL DE DETALLE DE INDICADOR
  // -------------------------------------------------------------
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentIndicatorKey, setCurrentIndicatorKey] = useState('oferta-programada');
  const [drawerPeriod, setDrawerPeriod] = useState('2026');
  const [drawerGroupBy, setDrawerGroupBy] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState(null);
  const [apiIndicatorDetail, setApiIndicatorDetail] = useState(null);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);

  // Drawer handlers
  const handleOpenIndicator = useCallback((key, overrideGroupBy = undefined) => {
    setCurrentIndicatorKey(key);
    const mostRecentYear = cohorteHasta ? parseInt(cohorteHasta) : 2026;
    setDrawerPeriod(String(mostRecentYear));
    const defaultDim = overrideGroupBy !== undefined
      ? overrideGroupBy
      : (INDICATOR_SPECIFIC_DIMENSION[key] || null);
    setDrawerGroupBy(defaultDim);
    setDrawerOpen(true);
  }, [cohorteHasta]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleDrawerPeriodChange = useCallback((val) => {
    setDrawerPeriod(val);
  }, []);

  // Petición al endpoint GET /api/indicators/:key/detail
  useEffect(() => {
    if (!drawerOpen || !currentIndicatorKey) return;

    setDrawerLoading(true);
    setDrawerError(null);
    const backendKey = UI_TO_BACKEND_KEY[currentIndicatorKey] || currentIndicatorKey.replace(/-/g, '_');
    const params = { department: 'educacion_continua' };

    if (drawerPeriod) {
      params.year = String(drawerPeriod);
    }
    if (drawerGroupBy) {
      params.groupBy = drawerGroupBy;
    }

    if (areaSeleccionada.length > 0) params.area = areaSeleccionada.join(',');
    if (tipoSeleccionado.length > 0) params.tipo = tipoSeleccionado.join(',');
    if (modalidadSeleccionada.length > 0) params.modalidad = modalidadSeleccionada.join(',');
    if (semestresSeleccionados.length > 0) params.semester = semestresSeleccionados.join(',');

    getIndicatorDetail(backendKey, params)
      .then((res) => {
        const detail = (res && res.data && typeof res.data === 'object' && !Array.isArray(res.data) && (res.data.title || res.data.indicatorKey))
          ? res.data 
          : res;

        setApiIndicatorDetail(detail || null);
        setDrawerError(null);
      })
      .catch((err) => {
        console.error('Error al obtener detalle del indicador:', err);
        setApiIndicatorDetail(null);
        setDrawerError(err?.message || 'Error al obtener la información del indicador desde el servidor');
      })
      .finally(() => {
        setDrawerLoading(false);
      });
  }, [drawerOpen, currentIndicatorKey, drawerPeriod, drawerGroupBy, areaSeleccionada, tipoSeleccionado, modalidadSeleccionada, semestresSeleccionados]);

  // Años disponibles para el selector del Drawer
  const drawerYears = useMemo(() => {
    const yearsSet = new Set();
    const d = parseInt(cohorteDesde) || 2023;
    const h = parseInt(cohorteHasta) || 2026;
    for (let y = Math.min(d, 2023); y <= Math.max(h, 2026); y++) {
      yearsSet.add(y);
    }
    if (apiIndicatorDetail?.period?.from && apiIndicatorDetail?.period?.to) {
      const { from, to } = apiIndicatorDetail.period;
      for (let y = from; y <= to; y++) {
        yearsSet.add(y);
      }
    }
    const yrs = Array.from(yearsSet).filter(Number.isFinite).sort((a, b) => a - b);
    return yrs.length > 0 ? yrs : [2023, 2024, 2025, 2026];
  }, [apiIndicatorDetail, cohorteDesde, cohorteHasta]);

  // Formateo del indicador actual para el Drawer
  const currentIndicator = useMemo(() => {
    const baseDef = INDICATORS[currentIndicatorKey] || INDICATORS['oferta-programada'];

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
        comparison,
        table,
        unit
      } = apiIndicatorDetail;

      const specificDim = INDICATOR_SPECIFIC_DIMENSION[currentIndicatorKey];
      const matchingDims = (allowedGroupBy || [])
        .filter(dim => dim !== 'year' && dim !== 'periodo' && dim !== 'period')
        .filter(dim => {
          if (!specificDim) return true;
          return dim.toLowerCase() === specificDim.toLowerCase() ||
                 (specificDim.toLowerCase() === 'edad' && dim.toLowerCase().includes('edad')) ||
                 (specificDim.toLowerCase() === 'rangoedad' && dim.toLowerCase().includes('edad'));
        });

      const allowedTabs = matchingDims.map(dim => ({
        key: dim,
        label: dimensionLabels?.[dim] || dim
      }));

      let colLabels = baseDef.colLabels || ['Año', 'Valor'];
      if (currentIndicatorKey === 'oferta-programada' || currentIndicatorKey === 'cursos-ofertados') {
        colLabels = groupBy ? [dimensionLabels?.[groupBy] || 'Categoría', 'Programas'] : ['Año', 'Programas ofertados'];
      } else if (currentIndicatorKey === 'cursos-dictados') {
        colLabels = ['Año', 'Cursos dictados'];
      } else if (currentIndicatorKey === 'tasa-ejecucion') {
        colLabels = ['Año', 'Tasa ejecución (%)'];
      } else if (currentIndicatorKey === 'ingresos-generados' || currentIndicatorKey === 'ingresos-totales') {
        colLabels = groupBy ? [dimensionLabels?.[groupBy] || 'Categoría', 'Ingresos (CLP)'] : ['Año', 'Ingresos (CLP)'];
      } else if (currentIndicatorKey === 'matricula-por-programa' || currentIndicatorKey === 'participantes-matriculados') {
        colLabels = groupBy ? [dimensionLabels?.[groupBy] || 'Categoría', 'Matrículas'] : ['Año', 'Matrículas'];
      } else if (currentIndicatorKey === 'tasa-aprobacion') {
        colLabels = ['Área / Programa', 'Aprobación (%)'];
      } else if (currentIndicatorKey === 'perfil-participante') {
        colLabels = [dimensionLabels?.[groupBy] || 'Categoría', 'Participantes'];
      } else if (currentIndicatorKey === 'participantes-unicos') {
        colLabels = ['Rango de edad', 'Personas'];
      } else if (currentIndicatorKey === 'recurrencia-formativa') {
        colLabels = ['Año / Frecuencia', 'Personas'];
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

      const isAnnualTable = (!groupBy || groupBy === 'year') && (
        rows.length === 0 || rows.every(r => /^\d{4}$/.test(String(r[0])))
      );

      if (isAnnualTable) {
        const rowsMap = new Map(rows.map(r => [Number(r[0]), r[1]]));
        const allYrs = Array.from(new Set([...drawerYears, ...rows.map(r => Number(r[0]))])).sort((a, b) => a - b);
        rows = allYrs.map(yr => [String(yr), rowsMap.has(yr) ? rowsMap.get(yr) : 0]);
      }

      // Identificar el elemento con mayor cantidad/porcentaje dentro de las filas
      let topItem = null;
      if (rows && rows.length > 0) {
        rows.forEach(r => {
          const val = Number(r[1]) || 0;
          if (!topItem || val > topItem.value) {
            topItem = { label: String(r[0]), value: val };
          }
        });
      }

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

      const selectedYearRowVal = isAnnualTable && drawerPeriod ? (rows.find(r => r[0] === drawerPeriod)?.[1] ?? 0) : total;
      const finalTotal = (total !== null && total !== undefined) ? total : (selectedYearRowVal ?? 0);

      let customMetric = {
        label: unit ? `Total (${unit})` : (baseDef.metric?.label || 'Total'),
        value: (typeof finalTotal === 'number') ? finalTotal.toLocaleString('es-CL') : (formattedTotal ?? finalTotal)
      };
      let customTrend = trend;

      if (disaggregated && groupBy && topItem && currentIndicatorKey !== 'tasa-aprobacion') {
        const dimLabel = dimensionLabels?.[groupBy] || 'Categoría';
        customMetric = {
          label: `${dimLabel} con mayor cantidad`,
          value: topItem.label
        };
        customTrend = {
          rawText: `${(typeof topItem.value === 'number') ? topItem.value.toLocaleString('es-CL') : topItem.value} ${unit || 'registros'}`,
          isPositive: true
        };
      } else {
        switch (currentIndicatorKey) {
          case 'tasa-aprobacion': {
            if (topItem && topItem.label) {
              customMetric = {
                label: 'Área con más tasa de aprobación',
                value: topItem.label
              };
              customTrend = {
                rawText: `${Number(topItem.value).toLocaleString('es-CL')}%`,
                isPositive: true
              };
            } else {
              customMetric = {
                label: 'Área con más tasa de aprobación',
                value: 'Sin datos'
              };
              customTrend = null;
            }
            break;
          }
          default:
            break;
        }
      }

      return {
        key: currentIndicatorKey,
        title: title || baseDef.title,
        desc: description || baseDef.desc,
        hasData: detailHasData !== undefined ? detailHasData : (rows.length > 0),
        isError: false,
        errorMessage: null,
        metric: customMetric,
        trend: customTrend,
        colLabels,
        rows,
        allowedTabs
      };
    }

    return {
      key: currentIndicatorKey,
      title: baseDef.title,
      desc: baseDef.desc,
      hasData: false,
      isError: Boolean(drawerError),
      errorMessage: drawerError || (drawerLoading ? null : 'No se encontraron datos cargados en el servidor para este indicador.'),
      metric: null,
      trend: null,
      colLabels: baseDef.colLabels || ['Año', 'Valor'],
      rows: [],
      allowedTabs: []
    };
  }, [currentIndicatorKey, apiIndicatorDetail, drawerError, drawerLoading, drawerYears, drawerPeriod]);

  const displayRows = useMemo(() => {
    return currentIndicator?.rows || [];
  }, [currentIndicator]);

  const drawerPeriodText = useMemo(() => {
    return drawerPeriod ? `Año: ${drawerPeriod}` : '';
  }, [drawerPeriod]);

  // Preguntas frecuentes del centro de ayuda
  const faqData = [
    {
      q: '¿Qué información presenta el Dashboard de Educación Continua?',
      a: 'Visualiza estadísticas de oferta académica programada, cursos efectivamente dictados, tasas de ejecución y aprobación, ingresos generados, matrícula de participantes y caracterización demográfica.'
    },
    {
      q: '¿Cómo se calcula la tasa de ejecución y aprobación?',
      a: 'La tasa de ejecución corresponde a la razón porcentual entre cursos efectivamente dictados y cursos planificados. La tasa de aprobación mide el porcentaje de participantes que completaron y aprobaron los cursos sobre el total de inscritos.'
    },
    {
      q: '¿Cómo filtrar por períodos o características de los programas?',
      a: 'Usa el panel de filtros laterales para seleccionar el rango de años, semestres, meses de inicio, tipo de programa (diplomados, cursos, etc.), modalidad de impartición y área disciplinar.'
    }
  ];

  return {
    navigate,
    user,
    logout,
    mobileOpen,
    cohorteDesde,
    setCohorteDesde,
    cohorteHasta,
    setCohorteHasta,
    semestresSeleccionados,
    setSemestresSeleccionados,
    mesDesde,
    setMesDesde,
    mesHasta,
    setMesHasta,
    tipoSeleccionado,
    setTipoSeleccionado,
    modalidadSeleccionada,
    setModalidadSeleccionada,
    areaSeleccionada,
    setAreaSeleccionada,
    ofertaViewMode,
    setOfertaViewMode,
    ingresosViewMode,
    setIngresosViewMode,
    matriculaViewMode,
    setMatriculaViewMode,
    perfilViewMode,
    setPerfilViewMode,
    localSexoFilter,
    setLocalSexoFilter,
    localEdadFilter,
    setLocalEdadFilter,
    activeModal,
    setActiveModal,
    apiSummary,
    apiLoading,
    apiOfertaSeries,
    apiDictadosSeries,
    apiEjecucionSeries,
    apiOfertaBreakdown,
    apiTasaAprobacionBreakdown,
    apiPerfilBreakdown,
    apiParticipantesSeries,
    apiParticipantesBreakdown,
    apiRecurrenciaSeries,
    apiIngresosBreakdown,
    apiMatriculaBreakdown,
    apiRecurrenciaBreakdown,
    apiPerfilMap,
    apiMatriculaSeries,
    apiIngresosSeries,
    apiOfertaByYear,
    apiIngresosByYear,
    apiMatriculaByYear,
    dynamicAreas,
    dynamicTipos,
    dynamicModalidades,
    dynamicSemestres,
    activeMenu,
    handleDrawerToggle,
    handleResetFilters,
    filteredNominalGroup1,
    filteredNominalGroup2,
    filteredCohorteData,
    filteredRetencionData,
    filteredProgramasData,
    ofertaChartData,
    dictadosSummaryData,
    effectiveDictadosSeries,
    effectiveEjecucionSeries,
    kpiStats,
    kpiCardsData,
    uniqueParticipantsData,
    filteredUniqueParticipantsLocal,
    uniqueParticipantsAgeDist,
    recurrenceFreqDist,
    uniqueParticipantsTotal,
    recurrenciaStats,
    matriculaChartData,
    aprobacionProgramasData,
    ingresosChartData,
    ingresosGeneradosData,
    totalRevenueCLP,
    perfilParticipantesData,
    activePeriodosText,
    // Drawer & Help Center
    drawerOpen,
    currentIndicatorKey,
    drawerPeriod,
    drawerGroupBy,
    drawerLoading,
    drawerError,
    apiIndicatorDetail,
    drawerYears,
    currentIndicator,
    displayRows,
    drawerPeriodText,
    openHelpDialog,
    setOpenHelpDialog,
    handleOpenIndicator,
    handleCloseDrawer,
    handleDrawerPeriodChange,
    setDrawerGroupBy,
    faqData,
  };
};
