import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { Calendar, Users, Briefcase, Award } from 'lucide-react';
import { getDashboardSummary, getIndicatorSeries, getIndicatorBreakdown, getDepartmentFilters } from '../../../services/piadiApi';

export const SEMESTRES_LIST = ['Primer semestre', 'Segundo semestre'];
export const SEXO_LIST = ['Femenino', 'Masculino', 'No binario', 'Prefiere no responder'];
export const MESES_LIST = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const TIPOS_LIST = ['Charla', 'Taller', 'Seminario', 'Proyecto Social', 'Asistencia TÃ©cnica', 'Operativo Comunitario'];
export const MODALIDADES_LIST = ['Presencial', 'Online', 'Semipresencial', 'HÃ­brida'];
export const AREAS_LIST = ['Social-Comunitaria', 'Productiva-Empresarial', 'Cultural-ArtÃ­stica', 'Medioambiental', 'Titulados y Empleabilidad'];

export const cleanKey = (label) => {
  return String(label || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s]/g, '') // strip corrupted bytes
    .trim()
    .replace(/\s+/g, ' '); // collapse spaces
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

  // ESTADOS PARA DATOS REALES DE API
  const [apiSummary, setApiSummary] = useState(null);
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

    return params;
  }, [cohorteDesde, cohorteHasta, selectedSectores, selectedTiposConvenio, selectedEstados, selectedLineas, selectedModalidades, selectedPlataformas, selectedTiposArticulacion]);

  const hasRealData = useMemo(() => {
    if (!apiSummary) return false;
    return Object.values(apiSummary).some(card => card.hasData);
  }, [apiSummary]);

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
    const seriesParams = { ...apiParams };
    const breakdownParams = { ...apiParams };
    
    Promise.all([
      getDashboardSummary(apiParams).catch(() => null),
      getIndicatorSeries('convenios_activos', seriesParams).catch(() => null),
      getIndicatorSeries('total_convenios', seriesParams).catch(() => null),
      getIndicatorSeries('actividades_realizadas', seriesParams).catch(() => null),
      getIndicatorSeries('participaciones', seriesParams).catch(() => null),
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
        if (cards.length > 0) {
          const map = {};
          cards.forEach(c => { map[c.indicatorKey] = c; });
          setApiSummary(map);
        }
      }

      if (conveniosActivos?.success) setApiConveniosActivosSeries(conveniosActivos.data?.points?.length > 0 ? conveniosActivos.data.points : null);
      if (totalConvenios?.success) setApiTotalConveniosSeries(totalConvenios.data?.points?.length > 0 ? totalConvenios.data.points : null);
      if (actividadesRealizadas?.success) setApiActividadesRealizadasSeries(actividadesRealizadas.data?.points?.length > 0 ? actividadesRealizadas.data.points : null);
      if (participaciones?.success) setApiParticipacionesSeries(participaciones.data?.points?.length > 0 ? participaciones.data.points : null);
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
  }, [apiParams]);

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

  // Filtros dinÃ¡micos estÃ¡ticos (no dependen del backend)
  const dynamicAreas = AREAS_LIST;
  const dynamicTipos = useMemo(() => {
    const items = apiConveniosTipo?.items ?? apiTotalConveniosTipo?.items ?? [];
    if (items.length > 0) {
      return items.map(i => ({
        label: i.label,
        val: i.label.toLowerCase().replace(/í/g, 'i').replace(/é/g, 'e').replace(/á/g, 'a').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').trim()
      }));
    }
    return [
      { label: 'Convenio Marco', val: 'marco' },
      { label: 'Convenio Específico', val: 'especifico' },
      { label: 'Colaboración', val: 'colaboracion' }
    ];
  }, [apiConveniosTipo, apiTotalConveniosTipo]);
  const dynamicModalidades = MODALIDADES_LIST;
  const dynamicSemestres = SEMESTRES_LIST;

  const dynamicLineas = useMemo(() => {
    if (apiActividadesLinea?.items?.length) {
      return apiActividadesLinea.items.map(i => {
        let val = cleanKey(i.label);
        if (val.includes('articulacion tp') || val === 'tp') val = 'tp';
        return { label: i.label, val };
      });
    }
    return [
      { label: 'Admisión y orientación', val: 'admision' },
      { label: 'Articulación TP', val: 'tp' },
      { label: 'Empleabilidad y prácticas', val: 'empleabilidad' },
      { label: 'Transferencia disciplinar', val: 'disciplinar' },
      { label: 'Certificación y competencias', val: 'certificacion' },
      { label: 'Relacionamiento territorial', val: 'territorial' }
    ];
  }, [apiActividadesLinea]);

  const dynamicPlataformas = useMemo(() => {
    if (apiArticulacionesPlataforma?.items?.length) {
      return apiArticulacionesPlataforma.items.map(i => {
        let val = i.label.toLowerCase().replace(/í/g, 'i').replace(/é/g, 'e').replace(/á/g, 'a').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').trim();
        if (val.includes('sap')) val = 'sap';
        else if (val.includes('defontana')) val = 'defontana';
        else if (val.includes('excel')) val = 'excel';
        else if (val.includes('power bi') || val.includes('powerbi')) val = 'powerbi';
        return { label: i.label, val };
      });
    }
    return [
      { label: 'SAP', val: 'sap' },
      { label: 'Defontana', val: 'defontana' },
      { label: 'Excel aplicado', val: 'excel' },
      { label: 'Power BI', val: 'powerbi' }
    ];
  }, [apiArticulacionesPlataforma]);

  const dynamicTiposArticulacion = useMemo(() => {
    if (apiArticulacionesTipo?.items?.length) {
      return apiArticulacionesTipo.items.map(i => {
        let val = i.label.toLowerCase().replace(/í/g, 'i').replace(/é/g, 'e').replace(/á/g, 'a').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').trim();
        if (val.includes('reconocimiento') || val.includes('aprendizajes')) val = 'reconocimiento';
        else if (val.includes('alternancia')) val = 'alternancia';
        else if (val.includes('taller')) val = 'taller';
        else if (val.includes('charla')) val = 'charla';
        else if (val.includes('feria')) val = 'curricular';
        else if (val.includes('mesa') || val.includes('sectorial')) val = 'mesa';
        return { label: i.label, val };
      });
    }
    return [
      { label: 'Reconocimiento de aprendizajes', val: 'reconocimiento' },
      { label: 'Alternancia', val: 'alternancia' },
      { label: 'Taller práctico', val: 'taller' },
      { label: 'Charla técnica', val: 'charla' },
      { label: 'Feria TP', val: 'curricular' },
      { label: 'Mesa sectorial', val: 'mesa' }
    ];
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
    setLocalSexoFilter('Todos');
    setLocalEdadFilter('Todos');
  };

  // Simulación de KPIs dinámicos vinculados a los años del Slider (2023 - 2026) y Chips de Filtros
  const kpiStats = useMemo(() => {
    const yearsArray = [2023, 2024, 2025, 2026];
    
    // Calcular multiplicador global según filtros activos
    let multiplier = 1.0;
    if (selectedSectores.length > 0) multiplier *= (selectedSectores.length / 5) * 1.1;
    if (selectedTiposConvenio.length > 0) multiplier *= (selectedTiposConvenio.length / 7) * 1.1;
    if (selectedEstados.length > 0) multiplier *= (selectedEstados.length / 3) * 1.1;
    if (selectedLineas.length > 0) multiplier *= (selectedLineas.length / 6) * 1.1;
    if (selectedModalidades.length > 0) multiplier *= (selectedModalidades.length / 3) * 1.1;
    if (selectedPlataformas.length > 0) multiplier *= (selectedPlataformas.length / 4) * 1.1;
    if (selectedTiposArticulacion.length > 0) multiplier *= (selectedTiposArticulacion.length / 6) * 1.1;
    multiplier = Math.min(1.0, Math.max(0.12, multiplier));

    const kpisPerYear = {
      conveniosVigentes: { values: [25, 32, 38, 42].map(v => Math.round(v * multiplier)) },
      nuevosConvenios: { values: [48, 55, 62, 67].map(v => Math.round(v * multiplier)) },
      participantes: { values: [1000, 1240, 1600, 1856].map(v => Math.round(v * multiplier)) }
    };

    const fromYear = parseInt(cohorteDesde) || 2023;
    const toYear = parseInt(cohorteHasta) || 2026;
    const idxMin = yearsArray.indexOf(fromYear);
    const idxMax = yearsArray.indexOf(toYear);

    const getKPIVal = (kpiKey) => {
      const vals = kpisPerYear[kpiKey].values;
      const current = idxMax !== -1 ? (vals[idxMax] ?? vals[vals.length - 1]) : vals[vals.length - 1];
      const base = idxMin !== -1 ? (vals[idxMin] ?? vals[0]) : vals[0];
      const diff = current - base;
      const pct = base === 0 ? 0 : Math.round((diff / base) * 100);
      const isPositive = diff >= 0;
      const evolution = `${isPositive ? '+' : ''}${pct}%`;
      return { val: current, baseVal: base, evolution, isPositive, pct };
    };

    return {
      conveniosVigentes: getKPIVal('conveniosVigentes'),
      nuevosConvenios: getKPIVal('nuevosConvenios'),
      participantes: getKPIVal('participantes')
    };
  }, [cohorteDesde, cohorteHasta, selectedSectores, selectedTiposConvenio, selectedEstados, selectedLineas, selectedModalidades, selectedPlataformas, selectedTiposArticulacion]);

  // Lista de KPIs en formato tarjeta (3 tarjetas de referencia)
  const kpiCardsData = useMemo(() => {
    const yHasta = Number(cohorteHasta) || 2026;
    const yDesde = Number(cohorteDesde) || 2023;

    const getValForYear = (series, year) => {
      if (!series) return null;
      // Trata de buscar por year o period
      const match = series.find(p => Number(p.year ?? p.period ?? p.label) === year);
      return match ? (match.value ?? match.val) : null;
    };

    const getEvoForSeries = (series, kpiKey) => {
      const vHasta = getValForYear(series, yHasta);
      const vDesde = getValForYear(series, yDesde);
      if (vDesde != null && vHasta != null && vDesde !== 0) {
        const diff = vHasta - vDesde;
        const pct = Math.round((diff / vDesde) * 100);
        return {
          baseVal: vDesde,
          evolution: `${pct >= 0 ? '+' : ''}${pct}%`,
          isPositive: pct >= 0,
          hasEvo: true
        };
      }
      // Si la serie tiene datos reales cargados pero no se puede comparar en el rango seleccionado, mostrar N/A real.
      if (series && series.length > 0) {
        return {
          baseVal: series[0]?.value ?? series[0]?.val ?? '-',
          evolution: 'N/A',
          isPositive: true,
          hasEvo: false
        };
      }
      // Si estamos en modo de datos reales pero no hay serie, retornar N/A
      if (hasRealData) {
        return {
          baseVal: '-',
          evolution: 'N/A',
          isPositive: true,
          hasEvo: false
        };
      }
      // Retorna valores de kpiStats si no hay datos de serie cargados en absoluto en el backend (simulación inicial)
      return {
        baseVal: kpiStats[kpiKey].baseVal,
        evolution: kpiStats[kpiKey].evolution,
        isPositive: kpiStats[kpiKey].isPositive,
        hasEvo: true
      };
    };

    const activeCard = apiSummary?.convenios_activos;
    const newCard = apiSummary?.total_convenios;
    const partCard = apiSummary?.participaciones;

    const activeVal = hasRealData
      ? (activeCard?.formattedValue ?? activeCard?.value ?? 0)
      : kpiStats.conveniosVigentes.val;
    const activeEvoData = getEvoForSeries(apiConveniosActivosSeries, 'conveniosVigentes');

    const newVal = hasRealData
      ? (newCard?.formattedValue ?? newCard?.value ?? 0)
      : kpiStats.nuevosConvenios.val;
    const newEvoData = getEvoForSeries(apiTotalConveniosSeries, 'nuevosConvenios');

    const partVal = hasRealData
      ? (partCard?.formattedValue ?? partCard?.value ?? 0)
      : kpiStats.participantes.val;
    const partEvoData = getEvoForSeries(apiParticipacionesSeries, 'participantes');

    return [
      {
        key: 'convenios_vigentes',
        title: 'Total de convenios vigentes',
        value: activeVal,
        baseVal: activeEvoData.baseVal,
        evolution: activeEvoData.evolution,
        isPositive: activeEvoData.isPositive,
        hasEvo: activeEvoData.hasEvo,
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
        icon: Users,
        color: '#4CAF50',
      }
    ];
  }, [kpiStats, apiSummary, apiConveniosActivosSeries, apiTotalConveniosSeries, apiParticipacionesSeries, cohorteDesde, cohorteHasta, hasRealData]);

  // Datos del grÃ¡fico de Oferta de Actividades (EvoluciÃ³n Temporal)
  const ofertaChartData = useMemo(() => {
    const years = ['2023', '2024', '2025', '2026'].filter(y => parseInt(y) >= parseInt(cohorteDesde) && parseInt(y) <= parseInt(cohorteHasta));
    
    // Simular desglose
    if (ofertaViewMode === 'total') {
      return {
        years,
        series: [
          { data: years.map(y => y === '2023' ? 35 : y === '2024' ? 42 : y === '2025' ? 48 : 55), label: 'Actividades Planificadas', color: '#1E2875' },
          { data: years.map(y => y === '2023' ? 32 : y === '2024' ? 39 : y === '2025' ? 45 : 51), label: 'Actividades Ejecutadas', color: '#E27800' }
        ]
      };
    } else if (ofertaViewMode === 'area') {
      return {
        years,
        series: [
          { data: years.map(y => y === '2023' ? 10 : y === '2024' ? 12 : y === '2025' ? 15 : 18), label: 'Social-Comunitaria', color: '#E27800' },
          { data: years.map(y => y === '2023' ? 8 : y === '2024' ? 10 : y === '2025' ? 12 : 14), label: 'Productiva-Empresarial', color: '#1E2875' },
          { data: years.map(y => y === '2023' ? 6 : y === '2024' ? 7 : y === '2025' ? 8 : 10), label: 'Cultural-ArtÃ­stica', color: '#51158C' },
          { data: years.map(y => y === '2023' ? 4 : y === '2024' ? 5 : y === '2025' ? 6 : 7), label: 'Medioambiental', color: '#1DC2A0' },
          { data: years.map(y => y === '2023' ? 4 : y === '2024' ? 5 : y === '2025' ? 7 : 6), label: 'Titulados', color: '#3EC9FF' }
        ]
      };
    } else if (ofertaViewMode === 'tipo') {
      return {
        years,
        series: [
          { data: years.map(y => y === '2023' ? 15 : 18), label: 'Charla/Seminario', color: '#1E2875' },
          { data: years.map(y => y === '2023' ? 10 : 12), label: 'Taller', color: '#E27800' },
          { data: years.map(y => y === '2023' ? 5 : 7), label: 'Proyecto Social', color: '#1DC2A0' },
          { data: years.map(y => y === '2023' ? 2 : 2), label: 'Asistencia TÃ©cnica', color: '#51158C' }
        ]
      };
    } else { // modalidad
      return {
        years,
        series: [
          { data: years.map(y => y === '2023' ? 20 : 25), label: 'Presencial', color: '#E27800' },
          { data: years.map(y => y === '2023' ? 8 : 10), label: 'Online', color: '#1E2875' },
          { data: years.map(y => y === '2023' ? 4 : 4), label: 'HÃ­brida', color: '#1DC2A0' }
        ]
      };
    }
  }, [cohorteDesde, cohorteHasta, ofertaViewMode]);

  // GrÃ¡fico de Barras de Proyectos Vinculados y EjecuciÃ³n
  const dictadosSummaryData = useMemo(() => {
    return [
      { area: 'Social-Comunitaria', ejecutado: 14, planificado: 15 },
      { area: 'Productiva-Empresarial', ejecutado: 11, planificado: 12 },
      { area: 'Cultural-ArtÃ­stica', ejecutado: 8, planificado: 8 },
      { area: 'Medioambiental', ejecutado: 6, planificado: 7 },
      { area: 'Titulados', ejecutado: 6, planificado: 8 }
    ];
  }, []);

  // Beneficiarios por Ã¡rea/gÃ©nero/rango de edad
  const uniqueParticipantsData = useMemo(() => {
    return {
      points: [
        { x: '2023', y: 850 },
        { x: '2024', y: 1100 },
        { x: '2025', y: 1250 },
        { x: '2026', y: 1450 }
      ],
      ageDist: [
        { id: 0, value: 350, label: '18-24 aÃ±os', color: '#1E2875' },
        { id: 1, value: 450, label: '25-39 aÃ±os', color: '#E27800' },
        { id: 2, value: 300, label: '40-59 aÃ±os', color: '#1DC2A0' },
        { id: 3, value: 150, label: '60+ aÃ±os', color: '#51158C' }
      ]
    };
  }, []);

  // Perfil de los beneficiarios/participantes externos
  const apiPerfilMap = useMemo(() => {
    return {
      region: [
        { label: 'Metropolitana', value: 750 },
        { label: 'ValparaÃ­so', value: 200 },
        { label: 'O\'Higgins', value: 150 },
        { label: 'BiobÃ­o', value: 100 },
        { label: 'Otras Regiones', value: 50 }
      ],
      sector: [
        { label: 'Pymes y Microempresas', value: 450 },
        { label: 'Comunidades Locales', value: 400 },
        { label: 'Instituciones PÃºblicas', value: 250 },
        { label: 'ONGs y Fundaciones', value: 150 }
      ],
      escolaridad: [
        { label: 'EnseÃ±anza Media', value: 300 },
        { label: 'TÃ©cnico Nivel Superior', value: 450 },
        { label: 'Universitario', value: 350 },
        { label: 'Postgrado/Sin Datos', value: 150 }
      ],
      genero: [
        { label: 'Femenino', value: 680 },
        { label: 'Masculino', value: 520 },
        { label: 'No binario', value: 35 },
        { label: 'Prefiere no responder', value: 15 }
      ]
    };
  }, []);

  // Recurrencia/Impacto de Beneficiarios
  const recurrenceFreqDist = useMemo(() => [
    { label: '1 Actividad', value: 70 },
    { label: '2 Actividades', value: 20 },
    { label: '3+ Actividades', value: 10 }
  ], []);

  // Listado estÃ¡tico de programas para la tabla de detalle
  const filteredProgramasData = useMemo(() => [
    { id: 1, name: 'Taller de Emprendimiento Femenino Comuna de Santiago', area: 'Social-Comunitaria', tipo: 'Taller', modalidad: 'Presencial', estado: 'Ejecutado', beneficiarios: 45, convenios: 1 },
    { id: 2, name: 'AsesorÃ­a Tributaria GratÃºita a Microempresarios Barrio Franklin', area: 'Productiva-Empresarial', tipo: 'Asistencia TÃ©cnica', modalidad: 'Presencial', estado: 'Ejecutado', beneficiarios: 68, convenios: 2 },
    { id: 3, name: 'Seminario de EconomÃ­a Circular en EducaciÃ³n Superior', area: 'Medioambiental', tipo: 'Seminario', modalidad: 'Online', estado: 'Ejecutado', beneficiarios: 150, convenios: 1 },
    { id: 4, name: 'Operativo Contable y de DeclaraciÃ³n de Renta Vecinal', area: 'Social-Comunitaria', tipo: 'Operativo Comunitario', modalidad: 'Presencial', estado: 'Ejecutado', beneficiarios: 220, convenios: 1 },
    { id: 5, name: 'Encuentro Anual de Titulados ECAS y Networking 2026', area: 'Titulados y Empleabilidad', tipo: 'Charla', modalidad: 'HÃ­brida', estado: 'Ejecutado', beneficiarios: 95, convenios: 0 },
    { id: 6, name: 'Taller de Finanzas Personales para Adultos Mayores', area: 'Social-Comunitaria', tipo: 'Taller', modalidad: 'Presencial', estado: 'Ejecutado', beneficiarios: 35, convenios: 1 }
  ], []);

  // Helper to scale mock data to match a real total number
  const scaleAndAdjust = (arr, target) => {
    if (target === 0) return arr.map(d => ({ ...d, value: 0 }));
    const sum = arr.reduce((acc, d) => acc + d.value, 0);
    if (sum === 0) return arr;
    let scaled = arr.map(d => ({ ...d, value: Math.round((d.value / sum) * target) }));
    let currentSum = scaled.reduce((acc, d) => acc + d.value, 0);
    let diff = target - currentSum;
    if (diff !== 0 && scaled.length > 0) {
      let maxIdx = 0;
      let maxVal = -1;
      for (let i = 0; i < scaled.length; i++) {
        if (scaled[i].value > maxVal) {
          maxVal = scaled[i].value;
          maxIdx = i;
        }
      }
      scaled[maxIdx].value += diff;
      if (scaled[maxIdx].value < 0) scaled[maxIdx].value = 0;
    }
    return scaled;
  };

  // --- DATASET SECCIÓN 1: Total de convenios vigentes ---
  const datasetsSec1 = useMemo(() => {
    let multiplier = 1.0;
    if (selectedSectores.length > 0) multiplier *= (selectedSectores.length / 5) * 1.1;
    if (selectedTiposConvenio.length > 0) multiplier *= (selectedTiposConvenio.length / 7) * 1.1;
    if (selectedEstados.length > 0) multiplier *= (selectedEstados.length / 3) * 1.1;
    multiplier = Math.min(1.0, Math.max(0.15, multiplier));

    const rawSector = [
      { label: 'Público', value: Math.round(15 * multiplier), key: 'publico' },
      { label: 'Privado', value: Math.round(20 * multiplier), key: 'privado' },
      { label: 'ONG', value: Math.round(8 * multiplier), key: 'ong' },
      { label: 'Academia', value: Math.round(12 * multiplier), key: 'academia' },
      { label: 'Comunidad', value: Math.round(5 * multiplier), key: 'edtp' }
    ];
    const filteredSector = selectedSectores.length > 0
      ? rawSector.filter(d => selectedSectores.includes(d.key))
      : rawSector;

    const rawTipo = [
      { label: 'C. Marco', value: Math.round(10 * multiplier), key: 'colaboracion' },
      { label: 'Específico', value: Math.round(18 * multiplier), key: 'practica' },
      { label: 'Colaboración', value: Math.round(14 * multiplier), key: 'colaboracion' },
      { label: 'Patrocinio', value: Math.round(6 * multiplier), key: 'capacitacion' },
      { label: 'Intercambio', value: Math.round(4 * multiplier), key: 'pasantia' }
    ];
    const filteredTipo = selectedTiposConvenio.length > 0
      ? rawTipo.filter(d => selectedTiposConvenio.includes(d.key))
      : rawTipo;

    const rawContraparte = [
      { label: 'Facultad de Ingeniería', value: Math.round(22 * multiplier) },
      { label: 'Facultad de Salud', value: Math.round(16 * multiplier) },
      { label: 'Facultad de Educación', value: Math.round(12 * multiplier) },
      { label: 'Municipalidad de Santiago', value: Math.round(9 * multiplier) },
      { label: 'CORFO', value: Math.round(7 * multiplier) },
      { label: 'Ministerio de Educación', value: Math.round(6 * multiplier) },
      { label: 'SENCE', value: Math.round(5 * multiplier) },
      { label: 'Servicio de Salud Metropolitano', value: Math.round(5 * multiplier) },
      { label: 'Municipalidad de Providencia', value: Math.round(4 * multiplier) },
      { label: 'Fundación Chile', value: Math.round(4 * multiplier) }
    ];

    const rawArea = [
      { label: 'Ingeniería', value: Math.round(14 * multiplier) },
      { label: 'Salud', value: Math.round(10 * multiplier) },
      { label: 'Educación', value: Math.round(18 * multiplier) },
      { label: 'Social', value: Math.round(13 * multiplier) },
      { label: 'Ambiental', value: Math.round(6 * multiplier) }
    ];

    const conveniosAnio = apiConveniosActivosSeries
      ? apiConveniosActivosSeries.map(p => ({ label: String(p.year ?? p.period ?? ''), value: p.value }))
      : [
          { label: '2023', value: Math.round(12 * multiplier) },
          { label: '2024', value: Math.round(18 * multiplier) },
          { label: '2025', value: Math.round(15 * multiplier) },
          { label: '2026', value: Math.round(22 * multiplier) }
        ];

    const activeTotal = apiConveniosActivosSeries
      ? apiConveniosActivosSeries.reduce((sum, p) => sum + p.value, 0)
      : null;

    if (activeTotal !== null) {
      const conveniosSector = apiConveniosSector?.items?.length
        ? apiConveniosSector.items.map(i => {
            const lbl = i.label.toLowerCase();
            let key = lbl;
            if (lbl.includes('público') || lbl.includes('publico')) key = 'publico';
            else if (lbl.includes('privado')) key = 'privado';
            else if (lbl.includes('ong') || lbl.includes('fundación') || lbl.includes('fundacion')) key = 'ong';
            else if (lbl.includes('academia')) key = 'academia';
            else if (lbl.includes('tp') || lbl.includes('comunidad') || lbl.includes('educación tp') || lbl.includes('edtp')) key = 'edtp';
            return { label: i.label, value: i.value, key };
          })
        : scaleAndAdjust(rawSector, activeTotal);

      const sectorFiltered = selectedSectores.length > 0
        ? conveniosSector.filter(d => selectedSectores.includes(d.key))
        : conveniosSector;

      const tipoScaled = apiConveniosTipo?.items?.length
        ? apiConveniosTipo.items.map(i => {
            const lbl = i.label.toLowerCase();
            const key = lbl.replace(/í/g, 'i').replace(/é/g, 'e').replace(/á/g, 'a').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').trim();
            return { label: i.label, value: i.value, key };
          })
        : scaleAndAdjust(rawTipo, activeTotal);

      const tipoFiltered = selectedTiposConvenio.length > 0
        ? tipoScaled.filter(d => selectedTiposConvenio.includes(d.key))
        : tipoScaled;

      const contraparteScaled = apiConveniosContraparte?.items?.length
        ? apiConveniosContraparte.items.map(i => ({ label: i.label, value: i.value }))
        : scaleAndAdjust(rawContraparte, activeTotal);

      const areaScaled = apiConveniosArea?.items?.length
        ? apiConveniosArea.items.map(i => ({ label: i.label, value: i.value }))
        : scaleAndAdjust(rawArea, activeTotal);

      return {
        'Año': conveniosAnio,
        'Sector': sectorFiltered,
        'Tipo': tipoFiltered,
        'Contraparte': contraparteScaled,
        'Área vinculada': areaScaled
      };
    }

    const conveniosSector = apiConveniosSector?.items?.length
      ? apiConveniosSector.items.map(i => {
          const lbl = i.label.toLowerCase();
          let key = lbl;
          if (lbl.includes('público') || lbl.includes('publico')) key = 'publico';
          else if (lbl.includes('privado')) key = 'privado';
          else if (lbl.includes('ong') || lbl.includes('fundación') || lbl.includes('fundacion')) key = 'ong';
          else if (lbl.includes('academia')) key = 'academia';
          else if (lbl.includes('tp') || lbl.includes('comunidad') || lbl.includes('educación tp') || lbl.includes('edtp')) key = 'edtp';
          return { label: i.label, value: i.value, key };
        })
      : filteredSector;

    const conveniosTipo = apiConveniosTipo?.items?.length
      ? apiConveniosTipo.items.map(i => {
          const lbl = i.label.toLowerCase();
          const key = lbl.replace(/í/g, 'i').replace(/é/g, 'e').replace(/á/g, 'a').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').trim();
          return { label: i.label, value: i.value, key };
        })
      : filteredTipo;

    const conveniosContraparte = apiConveniosContraparte?.items?.length
      ? apiConveniosContraparte.items.map(i => ({ label: i.label, value: i.value }))
      : rawContraparte;

    const conveniosArea = apiConveniosArea?.items?.length
      ? apiConveniosArea.items.map(i => ({ label: i.label, value: i.value }))
      : rawArea;

    return {
      'Año': conveniosAnio,
      'Sector': conveniosSector,
      'Tipo': conveniosTipo,
      'Contraparte': conveniosContraparte,
      'Área vinculada': conveniosArea
    };
  }, [selectedSectores, selectedTiposConvenio, selectedEstados, apiConveniosActivosSeries, apiConveniosSector, apiConveniosTipo, apiConveniosContraparte, apiConveniosArea]);

  // --- DATASET SECCIÓN 2: Nuevos convenios firmados ---
  const datasetsSec2 = useMemo(() => {
    let multiplier = 1.0;
    if (selectedSectores.length > 0) multiplier *= (selectedSectores.length / 5) * 1.1;
    if (selectedTiposConvenio.length > 0) multiplier *= (selectedTiposConvenio.length / 7) * 1.1;
    if (selectedEstados.length > 0) multiplier *= (selectedEstados.length / 3) * 1.1;
    multiplier = Math.min(1.0, Math.max(0.15, multiplier));

    const rawSector = [
      { label: 'Público', value: Math.round(8 * multiplier), key: 'publico' },
      { label: 'Privado', value: Math.round(12 * multiplier), key: 'privado' },
      { label: 'ONG', value: Math.round(5 * multiplier), key: 'ong' },
      { label: 'Academia', value: Math.round(9 * multiplier), key: 'academia' },
      { label: 'Comunidad', value: Math.round(3 * multiplier), key: 'edtp' }
    ];
    const filteredSector = selectedSectores.length > 0
      ? rawSector.filter(d => selectedSectores.includes(d.key))
      : rawSector;

    const rawTipo = [
      { label: 'Convenio marco', value: Math.round(7 * multiplier), key: 'colaboracion' },
      { label: 'Específico', value: Math.round(15 * multiplier), key: 'practica' },
      { label: 'Colaboración', value: Math.round(11 * multiplier), key: 'colaboracion' },
      { label: 'Patrocinio', value: Math.round(4 * multiplier), key: 'capacitacion' },
      { label: 'Intercambio', value: Math.round(3 * multiplier), key: 'pasantia' }
    ];
    const filteredTipo = selectedTiposConvenio.length > 0
      ? rawTipo.filter(d => selectedTiposConvenio.includes(d.key))
      : rawTipo;

    const rawResponsable = [
      { label: 'Dir. Vinculación', value: Math.round(18 * multiplier) },
      { label: 'Fac. Ingeniería', value: Math.round(14 * multiplier) },
      { label: 'Fac. Salud', value: Math.round(10 * multiplier) },
      { label: 'Fac. Educación', value: Math.round(10 * multiplier) },
      { label: 'Otras unidades', value: Math.round(5 * multiplier) }
    ];

    const totalConveniosAnio = apiTotalConveniosSeries
      ? apiTotalConveniosSeries.map(p => ({ label: String(p.year ?? p.period ?? ''), value: p.value }))
      : [
          { label: '2023', value: Math.round(48 * multiplier) },
          { label: '2024', value: Math.round(55 * multiplier) },
          { label: '2025', value: Math.round(62 * multiplier) },
          { label: '2026', value: Math.round(67 * multiplier) }
        ];

    const actualTotal = apiTotalConveniosSeries
      ? apiTotalConveniosSeries.reduce((sum, p) => sum + p.value, 0)
      : null;

    if (actualTotal !== null) {
      const conveniosSector = apiConveniosSector?.items?.length
        ? apiConveniosSector.items.map(i => {
            const lbl = i.label.toLowerCase();
            let key = lbl;
            if (lbl.includes('público') || lbl.includes('publico')) key = 'publico';
            else if (lbl.includes('privado')) key = 'privado';
            else if (lbl.includes('ong') || lbl.includes('fundación') || lbl.includes('fundacion')) key = 'ong';
            else if (lbl.includes('academia')) key = 'academia';
            else if (lbl.includes('tp') || lbl.includes('comunidad') || lbl.includes('educación tp') || lbl.includes('edtp')) key = 'edtp';
            return { label: i.label, value: i.value, key };
          })
        : scaleAndAdjust(rawSector, actualTotal);

      const sectorFiltered = selectedSectores.length > 0
        ? conveniosSector.filter(d => selectedSectores.includes(d.key))
        : conveniosSector;

      const tipoScaled = apiTotalConveniosTipo?.items?.length
        ? apiTotalConveniosTipo.items.map(i => {
            const lbl = i.label.toLowerCase();
            const key = lbl.replace(/í/g, 'i').replace(/é/g, 'e').replace(/á/g, 'a').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').trim();
            return { label: i.label, value: i.value, key };
          })
        : scaleAndAdjust(rawTipo, actualTotal);

      const tipoFiltered = selectedTiposConvenio.length > 0
        ? tipoScaled.filter(d => selectedTiposConvenio.includes(d.key))
        : tipoScaled;

      const responsableScaled = apiTotalConveniosResponsable?.items?.length
        ? apiTotalConveniosResponsable.items.map(i => ({ label: i.label, value: i.value }))
        : scaleAndAdjust(rawResponsable, actualTotal);

      return {
        'Año': totalConveniosAnio,
        'Sector': sectorFiltered,
        'Tipo': tipoFiltered,
        'Responsable': responsableScaled
      };
    }

    const conveniosSector = apiConveniosSector?.items?.length
      ? apiConveniosSector.items.map(i => {
          const lbl = i.label.toLowerCase();
          let key = lbl;
          if (lbl.includes('público') || lbl.includes('publico')) key = 'publico';
          else if (lbl.includes('privado')) key = 'privado';
          else if (lbl.includes('ong') || lbl.includes('fundación') || lbl.includes('fundacion')) key = 'ong';
          else if (lbl.includes('academia')) key = 'academia';
          else if (lbl.includes('tp') || lbl.includes('comunidad') || lbl.includes('educación tp') || lbl.includes('edtp')) key = 'edtp';
          return { label: i.label, value: i.value, key };
        })
      : filteredSector;

    const conveniosTipo = apiTotalConveniosTipo?.items?.length
      ? apiTotalConveniosTipo.items.map(i => {
          const lbl = i.label.toLowerCase();
          const key = lbl.replace(/í/g, 'i').replace(/é/g, 'e').replace(/á/g, 'a').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').trim();
          return { label: i.label, value: i.value, key };
        })
      : filteredTipo;

    const conveniosResp = apiTotalConveniosResponsable?.items?.length
      ? apiTotalConveniosResponsable.items.map(i => ({ label: i.label, value: i.value }))
      : rawResponsable;

    return {
      'Año': totalConveniosAnio,
      'Sector': conveniosSector,
      'Tipo': conveniosTipo,
      'Responsable': conveniosResp
    };
  }, [selectedSectores, selectedTiposConvenio, selectedEstados, apiTotalConveniosSeries, apiConveniosSector, apiTotalConveniosTipo, apiTotalConveniosResponsable]);

  // --- DATASET SECCIÓN 3: Convenios por Sector ---
  const datasetsSec3 = useMemo(() => {
    let multiplier = 1.0;
    if (selectedSectores.length > 0) multiplier *= (selectedSectores.length / 5) * 1.1;
    if (selectedEstados.length > 0) multiplier *= (selectedEstados.length / 3) * 1.1;
    multiplier = Math.min(1.0, Math.max(0.15, multiplier));

    if (apiConveniosSector?.items?.length) {
      const mapped = apiConveniosSector.items.map(i => {
        const lbl = i.label.toLowerCase();
        let key = lbl;
        if (lbl.includes('público') || lbl.includes('publico')) key = 'publico';
        else if (lbl.includes('privado')) key = 'privado';
        else if (lbl.includes('ong') || lbl.includes('fundación') || lbl.includes('fundacion')) key = 'ong';
        else if (lbl.includes('academia')) key = 'academia';
        else if (lbl.includes('tp') || lbl.includes('comunidad') || lbl.includes('educación tp') || lbl.includes('edtp')) key = 'edtp';
        return {
          label: i.label,
          vigentes: i.value,
          cerrados: 0,
          total: i.value,
          key
        };
      });

      return selectedSectores.length > 0
        ? mapped.filter(d => selectedSectores.includes(d.key))
        : mapped;
    }

    const rawData = [
      { label: 'Público', vigentes: Math.round(12 * multiplier), cerrados: Math.round(3 * multiplier), total: Math.round(15 * multiplier), key: 'publico' },
      { label: 'Privado', vigentes: Math.round(18 * multiplier), cerrados: Math.round(2 * multiplier), total: Math.round(20 * multiplier), key: 'privado' },
      { label: 'ONG', vigentes: Math.round(7 * multiplier), cerrados: Math.round(1 * multiplier), total: Math.round(8 * multiplier), key: 'ong' },
      { label: 'Academia', vigentes: Math.round(11 * multiplier), cerrados: Math.round(1 * multiplier), total: Math.round(12 * multiplier), key: 'academia' },
      { label: 'Comunidad', vigentes: Math.round(5 * multiplier), cerrados: 0, total: Math.round(5 * multiplier), key: 'edtp' }
    ];

    const activeTotal = apiConveniosActivosSeries
      ? apiConveniosActivosSeries.reduce((sum, p) => sum + p.value, 0)
      : null;

    if (activeTotal !== null) {
      const filteredRaw = selectedSectores.length > 0
        ? rawData.filter(d => selectedSectores.includes(d.key))
        : rawData;
      const prep = filteredRaw.map(d => ({ ...d, value: d.vigentes }));
      const scaled = scaleAndAdjust(prep, activeTotal);
      return scaled.map(d => ({
        label: d.label,
        vigentes: d.value,
        cerrados: 0,
        total: d.value,
        key: d.key
      }));
    }

    return selectedSectores.length > 0
      ? rawData.filter(d => selectedSectores.includes(d.key))
      : rawData;
  }, [selectedSectores, selectedEstados, apiConveniosSector, apiConveniosActivosSeries]);

  // --- DATASET SECCIÓN 4: Actividades VcM ---
  const datasetsSec4 = useMemo(() => {
    let multiplier = 1.0;
    if (selectedLineas.length > 0) multiplier *= (selectedLineas.length / 6) * 1.1;
    if (selectedModalidades.length > 0) multiplier *= (selectedModalidades.length / 3) * 1.1;
    multiplier = Math.min(1.0, Math.max(0.15, multiplier));

    const rawLineas = [
      { label: 'Admisión y orientación', value: Math.round(10 * multiplier), key: 'admision' },
      { label: 'Articulación TP', value: Math.round(12 * multiplier), key: 'tp' },
      { label: 'Empleabilidad y prácticas', value: Math.round(8 * multiplier), key: 'empleabilidad' },
      { label: 'Transferencia disciplinar', value: Math.round(5 * multiplier), key: 'disciplinar' },
      { label: 'Certificación y competencias', value: Math.round(7 * multiplier), key: 'certificacion' },
      { label: 'Relacionamiento territorial', value: Math.round(6 * multiplier), key: 'territorial' }
    ];
    const filteredLineas = selectedLineas.length > 0
      ? rawLineas.filter(d => selectedLineas.includes(d.key))
      : rawLineas;

    const rawModalidad = [
      { label: 'Presencial', value: Math.round(28 * multiplier), key: 'presencial' },
      { label: 'Online sincrónica', value: Math.round(12 * multiplier), key: 'online' },
      { label: 'Híbrida', value: Math.round(8 * multiplier), key: 'hibrida' }
    ];
    const filteredModalidad = selectedModalidades.length > 0
      ? rawModalidad.filter(d => selectedModalidades.includes(d.key))
      : rawModalidad;

    const actividadesAnio = apiActividadesRealizadasSeries
      ? apiActividadesRealizadasSeries.map(p => ({ label: String(p.year ?? p.period ?? ''), value: p.value }))
      : [
          { label: '2022', value: Math.round(28 * multiplier) },
          { label: '2023', value: Math.round(36 * multiplier) },
          { label: '2024', value: Math.round(41 * multiplier) },
          { label: '2025', value: Math.round(48 * multiplier) }
        ];

    const actividadesLinea = apiActividadesLinea?.items?.length
      ? apiActividadesLinea.items.map(i => {
          let key = cleanKey(i.label);
          if (key.includes('articulacion tp') || key === 'tp') key = 'tp';
          return { label: i.label, value: i.value, key };
        })
      : filteredLineas;

    const actividadesModalidad = apiActividadesModalidad?.items?.length
      ? apiActividadesModalidad.items.map(i => {
          const lbl = i.label.toLowerCase();
          let key = lbl;
          if (lbl.includes('presencial')) key = 'presencial';
          else if (lbl.includes('online')) key = 'online';
          else if (lbl.includes('híbrida') || lbl.includes('hibrida')) key = 'hibrida';
          return { label: i.label, value: i.value, key };
        })
      : filteredModalidad;

    const actividadesTotal = apiActividadesRealizadasSeries
      ? apiActividadesRealizadasSeries.reduce((sum, p) => sum + p.value, 0)
      : null;

    const rawComuna = [
      { label: 'Santiago', value: Math.round(12 * multiplier) },
      { label: 'Providencia', value: Math.round(6 * multiplier) },
      { label: 'Las Condes', value: Math.round(5 * multiplier) },
      { label: 'La Florida', value: Math.round(4 * multiplier) }
    ];

    if (actividadesTotal !== null) {
      const factor = actividadesTotal / 5;
      const lineasScaled = apiActividadesLinea?.items?.length
        ? apiActividadesLinea.items.map(i => {
            let key = cleanKey(i.label);
            if (key.includes('articulacion tp') || key === 'tp') key = 'tp';
            return { label: i.label, value: i.value, key };
          })
        : scaleAndAdjust(rawLineas, actividadesTotal);

      const lineasFiltered = selectedLineas.length > 0
        ? lineasScaled.filter(d => selectedLineas.includes(d.key))
        : lineasScaled;

      const modalidadScaled = apiActividadesModalidad?.items?.length
        ? apiActividadesModalidad.items.map(i => {
            const lbl = i.label.toLowerCase();
            let key = lbl;
            if (lbl.includes('presencial')) key = 'presencial';
            else if (lbl.includes('online')) key = 'online';
            else if (lbl.includes('híbrida') || lbl.includes('hibrida')) key = 'hibrida';
            return { label: i.label, value: i.value, key };
          })
        : scaleAndAdjust(rawModalidad, actividadesTotal);

      const modalidadFiltered = selectedModalidades.length > 0
        ? modalidadScaled.filter(d => selectedModalidades.includes(d.key))
        : modalidadScaled;

      return {
        'Año': actividadesAnio,
        'Línea VcM': lineasFiltered,
        'Modalidad': modalidadFiltered,
        'Tipo de Actividad': apiActividadesTipo?.items?.length
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
          : [
              { label: 'Charla de orientación', months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, Math.round(1 * factor), 0] },
              { label: 'Feria vocacional', months: [0, 0, 0, 0, 0, 0, 0, 0, 0, Math.round(1 * factor), 0, 0] },
              { label: 'Seminario', months: [0, 0, 0, 0, Math.round(1 * factor), 0, 0, 0, 0, 0, 0, 0] },
              { label: 'Taller práctico', months: [0, 0, 0, 0, 0, Math.round(1 * factor), 0, 0, 0, 0, 0, 0] },
              { label: 'Operativo de asistencia', months: [0, 0, 0, 0, 0, 0, 0, 0, Math.round(1 * factor), 0, 0, 0] }
            ],
        'Comuna': apiActividadesComuna?.items?.length
          ? apiActividadesComuna.items.map(i => ({ label: i.label, value: i.value }))
          : scaleAndAdjust(rawComuna, actividadesTotal)
      };
    }

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
      : [
          { label: 'Charla de admisión', months: [0, 2, 1, 0, 0, 1, 2, 1, 0, 0, 0, 1].map(v => Math.round(v * multiplier)) },
          { label: 'Feria vocacional', months: [0, 1, 2, 1, 0, 0, 0, 1, 1, 0, 0, 0].map(v => Math.round(v * multiplier)) },
          { label: 'Visita colegio TP', months: [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0].map(v => Math.round(v * multiplier)) },
          { label: 'Taller SAP', months: [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0].map(v => Math.round(v * multiplier)) },
          { label: 'Taller Defontana', months: [0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0].map(v => Math.round(v * multiplier)) }
        ];

    const comunaList = apiActividadesComuna?.items?.length
      ? apiActividadesComuna.items.map(i => ({ label: i.label, value: i.value }))
      : rawComuna;

    return {
      'Año': actividadesAnio,
      'Línea VcM': actividadesLinea,
      'Modalidad': actividadesModalidad,
      'Tipo de Actividad': actividadesTipoList,
      'Comuna': comunaList
    };
  }, [selectedLineas, selectedModalidades, apiActividadesRealizadasSeries, apiActividadesLinea, apiActividadesModalidad, apiActividadesTipo, apiActividadesComuna]);

  // --- DATASET SECCIÓN 5: Participantes en actividades VcM ---
  const datasetsSec5 = useMemo(() => {
    let multiplier = 1.0;
    if (selectedLineas.length > 0) multiplier *= (selectedLineas.length / 6) * 1.1;
    if (selectedModalidades.length > 0) multiplier *= (selectedModalidades.length / 3) * 1.1;
    multiplier = Math.min(1.0, Math.max(0.15, multiplier));

    const participacionesAnio = apiParticipacionesSeries
      ? apiParticipacionesSeries.map(p => ({ label: String(p.year ?? p.period ?? ''), externo: p.value, interno: 0 }))
      : [
          { label: '2022', interno: Math.round(450 * multiplier), externo: Math.round(320 * multiplier) },
          { label: '2023', interno: Math.round(580 * multiplier), externo: Math.round(420 * multiplier) },
          { label: '2024', interno: Math.round(710 * multiplier), externo: Math.round(530 * multiplier) },
          { label: '2025', interno: Math.round(890 * multiplier), externo: Math.round(760 * multiplier) }
        ];

    const participacionesTipo = apiParticipacionesTipo?.items?.length
      ? apiParticipacionesTipo.items.map(i => ({ label: i.label, value: i.value }))
      : [
          { label: 'Estudiantes EMTP', value: Math.round(620 * multiplier) },
          { label: 'Docentes EMTP', value: Math.round(340 * multiplier) },
          { label: 'Empresas', value: Math.round(280 * multiplier) },
          { label: 'Titulados ECAS', value: Math.round(190 * multiplier) },
          { label: 'Estudiantes ECAS', value: Math.round(150 * multiplier) },
          { label: 'Apoderados', value: Math.round(45 * multiplier) },
          { label: 'Equipos directivos TP', value: Math.round(25 * multiplier) }
        ];

    const participacionesTotal = apiParticipacionesSeries
      ? apiParticipacionesSeries.reduce((sum, p) => sum + p.value, 0)
      : null;

    const rawSexo = [
      { label: 'Femenino', value: Math.round(860 * multiplier) },
      { label: 'Masculino', value: Math.round(720 * multiplier) },
      { label: 'No informado', value: Math.round(70 * multiplier) }
    ];

    const rawInstitucion = [
      { label: 'Liceo Industrial A-20', value: Math.round(180 * multiplier) },
      { label: 'Colegio Técnico Profesional', value: Math.round(145 * multiplier) },
      { label: 'Liceo Polivalente', value: Math.round(120 * multiplier) },
      { label: 'Instituto Comercial', value: Math.round(95 * multiplier) }
    ];

    const rawComunaPart = [
      { label: 'Santiago', value: Math.round(320 * multiplier) },
      { label: 'Providencia', value: Math.round(210 * multiplier) },
      { label: 'La Florida', value: Math.round(155 * multiplier) },
      { label: 'Maipú', value: Math.round(130 * multiplier) }
    ];

    if (participacionesTotal !== null) {
      const sexoScaled = apiParticipacionesSexo?.items?.length
        ? apiParticipacionesSexo.items.map(i => ({ label: i.label, value: i.value }))
        : scaleAndAdjust(rawSexo, participacionesTotal);

      const institucionScaled = apiParticipacionesInstitucion?.items?.length
        ? apiParticipacionesInstitucion.items.map(i => ({ label: i.label, value: i.value }))
        : scaleAndAdjust(rawInstitucion, participacionesTotal);

      return {
        'Año': participacionesAnio,
        'Público objetivo': participacionesTipo,
        'Sexo': sexoScaled,
        'Institución': institucionScaled,
        'Comuna': apiParticipacionesComuna?.items?.length
          ? apiParticipacionesComuna.items.map(i => ({ label: i.label, value: i.value }))
          : scaleAndAdjust(rawComunaPart, participacionesTotal)
      };
    }

    const sexoList = apiParticipacionesSexo?.items?.length
      ? apiParticipacionesSexo.items.map(i => ({ label: i.label, value: i.value }))
      : rawSexo;

    const institucionList = apiParticipacionesInstitucion?.items?.length
      ? apiParticipacionesInstitucion.items.map(i => ({ label: i.label, value: i.value }))
      : rawInstitucion;

    const comunaList = apiParticipacionesComuna?.items?.length
      ? apiParticipacionesComuna.items.map(i => ({ label: i.label, value: i.value }))
      : rawComunaPart;

    return {
      'Año': participacionesAnio,
      'Público objetivo': participacionesTipo,
      'Sexo': sexoList,
      'Institución': institucionList,
      'Comuna': comunaList
    };
  }, [selectedLineas, selectedModalidades, apiParticipacionesSeries, apiParticipacionesTipo, apiParticipacionesSexo, apiParticipacionesInstitucion, apiParticipacionesComuna]);

  // --- DATASET SECCIÓN 6: Articulaciones TP ejecutadas ---
  const datasetsSec6 = useMemo(() => {
    let multiplier = 1.0;
    if (selectedPlataformas.length > 0) multiplier *= (selectedPlataformas.length / 4) * 1.1;
    if (selectedTiposArticulacion.length > 0) multiplier *= (selectedTiposArticulacion.length / 6) * 1.1;
    multiplier = Math.min(1.0, Math.max(0.15, multiplier));

    const rawPlataforma = [
      { label: 'SAP', value: Math.round(12 * multiplier), key: 'sap' },
      { label: 'Defontana', value: Math.round(9 * multiplier), key: 'defontana' },
      { label: 'Excel aplicado', value: Math.round(8 * multiplier), key: 'excel' },
      { label: 'Power BI', value: Math.round(6 * multiplier), key: 'powerbi' }
    ];
    const filteredPlataforma = selectedPlataformas.length > 0
      ? rawPlataforma.filter(d => selectedPlataformas.includes(d.key))
      : rawPlataforma;

    const rawTipo = [
      { label: 'Taller práctico', value: Math.round(10 * multiplier), key: 'taller' },
      { label: 'Capacitación docente', value: Math.round(8 * multiplier), key: 'taller' },
      { label: 'Visita técnica', value: Math.round(6 * multiplier), key: 'visita' },
      { label: 'Charla especializada', value: Math.round(5 * multiplier), key: 'clase' },
      { label: 'Feria TP', value: Math.round(4 * multiplier), key: 'curricular' },
      { label: 'Mesa sectorial', value: Math.round(2 * multiplier), key: 'mesa' }
    ];
    const filteredTipo = selectedTiposArticulacion.length > 0
      ? rawTipo.filter(d => selectedTiposArticulacion.includes(d.key))
      : rawTipo;

    const articulacionesAnio = apiArticulacionesTPSeries
      ? apiArticulacionesTPSeries.map(p => ({ label: String(p.year ?? p.period ?? ''), value: p.value }))
      : [
          { label: '2022', value: Math.round(15 * multiplier) },
          { label: '2023', value: Math.round(22 * multiplier) },
          { label: '2024', value: Math.round(28 * multiplier) },
          { label: '2025', value: Math.round(35 * multiplier) }
        ];

    const rawEspecialidad = [
      { label: 'Administración', value: Math.round(10 * multiplier) },
      { label: 'Contabilidad', value: Math.round(8 * multiplier) },
      { label: 'Electricidad', value: Math.round(5 * multiplier) },
      { label: 'Mecánica Industrial', value: Math.round(4 * multiplier) }
    ];

    const rawColegio = [
      { label: 'Liceo Industrial A-20', value: Math.round(8 * multiplier) },
      { label: 'Colegio Técnico Profesional', value: Math.round(6 * multiplier) },
      { label: 'Liceo Polivalente', value: Math.round(5 * multiplier) }
    ];

    const articulacionesTotal = apiArticulacionesTPSeries
      ? apiArticulacionesTPSeries.reduce((sum, p) => sum + p.value, 0)
      : null;

    if (articulacionesTotal !== null) {
      const plataformaScaled = apiArticulacionesPlataforma?.items?.length
        ? apiArticulacionesPlataforma.items.map(i => {
            const lbl = i.label.toLowerCase();
            let key = lbl;
            if (lbl.includes('sap')) key = 'sap';
            else if (lbl.includes('defontana')) key = 'defontana';
            else if (lbl.includes('excel')) key = 'excel';
            else if (lbl.includes('power bi') || lbl.includes('powerbi')) key = 'powerbi';
            return { label: i.label, value: i.value, key };
          })
        : scaleAndAdjust(rawPlataforma, articulacionesTotal);

      const plataformaFiltered = selectedPlataformas.length > 0
        ? plataformaScaled.filter(d => selectedPlataformas.includes(d.key))
        : plataformaScaled;

      const tipoScaled = apiArticulacionesTipo?.items?.length
        ? apiArticulacionesTipo.items.map(i => {
            const lbl = i.label.toLowerCase();
            let key = lbl;
            if (lbl.includes('reconocimiento') || lbl.includes('aprendizajes')) key = 'reconocimiento';
            else if (lbl.includes('alternancia')) key = 'alternancia';
            else if (lbl.includes('taller')) key = 'taller';
            else if (lbl.includes('charla')) key = 'charla';
            else if (lbl.includes('feria')) key = 'curricular';
            else if (lbl.includes('mesa') || lbl.includes('sectorial')) key = 'mesa';
            return { label: i.label, value: i.value, key };
          })
        : scaleAndAdjust(rawTipo, articulacionesTotal);

      const tipoFiltered = selectedTiposArticulacion.length > 0
        ? tipoScaled.filter(d => selectedTiposArticulacion.includes(d.key))
        : tipoScaled;

      const colegioScaled = apiArticulacionesColegio?.items?.length
        ? apiArticulacionesColegio.items.map(i => ({ label: i.label, value: i.value }))
        : scaleAndAdjust(rawColegio, articulacionesTotal);

      return {
        'Año': articulacionesAnio,
        'Plataforma': plataformaFiltered,
        'Tipo': tipoFiltered,
        'Especialidad': scaleAndAdjust(rawEspecialidad, articulacionesTotal),
        'Colegio': colegioScaled
      };
    }

    const platList = apiArticulacionesPlataforma?.items?.length
      ? apiArticulacionesPlataforma.items.map(i => {
          const lbl = i.label.toLowerCase();
          let key = lbl;
          if (lbl.includes('sap')) key = 'sap';
          else if (lbl.includes('defontana')) key = 'defontana';
          else if (lbl.includes('excel')) key = 'excel';
          else if (lbl.includes('power bi') || lbl.includes('powerbi')) key = 'powerbi';
          return { label: i.label, value: i.value, key };
        })
      : filteredPlataforma;

    const tipoList = apiArticulacionesTipo?.items?.length
      ? apiArticulacionesTipo.items.map(i => {
          const lbl = i.label.toLowerCase();
          let key = lbl;
          if (lbl.includes('reconocimiento') || lbl.includes('aprendizajes')) key = 'reconocimiento';
          else if (lbl.includes('alternancia')) key = 'alternancia';
          else if (lbl.includes('taller')) key = 'taller';
          else if (lbl.includes('charla')) key = 'charla';
          else if (lbl.includes('feria')) key = 'curricular';
          else if (lbl.includes('mesa') || lbl.includes('sectorial')) key = 'mesa';
          return { label: i.label, value: i.value, key };
        })
      : filteredTipo;

    const colegioList = apiArticulacionesColegio?.items?.length
      ? apiArticulacionesColegio.items.map(i => ({ label: i.label, value: i.value }))
      : rawColegio;

    return {
      'Año': articulacionesAnio,
      'Plataforma': platList,
      'Tipo': tipoList,
      'Especialidad': rawEspecialidad,
      'Colegio': colegioList
    };
  }, [selectedPlataformas, selectedTiposArticulacion, apiArticulacionesTPSeries, apiArticulacionesPlataforma, apiArticulacionesTipo, apiArticulacionesColegio]);

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
    apiError,
    hasRealData,
    apiConveniosActivosSeries,
    apiTotalConveniosSeries,
    apiActividadesRealizadasSeries,
    apiParticipacionesSeries,
    apiArticulacionesTPSeries,
    apiPerfilMap,
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
    filteredNominalGroup1: [],
    filteredNominalGroup2: [],
    filteredCohorteData: [],
    filteredRetencionData: [],
    filteredProgramasData,
    ofertaChartData,
    dictadosSummaryData,
    effectiveDictadosSeries: uniqueParticipantsData.points.map(p => ({ x: p.x, y: Math.round(p.y / 20) })),
    effectiveEjecucionSeries: uniqueParticipantsData.points.map(p => ({ x: p.x, y: 92 })),
    kpiStats,
    kpiCardsData,
    uniqueParticipantsData,
    filteredUniqueParticipantsLocal: uniqueParticipantsData.points,
    uniqueParticipantsAgeDist: uniqueParticipantsData.ageDist,
    recurrenceFreqDist,
    uniqueParticipantsTotal: kpiStats.participantes.val,
    recurrenciaStats: { total: kpiStats.participantes.val, recurrentes: Math.round(kpiStats.participantes.val * 0.3) }
  };
};
