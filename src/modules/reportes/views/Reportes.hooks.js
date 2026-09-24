import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const AREA_COLORS = {
  'Admisión': '#1E2875',
  'Desarrollo Curricular': '#3E8FD9',
  'Innovación': '#C24BC9',
  'Educación Continua': '#2FB8A6',
  'Vinculación': '#E0A63B',
  'Relaciones Estudiantiles': '#8A4BD6',
  'institucional': '#1E2875',
  'Institucional': '#1E2875',
};

export const CATALOGO = [
  {
    dep: 'Admisión',
    items: [
      { id: 'matricula-total', name: 'Matrícula total por período', desc: 'Estudiantes matriculados por semestre y año.' },
      { id: 'nuevos-antiguos', name: 'Matrícula nuevos vs antiguos', desc: 'Ingreso de nuevos contra estudiantes que continúan.' },
      { id: 'via-acceso', name: 'Vía de acceso', desc: 'Mecanismo de ingreso (PAES, ranking, convalidación, etc.).' },
      { id: 'tipo-colegio', name: 'Tipo de colegio de origen', desc: 'Dependencia del establecimiento de procedencia.' },
      { id: 'nivel-socioeconomico', name: 'Nivel socioeconómico (NSE)', desc: 'Distribución por quintil de ingreso del hogar.' },
    ],
  },
  {
    dep: 'Desarrollo Curricular',
    items: [
      { id: 'aprobacion', name: 'Tasa de aprobación promedio', desc: 'Porcentaje de aprobación de asignaturas por año.' },
      { id: 'titulacion', name: 'Titulación por cohorte', desc: 'Proporción de titulados por cohorte de ingreso.' },
      { id: 'asignaturas-criticas', name: 'Asignaturas críticas', desc: 'Cursos con menor tasa de aprobación.' },
    ],
  },
  {
    dep: 'Innovación',
    items: [
      { id: 'proyectos-activos', name: 'Proyectos de innovación activos', desc: 'Proyectos en curso por período.' },
      { id: 'docentes-involucrados', name: 'Docentes involucrados', desc: 'Personas institucionales que participan en proyectos.' },
    ],
  },
  {
    dep: 'Educación Continua',
    items: [
      { id: 'cursos-dictados', name: 'Cursos efectivamente dictados', desc: 'Cursos de formación continua ejecutados.' },
      { id: 'ejecucion', name: 'Tasa de ejecución', desc: 'Cumplimiento de la programación de cursos.' },
    ],
  },
  {
    dep: 'Vinculación',
    items: [
      { id: 'convenios-vigentes', name: 'Convenios VcM vigentes', desc: 'Convenios institucionales activos.' },
      { id: 'participantes', name: 'Participantes en actividades', desc: 'Personas que participan en actividades de VcM.' },
    ],
  },
  {
    dep: 'Relaciones Estudiantiles',
    items: [
      { id: 'actividades', name: 'Actividades estudiantiles', desc: 'Actividades realizadas por organizaciones estudiantiles.' },
      { id: 'participacion', name: 'Participación estudiantil', desc: 'Nivel de participación en actividades.' },
    ],
  },
];

export const DESAGREGACIONES = {
  'convenios-vigentes': ['Sector', 'Tipo', 'Contraparte'],
  'matricula-total': ['Semestre', 'Sección'],
  'nuevos-antiguos': ['Semestre'],
  'via-acceso': ['Año'],
  'nivel-socioeconomico': ['Año', 'Sexo'],
  'aprobacion': ['Asignatura', 'Sección'],
  'titulacion': ['Cohorte'],
  'participantes': ['Línea VcM', 'Modalidad'],
  'actividades': ['Tipo de actividad'],
};

