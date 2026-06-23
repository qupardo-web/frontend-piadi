import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { styles } from './DashboardEducacionContinua.styles';
import logoEcas from '../../../assets/logo_ECAS_white.svg';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Avatar,
  IconButton,
  Divider,
  Drawer,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  Slider,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  TrackChanges as MetasIcon,
  UploadFile as CargaIcon,
  Shield as AuditoriaIcon,
  TableChart as TablaIcon,
  ExitToApp as LogoutIcon,
  MoreVert as MoreVertIcon,
  Menu as MenuIcon,
  ChevronRight as ChevronRightIcon,
  FilterAlt as FilterIcon,
  RestartAlt as ResetIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const COHORTES_LIST = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];
const PERIODOS_LIST = ['2020-1', '2020-2', '2021-1', '2021-2', '2022-1', '2022-2', '2023-1', '2023-2', '2024-1', '2024-2', '2025-1', '2025-2', '2026-1', '2026-2'];
const SEXO_LIST = ['Femenino', 'Masculino', 'No binario', 'Prefiere no responder'];
const JORNADA_LIST = ['Diurna', 'Vespertina', 'Online', 'Semipresencial'];

export const DashboardEducacionContinua = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Estados de filtros
  const [cohorteDesde, setCohorteDesde] = useState('2020');
  const [cohorteHasta, setCohorteHasta] = useState('2026');
  const [periodoDesde, setPeriodoDesde] = useState('2020-1');
  const [periodoHasta, setPeriodoHasta] = useState('2026-2');
  const [rangoEdad, setRangoEdad] = useState([18, 65]);
  const [sexoSeleccionado, setSexoSeleccionado] = useState([]);
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState([]);

  const activeMenu = 'Dashboards';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleResetFilters = () => {
    setCohorteDesde('2020');
    setCohorteHasta('2026');
    setPeriodoDesde('2020-1');
    setPeriodoHasta('2026-2');
    setRangoEdad([18, 65]);
    setSexoSeleccionado([]);
    setJornadaSeleccionada([]);
  };

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
            { text: 'Metas', icon: <MetasIcon />, path: '#' },
            { text: 'Carga de datos', icon: <CargaIcon />, path: '/carga-datos' },
            { text: 'Auditoría', icon: <AuditoriaIcon />, path: '/auditoria' },
            { text: 'Visualización de tablas', icon: <TablaIcon />, path: '#' },
          ].filter((item) => {
            if (item.text === 'Auditoría' || item.text === 'Visualización de tablas') {
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
                  setMobileOpen(false);
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
        <Box onClick={logout} sx={styles.logoutButton}>
          <LogoutIcon />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Cerrar Sesión
          </Typography>
        </Box>

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
      
      {/* BARRA DE NAVEGACIÓN SUPERIOR MÓVIL (APPBAR) */}
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

      {/* SIDEBAR LATERAL (ESCRITORIO) */}
      <Box component="nav" sx={styles.sidebar}>
        {sidebarContent}
      </Box>

      {/* SIDEBAR DESPLEGABLE (MÓVIL) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, border: 'none' },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* ÁREA DE CONTENIDO CENTRAL */}
      <Box component="main" sx={styles.contentArea}>
        
        {/* Cabecera del Panel Principal */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, width: '100%' }}>
            <Box sx={styles.panelHeader}>
              <Box sx={styles.panelIconContainer}>
                <SchoolIcon />
              </Box>
              <Box>
                <Typography variant="h5" sx={styles.panelTitle}>
                  Dashboard de Educación Continua
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Visualización de estadísticas y métricas del departamento de Educación Continua
                </Typography>
              </Box>
            </Box>
            {user && (
              <Box sx={styles.sessionCard}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#1DC2A0' }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                  Sesión activa: <span style={{ fontWeight: 700 }}>{user.username}</span> ({user.role})
                </Typography>
              </Box>
            )}
          </Box>

          {/* Breadcrumbs */}
          <Box sx={styles.breadcrumbsContainer}>
            <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/')}>
              Inicio
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7 }} />
            <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/dashboard')}>
              Central de Dashboards
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7 }} />
            <Typography variant="body1" sx={{ color: '#1E2875', fontWeight: 600 }}>
              Dashboard de Educación Continua
            </Typography>
          </Box>
        </Box>

        {/* Panel de Período Visualizado */}
        <Box sx={styles.periodBanner}>
          <Typography sx={styles.periodBannerLabel}>
            PERÍODO VISUALIZADO
          </Typography>
          <Typography sx={styles.periodBannerValue}>
            {cohorteDesde === cohorteHasta ? `Cohorte ${cohorteDesde}` : `Cohortes ${cohorteDesde} a ${cohorteHasta}`} | {periodoDesde} a {periodoHasta}
          </Typography>
        </Box>

        {/* Espacio para visualizaciones futuras */}
        <Box sx={styles.graphsPlaceholder}>
          <SchoolIcon sx={{ fontSize: 80, color: '#46D19F', opacity: 0.8, mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2875', mb: 1, fontFamily: "'Inter', sans-serif" }}>
            Visualización de Reportes de Educación Continua
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B7280', maxWidth: 500, lineHeight: 1.6 }}>
            Usa el panel de filtros persistentes de la derecha para ajustar los criterios del reporte académico, matrícula e indicadores financieros.
          </Typography>
        </Box>
      </Box>

      {/* SECCIÓN DE FILTROS PERSISTENTES (DERECHA) */}
      <Box component="aside" sx={styles.filtersSidebar}>
        {/* Cabecera Filtros */}
        <Box sx={styles.filtersHeader}>
          <FilterIcon sx={{ color: '#1E2875', fontSize: 20 }} />
          <Typography sx={styles.filtersTitle}>Filtros</Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E5E7EB' }} />

        {/* Contenido Scrollable de Filtros */}
        <Box sx={styles.filtersScrollContent}>
          
          {/* Selector de Cohortes */}
          <Box sx={styles.filterSection}>
            <Typography sx={styles.filterSectionTitle}>
              Cohortes
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="cohorte-desde-label" sx={styles.selectLabelStyle}>Desde</InputLabel>
                  <Select
                    labelId="cohorte-desde-label"
                    value={cohorteDesde}
                    label="Desde"
                    onChange={(e) => setCohorteDesde(e.target.value)}
                    sx={styles.selectInputStyle}
                  >
                    {COHORTES_LIST.map((anio) => (
                      <MenuItem key={anio} value={anio} disabled={parseInt(anio) > parseInt(cohorteHasta)}>
                        {anio}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="cohorte-hasta-label" sx={styles.selectLabelStyle}>Hasta</InputLabel>
                  <Select
                    labelId="cohorte-hasta-label"
                    value={cohorteHasta}
                    label="Hasta"
                    onChange={(e) => setCohorteHasta(e.target.value)}
                    sx={styles.selectInputStyle}
                  >
                    {COHORTES_LIST.map((anio) => (
                      <MenuItem key={anio} value={anio} disabled={parseInt(anio) < parseInt(cohorteDesde)}>
                        {anio}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Selector de Período Académico */}
          <Box sx={styles.filterSection}>
            <Typography sx={styles.filterSectionTitle}>
              Período académico
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="periodo-desde-label" sx={styles.selectLabelStyle}>Desde</InputLabel>
                  <Select
                    labelId="periodo-desde-label"
                    value={periodoDesde}
                    label="Desde"
                    onChange={(e) => setPeriodoDesde(e.target.value)}
                    sx={styles.selectInputStyle}
                  >
                    {PERIODOS_LIST.map((per) => {
                      const isDisabled = PERIODOS_LIST.indexOf(per) > PERIODOS_LIST.indexOf(periodoHasta);
                      return (
                        <MenuItem key={per} value={per} disabled={isDisabled}>
                          {per}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel id="periodo-hasta-label" sx={styles.selectLabelStyle}>Hasta</InputLabel>
                  <Select
                    labelId="periodo-hasta-label"
                    value={periodoHasta}
                    label="Hasta"
                    onChange={(e) => setPeriodoHasta(e.target.value)}
                    sx={styles.selectInputStyle}
                  >
                    {PERIODOS_LIST.map((per) => {
                      const isDisabled = PERIODOS_LIST.indexOf(per) < PERIODOS_LIST.indexOf(periodoDesde);
                      return (
                        <MenuItem key={per} value={per} disabled={isDisabled}>
                          {per}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Rango de Edad (Slider) */}
          <Box sx={styles.filterSection}>
            <Typography sx={styles.filterSectionTitle}>
              Rango de edad
            </Typography>
            <Box sx={{ px: 1, mt: 1 }}>
              <Slider
                value={rangoEdad}
                onChange={(e, newValue) => setRangoEdad(newValue)}
                valueLabelDisplay="auto"
                min={18}
                max={65}
                sx={styles.ageSliderStyle}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Typography sx={styles.ageRangeLabels}>
                  <span>{rangoEdad[0]}</span> — <span>{rangoEdad[1]}</span> años
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Sexo (Selector Múltiple) */}
          <Box sx={styles.filterSection}>
            <Typography sx={styles.filterSectionTitle}>
              Sexo
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="sexo-select-label" sx={styles.selectLabelStyle}>Seleccionar</InputLabel>
              <Select
                labelId="sexo-select-label"
                multiple
                value={sexoSeleccionado}
                onChange={(e) => setSexoSeleccionado(e.target.value)}
                input={<OutlinedInput label="Seleccionar" />}
                renderValue={(selected) => selected.join(', ')}
                sx={styles.selectInputStyle}
              >
                {SEXO_LIST.map((name) => (
                  <MenuItem key={name} value={name} sx={styles.menuItemCheckStyle}>
                    <Checkbox checked={sexoSeleccionado.indexOf(name) > -1} sx={styles.checkboxStyle} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Jornada (Selector Múltiple) */}
          <Box sx={styles.filterSection}>
            <Typography sx={styles.filterSectionTitle}>
              Jornada
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="jornada-select-label" sx={styles.selectLabelStyle}>Seleccionar</InputLabel>
              <Select
                labelId="jornada-select-label"
                multiple
                value={jornadaSeleccionada}
                onChange={(e) => setJornadaSeleccionada(e.target.value)}
                input={<OutlinedInput label="Seleccionar" />}
                renderValue={(selected) => selected.join(', ')}
                sx={styles.selectInputStyle}
              >
                {JORNADA_LIST.map((name) => (
                  <MenuItem key={name} value={name} sx={styles.menuItemCheckStyle}>
                    <Checkbox checked={jornadaSeleccionada.indexOf(name) > -1} sx={styles.checkboxStyle} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

        </Box>

        {/* Botón de Limpiar Filtros */}
        <Box sx={styles.filtersFooter}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ResetIcon />}
            onClick={handleResetFilters}
            sx={styles.resetFiltersButton}
          >
            Restablecer filtros
          </Button>
        </Box>
      </Box>

    </Box>
  );
};
