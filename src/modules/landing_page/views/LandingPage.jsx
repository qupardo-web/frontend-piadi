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
} from '@mui/icons-material';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [activeMenu, setActiveMenu] = useState('Inicio');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={styles.mainLayout}>
      
      {/* =========================================================================
          SECCIÓN 1: SIDEBAR LATERAL IZQUIERDO
          ========================================================================= */}
      <Box sx={styles.sidebar}>
        <Box>
          {/* Logo y Cabecera del Sidebar */}
          <Box sx={styles.logoContainer}>
            {/* [ICONO LOGO PIADI - REEMPLAZAR AQUÍ] */}
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
              { text: 'Carga de datos', icon: <CargaIcon />, path: '#' },
              { text: 'Auditoría', icon: <AuditoriaIcon />, path: '#' },
              { text: 'Visualización de tablas', icon: <TablaIcon />, path: '#' },
            ].map((item) => {
              const isSelected = activeMenu === item.text;
              return (
                <Box
                  key={item.text}
                  onClick={() => {
                    setActiveMenu(item.text);
                    if (item.path !== '#') {
                      navigate(item.path);
                    }
                  }}
                  sx={styles.menuItem(isSelected)}
                >
                  {/* [ICONOS DE MENÚ INDIVIDUALES - REEMPLAZAR AQUÍ] */}
                  {item.icon}
                  <Typography variant="body2" sx={{ fontWeight: isSelected ? 600 : 500, noWrap: true }}>
                    {item.text}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Sección inferior del Sidebar: Cerrar Sesión y Perfil */}
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
              {/* [AVATAR / FOTO DE USUARIO - REEMPLAZAR AQUÍ] */}
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

      {/* =========================================================================
          SECCIÓN 2: ÁREA DE CONTENIDO PRINCIPAL (DERECHA)
          ========================================================================= */}
      <Box sx={styles.contentArea}>
        {/* Cabecera y Bienvenida */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="body2" sx={styles.welcomeText}>
            Buenos días, {user?.username || 'John'} ✍️
          </Typography>
          
          <Box sx={styles.panelHeader}>
            {/* Icono del Panel de Inicio (Casa en Círculo) - [REEMPLAZAR AQUÍ] */}
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
            SECCIÓN 3: TARJETAS KPI (METRICAS)
            ========================================================================= */}
        <Grid container spacing={3}>
          {/* Card 1: Matrícula total institucional (Azul) */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.kpiCardBlue}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, opacity: 0.9, maxWidth: '80%' }}>
                    Matrícula total institucional
                  </Typography>
                  <ArrowUpIcon sx={{ transform: 'rotate(45deg)', opacity: 0.8 }} />
                </Box>
                <Typography variant="h3" sx={styles.kpiValue}>
                  3,842
                </Typography>
                <Box sx={styles.kpiTrendContainer}>
                  <ArrowUpIcon sx={{ fontSize: '1rem', color: '#10b981', transform: 'rotate(45deg)' }} />
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>
                    8%
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.6, ml: 0.5 }}>
                    vs semestre anterior
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 2: Tasa de aprobación general (Blanco) */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.kpiCardWhite}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                    Tasa de aprobación general
                  </Typography>
                  <ArrowUpIcon sx={{ transform: 'rotate(45deg)', color: '#94a3b8' }} />
                </Box>
                <Typography variant="h3" sx={[styles.kpiValue, { color: '#0d1b6b' }]}>
                  86%
                </Typography>
                <Box sx={styles.kpiTrendContainer}>
                  <ArrowUpIcon sx={{ fontSize: '1rem', color: '#10b981', transform: 'rotate(45deg)' }} />
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>
                    2%
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', ml: 0.5 }}>
                    vs semestre anterior
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 3: Cursos Ed. Continua dictados (Blanco) */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.kpiCardWhite}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                    Cursos Ed. Continua dictados
                  </Typography>
                  <ArrowUpIcon sx={{ transform: 'rotate(45deg)', color: '#94a3b8' }} />
                </Box>
                <Typography variant="h3" sx={[styles.kpiValue, { color: '#0d1b6b' }]}>
                  24
                </Typography>
                <Box sx={styles.kpiTrendContainer}>
                  <ArrowUpIcon sx={{ fontSize: '1rem', color: '#10b981', transform: 'rotate(45deg)' }} />
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>
                    4
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', ml: 0.5 }}>
                    vs periodo anterior
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 4: Proyectos de innovación activos (Azul) */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.kpiCardBlue}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, opacity: 0.9 }}>
                    Proyectos de innovación activos
                  </Typography>
                  <ArrowUpIcon sx={{ transform: 'rotate(45deg)', opacity: 0.8 }} />
                </Box>
                <Typography variant="h3" sx={styles.kpiValue}>
                  15
                </Typography>
                <Box sx={styles.kpiTrendContainer}>
                  <ArrowUpIcon sx={{ fontSize: '1rem', color: '#10b981', transform: 'rotate(45deg)' }} />
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>
                    3
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.6, ml: 0.5 }}>
                    nuevos este semestre
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 5: Convenios VcM vigentes (Blanco) */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.kpiCardWhite}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                    Convenios VcM vigentes
                  </Typography>
                  <ArrowUpIcon sx={{ transform: 'rotate(45deg)', color: '#94a3b8' }} />
                </Box>
                <Typography variant="h3" sx={[styles.kpiValue, { color: '#0d1b6b' }]}>
                  45
                </Typography>
                <Box sx={styles.kpiTrendContainer}>
                  <ArrowUpIcon sx={{ fontSize: '1rem', color: '#10b981', transform: 'rotate(45deg)' }} />
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>
                    8
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', ml: 0.5 }}>
                    nuevos este año
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card 6: Tasa de titulación (Blanco) */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.kpiCardWhite}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>
                    Tasa de titulación
                  </Typography>
                  <ArrowUpIcon sx={{ transform: 'rotate(45deg)', color: '#94a3b8' }} />
                </Box>
                <Typography variant="h3" sx={[styles.kpiValue, { color: '#0d1b6b' }]}>
                  78%
                </Typography>
                <Box sx={styles.kpiTrendContainer}>
                  <ArrowUpIcon sx={{ fontSize: '1rem', color: '#10b981', transform: 'rotate(45deg)' }} />
                  <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700 }}>
                    5%
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748b', ml: 0.5 }}>
                    vs cohorte anterior
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* =========================================================================
            SECCIÓN 4: METAS PRIORITARIAS
            ========================================================================= */}
        <Box sx={styles.metasSectionContainer}>
          <Box sx={styles.metasHeader}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Icono de Diana/Meta - [REEMPLAZAR AQUÍ] */}
              <Box sx={{ color: '#0d1b6b', display: 'flex', alignItems: 'center' }}>
                <MetasIcon sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={styles.metasTitle}>
                  Metas Prioritarias
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Seguimiento de objetivos clave ordenados por prioridad
                </Typography>
              </Box>
            </Box>

            <Button variant="contained" size="small" sx={styles.metasButton}>
              Ver todas las metas ❯
            </Button>
          </Box>

          {/* Listado de Metas */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            
            {/* Meta 1: Completada */}
            <Card sx={styles.metaCard}>
              <CardContent sx={styles.metaCardContent}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Total de 200 matriculados en cursos
                      </Typography>
                      <Box sx={styles.metaStatusBadge('completada')}>
                        <CheckCircleIcon sx={{ fontSize: '0.9rem' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>Completada</Typography>
                      </Box>
                    </Box>

                    {/* Barra de Progreso */}
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Avance</Typography>
                        <Typography variant="caption" sx={{ color: '#137333', fontWeight: 700 }}>120%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={100} sx={styles.metaProgressBar('completada')} />
                    </Box>

                    {/* Fechas */}
                    <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Inicio</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>12-03-2026</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Cierre</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>14-06-2026</Typography>
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

            {/* Meta 2: En progreso */}
            <Card sx={styles.metaCard}>
              <CardContent sx={styles.metaCardContent}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Total de 20 cursos ejecutados
                      </Typography>
                      <Box sx={styles.metaStatusBadge('progreso')}>
                        <AccessTimeIcon sx={{ fontSize: '0.9rem' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>En progreso</Typography>
                      </Box>
                    </Box>

                    {/* Barra de Progreso */}
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Avance</Typography>
                        <Typography variant="caption" sx={{ color: '#1a73e8', fontWeight: 700 }}>40%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={40} sx={styles.metaProgressBar('progreso')} />
                    </Box>

                    {/* Fechas */}
                    <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Inicio</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>12-03-2026</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Cierre</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>14-06-2026</Typography>
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

            {/* Meta 3: Requiere atención */}
            <Card sx={styles.metaCard}>
              <CardContent sx={styles.metaCardContent}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={7}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                        Reducir tasa de abandono por debajo del 30%
                      </Typography>
                      <Box sx={styles.metaStatusBadge('atencion')}>
                        <WarningIcon sx={{ fontSize: '0.9rem' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>Requiere atención</Typography>
                      </Box>
                    </Box>

                    {/* Barra de Progreso */}
                    <Box sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>Avance</Typography>
                        <Typography variant="caption" sx={{ color: '#c5221f', fontWeight: 700 }}>85%</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={85} sx={styles.metaProgressBar('atencion')} />
                    </Box>

                    {/* Fechas */}
                    <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Inicio</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>12-03-2026</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#94a3b8', display: 'block' }}>Cierre</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569' }}>14-06-2026</Typography>
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