export const FILTROS_AREA = {
  'Admisión': {
    filtros: [
      ['Tipo de colegio', ['Municipal', 'Subvencionado', 'Particular pagado']],
      ['Vía de acceso', ['PAES', 'Ranking', 'Cupo especial', 'Convalidación']],
    ],
    desag: ['NSE', 'Sexo'],
  },
  'Desarrollo Curricular': {
    filtros: [
      ['Régimen', ['Diurno', 'Vespertino']],
      ['Estado asignatura', ['Activa', 'Reprogración']],
    ],
    desag: ['Asignatura', 'Sección'],
  },
  'Innovación': {
    filtros: [
      ['Estado proyecto', ['En curso', 'Finalizado', 'Planificado']],
    ],
    desag: ['Área temática'],
  },
  'Educación Continua': {
    filtros: [
      ['Modalidad', ['Presencial', 'Online', 'Híbrido']],
    ],
    desag: ['Programa'],
  },
  'Vinculación': {
    filtros: [
      ['Sector contraparte', ['Público', 'Privado', 'ONG', 'Academia']],
    ],
    desag: ['Sector', 'Tipo'],
  },
  'Relaciones Estudiantiles': {
    filtros: [
      ['Tipo de actividad', ['Cultural', 'Deportiva', 'Académica']],
    ],
    desag: ['Tipo de actividad'],
  },
  'institucional': {
    filtros: [
      ['Nivel', ['Pregrado']],
    ],
    desag: ['Área', 'Semestre'],
  },
};

export const IND_FROM_AREA = {
  'Admisión': ['matricula-total', 'nuevos-antiguos', 'via-acceso'],
  'Desarrollo Curricular': ['titulacion', 'aprobacion'],
  'Innovación': ['proyectos-activos', 'docentes-involucrados'],
  'Educación Continua': ['cursos-dictados', 'ejecucion'],
  'Vinculación': ['convenios-vigentes', 'participantes'],
  'Relaciones Estudiantiles': ['actividades', 'participacion'],
  'institucional': ['matricula-total', 'nuevos-antiguos', 'aprobacion', 'titulacion', 'proyectos-activos', 'convenios-vigentes'],
};

export const PREDEFINIDOS_INITIAL = [
  { id: 'p1', name: 'Reporte de Matrícula', area: 'Admisión', tipo: 'completo', inds: ['matricula-total', 'nuevos-antiguos', 'via-acceso'], formato: 'excel' },
  { id: 'p2', name: 'Reporte de Titulación por cohorte', area: 'Desarrollo Curricular', tipo: 'segmento', inds: ['titulacion', 'aprobacion'], formato: 'pdf' },
  { id: 'p3', name: 'Reporte de Convenios VcM', area: 'Vinculación', tipo: 'completo', inds: ['convenios-vigentes', 'participantes'], formato: 'excel' },
  { id: 'p4', name: 'Reporte de Innovación', area: 'Innovación', tipo: 'segmento', inds: ['proyectos-activos', 'docentes-involucrados'], formato: 'pdf' },
];

export const MIS_REPORTES_INITIAL = [
  { id: 'r1', name: 'Matrícula Anual PIADI', area: 'Admisión', inds: ['matricula-total', 'nuevos-antiguos', 'via-acceso', 'tipo-colegio', 'nivel-socioeconomico'], formato: 'excel', ultimo: '2026-04-15', creadoPor: 'John Doe', creadoEn: '2026-01-12' },
  { id: 'r2', name: 'Seguimiento Titulación 2025', area: 'Desarrollo Curricular', inds: ['titulacion', 'aprobacion', 'asignaturas-criticas'], formato: 'pdf', ultimo: '2026-03-02', creadoPor: 'María López', creadoEn: '2026-02-01' },
  { id: 'r3', name: 'Convenios y Actividades VcM', area: 'Vinculación', inds: ['convenios-vigentes', 'participantes'], formato: 'excel', ultimo: '2026-02-20', creadoPor: 'John Doe', creadoEn: '2026-02-10' },
  { id: 'r4', name: 'Matrícula institucional consolidada', area: 'institucional', inds: ['matricula-total', 'nuevos-antiguos', 'aprobacion', 'titulacion'], formato: 'pdf', ultimo: '2026-04-02', creadoPor: 'Carlos Rojas', creadoEn: '2026-03-18' },
];

