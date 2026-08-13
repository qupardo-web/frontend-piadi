import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { Calendar, Users, Briefcase, Award } from 'lucide-react';

export const SEMESTRES_LIST = ['Primer semestre', 'Segundo semestre'];
export const SEXO_LIST = ['Femenino', 'Masculino', 'No binario', 'Prefiere no responder'];
export const MESES_LIST = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const TIPOS_LIST = ['Charla', 'Taller', 'Seminario', 'Proyecto Social', 'Asistencia TÃ©cnica', 'Operativo Comunitario'];
export const MODALIDADES_LIST = ['Presencial', 'Online', 'Semipresencial', 'HÃ­brida'];
export const AREAS_LIST = ['Social-Comunitaria', 'Productiva-Empresarial', 'Cultural-ArtÃ­stica', 'Medioambiental', 'Titulados y Empleabilidad'];

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
  const dynamicTipos = TIPOS_LIST;
  const dynamicModalidades = MODALIDADES_LIST;
  const dynamicSemestres = SEMESTRES_LIST;

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
  const kpiCardsData = useMemo(() => [
    {
      key: 'convenios_vigentes',
      title: 'Total de convenios vigentes',
      value: kpiStats.conveniosVigentes.val,
      baseVal: kpiStats.conveniosVigentes.baseVal,
      evolution: kpiStats.conveniosVigentes.evolution,
      isPositive: kpiStats.conveniosVigentes.isPositive,
      icon: Award,
      color: '#E27800',
    },
    {
      key: 'nuevos_convenios',
      title: 'Nuevos convenios firmados',
      value: kpiStats.nuevosConvenios.val,
      baseVal: kpiStats.nuevosConvenios.baseVal,
      evolution: kpiStats.nuevosConvenios.evolution,
      isPositive: kpiStats.nuevosConvenios.isPositive,
      icon: Briefcase,
      color: '#2196F3',
    },
    {
      key: 'total_participantes',
      title: 'Total de participantes VcM',
      value: kpiStats.participantes.val.toLocaleString('es-CL'),
      baseVal: kpiStats.participantes.baseVal.toLocaleString('es-CL'),
      evolution: kpiStats.participantes.evolution,
      isPositive: kpiStats.participantes.isPositive,
      icon: Users,
      color: '#4CAF50',
    }
  ], [kpiStats]);

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

    return {
      'Año': [
        { label: '2023', value: Math.round(12 * multiplier) },
        { label: '2024', value: Math.round(18 * multiplier) },
        { label: '2025', value: Math.round(15 * multiplier) },
        { label: '2026', value: Math.round(22 * multiplier) }
      ],
      'Sector': filteredSector,
      'Tipo': filteredTipo,
      'Contraparte': [
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
      ],
      'Área vinculada': [
        { label: 'Ingeniería', value: Math.round(14 * multiplier) },
        { label: 'Salud', value: Math.round(10 * multiplier) },
        { label: 'Educación', value: Math.round(18 * multiplier) },
        { label: 'Social', value: Math.round(13 * multiplier) },
        { label: 'Ambiental', value: Math.round(6 * multiplier) }
      ]
    };
  }, [selectedSectores, selectedTiposConvenio, selectedEstados]);

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

    return {
      'Año': [
        { label: '2023', value: Math.round(48 * multiplier) },
        { label: '2024', value: Math.round(55 * multiplier) },
        { label: '2025', value: Math.round(62 * multiplier) },
        { label: '2026', value: Math.round(67 * multiplier) }
      ],
      'Sector': filteredSector,
      'Tipo': filteredTipo,
      'Responsable': [
        { label: 'Dir. Vinculación', value: Math.round(18 * multiplier) },
        { label: 'Fac. Ingeniería', value: Math.round(14 * multiplier) },
        { label: 'Fac. Salud', value: Math.round(10 * multiplier) },
        { label: 'Fac. Educación', value: Math.round(10 * multiplier) },
        { label: 'Otras unidades', value: Math.round(5 * multiplier) }
      ]
    };
  }, [selectedSectores, selectedTiposConvenio, selectedEstados]);

  // --- DATASET SECCIÓN 3: Convenios por Sector ---
  const datasetsSec3 = useMemo(() => {
    let multiplier = 1.0;
    if (selectedSectores.length > 0) multiplier *= (selectedSectores.length / 5) * 1.1;
    if (selectedEstados.length > 0) multiplier *= (selectedEstados.length / 3) * 1.1;
    multiplier = Math.min(1.0, Math.max(0.15, multiplier));

    const rawData = [
      { label: 'Público', vigentes: Math.round(12 * multiplier), cerrados: Math.round(3 * multiplier), total: Math.round(15 * multiplier), key: 'publico' },
      { label: 'Privado', vigentes: Math.round(18 * multiplier), cerrados: Math.round(2 * multiplier), total: Math.round(20 * multiplier), key: 'privado' },
      { label: 'ONG', vigentes: Math.round(7 * multiplier), cerrados: Math.round(1 * multiplier), total: Math.round(8 * multiplier), key: 'ong' },
      { label: 'Academia', vigentes: Math.round(11 * multiplier), cerrados: Math.round(1 * multiplier), total: Math.round(12 * multiplier), key: 'academia' },
      { label: 'Comunidad', vigentes: Math.round(5 * multiplier), cerrados: 0, total: Math.round(5 * multiplier), key: 'edtp' }
    ];
    return selectedSectores.length > 0
      ? rawData.filter(d => selectedSectores.includes(d.key))
      : rawData;
  }, [selectedSectores, selectedEstados]);

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

    return {
      'Año': [
        { label: '2022', value: Math.round(28 * multiplier) },
        { label: '2023', value: Math.round(36 * multiplier) },
        { label: '2024', value: Math.round(41 * multiplier) },
        { label: '2025', value: Math.round(48 * multiplier) }
      ],
      'Línea VcM': filteredLineas,
      'Modalidad': filteredModalidad,
      'Tipo de Actividad': [
        { label: 'Charla de admisión', months: [0, 2, 1, 0, 0, 1, 2, 1, 0, 0, 0, 1].map(v => Math.round(v * multiplier)) },
        { label: 'Feria vocacional', months: [0, 1, 2, 1, 0, 0, 0, 1, 1, 0, 0, 0].map(v => Math.round(v * multiplier)) },
        { label: 'Visita colegio TP', months: [1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0].map(v => Math.round(v * multiplier)) },
        { label: 'Taller SAP', months: [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0].map(v => Math.round(v * multiplier)) },
        { label: 'Taller Defontana', months: [0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0].map(v => Math.round(v * multiplier)) }
      ],
      'Comuna': [
        { label: 'Santiago', value: Math.round(12 * multiplier) },
        { label: 'Providencia', value: Math.round(6 * multiplier) },
        { label: 'Las Condes', value: Math.round(5 * multiplier) },
        { label: 'La Florida', value: Math.round(4 * multiplier) }
      ]
    };
  }, [selectedLineas, selectedModalidades]);

  // --- DATASET SECCIÓN 5: Participantes en actividades VcM ---
  const datasetsSec5 = useMemo(() => {
    let multiplier = 1.0;
    if (selectedLineas.length > 0) multiplier *= (selectedLineas.length / 6) * 1.1;
    if (selectedModalidades.length > 0) multiplier *= (selectedModalidades.length / 3) * 1.1;
    multiplier = Math.min(1.0, Math.max(0.15, multiplier));

    return {
      'Año': [
        { label: '2022', interno: Math.round(450 * multiplier), externo: Math.round(320 * multiplier) },
        { label: '2023', interno: Math.round(580 * multiplier), externo: Math.round(420 * multiplier) },
        { label: '2024', interno: Math.round(710 * multiplier), externo: Math.round(530 * multiplier) },
        { label: '2025', interno: Math.round(890 * multiplier), externo: Math.round(760 * multiplier) }
      ],
      'Público objetivo': [
        { label: 'Estudiantes EMTP', value: Math.round(620 * multiplier) },
        { label: 'Docentes EMTP', value: Math.round(340 * multiplier) },
        { label: 'Empresas', value: Math.round(280 * multiplier) },
        { label: 'Titulados ECAS', value: Math.round(190 * multiplier) },
        { label: 'Estudiantes ECAS', value: Math.round(150 * multiplier) },
        { label: 'Apoderados', value: Math.round(45 * multiplier) },
        { label: 'Equipos directivos TP', value: Math.round(25 * multiplier) }
      ],
      'Sexo': [
        { label: 'Femenino', value: Math.round(860 * multiplier) },
        { label: 'Masculino', value: Math.round(720 * multiplier) },
        { label: 'No informado', value: Math.round(70 * multiplier) }
      ],
      'Institución': [
        { label: 'Liceo Industrial A-20', value: Math.round(180 * multiplier) },
        { label: 'Colegio Técnico Profesional', value: Math.round(145 * multiplier) },
        { label: 'Liceo Polivalente', value: Math.round(120 * multiplier) },
        { label: 'Instituto Comercial', value: Math.round(95 * multiplier) }
      ],
      'Comuna': [
        { label: 'Santiago', value: Math.round(320 * multiplier) },
        { label: 'Providencia', value: Math.round(210 * multiplier) },
        { label: 'La Florida', value: Math.round(155 * multiplier) },
        { label: 'Maipú', value: Math.round(130 * multiplier) }
      ]
    };
  }, [selectedLineas, selectedModalidades]);

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

    return {
      'Año': [
        { label: '2022', value: Math.round(15 * multiplier) },
        { label: '2023', value: Math.round(22 * multiplier) },
        { label: '2024', value: Math.round(28 * multiplier) },
        { label: '2025', value: Math.round(35 * multiplier) }
      ],
      'Plataforma': filteredPlataforma,
      'Tipo': filteredTipo,
      'Especialidad': [
        { label: 'Administración', value: Math.round(10 * multiplier) },
        { label: 'Contabilidad', value: Math.round(8 * multiplier) },
        { label: 'Electricidad', value: Math.round(5 * multiplier) },
        { label: 'Mecánica Industrial', value: Math.round(4 * multiplier) }
      ],
      'Colegio': [
        { label: 'Liceo Industrial A-20', value: Math.round(8 * multiplier) },
        { label: 'Colegio Técnico Profesional', value: Math.round(6 * multiplier) },
        { label: 'Liceo Polivalente', value: Math.round(5 * multiplier) }
      ]
    };
  }, [selectedPlataformas, selectedTiposArticulacion]);

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
    apiSummary: null,
    apiLoading: false,
    apiOfertaSeries: null,
    apiDictadosSeries: null,
    apiEjecucionSeries: null,
    apiTasaAprobacionBreakdown: null,
    apiParticipantesSeries: null,
    apiParticipantesBreakdown: null,
    apiRecurrenciaSeries: null,
    apiIngresosBreakdown: null,
    apiMatriculaBreakdown: null,
    apiRecurrenciaBreakdown: null,
    apiPerfilMap,
    apiMatriculaSeries: null,
    apiIngresosSeries: null,
    apiOfertaByYear: {},
    apiIngresosByYear: {},
    apiMatriculaByYear: {},
    dynamicAreas,
    dynamicTipos,
    dynamicModalidades,
    dynamicSemestres,
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
