import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { styles } from './LandingPage.styles';
import { getDashboardSummary } from '../../../services/piadiApi';
import logoEcas from '../../../assets/logo_ECAS_white.svg';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  LinearProgress,
  Avatar,
  IconButton,
  Divider,
  Drawer,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  TrackChanges as MetasIcon,
  UploadFile as CargaIcon,
  Shield as AuditoriaIcon,
  TableChart as TablaIcon,
  ExitToApp as LogoutIcon,
  ArrowUpward as ArrowUpIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// =========================================================================
// ESTRUCTURA DE DATOS INTERACTIVOS (TAB_DATA)
// =========================================================================
const TAB_DATA = {
  0: { // Resumen (Datos por defecto)
    kpis: [
      { title: 'Matrícula total institucional', value: '3,842', trend: '8%', trendDesc: 'vs semestre anterior', isBlue: true },
      { title: 'Tasa de aprobación general', value: '86%', trend: '2%', trendDesc: 'vs semestre anterior', isBlue: false },
      { title: 'Cursos Ed. Continua dictados', value: '24', trend: '4%', trendDesc: 'vs periodo anterior', isBlue: false },
      { title: 'Proyectos de innovación activos', value: '15', trend: '3%', trendDesc: 'nuevos este semestre', isBlue: true },
      { title: 'Convenios VcM vigentes', value: '45', trend: '8', trendDesc: 'nuevos este año', isBlue: false },
      { title: 'Tasa de titulación', value: '78%', trend: '5%', trendDesc: 'vs cohorte anterior', isBlue: false },
    ],
    goals: [
      { title: 'Total de 200 matriculados en cursos', status: 'completada', statusText: 'Completada', progress: 100, progressValue: '120%', start: '12-03-2026', end: '14-06-2026' },
      { title: 'Total de 20 cursos ejecutados', status: 'progreso', statusText: 'En progreso', progress: 40, progressValue: '40%', start: '12-03-2026', end: '14-06-2026' },
      { title: 'Reducir tasa de abandono por debajo del 30%', status: 'atencion', statusText: 'Requiere atención', progress: 85, progressValue: '85%', start: '12-03-2026', end: '14-06-2026' }
    ]
  },
  1: { // Admisión
    kpis: [
      { title: 'Postulantes Nuevos', value: '1,420', trend: '15%', trendDesc: 'vs año anterior', isBlue: true },
      { title: 'Tasa de Aceptación', value: '72%', trend: '3%', trendDesc: 'vs meta', isBlue: false },
      { title: 'Matrículas procesadas', value: '980', trend: '5%', trendDesc: 'este periodo', isBlue: false },
      { title: 'Cupos disponibles', value: '120', trend: '-10%', trendDesc: 'vacantes', isBlue: true },
      { title: 'Becas de admisión otorgadas', value: '85', trend: '12', trendDesc: 'nuevas asignaciones', isBlue: false },
      { title: 'Tasa de deserción temprana', value: '1.8%', trend: '-0.5%', trendDesc: 'mejorado', isBlue: false }
    ],
    goals: [
      { title: 'Completar matrícula carreras nocturnas', status: 'progreso', statusText: 'En progreso', progress: 85, progressValue: '85%', start: '02-01-2026', end: '15-04-2026' },
      { title: 'Digitalizar firma de pagarés de matrícula', status: 'completada', statusText: 'Completada', progress: 100, progressValue: '100%', start: '10-12-2025', end: '28-02-2026' }
    ]
  },
  2: { // Relaciones Estudiantiles
    kpis: [
      { title: 'Atenciones Bienestar', value: '940', trend: '10%', trendDesc: 'este periodo', isBlue: true },
      { title: 'Tasa participación talleres', value: '58%', trend: '6%', trendDesc: 'vs año anterior', isBlue: false },
      { title: 'Postulaciones a becas Junaeb', value: '450', trend: '4%', trendDesc: 'procesadas', isBlue: false },
      { title: 'Actividades recreativas ejecutadas', value: '12', trend: '2', trendDesc: 'nuevos talleres', isBlue: true },
      { title: 'Satisfacción general DAE', value: '91%', trend: '2.4%', trendDesc: 'en encuestas', isBlue: false },
      { title: 'Casos socioeconómicos resueltos', value: '188', trend: '95%', trendDesc: 'resolución', isBlue: false }
    ],
    goals: [
      { title: 'Implementar programa de salud mental 2026', status: 'progreso', statusText: 'En progreso', progress: 60, progressValue: '60%', start: '01-03-2026', end: '30-07-2026' },
      { title: 'Habilitar nuevo portal de becas y créditos internos', status: 'atencion', statusText: 'Requiere atención', progress: 45, progressValue: '45%', start: '15-02-2026', end: '30-06-2026' }
    ]
  },
  3: { // Desarrollo Curricular
    kpis: [
      { title: 'Programas de estudio actualizados', value: '8', trend: '25%', trendDesc: 'vs meta anual', isBlue: true },
      { title: 'Evaluaciones docentes completadas', value: '94%', trend: '1.2%', trendDesc: 'participación', isBlue: false },
      { title: 'Asignaturas rediseñadas', value: '12', trend: '3', trendDesc: 'bajo enfoque competencias', isBlue: false },
      { title: 'Acreditaciones vigentes', value: '4', trend: '100%', trendDesc: 'en regla', isBlue: true },
      { title: 'Proyectos de docencia interna', value: '6', trend: '1', trendDesc: 'nuevos proyectos', isBlue: false },
      { title: 'Uso de plataforma virtual', value: '88%', trend: '4%', trendDesc: 'docentes activos', isBlue: false }
    ],
    goals: [
      { title: 'Rediseño de mallas curriculares del área de Finanzas', status: 'progreso', statusText: 'En progreso', progress: 70, progressValue: '70%', start: '01-01-2026', end: '30-10-2026' },
      { title: 'Capacitación docente en metodologías activas', status: 'completada', statusText: 'Completada', progress: 100, progressValue: '100%', start: '05-01-2026', end: '10-03-2026' }
    ]
  },
  4: { // Innovación
    kpis: [
      { title: 'Patentes en trámite', value: '3', trend: '50%', trendDesc: 'nuevas solicitudes', isBlue: true },
      { title: 'Fondos de investigación adjudicados', value: '$85M', trend: '18%', trendDesc: 'incremento anual', isBlue: false },
      { title: 'Publicaciones científicas (Scopus/WoS)', value: '14', trend: '2', trendDesc: 'este semestre', isBlue: false },
      { title: 'Semilleros de investigación activos', value: '8', trend: '3', trendDesc: 'nuevos grupos', isBlue: true },
      { title: 'Convenios internacionales de I+D', value: '5', trend: '1', trendDesc: 'vigentes', isBlue: false },
      { title: 'Tasa transferencia tecnológica', value: '30%', trend: '5%', trendDesc: 'crecimiento', isBlue: false }
    ],
    goals: [
      { title: 'Desarrollar prototipo de IA para análisis financiero', status: 'progreso', statusText: 'En progreso', progress: 50, progressValue: '50%', start: '10-02-2026', end: '15-11-2026' },
      { title: 'Lanzar concurso de innovación para estudiantes', status: 'completada', statusText: 'Completada', progress: 100, progressValue: '100%', start: '01-03-2026', end: '30-05-2026' }
    ]
  },
  5: { // Educación Continua
    kpis: [
      { title: 'Matrícula diplomados', value: '320', trend: '12%', trendDesc: 'este ciclo', isBlue: true },
      { title: 'Tasa de retención programas', value: '95%', trend: '0.8%', trendDesc: 'satisfechos', isBlue: false },
      { title: 'Programas de capacitación corporativa', value: '15', trend: '4', trendDesc: 'nuevas empresas', isBlue: false },
      { title: 'Ingresos por venta de cursos', value: '$120M', trend: '20%', trendDesc: 'vs trimestre anterior', isBlue: true },
      { title: 'Docentes del sector industrial', value: '82%', trend: '5%', trendDesc: 'expertos activos', isBlue: false },
      { title: 'Satisfacción de relatores', value: '4.8/5.0', trend: '0.2', trendDesc: 'evaluación', isBlue: false }
    ],
    goals: [
      { title: 'Diseñar 5 nuevos diplomados online', status: 'progreso', statusText: 'En progreso', progress: 80, progressValue: '80%', start: '05-01-2026', end: '30-06-2026' },
      { title: 'Auditoría Sence para cursos de capacitación', status: 'atencion', statusText: 'Requiere atención', progress: 20, progressValue: '20%', start: '10-04-2026', end: '30-08-2026' }
    ]
  },
  6: { // Vinculación con el Medio
    kpis: [
      { title: 'Convenios con empresas vigentes', value: '142', trend: '15', trendDesc: 'nuevos este año', isBlue: true },
      { title: 'Proyectos de asistencia técnica', value: '28', trend: '8%', trendDesc: 'en ejecución', isBlue: false },
      { title: 'Tasa inserción laboral egresados', value: '88%', trend: '2%', trendDesc: 'primer año', isBlue: false },
      { title: 'Actividades de extensión abiertas', value: '35', trend: '5', trendDesc: 'charlas/seminarios', isBlue: true },
      { title: 'Beneficiarios comunitarios', value: '4,200', trend: '18%', trendDesc: 'alcance social', isBlue: false },
      { title: 'Alumnos en prácticas profesionales', value: '450', trend: '10%', trendDesc: 'colocación efectiva', isBlue: false }
    ],
    goals: [
      { title: 'Renovación de alianza con red de colegios técnicos', status: 'completada', statusText: 'Completada', progress: 100, progressValue: '100%', start: '05-01-2026', end: '12-04-2026' }
    ]
  }
};

