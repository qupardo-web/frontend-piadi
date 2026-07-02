import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  createTheme,
  ThemeProvider,
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
  CalendarToday as CalendarIcon,
  Wc as WcIcon,
  AccessTime as ClockIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon,
  Public as PublicIcon,
} from '@mui/icons-material';

// Lucide Icons from TallerDevops
import { 
  Calendar as CalendarLucide, Search, Filter, ChevronRight as ChevronRightLucide, 
  Users, Maximize2, X, Info, GraduationCap,
  BookOpen, CheckCircle, TrendingUp, Percent,
  Award, Layers, Briefcase, DollarSign, UserCheck,
  RefreshCw, ClipboardList
} from 'lucide-react';

// MUI X-Charts
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { RadarChart } from '@mui/x-charts/RadarChart';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

import {
  useDashboardEducacionContinua,
  SEMESTRES_LIST,
  SEXO_LIST,
  MESES_LIST,
  TIPOS_LIST,
  MODALIDADES_LIST,
  AREAS_LIST
} from './DashboardEducacionContinua.hooks';

const dashboardLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E2875',
    },
    secondary: {
      main: '#1DC2A0',
    },
    background: {
      default: '#F5F5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
        },
      },
    },
  },
});

export const DashboardEducacionContinua = () => {
  const location = useLocation();
  const {
    navigate,
    user,
    logout,
    mobileOpen,
    cohorteDesde,
    setCohorteDesde,
    cohorteHasta,
    setCohorteHasta,
    semestresSeleccionados,
    setSemestresSeleccionados,
    mesDesde,
    setMesDesde,
    mesHasta,
    setMesHasta,
    tipoSeleccionado,
    setTipoSeleccionado,
    modalidadSeleccionada,
    setModalidadSeleccionada,
    areaSeleccionada,
    setAreaSeleccionada,
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
    apiOfertaSeries,
    apiDictadosSeries,
    apiEjecucionSeries,
    apiTasaAprobacionBreakdown,
    apiParticipantesSeries,
    apiParticipantesBreakdown,
    apiRecurrenciaSeries,
    apiIngresosBreakdown,
    apiMatriculaBreakdown,
    apiRecurrenciaBreakdown,
    apiPerfilMap,
    apiMatriculaSeries,
    apiIngresosSeries,
    apiOfertaByYear,
    apiIngresosByYear,
    apiMatriculaByYear,
    dynamicAreas,
    dynamicTipos,
    dynamicModalidades,
    dynamicSemestres,
    activeMenu,
    handleDrawerToggle,
    handleResetFilters,
    filteredNominalGroup1,
    filteredNominalGroup2,
    filteredCohorteData,
    filteredRetencionData,
    filteredProgramasData,
    ofertaChartData,
    dictadosSummaryData,
    effectiveDictadosSeries,
    effectiveEjecucionSeries,
    kpiStats,
    kpiCardsData,
    uniqueParticipantsData,
    filteredUniqueParticipantsLocal,
    uniqueParticipantsAgeDist,
    recurrenceFreqDist,
    uniqueParticipantsTotal,
    recurrenciaStats,
    matriculaChartData,
    aprobacionProgramasData,
    ingresosChartData,
    ingresosGeneradosData,
    totalRevenueCLP,
    perfilParticipantesData,
    activePeriodosText,
  } = useDashboardEducacionContinua();

  useEffect(() => {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [location.hash]);

  // NAV NAVEGACIÓN IZQUIERDA
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
                user?.role === 'Analista de Calidad' ||
                user?.role === 'Vicerrectoria de Calidad'
              );
            }
            return true;
          }).map((item) => {
            const isSelected = activeMenu === item.text;
            return (
              <Box
                key={item.text}
                onClick={() => {
                  handleDrawerToggle();
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
              {user?.username ? user.username.split(/[. @]/).filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('') : 'JD'}
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
    <ThemeProvider theme={dashboardLightTheme}>
      <Box sx={styles.mainLayout}>
      
      {/* SCOPED STYLE BLOCK TO AVOID GLOBAL COLLISION */}
      <style dangerouslySetInnerHTML={{__html: `
        .taller-devops-dashboard {
          font-family: 'Inter', sans-serif;
          color: #1e293b;
        }

        /* Chart SVG text visibility */
        .taller-devops-dashboard svg text,
        .taller-devops-dashboard svg text tspan,
        .taller-devops-dashboard svg tspan {
          fill: #1e293b !important;
          opacity: 1 !important;
          fill-opacity: 1 !important;
        }
        .taller-devops-dashboard .MuiChartsAxis-label,
        .taller-devops-dashboard .MuiChartsAxis-tickLabel,
        .taller-devops-dashboard .MuiChartsLegend-root text,
        .taller-devops-dashboard .MuiChartsLegend-root text tspan,
        .taller-devops-dashboard .MuiChartsLegend-root tspan {
          fill: #1E2875 !important;
          font-weight: 600 !important;
          opacity: 1 !important;
          fill-opacity: 1 !important;
        }
        
        /* Top summary cards */
        .taller-devops-dashboard .kpi-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .taller-devops-dashboard .kpi-container {
            grid-template-columns: 1fr;
          }
        }
        .taller-devops-dashboard .kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #1E2875;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .taller-devops-dashboard .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .taller-devops-dashboard .kpi-value {
          font-size: 26px;
          font-weight: 700;
          color: #1e1b4b;
          margin-bottom: 6px;
        }
        .taller-devops-dashboard .kpi-trend {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        /* Subheader banner */
        .taller-devops-dashboard .info-banner {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 18px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .taller-devops-dashboard .info-banner-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #1E2875;
        }
        .taller-devops-dashboard .info-banner-value {
          font-size: 13px;
          color: #334155;
          font-weight: 500;
        }

        /* Charts grid */
        .taller-devops-dashboard .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .taller-devops-dashboard .charts-grid {
            grid-template-columns: 1fr;
          }
        }
        .taller-devops-dashboard .chart-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          height: 380px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .taller-devops-dashboard .chart-card:hover {
          box-shadow: 0 4px 12px rgba(30, 40, 117, 0.05);
        }
        .taller-devops-dashboard .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .taller-devops-dashboard .chart-title {
          font-size: 15px;
          font-weight: 700;
          color: #1E2875;
          font-family: 'Inter', sans-serif;
        }
        .taller-devops-dashboard .chart-wrapper {
          flex-grow: 1;
          position: relative;
          min-height: 0;
        }

        /* Toggle Buttons */
        .taller-devops-dashboard .card-toggle-group {
          display: flex;
          background-color: #f1f5f9;
          border-radius: 8px;
          padding: 3px;
        }
        .taller-devops-dashboard .btn-toggle {
          background: transparent;
          border: none;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          color: #475569;
          transition: background-color 0.1s, color 0.1s;
        }
        .taller-devops-dashboard .btn-toggle.active {
          background-color: #ffffff;
          color: #1E2875;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .taller-devops-dashboard .btn-details {
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 4px 8px;
          cursor: pointer;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
        }
        .taller-devops-dashboard .btn-details:hover {
          background-color: #f8fafc;
          color: #1E2875;
        }

        /* Modals and overlay */
        .taller-devops-dashboard .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .taller-devops-dashboard .modal-content {
          background: #ffffff;
          border-radius: 16px;
          max-width: 650px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          padding: 24px;
          position: relative;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        }
        .taller-devops-dashboard .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #94a3b8;
        }
        
        /* Modal Table styling */
        .taller-devops-dashboard .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
          font-size: 13px;
        }
        .taller-devops-dashboard .details-table th,
        .taller-devops-dashboard .details-table td {
          border-bottom: 1px solid #f1f5f9;
          padding: 10px 12px;
          text-align: left;
        }
        .taller-devops-dashboard .details-table th {
          background-color: #f8fafc;
          font-weight: 700;
          color: #1E2875;
        }
      `}} />

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
      <Box component="main" sx={styles.contentArea} className="taller-devops-dashboard">
        
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

        {/* Top Summary Cards — 4 indicadores clave con evolución 2023→2026 */}
        <div className="kpi-container">
          {kpiCardsData.map(card => {
            const { Icon } = card;
            const evoPos = card.evo != null && card.evo >= 0;
            return (
              <div key={card.key} className="kpi-card" style={{ borderLeft: `4px solid ${card.borderColor}` }}>
                <div className="kpi-header" style={{ color: card.color }}>
                  <span>{card.label}</span>
                  <Icon size={16} style={{ color: card.color }} />
                </div>
                <div className="kpi-value" style={{ color: card.color }}>
                  {card.val26 != null ? card.fmt(card.val26) : apiLoading ? '...' : '—'}
                </div>
                <div className="kpi-trend" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {card.val23 != null && (
                    <span style={{ color: '#64748b' }}>2023: {card.fmt(card.val23)}</span>
                  )}
                  {card.evo != null && (
                    <span style={{ color: evoPos ? '#10B981' : '#ef4444', fontWeight: 700 }}>
                      {evoPos ? '↑' : '↓'} {Math.abs(card.evo)}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Subheader Period Banner */}
        <div className="info-banner">
          <Info size={16} style={{ color: '#1E2875' }} />
          <div>
            <span className="info-banner-label">Período Visualizado: </span>
            <span className="info-banner-value">{activePeriodosText}</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">

          {/* Card 9: Oferta de cursos programada */}
          <div id="oferta-programada" className="chart-card" style={{ gridColumn: '1 / -1', height: '390px' }}>
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} style={{ color: '#1E2875' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>Oferta programada</h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="card-toggle-group">
                  <button className={`btn-toggle ${ofertaViewMode === 'total' ? 'active' : ''}`} onClick={() => setOfertaViewMode('total')}>Total</button>
                  <button className={`btn-toggle ${ofertaViewMode === 'area' ? 'active' : ''}`} onClick={() => setOfertaViewMode('area')}>Área</button>
                  <button className={`btn-toggle ${ofertaViewMode === 'tipo' ? 'active' : ''}`} onClick={() => setOfertaViewMode('tipo')}>Tipo</button>
                  <button className={`btn-toggle ${ofertaViewMode === 'modalidad' ? 'active' : ''}`} onClick={() => setOfertaViewMode('modalidad')}>Modalidad</button>
                </div>
              </div>
            </div>
            
            <div className="chart-wrapper">
              {ofertaChartData.labels.length > 0 ? (
                <BarChart
                  xAxis={[{
                    scaleType: 'band',
                    data: ofertaChartData.labels,
                    label: ofertaViewMode === 'total' ? 'Año' : (ofertaViewMode === 'area' ? 'Área' : (ofertaViewMode === 'tipo' ? 'Tipo' : 'Modalidad'))
                  }]}
                  series={ofertaChartData.series}
                  margin={{ top: 15, right: 15, bottom: 60, left: 40 }}
                  slotProps={{
                    legend: {
                      direction: 'row',
                      position: { vertical: 'bottom', horizontal: 'middle' },
                      labelStyle: { fontSize: '11px', fill: '#1e293b' }
                    }
                  }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          {/* Card 3: Cursos efectivamente dictados */}
          <div id="cursos-dictados" className="chart-card">
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} style={{ color: '#10B981' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>Cursos efectivamente dictados</h2>
              </div>
            </div>
            
            <div className="chart-wrapper">
              {effectiveDictadosSeries ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: effectiveDictadosSeries.map(d => d.cohorte), label: 'Año' }]}
                  series={[
                    { data: effectiveDictadosSeries.map(d => d.planificados), label: 'Programados', color: '#cbd5e1' },
                    { data: effectiveDictadosSeries.map(d => d.dictados), label: 'Dictados', color: '#10B981' }
                  ]}
                  margin={{ top: 15, right: 15, bottom: 40, left: 40 }}
                  slotProps={{
                    legend: {
                      direction: 'row',
                      position: { vertical: 'bottom', horizontal: 'middle' },
                      labelStyle: { fontSize: '10px', fill: '#1e293b' }
                    }
                  }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          {/* Card 4: Tasa de ejecución (%) */}
          <div id="tasa-ejecucion" className="chart-card">
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Percent size={16} style={{ color: '#1E2875' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>Tasa de ejecución (%)</h2>
              </div>
            </div>
            
            <div className="chart-wrapper">
              {effectiveEjecucionSeries && effectiveEjecucionSeries.length > 0 ? (
                <LineChart
                  xAxis={[{ scaleType: 'point', data: effectiveEjecucionSeries.map(d => d.cohorte), label: 'Año' }]}
                  series={[{
                    data: effectiveEjecucionSeries.map(d => d.tasa),
                    color: '#1E2875',
                    label: 'Tasa Ejecución %',
                    valueFormatter: (value) => `${value}%`,
                    showMark: true,
                  }]}
                  margin={{ top: 15, right: 15, bottom: 40, left: 45 }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          {/* Card 7: Ingresos Generados */}
          <div id="ingresos-generados" className="chart-card" style={{ gridColumn: '1 / -1', height: '390px' }}>
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={16} style={{ color: '#10B981' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>
                  Ingresos por {ingresosViewMode === 'area' ? 'área' : (ingresosViewMode === 'tipo' ? 'tipo de programa' : 'modalidad')} ($M CLP)
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="card-toggle-group">
                  <button className={`btn-toggle ${ingresosViewMode === 'area' ? 'active' : ''}`} onClick={() => setIngresosViewMode('area')}>Área</button>
                  <button className={`btn-toggle ${ingresosViewMode === 'tipo' ? 'active' : ''}`} onClick={() => setIngresosViewMode('tipo')}>Tipo</button>
                  <button className={`btn-toggle ${ingresosViewMode === 'modalidad' ? 'active' : ''}`} onClick={() => setIngresosViewMode('modalidad')}>Modalidad</button>
                </div>
              </div>
            </div>

            <div className="chart-wrapper">
              {ingresosChartData.labels.length > 0 ? (
                <BarChart
                  xAxis={[{
                    scaleType: 'band',
                    data: ingresosChartData.labels,
                    label: ingresosViewMode === 'area' ? 'Área' : (ingresosViewMode === 'tipo' ? 'Tipo' : 'Modalidad'),
                    tickLabelStyle: { fontSize: 11 }
                  }]}
                  series={ingresosChartData.series}
                  margin={{ top: 15, right: 15, bottom: 80, left: 50 }}
                  slotProps={{ legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' }, labelStyle: { fontSize: '10px' } } }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          {/* Card 5: Matrícula por programa (Radar Chart) */}
          <div id="matricula-por-programa" className="chart-card" style={{ gridColumn: '1 / -1', height: '520px' }}>
            <div className="chart-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 className="chart-title" style={{ margin: 0 }}>Matrícula por programa</h2>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <div className="card-toggle-group">
                    <button className={`btn-toggle ${matriculaViewMode === 'total' ? 'active' : ''}`} onClick={() => setMatriculaViewMode('total')}>Total</button>
                    <button className={`btn-toggle ${matriculaViewMode === 'area' ? 'active' : ''}`} onClick={() => setMatriculaViewMode('area')}>Área</button>
                    <button className={`btn-toggle ${matriculaViewMode === 'modalidad' ? 'active' : ''}`} onClick={() => setMatriculaViewMode('modalidad')}>Modalidad</button>
                    <button className={`btn-toggle ${matriculaViewMode === 'tipo' ? 'active' : ''}`} onClick={() => setMatriculaViewMode('tipo')}>Tipo Programa</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-wrapper" style={{ height: '390px' }}>
              {matriculaChartData.labels.length > 0 ? (
                <BarChart
                  height={370}
                  xAxis={[{
                    scaleType: 'band',
                    data: matriculaChartData.labels,
                    label: matriculaViewMode === 'total' ? 'Año' : (matriculaViewMode === 'area' ? 'Área' : (matriculaViewMode === 'modalidad' ? 'Modalidad' : 'Tipo')),
                    tickLabelStyle: { fontSize: 11 }
                  }]}
                  series={matriculaChartData.series}
                  margin={{ top: 15, right: 15, bottom: 80, left: 50 }}
                  slotProps={{ legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' }, labelStyle: { fontSize: '10px' } } }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          {/* Card 6: Tasa de aprobación por programa */}
          <div id="tasa-aprobacion" className="chart-card" style={{ gridColumn: '1 / -1', minHeight: '380px', height: 'auto' }}>
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} style={{ color: '#a855f7' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>Tasa de aprobación</h2>
              </div>
            </div>

            <div className="chart-wrapper" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '8px' }}>
              {aprobacionProgramasData.length > 0 ? (
                aprobacionProgramasData.map(row => (
                  <div key={row.area} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#475569', marginBottom: '12px', textAlign: 'center' }}>
                      {row.area}
                    </span>
                    <div style={{ width: 120, height: 120 }}>
                      <Gauge
                        value={row.tasa}
                        startAngle={-110}
                        endAngle={110}
                        innerRadius="75%"
                        outerRadius="100%"
                        text={`${row.tasa}%`}
                        sx={{
                          [`& .${gaugeClasses.valueText}`]: {
                            fontSize: '18px',
                            fontWeight: '800',
                            fill: '#1e293b'
                          },
                          [`& .${gaugeClasses.valueArc}`]: {
                            fill: '#a855f7',
                          },
                          [`& .${gaugeClasses.referenceArc}`]: {
                            fill: '#e2e8f0',
                          }
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#64748b', marginTop: '4px', textAlign: 'center' }}>
                      Histórico: {row.promedioHistorico}%
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px', gridColumn: '1 / -1', textAlign: 'center' }}>No hay datos coincidentes</div>
              )}
            </div>
          </div>

          {/* Card 8: Perfil del participante */}
          <div className="chart-card" style={{ gridColumn: '1 / -1' }}>
            <div className="chart-header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={16} style={{ color: '#F59E0B' }} />
                  <h2 className="chart-title" style={{ margin: 0 }}>Perfil del participante</h2>
                </div>
                <div className="card-toggle-group" style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '380px', marginTop: '4px' }}>
                  <button className={`btn-toggle ${perfilViewMode === 'region' ? 'active' : ''}`} onClick={() => setPerfilViewMode('region')}>Región</button>
                  <button className={`btn-toggle ${perfilViewMode === 'sector' ? 'active' : ''}`} onClick={() => setPerfilViewMode('sector')}>Sector</button>
                  <button className={`btn-toggle ${perfilViewMode === 'escolaridad' ? 'active' : ''}`} onClick={() => setPerfilViewMode('escolaridad')}>Escolaridad</button>
                  <button className={`btn-toggle ${perfilViewMode === 'edad' ? 'active' : ''}`} onClick={() => setPerfilViewMode('edad')}>Edad</button>
                  <button className={`btn-toggle ${perfilViewMode === 'genero' ? 'active' : ''}`} onClick={() => setPerfilViewMode('genero')}>Género</button>
                  <button className={`btn-toggle ${perfilViewMode === 'tipo' ? 'active' : ''}`} onClick={() => setPerfilViewMode('tipo')}>Tipo</button>
                </div>
              </div>
            </div>

            <div className="chart-wrapper" style={{ marginTop: '8px' }}>
              {perfilParticipantesData ? (
                <PieChart
                  series={[
                    {
                      data: perfilParticipantesData,
                      innerRadius: 20,
                      outerRadius: 85,
                      paddingAngle: 3,
                      cornerRadius: 4,
                    },
                  ]}
                  height={220}
                  slotProps={{
                    legend: {
                      direction: 'column',
                      position: { vertical: 'middle', horizontal: 'right' },
                      labelStyle: { fontSize: '10px', fill: '#1e293b' }
                    }
                  }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          {/* Pictograma: Participantes Únicos */}
          <div className="chart-card" style={{ minHeight: '380px', height: 'auto' }}>
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} style={{ color: '#8b5cf6' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>Pictograma: Participantes Únicos</h2>
              </div>
            </div>
            <div className="chart-wrapper" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '12px', justifyContent: 'space-between' }}>
              {uniqueParticipantsAgeDist.length > 0 ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, gap: '20px', padding: '12px 0' }}>
                    {uniqueParticipantsAgeDist.map(d => {
                      const total = uniqueParticipantsTotal || 1;
                      const pct = (d.count / total) * 100;
                      const filledIconsCount = d.count > 0 ? Math.max(1, Math.round(pct / 10)) : 0;
                      return (
                        <div key={d.range} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                              {d.range} años
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#8b5cf6' }}>
                              {d.count} {d.count === 1 ? 'persona' : 'personas'} ({pct.toFixed(1)}%)
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {Array.from({ length: 10 }).map((_, i) => (
                              <svg
                                key={i}
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ color: i < filledIconsCount ? '#8b5cf6' : '#cbd5e1', transition: 'color 0.3s ease' }}
                              >
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: '12px', color: '#1e293b', fontWeight: 500, borderTop: '1px solid #f1f5f9', paddingTop: '8px', textAlign: 'center', lineHeight: '1.4' }}>
                    Cada figura representa un 10% del total de participantes únicos ({uniqueParticipantsTotal})
                  </div>
                </>
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          {/* Pictograma: Frecuencia de Matrículas */}
          <div className="chart-card" style={{ minHeight: '380px', height: 'auto' }}>
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={16} style={{ color: '#ec4899' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>Pictograma: Frecuencia de Matrículas</h2>
              </div>
            </div>
            <div className="chart-wrapper" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '12px', justifyContent: 'space-between' }}>
              {recurrenceFreqDist.length > 0 ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flexGrow: 1, gap: '24px', padding: '20px 0' }}>
                    {recurrenceFreqDist.map(d => {
                      const total = recurrenceFreqDist.reduce((sum, x) => sum + x.count, 0) || 1;
                      const pct = (d.count / total) * 100;
                      const filledIconsCount = d.count > 0 ? Math.max(1, Math.round(pct / 10)) : 0;
                      return (
                        <div key={d.category} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                              Año {d.category}
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#ec4899' }}>
                              {d.count} {d.count === 1 ? 'persona' : 'personas'} ({pct.toFixed(1)}%)
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            {Array.from({ length: 10 }).map((_, i) => (
                              <svg
                                key={i}
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ color: i < filledIconsCount ? '#ec4899' : '#cbd5e1', transition: 'color 0.3s ease' }}
                              >
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: '12px', color: '#1e293b', fontWeight: 500, borderTop: '1px solid #f1f5f9', paddingTop: '8px', textAlign: 'center', lineHeight: '1.4' }}>
                    Cada figura representa un 10% del total de personas con recurrencia formativa
                  </div>
                </>
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

        </div>

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
          
          {/* Selector de Año (Slider) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Año
              </Typography>
            </Box>
            <Box sx={{ px: 1, mt: 0.5 }}>
              <Slider
                value={[parseInt(cohorteDesde), parseInt(cohorteHasta)]}
                onChange={(e, newValue) => {
                  setCohorteDesde(newValue[0].toString());
                  setCohorteHasta(newValue[1].toString());
                }}
                valueLabelDisplay="auto"
                min={2023}
                max={2026}
                step={1}
                marks={[
                  { value: 2023, label: '2023' },
                  { value: 2024, label: '2024' },
                  { value: 2025, label: '2025' },
                  { value: 2026, label: '2026' }
                ]}
                sx={styles.ageSliderStyle}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Typography sx={styles.ageRangeLabels}>
                  <span>{cohorteDesde}</span> — <span>{cohorteHasta}</span>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Selector de Semestre (Selector Múltiple) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Semestre
              </Typography>
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel id="semestre-select-label" sx={styles.selectLabelStyle}>Seleccionar</InputLabel>
              <Select
                labelId="semestre-select-label"
                multiple
                value={semestresSeleccionados}
                onChange={(e) => setSemestresSeleccionados(e.target.value)}
                input={<OutlinedInput label="Seleccionar" />}
                renderValue={(selected) => selected.join(', ')}
                sx={styles.selectInputStyle}
              >
                {(dynamicSemestres.length > 0 ? dynamicSemestres : SEMESTRES_LIST).map((name) => (
                  <MenuItem key={name} value={name} sx={styles.menuItemCheckStyle}>
                    <Checkbox checked={semestresSeleccionados.indexOf(name) > -1} sx={styles.checkboxStyle} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Selector de Mes (Rango) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Mes
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="mes-desde-label" sx={styles.selectLabelStyle}>Desde</InputLabel>
                <Select
                  labelId="mes-desde-label"
                  value={mesDesde}
                  label="Desde"
                  onChange={(e) => setMesDesde(e.target.value)}
                  sx={styles.selectInputStyle}
                >
                  {MESES_LIST.map((m) => {
                    const isDisabled = MESES_LIST.indexOf(m) > MESES_LIST.indexOf(mesHasta);
                    return (
                      <MenuItem key={m} value={m} disabled={isDisabled}>
                        {m}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Typography sx={{ color: '#94A3B8' }}>—</Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="mes-hasta-label" sx={styles.selectLabelStyle}>Hasta</InputLabel>
                <Select
                  labelId="mes-hasta-label"
                  value={mesHasta}
                  label="Hasta"
                  onChange={(e) => setMesHasta(e.target.value)}
                  sx={styles.selectInputStyle}
                >
                  {MESES_LIST.map((m) => {
                    const isDisabled = MESES_LIST.indexOf(m) < MESES_LIST.indexOf(mesDesde);
                    return (
                      <MenuItem key={m} value={m} disabled={isDisabled}>
                        {m}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Tipo de programa (Selector Múltiple) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Tipo de programa
              </Typography>
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel id="tipo-select-label" sx={styles.selectLabelStyle}>Seleccionar</InputLabel>
              <Select
                labelId="tipo-select-label"
                multiple
                value={tipoSeleccionado}
                onChange={(e) => setTipoSeleccionado(e.target.value)}
                input={<OutlinedInput label="Seleccionar" />}
                renderValue={(selected) => selected.join(', ')}
                sx={styles.selectInputStyle}
              >
                {(dynamicTipos.length > 0 ? dynamicTipos : TIPOS_LIST).map((name) => (
                  <MenuItem key={name} value={name} sx={styles.menuItemCheckStyle}>
                    <Checkbox checked={tipoSeleccionado.indexOf(name) > -1} sx={styles.checkboxStyle} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Modalidad (Selector Múltiple) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PublicIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Modalidad
              </Typography>
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel id="modalidad-select-label" sx={styles.selectLabelStyle}>Seleccionar</InputLabel>
              <Select
                labelId="modalidad-select-label"
                multiple
                value={modalidadSeleccionada}
                onChange={(e) => setModalidadSeleccionada(e.target.value)}
                input={<OutlinedInput label="Seleccionar" />}
                renderValue={(selected) => selected.join(', ')}
                sx={styles.selectInputStyle}
              >
                {(dynamicModalidades.length > 0 ? dynamicModalidades : MODALIDADES_LIST).map((name) => (
                  <MenuItem key={name} value={name} sx={styles.menuItemCheckStyle}>
                    <Checkbox checked={modalidadSeleccionada.indexOf(name) > -1} sx={styles.checkboxStyle} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Área (Selector Múltiple) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Área de programa
              </Typography>
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel id="area-select-label" sx={styles.selectLabelStyle}>Seleccionar</InputLabel>
              <Select
                labelId="area-select-label"
                multiple
                value={areaSeleccionada}
                onChange={(e) => setAreaSeleccionada(e.target.value)}
                input={<OutlinedInput label="Seleccionar" />}
                renderValue={(selected) => selected.join(', ')}
                sx={styles.selectInputStyle}
              >
                {(dynamicAreas.length > 0 ? dynamicAreas : AREAS_LIST).map((name) => (
                  <MenuItem key={name} value={name} sx={styles.menuItemCheckStyle}>
                    <Checkbox checked={areaSeleccionada.indexOf(name) > -1} sx={styles.checkboxStyle} />
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
    </ThemeProvider>
  );
};
