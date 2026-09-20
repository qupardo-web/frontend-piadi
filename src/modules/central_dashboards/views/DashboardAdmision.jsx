import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Drawer,
  IconButton,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  Card,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import {
  School as AdmisionIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  FilterAlt as FilterIcon,
  RestartAlt as ResetIcon,
  Check as CheckIcon,
  CheckCircleOutline,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Group as GroupIcon,
  MenuBook as BookIcon,
  LocationOn as LocationIcon,
  AccountBalance as BankIcon,
  Wc as SexIcon,
  Cake as AgeIcon,
  Apartment as BuildingIcon,
  Badge as BadgeIcon,
  PieChart as PieIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';

import { 
  useDashboardAdmision, 
  YEARS, 
  CAT_COLORS, 
  RAMP_COLORS 
} from './DashboardAdmision.hooks';
import { styles } from './DashboardAdmision.styles';
import { Header, Sidebar, KpiCard, DashboardSection, DashboardFilterSidebar } from '../../../components';

const dashboardLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E2875',
    },
    secondary: {
      main: '#5151CC',
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

export const DashboardAdmision = () => {
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
  } = useDashboardAdmision();

  return (
    <ThemeProvider theme={dashboardLightTheme}>
      <Box sx={styles.mainLayout}>
        {/* SCOPED STYLE BLOCK TO AVOID GLOBAL COLLISION & FIX TICK LABELS */}
        <style dangerouslySetInnerHTML={{__html: `
          .admision-dashboard {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
          }
          .admision-dashboard svg text,
          .admision-dashboard svg text tspan,
          .admision-dashboard svg tspan {
            fill: #1e293b !important;
            opacity: 1 !important;
            fill-opacity: 1 !important;
          }
          .admision-dashboard .MuiChartsAxis-label,
          .admision-dashboard .MuiChartsAxis-tickLabel,
          .admision-dashboard .MuiChartsLegend-root text,
          .admision-dashboard .MuiChartsLegend-root text tspan,
          .admision-dashboard .MuiChartsLegend-root tspan {
            fill: #1E2875 !important;
            font-weight: 500 !important;
            opacity: 1 !important;
            fill-opacity: 1 !important;
          }
          .admision-dashboard .MuiChartsGrid-line {
            stroke: #E2E8F0 !important;
            stroke-width: 1px !important;
            stroke-dasharray: none !important;
          }
        `}} />

        {/* SIDEBAR TRANSVERSAL (Escritorio + Drawer + AppBar Móvil con botón de filtros) */}
        <Sidebar
          mobileRightAction={
            <IconButton
              color="inherit"
              onClick={() => setMobileFiltersOpen(true)}
              sx={{ p: 0.5, color: '#ffffff' }}
              aria-label="Abrir filtros"
            >
              <FilterIcon />
            </IconButton>
          }
        />

        {/* ÁREA DE CONTENIDO PRINCIPAL */}
        <Box component="main" sx={styles.contentArea} className="admision-dashboard">
          {/* Cabecera del Panel Principal */}
          <Header
            title="Dashboard de Admisión"
            subtitle="Matrícula, admisión y caracterización de estudiantes de pregrado"
            icon={<AdmisionIcon />}
            iconColor="#1E2875"
            loading={apiLoading}
          />

          {/* 3 Tarjetas KPI Superiores */}
          <Box sx={styles.kpiRow}>
            <KpiCard
              label={`Matrícula total (${yearRange[1]})`}
              value={kpis.matriculaTotal.val}
              icon={<AdmisionIcon />}
              accentColor="#1E2875"
              hasData={hasData}
              loading={apiLoading}
              compareText={kpis.matriculaTotal.compareText}
              evolution={kpis.matriculaTotal.evo}
              isPositive={kpis.matriculaTotal.isPositive}
              onClick={() => handleOpenIndicator('matricula-total')}
            />

            <KpiCard
              label="Nuevos vs antiguos"
              value={kpis.nuevosAntiguos.val}
              icon={<TrendingUpIcon />}
              accentColor="#5151CC"
              hasData={hasData}
              loading={apiLoading}
              compareText={kpis.nuevosAntiguos.compareText}
              evolution={kpis.nuevosAntiguos.evo}
              isPositive={kpis.nuevosAntiguos.isPositive}
              onClick={() => handleOpenIndicator('nuevos-antiguos')}
            />

            <KpiCard
              label="Vía de acceso principal"
              value={kpis.viaAcceso.val}
              icon={<GroupIcon />}
              accentColor="#3E8FD9"
              hasData={hasData}
              loading={apiLoading}
              compareText={kpis.viaAcceso.compareText}
              evolution={kpis.viaAcceso.evo}
              isPositive={kpis.viaAcceso.isPositive}
              onClick={() => handleOpenIndicator('via-acceso-kpi')}
            />
          </Box>

          {/* Toolbar: Pestañas de Secciones */}
          <Box sx={styles.toolbarRow}>
            <Box sx={styles.sectionTabsContainer} role="tablist">
              <Button
                role="tab"
                aria-selected={activeTab === 'matricula'}
                onClick={() => setActiveTab('matricula')}
                sx={styles.sectionTabBtn(activeTab === 'matricula')}
              >
                Matrícula y Académico
              </Button>
              <Button
                role="tab"
                aria-selected={activeTab === 'caracterizacion'}
                onClick={() => setActiveTab('caracterizacion')}
                sx={styles.sectionTabBtn(activeTab === 'caracterizacion')}
              >
                Caracterización del Estudiante
              </Button>
            </Box>
          </Box>

          {/* ========================================================================= */}
          {/* SECCIÓN 1: Matrícula y Académico */}
          {/* ========================================================================= */}
          {activeTab === 'matricula' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 1. Matrícula total por período */}
              <DashboardSection
                title="Matrícula total por período"
                icon={<BarChartIcon />}
                iconColor="#1E2875"
                isOpen={!collapsedSections['mat-total']}
                onToggle={() => handleToggleSection('mat-total')}
                hasData={hasData && matTotalData.some(d => (d.s1 + d.s2) > 0)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Barras apiladas por año (Semestre 1 / Semestre 2)
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('matricula-total')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 270, width: '100%' }}>
                  <BarChart
                    grid={{ horizontal: true }}
                    xAxis={[{ scaleType: 'band', data: matTotalData.map(d => String(d.year)) }]}
                    series={[
                      { data: matTotalData.map(d => d.s1), label: 'Semestre 1', stack: 'total', color: '#171796' },
                      { data: matTotalData.map(d => d.s2), label: 'Semestre 2', stack: 'total', color: '#8181DE' }
                    ]}
                    height={280}
                    margin={{ top: 30, right: 20, bottom: 40, left: 45 }}
                    slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' } } }}
                  />
                </Box>
              </DashboardSection>

              {/* 2. Matrícula nuevos vs antiguos */}
              <DashboardSection
                title="Matrícula nuevos vs antiguos"
                icon={<GroupIcon />}
                iconColor="#5151CC"
                isOpen={!collapsedSections['mat-nuevos']}
                onToggle={() => handleToggleSection('mat-nuevos')}
                hasData={hasData && matNuevosData.some(d => (d.nuevos + d.antiguos) > 0)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Barras apiladas por año
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('nuevos-antiguos')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 270, width: '100%' }}>
                  <BarChart
                    grid={{ horizontal: true }}
                    xAxis={[{ scaleType: 'band', data: matNuevosData.map(d => String(d.year)) }]}
                    series={[
                      { data: matNuevosData.map(d => d.nuevos), label: 'Nuevos', stack: 'total', color: '#171796' },
                      { data: matNuevosData.map(d => d.antiguos), label: 'Antiguos', stack: 'total', color: '#3E8FD9' }
                    ]}
                    height={280}
                    margin={{ top: 30, right: 20, bottom: 40, left: 45 }}
                    slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' } } }}
                  />
                </Box>
              </DashboardSection>

              {/* 3. Matrícula por asignatura */}
              <DashboardSection
                title="Matrícula por asignatura"
                icon={<BookIcon />}
                iconColor="#5151CC"
                isOpen={!collapsedSections['mat-asignatura']}
                onToggle={() => handleToggleSection('mat-asignatura')}
                hasData={hasData && matAsignaturaData.length > 0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Ranking por asignatura
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('matricula-asignatura')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 320, width: '100%' }}>
                  <BarChart
                    layout="horizontal"
                    grid={{ vertical: true }}
                    xAxis={[{ min: 0, max: Math.max(...matAsignaturaData.map(d => d.value), 0) * 1.15 }]}
                    yAxis={[{ 
                      scaleType: 'band', 
                      data: matAsignaturaData.map(d => d.label),
                      width: 145,
                      tickLabelStyle: { fontSize: 11, fontWeight: 500 }
                    }]}
                    series={[{ data: matAsignaturaData.map(d => d.value), label: 'Estudiantes', color: '#5151CC' }]}
                    height={320}
                    margin={{ top: 20, right: 30, bottom: 30, left: 155 }}
                    slotProps={{ legend: { hidden: true } }}
                  />
                </Box>
              </DashboardSection>

              {/* 4. Matrícula por sección */}
              <DashboardSection
                title="Matrícula por sección"
                icon={<BuildingIcon />}
                iconColor="#171796"
                isOpen={!collapsedSections['mat-seccion']}
                onToggle={() => handleToggleSection('mat-seccion')}
                hasData={hasData && matSeccionData.length > 0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Estudiantes por sección
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('matricula-seccion')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 260, width: '100%' }}>
                  <BarChart
                    grid={{ horizontal: true }}
                    xAxis={[{ scaleType: 'band', data: matSeccionData.map(d => d.label) }]}
                    series={[{ data: matSeccionData.map(d => d.value), label: 'Estudiantes', color: '#171796' }]}
                    height={270}
                    margin={{ top: 30, right: 20, bottom: 40, left: 45 }}
                    slotProps={{ legend: { hidden: true } }}
                  />
                </Box>
              </DashboardSection>

              {/* 5. Matrícula por estado académico */}
              <DashboardSection
                title="Matrícula por estado académico"
                icon={<PieIcon />}
                iconColor="#8A4BD6"
                isOpen={!collapsedSections['mat-estado']}
                onToggle={() => handleToggleSection('mat-estado')}
                hasData={hasData && matEstadoData.length > 0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Distribución por estado
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('estado-academico')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 270, width: '100%' }}>
                  <PieChart
                    colors={CAT_COLORS}
                    series={[{
                      data: matEstadoData.map((d, i) => ({ id: i, value: d.value, label: d.label })),
                      innerRadius: 50,
                      outerRadius: 90,
                    }]}
                    height={270}
                    margin={{ top: 10, bottom: 60, left: 10, right: 10 }}
                    slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' } } }}
                  />
                </Box>
              </DashboardSection>
            </Box>
          )}

          {/* ========================================================================= */}
          {/* SECCIÓN 2: Caracterización del Estudiante */}
          {/* ========================================================================= */}
          {activeTab === 'caracterizacion' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* 6. Nivel socioeconómico (quintiles) */}
              <DashboardSection
                title="Nivel socioeconómico (quintiles)"
                icon={<BarChartIcon />}
                iconColor="#171796"
                isOpen={!collapsedSections['car-nse']}
                onToggle={() => handleToggleSection('car-nse')}
                hasData={hasData && carNseData.length > 0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Distribución por quintil
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('nivel-socioeconomico')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 260, width: '100%' }}>
                  <BarChart
                    grid={{ horizontal: true }}
                    xAxis={[{ scaleType: 'band', data: carNseData.map(d => d.label) }]}
                    series={[{ data: carNseData.map(d => d.value), label: 'Estudiantes', color: '#171796' }]}
                    height={270}
                    margin={{ top: 30, right: 20, bottom: 40, left: 45 }}
                    slotProps={{ legend: { hidden: true } }}
                  />
                </Box>
              </DashboardSection>

              {/* 7. Situación familiar */}
              <DashboardSection
                title="Situación familiar"
                icon={<GroupIcon />}
                iconColor="#5151CC"
                isOpen={!collapsedSections['car-familiar']}
                onToggle={() => handleToggleSection('car-familiar')}
                hasData={hasData && carFamiliarData.length > 0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Composición del hogar
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('situacion-familiar')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 270, width: '100%' }}>
                  <BarChart
                    layout="horizontal"
                    grid={{ vertical: true }}
                    xAxis={[{ min: 0, max: Math.max(...carFamiliarData.map(d => d.value), 0) * 1.15 }]}
                    yAxis={[{ 
                      scaleType: 'band', 
                      data: carFamiliarData.map(d => d.label),
                      width: 125,
                      tickLabelStyle: { fontSize: 11, fontWeight: 500 }
                    }]}
                    series={[{ data: carFamiliarData.map(d => d.value), label: 'Estudiantes', color: '#5151CC' }]}
                    height={270}
                    margin={{ top: 20, right: 30, bottom: 30, left: 135 }}
                    slotProps={{ legend: { hidden: true } }}
                  />
                </Box>
              </DashboardSection>

              {/* 8. Procedencia geográfica */}
              <DashboardSection
                title="Procedencia geográfica"
                icon={<LocationIcon />}
                iconColor="#3E8FD9"
                isOpen={!collapsedSections['car-region']}
                onToggle={() => handleToggleSection('car-region')}
                hasData={hasData && carRegionData.length > 0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Estudiantes por región de origen
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('procedencia-geografica')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 270, width: '100%' }}>
                  <BarChart
                    layout="horizontal"
                    grid={{ vertical: true }}
                    xAxis={[{ min: 0, max: Math.max(...carRegionData.map(d => d.value), 0) * 1.15 }]}
                    yAxis={[{ 
                      scaleType: 'band', 
                      data: carRegionData.map(d => d.label),
                      width: 125,
                      tickLabelStyle: { fontSize: 11, fontWeight: 500 }
                    }]}
                    series={[{ data: carRegionData.map(d => d.value), label: 'Estudiantes', color: '#3E8FD9' }]}
                    height={270}
                    margin={{ top: 20, right: 30, bottom: 30, left: 135 }}
                    slotProps={{ legend: { hidden: true } }}
                  />
                </Box>
              </DashboardSection>

              {/* 9. Tipo de colegio */}
              <DashboardSection
                title="Tipo de colegio"
                icon={<BuildingIcon />}
                iconColor="#171796"
                isOpen={!collapsedSections['car-colegio']}
                onToggle={() => handleToggleSection('car-colegio')}
                hasData={hasData && carColegioData.length > 0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Dependencia del establecimiento de origen
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('tipo-colegio')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 270, width: '100%' }}>
                  <PieChart
                    colors={['#171796', '#8181DE', '#B4B4EC']}
                    series={[{
                      data: carColegioData.map((d, i) => ({ id: i, value: d.value, label: d.label })),
                      innerRadius: 50,
                      outerRadius: 90,
                    }]}
                    height={270}
                    margin={{ top: 10, bottom: 60, left: 10, right: 10 }}
                    slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' } } }}
                  />
                </Box>
              </DashboardSection>

              {/* 10. Vía de acceso */}
              <DashboardSection
                title="Vía de acceso"
                icon={<BadgeIcon />}
                iconColor="#8A4BD6"
                isOpen={!collapsedSections['car-via']}
                onToggle={() => handleToggleSection('car-via')}
                hasData={hasData && carViaData.length > 0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Mecanismo de ingreso
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('via-acceso')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 270, width: '100%' }}>
                  <BarChart
                    layout="horizontal"
                    grid={{ vertical: true }}
                    xAxis={[{ min: 0, max: Math.max(...carViaData.map(d => d.value), 0) * 1.15 }]}
                    yAxis={[{ 
                      scaleType: 'band', 
                      data: carViaData.map(d => d.label),
                      width: 140,
                      tickLabelStyle: { fontSize: 11, fontWeight: 500 }
                    }]}
                    series={[{ data: carViaData.map(d => d.value), label: 'Estudiantes', color: '#8A4BD6' }]}
                    height={270}
                    margin={{ top: 20, right: 30, bottom: 30, left: 150 }}
                    slotProps={{ legend: { hidden: true } }}
                  />
                </Box>
              </DashboardSection>

              {/* 11. Beneficios y becas */}
              <DashboardSection
                title="Beneficios y becas"
                icon={<BankIcon />}
                iconColor="#2FB8A6"
                isOpen={!collapsedSections['car-becas']}
                onToggle={() => handleToggleSection('car-becas')}
                hasData={hasData && carBecasData.length > 0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Tipo de beneficio estudiantil
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('beneficios-becas')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 270, width: '100%' }}>
                  <PieChart
                    colors={['#171796', '#3E8FD9', '#2FB8A6', '#E0A63B']}
                    series={[{
                      data: carBecasData.map((d, i) => ({ id: i, value: d.value, label: d.label })),
                      innerRadius: 50,
                      outerRadius: 90,
                    }]}
                    height={270}
                    margin={{ top: 10, bottom: 60, left: 10, right: 10 }}
                    slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' } } }}
                  />
                </Box>
              </DashboardSection>

              {/* 12. Distribución por sexo */}
              <DashboardSection
                title="Distribución por sexo"
                icon={<SexIcon />}
                iconColor="#C24BC9"
                isOpen={!collapsedSections['car-sexo']}
                onToggle={() => handleToggleSection('car-sexo')}
                hasData={hasData && carSexoData.length > 0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Composición por sexo
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('distribucion-sexo')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 270, width: '100%' }}>
                  <PieChart
                    colors={['#5151CC', '#C24BC9', '#94A3B8']}
                    series={[{
                      data: carSexoData.map((d, i) => ({ id: i, value: d.value, label: d.label })),
                      innerRadius: 50,
                      outerRadius: 90,
                    }]}
                    height={270}
                    margin={{ top: 10, bottom: 60, left: 10, right: 10 }}
                    slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' } } }}
                  />
                </Box>
              </DashboardSection>

              {/* 13. Distribución por edad */}
              <DashboardSection
                title="Distribución por edad"
                icon={<AgeIcon />}
                iconColor="#171796"
                isOpen={!collapsedSections['car-edad']}
                onToggle={() => handleToggleSection('car-edad')}
                hasData={hasData && carEdadData.length > 0}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
                    Estudiantes por rango de edad
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('distribucion-edad')}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1E2875',
                      textTransform: 'none',
                      py: 0.25,
                      px: 1,
                      borderRadius: '6px',
                      '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.08)' }
                    }}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 260, width: '100%' }}>
                  <BarChart
                    grid={{ horizontal: true }}
                    xAxis={[{ scaleType: 'band', data: carEdadData.map(d => d.label) }]}
                    series={[{ data: carEdadData.map(d => d.value), label: 'Estudiantes', color: '#171796' }]}
                    height={270}
                    margin={{ top: 30, right: 20, bottom: 40, left: 45 }}
                    slotProps={{ legend: { hidden: true } }}
                  />
                </Box>
              </DashboardSection>
            </Box>
          )}
        </Box>

        {/* ----------------- SIDEBAR DE FILTROS MODULAR ----------------- */}
        <DashboardFilterSidebar
          title="Filtros Admisión"
          icon={<FilterIcon sx={{ color: '#1E2875', fontSize: 18 }} />}
          iconColor="#1E2875"
          collapsed={filtersCollapsed}
          onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
          mobileOpen={mobileFiltersOpen}
          onCloseMobile={() => setMobileFiltersOpen(false)}
          hasData={hasData}
          noDataMessage="No hay datos disponibles para los filtros seleccionados."
          onReset={handleResetFilters}
          resetLabel="Restablecer filtros"
        >
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
                marks={availableYears.map(y => ({ value: y, label: String(y) }))}
                sx={styles.ageSliderStyle}
              />
              <Typography variant="body2" sx={{ textAlign: 'center', mt: 1.5, fontWeight: 600, color: '#1E2875', fontSize: '13px' }}>
                {yearRange[0] === yearRange[1] ? yearRange[0] : `${yearRange[0]} — ${yearRange[1]}`}
              </Typography>

              {/* Checkbox para Período Acumulado */}
              {yearRange[0] !== yearRange[1] && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={periodoAcumulado}
                        onChange={(e) => setPeriodoAcumulado(e.target.checked)}
                        size="small"
                        sx={{
                          color: '#1E2875',
                          '&.Mui-checked': {
                            color: '#1DC2A0',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 500, color: '#475569' }}>
                        Período acumulado
                      </Typography>
                    }
                    sx={{ mx: 0 }}
                  />
                </Box>
              )}
            </Box>
          </Box>

          {/* Acordeón: Semestre */}
          <Accordion 
            expanded={accordionsOpen.semestre} 
            onChange={() => handleToggleAccordion('semestre')}
            sx={styles.filterAccordion}
          >
            <AccordionSummary sx={styles.filterAccordionSummary}>
              <ChevronRightIcon style={{ transform: accordionsOpen.semestre ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms', color: '#475569', fontSize: 16 }} />
              <Typography sx={styles.filterAccordionTitle}>
                Semestre
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={styles.filterAccordionDetails}>
              <Typography sx={styles.filterCatLabel}>Período académico</Typography>
              <Box sx={styles.filterChips}>
                {[
                  { label: 'Semestre 1', value: '1' },
                  { label: 'Semestre 2', value: '2' }
                ].map((chip) => {
                  const isSelected = selectedChips.semestre.includes(chip.value);
                  return (
                    <Box
                      key={chip.value}
                      onClick={() => handleToggleChip('semestre', chip.value)}
                      sx={styles.filterChip(isSelected)}
                    >
                      {isSelected && <CheckIcon sx={{ fontSize: '12px' }} />}
                      {chip.label}
                    </Box>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Acordeón: Estado Académico */}
          <Accordion 
            expanded={accordionsOpen.estado} 
            onChange={() => handleToggleAccordion('estado')}
            sx={styles.filterAccordion}
          >
            <AccordionSummary sx={styles.filterAccordionSummary}>
              <ChevronRightIcon style={{ transform: accordionsOpen.estado ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms', color: '#475569', fontSize: 16 }} />
              <Typography sx={styles.filterAccordionTitle}>
                Estado académico
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={styles.filterAccordionDetails}>
              <Typography sx={styles.filterCatLabel}>Situación del alumno</Typography>
              <Box sx={styles.filterChips}>
                {[
                  { label: 'EGRESADO', value: 'egresado' },
                  { label: 'TITULADO', value: 'titulado' },
                  { label: 'VIGENTE', value: 'vigente' }
                ].map((chip) => {
                  const isSelected = selectedChips.estado.includes(chip.value);
                  return (
                    <Box
                      key={chip.value}
                      onClick={() => handleToggleChip('estado', chip.value)}
                      sx={styles.filterChip(isSelected)}
                    >
                      {isSelected && <CheckIcon sx={{ fontSize: '12px' }} />}
                      {chip.label}
                    </Box>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Acordeón: Tipo de Colegio */}
          <Accordion 
            expanded={accordionsOpen.colegio} 
            onChange={() => handleToggleAccordion('colegio')}
            sx={styles.filterAccordion}
          >
            <AccordionSummary sx={styles.filterAccordionSummary}>
              <ChevronRightIcon style={{ transform: accordionsOpen.colegio ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms', color: '#475569', fontSize: 16 }} />
              <Typography sx={styles.filterAccordionTitle}>
                Tipo de colegio
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={styles.filterAccordionDetails}>
              <Typography sx={styles.filterCatLabel}>Establecimiento de origen</Typography>
              <Box sx={styles.filterChips}>
                {[
                  { label: 'MUNICIPAL', value: 'municipal' },
                  { label: 'PARTICULAR SUBVENCIONADO', value: 'subvencionado' },
                  { label: 'PARTICULAR PAGADO', value: 'particular' }
                ].map((chip) => {
                  const isSelected = selectedChips.colegio.includes(chip.value);
                  return (
                    <Box
                      key={chip.value}
                      onClick={() => handleToggleChip('colegio', chip.value)}
                      sx={styles.filterChip(isSelected)}
                    >
                      {isSelected && <CheckIcon sx={{ fontSize: '12px' }} />}
                      {chip.label}
                    </Box>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Acordeón: Vía de Acceso */}
          <Accordion 
            expanded={accordionsOpen.via} 
            onChange={() => handleToggleAccordion('via')}
            sx={styles.filterAccordion}
          >
            <AccordionSummary sx={styles.filterAccordionSummary}>
              <ChevronRightIcon style={{ transform: accordionsOpen.via ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms', color: '#475569', fontSize: 16 }} />
              <Typography sx={styles.filterAccordionTitle}>
                Vía de acceso
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={styles.filterAccordionDetails}>
              <Typography sx={styles.filterCatLabel}>Mecanismo de ingreso</Typography>
              <Box sx={styles.filterChips}>
                {[
                  { label: 'PAES', value: 'paes' },
                  { label: 'RANKING', value: 'ranking' },
                  { label: 'CUPO ESPECIAL', value: 'cupo-especial' },
                  { label: 'CONVALIDACIÓN', value: 'convalidacion' },
                  { label: 'TRASLADO', value: 'traslado' },
                  { label: 'OTRA', value: 'otra' }
                ].map((chip) => {
                  const isSelected = selectedChips.via.includes(chip.value);
                  return (
                    <Box
                      key={chip.value}
                      onClick={() => handleToggleChip('via', chip.value)}
                      sx={styles.filterChip(isSelected)}
                    >
                      {isSelected && <CheckIcon sx={{ fontSize: '12px' }} />}
                      {chip.label}
                    </Box>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Acordeón: Sexo */}
          <Accordion 
            expanded={accordionsOpen.sexo} 
            onChange={() => handleToggleAccordion('sexo')}
            sx={styles.filterAccordion}
          >
            <AccordionSummary sx={styles.filterAccordionSummary}>
              <ChevronRightIcon style={{ transform: accordionsOpen.sexo ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms', color: '#475569', fontSize: 16 }} />
              <Typography sx={styles.filterAccordionTitle}>
                Sexo
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={styles.filterAccordionDetails}>
              <Typography sx={styles.filterCatLabel}>Identificación de género</Typography>
              <Box sx={styles.filterChips}>
                {[
                  { label: 'Femenino', value: 'f' },
                  { label: 'Masculino', value: 'm' },
                  { label: 'Otro', value: 'o' }
                ].map((chip) => {
                  const isSelected = selectedChips.sexo.includes(chip.value);
                  return (
                    <Box
                      key={chip.value}
                      onClick={() => handleToggleChip('sexo', chip.value)}
                      sx={styles.filterChip(isSelected)}
                    >
                      {isSelected && <CheckIcon sx={{ fontSize: '12px' }} />}
                      {chip.label}
                    </Box>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Acordeón: Nivel Socioeconómico (NSE) */}
          <Accordion 
            expanded={accordionsOpen.nse} 
            onChange={() => handleToggleAccordion('nse')}
            sx={styles.filterAccordion}
          >
            <AccordionSummary sx={styles.filterAccordionSummary}>
              <ChevronRightIcon style={{ transform: accordionsOpen.nse ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 200ms', color: '#475569', fontSize: 16 }} />
              <Typography sx={styles.filterAccordionTitle}>
                NSE (Quintiles)
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={styles.filterAccordionDetails}>
              <Typography sx={styles.filterCatLabel}>Quintil de ingreso</Typography>
              <Box sx={styles.filterChips}>
                {[
                  { label: 'QUINTIL 1', value: 'q1' },
                  { label: 'QUINTIL 2', value: 'q2' },
                  { label: 'QUINTIL 3', value: 'q3' },
                  { label: 'QUINTIL 4', value: 'q4' },
                  { label: 'QUINTIL 5', value: 'q5' }
                ].map((chip) => {
                  const isSelected = selectedChips.nse.includes(chip.value);
                  return (
                    <Box
                      key={chip.value}
                      onClick={() => handleToggleChip('nse', chip.value)}
                      sx={styles.filterChip(isSelected)}
                    >
                      {isSelected && <CheckIcon sx={{ fontSize: '12px' }} />}
                      {chip.label}
                    </Box>
                  );
                })}
              </Box>
            </AccordionDetails>
          </Accordion>
        </DashboardFilterSidebar>

        {/* ----------------- DRAWER LATERAL DE DETALLE DE INDICADOR (PIADI-306) ----------------- */}
        <Box 
          sx={styles.drawerOverlay(drawerOpen)} 
          onClick={handleCloseDrawer} 
          aria-hidden={!drawerOpen}
        />
        <Box 
          component="aside"
          role="dialog" 
          aria-modal="true" 
          aria-label="Detalle del indicador"
          sx={styles.indicatorDrawer(drawerOpen)} 
        >
          <Box sx={styles.drawerHeader}>
            <Box sx={styles.drawerTitleRow}>
              <Typography sx={styles.drawerTitle}>
                {currentIndicator.title}
              </Typography>
              <IconButton 
                size="small" 
                onClick={handleCloseDrawer} 
                sx={{ 
                  color: '#64748B',
                  borderRadius: '6px',
                  '&:hover': { bgcolor: '#F1F5F9', color: '#1E293B' }
                }}
                aria-label="Cerrar detalle"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={styles.drawerBody}>
            {drawerLoading ? (
              <Box sx={{ width: '100%', py: 4 }}>
                <LinearProgress sx={{ bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#1E2875' } }} />
              </Box>
            ) : (
              <>
                {/* 1. Qué mide */}
                {currentIndicator.desc && (
                  <Box>
                    <Typography sx={styles.drawerDescLabel}>Qué mide</Typography>
                    <Typography sx={styles.drawerDesc}>
                      {currentIndicator.desc}
                    </Typography>
                  </Box>
                )}

                {/* 2. Métrica destacada */}
                {currentIndicator.metric && (
                  <Box sx={styles.drawerMetricBox}>
                    <Typography sx={styles.drawerMetricLabel}>
                      {currentIndicator.metric.label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                      <Typography sx={styles.drawerMetricValue}>
                        {typeof currentIndicator.metric.value === 'number' 
                          ? currentIndicator.metric.value.toLocaleString('es-CL') 
                          : currentIndicator.metric.value}
                      </Typography>
                      {currentIndicator.trend && currentIndicator.trend.delta !== 0 && (
                        <Box sx={styles.drawerMetaBadge(currentIndicator.trend.delta > 0)}>
                          <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                            {currentIndicator.trend.delta > 0 ? `▲ +${currentIndicator.trend.delta}` : `▼ ${currentIndicator.trend.delta}`} vs {currentIndicator.trend.baseline}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* 3. Desglose de datos en tabla */}
                {displayRows && displayRows.length > 0 && (
                  <Box sx={{ mt: 0.5 }}>
                    <Box sx={styles.drawerTableWrap}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                        <thead>
                          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 1 }}>
                            {(currentIndicator.colLabels || ['Período', 'Valor']).map((col, idx) => (
                              <th 
                                key={idx} 
                                style={{ 
                                  padding: '9px 14px', 
                                  textAlign: idx === (currentIndicator.colLabels || []).length - 1 ? 'right' : 'left', 
                                  color: '#64748B', 
                                  fontSize: '11px',
                                  fontWeight: 600,
                                  letterSpacing: '0.06em',
                                  textTransform: 'uppercase',
                                  borderBottom: '1px solid #E2E8F0'
                                }}
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {displayRows.map((row, idx) => (
                            <tr 
                              key={idx} 
                              style={{ 
                                borderBottom: idx === displayRows.length - 1 ? 'none' : '1px solid #F1F5F9'
                              }}
                            >
                              {row.map((cell, cIdx) => (
                                <td 
                                  key={cIdx} 
                                  style={{ 
                                    padding: '8px 14px', 
                                    textAlign: cIdx === row.length - 1 ? 'right' : 'left', 
                                    color: '#1E293B',
                                    fontWeight: cIdx === row.length - 1 ? 600 : 400
                                  }}
                                >
                                  {typeof cell === 'number' ? cell.toLocaleString('es-CL') : cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Footer exacto a dashboard-admision.html */}
          <Box component="footer" sx={styles.drawerFooter}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CalendarIcon sx={{ fontSize: 14, color: '#64748B' }} />
              <Typography component="label" htmlFor="drawerPeriodSelect" sx={{ fontSize: '12px', color: '#64748B' }}>
                Período
              </Typography>
              <select
                id="drawerPeriodSelect"
                aria-label="Seleccionar período"
                value={drawerPeriod}
                onChange={(e) => handleDrawerPeriodChange(e.target.value)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#1E293B',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="all">Todos los años</option>
                {YEARS.map((yr) => (
                  <option key={yr} value={String(yr)}>{yr}</option>
                ))}
              </select>
            </Box>
            <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
              {drawerPeriodText}
            </Typography>
          </Box>
        </Box>

        {/* ----------------- BOTÓN FLOTANTE DE AYUDA Y MODAL FAQ ----------------- */}
        <IconButton
          sx={styles.floatingHelpButton}
          onClick={() => setOpenHelpDialog(true)}
          aria-label="Centro de ayuda"
        >
          <HelpIcon sx={{ fontSize: 24 }} />
        </IconButton>

        <Dialog
          open={openHelpDialog}
          onClose={() => setOpenHelpDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AdmisionIcon sx={{ color: '#1E2875' }} />
              <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1E2875' }}>
                Centro de Ayuda — Admisión
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpenHelpDialog(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, py: 2 }}>
            {faqData.map((faq, idx) => (
              <Accordion key={idx} sx={{ border: '1px solid #E2E8F0', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#1E2875' }} />}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1E2875' }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Typography sx={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
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
