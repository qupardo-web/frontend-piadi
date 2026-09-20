import { useState, useMemo, useEffect, useCallback } from 'react';
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
  '#171796', '#5151CC', '#8181DE', '#8A4BD6', '#C24BC9', '#3E8FD9', '#2FB8A6', '#E0A63B'
];

export const RAMP_COLORS = [
  '#171796', '#3E50B4', '#667ACF', '#8F9FE0', '#B4B4EC'
];

export const INDICATORS = {
  'matricula-total': {
    title: 'Matrícula total por período',
    desc: 'Matrícula total de la carrera Contador Auditor al cierre de cada período, desagregada por semestre. Se calcula sumando los estudiantes matriculados en Semestre 1 y Semestre 2 de cada año.',
    metric: { label: 'Matrícula total 2026', value: 980 },
    trend: { delta: 70, baseline: '2025', isPositive: true },
    rows: [['2023', 800], ['2024', 850], ['2025', 910], ['2026', 980]],
    colLabels: ['Período', 'Matrícula'],
    state: 'data'
  },
  'nuevos-antiguos': {
    title: 'Matrícula nuevos vs antiguos',
    desc: 'Comparación entre estudiantes que ingresan por primera vez (nuevos) y estudiantes que continúan (antiguos) en cada período.',
    metric: { label: 'Estudiantes nuevos 2026', value: 340 },
    trend: { delta: 20, baseline: '2025', isPositive: true },
    rows: [['2023', 280], ['2024', 300], ['2025', 320], ['2026', 340]],
    colLabels: ['Período', 'Nuevos'],
    state: 'data'
  },
  'via-acceso-kpi': {
    title: 'Vía de acceso principal',
    desc: 'Mecanismo por el cual el estudiante ingresó a la carrera. PAES corresponde a la vía de ingreso regular mayoritaria.',
    metric: { label: 'Ingreso regular PAES', value: 610 },
    trend: { delta: 35, baseline: '2025', isPositive: true },
    rows: [['PAES', 610], ['Admisión especial', 180], ['Traspaso', 120], ['Continuidad', 70]],
    colLabels: ['Vía de acceso', 'Estudiantes'],
    state: 'data'
  },
  'matricula-asignatura': {
    title: 'Matrícula por asignatura',
    desc: 'Número de estudiantes inscritos en cada asignatura del plan de estudios. Ordenado de mayor a menor matrícula.',
    metric: { label: 'Asignaturas con matrícula', value: 7 },
    rows: [['Contabilidad I', 180], ['Contabilidad II', 160], ['Auditoría', 150], ['Tributación', 130], ['Costos', 120], ['Derecho Tributario', 100], ['Finanzas', 90]],
    colLabels: ['Asignatura', 'Estudiantes'],
    state: 'data'
  },
  'matricula-seccion': {
    title: 'Matrícula por sección',
    desc: 'Distribución de estudiantes por sección de la carrera. Permite dimensionar el tamaño de cada grupo-curso.',
    metric: { label: 'Secciones activas', value: 6 },
    rows: [['Sección A', 45], ['Sección B', 42], ['Sección C', 40], ['Sección D', 38], ['Sección E', 35], ['Sección F', 30]],
    colLabels: ['Sección', 'Estudiantes'],
    state: 'data'
  },
  'estado-academico': {
    title: 'Matrícula por estado académico',
    desc: 'Clasificación de los estudiantes según su situación académica vigente al cierre del período.',
    metric: { label: 'Estudiantes regulares', value: 820 },
    rows: [['Regular', 820], ['En riesgo', 110], ['Suspendido', 30], ['Egresado', 20]],
    colLabels: ['Estado', 'Estudiantes'],
    state: 'data'
  },
  'nivel-socioeconomico': {
    title: 'Nivel socioeconómico (quintiles)',
    desc: 'Distribución de estudiantes según quintil de ingreso del hogar, estimado a partir de la ficha socioeconómica de admisión.',
    metric: { label: 'Estudiantes caracterizados', value: 980 },
    rows: [['Quintil I', 120], ['Quintil II', 180], ['Quintil III', 260], ['Quintil IV', 240], ['Quintil V', 180]],
    colLabels: ['Quintil', 'Estudiantes'],
    state: 'data'
  },
  'situacion-familiar': {
    title: 'Situación familiar',
    desc: 'Composición del hogar declarada por el estudiante al momento de la matrícula.',
    metric: { label: 'Estudiantes', value: 980 },
    rows: [['Ambos padres', 380], ['Solo madre', 320], ['Solo padre', 140], ['Otro familiar', 90], ['Independiente', 50]],
    colLabels: ['Situación', 'Estudiantes'],
    state: 'data'
  },
  'procedencia-geografica': {
    title: 'Procedencia geográfica',
    desc: 'Región de origen de los estudiantes matriculados. Se muestra el ranking de regiones con mayor matrícula.',
    metric: { label: 'Regiones representadas', value: 6 },
    rows: [['Metropolitana', 420], ['Valparaíso', 180], ['Biobío', 150], ['Maule', 90], ['Coquimbo', 70], ["O'Higgins", 70]],
    colLabels: ['Región', 'Estudiantes'],
    state: 'data'
  },
  'tipo-colegio': {
    title: 'Tipo de colegio',
    desc: 'Dependencia administrativa del establecimiento de educación media de origen.',
    metric: { label: 'Estudiantes', value: 980 },
    rows: [['Municipal', 380], ['Subvencionado', 420], ['Particular', 180]],
    colLabels: ['Tipo de colegio', 'Estudiantes'],
    state: 'data'
  },
  'via-acceso': {
    title: 'Vía de acceso',
    desc: 'Mecanismo por el cual el estudiante ingresó a la carrera. PAES corresponde a la admisión regular.',
    metric: { label: 'Ingreso vía PAES', value: 610 },
    rows: [['PAES', 610], ['Admisión especial', 180], ['Traspaso', 120], ['Continuidad', 70]],
    colLabels: ['Vía de acceso', 'Estudiantes'],
    state: 'data'
  },
  'beneficios-becas': {
    title: 'Beneficios y becas',
    desc: 'Tipo de beneficio estudiantil asignado al momento de la matrícula (gratuidad, beca interna o sin beneficio).',
    metric: { label: 'Estudiantes con beneficio', value: 530 },
    rows: [['Gratuidad', 380], ['Beca interna', 150], ['Sin beneficio', 450]],
    colLabels: ['Beneficio', 'Estudiantes'],
    state: 'data'
  },
  'distribucion-sexo': {
    title: 'Distribución por sexo',
    desc: 'Composición de la matrícula según sexo registrado.',
    metric: { label: 'Matrícula femenina', value: 560 },
    rows: [['Femenino', 560], ['Masculino', 420]],
    colLabels: ['Sexo', 'Estudiantes'],
    state: 'data'
  },
  'distribucion-edad': {
    title: 'Distribución por edad',
    desc: 'Distribución de estudiantes por rango de edad al momento de la matrícula.',
    metric: { label: 'Estudiantes', value: 980 },
    rows: [['17–18', 180], ['19–20', 320], ['21–22', 260], ['23–25', 140], ['26+', 80]],
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

  // Drawer de Detalle del indicador
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentIndicatorKey, setCurrentIndicatorKey] = useState('matricula-total');
  const [drawerPeriod, setDrawerPeriod] = useState('all');
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Estados de API
  const [apiLoading, setApiLoading] = useState(false);
  const [apiFilters, setApiFilters] = useState(null);
  const [apiDataAvailable, setApiDataAvailable] = useState(false);

  // Carga inicial de filtros
  useEffect(() => {
    getDepartmentFilters('admision')
      .then(res => {
        if (res?.data?.filters) {
          setApiFilters(res.data.filters);
          const years = res.data.filters.years ?? [];
          if (years.length > 0) {
            setYearRange([Math.min(...years), Math.max(...years)]);
          }
        }
      })
      .catch(() => {
        // Fallback sin error ruidoso
      });
  }, []);

  // Fetch de datos del dashboard desde la API con fallback simulado
  useEffect(() => {
    setApiLoading(true);
    const params = {
      department: 'admision',
      fromYear: String(yearRange[0]),
      toYear: String(yearRange[1]),
    };
    if (yearRange[0] === yearRange[1]) {
      params.year = String(yearRange[0]);
      delete params.fromYear;
      delete params.toYear;
    }

    getDashboardSummary(params)
      .then(res => {
        if (res?.data) {
          setApiDataAvailable(true);
        }
      })
      .catch(() => {
        // Backend no tiene aún el endpoint de admision configurado, usamos dataset reactivo
        setApiDataAvailable(false);
      })
      .finally(() => {
        setApiLoading(false);
      });
  }, [yearRange, selectedChips]);

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
    setYearRange([2023, 2026]);
  }, []);

  // Helper para detectar si las filas del indicador son por año simple
  const isSimpleYearRows = useCallback((ind) => {
    return ind?.rows && ind.rows.length > 0 && ind.rows.every(r => /^\d{4}$/.test(String(r[0])));
  }, []);

  // Drawer handlers
  const handleOpenIndicator = useCallback((key) => {
    setCurrentIndicatorKey(key);
    setDrawerPeriod('all');
    setDrawerLoading(true);
    setDrawerOpen(true);
    setTimeout(() => {
      setDrawerLoading(false);
    }, 200);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  const handleDrawerPeriodChange = useCallback((val) => {
    setDrawerPeriod(val);
  }, []);

  // Años visibles según el slider
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

  // Factor de escala dinámico según filtros seleccionados para simular reactividad perfecta
  const filterFactor = useMemo(() => {
    let factor = 1.0;
    if (selectedChips.semestre.length === 1) factor *= 0.52;
    if (selectedChips.estado.length > 0) factor *= (selectedChips.estado.length / 3);
    if (selectedChips.colegio.length > 0) factor *= (selectedChips.colegio.length / 3);
    if (selectedChips.via.length > 0) factor *= (selectedChips.via.length / 4);
    if (selectedChips.sexo.length === 1) factor *= 0.55;
    if (selectedChips.nse.length > 0) factor *= (selectedChips.nse.length / 5);
    return Math.max(0.2, Math.min(1.0, factor));
  }, [selectedChips]);

  // 1. Matrícula total por período (Semestre 1 / Semestre 2)
  const matTotalData = useMemo(() => {
    const raw = [
      { year: 2023, s1: 420, s2: 380 },
      { year: 2024, s1: 450, s2: 400 },
      { year: 2025, s1: 480, s2: 430 },
      { year: 2026, s1: 520, s2: 460 }
    ];
    return visibleYears.map(y => {
      const row = raw.find(r => r.year === y) || { year: y, s1: 400, s2: 360 };
      const hasS1 = selectedChips.semestre.length === 0 || selectedChips.semestre.includes('1');
      const hasS2 = selectedChips.semestre.length === 0 || selectedChips.semestre.includes('2');
      return {
        year: y,
        s1: hasS1 ? Math.round(row.s1 * filterFactor) : 0,
        s2: hasS2 ? Math.round(row.s2 * filterFactor) : 0
      };
    });
  }, [visibleYears, selectedChips.semestre, filterFactor]);

  // 2. Matrícula nuevos vs antiguos
  const matNuevosData = useMemo(() => {
    const raw = [
      { year: 2023, nuevos: 280, antiguos: 520 },
      { year: 2024, nuevos: 300, antiguos: 550 },
      { year: 2025, nuevos: 320, antiguos: 590 },
      { year: 2026, nuevos: 340, antiguos: 640 }
    ];
    return visibleYears.map(y => {
      const row = raw.find(r => r.year === y) || { year: y, nuevos: 250, antiguos: 500 };
      return {
        year: y,
        nuevos: Math.round(row.nuevos * filterFactor),
        antiguos: Math.round(row.antiguos * filterFactor)
      };
    });
  }, [visibleYears, filterFactor]);

  // 3. Matrícula por asignatura
  const matAsignaturaData = useMemo(() => {
    const raw = [
      { label: 'Contabilidad I', value: 180 },
      { label: 'Contabilidad II', value: 160 },
      { label: 'Auditoría', value: 150 },
      { label: 'Tributación', value: 130 },
      { label: 'Costos', value: 120 },
      { label: 'Derecho Tributario', value: 100 },
      { label: 'Finanzas', value: 90 }
    ];
    return raw.map(d => ({ ...d, value: Math.round(d.value * filterFactor) }));
  }, [filterFactor]);

  // 4. Matrícula por sección
  const matSeccionData = useMemo(() => {
    const raw = [
      { label: 'Sección A', value: 45 },
      { label: 'Sección B', value: 42 },
      { label: 'Sección C', value: 40 },
      { label: 'Sección D', value: 38 },
      { label: 'Sección E', value: 35 },
      { label: 'Sección F', value: 30 }
    ];
    return raw.map(d => ({ ...d, value: Math.round(d.value * filterFactor) }));
  }, [filterFactor]);

  // 5. Matrícula por estado académico
  const matEstadoData = useMemo(() => {
    const raw = [
      { label: 'Regular', value: 820 },
      { label: 'En riesgo', value: 110 },
      { label: 'Suspendido', value: 30 },
      { label: 'Egresado', value: 20 }
    ];
    let filtered = raw;
    if (selectedChips.estado.length > 0) {
      filtered = raw.filter(d => 
        selectedChips.estado.some(e => d.label.toLowerCase().includes(e.toLowerCase()))
      );
    }
    return filtered.map(d => ({ ...d, value: Math.round(d.value * filterFactor) }));
  }, [selectedChips.estado, filterFactor]);

  // 6. Nivel socioeconómico (quintiles)
  const carNseData = useMemo(() => {
    const raw = [
      { label: 'Quintil I', value: 120 },
      { label: 'Quintil II', value: 180 },
      { label: 'Quintil III', value: 260 },
      { label: 'Quintil IV', value: 240 },
      { label: 'Quintil V', value: 180 }
    ];
    let filtered = raw;
    if (selectedChips.nse.length > 0) {
      filtered = raw.filter(d => 
        selectedChips.nse.some(n => d.label.toLowerCase().includes(n.toLowerCase()))
      );
    }
    return filtered.map(d => ({ ...d, value: Math.round(d.value * filterFactor) }));
  }, [selectedChips.nse, filterFactor]);

  // 7. Situación familiar
  const carFamiliarData = useMemo(() => {
    const raw = [
      { label: 'Ambos padres', value: 380 },
      { label: 'Solo madre', value: 320 },
      { label: 'Solo padre', value: 140 },
      { label: 'Otro familiar', value: 90 },
      { label: 'Independiente', value: 50 }
    ];
    return raw.map(d => ({ ...d, value: Math.round(d.value * filterFactor) }));
  }, [filterFactor]);

  // 8. Procedencia geográfica
  const carRegionData = useMemo(() => {
    const raw = [
      { label: 'Metropolitana', value: 420 },
      { label: 'Valparaíso', value: 180 },
      { label: 'Biobío', value: 150 },
      { label: 'Maule', value: 90 },
      { label: 'Coquimbo', value: 70 },
      { label: "O'Higgins", value: 70 }
    ];
    return raw.map(d => ({ ...d, value: Math.round(d.value * filterFactor) }));
  }, [filterFactor]);

  // 9. Tipo de colegio
  const carColegioData = useMemo(() => {
    const raw = [
      { label: 'Municipal', value: 380 },
      { label: 'Subvencionado', value: 420 },
      { label: 'Particular', value: 180 }
    ];
    let filtered = raw;
    if (selectedChips.colegio.length > 0) {
      filtered = raw.filter(d => 
        selectedChips.colegio.some(c => d.label.toLowerCase().includes(c.toLowerCase()))
      );
    }
    return filtered.map(d => ({ ...d, value: Math.round(d.value * filterFactor) }));
  }, [selectedChips.colegio, filterFactor]);

  // 10. Vía de acceso
  const carViaData = useMemo(() => {
    const raw = [
      { label: 'PAES', value: 610 },
      { label: 'Admisión especial', value: 180 },
      { label: 'Traspaso', value: 120 },
      { label: 'Continuidad', value: 70 }
    ];
    let filtered = raw;
    if (selectedChips.via.length > 0) {
      filtered = raw.filter(d => 
        selectedChips.via.some(v => d.label.toLowerCase().includes(v.toLowerCase()))
      );
    }
    return filtered.map(d => ({ ...d, value: Math.round(d.value * filterFactor) }));
  }, [selectedChips.via, filterFactor]);

  // 11. Beneficios y becas
  const carBecasData = useMemo(() => {
    const raw = [
      { label: 'Gratuidad', value: 380 },
      { label: 'Beca interna', value: 150 },
      { label: 'Sin beneficio', value: 450 }
    ];
    return raw.map(d => ({ ...d, value: Math.round(d.value * filterFactor) }));
  }, [filterFactor]);

  // 12. Distribución por sexo
  const carSexoData = useMemo(() => {
    const raw = [
      { label: 'Femenino', value: 560 },
      { label: 'Masculino', value: 420 }
    ];
    let filtered = raw;
    if (selectedChips.sexo.length > 0) {
      filtered = raw.filter(d => 
        selectedChips.sexo.some(s => d.label.toLowerCase().startsWith(s.toLowerCase()))
      );
    }
    return filtered.map(d => ({ ...d, value: Math.round(d.value * filterFactor) }));
  }, [selectedChips.sexo, filterFactor]);

  // 13. Distribución por edad
  const carEdadData = useMemo(() => {
    const raw = [
      { label: '17–18', value: 180 },
      { label: '19–20', value: 320 },
      { label: '21–22', value: 260 },
      { label: '23–25', value: 140 },
      { label: '26+', value: 80 }
    ];
    return raw.map(d => ({ ...d, value: Math.round(d.value * filterFactor) }));
  }, [filterFactor]);

  // KPIs calculados
  const kpis = useMemo(() => {
    const currentYear = yearRange[1];
    const prevYear = currentYear - 1;
    
    // Matrícula total
    const latestRow = matTotalData[matTotalData.length - 1] || { s1: 520, s2: 460 };
    const latestTotal = latestRow.s1 + latestRow.s2;
    const prevRow = matTotalData.find(r => r.year === prevYear) || { s1: 480, s2: 430 };
    const prevTotal = prevRow.s1 + prevRow.s2;
    const matEvo = prevTotal > 0 ? (((latestTotal - prevTotal) / prevTotal) * 100).toFixed(1) : '+7.7';

    // Nuevos vs antiguos
    const latestNuevosRow = matNuevosData[matNuevosData.length - 1] || { nuevos: 340, antiguos: 640 };
    const totalEst = latestNuevosRow.nuevos + latestNuevosRow.antiguos;
    const pctNuevos = totalEst > 0 ? ((latestNuevosRow.nuevos / totalEst) * 100).toFixed(1) : '34.7';

    // Vía de acceso
    const paesItem = carViaData.find(v => v.label.toUpperCase() === 'PAES') || { value: 610 };
    const totalVia = carViaData.reduce((acc, v) => acc + v.value, 0) || 980;
    const pctPaes = totalVia > 0 ? ((paesItem.value / totalVia) * 100).toFixed(1) : '62.2';

    return {
      matriculaTotal: {
        val: latestTotal,
        compareText: `vs período anterior (${prevYear}): ${prevTotal}`,
        evo: Number(matEvo) >= 0 ? `+${matEvo}%` : `${matEvo}%`,
        isPositive: Number(matEvo) >= 0
      },
      nuevosAntiguos: {
        val: `${pctNuevos}%`,
        compareText: `nuevos (${latestNuevosRow.nuevos}) sobre matrícula total (${totalEst})`,
        evo: null,
        isPositive: true
      },
      viaAcceso: {
        val: 'PAES',
        compareText: `${paesItem.value} de ${totalVia} estudiantes (${pctPaes}%)`,
        evo: `+${pctPaes}%`,
        isPositive: true
      }
    };
  }, [matTotalData, matNuevosData, carViaData, yearRange]);

  // Determinar si hay datos disponibles
  const hasData = useMemo(() => {
    return matTotalData.some(d => (d.s1 + d.s2) > 0);
  }, [matTotalData]);

  // Indicador actual para el Drawer
  const currentIndicator = useMemo(() => {
    return INDICATORS[currentIndicatorKey] || INDICATORS['matricula-total'];
  }, [currentIndicatorKey]);

  // Filas a mostrar en la tabla según el período seleccionado
  const displayRows = useMemo(() => {
    if (!currentIndicator || !currentIndicator.rows) return [];
    if (drawerPeriod === 'all' || !isSimpleYearRows(currentIndicator)) {
      return currentIndicator.rows;
    }
    const filtered = currentIndicator.rows.filter(r => String(r[0]) === drawerPeriod);
    return filtered.length > 0 ? filtered : currentIndicator.rows;
  }, [currentIndicator, drawerPeriod, isSimpleYearRows]);

  // Texto descriptivo del período para el footer del drawer
  const drawerPeriodText = useMemo(() => {
    return drawerPeriod === 'all' ? 'Años: 2023 a 2026' : `Año: ${drawerPeriod}`;
  }, [drawerPeriod]);

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
    displayRows,
    drawerPeriodText,
    YEARS,
    drawerLoading,
    handleOpenIndicator,
    handleCloseDrawer,
    faqData,
    apiLoading,
    hasData,
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
    carEdadData
  };
};