// Mapeo de colores específicos por departamento según el requerimiento.
const DEPARTMENT_COLORS = {
  0: '#1E2875', // Resumen (Azul institucional)
  1: '#46D19F', // Educación Continua (Turquesa claro)
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [activeMenu, setActiveMenu] = useState('Inicio');
  
  // Estado para controlar la apertura del menú lateral en móviles
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false); // Estado para abrir el Centro de Ayuda
  const [ecApiData, setEcApiData] = useState(null);

  useEffect(() => {
    getDashboardSummary({ department: 'educacion_continua', year: 2026 })
      .then(res => {
        if (!res?.success || !res.data) return;
        // Formato real: data.departments[0].cards[{ indicatorKey, value, hasData }]
        const deptData = res.data?.departments?.find(d => d.departmentId === 'educacion_continua');
        const cards = deptData?.cards ?? [];
        if (!cards.some(c => c.hasData)) return; // sin datos reales, mantener mock
        const map = {};
        cards.forEach(c => { map[c.indicatorKey] = c; });
        setEcApiData(map);
      })
      .catch(() => {});
  }, []);

  // Datos de las Preguntas Frecuentes (FAQ) del Centro de Ayuda
  const faqData = [
    {
      q: '¿Qué son las metas y cómo se usan?',
      a: 'Las metas son objetivos específicos que puedes rastrear a lo largo del tiempo. Cada meta tiene un progreso medido en porcentaje, fechas de inicio y término, y un estado (Completada, En curso, o Superada). Las barras de progreso muestran visualmente qué tan cerca estás de cumplir cada meta.'
    },
    {
      q: '¿Cómo interpreto los indicadores?',
      a: 'Los indicadores muestran métricas clave como "Total de cursos dictados" o "Tasa de ejecución". El número principal es el valor actual, y la flecha con porcentaje indica el cambio comparado con el periodo anterior. Una flecha verde hacia arriba significa mejora.'
    },
    {
      q: '¿Cómo navego entre secciones?',
      a: 'Usa el menú lateral izquierdo para moverte entre Inicio, Dashboards, Metas, y otras secciones. La sección activa se muestra con fondo verde azulado y una barra blanca en el borde izquierdo.'
    },
    {
      q: '¿Qué significan los colores en las metas?',
      a: 'Verde indica meta completada (100% o más), amarillo indica meta en progreso (menos de 100%), y rojo indica que se ha superado el límite de una meta negativa (como "tasa de abandono debajo del 30%").'
    },
    {
      q: '¿Cómo puedo ver más detalles?',
      a: 'Haz clic en el botón "Detalles" junto a cada meta, o en "Ingresar a Dashboard" para ver análisis más profundos con gráficos interactivos.'
    },
    {
      q: '¿Cómo funcionan las métricas?',
      isRich: true
    }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Obtiene los datos del departamento seleccionado según la pestaña activa.
  // Tab 0 = Resumen (mock, pendiente endpoint real). Tab 1 = Educación Continua (solo datos reales).
  const currentData = (() => {
    if (activeTab === 1) {
      const get = (key) => ecApiData?.[key]?.value;
      const oferta = get('oferta_programada');
      const dictados = get('cursos_dictados');
      const ejecucion = get('tasa_ejecucion');
      const matricula = get('matricula_por_programa');
      const aprobacion = get('tasa_aprobacion');
      const ingresos = get('ingresos_generados');
      return {
        kpis: [
          { title: 'Oferta programada', value: oferta != null ? String(oferta) : 'Sin datos', trend: '↑', trendDesc: 'programas 2026', isBlue: true },
          { title: 'Cursos dictados', value: dictados != null ? String(dictados) : 'Sin datos', trend: '↑', trendDesc: 'ejecutados 2026', isBlue: false },
          { title: 'Tasa de ejecución', value: ejecucion != null ? `${ejecucion}%` : 'Sin datos', trend: '↑', trendDesc: 'cursos ejecutados', isBlue: false },
          { title: 'Matrícula total', value: matricula != null ? Number(matricula).toLocaleString('es-CL') : 'Sin datos', trend: '↑', trendDesc: 'participantes 2026', isBlue: true },
          { title: 'Tasa de aprobación', value: aprobacion != null ? `${aprobacion}%` : 'Sin datos', trend: '↑', trendDesc: 'aprobados del total', isBlue: false },
          { title: 'Ingresos netos', value: ingresos != null ? `$${Number(ingresos).toLocaleString('es-CL')}` : 'Sin datos', trend: '↑', trendDesc: 'CLP facturados', isBlue: false },
        ],
        goals: []
      };
    }
    return TAB_DATA[0]; // Resumen — pendiente de endpoint real
  })();
  
  // Obtiene el color de fondo personalizado para este departamento
  const deptColor = DEPARTMENT_COLORS[activeTab] || '#1E2875';

  // Forzamos el color del texto a blanco para todas las tarjetas de color
  const isLight = false;
  const customTextColor = '#ffffff';

  // Devuelve el icono correcto para cada estado de meta
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completada':
        return <CheckCircleIcon sx={{ fontSize: '0.9rem' }} />;
      case 'progreso':
        return <AccessTimeIcon sx={{ fontSize: '0.9rem' }} />;
      case 'atencion':
        return <WarningIcon sx={{ fontSize: '0.9rem' }} />;
      default:
        return null;
    }
  };

  // =========================================================================
  // SUB-COMPONENTE: CONTENIDO DEL SIDEBAR (REUTILIZABLE)
  // =========================================================================
  const sidebarContent = (
    <Box sx={styles.drawerContent}>
      <Box>
        {/* Logo y Cabecera del Sidebar */}
        <Box sx={styles.logoContainer}>
          <Box 
            component="img" 
            src={logoEcas} 
            alt="Logo ECAS" 
            sx={{ width: 32, height: 32, objectFit: 'contain' }} 
          />
          <Box>
            <Typography variant="subtitle1" sx={styles.logoTitle}>
              PIADI
            </Typography>
            <Typography variant="caption" sx={styles.logoSubtitle}>
              ECAS
            </Typography>
          </Box>
        </Box>

        <Divider sx={styles.divider} />

        {/* Menú de Navegación */}
        <Box sx={styles.menuContainer}>
          {[
            { text: 'Inicio', icon: <HomeIcon />, path: '/' },
            { text: 'Dashboards', icon: <DashboardIcon />, path: '/dashboard' },
            { text: 'Carga de datos', icon: <CargaIcon />, path: '/carga-datos' },
            { text: 'Auditoría', icon: <AuditoriaIcon />, path: '/auditoria' },
          ].filter((item) => {
            if (item.text === 'Auditoría') {
              return (
                user?.role === 'Rector' || 
                user?.role === 'Administrador' || 
                user?.role === 'Director de Administración' ||
                user?.role === 'Analista de Calidad'
              );
            }
            return true;
          }).map((item) => {
            const isSelected = activeMenu === item.text;
            return (
              <Box
                key={item.text}
                onClick={() => {
                  setActiveMenu(item.text);
                  setMobileOpen(false); // Cierra el drawer móvil si se hace click
                  if (item.path !== '#') {
                    navigate(item.path);
                  }
                }}
                sx={styles.menuItem(isSelected)}
              >
                {item.icon}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: isSelected ? 600 : 500, 
                    noWrap: true,
                    color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Sección inferior del Sidebar */}
      <Box sx={styles.bottomSection}>
        {/* Botón Cerrar Sesión */}
        <Box onClick={logout} sx={styles.logoutButton}>
          <LogoutIcon />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Cerrar Sesión
          </Typography>
        </Box>

        {/* Tarjeta de Usuario */}
        <Box sx={styles.userCard}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Avatar sx={styles.userAvatar}>
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'JD'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
                {user?.username || 'John Doe'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Ver perfil
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={styles.mainLayout}>
      
      {/* =========================================================================
          BARRA DE NAVEGACIÓN SUPERIOR PARA MÓVILES (APPBAR)
          ========================================================================= */}
      <AppBar position="fixed" sx={styles.mobileAppBar}>
        <Toolbar sx={styles.mobileToolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ p: 0, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <MenuIcon sx={{ fontSize: 36 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* =========================================================================
          SECCIÓN 1A: SIDEBAR PERSISTENTE (ESCRITORIO)
          ========================================================================= */}
      <Box sx={styles.sidebar}>
        {sidebarContent}
      </Box>

      {/* =========================================================================
          SECCIÓN 1B: SIDEBAR TEMPORAL / DESPLEGABLE (MÓVILES Y TABLETS)
          ========================================================================= */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Optimiza el rendimiento de apertura en móviles.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, border: 'none' },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* =========================================================================
          SECCIÓN 2: ÁREA DE CONTENIDO PRINCIPAL (DERECHA / ABAJO)
          ========================================================================= */}
      <Box sx={styles.contentArea}>
        {/* Cabecera y Bienvenida */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2" sx={styles.welcomeText}>
              Buenos días, {user?.username || 'John'} ✍️
            </Typography>
            
            <Box sx={styles.panelHeader}>
              <Box sx={styles.panelIconContainer}>
                <HomeIcon />
              </Box>
              <Box>
                <Typography variant="h5" sx={styles.panelTitle}>
                  Panel de Inicio
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Aquí encontrarás un resumen de tus metas y actividades institucionales.
                </Typography>
              </Box>
            </Box>
          </Box>
          {user && (
            <Box sx={{ 
              bgcolor: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px', 
              px: 2, 
              py: 1, 
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10B981' }} />
              <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                Sesión activa: <span style={{ fontWeight: 700 }}>{user.username}</span> ({user.role})
              </Typography>
            </Box>
          )}
        </Box>

        {/* Pestañas de Navegación Secundarias */}
        <Box sx={styles.tabsContainer}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={styles.tabsList}
          >
            <Tab label="Resumen" />
            <Tab label="Educación Continua" />
          </Tabs>
        </Box>

        {/* =========================================================================
            SECCIÓN 3: TARJETAS KPI (METRICAS DINÁMICAS)
            ========================================================================= */}
        <Grid container spacing={3}>
          {currentData.kpis.map((kpi, index) => {
            const cardStyle = kpi.isBlue 
              ? styles.kpiCardBlue(deptColor, customTextColor) 
              : styles.kpiCardWhite;
            const valueStyle = kpi.isBlue 
              ? [styles.kpiValue, { color: customTextColor }] 
              : [styles.kpiValue, { color: '#1E2875' }];

            return (
              <Grid item xs={12} sm={6} md={3} key={`${activeTab}-kpi-${index}`}>
                <Card sx={cardStyle}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 700, 
                          color: kpi.isBlue ? customTextColor : '#475569', 
                          opacity: kpi.isBlue ? (isLight ? 0.85 : 0.9) : 1,
                          maxWidth: '80%' 
                        }}
                      >
                        {kpi.title}
                      </Typography>
                      <ArrowUpIcon 
                        sx={{ 
                          transform: 'rotate(45deg)', 
                          color: kpi.isBlue ? customTextColor : '#94a3b8',
                          opacity: kpi.isBlue ? (isLight ? 0.75 : 0.8) : 1
                        }} 
                      />
                    </Box>
                    <Typography variant="h3" sx={valueStyle}>
                      {kpi.value}
                    </Typography>
                    <Box sx={styles.kpiTrendContainer}>
                      <ArrowUpIcon sx={{ fontSize: '1rem', color: '#10B981', transform: 'rotate(45deg)' }} />
                      <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>
                        {kpi.trend}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: kpi.isBlue 
                            ? (isLight ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255,255,255,0.6)') 
                            : '#64748b', 
                          ml: 0.5 
                        }}
                      >
                        {kpi.trendDesc}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* =========================================================================
            SECCIÓN 4: METAS PRIORITARIAS (DINÁMICAS)
            ========================================================================= */}
        <Box sx={styles.metasSectionContainer}>
          <Box sx={styles.metasHeader}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ color: '#1E2875', display: 'flex', alignItems: 'center' }}>
                <MetasIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={styles.metasTitle}>
                  Metas Prioritarias
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Seguimiento de objetivos clave ordenados por prioridad ({activeTab === 0 ? 'General' : 'Educación Continua'})
                </Typography>
              </Box>
            </Box>

            <Button variant="contained" size="small" sx={styles.metasButton}>
              Ver todas las metas ❯
            </Button>
          </Box>

          {/* Listado de Metas del Departamento seleccionado */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {currentData.goals.map((goal, index) => (
              <Card sx={styles.metaCard} key={`${activeTab}-goal-${index}`}>
                <CardContent sx={styles.metaCardContent}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={7}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          {goal.title}
                        </Typography>
                        <Box sx={styles.metaStatusBadge(goal.status)}>
                          {getStatusIcon(goal.status)}
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {goal.statusText}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Barra de Progreso */}
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Avance</Typography>
                          <Typography variant="caption" sx={{ color: goal.status === 'atencion' ? '#EF4444' : goal.status === 'progreso' ? '#3B82F6' : '#10B981', fontWeight: 700 }}>
                            {goal.progressValue}
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={goal.progress > 100 ? 100 : goal.progress} sx={styles.metaProgressBar(goal.status)} />
                      </Box>

                      {/* Fechas */}
                      <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Inicio</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>{goal.start}</Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Cierre</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>{goal.end}</Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <Button variant="contained" sx={styles.metaDetailButton}>
                        Ver detalles
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Botón flotante de ayuda */}
      <IconButton sx={styles.floatingHelpButton} onClick={() => setOpenHelpDialog(true)}>
        <HelpIcon />
      </IconButton>

      {/* =========================================================================
          DIÁLOGO: CENTRO DE AYUDA (FAQ)
          ========================================================================= */}
      <Dialog
        open={openHelpDialog}
        onClose={() => setOpenHelpDialog(false)}
        PaperProps={{ sx: styles.helpDialogPaper }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ p: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography sx={styles.helpDialogTitle}>Centro de Ayuda</Typography>
            <Typography sx={styles.helpDialogSubtitle}>
              Encuentra respuestas a preguntas frecuentes sobre PIADI ECAS
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenHelpDialog(false)} sx={{ color: '#94A3B8', mt: -1 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflowY: 'auto', maxHeight: '60vh' }}>
          {faqData.map((faq, idx) => (
            <Accordion key={idx} disableGutters elevation={0} sx={styles.helpAccordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#6B7280' }} />}>
                <Typography sx={styles.helpAccordionQuestion}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {faq.isRich ? (
                  <Box sx={{ color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E2875', mb: 0.5, fontFamily: "'Inter', sans-serif" }}>
                      Aporte porcentual a la meta
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      El aporte porcentual define cuánto peso tiene cada métrica dentro del cumplimiento total de la meta. La suma de los aportes de todas las métricas asociadas debe ser exactamente <strong>100%</strong>.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      Por ejemplo, si una meta tiene dos métricas:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2.5, mb: 1.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      <li><strong>Total de matriculados</strong> con un aporte del <strong>70%</strong></li>
                      <li><strong>Tasa de retención</strong> con un aporte del <strong>30%</strong></li>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      El progreso final de la meta será la suma ponderada: si la primera métrica se cumplió al 100% y la segunda al 50%, el avance total será <strong>(100% × 0.7) + (50% × 0.3) = 85%</strong>.
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E2875', mb: 0.5, fontFamily: "'Inter', sans-serif" }}>
                      Valor esperado y comportamiento esperado
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      El <strong>valor esperado</strong> es el umbral que determina si la métrica se cumple o no. Puede expresarse de dos formas:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2.5, mb: 1.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      <li><strong>Numérico (#)</strong>: un conteo absoluto, por ejemplo "200 matriculados".</li>
                      <li><strong>Porcentual (%)</strong>: una proporción, por ejemplo "30% de tasa de abandono".</li>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      El <strong>comportamiento esperado</strong> indica la dirección en que debe moverse el valor real respecto al umbral:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      <li style={{ marginBottom: '8px' }}><strong>Debe superar</strong>: el valor real debe ser mayor o igual al valor esperado para considerar la métrica cumplida. Se usa en indicadores de crecimiento (ej. cantidad de matriculados, cursos ejecutados).</li>
                      <li><strong>No debe superar</strong>: el valor real debe ser menor o igual al valor esperado para considerar la métrica cumplida. Se usa en indicadores que deben mantenerse bajos (ej. tasa de deserción, número de abandonos).</li>
                    </Box>
                  </Box>
                ) : (
                  <Typography sx={styles.helpAccordionAnswer}>{faq.a}</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Tip de ayuda inferior */}
          <Box sx={styles.helpTipContainer}>
            <Typography variant="body2" sx={styles.helpTipText}>
              💡 <strong>Tip:</strong> Puedes acceder a esta ayuda en cualquier momento haciendo clic en el botón "?" en la esquina inferior derecha.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