export const HISTORIAL_INITIAL = [
  { id: 'h1', reporteId: 'r1', reporteName: 'Matrícula Anual PIADI', usuario: 'John Doe', fecha: '2026-04-15', formato: 'Excel', estado: 'ok' },
  { id: 'h2', reporteId: 'r4', reporteName: 'Matrícula institucional consolidada', usuario: 'Carlos Rojas', fecha: '2026-04-02', formato: 'PDF', estado: 'ok' },
  { id: 'h3', reporteId: 'r2', reporteName: 'Seguimiento Titulación 2025', usuario: 'María López', fecha: '2026-03-28', formato: 'PDF', estado: 'ok' },
  { id: 'h4', reporteId: 'r3', reporteName: 'Convenios y Actividades VcM', usuario: 'John Doe', fecha: '2026-03-20', formato: 'Excel', estado: 'pending' },
  { id: 'h5', reporteId: 'r1', reporteName: 'Matrícula Anual PIADI', usuario: 'John Doe', fecha: '2026-03-12', formato: 'Excel', estado: 'error' },
  { id: 'h6', reporteId: 'r2', reporteName: 'Seguimiento Titulación 2025', usuario: 'María López', fecha: '2026-03-02', formato: 'PDF', estado: 'ok' },
  { id: 'h7', reporteId: 'r4', reporteName: 'Matrícula institucional consolidada', usuario: 'Carlos Rojas', fecha: '2026-02-25', formato: 'PDF', estado: 'pending' },
  { id: 'h8', reporteId: 'r3', reporteName: 'Convenios y Actividades VcM', usuario: 'John Doe', fecha: '2026-02-20', formato: 'Excel', estado: 'ok' },
];

