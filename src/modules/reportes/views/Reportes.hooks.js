import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  getReportes,
  createReporte,
  updateReporte,
  deleteReporte,
  descargarReporte,
  getReporteEjecuciones,
  getReporteAreas,
  getDepartmentKpis,
  getIndicatorDetail,
  getDepartmentFilters,
} from '../../../services/piadiApi';

export const AREA_COLORS = {
  'Admisión': '#1E2875',
  'admision': '#1E2875',
  'Desarrollo Curricular': '#3E8FD9',
  'desarrollo_curricular': '#3E8FD9',
  'Innovación': '#C24BC9',
  'innovacion': '#C24BC9',
  'Educación Continua': '#2FB8A6',
  'educacion_continua': '#2FB8A6',
  'Vinculación': '#E0A63B',
  'Vinculación con el Medio': '#E0A63B',
  'vinculacion_medio': '#E0A63B',
  'Relaciones Estudiantiles': '#8A4BD6',
  'relaciones_estudiantiles': '#8A4BD6',
  'institucional': '#1E2875',
  'Institucional': '#1E2875',
};

export const AREA_KEY_TO_NAME = {
  admision: 'Admisión',
  desarrollo_curricular: 'Desarrollo Curricular',
  innovacion: 'Innovación',
  educacion_continua: 'Educación Continua',
  vinculacion_medio: 'Vinculación con el Medio',
  relaciones_estudiantiles: 'Relaciones Estudiantiles',
  institucional: 'Institucional',
};

export const AREA_NAME_TO_KEY = {
  'Admisión': 'admision',
  'Desarrollo Curricular': 'desarrollo_curricular',
  'Innovación': 'innovacion',
  'Educación Continua': 'educacion_continua',
  'Vinculación con el Medio': 'vinculacion_medio',
  'Vinculación': 'vinculacion_medio',
  'Relaciones Estudiantiles': 'relaciones_estudiantiles',
  'Institucional': 'institucional',
  'institucional': 'institucional',
};

// Catálogo base con fallback de indicadores y dimensiones
export const FALLBACK_CATALOGO = [
  {
    dep: 'Admisión',
    key: 'admision',
    items: [
      { id: 'matricula_total', name: 'Matrícula total por período', desc: 'Cantidad total de matrículas registradas en el período académico.' },
      { id: 'nuevos_vs_antiguos', name: 'Estudiantes nuevos vs antiguos', desc: 'Distribución de matrícula entre estudiantes de primer ingreso y cursos superiores.' },
      { id: 'via_acceso', name: 'Vía de acceso institucional', desc: 'Distribución de estudiantes según la modalidad o vía de admisión.' },
      { id: 'tipo_colegio', name: 'Tipo de colegio de procedencia', desc: 'Distribución de estudiantes según dependencia del colegio de egreso.' },
      { id: 'nivel_socioeconomico', name: 'Nivel socioeconómico (NSE)', desc: 'Distribución de estudiantes matriculados según clasificación de NSE.' },
      { id: 'situacion_familiar', name: 'Situación familiar', desc: 'Clasificación de estudiantes según su entorno y situación familiar declarada.' },
      { id: 'procedencia_geografica', name: 'Procedencia geográfica', desc: 'Distribución geográfica de estudiantes por región y comuna.' },
      { id: 'beneficios_becas', name: 'Beneficios y becas', desc: 'Cantidad y tipo de beneficios estudiantiles, gratuidad o becas asignadas.' },
      { id: 'distribucion_sexo', name: 'Distribución por sexo', desc: 'Distribución porcentual y cuantitativa de estudiantes matriculados por sexo.' },
      { id: 'rango_etario', name: 'Distribución por rango etario', desc: 'Distribución de estudiantes matriculados agrupados por tramos de edad.' },
      { id: 'matricula_por_asignatura', name: 'Matrícula por asignatura', desc: 'Cantidad de inscripciones activas desglosadas por asignatura.' },
      { id: 'matricula_por_seccion', name: 'Matrícula por sección', desc: 'Cantidad de estudiantes inscritos por sección de curso.' },
      { id: 'matricula_por_estado_academico', name: 'Matrícula por estado académico', desc: 'Distribución de estudiantes según su estado académico actual.' },
    ],
  },
  {
    dep: 'Innovación',
    key: 'innovacion',
    items: [
      { id: 'proyectos_activos', name: 'Proyectos activos', desc: 'Cantidad de proyectos de innovación activos durante el año consultado.' },
      { id: 'total_proyectos', name: 'Total de proyectos', desc: 'Cantidad de proyectos de innovación iniciados en el período.' },
      { id: 'financiamiento_obtenido', name: 'Financiamiento obtenido', desc: 'Monto externo adjudicado a proyectos de innovación.' },
      { id: 'proyectos_con_financiamiento_externo', name: 'Proyectos con financiamiento externo', desc: 'Cantidad de proyectos que cuentan con financiamiento externo.' },
      { id: 'proyectos_finalizados', name: 'Innovaciones implementadas', desc: 'Cantidad de proyectos de innovación finalizados en el año.' },
      { id: 'secciones_curso', name: 'Secciones del curso de innovación', desc: 'Cantidad de secciones del curso Emprendimiento e Innovación.' },
      { id: 'docentes_involucrados', name: 'Docentes involucrados', desc: 'Cantidad de docentes involucrados en proyectos de innovación.' },
    ],
  },
  {
    dep: 'Educación Continua',
    key: 'educacion_continua',
    items: [
      { id: 'oferta_programada', name: 'Oferta programada', desc: 'Cantidad de programas programados en el período.' },
      { id: 'cursos_dictados', name: 'Cursos efectivamente dictados', desc: 'Cantidad de cursos efectivamente ejecutados.' },
      { id: 'tasa_ejecucion', name: 'Tasa de ejecución', desc: 'Cursos dictados sobre la oferta programada.' },
      { id: 'matricula_por_programa', name: 'Matrícula en programas', desc: 'Total de matrículas asociadas a programas.' },
      { id: 'tasa_aprobacion', name: 'Tasa de aprobación', desc: 'Aprobados sobre la matrícula total.' },
      { id: 'ingresos_generados', name: 'Ingresos generados', desc: 'Suma de ingresos netos asociados a programas.' },
      { id: 'ticket_promedio', name: 'Ticket promedio', desc: 'Ingresos netos sobre la matrícula total.' },
      { id: 'participantes_unicos', name: 'Participantes únicos', desc: 'Cantidad de participantes distintos.' },
      { id: 'perfil_participante', name: 'Perfil de participante', desc: 'Distribución de participantes por dimensión.' },
      { id: 'recurrencia_formativa', name: 'Recurrencia formativa', desc: 'Participantes con más de un curso.' },
    ],
  },
  {
    dep: 'Vinculación con el Medio',
    key: 'vinculacion_medio',
    items: [
      { id: 'total_convenios', name: 'Total de convenios', desc: 'Cantidad total de convenios registrados.' },
      { id: 'convenios_por_sector', name: 'Convenios por sector', desc: 'Distribución de convenios según sector (público, privado, social).' },
      { id: 'convenios_activos', name: 'Convenios vigentes', desc: 'Cantidad de convenios con estado activo/vigente.' },
      { id: 'actividades_realizadas', name: 'Actividades realizadas', desc: 'Cantidad de actividades de vinculación ejecutadas.' },
      { id: 'participaciones', name: 'Total de participaciones', desc: 'Suma total de personas participantes en actividades de VCM.' },
      { id: 'articulaciones_tp', name: 'Articulaciones técnico-profesionales', desc: 'Cantidad de articulaciones con colegios y liceos TP.' },
      { id: 'proyectos_vcm', name: 'Proyectos vigentes', desc: 'Cantidad de proyectos de VCM con estado En Curso.' },
      { id: 'financiamiento_vcm', name: 'Financiamiento total', desc: 'Suma de financiamiento neto para proyectos de VCM.' },
    ],
  },
  {
    dep: 'Desarrollo Curricular',
    key: 'desarrollo_curricular',
    items: [
      { id: 'programas_actualizados', name: 'Programas de estudio actualizados', desc: 'Porcentaje o cantidad de programas de estudio actualizados.' },
      { id: 'innovaciones_pedagogicas', name: 'Innovaciones pedagógicas', desc: 'Cantidad de metodologías activas implementadas en el aula.' },
    ],
  },
];

