import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { styles } from './LandingPage.styles';
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
  1: '#1E2875', // Admisión (Predeterminado)
  2: '#51158C', // Relaciones Estudiantiles (Púrpura)
  3: '#175696', // Desarrollo Curricular (Azul medio)
  4: '#3EC9FF', // Innovación (Celeste)
  5: '#46D19F', // Educación Continua (Turquesa claro)
  6: '#E27800', // Vinculación con el Medio (Naranja)
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [activeMenu, setActiveMenu] = useState('Inicio');
  
  // Estado para controlar la apertura del menú lateral en móviles
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Obtiene los datos del departamento seleccionado según la pestaña activa
  const currentData = TAB_DATA[activeTab] || TAB_DATA[0];
  
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
          <Box sx={styles.logoBadge}>P</Box>
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
            { text: 'Metas', icon: <MetasIcon />, path: '#' },
            { text: 'Carga de datos', icon: <CargaIcon />, path: '/carga-datos' },
            { text: 'Auditoría', icon: <AuditoriaIcon />, path: '#' },
            { text: 'Visualización de tablas', icon: <TablaIcon />, path: '#' },
          ].map((item) => {
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
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo en la Barra Superior Móvil */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={[styles.logoBadge, { width: 28, height: 28, fontSize: '1rem' }]}>P</Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
              PIADI ECAS
            </Typography>
          </Box>
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
            <Tab label="Admisión" />
            <Tab label="Relaciones Estudiantiles" />
            <Tab label="Desarrollo Curricular" />
            <Tab label="Innovación" />
            <Tab label="Educación Continua" />
            <Tab label="Vinculación con el Medio" />
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
                  Seguimiento de objetivos clave ordenados por prioridad ({activeTab === 0 ? 'General' : activeTab === 1 ? 'Admisión' : activeTab === 2 ? 'Relaciones Estudiantiles' : activeTab === 3 ? 'Desarrollo Curricular' : activeTab === 4 ? 'Innovación' : activeTab === 5 ? 'Educación Continua' : 'Vinculación con el Medio'})
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
      <IconButton sx={styles.floatingHelpButton}>
        <HelpIcon />
      </IconButton>
    </Box>
  );
};