export const SAMPLE_INDICATOR_DATA = {
  'matricula-total': {
    val: '980',
    desc: 'Estudiantes matriculados por semestre y año.',
    table: [['2023', 800], ['2024', 850], ['2025', 910], ['2026', 980]],
    chart: [800, 850, 910, 980],
    labels: ['2023', '2024', '2025', '2026'],
  },
  'nuevos-antiguos': {
    val: '340 nuevos',
    desc: 'Ingreso de nuevos contra estudiantes que continúan.',
    table: [['2023', 280], ['2024', 300], ['2025', 320], ['2026', 340]],
    chart: [280, 300, 320, 340],
    labels: ['2023', '2024', '2025', '2026'],
  },
  'via-acceso': {
    val: 'PAES 62%',
    desc: 'Mecanismo de ingreso (PAES, ranking, convalidación, etc.).',
    table: [['PAES', 610], ['Ranking', 180], ['Cupo especial', 120], ['Convalidación', 70]],
    chart: [610, 180, 120, 70],
    labels: ['PAES', 'Ranking', 'Cupo esp.', 'Convalid.'],
  },
  'tipo-colegio': {
    val: '420 subvencionado',
    desc: 'Dependencia del establecimiento de procedencia.',
    table: [['Municipal', 380], ['Subvencionado', 420], ['Particular', 180]],
    chart: [380, 420, 180],
    labels: ['Municipal', 'Subvenc.', 'Particular'],
  },
  'nivel-socioeconomico': {
    val: 'Quintil 3',
    desc: 'Distribución por quintil de ingreso del hogar.',
    table: [['Q1', 120], ['Q2', 180], ['Q3', 260], ['Q4', 240], ['Q5', 180]],
    chart: [120, 180, 260, 240, 180],
    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
  },
  'aprobacion': {
    val: '86%',
    desc: 'Porcentaje de aprobación de asignaturas por año.',
    table: [['2023', 81], ['2024', 83], ['2025', 84], ['2026', 86]],
    chart: [81, 83, 84, 86],
    labels: ['2023', '2024', '2025', '2026'],
  },
  'titulacion': {
    val: '78%',
    desc: 'Proporción de titulados por cohorte de ingreso.',
    table: [['Cohorte 2020', 71], ['Cohorte 2021', 75], ['Cohorte 2022', 78]],
    chart: [71, 75, 78],
    labels: ['Coh. 2020', 'Coh. 2021', 'Coh. 2022'],
  },
  'asignaturas-criticas': {
    val: '8 asignaturas',
    desc: 'Cursos con menor tasa de aprobación.',
    table: [['2023', 11], ['2024', 9], ['2025', 10], ['2026', 8]],
    chart: [11, 9, 10, 8],
    labels: ['2023', '2024', '2025', '2026'],
  },
  'proyectos-activos': {
    val: '13 proyectos',
    desc: 'Proyectos de innovación en curso por período.',
    table: [['2023', 4], ['2024', 7], ['2025', 10], ['2026', 13]],
    chart: [4, 7, 10, 13],
    labels: ['2023', '2024', '2025', '2026'],
  },
  'docentes-involucrados': {
    val: '38 docentes',
    desc: 'Personas institucionales que participan en proyectos.',
    table: [['2023', 0], ['2024', 12], ['2025', 25], ['2026', 38]],
    chart: [0, 12, 25, 38],
    labels: ['2023', '2024', '2025', '2026'],
  },
  'cursos-dictados': {
    val: '24 cursos',
    desc: 'Cursos de formación continua ejecutados.',
    table: [['2023', 16], ['2024', 18], ['2025', 21], ['2026', 24]],
    chart: [16, 18, 21, 24],
    labels: ['2023', '2024', '2025', '2026'],
  },
  'ejecucion': {
    val: '86%',
    desc: 'Cumplimiento de la programación de cursos.',
    table: [['2023', 72], ['2024', 78], ['2025', 82], ['2026', 86]],
    chart: [72, 78, 82, 86],
    labels: ['2023', '2024', '2025', '2026'],
  },
  'convenios-vigentes': {
    val: '45 convenios',
    desc: 'Convenios institucionales activos.',
    table: [['2023', 35], ['2024', 38], ['2025', 40], ['2026', 45]],
    chart: [35, 38, 40, 45],
    labels: ['2023', '2024', '2025', '2026'],
  },
  'participantes': {
    val: '1,856 personas',
    desc: 'Personas que participan en actividades de VcM.',
    table: [['2023', 1420], ['2024', 1580], ['2025', 1720], ['2026', 1856]],
    chart: [1420, 1580, 1720, 1856],
    labels: ['2023', '2024', '2025', '2026'],
  },
  'actividades': {
    val: '47 actividades',
    desc: 'Actividades realizadas por organizaciones estudiantiles.',
    table: [['2023', 30], ['2024', 36], ['2025', 42], ['2026', 47]],
    chart: [30, 36, 42, 47],
    labels: ['2023', '2024', '2025', '2026'],
  },
  'participacion': {
    val: '1,523 estudiantes',
    desc: 'Nivel de participación en actividades estudiantiles.',
    table: [['2023', 900], ['2024', 1180], ['2025', 1360], ['2026', 1523]],
    chart: [900, 1180, 1360, 1523],
    labels: ['2023', '2024', '2025', '2026'],
  },
};

