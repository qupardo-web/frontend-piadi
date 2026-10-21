import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';

export const YEARS = [2023, 2024, 2025, 2026];

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
  const [openHelpDialog, setOpenHelpDialog] = useState(false);

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

  const handleResetFilters = () => {
    setYearRange([2023, 2026]);
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
    if (yearRange[0] !== 2023 || yearRange[1] !== 2026) count += 1;
    Object.values(selectedChips).forEach((arr) => {
      count += arr.length;
    });
    return count;
  }, [yearRange, selectedChips]);

  // Estados del Drawer de Detalle (PIADI-306)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [currentIndicatorKey, setCurrentIndicatorKey] = useState('aprobacion');
  const [drawerPeriod, setDrawerPeriod] = useState(2026);

  const currentIndicator = useMemo(() => {
    return MOCK_INDICATORS[currentIndicatorKey] || MOCK_INDICATORS['aprobacion'];
  }, [currentIndicatorKey]);

  const handleOpenIndicator = (key) => {
    setCurrentIndicatorKey(key);
    setDrawerPeriod(2026);
    setDrawerLoading(true);
    setDrawerOpen(true);
    setTimeout(() => {
      setDrawerLoading(false);
    }, 350);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const stepDrawerPeriod = (delta) => {
    const next = drawerPeriod + delta;
    if (next >= 2023 && next <= 2026) {
      setDrawerPeriod(next);
      setDrawerLoading(true);
      setTimeout(() => {
        setDrawerLoading(false);
      }, 200);
    }
  };

  // Datos base para gráficos
  const aprobacionYear = [
    { year: '2023', value: 84.2 },
    { year: '2024', value: 86.2 },
    { year: '2025', value: 82.2 },
    { year: '2026', value: 83.1 },
  ];

  const reprobacionYear = [
    { year: '2023', value: 15.8 },
    { year: '2024', value: 13.8 },
    { year: '2025', value: 17.8 },
    { year: '2026', value: 16.9 },
  ];

  const reprobacionAsignaturas = [
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

  const asignaturasCriticas = reprobacionAsignaturas.filter((d) => d.value >= 20);

  const practicasYear = {
    labels: ['2024', '2025', '2026'],
    series: [
      { label: 'Inscritas', values: [2, 4, 11] },
      { label: 'Aprobadas', values: [3, 23, 34] },
    ],
  };

  const titulacionCohorte = {
    labels: ['Cohorte 2021', 'Cohorte 2022'],
    series: [
      { label: 'En tiempo normativo', values: [7, 4] },
      { label: 'Con desfase', values: [6, 5] },
    ],
  };

  const tituladosYear = [
    { year: '2023', value: 0 },
    { year: '2024', value: 0 },
    { year: '2025', value: 10 },
    { year: '2026', value: 12 },
  ];

  const tiempoTitulacion = 8.68;

  // Filtrado de años visibles según slider
  const visibleAprobacion = useMemo(() => {
    return aprobacionYear.filter((d) => {
      const y = parseInt(d.year, 10);
      return y >= yearRange[0] && y <= yearRange[1];
    });
  }, [yearRange]);

  const visibleReprobacion = useMemo(() => {
    return reprobacionYear.filter((d) => {
      const y = parseInt(d.year, 10);
      return y >= yearRange[0] && y <= yearRange[1];
    });
  }, [yearRange]);

  const visibleTitulados = useMemo(() => {
    return tituladosYear.filter((d) => {
      const y = parseInt(d.year, 10);
      return y >= yearRange[0] && y <= yearRange[1];
    });
  }, [yearRange]);

  // Preguntas Frecuentes para Centro de Ayuda
  const faqData = [
    {
      q: '¿Qué información entrega el Dashboard de Desarrollo Curricular?',
      a: 'Reúne las estadísticas institucionales sobre rendimiento académico (tasas de aprobación y reprobación por asignatura y año), monitoreo de asignaturas críticas, progreso en prácticas profesionales y tasas de titulación oportuna por cohorte.',
    },
    {
      q: '¿Cómo se define una Asignatura Crítica?',
      a: 'Una asignatura es considerada crítica cuando su tasa de reprobación alcanza o supera el umbral de alerta institucional del 20 %, requiriendo seguimiento pedagógico y apoyo docente.',
    },
    {
      q: '¿Qué significa Titulación en tiempo normativo?',
      a: 'Corresponde a los estudiantes que obtienen su título dentro de la duración establecida en la malla curricular (8 semestres en carreras de pregrado regular). Aquellos que requieren semestres adicionales se contabilizan como "con desfase".',
    },
    {
      q: '¿Cómo interactuar con los filtros y detalles?',
      a: 'Puedes filtrar por rango de años mediante el control deslizante, o acotar por Cohorte, Estado, Asignatura y Tipo de práctica. Además, al presionar "Ver detalle" en cada gráfico o hacer clic en una tarjeta KPI, se desplegará el panel lateral con la tabla histórica y métricas del indicador.',
    },
  ];

  return {
    navigate,
    user,
    logout,
    mobileOpen,
    setMobileOpen,
    openHelpDialog,
    setOpenHelpDialog,
    collapsedSections,
    handleToggleSection,
    filtersCollapsed,
    setFiltersCollapsed,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    yearRange,
    setYearRange,
    selectedChips,
    handleToggleChip,
    accordionsOpen,
    handleToggleAccordion,
    handleResetFilters,
    activeFiltersCount,
    drawerOpen,
    drawerLoading,
    currentIndicator,
    currentIndicatorKey,
    drawerPeriod,
    handleOpenIndicator,
    handleCloseDrawer,
    stepDrawerPeriod,
    aprobacionYear: visibleAprobacion,
    reprobacionYear: visibleReprobacion,
    reprobacionAsignaturas,
    asignaturasCriticas,
    practicasYear,
    titulacionCohorte,
    tituladosYear: visibleTitulados,
    tiempoTitulacion,
    faqData,
  };
};
