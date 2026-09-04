import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { Calendar, Users, Briefcase, Award } from 'lucide-react';
import { getDashboardSummary, getIndicatorSeries, getIndicatorBreakdown, getDepartmentFilters } from '../../../services/piadiApi';

export const SEMESTRES_LIST = ['Primer semestre', 'Segundo semestre'];
export const SEXO_LIST = ['Femenino', 'Masculino', 'No binario', 'Prefiere no responder'];
export const MESES_LIST = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const TIPOS_LIST = ['Charla', 'Taller', 'Seminario', 'Proyecto Social', 'Asistencia Técnica', 'Operativo Comunitario'];
export const MODALIDADES_LIST = ['Presencial', 'Online', 'Semipresencial', 'Híbrida'];
export const AREAS_LIST = ['Social-Comunitaria', 'Productiva-Empresarial', 'Cultural-Artística', 'Medioambiental', 'Titulados y Empleabilidad'];

export const cleanKey = (label) => {
  return String(label || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s]/g, '') // strip corrupted bytes
    .trim()
    .replace(/\s+/g, ' '); // collapse spaces
};

export const getSectorKey = (label) => {
  const lbl = String(label || '').toLowerCase();
  if (lbl.includes('público') || lbl.includes('publico') || lbl.includes('p\ufffdblico') || lbl.includes('pblico')) return 'publico';
  if (lbl.includes('privado')) return 'privado';
  if (lbl.includes('ong') || lbl.includes('fundación') || lbl.includes('fundacion')) return 'ong';
  if (lbl.includes('academia')) return 'academia';
  if (lbl.includes('tp') || lbl.includes('comunidad') || lbl.includes('educación tp') || lbl.includes('edtp') || lbl.includes('educacin tp') || lbl.includes('educacin tp') || lbl.includes('educacintp')) return 'edtp';
  return lbl;
};

