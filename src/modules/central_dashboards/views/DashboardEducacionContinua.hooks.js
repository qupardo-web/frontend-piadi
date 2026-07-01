import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { getDashboardSummary, getIndicatorSeries, getIndicatorBreakdown, getDepartmentFilters } from '../../../services/piadiApi';
import { BookOpen, CheckCircle, Users, DollarSign } from 'lucide-react';

export const SEMESTRES_LIST = ['Primer semestre', 'Segundo semestre'];
export const SEXO_LIST = ['Femenino', 'Masculino', 'No binario', 'Prefiere no responder'];
export const MESES_LIST = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const TIPOS_LIST = ['Curso', 'Diplomado', 'Seminario', 'Postítulo'];
export const MODALIDADES_LIST = ['Presencial', 'Online', 'Semipresencial', 'Híbrida'];
export const AREAS_LIST = ['Auditoría', 'Contabilidad', 'Finanzas', 'Tributación', 'Gestión', 'Tecnología'];

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

    const seriesParams = { department: 'educacion_continua', fromYear: cohorteDesde, toYear: cohorteHasta, ...extraParams };
    const breakdownParams = { department: 'educacion_continua', fromYear: cohorteDesde, toYear: cohorteHasta, ...extraParams };

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
    const bp = { department: 'educacion_continua', fromYear: cohorteDesde, toYear: cohorteHasta };
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
    const getVal = (series, year) => series?.find(p => Number(p.year) === year)?.value ?? null;
    const evo = (v26, v23) => (v23 != null && v26 != null && v23 !== 0) ? parseFloat(((v26 - v23) / v23 * 100).toFixed(1)) : null;
    const o26 = getVal(apiOfertaSeries, 2026); const o23 = getVal(apiOfertaSeries, 2023);
    const d26 = getVal(apiDictadosSeries, 2026); const d23 = getVal(apiDictadosSeries, 2023);
    const m26 = getVal(apiMatriculaSeries, 2026); const m23 = getVal(apiMatriculaSeries, 2023);
    const i26 = getVal(apiIngresosSeries, 2026); const i23 = getVal(apiIngresosSeries, 2023);
    return [
      { key: 'oferta', label: 'Oferta programada', Icon: BookOpen, color: '#1E2875', borderColor: '#1E2875', val26: o26, val23: o23, evo: evo(o26, o23), fmt: v => v != null ? String(v) : null },
      { key: 'dictados', label: 'Cursos dictados', Icon: CheckCircle, color: '#047857', borderColor: '#10B981', val26: d26, val23: d23, evo: evo(d26, d23), fmt: v => v != null ? String(v) : null },
      { key: 'matricula', label: 'Matrícula total', Icon: Users, color: '#6d28d9', borderColor: '#8b5cf6', val26: m26, val23: m23, evo: evo(m26, m23), fmt: v => v != null ? Number(v).toLocaleString('es-CL') : null },
      { key: 'ingresos', label: 'Ingresos netos', Icon: DollarSign, color: '#b45309', borderColor: '#F59E0B', val26: i26, val23: i23, evo: evo(i26, i23), fmt: v => v != null ? `$${Number(v).toLocaleString('es-CL')}` : null },
    ];
  }, [apiOfertaSeries, apiDictadosSeries, apiMatriculaSeries, apiIngresosSeries]);

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
  };
};