export const useReportes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Navigation mode: 'lista' | 'constructor' | 'preview' | 'historial'
  const [viewMode, setViewMode] = useState('lista');

  // Role simulation selector: 'admin' | 'jefe' | 'area'
  const [currentRole, setCurrentRole] = useState('admin');

  // Filter state for list view
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [filtroFormato, setFiltroFormato] = useState('todos');
  const [filtroCreadoPor, setFiltroCreadoPor] = useState('todos');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // Data lists
  const [misReportes, setMisReportes] = useState(MIS_REPORTES_INITIAL);
  const [historialList, setHistorialList] = useState(HISTORIAL_INITIAL);
  const [predefinidosList] = useState(PREDEFINIDOS_INITIAL);

  // Kebab menu state
  const [kebabAnchorEl, setKebabAnchorEl] = useState(null);
  const [kebabTargetId, setKebabTargetId] = useState(null);

  // Delete modal confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState('');

  // Toast alert
  const [toastMessage, setToastMessage] = useState('');
  const [toastOpen, setToastOpen] = useState(false);
  const [toastSeverity, setToastSeverity] = useState('success');

  // Help modal
  const [openHelpDialog, setOpenHelpDialog] = useState(false);

  // Builder (Wizard) state
  const [builder, setBuilder] = useState({
    step: 1,
    nombre: '',
    desc: '',
    area: 'Admisión',
    inds: [],
    annoMin: '2023',
    annoMax: '2026',
    formato: 'excel',
    graficos: true,
    tablas: true,
    desag: [],
    filtrosSeleccionados: [],
    editId: null,
  });

  const [indicatorSearch, setIndicatorSearch] = useState('');

  // Preview & Generation simulation state
  const [currentPreviewReport, setCurrentPreviewReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [progressText, setProgressText] = useState('Preparando indicadores…');

  // Historial view state
  const [histReporteFilter, setHistReporteFilter] = useState('todos');
  const [histFechaFilter, setHistFechaFilter] = useState('');
  const [histPage, setHistPage] = useState(1);
  const HIST_PER_PAGE = 5;

  const showToast = (message, severity = 'success') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const getIndicatorInfo = (id) => {
    for (const group of CATALOGO) {
      for (const item of group.items) {
        if (item.id === id) return { ...item, dep: group.dep };
      }
    }
    return { id, name: id, desc: '', dep: 'General' };
  };

  const areaName = (a) => {
    if (a === 'Vinculación') return 'Vinculación con el Medio';
    if (a === 'institucional') return 'Institucional';
    return a;
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso + 'T00:00:00');
      return d.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  };

  // Filtered lists
  const filteredMisReportes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return misReportes.filter((r) => {
      if (filtroDepartamento !== 'todas' && r.area !== filtroDepartamento) return false;
      if (q && !r.name.toLowerCase().includes(q)) return false;
      if (filtroFormato !== 'todos' && r.formato !== filtroFormato) return false;
      if (filtroCreadoPor !== 'todos' && (r.creadoPor || '') !== filtroCreadoPor) return false;
      if (filtroDesde && r.creadoEn < filtroDesde) return false;
      if (filtroHasta && r.creadoEn > filtroHasta) return false;
      return true;
    });
  }, [misReportes, searchQuery, filtroDepartamento, filtroFormato, filtroCreadoPor, filtroDesde, filtroHasta]);

  const filteredPredefinidos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return predefinidosList.filter((p) => {
      if (filtroDepartamento !== 'todas' && p.area !== filtroDepartamento) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (filtroFormato !== 'todos' && p.formato !== filtroFormato) return false;
      return true;
    });
  }, [predefinidosList, searchQuery, filtroDepartamento, filtroFormato]);

  // Historial filtered & paginated
  const filteredHistorial = useMemo(() => {
    return historialList.filter((h) => {
      if (histReporteFilter !== 'todos' && h.reporteId !== histReporteFilter) return false;
      if (histFechaFilter && h.fecha !== histFechaFilter) return false;
      return true;
    });
  }, [historialList, histReporteFilter, histFechaFilter]);

  const paginatedHistorial = useMemo(() => {
    const start = (histPage - 1) * HIST_PER_PAGE;
    return filteredHistorial.slice(start, start + HIST_PER_PAGE);
  }, [filteredHistorial, histPage]);

  const totalHistPages = Math.max(1, Math.ceil(filteredHistorial.length / HIST_PER_PAGE));

  // Builder actions
  const handleOpenNewBuilder = () => {
    setBuilder({
      step: 1,
      nombre: '',
      desc: '',
      area: 'Admisión',
      inds: ['matricula-total', 'nuevos-antiguos', 'via-acceso'],
      annoMin: '2023',
      annoMax: '2026',
      formato: 'excel',
      graficos: true,
      tablas: true,
      desag: [],
      filtrosSeleccionados: [],
      editId: null,
    });
    setIndicatorSearch('');
    setViewMode('constructor');
  };

  const handleUseAsBase = (reportOrPredef) => {
    const baseName = reportOrPredef.name.replace(/\s*\(copia(?:\s*\d*)?\)\s*$/, '');
    const prefix = `${baseName} (copia`;
    const existing = misReportes.filter((r) => r.name.startsWith(prefix)).length;
    const newName = existing === 0 ? `${baseName} (copia)` : `${baseName} (copia ${existing})`;

    setBuilder({
      step: 1,
      nombre: newName,
      desc: reportOrPredef.desc || '',
      area: reportOrPredef.area || 'Admisión',
      inds: [...(reportOrPredef.inds || [])],
      annoMin: '2023',
      annoMax: '2026',
      formato: reportOrPredef.formato || 'excel',
      graficos: true,
      tablas: true,
      desag: [],
      filtrosSeleccionados: [],
      editId: null,
    });
    setIndicatorSearch('');
    setViewMode('constructor');
    showToast(`Iniciando reporte basado en «${reportOrPredef.name}»`);
  };

  const handleEditReport = (report) => {
    setBuilder({
      step: 1,
      nombre: report.name,
      desc: report.desc || '',
      area: report.area || 'Admisión',
      inds: [...(report.inds || [])],
      annoMin: report.annoMin || '2023',
      annoMax: report.annoMax || '2026',
      formato: report.formato || 'excel',
      graficos: report.graficos !== undefined ? report.graficos : true,
      tablas: report.tablas !== undefined ? report.tablas : true,
      desag: report.desag || [],
      filtrosSeleccionados: report.filtrosSeleccionados || [],
      editId: report.id,
    });
    setIndicatorSearch('');
    setViewMode('constructor');
  };

  const handleAreaChange = (newArea) => {
    const defaultInds = (IND_FROM_AREA[newArea] || []).slice();
    setBuilder((prev) => ({
      ...prev,
      area: newArea,
      inds: defaultInds,
      desag: [],
    }));
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteTargetId(id);
    setDeleteConfirmInput('');
    setDeleteModalOpen(true);
    setKebabAnchorEl(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    const target = misReportes.find((r) => r.id === deleteTargetId);
    setMisReportes((prev) => prev.filter((r) => r.id !== deleteTargetId));
    setDeleteModalOpen(false);
    setDeleteTargetId(null);
    setDeleteConfirmInput('');
    showToast(`Reporte «${target?.name || ''}» eliminado`);
  };

  const handleStartGenerate = (report) => {
    setCurrentPreviewReport(report);
    setViewMode('preview');
    setIsGenerating(true);
    setProgressValue(0);
    setProgressText('Preparando indicadores…');

    // Update last generated date
    setMisReportes((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, ultimo: new Date().toISOString().slice(0, 10) } : r))
    );

    // Register into historial
    setHistorialList((prev) => [
      {
        id: `h${Date.now()}`,
        reporteId: report.id,
        reporteName: report.name,
        usuario: user?.name || user?.username || 'John Doe',
        fecha: new Date().toISOString().slice(0, 10),
        formato: report.formato === 'pdf' ? 'PDF' : 'Excel',
        estado: 'ok',
      },
      ...prev,
    ]);

    const labels = [
      'Preparando indicadores…',
      'Calculando métricas…',
      'Dibujando gráficos…',
      'Maquetando documento…',
    ];

    let p = 0;
    const interval = setInterval(() => {
      p += Math.floor(Math.random() * 20 + 15);
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgressValue(100);
        setProgressText('¡Documento listo!');
        setTimeout(() => {
          setIsGenerating(false);
        }, 400);
      } else {
        setProgressValue(p);
        const labelIdx = Math.min(labels.length - 1, Math.floor(p / 25));
        setProgressText(labels[labelIdx]);
      }
    }, 280);
  };

  const handleSaveBuilder = (andGenerate = false) => {
    const isEditing = Boolean(builder.editId);
    const authorName = user?.name || user?.username || 'John Doe';
    let savedReport = null;

    if (isEditing) {
      savedReport = {
        id: builder.editId,
        name: builder.nombre,
        desc: builder.desc,
        area: builder.area,
        inds: [...builder.inds],
        annoMin: builder.annoMin,
        annoMax: builder.annoMax,
        formato: builder.formato,
        graficos: builder.graficos,
        tablas: builder.tablas,
        desag: [...builder.desag],
        filtrosSeleccionados: [...builder.filtrosSeleccionados],
        ultimo: new Date().toISOString().slice(0, 10),
        creadoPor: authorName,
        creadoEn: new Date().toISOString().slice(0, 10),
      };

      setMisReportes((prev) => prev.map((r) => (r.id === builder.editId ? savedReport : r)));
      showToast('Reporte actualizado con éxito');
    } else {
      savedReport = {
        id: `r${Date.now()}`,
        name: builder.nombre,
        desc: builder.desc,
        area: builder.area,
        inds: [...builder.inds],
        annoMin: builder.annoMin,
        annoMax: builder.annoMax,
        formato: builder.formato,
        graficos: builder.graficos,
        tablas: builder.tablas,
        desag: [...builder.desag],
        filtrosSeleccionados: [...builder.filtrosSeleccionados],
        ultimo: '',
        creadoPor: authorName,
        creadoEn: new Date().toISOString().slice(0, 10),
      };

      setMisReportes((prev) => [savedReport, ...prev]);
      showToast('Reporte guardado en Mis reportes');
    }

    if (andGenerate) {
      handleStartGenerate(savedReport);
    } else {
      setViewMode('lista');
    }
  };

  const handleOpenHistorial = (reportId = 'todos') => {
    setHistReporteFilter(reportId);
    setHistFechaFilter('');
    setHistPage(1);
    setViewMode('historial');
    setKebabAnchorEl(null);
  };

  const handleBackToList = () => {
    setViewMode('lista');
  };

  const handleDownloadDoc = () => {
    showToast(`Descargando reporte «${currentPreviewReport?.name || 'Reporte'}» en ${currentPreviewReport?.formato?.toUpperCase() || 'PDF'}...`);
  };

  return {
    navigate,
    user,
    viewMode,
    setViewMode,
    currentRole,
    setCurrentRole,
    searchQuery,
    setSearchQuery,
    filtroDepartamento,
    setFiltroDepartamento,
    filtroTipo,
    setFiltroTipo,
    filtroFormato,
    setFiltroFormato,
    filtroCreadoPor,
    setFiltroCreadoPor,
    filtroDesde,
    setFiltroDesde,
    filtroHasta,
    setFiltroHasta,
    filtersCollapsed,
    setFiltersCollapsed,
    filteredMisReportes,
    filteredPredefinidos,
    misReportes,
    kebabAnchorEl,
    setKebabAnchorEl,
    kebabTargetId,
    setKebabTargetId,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteTargetId,
    deleteConfirmInput,
    setDeleteConfirmInput,
    handleOpenDeleteModal,
    handleConfirmDelete,
    toastMessage,
    toastOpen,
    setToastOpen,
    toastSeverity,
    showToast,
    openHelpDialog,
    setOpenHelpDialog,
    builder,
    setBuilder,
    indicatorSearch,
    setIndicatorSearch,
    handleOpenNewBuilder,
    handleUseAsBase,
    handleEditReport,
    handleAreaChange,
    handleStartGenerate,
    handleSaveBuilder,
    handleOpenHistorial,
    handleBackToList,
    currentPreviewReport,
    isGenerating,
    progressValue,
    progressText,
    handleDownloadDoc,
    histReporteFilter,
    setHistReporteFilter,
    histFechaFilter,
    setHistFechaFilter,
    histPage,
    setHistPage,
    paginatedHistorial,
    totalHistPages,
    filteredHistorial,
    getIndicatorInfo,
    areaName,
    formatDate,
  };
};
