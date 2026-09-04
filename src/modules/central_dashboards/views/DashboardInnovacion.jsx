// =========================================================================
// VISTA PRESENTADORA: DashboardInnovacion.jsx
// =========================================================================

import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  Card,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  UploadFile as CargaIcon,
  Shield as AuditoriaIcon,
  ExitToApp as LogoutIcon,
  Lightbulb as LightbulbIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon,
  Check as CheckIcon,
  CheckCircleOutline,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  Adjust as TargetIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';

import { useDashboardInnovacion, YEARS, CAT_COLORS } from './DashboardInnovacion.hooks';
import { styles } from './DashboardInnovacion.styles';
import { DashboardHeader, KpiCard, DashboardSection } from '../components';
import logoEcas from '../../../assets/logo_ECAS_white.svg';

const dashboardLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E2875',
    },
    secondary: {
      main: '#3EC9FF',
    },
    background: {
      default: '#F8F8F8',
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
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          '&:before': { display: 'none' },
          '&.Mui-expanded': {
            margin: '0',
            backgroundColor: 'transparent',
          },
        },
      },
    },
  },
});

// =========================================================================
// COMPONENTE PRINCIPAL
// =========================================================================

export const DashboardInnovacion = () => {
  const {
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
    yearRange,
    setYearRange,
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
    drawerPeriodIndex,
    drawerLoading,
    handleOpenIndicator,
    handleCloseDrawer,
    handleDrawerStep,
    tooltip,
    showTooltip,
    moveTooltip,
    hideTooltip,
    faqData,
    apiLoading,
    apiFilters,
    dynamicEstados,
    dynamicAreas,
    dynamicTipos,
    dynamicSemestres,
    dynamicFuentes,
    dynamicExternos,
    hasData,
    kpis,
    availableYears,
    minYear,
    maxYear,
    visibleYears,
    proyActivos,
    proyFinalizados,
    proyAreas,
    seccionesCurso,
    docentes,
    finExterno,
    activeMenu,
  } = useDashboardInnovacion();

  const getAxisMax = (val) => {
    if (val <= 0) return 10;
    const paddedVal = val * 1.15;
    if (paddedVal <= 50) return Math.ceil(paddedVal / 10) * 10;
    if (paddedVal <= 200) return Math.ceil(paddedVal / 40) * 40;
    if (paddedVal <= 500) return Math.ceil(paddedVal / 100) * 100;
    if (paddedVal <= 1500) return Math.ceil(paddedVal / 500) * 500;
    if (paddedVal <= 4000) return Math.ceil(paddedVal / 1000) * 1000;
    return Math.ceil(paddedVal / 2000) * 2000;
  };

  const getAxisTicks = (val) => {
    if (val <= 0) return 5;
    if (val <= 50) return 10;
    if (val <= 200) return 40;
    if (val <= 500) return 100;
    if (val <= 1500) return 500;
    if (val <= 4000) return 1000;
    return 2000;
  };

  // Contenido de la barra lateral institucional
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
            { text: 'Metas', icon: <TargetIcon />, path: '/metas' },
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
                  handleDrawerToggle(); // Cierra el drawer móvil si se hace click
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

  // Contenido de los filtros
  const filtersContent = (
    <Box sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      height: 'calc(100% - 56px)', 
      overflow: 'hidden',
      bgcolor: '#FFFFFF',
    }}>
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        px: 2.5, 
        py: 2.5, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2.5,
        bgcolor: '#FFFFFF',
      }}>
        {/* Indicador de Filtros Activos */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: activeFiltersCount > 0 ? 600 : 500,
              color: activeFiltersCount > 0 ? '#0E86B8' : '#94A3B8',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {activeFiltersCount} {activeFiltersCount === 1 ? 'filtro activo' : 'filtros activos'}
          </Typography>
        </Box>

        {/* Slider de Años */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="subtitle2" sx={{ fontSize: '13px', fontWeight: 700, color: '#475569', letterSpacing: '0.5px' }}>
            Año
          </Typography>
          <Box sx={{ px: 1, mt: 0.5 }}>
            <Slider
              value={yearRange}
              onChange={(e, val) => setYearRange(val)}
              valueLabelDisplay="auto"
              min={minYear}
              max={maxYear}
              step={1}
              marks={availableYears.length ? availableYears.map(y => ({ value: y, label: String(y) })) : [
                { value: 2023, label: '2023' },
                { value: 2024, label: '2024' },
                { value: 2025, label: '2025' },
                { value: 2026, label: '2026' }
              ]}
              sx={styles.ageSliderStyle}
            />
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 1.5, fontWeight: 600, color: '#1E2875', fontSize: '13px' }}>
              {yearRange[0] === yearRange[1] ? yearRange[0] : `${yearRange[0]} — ${yearRange[1]}`}
            </Typography>
          </Box>
        </Box>

        {/* Acordeón: Estado */}
        {dynamicEstados.length > 0 && (
          <Accordion
            expanded={accordionsOpen.estado}
            onChange={() => handleToggleAccordion('estado')}
            sx={{ boxShadow: 'none', border: 'none', margin: '0 !important', bgcolor: 'transparent !important', '&:before': { display: 'none' } }}
          >
            <AccordionSummary sx={{ p: 0, minHeight: '0 !important', margin: '0 !important', '& .MuiAccordionSummary-content': { my: 1, margin: '0 !important', display: 'flex', alignItems: 'center', gap: 1 } }}>
              <ChevronRightIcon style={{ transform: accordionsOpen.estado ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms', color: '#475569', fontSize: 16 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'none', letterSpacing: '0.06em' }}>
                Estado
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={styles.filterCatLabel}>Estado de proyecto</Typography>
              <Box sx={styles.filterChips}>
                {dynamicEstados.map((chip) => {
                  const isSel = (selectedChips.estado || []).includes(chip.value);
                  return (
                    <Box
                      key={chip.value}
                      sx={styles.filterChip(isSel)}
                      onClick={() => handleToggleChip('estado', chip.value)}
                    >
                      {isSel && <CheckIcon sx={{ fontSize: '12px' }} />}
                      {chip.label}
                    </Box>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Acordeón: Área temática */}
        {dynamicAreas.length > 0 && (
          <Accordion
            expanded={accordionsOpen.area}
            onChange={() => handleToggleAccordion('area')}
            sx={{ boxShadow: 'none', border: 'none', margin: '0 !important', bgcolor: 'transparent !important', '&:before': { display: 'none' } }}
          >
            <AccordionSummary sx={{ p: 0, minHeight: '0 !important', margin: '0 !important', '& .MuiAccordionSummary-content': { my: 1, margin: '0 !important', display: 'flex', alignItems: 'center', gap: 1 } }}>
              <ChevronRightIcon style={{ transform: accordionsOpen.area ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms', color: '#475569', fontSize: 16 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'none', letterSpacing: '0.06em' }}>
                Área temática
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={styles.filterCatLabel}>Área de innovación</Typography>
              <Box sx={styles.filterChips}>
                {dynamicAreas.map((chip) => {
                  const isSel = (selectedChips.area || []).includes(chip.value);
                  return (
                    <Box
                      key={chip.value}
                      sx={styles.filterChip(isSel)}
                      onClick={() => handleToggleChip('area', chip.value)}
                    >
                      {isSel && <CheckIcon sx={{ fontSize: '12px' }} />}
                      {chip.label}
                    </Box>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Acordeón: Tipo de proyecto */}
        {dynamicTipos.length > 0 && (
          <Accordion
            expanded={accordionsOpen.tipo}
            onChange={() => handleToggleAccordion('tipo')}
            sx={{ boxShadow: 'none', border: 'none', margin: '0 !important', bgcolor: 'transparent !important', '&:before': { display: 'none' } }}
          >
            <AccordionSummary sx={{ p: 0, minHeight: '0 !important', margin: '0 !important', '& .MuiAccordionSummary-content': { my: 1, margin: '0 !important', display: 'flex', alignItems: 'center', gap: 1 } }}>
              <ChevronRightIcon style={{ transform: accordionsOpen.tipo ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms', color: '#475569', fontSize: 16 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'none', letterSpacing: '0.06em' }}>
                Tipo de proyecto
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={styles.filterCatLabel}>Clasificación</Typography>
              <Box sx={styles.filterChips}>
                {dynamicTipos.map((chip) => {
                  const isSel = (selectedChips.tipo || []).includes(chip.value);
                  return (
                    <Box
                      key={chip.value}
                      sx={styles.filterChip(isSel)}
                      onClick={() => handleToggleChip('tipo', chip.value)}
                    >
                      {isSel && <CheckIcon sx={{ fontSize: '12px' }} />}
                      {chip.label}
                    </Box>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Acordeón: Semestre */}
        {dynamicSemestres.length > 0 && (
          <Accordion
            expanded={accordionsOpen.semestre}
            onChange={() => handleToggleAccordion('semestre')}
            sx={{ boxShadow: 'none', border: 'none', margin: '0 !important', bgcolor: 'transparent !important', '&:before': { display: 'none' } }}
          >
            <AccordionSummary sx={{ p: 0, minHeight: '0 !important', margin: '0 !important', '& .MuiAccordionSummary-content': { my: 1, margin: '0 !important', display: 'flex', alignItems: 'center', gap: 1 } }}>
              <ChevronRightIcon style={{ transform: accordionsOpen.semestre ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms', color: '#475569', fontSize: 16 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'none', letterSpacing: '0.06em' }}>
                Semestre
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={styles.filterCatLabel}>Período académico</Typography>
              <Box sx={styles.filterChips}>
                {dynamicSemestres.map((chip) => {
                  const isSel = (selectedChips.semestre || []).includes(chip.value);
                  return (
                    <Box
                      key={chip.value}
                      sx={styles.filterChip(isSel)}
                      onClick={() => handleToggleChip('semestre', chip.value)}
                    >
                      {isSel && <CheckIcon sx={{ fontSize: '12px' }} />}
                      {chip.label}
                    </Box>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Acordeón: Financiamiento */}
        {(dynamicExternos.length > 0 || dynamicFuentes.length > 0) && (
          <Accordion
            expanded={accordionsOpen.financiamiento}
            onChange={() => handleToggleAccordion('financiamiento')}
            sx={{ boxShadow: 'none', border: 'none', margin: '0 !important', bgcolor: 'transparent !important', '&:before': { display: 'none' } }}
          >
            <AccordionSummary sx={{ p: 0, minHeight: '0 !important', margin: '0 !important', '& .MuiAccordionSummary-content': { my: 1, margin: '0 !important', display: 'flex', alignItems: 'center', gap: 1 } }}>
              <ChevronRightIcon style={{ transform: accordionsOpen.financiamiento ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms', color: '#475569', fontSize: 16 }} />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'none', letterSpacing: '0.06em' }}>
                Financiamiento
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {dynamicExternos.length > 0 && (
                <>
                  <Typography sx={styles.filterCatLabel}>Financiamiento externo</Typography>
                  <Box sx={styles.filterChips}>
                    {dynamicExternos.map((chip) => {
                      const isSel = (selectedChips.externo || []).includes(chip.value);
                      return (
                        <Box
                          key={chip.value}
                          sx={styles.filterChip(isSel)}
                          onClick={() => handleToggleChip('externo', chip.value)}
                        >
                          {isSel && <CheckIcon sx={{ fontSize: '12px' }} />}
                          {chip.label}
                        </Box>
                      );
                    })}
                  </Box>
                </>
              )}

              {dynamicFuentes.length > 0 && (
                <>
                  <Typography sx={{ ...styles.filterCatLabel, mt: 1 }}>Fuente</Typography>
                  <Box sx={styles.filterChips}>
                    {dynamicFuentes.map((chip) => {
                      const isSel = (selectedChips.fuente || []).includes(chip.value);
                      return (
                        <Box
                          key={chip.value}
                          sx={styles.filterChip(isSel)}
                          onClick={() => handleToggleChip('fuente', chip.value)}
                        >
                          {isSel && <CheckIcon sx={{ fontSize: '12px' }} />}
                          {chip.label}
                        </Box>
                      );
                    })}
                  </Box>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        )}
      </Box>

      {/* Mensaje sin datos */}
      {!apiLoading && !hasData && (
        <Box sx={styles.filterNoDataBox}>
          <Typography sx={{ fontSize: '13px', color: '#92400E', textAlign: 'center', fontWeight: 500 }}>
            No hay datos disponibles para los filtros.
          </Typography>
        </Box>
      )}

      {/* Footer Reset Button */}
      <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
        <Box
          component="button"
          sx={styles.btnReset}
          onClick={handleResetFilters}
        >
          <RefreshIcon sx={{ fontSize: '16px' }} />
          Restablecer filtros
        </Box>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={dashboardLightTheme}>
      <Box sx={styles.mainLayout} onMouseMove={moveTooltip}>
      {/* APP BAR MÓVIL */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            <Box 
              component="img" 
              src={logoEcas} 
              alt="Logo ECAS" 
              sx={{ width: 24, height: 24, objectFit: 'contain' }} 
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff', letterSpacing: 0.5 }}>
              PIADI ECAS
            </Typography>
          </Box>
          <IconButton
            color="inherit"
            onClick={() => setMobileFiltersOpen(true)}
            sx={{ ml: 'auto' }}
          >
            <FilterIcon />
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

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <Box component="main" sx={styles.contentArea}>
        {/* Cabecera del Panel Principal */}
        <DashboardHeader
          title="Dashboard de Innovación"
          subtitle="Visualización de estadísticas y métricas del área de Innovación e investigación"
          icon={<LightbulbIcon />}
          iconColor="#3EC9FF"
          loading={apiLoading}
        />

        {/* 3 Tarjetas KPI Superiores */}
        <Box sx={styles.kpiRow}>
          <KpiCard
            label="Proyectos de innovación en curso"
            value={kpis.activos.val}
            icon={<LightbulbIcon />}
            accentColor="#3EC9FF"
            hasData={hasData}
            loading={apiLoading}
            compareText={kpis.activos.compareText}
            evolution={kpis.activos.evo}
            isPositive={kpis.activos.isPositive}
            onClick={() => handleOpenIndicator('proyectos-activos')}
          />

          <KpiCard
            label="Proyectos finalizados"
            value={kpis.finalizados.val}
            icon={<CheckCircleOutline />}
            accentColor="#10B981"
            hasData={hasData}
            loading={apiLoading}
            compareText={kpis.finalizados.compareText}
            evolution={kpis.finalizados.evo}
            isPositive={kpis.finalizados.isPositive}
            onClick={() => handleOpenIndicator('proyectos-finalizados')}
          />

          <KpiCard
            label="Docentes/funcionarios involucrados"
            value={kpis.docentes.val}
            icon={<GroupIcon />}
            accentColor="#7C6FF0"
            hasData={hasData}
            loading={apiLoading}
            compareText={kpis.docentes.compareText}
            evolution={kpis.docentes.evo}
            isPositive={kpis.docentes.isPositive}
            onClick={() => handleOpenIndicator('docentes')}
          />
        </Box>

        {/* 1. Proyectos de innovación activos */}
        <DashboardSection
          title="Proyectos de innovación activos"
          subtitle="Distribución por año"
          icon={<LightbulbIcon />}
          iconColor="#3EC9FF"
          isOpen={!collapsedSections['proy-year']}
          onToggle={() => handleToggleSection('proy-year')}
          hasData={hasData && proyActivos.some(v => v > 0)}
        >
          <Box sx={{ minHeight: 260, width: '100%' }}>
            <BarChart
              colors={['#0E86B8']}
              grid={{ horizontal: true }}
              xAxis={[{ scaleType: 'band', data: visibleYears.map(String) }]}
              series={[{ data: proyActivos, label: 'Proyectos Activos' }]}
              height={270}
              margin={{ top: 30, right: 20, bottom: 40, left: 40 }}
              slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' } } }}
            />
          </Box>
        </DashboardSection>

        {/* 2. Proyectos finalizados */}
        <DashboardSection
          title="Proyectos finalizados"
          subtitle="Distribución por año"
          icon={<CheckCircleOutline />}
          iconColor="#10B981"
          isOpen={!collapsedSections['fin-year']}
          onToggle={() => handleToggleSection('fin-year')}
          hasData={hasData && proyFinalizados.some(v => v > 0)}
        >
          <Box sx={{ minHeight: 260, width: '100%' }}>
            <BarChart
              colors={['#10B981']}
              grid={{ horizontal: true }}
              xAxis={[{ scaleType: 'band', data: visibleYears.map(String) }]}
              series={[{ data: proyFinalizados, label: 'Proyectos Finalizados' }]}
              height={270}
              margin={{ top: 30, right: 20, bottom: 40, left: 40 }}
              slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' } } }}
            />
          </Box>
        </DashboardSection>

        {/* 3. Áreas temáticas de innovación */}
        <DashboardSection
          title="Áreas temáticas de innovación"
          subtitle="Distribución por área temática"
          icon={<TargetIcon />}
          iconColor="#3EC9FF"
          isOpen={!collapsedSections['proy-area']}
          onToggle={() => handleToggleSection('proy-area')}
          hasData={hasData && proyAreas.length > 0}
        >
          <Box sx={{ minHeight: 260, width: '100%' }}>
            <PieChart
              colors={CAT_COLORS}
              series={[{
                data: proyAreas.map((d, i) => ({ id: i, value: d.value, label: d.label })),
                innerRadius: 45,
                outerRadius: 85,
              }]}
              height={270}
              margin={{ top: 10, bottom: 60, left: 10, right: 10 }}
              slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' } } }}
            />
          </Box>
        </DashboardSection>

        {/* 4. Secciones del curso de innovación */}
        <DashboardSection
          title="Secciones del curso de innovación"
          subtitle="Secciones por semestre"
          icon={<CalendarIcon />}
          iconColor="#3EC9FF"
          isOpen={!collapsedSections['secciones-hbar']}
          onToggle={() => handleToggleSection('secciones-hbar')}
          hasData={hasData && seccionesCurso.length > 0}
        >
          <Box sx={{ minHeight: 260, width: '100%' }}>
            <BarChart
              layout="horizontal"
              colors={['#3EC9FF']}
              grid={{ vertical: true }}
              yAxis={[{ scaleType: 'band', data: seccionesCurso.map(d => d.label) }]}
              series={[{ data: seccionesCurso.map(d => d.value), label: 'Secciones' }]}
              height={270}
              margin={{ top: 20, right: 30, bottom: 40, left: 120 }}
              slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' } } }}
            />
          </Box>
        </DashboardSection>

        {/* 5. Docentes involucrados */}
        <DashboardSection
          title="Docentes involucrados"
          subtitle="Tendencia por año"
          icon={<TrendingUpIcon />}
          iconColor="#7C6FF0"
          isOpen={!collapsedSections['doc-line']}
          onToggle={() => handleToggleSection('doc-line')}
          hasData={hasData && docentes.some(v => v > 0)}
        >
          <Box sx={{ minHeight: 260, width: '100%' }}>
            <LineChart
              grid={{ horizontal: true }}
              xAxis={[{ scaleType: 'band', data: visibleYears.map(String) }]}
              series={[{ 
                data: docentes, 
                label: 'Docentes Involucrados', 
                color: '#7C6FF0',
                showMark: true 
              }]}
              yAxis={[{ 
                min: 0, 
                max: getAxisMax(Math.max(...docentes, 0)), 
                width: 35, 
                tickInterval: getAxisTicks(Math.max(...docentes, 0)) 
              }]}
              height={270}
              margin={{ top: 30, right: 10, bottom: 65, left: 40 }}
              slotProps={{ 
                legend: { 
                  direction: 'row', 
                  position: { vertical: 'bottom', horizontal: 'middle' }, 
                  labelStyle: { fontSize: '11px' } 
                } 
              }}
            />
          </Box>
        </DashboardSection>

        {/* 6. Proyectos con financiamiento externo */}
        <DashboardSection
          title="Proyectos con financiamiento externo"
          subtitle="Proyectos FDI por año"
          icon={<AuditoriaIcon />}
          iconColor="#3EC9FF"
          isOpen={!collapsedSections['fin-externo']}
          onToggle={() => handleToggleSection('fin-externo')}
          hasData={hasData && finExterno.some(v => v > 0)}
        >
          <Box sx={{ minHeight: 260, width: '100%' }}>
            <BarChart
              colors={['#0E86B8']}
              grid={{ horizontal: true }}
              xAxis={[{ scaleType: 'band', data: visibleYears.map(String) }]}
              series={[{ data: finExterno, label: 'Proyectos FDI' }]}
              height={270}
              margin={{ top: 30, right: 20, bottom: 40, left: 40 }}
              slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' } } }}
            />
          </Box>
        </DashboardSection>
      </Box>

      {/* SIDEBAR LATERAL DERECHO (Filtros responsive) */}
      <Drawer
        anchor="right"
        variant="temporary"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, border: 'none' },
        }}
      >
        {filtersContent}
      </Drawer>

      {/* Sidebar colapsable para Desktop integrado con el diseño */}
      <Box
        component="aside"
        sx={styles.filtersSidebar(filtersCollapsed)}
      >
        {/* Si está colapsado: Botón estilizado 'Filtros' con embudo institucional */}
        {filtersCollapsed ? (
          <Box
            onClick={() => setFiltersCollapsed(false)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1.1,
              bgcolor: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              boxSizing: 'border-box',
              transition: 'all 200ms ease-in-out',
              '&:hover': {
                bgcolor: '#F4FCFF',
                borderColor: '#0E86B8',
                boxShadow: '0 4px 12px rgba(14, 134, 184, 0.2)',
              },
            }}
          >
            <FilterIcon sx={{ color: '#0E86B8', fontSize: 18 }} />
            <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#1E2875', fontFamily: "'Inter', sans-serif" }}>
              Filtros
            </Typography>
          </Box>
        ) : (
          /* Cabecera cuando está expandido */
          <>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              p: '16px 14px',
              bgcolor: '#F8FAFC',
              borderBottom: '1px solid #E2E8F0',
              height: '56px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FilterIcon sx={{ color: '#0E86B8', fontSize: 18 }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E2875', fontSize: '14px' }}>
                  Filtros Innovación
                </Typography>
              </Box>
              <IconButton 
                onClick={() => setFiltersCollapsed(true)}
                size="small"
                sx={{ 
                  color: '#1E2875',
                  width: '32px',
                  height: '32px',
                  bgcolor: 'rgba(30, 40, 117, 0.05)',
                  '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.1)' }
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
            {filtersContent}
          </>
        )}
      </Box>

      {/* DRAWER MODAL: DETALLE DEL INDICADOR */}
      <Box sx={styles.drawerOverlay(drawerOpen)} onClick={handleCloseDrawer} />
      <Box component="aside" sx={styles.indicatorDrawer(drawerOpen)}>
        <Box sx={styles.drawerHeader}>
          <Box sx={styles.drawerTitleRow}>
            <Typography sx={styles.drawerTitle}>
              {currentIndicator.title}
            </Typography>
            <IconButton size="small" onClick={handleCloseDrawer}>
              <CloseIcon sx={{ fontSize: '20px' }} />
            </IconButton>
          </Box>
        </Box>

        <Box sx={styles.drawerBody}>
          {drawerLoading ? (
            <Box sx={{ py: 6, textAlign: 'center', color: '#9E9E9E' }}>
              <Typography variant="body2">Cargando detalles del indicador...</Typography>
            </Box>
          ) : (
            <>
              {currentIndicator.desc && (
                <Box>
                  <Typography sx={styles.drawerDescLabel}>Qué mide</Typography>
                  <Typography sx={styles.drawerDesc}>{currentIndicator.desc}</Typography>
                </Box>
              )}

              {currentIndicator.metric && (
                <Box sx={styles.drawerMetricBox}>
                  <Typography sx={styles.drawerMetricLabel}>
                    {currentIndicator.metric.label}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                    <Typography sx={styles.drawerMetricValue}>
                      {Number(currentIndicator.metric.value).toLocaleString('es-CL')}
                    </Typography>
                    {currentIndicator.trend && (
                      <Typography
                        variant="caption"
                        sx={{
                          color: currentIndicator.trend.delta >= 0 ? '#059669' : '#dc2626',
                          fontWeight: 700,
                          fontSize: '12px',
                        }}
                      >
                        {currentIndicator.trend.delta >= 0 ? '▲ +' : '▼ -'}
                        {Math.abs(currentIndicator.trend.delta)} vs {currentIndicator.trend.baseline}
                      </Typography>
                    )}
                  </Box>

                  {currentIndicator.meta && (
                    <Box sx={styles.drawerMetaBadge(currentIndicator.metric.value >= currentIndicator.meta.target)}>
                      <CheckCircleOutline sx={{ fontSize: '15px' }} />
                      {currentIndicator.metric.value >= currentIndicator.meta.target
                        ? 'Meta cumplida'
                        : `Meta en curso (${Math.round((currentIndicator.metric.value / currentIndicator.meta.target) * 100)}%)`}
                    </Box>
                  )}
                </Box>
              )}

              {currentIndicator.rows && (
                <Box sx={styles.drawerTableWrap}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'Inter' }}>
                    <thead>
                      <tr style={{ background: '#F5F5F5', borderBottom: '1px solid #E0E0E0' }}>
                        {(currentIndicator.colLabels || ['Período', 'Valor']).map((col, idx) => (
                          <th
                            key={idx}
                            style={{
                              padding: '8px 12px',
                              textAlign: idx === 0 ? 'left' : 'right',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              color: '#9E9E9E',
                            }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentIndicator.rows.map((row, rIdx) => (
                        <tr key={rIdx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                          <td style={{ padding: '8px 12px', color: '#212121', fontWeight: 500 }}>{row[0]}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', color: '#212121', fontWeight: 600 }}>
                            {typeof row[1] === 'number' ? row[1].toLocaleString('es-CL') : row[1]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              )}
            </>
          )}
        </Box>

        <Box sx={styles.drawerFooter}>
          <CalendarIcon sx={{ fontSize: '16px' }} />
          <span>Período visualizado: Años: 2023 a 2026</span>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              disabled={drawerPeriodIndex <= 0}
              onClick={() => handleDrawerStep(-1)}
            >
              ◀
            </IconButton>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#212121', px: 0.5 }}>
              {YEARS[drawerPeriodIndex]}
            </Typography>
            <IconButton
              size="small"
              disabled={drawerPeriodIndex >= YEARS.length - 1}
              onClick={() => handleDrawerStep(1)}
            >
              ▶
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* TOOLTIP INTERACTIVO FLOTANTE */}
      {tooltip.visible && (
        <Box
          sx={{
            position: 'fixed',
            left: tooltip.x + 12,
            top: tooltip.y - 35,
            pointerEvents: 'none',
            bgcolor: '#212121',
            opacity: 0.95,
            color: '#FFFFFF',
            borderRadius: '6px',
            p: '6px 10px',
            fontSize: '12px',
            fontFamily: 'Inter',
            zIndex: 2000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}
        >
          <Box sx={{ fontWeight: 700 }}>{tooltip.label}</Box>
          {tooltip.detail && <Box sx={{ fontSize: '11px', color: '#E0E0E0', mt: 0.3 }}>{tooltip.detail}</Box>}
        </Box>
      )}

      {/* BOTÓN FLOTANTE DE CENTRO DE AYUDA (?) */}
      <IconButton
        sx={styles.floatingHelpButton}
        onClick={() => setOpenHelpDialog(true)}
        aria-label="Centro de ayuda"
      >
        <HelpIcon sx={{ fontSize: '26px' }} />
      </IconButton>

      {/* MODAL DE CENTRO DE AYUDA */}
      <Dialog
        open={openHelpDialog}
        onClose={() => setOpenHelpDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            p: 1,
            bgcolor: '#FFFFFF',
            color: '#212121',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HelpIcon sx={{ color: '#1E2875' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2875' }}>
              Centro de Ayuda — Innovación
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenHelpDialog(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1 }}>
          {faqData.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                boxShadow: 'none',
                border: '1px solid #E5E7EB',
                borderRadius: '8px !important',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E2875' }}>
                  {faq.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Typography variant="body2" sx={{ color: '#4B5563', lineHeight: 1.6 }}>
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>
      </Dialog>
    </Box>
    </ThemeProvider>
  );
};