// Configuración de campos de filtros disponibles por departamento en el backend
export const BACKEND_FILTER_CONFIGS = {
  admision: [
    { key: 'tiposColegio', label: 'Tipo de colegio', paramKey: 'tipoColegio' },
    { key: 'viasAcceso', label: 'Vía de acceso', paramKey: 'viaAcceso' },
    { key: 'nivelesSocioeconomicos', label: 'Nivel socioeconómico (NSE)', paramKey: 'nivelSocioeconomico' },
    { key: 'situacionesFamiliares', label: 'Situación familiar', paramKey: 'situacionFamiliar' },
    { key: 'beneficios', label: 'Beneficios y becas', paramKey: 'beneficios' },
    { key: 'estadosAcademicos', label: 'Estado académico', paramKey: 'estadoAcademico' },
  ],
  innovacion: [
    { key: 'estados', label: 'Estado proyecto', paramKey: 'estado' },
    { key: 'fuentes', label: 'Fuente de financiamiento', paramKey: 'fuenteFinanciamiento' },
    { key: 'tipos', label: 'Tipo de proyecto', paramKey: 'tipo' },
    { key: 'areas', label: 'Área temática', paramKey: 'area' },
  ],
  educacion_continua: [
    { key: 'modalidades', label: 'Modalidad', paramKey: 'modalidad' },
    { key: 'tipos', label: 'Tipo de programa', paramKey: 'tipo' },
    { key: 'areas', label: 'Área temática', paramKey: 'area' },
  ],
  vinculacion_medio: [
    { key: 'sectores', label: 'Sector contraparte', paramKey: 'sector' },
    { key: 'modalidades', label: 'Modalidad', paramKey: 'modalidad' },
    { key: 'areas', label: 'Área vinculada', paramKey: 'areaVinculada' },
  ],
  desarrollo_curricular: [
    { key: 'regimen', label: 'Régimen', paramKey: 'regimen' },
    { key: 'estados', label: 'Estado asignatura', paramKey: 'estado' },
  ],
};

// Mapeo inverso de nombre de filtro visual a clave de parámetro aceptada por el backend
export const THEMATIC_FILTER_PARAM_MAP = {
  'Tipo de colegio': 'tipoColegio',
  'Vía de acceso': 'viaAcceso',
  'Nivel socioeconómico (NSE)': 'nivelSocioeconomico',
  'NSE': 'nivelSocioeconomico',
  'Situación familiar': 'situacionFamiliar',
  'Beneficios y becas': 'beneficios',
  'Estado académico': 'estadoAcademico',
  'Estado asignatura': 'estado',
  'Estado proyecto': 'estado',
  'Fuente de financiamiento': 'fuenteFinanciamiento',
  'Modalidad': 'modalidad',
  'Sector contraparte': 'sector',
  'Régimen': 'regimen',
  'Área temática': 'area',
  'Área vinculada': 'areaVinculada',
  'Tipo de programa': 'tipo',
  'Tipo de proyecto': 'tipo',
};