export const useDashboardVcM = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ESTADOS  // 1. FILTROS PERSISTENTES (SIDEBAR - CHIPS MULTISELECT)
  const [cohorteDesde, setCohorteDesde] = useState('2023');
  const [cohorteHasta, setCohorteHasta] = useState('2026');
  
  // Estados para multiselección de Chips
  const [selectedSectores, setSelectedSectores] = useState([]);
  const [selectedTiposConvenio, setSelectedTiposConvenio] = useState([]);
  const [selectedEstados, setSelectedEstados] = useState([]);
  const [selectedLineas, setSelectedLineas] = useState([]);
  const [selectedModalidades, setSelectedModalidades] = useState([]);
  const [selectedPlataformas, setSelectedPlataformas] = useState([]);
  const [selectedTiposArticulacion, setSelectedTiposArticulacion] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [periodoAcumulado, setPeriodoAcumulado] = useState(false);

  const selectedSectorKeys = useMemo(() => {
    return selectedSectores.map(getSectorKey);
  }, [selectedSectores]);

  // ESTADOS PARA DATOS REALES DE API
  const [apiSummary, setApiSummary] = useState(null);
  const [apiPrevSummary, setApiPrevSummary] = useState(null);
  const [apiSummaryHasta, setApiSummaryHasta] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiFilters, setApiFilters] = useState(null);

  // Estados para Series de Indicadores de VcM
  const [apiConveniosActivosSeries, setApiConveniosActivosSeries] = useState(null);
  const [apiTotalConveniosSeries, setApiTotalConveniosSeries] = useState(null);
  const [apiActividadesRealizadasSeries, setApiActividadesRealizadasSeries] = useState(null);
  const [apiParticipacionesSeries, setApiParticipacionesSeries] = useState(null);
  const [apiArticulacionesTPSeries, setApiArticulacionesTPSeries] = useState(null);

  // Estados para breakdowns de VcM
  const [apiConveniosSector, setApiConveniosSector] = useState(null);
  const [apiConveniosTipo, setApiConveniosTipo] = useState(null);
  const [apiConveniosContraparte, setApiConveniosContraparte] = useState(null);
  const [apiConveniosArea, setApiConveniosArea] = useState(null);
  const [apiTotalConveniosTipo, setApiTotalConveniosTipo] = useState(null);
  const [apiTotalConveniosResponsable, setApiTotalConveniosResponsable] = useState(null);
  const [apiActividadesModalidad, setApiActividadesModalidad] = useState(null);
  const [apiActividadesLinea, setApiActividadesLinea] = useState(null);
  const [apiActividadesTipo, setApiActividadesTipo] = useState(null);
  const [apiActividadesComuna, setApiActividadesComuna] = useState(null);
  const [apiParticipacionesTipo, setApiParticipacionesTipo] = useState(null);
  const [apiParticipacionesSexo, setApiParticipacionesSexo] = useState(null);
  const [apiParticipacionesInstitucion, setApiParticipacionesInstitucion] = useState(null);
  const [apiParticipacionesComuna, setApiParticipacionesComuna] = useState(null);
  const [apiArticulacionesPlataforma, setApiArticulacionesPlataforma] = useState(null);
  const [apiArticulacionesTipo, setApiArticulacionesTipo] = useState(null);
  const [apiArticulacionesColegio, setApiArticulacionesColegio] = useState(null);

  const apiParams = useMemo(() => {
    const params = { department: 'vinculacion_medio' };
    const desde = parseInt(cohorteDesde);
    const hasta = parseInt(cohorteHasta);
    if (desde === hasta) {
      params.year = cohorteDesde;
    } else {
      params.fromYear = cohorteDesde;
      params.toYear = cohorteHasta;
    }
    if (selectedSectores.length > 0) params.sector = selectedSectores.join(',');
    if (selectedTiposConvenio.length > 0) params.tipo = selectedTiposConvenio.join(',');
    if (selectedEstados.length > 0) params.estado = selectedEstados.join(',');
    if (selectedLineas.length > 0) params.lineaVcM = selectedLineas.join(',');
    if (selectedModalidades.length > 0) params.modalidad = selectedModalidades.join(',');
    if (selectedPlataformas.length > 0) params.plataformaFoco = selectedPlataformas.join(',');
    if (selectedTiposArticulacion.length > 0) params.tipoArticulacion = selectedTiposArticulacion.join(',');
    if (selectedAreas.length > 0) params.areaVinculada = selectedAreas.join(',');

    return params;
  }, [cohorteDesde, cohorteHasta, selectedSectores, selectedTiposConvenio, selectedEstados, selectedLineas, selectedModalidades, selectedPlataformas, selectedTiposArticulacion, selectedAreas]);

  const hasRealData = useMemo(() => {
    const hasSummaryData = Boolean(apiSummary && Object.values(apiSummary).some(card => card.hasData && card.currentValue > 0));
    const hasSeriesData = Boolean(
      (apiConveniosActivosSeries && apiConveniosActivosSeries.some(p => p.value > 0)) ||
      (apiTotalConveniosSeries && apiTotalConveniosSeries.some(p => p.value > 0)) ||
      (apiActividadesRealizadasSeries && apiActividadesRealizadasSeries.some(p => p.value > 0)) ||
      (apiParticipacionesSeries && apiParticipacionesSeries.some(s => s.points?.some(p => p.value > 0))) ||
      (apiArticulacionesTPSeries && apiArticulacionesTPSeries.some(p => p.value > 0))
    );
    const hasBreakdownData = Boolean(
      (apiConveniosSector?.items && apiConveniosSector.items.some(i => i.value > 0)) ||
      (apiActividadesModalidad?.items && apiActividadesModalidad.items.some(i => i.value > 0)) ||
      (apiActividadesLinea?.items && apiActividadesLinea.items.some(i => i.value > 0)) ||
      (apiParticipacionesTipo?.items && apiParticipacionesTipo.items.some(i => i.value > 0)) ||
      (apiArticulacionesPlataforma?.items && apiArticulacionesPlataforma.items.some(i => i.value > 0))
    );
    const hasSpecificVcmFilters = Boolean(
      (apiFilters?.filters?.sectores && apiFilters.filters.sectores.length > 0) ||
      (apiFilters?.filters?.lineasVcM && apiFilters.filters.lineasVcM.length > 0) ||
      (apiFilters?.filters?.modalidades && apiFilters.filters.modalidades.length > 0) ||
      (apiFilters?.filters?.plataformasFoco && apiFilters.filters.plataformasFoco.length > 0)
    );
    return Boolean(hasSummaryData || hasSeriesData || hasBreakdownData || hasSpecificVcmFilters);
  }, [
    apiSummary, 
    apiConveniosActivosSeries, 
    apiTotalConveniosSeries, 
    apiActividadesRealizadasSeries, 
    apiParticipacionesSeries, 
    apiArticulacionesTPSeries,
    apiConveniosSector,
    apiActividadesModalidad,
    apiActividadesLinea,
    apiParticipacionesTipo,
    apiArticulacionesPlataforma,
    apiFilters
  ]);

  useEffect(() => {
    getDepartmentFilters('vinculacion_medio')
      .then((res) => {
        if (res.success && res.data) {
          setApiFilters(res.data);
          const years = res.data?.filters?.years ?? [];
          if (years.length > 0) {
            const min = String(Math.min(...years));
            const max = String(Math.max(...years));
            setCohorteDesde(min);
            setCohorteHasta(max);
          }
        }
      })
      .catch((err) => console.error('Error cargando filtros del departamento VcM:', err));
  }, []);

  useEffect(() => {
    setApiLoading(true);
    setApiSummary(null);
    const seriesParams = { ...apiParams };
    const breakdownParams = { ...apiParams };
    
    // Si se selecciona un unico año que no es el minimo, solicitamos el rango desde el año anterior 
    // para tener los datos de comparacion y poder calcular la evolucion en los graficos y tarjetas
    const desde = parseInt(cohorteDesde);
    const hasta = parseInt(cohorteHasta);
    const years = apiFilters?.filters?.years ?? [2023, 2024, 2025, 2026];
    const minAvailableYear = years.length > 0 ? Math.min(...years) : 2023;
    
    const compareYear = desde === hasta ? (desde > minAvailableYear ? desde - 1 : desde) : desde;
    const prevParams = { ...apiParams };
    delete prevParams.fromYear;
    delete prevParams.toYear;
    prevParams.year = String(compareYear);

    const hastaParams = { ...apiParams };
    delete hastaParams.fromYear;
    delete hastaParams.toYear;
    hastaParams.year = String(hasta);
    
    if (desde === hasta && desde > minAvailableYear) {
      delete seriesParams.year;
      seriesParams.fromYear = String(desde - 1);
      seriesParams.toYear = String(hasta);
    }
    
    Promise.all([
      getDashboardSummary(apiParams).catch(() => null),
      getDashboardSummary(prevParams).catch(() => null),
      getDashboardSummary(hastaParams).catch(() => null),
      getIndicatorSeries('convenios_activos', seriesParams).catch(() => null),
      getIndicatorSeries('total_convenios', seriesParams).catch(() => null),
      getIndicatorSeries('actividades_realizadas', seriesParams).catch(() => null),
      getIndicatorSeries('participaciones', { ...seriesParams, groupBy: 'internosExternos' }).catch(() => null),
      getIndicatorSeries('articulaciones_tp', seriesParams).catch(() => null),
      getIndicatorBreakdown('convenios_activos', { ...breakdownParams, groupBy: 'sector' }).catch(() => null),
      getIndicatorBreakdown('convenios_activos', { ...breakdownParams, groupBy: 'tipoConvenio' }).catch(() => null),
      getIndicatorBreakdown('convenios_activos', { ...breakdownParams, groupBy: 'contraparte' }).catch(() => null),
      getIndicatorBreakdown('convenios_activos', { ...breakdownParams, groupBy: 'areaVinculada' }).catch(() => null),
      getIndicatorBreakdown('total_convenios', { ...breakdownParams, groupBy: 'tipoConvenio' }).catch(() => null),
      getIndicatorBreakdown('total_convenios', { ...breakdownParams, groupBy: 'responsableEcas' }).catch(() => null),
      getIndicatorBreakdown('actividades_realizadas', { ...breakdownParams, groupBy: 'modalidad' }).catch(() => null),
      getIndicatorBreakdown('actividades_realizadas', { ...breakdownParams, groupBy: 'lineaVcM' }).catch(() => null),
      getIndicatorBreakdown('actividades_realizadas', { ...breakdownParams, groupBy: 'tipoActividad' }).catch(() => null),
      getIndicatorBreakdown('actividades_realizadas', { ...breakdownParams, groupBy: 'comuna' }).catch(() => null),
      getIndicatorBreakdown('participaciones', { ...breakdownParams, groupBy: 'tipoParticipante' }).catch(() => null),
      getIndicatorBreakdown('participaciones', { ...breakdownParams, groupBy: 'sexo' }).catch(() => null),
      getIndicatorBreakdown('participaciones', { ...breakdownParams, groupBy: 'institucion' }).catch(() => null),
      getIndicatorBreakdown('participaciones', { ...breakdownParams, groupBy: 'comuna' }).catch(() => null),
      getIndicatorBreakdown('articulaciones_tp', { ...breakdownParams, groupBy: 'plataformaFoco' }).catch(() => null),
      getIndicatorBreakdown('articulaciones_tp', { ...breakdownParams, groupBy: 'tipoArticulacion' }).catch(() => null),
      getIndicatorBreakdown('articulaciones_tp', { ...breakdownParams, groupBy: 'colegioLiceoTP' }).catch(() => null),
    ]).then(([
      summary, 
      prevSummary,
      summaryHasta,
      conveniosActivos, 
      totalConvenios, 
      actividadesRealizadas, 
      participaciones, 
      articulaciones,
      convSector,
      convTipo,
      convContraparte,
      convArea,
      totConvTipo,
      totConvResp,
      actModalidad,
      actLinea,
      actTipo,
      actComuna,
      partTipo,
      partSexo,
      partInst,
      partComuna,
      artPlat,
      artTipo,
      artCol
    ]) => {
      console.log('VcM Backend API Response Debug:', { summary, conveniosActivos, totalConvenios, participaciones });

      if (summary?.success && summary.data) {
        const deptData = summary.data?.departments?.find(d => d.departmentId === 'vinculacion_medio');
        const cards = deptData?.cards ?? [];
        if (cards.some(c => c.hasData)) {
          const map = {};
          cards.forEach(c => { map[c.indicatorKey] = c; });
          setApiSummary(map);
        }
      }

      if (prevSummary?.success && prevSummary.data) {
        const deptData = prevSummary.data?.departments?.find(d => d.departmentId === 'vinculacion_medio');
        const cards = deptData?.cards ?? [];
        if (cards.some(c => c.hasData)) {
          const map = {};
          cards.forEach(c => { map[c.indicatorKey] = c; });
          setApiPrevSummary(map);
        }
      }

      if (summaryHasta?.success && summaryHasta.data) {
        const deptData = summaryHasta.data?.departments?.find(d => d.departmentId === 'vinculacion_medio');
        const cards = deptData?.cards ?? [];
        if (cards.some(c => c.hasData)) {
          const map = {};
          cards.forEach(c => { map[c.indicatorKey] = c; });
          setApiSummaryHasta(map);
        }
      }

      if (conveniosActivos?.success) setApiConveniosActivosSeries(conveniosActivos.data?.points?.length > 0 ? conveniosActivos.data.points : null);
      if (totalConvenios?.success) setApiTotalConveniosSeries(totalConvenios.data?.points?.length > 0 ? totalConvenios.data.points : null);
      if (actividadesRealizadas?.success) setApiActividadesRealizadasSeries(actividadesRealizadas.data?.points?.length > 0 ? actividadesRealizadas.data.points : null);
      if (participaciones?.success) setApiParticipacionesSeries(participaciones.data?.series?.length > 0 ? participaciones.data.series : null);
      if (articulaciones?.success) setApiArticulacionesTPSeries(articulaciones.data?.points?.length > 0 ? articulaciones.data.points : null);
      
      if (convSector?.success && convSector.data?.items?.length) setApiConveniosSector(convSector.data);
      if (convTipo?.success && convTipo.data?.items?.length) setApiConveniosTipo(convTipo.data);
      if (convContraparte?.success && convContraparte.data?.items?.length) setApiConveniosContraparte(convContraparte.data);
      if (convArea?.success && convArea.data?.items?.length) setApiConveniosArea(convArea.data);
      if (totConvTipo?.success && totConvTipo.data?.items?.length) setApiTotalConveniosTipo(totConvTipo.data);
      if (totConvResp?.success && totConvResp.data?.items?.length) setApiTotalConveniosResponsable(totConvResp.data);
      if (actModalidad?.success && actModalidad.data?.items?.length) setApiActividadesModalidad(actModalidad.data);
      if (actLinea?.success && actLinea.data?.items?.length) setApiActividadesLinea(actLinea.data);
      if (actTipo?.success && actTipo.data?.items?.length) setApiActividadesTipo(actTipo.data);
      if (actComuna?.success && actComuna.data?.items?.length) setApiActividadesComuna(actComuna.data);
      if (partTipo?.success && partTipo.data?.items?.length) setApiParticipacionesTipo(partTipo.data);
      if (partSexo?.success && partSexo.data?.items?.length) setApiParticipacionesSexo(partSexo.data);
      if (partInst?.success && partInst.data?.items?.length) setApiParticipacionesInstitucion(partInst.data);
      if (partComuna?.success && partComuna.data?.items?.length) setApiParticipacionesComuna(partComuna.data);
      if (artPlat?.success && artPlat.data?.items?.length) setApiArticulacionesPlataforma(artPlat.data);
      if (artTipo?.success && artTipo.data?.items?.length) setApiArticulacionesTipo(artTipo.data);
      if (artCol?.success && artCol.data?.items?.length) setApiArticulacionesColegio(artCol.data);
    }).catch(err => {
      console.error('Error fetching VcM indicators:', err);
      setApiError(err.message);
    }).finally(() => setApiLoading(false));
  }, [apiParams, apiFilters, cohorteDesde, cohorteHasta]);

  // ESTADOS DE CONTROL DE VISTA DE GRÁFICOS Y SECCIONES
  const [sectionsOpen, setSectionsOpen] = useState({
    sec1: true,
    sec2: false,
    sec3: false,
    sec4: false,
    sec5: false,
    sec6: false
  });

  const toggleSection = (sec) => {
    setSectionsOpen(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Segmentación del Gráfico 1 (Sector | Tipo | Contraparte | Área vinculada)
  const [sec1Segment, setSec1Segment] = useState('Sector');

  // Segmentación del Gráfico 2 (Sector | Tipo | Responsable)
  const [sec2Segment, setSec2Segment] = useState('Sector');

  // Segmentación del Gráfico 4 (Línea VcM | Modalidad | Tipo de Actividad | Comuna)
  const [sec4Segment, setSec4Segment] = useState('Línea VcM');

  // Segmentación del Gráfico 5 (Público objetivo | Sexo | Institución | Comuna)
  const [sec5Segment, setSec5Segment] = useState('Público objetivo');

  // Segmentación del Gráfico 6 (Plataforma | Tipo | Especialidad | Colegio)
  const [sec6Segment, setSec6Segment] = useState('Plataforma');

  // Estados de ordenamiento de tablas
  const [sortStates, setSortStates] = useState({
    sec1: { key: 'value', asc: false },
    sec2: { key: 'value', asc: false },
    sec3: { key: 'vigentes', asc: false },
    sec4: { key: 'value', asc: false },
    sec5: { key: 'value', asc: false },
    sec6: { key: 'value', asc: false }
  });

  const handleSort = (section, key) => {
    setSortStates(prev => ({
      ...prev,
      [section]: {
        key,
        asc: prev[section].key === key ? !prev[section].asc : true
      }
    }));
  };

  const getSortedData = (data, sortState) => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const valA = a[sortState.key];
      const valB = b[sortState.key];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortState.asc ? valA - valB : valB - valA;
      }
      return sortState.asc 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });
  };

  // Helper para filtrar arreglos por los años seleccionados en el Slider
  const getFilteredYears = (data) => {
    if (!data) return [];
    return data.filter(item => {
      const yr = parseInt(item.label || item.year);
      return yr >= parseInt(cohorteDesde) && yr <= parseInt(cohorteHasta);
    });
  };

  const [ofertaViewMode, setOfertaViewMode] = useState('total'); // 'total', 'area', 'tipo', 'modalidad'
  const [ingresosViewMode, setIngresosViewMode] = useState('area'); // 'area', 'tipo', 'modalidad'
  const [matriculaViewMode, setMatriculaViewMode] = useState('total'); // 'total', 'area', 'modalidad', 'tipo'
  const [perfilViewMode, setPerfilViewMode] = useState('region'); // 'region', 'sector', 'escolaridad', 'edad', 'genero', 'tipo'

  // Filtros locales para los participantes
  const [localSexoFilter, setLocalSexoFilter] = useState('Todos');
  const [localEdadFilter, setLocalEdadFilter] = useState('Todos');

  // MODALES DE DETALLE
  const [activeModal, setActiveModal] = useState(null);

  // Filtros dinámicos estáticos (no dependen del backend)
  const dynamicAreas = useMemo(() => {
    const rawAreas = apiFilters?.filters?.areas ?? [];
    return rawAreas.map(a => {
      let cleanLabel = a;
      if (a.includes('ArtÃ­stica') || a.includes('Artística')) {
        cleanLabel = 'Cultural-Artística';
      }
      return { label: cleanLabel, val: a };
    });
  }, [apiFilters]);
  const dynamicTipos = useMemo(() => {
    const items = apiConveniosTipo?.items ?? apiTotalConveniosTipo?.items ?? [];
    if (items.length > 0) {
      return items.map(i => ({
        label: i.label,
        val: i.label
      }));
    }
    return [];
  }, [apiConveniosTipo, apiTotalConveniosTipo]);
  const dynamicModalidades = hasRealData ? MODALIDADES_LIST : [];
  const dynamicSemestres = hasRealData ? SEMESTRES_LIST : [];

  const dynamicLineas = useMemo(() => {
    if (apiActividadesLinea?.items?.length) {
      return apiActividadesLinea.items.map(i => ({
        label: i.label,
        val: i.label
      }));
    }
    return [];
  }, [apiActividadesLinea]);

  const dynamicPlataformas = useMemo(() => {
    if (apiArticulacionesPlataforma?.items?.length) {
      return apiArticulacionesPlataforma.items.map(i => ({
        label: i.label,
        val: i.label
      }));
    }
    return [];
  }, [apiArticulacionesPlataforma]);

  const dynamicTiposArticulacion = useMemo(() => {
    if (apiArticulacionesTipo?.items?.length) {
      return apiArticulacionesTipo.items.map(i => ({
        label: i.label,
        val: i.label
      }));
    }
    return [];
  }, [apiArticulacionesTipo]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleResetFilters = () => {
    setCohorteDesde('2023');
    setCohorteHasta('2026');
    setSelectedSectores([]);
    setSelectedTiposConvenio([]);
    setSelectedEstados([]);
    setSelectedLineas([]);
    setSelectedModalidades([]);
    setSelectedPlataformas([]);
    setSelectedTiposArticulacion([]);
    setSelectedAreas([]);
    setLocalSexoFilter('Todos');
    setLocalEdadFilter('Todos');
  };

  // Lista de KPIs en formato tarjeta (3 tarjetas de referencia)
  const kpiCardsData = useMemo(() => {
    const yHasta = Number(cohorteHasta) || 2026;
    const yDesde = Number(cohorteDesde) || 2023;
    const isSingleYear = yDesde === yHasta;

    if (!hasRealData) {
      return [
        {
          key: 'convenios_vigentes',
          title: 'Total de convenios vigentes',
          value: null,
          baseVal: null,
          evolution: null,
          isPositive: true,
          hasEvo: false,
          isBaseline: false,
          compareYearLabel: null,
          isAccumulated: false,
          icon: Award,
          color: '#E27800',
        },
        {
          key: 'nuevos_convenios',
          title: 'Nuevos convenios firmados',
          value: null,
          baseVal: null,
          evolution: null,
          isPositive: true,
          hasEvo: false,
          isBaseline: false,
          compareYearLabel: null,
          isAccumulated: false,
          icon: Briefcase,
          color: '#2196F3',
        },
        {
          key: 'total_participantes',
          title: 'Total de participantes VcM',
          value: null,
          baseVal: null,
          evolution: null,
          isPositive: true,
          hasEvo: false,
          isBaseline: false,
          compareYearLabel: null,
          isAccumulated: false,
          icon: Users,
          color: '#4CAF50',
        }
      ];
    }

    const years = apiFilters?.filters?.years ?? [2023, 2024, 2025, 2026];
    const minAvailableYear = years.length > 0 ? Math.min(...years) : 2023;

    const getValForYear = (series, year) => {
      if (!series) return null;
      const match = series.find(p => Number(p.year ?? p.period ?? p.label) === year);
      return match ? (match.value ?? match.val) : null;
    };

    const getEvoForSeries = (series, kpiKey) => {
      let compareYear = yDesde;
      let isBaseline = false;
      
      if (isSingleYear) {
        if (yDesde === minAvailableYear) {
          isBaseline = true;
        } else {
          compareYear = yDesde - 1;
        }
      }
      
      if (isBaseline) {
        return {
          baseVal: null,
          evolution: null,
          isPositive: true,
          hasEvo: false,
          isBaseline: true,
          compareYearLabel: String(yDesde),
          isAccumulated: false
        };
      }

      let vHasta;
      let vDesde;
      
      if (periodoAcumulado && !isSingleYear) {
        if (series && Array.isArray(series) && series.length > 0) {
          vHasta = series.reduce((sum, p) => {
            const yr = Number(p.year ?? p.period ?? p.label);
            if (yr >= yDesde && yr <= yHasta) {
              return sum + Number(p.value ?? p.val ?? 0);
            }
            return sum;
          }, 0);
          vDesde = getValForYear(series, yDesde);
        }
      } else {
        vHasta = getValForYear(series, yHasta);
        vDesde = getValForYear(series, compareYear);
      }
      
      if (kpiKey === 'participantes' && hasRealData) {
        const rangeCardVal = apiSummary?.participaciones?.value;
        const hastaCardVal = apiSummaryHasta?.participaciones?.value;
        const activeCardVal = (periodoAcumulado && !isSingleYear) ? rangeCardVal : hastaCardVal;
        const prevCardVal = apiPrevSummary?.participaciones?.value;
        
        let targetHasta = Number(vHasta ?? activeCardVal ?? 0);
        let targetDesde = Number(vDesde ?? prevCardVal ?? 0);
        
        if (targetDesde !== 0 && targetHasta !== 0) {
          const diff = targetHasta - targetDesde;
          const pct = Math.round((diff / targetDesde) * 100);
          return {
            baseVal: targetDesde,
            evolution: `${pct >= 0 ? '+' : ''}${pct}%`,
            isPositive: pct >= 0,
            hasEvo: true,
            isBaseline: false,
            compareYearLabel: String(compareYear),
            isAccumulated: periodoAcumulado && !isSingleYear
          };
        }
      }
      
      if (vDesde != null && vHasta != null && vDesde !== 0) {
        const diff = vHasta - vDesde;
        const pct = Math.round((diff / vDesde) * 100);
        return {
          baseVal: vDesde,
          evolution: `${pct >= 0 ? '+' : ''}${pct}%`,
          isPositive: pct >= 0,
          hasEvo: true,
          isBaseline: false,
          compareYearLabel: String(compareYear),
          isAccumulated: periodoAcumulado && !isSingleYear
        };
      }
      
      if (vDesde != null && vHasta != null) {
        return {
          baseVal: vDesde,
          evolution: vHasta > 0 ? '+100%' : '0%',
          isPositive: true,
          hasEvo: vHasta > 0,
          isBaseline: false,
          compareYearLabel: String(compareYear),
          isAccumulated: periodoAcumulado && !isSingleYear
        };
      }

      return {
        baseVal: 0,
        evolution: null,
        isPositive: true,
        hasEvo: false,
        isBaseline: isSingleYear,
        compareYearLabel: String(compareYear),
        isAccumulated: false
      };
    };

    const activeCardVal = (periodoAcumulado && !isSingleYear) ? apiSummary?.convenios_activos : apiSummaryHasta?.convenios_activos;
    const activeVal = (periodoAcumulado && !isSingleYear && apiConveniosActivosSeries)
      ? apiConveniosActivosSeries.reduce((sum, p) => {
          const yr = Number(p.year ?? p.period ?? p.label);
          if (yr >= yDesde && yr <= yHasta) return sum + Number(p.value ?? p.val ?? 0);
          return sum;
        }, 0)
      : (hasRealData ? (activeCardVal?.formattedValue ?? activeCardVal?.value ?? null) : null);
    const activeEvoData = getEvoForSeries(apiConveniosActivosSeries, 'conveniosVigentes');

    const newCardVal = (periodoAcumulado && !isSingleYear) ? apiSummary?.total_convenios : apiSummaryHasta?.total_convenios;
    const newVal = (periodoAcumulado && !isSingleYear && apiTotalConveniosSeries)
      ? apiTotalConveniosSeries.reduce((sum, p) => {
          const yr = Number(p.year ?? p.period ?? p.label);
          if (yr >= yDesde && yr <= yHasta) return sum + Number(p.value ?? p.val ?? 0);
          return sum;
        }, 0)
      : (hasRealData ? (newCardVal?.formattedValue ?? newCardVal?.value ?? null) : null);
    const newEvoData = getEvoForSeries(apiTotalConveniosSeries, 'nuevosConvenios');

    const flatPartPoints = (() => {
      if (!apiParticipacionesSeries || !Array.isArray(apiParticipacionesSeries)) return null;
      const yearsMap = {};
      apiParticipacionesSeries.forEach(s => {
        s.points?.forEach(p => {
          const yr = Number(p.year ?? p.period ?? p.label);
          const val = Number(p.value ?? p.val ?? 0);
          if (yr) {
            yearsMap[yr] = (yearsMap[yr] || 0) + val;
          }
        });
      });
      return Object.keys(yearsMap).map(yr => ({
        year: Number(yr),
        value: yearsMap[yr]
      }));
    })();

    const partCardVal = (periodoAcumulado && !isSingleYear) ? apiSummary?.participaciones : apiSummaryHasta?.participaciones;
    const partVal = (periodoAcumulado && !isSingleYear && flatPartPoints)
      ? flatPartPoints.reduce((sum, p) => {
          const yr = Number(p.year ?? p.period ?? p.label);
          if (yr >= yDesde && yr <= yHasta) return sum + Number(p.value ?? p.val ?? 0);
          return sum;
        }, 0)
      : (hasRealData ? (partCardVal?.formattedValue ?? partCardVal?.value ?? null) : null);
    const partEvoData = getEvoForSeries(flatPartPoints, 'participantes');

    return [
      {
        key: 'convenios_vigentes',
        title: 'Total de convenios vigentes',
        value: activeVal,
        baseVal: activeEvoData.baseVal,
        evolution: activeEvoData.evolution,
        isPositive: activeEvoData.isPositive,
        hasEvo: activeEvoData.hasEvo,
        isBaseline: activeEvoData.isBaseline,
        compareYearLabel: activeEvoData.compareYearLabel,
        isAccumulated: activeEvoData.isAccumulated,
        icon: Award,
        color: '#E27800',
      },
      {
        key: 'nuevos_convenios',
        title: 'Nuevos convenios firmados',
        value: newVal,
        baseVal: newEvoData.baseVal,
        evolution: newEvoData.evolution,
        isPositive: newEvoData.isPositive,
        hasEvo: newEvoData.hasEvo,
        isBaseline: newEvoData.isBaseline,
        compareYearLabel: newEvoData.compareYearLabel,
        isAccumulated: newEvoData.isAccumulated,
        icon: Briefcase,
        color: '#2196F3',
      },
      {
        key: 'total_participantes',
        title: 'Total de participantes VcM',
        value: typeof partVal === 'number' ? partVal.toLocaleString('es-CL') : partVal,
        baseVal: typeof partEvoData.baseVal === 'number' ? partEvoData.baseVal.toLocaleString('es-CL') : partEvoData.baseVal,
        evolution: partEvoData.evolution,
        isPositive: partEvoData.isPositive,
        hasEvo: partEvoData.hasEvo,
        isBaseline: partEvoData.isBaseline,
        compareYearLabel: partEvoData.compareYearLabel,
        isAccumulated: partEvoData.isAccumulated,
        icon: Users,
        color: '#4CAF50',
      }
    ];
  }, [apiSummary, apiPrevSummary, apiSummaryHasta, apiConveniosActivosSeries, apiTotalConveniosSeries, apiParticipacionesSeries, cohorteDesde, cohorteHasta, hasRealData, apiFilters, periodoAcumulado]);

  // --- DATASET SECCIÓN 1: Total de convenios vigentes ---
  const datasetsSec1 = useMemo(() => {
    if (!hasRealData) {
      return {
        'Año': [],
        'Sector': [],
        'Tipo': [],
        'Contraparte': [],
        'Área vinculada': []
      };
    }

    const conveniosAnio = apiConveniosActivosSeries
      ? apiConveniosActivosSeries.map(p => ({ label: String(p.year ?? p.period ?? ''), value: p.value }))
      : [];

    const rawSector = apiConveniosSector?.items?.length
      ? apiConveniosSector.items.map(i => {
          const lbl = i.label.toLowerCase();
          let key = lbl;
          if (lbl.includes('público') || lbl.includes('publico') || lbl.includes('p\ufffdblico') || lbl.includes('pblico')) key = 'publico';
          else if (lbl.includes('privado')) key = 'privado';
          else if (lbl.includes('ong') || lbl.includes('fundación') || lbl.includes('fundacion') || lbl.includes('fundacin')) key = 'ong';
          else if (lbl.includes('academia')) key = 'academia';
          else if (lbl.includes('tp') || lbl.includes('comunidad') || lbl.includes('educación tp') || lbl.includes('edtp') || lbl.includes('educacin tp')) key = 'edtp';
          return { label: i.label, value: i.value, key };
        })
      : [];

    const finalSector = selectedSectorKeys.length > 0
      ? rawSector.filter(d => selectedSectorKeys.includes(d.key))
      : rawSector;

    const rawTipo = apiConveniosTipo?.items?.length
      ? apiConveniosTipo.items.map(i => {
          const lbl = i.label.toLowerCase();
          const key = lbl.replace(/í/g, 'i').replace(/é/g, 'e').replace(/á/g, 'a').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').trim();
          return { label: i.label, value: i.value, key };
        })
      : [];

    const finalTipo = selectedTiposConvenio.length > 0
      ? rawTipo.filter(d => selectedTiposConvenio.includes(d.key))
      : rawTipo;

    const conveniosContraparte = apiConveniosContraparte?.items?.length
      ? apiConveniosContraparte.items.map(i => ({ label: i.label, value: i.value }))
      : [];

    const conveniosArea = apiConveniosArea?.items?.length
      ? apiConveniosArea.items.map(i => ({ label: i.label, value: i.value }))
      : [];

    return {
      'Año': conveniosAnio,
      'Sector': finalSector,
      'Tipo': finalTipo,
      'Contraparte': conveniosContraparte,
      'Área vinculada': conveniosArea
    };
  }, [hasRealData, selectedSectorKeys, selectedTiposConvenio, apiConveniosActivosSeries, apiConveniosSector, apiConveniosTipo, apiConveniosContraparte, apiConveniosArea]);

  // --- DATASET SECCIÓN 2: Nuevos convenios firmados ---
  const datasetsSec2 = useMemo(() => {
    if (!hasRealData) {
      return {
        'Año': [],
        'Sector': [],
        'Tipo': [],
        'Responsable': []
      };
    }

    const totalConveniosAnio = apiTotalConveniosSeries
      ? apiTotalConveniosSeries.map(p => ({ label: String(p.year ?? p.period ?? ''), value: p.value }))
      : [];

    const rawSector = apiConveniosSector?.items?.length
      ? apiConveniosSector.items.map(i => {
          const lbl = i.label.toLowerCase();
          let key = lbl;
          if (lbl.includes('público') || lbl.includes('publico') || lbl.includes('p\ufffdblico') || lbl.includes('pblico')) key = 'publico';
          else if (lbl.includes('privado')) key = 'privado';
          else if (lbl.includes('ong') || lbl.includes('fundación') || lbl.includes('fundacion') || lbl.includes('fundacin')) key = 'ong';
          else if (lbl.includes('academia')) key = 'academia';
          else if (lbl.includes('tp') || lbl.includes('comunidad') || lbl.includes('educación tp') || lbl.includes('edtp') || lbl.includes('educacin tp')) key = 'edtp';
          return { label: i.label, value: i.value, key };
        })
      : [];

    const finalSector = selectedSectorKeys.length > 0
      ? rawSector.filter(d => selectedSectorKeys.includes(d.key))
      : rawSector;

    const rawTipo = apiTotalConveniosTipo?.items?.length
      ? apiTotalConveniosTipo.items.map(i => ({ label: i.label, value: i.value }))
      : [];

    const finalTipo = selectedTiposConvenio.length > 0
      ? rawTipo.filter(d => selectedTiposConvenio.includes(d.label))
      : rawTipo;

    const conveniosResp = apiTotalConveniosResponsable?.items?.length
      ? apiTotalConveniosResponsable.items.map(i => ({ label: i.label, value: i.value }))
      : [];

    return {
      'Año': totalConveniosAnio,
      'Sector': finalSector,
      'Tipo': finalTipo,
      'Responsable': conveniosResp
    };
  }, [hasRealData, selectedSectorKeys, selectedTiposConvenio, apiTotalConveniosSeries, apiConveniosSector, apiTotalConveniosTipo, apiTotalConveniosResponsable]);

  // --- DATASET SECCIÓN 3: Convenios por Sector ---
  const datasetsSec3 = useMemo(() => {
    if (!hasRealData || !apiConveniosSector?.items?.length) {
      return [];
    }

    const mapped = apiConveniosSector.items.map(i => {
      const lbl = i.label.toLowerCase();
      let key = lbl;
      if (lbl.includes('público') || lbl.includes('publico') || lbl.includes('p\ufffdblico') || lbl.includes('pblico')) key = 'publico';
      else if (lbl.includes('privado')) key = 'privado';
      else if (lbl.includes('ong') || lbl.includes('fundación') || lbl.includes('fundacion') || lbl.includes('fundacin')) key = 'ong';
      else if (lbl.includes('academia')) key = 'academia';
      else if (lbl.includes('tp') || lbl.includes('comunidad') || lbl.includes('educación tp') || lbl.includes('edtp') || lbl.includes('educacin tp')) key = 'edtp';
      return {
        label: i.label,
        vigentes: i.value,
        cerrados: 0,
        total: i.value,
        key
      };
    });

    return selectedSectorKeys.length > 0
      ? mapped.filter(d => selectedSectorKeys.includes(d.key))
      : mapped;
  }, [hasRealData, selectedSectorKeys, apiConveniosSector]);

  // --- DATASET SECCIÓN 4: Actividades VcM ---
  const datasetsSec4 = useMemo(() => {
    if (!hasRealData) {
      return {
        'Año': [],
        'Línea VcM': [],
        'Modalidad': [],
        'Tipo de Actividad': [],
        'Comuna': []
      };
    }

    const actividadesAnio = apiActividadesRealizadasSeries
      ? apiActividadesRealizadasSeries.map(p => ({ label: String(p.year ?? p.period ?? ''), value: p.value }))
      : [];

    const rawLineas = apiActividadesLinea?.items?.length
      ? apiActividadesLinea.items.map(i => ({ label: i.label, value: i.value }))
      : [];

    const actividadesLinea = selectedLineas.length > 0
      ? rawLineas.filter(d => selectedLineas.includes(d.label))
      : rawLineas;

    const rawModalidad = apiActividadesModalidad?.items?.length
      ? apiActividadesModalidad.items.map(i => ({ label: i.label, value: i.value }))
      : [];

    const actividadesModalidad = selectedModalidades.length > 0
      ? rawModalidad.filter(d => selectedModalidades.includes(d.label))
      : rawModalidad;

    const actividadesTipoList = apiActividadesTipo?.items?.length
      ? apiActividadesTipo.items.map(i => {
          const months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          const labelLower = i.label.toLowerCase();
          if (labelLower.includes('charla')) months[10] = i.value;
          else if (labelLower.includes('feria')) months[9] = i.value;
          else if (labelLower.includes('seminario')) months[4] = i.value;
          else if (labelLower.includes('taller')) months[5] = i.value;
          else if (labelLower.includes('operativo') || labelLower.includes('asistencia')) months[8] = i.value;
          else months[5] = i.value;
          return { label: i.label, months };
        })
      : [];

    const comunaList = apiActividadesComuna?.items?.length
      ? apiActividadesComuna.items.map(i => ({ label: i.label, value: i.value }))
      : [];

    return {
      'Año': actividadesAnio,
      'Línea VcM': actividadesLinea,
      'Modalidad': actividadesModalidad,
      'Tipo de Actividad': actividadesTipoList,
      'Comuna': comunaList
    };
  }, [hasRealData, selectedLineas, selectedModalidades, apiActividadesRealizadasSeries, apiActividadesLinea, apiActividadesModalidad, apiActividadesTipo, apiActividadesComuna]);

  // --- DATASET SECCIÓN 5: Participantes en actividades VcM ---
  const datasetsSec5 = useMemo(() => {
    if (!hasRealData) {
      return {
        'Año': [],
        'Público objetivo': [],
        'Sexo': [],
        'Institución': [],
        'Comuna': []
      };
    }

    const participacionesAnio = (() => {
      if (apiParticipacionesSeries && Array.isArray(apiParticipacionesSeries)) {
        const yearsSet = new Set();
        apiParticipacionesSeries.forEach(s => {
          s.points?.forEach(p => {
            const yr = String(p.year ?? p.period ?? p.label ?? '');
            if (yr) yearsSet.add(yr);
          });
        });
        
        const yearsSorted = [...yearsSet].sort((a, b) => Number(a) - Number(b));
        
        return yearsSorted.map(year => {
          let interno = 0;
          let externo = 0;
          
          apiParticipacionesSeries.forEach(s => {
            const labelLower = (s.label || '').toLowerCase();
            const matchPoint = s.points?.find(p => String(p.year ?? p.period ?? p.label ?? '') === year);
            const val = matchPoint ? (matchPoint.value ?? matchPoint.val ?? 0) : 0;
            
            if (labelLower.includes('interno')) {
              interno += val;
            } else {
              externo += val;
            }
          });
          
          return { label: year, interno, externo };
        });
      }
      
      return [];
    })();

    const participacionesTipo = apiParticipacionesTipo?.items?.length
      ? apiParticipacionesTipo.items.map(i => ({ label: i.label, value: i.value }))
      : [];

    const sexoList = apiParticipacionesSexo?.items?.length
      ? apiParticipacionesSexo.items.map(i => ({ label: i.label, value: i.value }))
      : [];

    const institucionList = apiParticipacionesInstitucion?.items?.length
      ? apiParticipacionesInstitucion.items.map(i => ({ label: i.label, value: i.value }))
      : [];

    const comunaList = apiParticipacionesComuna?.items?.length
      ? apiParticipacionesComuna.items.map(i => ({ label: i.label, value: i.value }))
      : [];

    return {
      'Año': participacionesAnio,
      'Público objetivo': participacionesTipo,
      'Sexo': sexoList,
      'Institución': institucionList,
      'Comuna': comunaList
    };
  }, [hasRealData, apiParticipacionesSeries, apiParticipacionesTipo, apiParticipacionesSexo, apiParticipacionesInstitucion, apiParticipacionesComuna]);

  // --- DATASET SECCIÓN 6: Articulaciones TP ejecutadas ---
  const datasetsSec6 = useMemo(() => {
    if (!hasRealData) {
      return {
        'Año': [],
        'Plataforma': [],
        'Tipo': [],
        'Especialidad': [],
        'Colegio': []
      };
    }

    const articulacionesAnio = apiArticulacionesTPSeries
      ? apiArticulacionesTPSeries.map(p => ({ label: String(p.year ?? p.period ?? ''), value: p.value }))
      : [];

    const rawPlataforma = apiArticulacionesPlataforma?.items?.length
      ? apiArticulacionesPlataforma.items.map(i => ({ label: i.label, value: i.value, key: i.label.toLowerCase() }))
      : [];

    const platList = selectedPlataformas.length > 0
      ? rawPlataforma.filter(d => selectedPlataformas.includes(d.label) || selectedPlataformas.includes(d.key))
      : rawPlataforma;

    const rawTipo = apiArticulacionesTipo?.items?.length
      ? apiArticulacionesTipo.items.map(i => ({ label: i.label, value: i.value, key: i.label.toLowerCase() }))
      : [];

    const tipoList = selectedTiposArticulacion.length > 0
      ? rawTipo.filter(d => selectedTiposArticulacion.includes(d.label) || selectedTiposArticulacion.includes(d.key))
      : rawTipo;

    const colegioList = apiArticulacionesColegio?.items?.length
      ? apiArticulacionesColegio.items.map(i => ({ label: i.label, value: i.value }))
      : [];

    return {
      'Año': articulacionesAnio,
      'Plataforma': platList,
      'Tipo': tipoList,
      'Especialidad': [],
      'Colegio': colegioList
    };
  }, [hasRealData, selectedPlataformas, selectedTiposArticulacion, apiArticulacionesTPSeries, apiArticulacionesPlataforma, apiArticulacionesTipo, apiArticulacionesColegio]);

  return {
    navigate,
    user,
    logout,
    mobileOpen,
    sectionsOpen,
    toggleSection,
    sec1Segment,
    setSec1Segment,
    sec2Segment,
    setSec2Segment,
    sec4Segment,
    setSec4Segment,
    sec5Segment,
    setSec5Segment,
    sec6Segment,
    setSec6Segment,
    sortStates,
    handleSort,
    getSortedData,
    getFilteredYears,
    datasetsSec1,
    datasetsSec2,
    datasetsSec3,
    datasetsSec4,
    datasetsSec5,
    datasetsSec6,
    cohorteDesde,
    setCohorteDesde,
    cohorteHasta,
    setCohorteHasta,
    selectedSectores,
    setSelectedSectores,
    selectedTiposConvenio,
    setSelectedTiposConvenio,
    selectedEstados,
    setSelectedEstados,
    selectedLineas,
    setSelectedLineas,
    selectedModalidades,
    setSelectedModalidades,
    selectedPlataformas,
    setSelectedPlataformas,
    selectedTiposArticulacion,
    setSelectedTiposArticulacion,
    selectedAreas,
    setSelectedAreas,
    periodoAcumulado,
    setPeriodoAcumulado,
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
    apiPrevSummary,
    apiLoading,
    apiError,
    hasRealData,
    apiConveniosActivosSeries,
    apiTotalConveniosSeries,
    apiActividadesRealizadasSeries,
    apiParticipacionesSeries,
    apiArticulacionesTPSeries,
    apiFilters,
    apiConveniosSector,
    apiActividadesModalidad,
    apiActividadesLinea,
    apiParticipacionesTipo,
    dynamicAreas,
    dynamicTipos,
    dynamicModalidades,
    dynamicSemestres,
    dynamicLineas,
    dynamicPlataformas,
    dynamicTiposArticulacion,
    activeMenu: 'dashboard',
    handleDrawerToggle,
    handleResetFilters,
    kpiCardsData
  };
};