// Función para formatear visualmente opciones en mayúsculas a formato título legible
export const formatOptionLabel = (val) => {
  if (!val || typeof val !== 'string') return String(val ?? '');
  if (['PAES', 'NSE', 'TP', 'ONG', 'CORFO', 'ANID', 'MINEDUC'].includes(val.toUpperCase())) {
    return val.toUpperCase();
  }
  if (val.length > 2 && val === val.toUpperCase()) {
    return val
      .toLowerCase()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
  return val;
};

export const IND_FROM_AREA = {
  'Admisión': ['matricula_total', 'nuevos_vs_antiguos', 'via_acceso'],
  'admision': ['matricula_total', 'nuevos_vs_antiguos', 'via_acceso'],
  'Desarrollo Curricular': ['programas_actualizados', 'innovaciones_pedagogicas'],
  'desarrollo_curricular': ['programas_actualizados', 'innovaciones_pedagogicas'],
  'Innovación': ['proyectos_activos', 'docentes_involucrados'],
  'innovacion': ['proyectos_activos', 'docentes_involucrados'],
  'Educación Continua': ['cursos_dictados', 'tasa_ejecucion', 'oferta_programada'],
  'educacion_continua': ['cursos_dictados', 'tasa_ejecucion', 'oferta_programada'],
  'Vinculación': ['total_convenios', 'convenios_activos', 'actividades_realizadas'],
  'Vinculación con el Medio': ['total_convenios', 'convenios_activos', 'actividades_realizadas'],
  'vinculacion_medio': ['total_convenios', 'convenios_activos', 'actividades_realizadas'],
  'institucional': ['matricula_total', 'nuevos_vs_antiguos', 'proyectos_activos', 'total_convenios', 'cursos_dictados'],
};



export const SAMPLE_INDICATOR_DATA = {
  matricula_total: {
    val: '980 estudiantes',
    desc: 'Cantidad total de matrículas registradas en el período académico.',
    table: [['2023', 800], ['2024', 850], ['2025', 910], ['2026', 980]],
    chart: [800, 850, 910, 980],
    labels: ['2023', '2024', '2025', '2026'],
  },
  nuevos_vs_antiguos: {
    val: '340 nuevos',
    desc: 'Distribución de matrícula entre estudiantes de primer ingreso y superiores.',
    table: [['2023', 280], ['2024', 300], ['2025', 320], ['2026', 340]],
    chart: [280, 300, 320, 340],
    labels: ['2023', '2024', '2025', '2026'],
  },
  via_acceso: {
    val: 'PAES 62%',
    desc: 'Distribución de estudiantes según la modalidad o vía de admisión.',
    table: [['PAES', 610], ['Ranking', 180], ['Cupo especial', 120], ['Convalidación', 70]],
    chart: [610, 180, 120, 70],
    labels: ['PAES', 'Ranking', 'Cupo esp.', 'Convalid.'],
  },
  tipo_colegio: {
    val: '420 subvencionado',
    desc: 'Distribución de estudiantes según dependencia del establecimiento de procedencia.',
    table: [['Municipal', 380], ['Subvencionado', 420], ['Particular', 180]],
    chart: [380, 420, 180],
    labels: ['Municipal', 'Subvenc.', 'Particular'],
  },
  nivel_socioeconomico: {
    val: 'Quintil 3',
    desc: 'Distribución de estudiantes matriculados según nivel socioeconómico.',
    table: [['Q1', 120], ['Q2', 180], ['Q3', 260], ['Q4', 240], ['Q5', 180]],
    chart: [120, 180, 260, 240, 180],
    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
  },
  proyectos_activos: {
    val: '13 proyectos',
    desc: 'Cantidad de proyectos de innovación activos durante el período.',
    table: [['2023', 4], ['2024', 7], ['2025', 10], ['2026', 13]],
    chart: [4, 7, 10, 13],
    labels: ['2023', '2024', '2025', '2026'],
  },
  docentes_involucrados: {
    val: '38 docentes',
    desc: 'Cantidad de docentes involucrados en proyectos de innovación.',
    table: [['2023', 0], ['2024', 12], ['2025', 25], ['2026', 38]],
    chart: [0, 12, 25, 38],
    labels: ['2023', '2024', '2025', '2026'],
  },
  cursos_dictados: {
    val: '24 cursos',
    desc: 'Cantidad de cursos efectivamente ejecutados.',
    table: [['2023', 16], ['2024', 18], ['2025', 21], ['2026', 24]],
    chart: [16, 18, 21, 24],
    labels: ['2023', '2024', '2025', '2026'],
  },
  tasa_ejecucion: {
    val: '86%',
    desc: 'Cumplimiento de la oferta programada de cursos.',
    table: [['2023', 72], ['2024', 78], ['2025', 82], ['2026', 86]],
    chart: [72, 78, 82, 86],
    labels: ['2023', '2024', '2025', '2026'],
  },
  total_convenios: {
    val: '45 convenios',
    desc: 'Convenios institucionales activos y registrados.',
    table: [['2023', 35], ['2024', 38], ['2025', 40], ['2026', 45]],
    chart: [35, 38, 40, 45],
    labels: ['2023', '2024', '2025', '2026'],
  },
  convenios_activos: {
    val: '45 convenios',
    desc: 'Convenios institucionales con estado activo o vigente.',
    table: [['2023', 35], ['2024', 38], ['2025', 40], ['2026', 45]],
    chart: [35, 38, 40, 45],
    labels: ['2023', '2024', '2025', '2026'],
  },
  participaciones: {
    val: '1,856 personas',
    desc: 'Personas que participan en actividades de Vinculación con el Medio.',
    table: [['2023', 1420], ['2024', 1580], ['2025', 1720], ['2026', 1856]],
    chart: [1420, 1580, 1720, 1856],
    labels: ['2023', '2024', '2025', '2026'],
  },
};

// Función utilitaria para determinar el departamento asignado de un usuario
export const getUserDepartment = (user) => {
  if (!user) return null;

  // Roles institucionales o administrativos nunca están restringidos a un departamento
  const role = (user.role || '').toLowerCase().trim();
  const group = (user.roleGroup || '').toLowerCase().trim();
  const email = (user.email || user.username || '').toLowerCase().trim();

  if (
    role === 'rector' ||
    role === 'administrador' ||
    role === 'admin' ||
    role.includes('director de administración') ||
    role.includes('vicerrectoria académica') ||
    group === 'rectoria' ||
    group === 'calidad' ||
    email.includes('rectoria') ||
    email === 'admin@admin.com'
  ) {
    return null;
  }

  // 1. Si viene explícitamente en departmentId
  if (user.departmentId) {
    const key = String(user.departmentId).toLowerCase().trim();
    if (key && key !== 'null' && key !== 'undefined' && key !== 'institucional') {
      return {
        key,
        name: AREA_KEY_TO_NAME[key] || key,
      };
    }
  }

  // 2. Por coincidencia en el nombre de rol
  if (role.includes('admisi') || role === 'admision') {
    return { key: 'admision', name: 'Admisión' };
  }
  if (role.includes('continua')) {
    return { key: 'educacion_continua', name: 'Educación Continua' };
  }
  if (role.includes('innovaci') || role === 'innovacion') {
    return { key: 'innovacion', name: 'Innovación' };
  }
  if (role.includes('vinculaci') || role.includes('vcm')) {
    return { key: 'vinculacion_medio', name: 'Vinculación con el Medio' };
  }
  if (role.includes('curricular')) {
    return { key: 'desarrollo_curricular', name: 'Desarrollo Curricular' };
  }
  if (role.includes('estudiant')) {
    return { key: 'relaciones_estudiantiles', name: 'Relaciones Estudiantiles' };
  }

  // 3. Fallback por correo o nombre de usuario
  if (email.includes('admision')) {
    return { key: 'admision', name: 'Admisión' };
  }
  if (email.includes('educacioncontinua') || email.includes('continua')) {
    return { key: 'educacion_continua', name: 'Educación Continua' };
  }
  if (email.includes('innovacion')) {
    return { key: 'innovacion', name: 'Innovación' };
  }
  if (email.includes('vcm') || email.includes('vinculacion')) {
    return { key: 'vinculacion_medio', name: 'Vinculación con el Medio' };
  }
  if (email.includes('curricular')) {
    return { key: 'desarrollo_curricular', name: 'Desarrollo Curricular' };
  }

  return null;
};

export const useReportes = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Permisos reales del usuario
  const userRole = user?.role || '';
  const userRoleGroup = user?.roleGroup || '';

  const isAdmin = useMemo(() => {
    const role = (userRole || '').toLowerCase();
    const group = (userRoleGroup || '').toLowerCase();
    const email = (user?.email || user?.username || '').toLowerCase();
    return (
      role === 'administrador' ||
      role === 'admin' ||
      role === 'rector' ||
      role.includes('director de administración') ||
      role.includes('vicerrectoria académica') ||
      group === 'rectoria' ||
      email === 'admin@admin.com' ||
      email.includes('rectoria')
    );
  }, [userRole, userRoleGroup, user?.email, user?.username]);

  const isRector = useMemo(() => {
    return (
      userRole === 'Rector' ||
      userRoleGroup === 'Rectoria' ||
      (user?.email && user.email.toLowerCase().includes('rectoria')) ||
      (user?.username && user.username.toLowerCase().includes('rectoria')) ||
      user?.email === 'admin@admin.com'
    );
  }, [userRole, userRoleGroup, user?.email, user?.username]);

  const isCalidad = useMemo(() => {
    return (
      userRole === 'Vicerrectoria de Calidad' ||
      userRole === 'Analista de Calidad' ||
      userRoleGroup === 'Calidad' ||
      (user?.email && user.email.toLowerCase().includes('calidad')) ||
      (user?.username && user.username.toLowerCase().includes('calidad'))
    );
  }, [userRole, userRoleGroup, user?.email, user?.username]);

  const userDept = useMemo(() => {
    return getUserDepartment(user);
  }, [user]);

  // Si no es admin/rector y pertenece a un departamento específico, está restringido
  const isDepartmentRestricted = useMemo(() => {
    if (isAdmin || isRector || isCalidad) return false;
    return Boolean(userDept);
  }, [isAdmin, isRector, isCalidad, userDept]);

  // Función para determinar si un reporte pertenece al departamento asignado
  const isReportFromUserDept = useCallback((r, dept) => {
    if (!dept) return true;
    const deptKey = (dept.key || '').toLowerCase();
    const deptName = (dept.name || '').toLowerCase();
    const rArea = (r?.area || '').toLowerCase();
    const rAreaKey = (r?.areaKey || r?.departmentId || '').toLowerCase();

    return (
      rArea === deptName ||
      rAreaKey === deptKey ||
      (deptKey === 'vinculacion_medio' && (rArea.includes('vinculaci') || rAreaKey.includes('vcm') || rAreaKey.includes('vinculacion'))) ||
      (deptKey === 'admision' && (rArea.includes('admisi') || rAreaKey.includes('admision'))) ||
      (deptKey === 'educacion_continua' && (rArea.includes('continua') || rAreaKey.includes('continua'))) ||
      (deptKey === 'innovacion' && (rArea.includes('innovaci') || rAreaKey.includes('innovacion'))) ||
      (deptKey === 'desarrollo_curricular' && (rArea.includes('curricular') || rAreaKey.includes('curricular'))) ||
      (deptKey === 'relaciones_estudiantiles' && (rArea.includes('estudiant') || rAreaKey.includes('estudiant')))
    );
  }, []);

  const canCreateReport = useMemo(() => {
    return !isCalidad;
  }, [isCalidad]);

  const canCreatePredefinido = useMemo(() => {
    return isRector;
  }, [isRector]);

  // Navigation mode: 'lista' | 'constructor' | 'preview' | 'historial'
  const [viewMode, setViewMode] = useState('lista');

  // Loading state
  const [loading, setLoading] = useState(false);

  // Filter state for list view
  const [searchQuery, setSearchQuery] = useState('');
  const [filtroDepartamento, setFiltroDepartamento] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todas');
  const [filtroFormato, setFiltroFormato] = useState('todos');
  const [filtroCreadoPor, setFiltroCreadoPor] = useState('todos');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  // Data lists from API
  const [allReportes, setAllReportes] = useState([]);
  const [areasList, setAreasList] = useState([]);
  const [catalogo, setCatalogo] = useState(FALLBACK_CATALOGO);
  const [historialList, setHistorialList] = useState([]);
  const [desagregacionesMap, setDesagregacionesMap] = useState({});
  const [dimensionNameToKey, setDimensionNameToKey] = useState({});
  const [departmentFiltersMap, setDepartmentFiltersMap] = useState({});
  const [availableYears, setAvailableYears] = useState(['2023', '2024', '2025', '2026']);

  const getFiltersForArea = useCallback((areaKey) => {
    if (!areaKey) return null;
    const deptKey = AREA_NAME_TO_KEY[areaKey] || areaKey.toLowerCase().replace(/\s+/g, '_');
    if (departmentFiltersMap[areaKey]?.filtros?.length) {
      return departmentFiltersMap[areaKey];
    }
    if (departmentFiltersMap[deptKey]?.filtros?.length) {
      return departmentFiltersMap[deptKey];
    }
    return null;
  }, [departmentFiltersMap]);

  const getDesagsForIndicator = useCallback((key) => {
    if (!key) return [];
    if (desagregacionesMap[key]?.length) return desagregacionesMap[key];
    const normKey = key.replace(/-/g, '_');
    if (desagregacionesMap[normKey]?.length) return desagregacionesMap[normKey];
    for (const group of catalogo) {
      const found = group.items?.find((i) => i.id === key || i.id === normKey);
      if (found?.desags?.length) return found.desags;
    }
    return [];
  }, [desagregacionesMap, catalogo]);

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
    maxStep: 1,
    nombre: '',
    desc: '',
    area: 'Admisión',
    tipo: 'PERSONALIZADO',
    inds: [],
    annoMin: '2023',
    annoMax: '2026',
    formato: 'excel',
    graficos: false,
    tablas: true,
    desag: [],
    filtrosSeleccionados: [],
    editId: null,
  });

  const [indicatorSearch, setIndicatorSearch] = useState('');
  const [selectedDepCard, setSelectedDepCard] = useState('all');

  // Preview & Generation state
  const [currentPreviewReport, setCurrentPreviewReport] = useState(null);
  const [previewDataByIndicator, setPreviewDataByIndicator] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [progressText, setProgressText] = useState('Preparando indicadores…');

  // Historial view state
  const [histReporteFilter, setHistReporteFilter] = useState('todos');
  const [histFechaFilter, setHistFechaFilter] = useState('');
  const [histPage, setHistPage] = useState(1);
  const HIST_PER_PAGE = 5;

  const showToast = useCallback((message, severity = 'success') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  }, []);

  const areaName = useCallback((a) => {
    if (!a) return 'Institucional';
    if (AREA_KEY_TO_NAME[a]) return AREA_KEY_TO_NAME[a];
    if (a === 'Vinculación') return 'Vinculación con el Medio';
    if (a === 'institucional') return 'Institucional';
    return a;
  }, []);

  const formatDate = useCallback((iso) => {
    if (!iso) return '—';
    try {
      const clean = iso.includes('T') ? iso : `${iso}T00:00:00`;
      const d = new Date(clean);
      return d.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return iso;
    }
  }, []);

  // Normalizador de reportes
  const normalizeReporte = useCallback((r) => {
    const rawArea = r.area?.name || (r.departmentId ? AREA_KEY_TO_NAME[r.departmentId] : 'Institucional');
    return {
      ...r,
      id: r.id,
      name: r.nombre || 'Reporte sin nombre',
      desc: r.descripcion || '',
      area: rawArea || 'Institucional',
      areaKey: r.departmentId || r.area?.key || 'institucional',
      tipo: r.tipo || 'PERSONALIZADO',
      inds: Array.isArray(r.indicadores) ? r.indicadores : [],
      annoMin: r.filtros?.fromYear ? String(r.filtros.fromYear) : '2023',
      annoMax: r.filtros?.toYear ? String(r.filtros.toYear) : '2026',
      formato: (r.formato || 'XLSX').toUpperCase() === 'PDF' ? 'pdf' : 'excel',
      creadoPor: r.createdBy ? (r.createdBy === user?.id ? (user?.name || user?.username || 'Yo') : `Usuario #${r.createdBy}`) : 'Sistema',
      creadoEn: r.createdAt ? r.createdAt.slice(0, 10) : '',
      ultimo: r.updatedAt ? r.updatedAt.slice(0, 10) : '',
      desag: Array.isArray(r.filtros?.desag) ? r.filtros.desag : (Array.isArray(r.desag) ? r.desag : []),
      filtrosSeleccionados: Array.isArray(r.filtros?.filtrosSeleccionados)
        ? r.filtros.filtrosSeleccionados
        : (Array.isArray(r.filtrosSeleccionados) ? r.filtrosSeleccionados : []),
    };
  }, [user]);

  // Carga de reportes desde el backend
  const fetchReportes = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getReportes();
      const rawList = res?.data || [];
      const normalized = rawList.map(normalizeReporte);
      setAllReportes(normalized);
    } catch (err) {
      console.error('Error al cargar reportes:', err);
      showToast(err.message || 'No se pudieron cargar los reportes', 'error');
    } finally {
      setLoading(false);
    }
  }, [normalizeReporte, showToast]);

  // Carga de áreas y armado del catálogo dinámico consultando al backend
  const fetchAreasYCatalogo = useCallback(async () => {
    try {
      const resAreas = await getReporteAreas();
      const rawAreas = resAreas?.data || [];
      const areas = rawAreas.filter(
        (a) => a.key !== 'institucional' && a.name?.toLowerCase() !== 'institucional'
      );
      setAreasList(areas);

      // Cargar filtros temáticos por departamento desde el backend
      const filtersMap = {};
      const allYearsSet = new Set(['2023', '2024', '2025', '2026']);
      const areaKeysToFetch = [...new Set([...areas.map((a) => a.key), ...Object.keys(BACKEND_FILTER_CONFIGS)])]
        .filter((k) => k !== 'institucional');

      await Promise.all(
        areaKeysToFetch.map(async (key) => {
          try {
            const resFilters = await getDepartmentFilters(key);
            const rawFilters = resFilters?.data?.filters || {};
            const configs = BACKEND_FILTER_CONFIGS[key] || [];
            const filtrosList = [];

            for (const cfg of configs) {
              const rawOptions = (rawFilters[cfg.key] || [])
                .filter((opt) => opt !== null && opt !== undefined && String(opt).trim() !== '');
              if (rawOptions.length > 0) {
                filtrosList.push([cfg.label, rawOptions]);
              }
            }

            if (Array.isArray(rawFilters.years)) {
              rawFilters.years.forEach((y) => allYearsSet.add(String(y)));
            }

            if (filtrosList.length > 0) {
              const deptName = AREA_KEY_TO_NAME[key] || key;
              filtersMap[key] = { filtros: filtrosList };
              filtersMap[deptName] = { filtros: filtrosList };
            }
          } catch {
            // continuar si falla un departamento
          }
        })
      );

      setDepartmentFiltersMap(filtersMap);
      setAvailableYears(Array.from(allYearsSet).sort());

      // Si tenemos áreas, enriquecemos los indicadores de cada área consultando al backend
      const grupos = [];
      const dynamicDesags = {};
      const dynamicKeyMap = {};

      for (const area of areas) {
        try {
          const resKpis = await getDepartmentKpis(area.key);
          const kpis = resKpis?.data?.kpis || [];
          if (kpis.length > 0) {
            // Consultar el detalle de cada KPI en el backend para obtener sus desagregaciones reales
            const enrichedItems = await Promise.all(
              kpis.map(async (k) => {
                let desags = [];
                let defaultGroupBy = null;
                try {
                  const detailRes = await getIndicatorDetail(k.key);
                  const detail = detailRes?.data || detailRes;
                  const allowed = Array.isArray(detail?.allowedGroupBy) ? detail.allowedGroupBy : [];
                  const labels = detail?.dimensionLabels || {};
                  defaultGroupBy = detail?.groupBy || detail?.defaultGroupBy || (k.key === 'matricula_por_asignatura' ? 'asignatura' : null);

                  // Ocultar chip redundante de la dimensión por defecto si existe
                  const visibleAllowed = defaultGroupBy
                    ? allowed.filter((dim) => dim !== defaultGroupBy)
                    : allowed;

                  // Mapear cada dimensión permitida por el backend a su etiqueta legible
                  desags = visibleAllowed.map((dim) => {
                    const label = labels[dim] || dim;
                    dynamicKeyMap[label] = dim;
                    return label;
                  });

                  if (defaultGroupBy && labels[defaultGroupBy]) {
                    dynamicKeyMap[labels[defaultGroupBy]] = defaultGroupBy;
                  }

                  if (desags.length > 0) {
                    dynamicDesags[k.key] = desags;
                  }
                } catch (e) {
                  console.warn(`No se pudo obtener detalle/desagregaciones para ${k.key}:`, e.message);
                }

                return {
                  id: k.key,
                  name: k.name,
                  desc: k.description || '',
                  desags,
                  defaultGroupBy,
                };
              })
            );

            grupos.push({
              dep: area.name,
              key: area.key,
              items: enrichedItems,
            });
          }
        } catch {
          // continuar con siguiente área
        }
      }

      if (grupos.length > 0) {
        const cleanGrupos = grupos.filter(
          (g) => g.key !== 'institucional' && g.dep?.toLowerCase() !== 'institucional'
        );
        setCatalogo(cleanGrupos);
        setDesagregacionesMap(dynamicDesags);
        setDimensionNameToKey(dynamicKeyMap);

        // Preseleccionar en el builder las primeras desagregaciones devueltas por el backend
        setBuilder((prev) => {
          if (prev.desag.length > 0) return prev;
          const initialDesags = (prev.inds || [])
            .map((k) => {
              const itemInfo = getIndicatorInfo(k);
              if (itemInfo?.defaultGroupBy) return null;
              const opts = dynamicDesags[k] || [];
              return opts.length > 0 ? `${k}|${opts[0]}` : null;
            })
            .filter(Boolean);
          return { ...prev, desag: initialDesags };
        });
      }
    } catch (err) {
      console.warn('Usando catálogo fallback de reportes:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchReportes();
    fetchAreasYCatalogo();
  }, [fetchReportes, fetchAreasYCatalogo]);

  // Clasificación de reportes
  const predefinidosList = useMemo(() => {
    return allReportes.filter((r) => r.tipo === 'PREDEFINIDO');
  }, [allReportes]);

  const misReportes = useMemo(() => {
    return allReportes.filter((r) => r.tipo !== 'PREDEFINIDO');
  }, [allReportes]);

  const getIndicatorInfo = useCallback((id) => {
    // Normalizar id a guión bajo para búsqueda
    const normId = id.replace(/-/g, '_');
    for (const group of catalogo) {
      for (const item of group.items) {
        if (item.id === id || item.id === normId) {
          return { ...item, dep: group.dep };
        }
      }
    }
    // Fallback de catálogo histórico
    for (const group of FALLBACK_CATALOGO) {
      for (const item of group.items) {
        if (item.id === id || item.id === normId) {
          return { ...item, dep: group.dep };
        }
      }
    }
    return { id, name: id.replace(/_/g, ' '), desc: '', dep: 'General' };
  }, [catalogo]);

  // Sincronizar filtro de departamento cuando el usuario pertenece a un departamento específico
  useEffect(() => {
    if (isDepartmentRestricted && userDept) {
      setFiltroDepartamento(userDept.name);
    }
  }, [isDepartmentRestricted, userDept]);

  // Catálogo disponible para el constructor de reportes (filtrado si está restringido por departamento)
  const builderCatalogo = useMemo(() => {
    if (isDepartmentRestricted && userDept) {
      return catalogo.filter((group) => {
        return isReportFromUserDept({ area: group.dep, areaKey: group.key }, userDept);
      });
    }
    return catalogo;
  }, [catalogo, isDepartmentRestricted, userDept, isReportFromUserDept]);

  // Listas filtradas
  const filteredMisReportes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return misReportes.filter((r) => {
      if (isDepartmentRestricted && userDept && !isReportFromUserDept(r, userDept)) return false;
      if (filtroDepartamento !== 'todas' && r.area !== filtroDepartamento && r.areaKey !== filtroDepartamento) return false;
      if (q && !r.name.toLowerCase().includes(q)) return false;
      if (filtroFormato !== 'todos' && r.formato !== filtroFormato) return false;
      if (filtroCreadoPor !== 'todos' && (r.creadoPor || '') !== filtroCreadoPor) return false;
      if (filtroDesde && r.creadoEn < filtroDesde) return false;
      if (filtroHasta && r.creadoEn > filtroHasta) return false;
      return true;
    });
  }, [misReportes, searchQuery, filtroDepartamento, filtroFormato, filtroCreadoPor, filtroDesde, filtroHasta, isDepartmentRestricted, userDept, isReportFromUserDept]);

  const filteredPredefinidos = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return predefinidosList.filter((p) => {
      if (isDepartmentRestricted && userDept && !isReportFromUserDept(p, userDept)) return false;
      if (filtroDepartamento !== 'todas' && p.area !== filtroDepartamento && p.areaKey !== filtroDepartamento) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (filtroFormato !== 'todos' && p.formato !== filtroFormato) return false;
      return true;
    });
  }, [predefinidosList, searchQuery, filtroDepartamento, filtroFormato, isDepartmentRestricted, userDept, isReportFromUserDept]);

  // Carga de historial cuando se abre la vista o cambia de reporte
  const loadHistorial = useCallback(async (reportId = 'todos') => {
    try {
      if (reportId !== 'todos') {
        const res = await getReporteEjecuciones(reportId);
        const ejecs = res?.data || [];
        const reportTarget = allReportes.find((r) => String(r.id) === String(reportId));
        setHistorialList(
          ejecs.map((e) => ({
            id: `ej-${e.id}`,
            reporteId: reportId,
            reporteName: reportTarget?.name || `Reporte #${reportId}`,
            usuario: user?.name || user?.username || 'Usuario',
            fecha: e.generadoEn ? e.generadoEn.slice(0, 10) : '',
            formato: e.formato || 'XLSX',
            estado: e.estado === 'LISTO' ? 'ok' : e.estado === 'FALLIDO' ? 'error' : 'pending',
          }))
        );
      } else {
        // Cargar ejecuciones combinadas de los reportes existentes
        const promesas = allReportes.slice(0, 5).map(async (r) => {
          try {
            const res = await getReporteEjecuciones(r.id);
            return (res?.data || []).map((e) => ({
              id: `ej-${e.id}`,
              reporteId: r.id,
              reporteName: r.name,
              usuario: user?.name || user?.username || 'Usuario',
              fecha: e.generadoEn ? e.generadoEn.slice(0, 10) : '',
              formato: e.formato || 'XLSX',
              estado: e.estado === 'LISTO' ? 'ok' : e.estado === 'FALLIDO' ? 'error' : 'pending',
            }));
          } catch {
            return [];
          }
        });
        const resultados = await Promise.all(promesas);
        setHistorialList(resultados.flat());
      }
    } catch (err) {
      console.error('Error al cargar historial:', err);
    }
  }, [allReportes, user]);

  // Historial filtrado & paginado
  const filteredHistorial = useMemo(() => {
    return historialList.filter((h) => {
      if (histReporteFilter !== 'todos' && String(h.reporteId) !== String(histReporteFilter)) return false;
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
    const initialArea = isDepartmentRestricted && userDept
      ? userDept.name
      : (user?.departmentId ? AREA_KEY_TO_NAME[user.departmentId] || 'Admisión' : 'Admisión');

    setBuilder({
      step: 1,
      maxStep: 1,
      nombre: '',
      desc: '',
      area: initialArea,
      tipo: 'PERSONALIZADO',
      inds: [],
      annoMin: '2023',
      annoMax: '2026',
      formato: 'excel',
      graficos: false,
      tablas: true,
      desag: [],
      filtrosSeleccionados: [],
      editId: null,
    });
    setIndicatorSearch('');
    setSelectedDepCard(isDepartmentRestricted && userDept ? userDept.name : 'all');
    setViewMode('constructor');
  };

  const handleUseAsBase = (reportOrPredef) => {
    if (isDepartmentRestricted && userDept && !isReportFromUserDept(reportOrPredef, userDept)) {
      showToast(`Solo tienes autorización para utilizar plantillas del departamento de ${userDept.name}.`, 'warning');
      return;
    }

    const baseName = (reportOrPredef.name || '').replace(/\s*\(copia(?:\s*\d*)?\)\s*$/, '');
    const prefix = `${baseName} (copia`;
    const existing = misReportes.filter((r) => r.name.startsWith(prefix)).length;
    const newName = existing === 0 ? `${baseName} (copia)` : `${baseName} (copia ${existing})`;

    const inds = [...(reportOrPredef.inds || reportOrPredef.indicadores || [])];
    let desags = reportOrPredef.desag ? [...reportOrPredef.desag] : [];
    // Asegurar que cada indicador sin defaultGroupBy tenga al menos la primera opción preseleccionada
    inds.forEach((k) => {
      const itemInfo = getIndicatorInfo(k);
      if (!itemInfo?.defaultGroupBy && !desags.some((d) => d.startsWith(`${k}|`))) {
        const opts = getDesagsForIndicator(k);
        if (opts.length > 0) desags.push(`${k}|${opts[0]}`);
      }
    });

    const chosenArea = isDepartmentRestricted && userDept
      ? userDept.name
      : (reportOrPredef.area || 'Admisión');

    setBuilder({
      step: 1,
      maxStep: 4,
      nombre: newName,
      desc: reportOrPredef.desc || reportOrPredef.descripcion || '',
      area: chosenArea,
      tipo: 'PERSONALIZADO',
      inds,
      annoMin: reportOrPredef.annoMin || '2023',
      annoMax: reportOrPredef.annoMax || '2026',
      formato: reportOrPredef.formato || 'excel',
      graficos: false,
      tablas: true,
      desag: desags,
      filtrosSeleccionados: reportOrPredef.filtrosSeleccionados ? [...reportOrPredef.filtrosSeleccionados] : [],
      editId: null,
    });
    setIndicatorSearch('');
    setSelectedDepCard(isDepartmentRestricted && userDept ? userDept.name : 'all');
    setViewMode('constructor');
    showToast(`Iniciando reporte basado en «${reportOrPredef.name}»`);
  };

  const handleEditReport = (report) => {
    if (isDepartmentRestricted && userDept && !isReportFromUserDept(report, userDept)) {
      showToast(`Solo tienes autorización para editar reportes del departamento de ${userDept.name}.`, 'warning');
      return;
    }

    const inds = [...(report.inds || report.indicadores || [])];
    let desags = report.desag ? [...report.desag] : [];
    // Asegurar que cada indicador sin defaultGroupBy tenga al menos la primera opción preseleccionada
    inds.forEach((k) => {
      const itemInfo = getIndicatorInfo(k);
      if (!itemInfo?.defaultGroupBy && !desags.some((d) => d.startsWith(`${k}|`))) {
        const opts = getDesagsForIndicator(k);
        if (opts.length > 0) desags.push(`${k}|${opts[0]}`);
      }
    });

    const chosenArea = isDepartmentRestricted && userDept
      ? userDept.name
      : (report.area || 'Admisión');

    setBuilder({
      step: 1,
      maxStep: 4,
      nombre: report.name || report.nombre,
      desc: report.desc || report.descripcion || '',
      area: chosenArea,
      tipo: report.tipo || 'PERSONALIZADO',
      inds,
      annoMin: report.annoMin || '2023',
      annoMax: report.annoMax || '2026',
      formato: report.formato || 'excel',
      graficos: false,
      tablas: report.tablas !== undefined ? report.tablas : true,
      desag: desags,
      filtrosSeleccionados: report.filtrosSeleccionados ? [...report.filtrosSeleccionados] : [],
      editId: report.id,
    });
    setIndicatorSearch('');
    setSelectedDepCard(isDepartmentRestricted && userDept ? userDept.name : 'all');
    setViewMode('constructor');
  };

  const handleAreaChange = (newArea) => {
    if (isDepartmentRestricted && userDept && newArea !== userDept.name) {
      return;
    }

    setBuilder((prev) => ({
      ...prev,
      area: newArea,
      inds: prev.editId ? prev.inds : [],
      desag: prev.editId ? prev.desag : [],
      filtrosSeleccionados: [],
    }));
  };

  const handleOpenDeleteModal = (id) => {
    const target = allReportes.find((r) => r.id === id);
    if (target && isDepartmentRestricted && userDept && !isReportFromUserDept(target, userDept)) {
      showToast(`Solo tienes autorización para eliminar reportes del departamento de ${userDept.name}.`, 'warning');
      return;
    }

    setDeleteTargetId(id);
    setDeleteConfirmInput('');
    setDeleteModalOpen(true);
    setKebabAnchorEl(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const target = allReportes.find((r) => r.id === deleteTargetId);
      if (target && isDepartmentRestricted && userDept && !isReportFromUserDept(target, userDept)) {
        showToast(`No tienes permisos para eliminar este reporte.`, 'warning');
        setDeleteModalOpen(false);
        return;
      }

      await deleteReporte(deleteTargetId);
      setDeleteModalOpen(false);
      setDeleteTargetId(null);
      setDeleteConfirmInput('');
      showToast(`Reporte «${target?.name || ''}» eliminado con éxito`);
      await fetchReportes();
    } catch (err) {
      showToast(err.message || 'Error al eliminar reporte', 'error');
    }
  };

  const mapIndicatorDetailToView = useCallback((rawDetail, fallbackInfo, options = {}) => {
    const { hasYearSelected = false, thematicGroupBy = null } = options;
    if (!rawDetail || !rawDetail.hasData) {
      return {
        val: 'Sin datos',
        desc: rawDetail?.description || fallbackInfo?.desc || 'Sin datos para el período seleccionado.',
        table: [],
        chart: [],
        labels: [],
        disaggregated: false,
        dimensionName: null,
        isMatrix: false,
        matrixYears: [],
        matrixRows: [],
      };
    }

    const unit = rawDetail.unit ? ` ${rawDetail.unit}` : '';
    const val = rawDetail.formattedTotal ? `${rawDetail.formattedTotal}${unit}` : `${rawDetail.total ?? 0}${unit}`;
    const desc = rawDetail.description || fallbackInfo?.desc || '';

    // 1. Desglose Matricial Temporal por Categoría (ej: Asignatura x Años)
    // Solo se activa si el usuario seleccionó explícitamente el chip de Año junto con la dimensión temática
    let isMatrix = false;
    let matrixYears = [];
    let matrixRows = [];

    const shouldShowMatrix = hasYearSelected && thematicGroupBy;

    if (
      shouldShowMatrix &&
      Array.isArray(rawDetail.series) &&
      rawDetail.series.length > 0 &&
      rawDetail.series.some((s) => Array.isArray(s.points) && s.points.length > 0)
    ) {
      // Recopilar todos los años presentes en los puntos de las series de forma ordenada
      const distinctYears = Array.from(
        new Set(
          rawDetail.series.flatMap((s) =>
            (s.points || []).map((p) => Number(p.year)).filter((y) => !isNaN(y) && y > 0)
          )
        )
      ).sort((a, b) => a - b);

      if (distinctYears.length > 0) {
        isMatrix = true;
        matrixYears = distinctYears;
        matrixRows = rawDetail.series.map((s) => {
          const label = String(s.label || 'Sin etiqueta');
          const pointMap = new Map(
            (s.points || []).map((p) => [
              Number(p.year),
              typeof p.value === 'number' ? p.value : Number(p.value) || 0,
            ])
          );
          const values = distinctYears.map((yr) => pointMap.get(yr) ?? 0);
          return { label, values };
        });
      }
    }

    // 2. Tabla Plana Convencional (fallback o indicadores no matriciales)
    const tableRows = (rawDetail.table || rawDetail.series || []).map((row) => {
      const label = String(row.label ?? row.year ?? row.category ?? row.periodo ?? 'Total');
      const value = typeof row.value === 'number' ? row.value : Number(row.value) || 0;
      return [label, value];
    });

    const chart = tableRows.map(([, v]) => v);
    const labels = tableRows.map(([l]) => l);

    const dimensionName = rawDetail.groupBy
      ? (rawDetail.dimensionLabels?.[rawDetail.groupBy] || rawDetail.groupBy)
      : null;

    return {
      val,
      desc,
      table: tableRows,
      chart,
      labels,
      disaggregated: Boolean(rawDetail.disaggregated),
      dimensionName,
      isMatrix,
      matrixYears,
      matrixRows,
    };
  }, []);

  const handleDownloadDoc = async (customReport = null) => {
    const target = customReport || currentPreviewReport;
    if (!target) return;
    if (isDepartmentRestricted && userDept && !isReportFromUserDept(target, userDept)) {
      showToast(`Solo tienes autorización para descargar reportes del departamento de ${userDept.name}.`, 'warning');
      return;
    }
    try {
      showToast(`Descargando reporte «${target.name || 'Reporte'}»...`);
      await descargarReporte(target.id, `${target.name || 'reporte'}.xlsx`);
      showToast(`Reporte «${target.name || 'Reporte'}» descargado con éxito`);
      await fetchReportes();
    } catch (err) {
      showToast(err.message || 'Error al descargar documento', 'error');
    }
  };

  const handleStartGenerate = async (report) => {
    if (!report) return;
    if (isDepartmentRestricted && userDept && !isReportFromUserDept(report, userDept)) {
      showToast(`Solo tienes autorización para generar reportes del departamento de ${userDept.name}.`, 'warning');
      return;
    }

    // Si el formato es Excel, descargar directamente y permanecer en la lista principal sin abrir preview
    if (report.formato === 'excel' || report.formato === 'xlsx') {
      setViewMode('lista');
      return handleDownloadDoc(report);
    }

    setCurrentPreviewReport(report);
    setViewMode('preview');
    setIsGenerating(true);
    setProgressValue(15);
    setProgressText('Consultando indicadores desde la base de datos…');

    const inds = report.indicadores || report.inds || [];
    const baseFiltros = report.filtros || {
      fromYear: report.annoMin,
      toYear: report.annoMax,
    };

    // Extraer baseFiltros omitiendo cualquier groupBy general heredado
    const { groupBy: _ignoredGlobalGroupBy, ...cleanBaseFiltros } = baseFiltros;

    const detailsMap = {};

    try {
      const promises = inds.map(async (key, idx) => {
        try {
          // Determinar qué dimensiones tiene asignadas este indicador (soporta multi-chip: Dimensión + Año)
          const reportDesags = report.desag || [];
          const activePrefix = `${key}|`;
          const chosenDesagLabels = reportDesags
            .filter((x) => x.startsWith(activePrefix))
            .map((x) => x.split('|')[1]);

          const chosenDimKeys = chosenDesagLabels.map((l) => dimensionNameToKey[l] || l);
          const hasYearSelected = chosenDimKeys.some(
            (k) => k === 'year' || k?.toLowerCase() === 'año' || k?.toLowerCase() === 'ano'
          );
          const thematicGroupBy = chosenDimKeys.find(
            (k) => k !== 'year' && k?.toLowerCase() !== 'año' && k?.toLowerCase() !== 'ano'
          );

          const itemInfo = getIndicatorInfo(key);
          const indicatorDefaultDim = itemInfo.defaultGroupBy || (key === 'matricula_por_asignatura' ? 'asignatura' : null);
          const effectiveThematicDim = thematicGroupBy || indicatorDefaultDim || null;

          let queryGroupBy = effectiveThematicDim || (hasYearSelected ? 'year' : undefined);

          // Extraer filtros temáticos seleccionados
          const parsedSelectedFilters = {};
          const selFilters = report.filtros?.filtrosSeleccionados || report.filtrosSeleccionados || [];
          for (const item of selFilters) {
            const parts = item.split('|');
            if (parts.length >= 3) {
              const [, filtroName, opt] = parts;
              const paramKey = THEMATIC_FILTER_PARAM_MAP[filtroName];
              if (paramKey) {
                if (!parsedSelectedFilters[paramKey]) {
                  parsedSelectedFilters[paramKey] = [];
                }
                parsedSelectedFilters[paramKey].push(opt);
              }
            }
          }

          const queryFiltros = {
            ...cleanBaseFiltros,
            fromYear: baseFiltros.fromYear || report.annoMin || 2023,
            toYear: baseFiltros.toYear || report.annoMax || 2026,
            ...(queryGroupBy ? { groupBy: queryGroupBy } : {}),
            ...parsedSelectedFilters,
          };

          // Limpiar propiedades internas que no correspondan a parámetros de query
          delete queryFiltros.desag;
          delete queryFiltros.filtrosSeleccionados;
          delete queryFiltros.indicatorGroupBys;

          const res = await getIndicatorDetail(key, queryFiltros);
          const raw = res?.data || res;
          detailsMap[key] = mapIndicatorDetailToView(raw, getIndicatorInfo(key), {
            hasYearSelected,
            thematicGroupBy: effectiveThematicDim,
          });
        } catch (err) {
          console.warn(`No se pudo obtener detalle para ${key}:`, err.message);
          detailsMap[key] = {
            val: 'Sin datos',
            desc: getIndicatorInfo(key).desc,
            table: [],
            chart: [],
            labels: [],
            disaggregated: false,
            dimensionName: null,
          };
        }
        setProgressValue(Math.min(90, Math.round(15 + ((idx + 1) / Math.max(1, inds.length)) * 75)));
      });

      await Promise.all(promises);
      setPreviewDataByIndicator(detailsMap);

      setProgressValue(100);
      setProgressText('¡Documento listo!');

      setTimeout(async () => {
        setIsGenerating(false);
        // Si el formato es Excel, disparar descarga automática
        if (report.formato === 'excel' || report.formato === 'xlsx') {
          try {
            await descargarReporte(report.id, `${report.name || 'reporte'}.xlsx`);
            showToast(`Reporte «${report.name}» descargado con éxito`);
          } catch (err) {
            console.error('Error al descargar archivo:', err);
            showToast(err.message || 'Error al descargar archivo del reporte', 'error');
          }
        }
        await fetchReportes();
      }, 400);
    } catch (err) {
      console.error('Error en generación de reporte:', err);
      setIsGenerating(false);
      showToast('Error al procesar los datos del reporte', 'error');
    }
  };

  const handleSaveBuilder = async (andGenerate = false) => {
    const isEditing = Boolean(builder.editId);
    const chosenArea = isDepartmentRestricted && userDept ? userDept.name : builder.area;
    const departmentKey = AREA_NAME_TO_KEY[chosenArea] || (isDepartmentRestricted && userDept ? userDept.key : chosenArea);

    // Construir mapa de groupBy por indicador para backend
    const indicatorGroupBys = {};
    for (const k of builder.inds) {
      const chosenList = (builder.desag || [])
        .filter((x) => x.startsWith(`${k}|`))
        .map((x) => x.split('|')[1]);

      const thematicDim = chosenList.find(
        (dim) => dim !== 'Año' && dim?.toLowerCase() !== 'año' && dim?.toLowerCase() !== 'ano'
      );
      if (thematicDim) {
        indicatorGroupBys[k] = dimensionNameToKey[thematicDim] || thematicDim;
      }
    }

    // Convertir filtrosSeleccionados a parámetros temáticos de backend
    const parsedBackendFilters = {};
    for (const item of (builder.filtrosSeleccionados || [])) {
      const parts = item.split('|');
      if (parts.length >= 3) {
        const [, filtroName, opt] = parts;
        const paramKey = THEMATIC_FILTER_PARAM_MAP[filtroName];
        if (paramKey) {
          if (!parsedBackendFilters[paramKey]) {
            parsedBackendFilters[paramKey] = [];
          }
          parsedBackendFilters[paramKey].push(opt);
        }
      }
    }

    const payload = {
      nombre: builder.nombre.trim(),
      descripcion: builder.desc.trim(),
      tipo: isRector ? builder.tipo : 'PERSONALIZADO',
      indicadores: builder.inds,
      filtros: {
        fromYear: Number(builder.annoMin),
        toYear: Number(builder.annoMax),
        desag: builder.desag,
        filtrosSeleccionados: builder.filtrosSeleccionados,
        indicatorGroupBys,
        ...parsedBackendFilters,
      },
      departmentId: departmentKey === 'institucional' ? null : departmentKey,
      formato: builder.formato === 'pdf' ? 'PDF' : 'XLSX',
      activo: true,
    };

    try {
      setLoading(true);
      let saved = null;
      if (isEditing) {
        const res = await updateReporte(builder.editId, payload);
        saved = normalizeReporte(res.data);
        showToast('Reporte actualizado con éxito');
      } else {
        const res = await createReporte(payload);
        saved = normalizeReporte(res.data);
        showToast('Reporte creado y guardado con éxito');
      }

      await fetchReportes();

      if (andGenerate && saved) {
        if (saved.formato === 'excel' || saved.formato === 'xlsx') {
          setViewMode('lista');
          handleDownloadDoc(saved);
        } else {
          handleStartGenerate(saved);
        }
      } else {
        setViewMode('lista');
      }
    } catch (err) {
      console.error('Error al guardar reporte:', err);
      showToast(err.message || 'No se pudo guardar el reporte', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenHistorial = (reportId = 'todos') => {
    setHistReporteFilter(reportId);
    setHistFechaFilter('');
    setHistPage(1);
    setViewMode('historial');
    setKebabAnchorEl(null);
    loadHistorial(reportId);
  };

  const handleBackToList = () => {
    setViewMode('lista');
  };

  return {
    navigate,
    user,
    viewMode,
    setViewMode,
    isAdmin,
    isRector,
    isCalidad,
    userDept,
    isDepartmentRestricted,
    canCreateReport,
    canCreatePredefinido,
    builderCatalogo,
    loading,
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
    predefinidosList,
    catalogo,
    areasList,
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
    selectedDepCard,
    setSelectedDepCard,
    handleOpenNewBuilder,
    handleUseAsBase,
    handleEditReport,
    handleAreaChange,
    handleStartGenerate,
    handleSaveBuilder,
    handleOpenHistorial,
    handleBackToList,
    currentPreviewReport,
    previewDataByIndicator,
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
    getDesagsForIndicator,
    desagregacionesMap,
    departmentFiltersMap,
    availableYears,
    getFiltersForArea,
    areaName,
    formatDate,
  };
};
