import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  Button,
  Alert,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  MenuBook as BookIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  FilterAlt as FilterIcon,
  Check as CheckIcon,
  CheckCircleOutline,
  School as GraduationIcon,
  CalendarToday as CalendarIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BarChart } from '@mui/x-charts/BarChart';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { useDashboardDesarrolloCurricular } from './DashboardDesarrolloCurricular.hooks';
import { styles } from './DashboardDesarrolloCurricular.styles';
import { Header, Sidebar, KpiCard, DashboardSection, DashboardFilterSidebar, CentroDeAyuda } from '../../../components';

const dashboardLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E2875',
    },
    secondary: {
      main: '#175696',
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
});

// =========================================================================
// COMPONENTES DE GRÁFICOS (MUI X-CHARTS)
// =========================================================================



// =========================================================================
// COMPONENTE PRINCIPAL: DashboardDesarrolloCurricular
// =========================================================================

export const DashboardDesarrolloCurricular = () => {
  const {
    collapsedSections,
    handleToggleSection,
    filtersCollapsed,
    setFiltersCollapsed,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    yearRange,
    setYearRange,
    periodoAcumulado,
    setPeriodoAcumulado,
    availableYears,
    minYear,
    maxYear,
    selectedChips,
    handleToggleChip,
    accordionsOpen,
    handleToggleAccordion,
    handleResetFilters,
    activeFiltersCount,
    filterOptions,
    apiLoading,
    apiError,
    hasRealData,
    kpiCards,
    drawerOpen,
    drawerLoading,
    currentIndicator,
    currentIndicatorKey,
    drawerPeriod,
    drawerYears,
    handleDrawerPeriodChange,
    drawerPeriodText,
    displayRows,
    handleOpenIndicator,
    handleCloseDrawer,
    aprobacionYear,
    reprobacionYear,
    reprobacionAsignaturas,
    asignaturasCriticas,
    practicasYear,
    titulacionCohorte,
    tituladosYear,
    tiempoTitulacion,
  } = useDashboardDesarrolloCurricular();

  return (
    <ThemeProvider theme={dashboardLightTheme}>
      <Box sx={styles.mainLayout}>
        {/* SIDEBAR TRANSVERSAL INSTITUCIONAL */}
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
        <Box component="main" sx={styles.contentArea}>
          {/* Cabecera del Panel Principal */}
          <Header
            title="Dashboard de Desarrollo Curricular"
            subtitle="Rendimiento académico, prácticas y titulación"
            icon={<BookIcon />}
            iconColor="#175696"
            loading={apiLoading}
            breadcrumbs={[
              { label: 'Inicio', path: '/' },
              { label: 'Dashboards', path: '/dashboard' },
              { label: 'Desarrollo Curricular', path: null },
            ]}
          />

          {/* Fila de 3 Tarjetas KPI Superiores */}
          <Box sx={styles.kpiRow}>
            <KpiCard
              label="TASA DE APROBACIÓN GLOBAL"
              value={kpiCards.aprobacion.value}
              icon={<CheckCircleOutline />}
              accentColor="#175696"
              hasData={kpiCards.aprobacion.hasData}
              loading={apiLoading}
              compareText={kpiCards.aprobacion.compareText}
              evolution={kpiCards.aprobacion.evolution}
              isPositive={kpiCards.aprobacion.isPositive}
              onClick={() => handleOpenIndicator('aprobacion')}
            />

            <KpiCard
              label="ASIGNATURAS CRÍTICAS (REPROBACIÓN ≥ 20 %)"
              value={kpiCards.criticas.value}
              icon={<WarningIcon />}
              accentColor="#EF5350"
              hasData={kpiCards.criticas.hasData}
              loading={apiLoading}
              compareText="Umbral de alerta: ≥ 20 % de reprobación"
              onClick={() => handleOpenIndicator('asignaturas-criticas')}
            />

            <KpiCard
              label="TIEMPO PROM. TITULACIÓN"
              value={kpiCards.tiempo.value ? `${kpiCards.tiempo.value} semestres` : null}
              icon={<GraduationIcon />}
              accentColor="#46D19F"
              hasData={kpiCards.tiempo.hasData}
              loading={apiLoading}
              compareText="Tiempo normativo: 8 semestres"
              onClick={() => handleOpenIndicator('tiempo-titulacion')}
            />
          </Box>

              {/* 1. Tasa de aprobación por año */}
              <DashboardSection
                title="Tasa de aprobación por año"
                icon={<CheckCircleOutline />}
                iconColor="#175696"
                isOpen={!collapsedSections['aprobacion-year']}
                onToggle={() => handleToggleSection('aprobacion-year')}
                hasData={hasRealData}
                noDataHeight={240}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Tasa de aprobación global por año
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('aprobacion')}
                    sx={styles.detailButton}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 260, width: '100%' }}>
                  {aprobacionYear.length > 0 ? (
                    <BarChart
                      grid={{ horizontal: true }}
                      xAxis={[{ scaleType: 'band', data: aprobacionYear.map((d) => d.year) }]}
                      yAxis={[{ min: 0, max: 100, valueFormatter: (v) => `${v} %` }]}
                      series={[
                        {
                          data: aprobacionYear.map((d) => d.value),
                          label: 'Tasa de aprobación',
                          color: '#175696',
                          valueFormatter: (v) => `${v != null ? Number(v).toFixed(1).replace('.', ',') : ''} %`,
                        },
                      ]}
                      height={260}
                      margin={{ top: 20, right: 20, bottom: 35, left: 50 }}
                      slotProps={{ legend: { hidden: true } }}
                    />
                  ) : (
                    <Box sx={styles.emptyChartBox}>Sin datos disponibles</Box>
                  )}
                </Box>
              </DashboardSection>

              {/* 2. Tasa de reprobación por año */}
              <DashboardSection
                title="Tasa de reprobación por año"
                icon={<WarningIcon />}
                iconColor="#EF5350"
                isOpen={!collapsedSections['reprobacion-year']}
                onToggle={() => handleToggleSection('reprobacion-year')}
                hasData={hasRealData}
                noDataHeight={240}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Tasa de reprobación por año
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('reprobacion-asignatura')}
                    sx={styles.detailButton}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 260, width: '100%' }}>
                  {reprobacionYear.length > 0 ? (
                    <BarChart
                      grid={{ horizontal: true }}
                      xAxis={[{ scaleType: 'band', data: reprobacionYear.map((d) => d.year) }]}
                      yAxis={[
                        {
                          min: 0,
                          max: Math.max(...reprobacionYear.map((d) => d.value), 20) * 1.15,
                          valueFormatter: (v) => `${Math.round(v)} %`,
                        },
                      ]}
                      series={[
                        {
                          data: reprobacionYear.map((d) => d.value),
                          label: 'Tasa de reprobación',
                          color: '#0E86B8',
                          valueFormatter: (v) => `${v != null ? Number(v).toFixed(1).replace('.', ',') : ''} %`,
                        },
                      ]}
                      height={260}
                      margin={{ top: 20, right: 20, bottom: 35, left: 50 }}
                      slotProps={{ legend: { hidden: true } }}
                    />
                  ) : (
                    <Box sx={styles.emptyChartBox}>Sin datos disponibles</Box>
                  )}
                </Box>
              </DashboardSection>

              {/* 3. Tasa de reprobación por asignatura */}
              <DashboardSection
                title="Tasa de reprobación por asignatura"
                icon={<BookIcon />}
                iconColor="#175696"
                isOpen={!collapsedSections['asignaturas-hbar']}
                onToggle={() => handleToggleSection('asignaturas-hbar')}
                hasData={hasRealData}
                noDataHeight={240}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Reprobación por asignatura (mayor a menor)
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('reprobacion-asignatura')}
                    sx={styles.detailButton}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 280, width: '100%' }}>
                  {reprobacionAsignaturas.length > 0 ? (
                    <BarChart
                      layout="horizontal"
                      grid={{ vertical: true }}
                      xAxis={[
                        {
                          min: 0,
                          max: Math.max(...reprobacionAsignaturas.map((d) => d.value), 10) * 1.15,
                          valueFormatter: (v) => `${Math.round(v)} %`,
                        },
                      ]}
                      yAxis={[
                        {
                          scaleType: 'band',
                          data: reprobacionAsignaturas.map((d) => d.label),
                          width: 145,
                          tickLabelStyle: { fontSize: 11, fontWeight: 500 },
                        },
                      ]}
                      series={[
                        {
                          data: reprobacionAsignaturas.map((d) => d.value),
                          label: 'Reprobación',
                          color: '#175696',
                          valueFormatter: (v) => `${v != null ? Number(v).toFixed(1).replace('.', ',') : ''} %`,
                        },
                      ]}
                      height={Math.max(280, reprobacionAsignaturas.length * 36)}
                      margin={{ top: 20, right: 30, bottom: 30, left: 155 }}
                      slotProps={{ legend: { hidden: true } }}
                    />
                  ) : (
                    <Box sx={styles.emptyChartBox}>Sin datos disponibles</Box>
                  )}
                </Box>
              </DashboardSection>

              {/* 4. Asignaturas críticas */}
              <DashboardSection
                title="Asignaturas críticas"
                icon={<WarningIcon />}
                iconColor="#EF5350"
                isOpen={!collapsedSections['asignaturas-criticas-hbar']}
                onToggle={() => handleToggleSection('asignaturas-criticas-hbar')}
                hasData={hasRealData}
                noDataHeight={240}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Asignaturas con reprobación ≥ 20 % (umbral de alerta)
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('asignaturas-criticas')}
                    sx={styles.detailButton}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={styles.legendRow}>
                  <Box sx={styles.legendBadge('#DC2626', '#FEF2F2', '#FECACA')}>
                    <Box sx={styles.legendDashedLine('#DC2626')} />
                    <span>
                      Umbral de alerta institucional: <strong style={{ color: '#DC2626', fontWeight: 700, fontSize: '13.5px' }}>≥ 20 % de reprobación</strong>
                    </span>
                  </Box>
                </Box>
                <Box sx={{ minHeight: 180, width: '100%' }}>
                  {asignaturasCriticas.length > 0 ? (
                    <BarChart
                      layout="horizontal"
                      grid={{ vertical: true }}
                      xAxis={[
                        {
                          min: 0,
                          max: Math.max(...asignaturasCriticas.map((d) => d.value), 25) * 1.18,
                          valueFormatter: (v) => `${Math.round(v)} %`,
                        },
                      ]}
                      yAxis={[
                        {
                          scaleType: 'band',
                          data: asignaturasCriticas.map((d) => d.label),
                          width: 155,
                          tickLabelStyle: { fontSize: 11.5, fontWeight: 500 },
                        },
                      ]}
                      series={[
                        {
                          data: asignaturasCriticas.map((d) => d.value),
                          label: 'Reprobación',
                          color: '#0E86B8',
                          valueFormatter: (v) => `${v != null ? Number(v).toFixed(1).replace('.', ',') : ''} %`,
                        },
                      ]}
                      height={Math.max(180, asignaturasCriticas.length * 52)}
                      margin={{ top: 25, right: 35, bottom: 35, left: 165 }}
                    >
                      <ChartsReferenceLine
                        x={20}
                        lineStyle={{ stroke: '#DC2626', strokeDasharray: '5 5', strokeWidth: 2.5 }}
                      />
                    </BarChart>
                  ) : (
                    <Box sx={styles.emptyChartBox}>Sin datos disponibles</Box>
                  )}
                </Box>
              </DashboardSection>

              {/* 5. Prácticas: inscritas vs. aprobadas */}
              <DashboardSection
                title="Prácticas: inscritas vs. aprobadas"
                icon={<BookIcon />}
                iconColor="#175696"
                isOpen={!collapsedSections['practicas-year']}
                onToggle={() => handleToggleSection('practicas-year')}
                hasData={hasRealData}
                noDataHeight={240}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Inscritas vs. aprobadas por año
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('practicas')}
                    sx={styles.detailButton}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={styles.legendRow}>
                  <Box sx={styles.legendItem}>
                    <Box sx={styles.legendDot('#0E86B8')} />
                    Inscritas
                  </Box>
                  <Box sx={styles.legendItem}>
                    <Box sx={styles.legendDot('#3EC9FF')} />
                    Aprobadas
                  </Box>
                </Box>
                <Box sx={{ minHeight: 270, width: '100%' }}>
                  {practicasYear?.labels?.length > 0 ? (
                    <BarChart
                      grid={{ horizontal: true }}
                      xAxis={[{ scaleType: 'band', data: practicasYear.labels }]}
                      series={[
                        {
                          data: practicasYear.series[0]?.values || [],
                          label: 'Inscritas',
                          color: '#0E86B8',
                        },
                        {
                          data: practicasYear.series[1]?.values || [],
                          label: 'Aprobadas',
                          color: '#3EC9FF',
                        },
                      ]}
                      height={270}
                      margin={{ top: 25, right: 20, bottom: 35, left: 45 }}
                      slotProps={{ legend: { hidden: true } }}
                    />
                  ) : (
                    <Box sx={styles.emptyChartBox}>Sin datos disponibles</Box>
                  )}
                </Box>

                {/* Mini tabla desglosada por tipo de práctica */}
                <Box sx={styles.miniTableWrap}>
                  <table style={styles.miniTable}>
                    <thead>
                      <tr>
                        <th>Tipo de práctica</th>
                        <th>Inscritas</th>
                        <th>Aprobadas</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Práctica I</td>
                        <td>6</td>
                        <td>24</td>
                      </tr>
                      <tr>
                        <td>Práctica II</td>
                        <td>5</td>
                        <td>20</td>
                      </tr>
                      <tr>
                        <td>Práctica Profesional</td>
                        <td>6</td>
                        <td>16</td>
                      </tr>
                    </tbody>
                  </table>
                </Box>
              </DashboardSection>

              {/* 6. Tasa de titulación por cohorte */}
              <DashboardSection
                title="Tasa de titulación por cohorte"
                icon={<GraduationIcon />}
                iconColor="#175696"
                isOpen={!collapsedSections['titulacion-cohorte']}
                onToggle={() => handleToggleSection('titulacion-cohorte')}
                hasData={hasRealData}
                noDataHeight={240}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Titulados por cohorte · en tiempo normativo vs. con desfase
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('titulacion-cohorte')}
                    sx={styles.detailButton}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={styles.legendRow}>
                  <Box sx={styles.legendItem}>
                    <Box sx={styles.legendDot('#0E86B8')} />
                    En tiempo normativo
                  </Box>
                  <Box sx={styles.legendItem}>
                    <Box sx={styles.legendDot('#3EC9FF')} />
                    Con desfase
                  </Box>
                </Box>
                <Box sx={{ minHeight: 270, width: '100%' }}>
                  {titulacionCohorte?.labels?.length > 0 ? (
                    <BarChart
                      grid={{ horizontal: true }}
                      xAxis={[{ scaleType: 'band', data: titulacionCohorte.labels }]}
                      series={[
                        {
                          data: titulacionCohorte.series[0]?.values || [],
                          label: 'En tiempo normativo',
                          color: '#0E86B8',
                        },
                        {
                          data: titulacionCohorte.series[1]?.values || [],
                          label: 'Con desfase',
                          color: '#3EC9FF',
                        },
                      ]}
                      height={270}
                      margin={{ top: 25, right: 20, bottom: 35, left: 45 }}
                      slotProps={{ legend: { hidden: true } }}
                    />
                  ) : (
                    <Box sx={styles.emptyChartBox}>Sin datos disponibles</Box>
                  )}
                </Box>
                <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 1.5 }}>
                  11 titulados en tiempo normativo (50 %) · 11 con desfase (50 %)
                </Typography>
              </DashboardSection>

              {/* 7. Titulados por año */}
              <DashboardSection
                title="Titulados por año"
                icon={<GraduationIcon />}
                iconColor="#175696"
                isOpen={!collapsedSections['titulados-year']}
                onToggle={() => handleToggleSection('titulados-year')}
                hasData={hasRealData}
                noDataHeight={240}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Titulados por año calendario
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('titulados-anio')}
                    sx={styles.detailButton}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={{ minHeight: 260, width: '100%' }}>
                  {tituladosYear.length > 0 ? (
                    <BarChart
                      grid={{ horizontal: true }}
                      xAxis={[{ scaleType: 'band', data: tituladosYear.map((d) => d.year) }]}
                      yAxis={[{ min: 0 }]}
                      series={[
                        {
                          data: tituladosYear.map((d) => d.value),
                          label: 'Titulados',
                          color: '#175696',
                        },
                      ]}
                      height={260}
                      margin={{ top: 20, right: 20, bottom: 35, left: 45 }}
                      slotProps={{ legend: { hidden: true } }}
                    />
                  ) : (
                    <Box sx={styles.emptyChartBox}>Sin datos disponibles</Box>
                  )}
                </Box>
              </DashboardSection>

              {/* 8. Tiempo promedio de titulación */}
              <DashboardSection
                title="Tiempo promedio de titulación"
                icon={<BookIcon />}
                iconColor="#175696"
                isOpen={!collapsedSections['tiempo-titulacion']}
                onToggle={() => handleToggleSection('tiempo-titulacion')}
                hasData={hasRealData}
                noDataHeight={240}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    8,68 semestres promedio vs. tiempo normativo (8) · desfase +0,68
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => handleOpenIndicator('tiempo-titulacion')}
                    sx={styles.detailButton}
                  >
                    Ver detalles
                  </Button>
                </Box>
                <Box sx={styles.legendRow}>
                  <Box sx={styles.legendBadge('#059669', '#F0FDF4', '#BBF7D0')}>
                    <Box sx={styles.legendDashedLine('#059669')} />
                    <span>
                      Tiempo normativo de titulación: <strong style={{ color: '#059669', fontWeight: 700, fontSize: '13.5px' }}>8 semestres</strong>
                    </span>
                  </Box>
                </Box>
                <Box sx={{ minHeight: 150, width: '100%' }}>
                  {tiempoTitulacion != null ? (
                    <BarChart
                      layout="horizontal"
                      grid={{ vertical: true }}
                      xAxis={[
                        {
                          min: 0,
                          max: Math.max(Number(tiempoTitulacion) || 0, 10) * 1.18,
                          valueFormatter: (v) => `${v} sem.`,
                        },
                      ]}
                      yAxis={[
                        {
                          scaleType: 'band',
                          data: ['Promedio institucional'],
                          width: 155,
                          tickLabelStyle: { fontSize: 11.5, fontWeight: 500 },
                        },
                      ]}
                      series={[
                        {
                          data: [Number(tiempoTitulacion) || 0],
                          label: 'Semestres',
                          color: '#46D19F',
                          valueFormatter: (v) => `${v != null ? Number(v).toFixed(2).replace('.', ',') : ''} semestres`,
                        },
                      ]}
                      height={150}
                      margin={{ top: 25, right: 35, bottom: 35, left: 165 }}
                    >
                      <ChartsReferenceLine
                        x={8}
                        lineStyle={{ stroke: '#059669', strokeDasharray: '5 5', strokeWidth: 2.5 }}
                      />
                    </BarChart>
                  ) : (
                    <Box sx={styles.emptyChartBox}>Sin datos disponibles</Box>
                  )}
                </Box>
              </DashboardSection>
        </Box>

        {/* PANEL LATERAL DE FILTROS MODULAR */}
        <DashboardFilterSidebar
              title="Filtros"
              icon={<FilterIcon sx={{ color: '#175696', fontSize: 18 }} />}
              iconColor="#175696"
              collapsed={filtersCollapsed}
              onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
              mobileOpen={mobileFiltersOpen}
              onCloseMobile={() => setMobileFiltersOpen(false)}
              onReset={handleResetFilters}
              resetLabel="Restablecer filtros"
              hasData={hasRealData}
              noDataMessage="No hay datos disponibles para los filtros seleccionados."
            >
              {/* Contador de Filtros Activos */}
              <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography
                  sx={{
                    fontSize: '11.5px',
                    fontWeight: activeFiltersCount > 0 ? 600 : 500,
                    color: activeFiltersCount > 0 ? '#175696' : '#94A3B8',
                  }}
                >
                  {activeFiltersCount === 0
                    ? '0 filtros activos'
                    : `${activeFiltersCount} filtro${activeFiltersCount > 1 ? 's' : ''} activo${activeFiltersCount > 1 ? 's' : ''}`}
                </Typography>
              </Box>

              {/* Filtro: Rango de Años (Slider 2023 - 2026) */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#94A3B8',
                    mb: 1,
                  }}
                >
                  Año
                </Typography>
                <Box sx={{ px: 1 }}>
                  <Slider
                    value={yearRange}
                    onChange={(_, val) => setYearRange(val)}
                    min={minYear}
                    max={maxYear}
                    step={1}
                    marks={availableYears.map((y) => ({ value: y, label: String(y) }))}
                    valueLabelDisplay="auto"
                    sx={styles.yearSliderStyle}
                  />
                </Box>
                <Typography sx={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#1E2875', mt: 0.5 }}>
                  {yearRange[0] === yearRange[1] ? yearRange[0] : `${yearRange[0]} — ${yearRange[1]}`}
                </Typography>
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
                        <Typography sx={{ fontSize: '12px', color: '#1E2875', fontWeight: 500 }}>
                          Período acumulado
                        </Typography>
                      }
                    />
                  </Box>
                )}
              </Box>

              {hasRealData && (
                <>
                  {/* Acordeón: Cohorte */}
                  <Accordion
                    expanded={accordionsOpen.cohorte}
                    onChange={() => handleToggleAccordion('cohorte')}
                    sx={styles.filterAccordion}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />} sx={styles.filterAccordionSummary}>
                      <Typography sx={styles.filterAccordionTitle}>Cohorte</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <Box sx={styles.filterChipsWrap}>
                        {filterOptions.cohorte.map((val) => {
                          const isSelected = selectedChips.cohorte.includes(val);
                          return (
                            <Box
                              key={val}
                              onClick={() => handleToggleChip('cohorte', val)}
                              sx={styles.filterChip(isSelected)}
                            >
                              {isSelected && <CheckIcon sx={{ fontSize: 12 }} />}
                              {val}
                            </Box>
                          );
                        })}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* Acordeón: Estado */}
                  <Accordion
                    expanded={accordionsOpen.estado}
                    onChange={() => handleToggleAccordion('estado')}
                    sx={styles.filterAccordion}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />} sx={styles.filterAccordionSummary}>
                      <Typography sx={styles.filterAccordionTitle}>Estado</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <Box sx={styles.filterChipsWrap}>
                        {filterOptions.estado.map((val) => {
                          const isSelected = selectedChips.estado.includes(val);
                          return (
                            <Box
                              key={val}
                              onClick={() => handleToggleChip('estado', val)}
                              sx={styles.filterChip(isSelected)}
                            >
                              {isSelected && <CheckIcon sx={{ fontSize: 12 }} />}
                              {val}
                            </Box>
                          );
                        })}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* Acordeón: Período */}
                  <Accordion
                    expanded={accordionsOpen.periodo}
                    onChange={() => handleToggleAccordion('periodo')}
                    sx={styles.filterAccordion}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />} sx={styles.filterAccordionSummary}>
                      <Typography sx={styles.filterAccordionTitle}>Período</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <Box sx={styles.filterChipsWrap}>
                        {filterOptions.periodo.map((val) => {
                          const isSelected = selectedChips.periodo.includes(val);
                          return (
                            <Box
                              key={val}
                              onClick={() => handleToggleChip('periodo', val)}
                              sx={styles.filterChip(isSelected)}
                            >
                              {isSelected && <CheckIcon sx={{ fontSize: 12 }} />}
                              {val}
                            </Box>
                          );
                        })}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* Acordeón: Asignatura */}
                  <Accordion
                    expanded={accordionsOpen.asignatura}
                    onChange={() => handleToggleAccordion('asignatura')}
                    sx={styles.filterAccordion}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />} sx={styles.filterAccordionSummary}>
                      <Typography sx={styles.filterAccordionTitle}>Asignatura</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <Box sx={styles.filterChipsWrap}>
                        {filterOptions.asignatura.map((val) => {
                          const isSelected = selectedChips.asignatura.includes(val);
                          return (
                            <Box
                              key={val}
                              onClick={() => handleToggleChip('asignatura', val)}
                              sx={styles.filterChip(isSelected)}
                            >
                              {isSelected && <CheckIcon sx={{ fontSize: 12 }} />}
                              {val}
                            </Box>
                          );
                        })}
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  {/* Acordeón: Tipo de práctica */}
                  <Accordion
                    expanded={accordionsOpen.tipoPractica}
                    onChange={() => handleToggleAccordion('tipoPractica')}
                    sx={styles.filterAccordion}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />} sx={styles.filterAccordionSummary}>
                      <Typography sx={styles.filterAccordionTitle}>Tipo de práctica</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <Box sx={styles.filterChipsWrap}>
                        {filterOptions.tipoPractica.map((val) => {
                          const isSelected = selectedChips.tipoPractica.includes(val);
                          return (
                            <Box
                              key={val}
                              onClick={() => handleToggleChip('tipoPractica', val)}
                              sx={styles.filterChip(isSelected)}
                            >
                              {isSelected && <CheckIcon sx={{ fontSize: 12 }} />}
                              {val}
                            </Box>
                          );
                        })}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </>
              )}
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
          {/* Header del Drawer */}
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

          {/* Cuerpo del Drawer */}
          <Box sx={styles.drawerBody}>
            {drawerLoading ? (
              <Box sx={{ width: '100%', py: 4 }}>
                <LinearProgress sx={{ bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#175696' } }} />
              </Box>
            ) : currentIndicator.isError ? (
              <Box sx={{ mt: 2 }}>
                <Alert severity="error" sx={{ borderRadius: '8px', fontSize: '13px', fontWeight: 500 }}>
                  {currentIndicator.errorMessage || 'Error al cargar los datos del indicador desde el servidor.'}
                </Alert>
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
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
                      <Typography sx={styles.drawerMetricValue}>
                        {currentIndicator.metric.value !== null 
                          ? (typeof currentIndicator.metric.value === 'number' 
                              ? currentIndicator.metric.value.toLocaleString('es-CL') 
                              : currentIndicator.metric.value)
                          : 'Sin datos'}
                      </Typography>
                      {currentIndicator.trend && (
                        <Box
                          sx={styles.drawerMetaBadge(
                            currentIndicator.trend.badWhenUp
                              ? currentIndicator.trend.delta <= 0
                              : currentIndicator.trend.delta >= 0
                          )}
                        >
                          <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                            {currentIndicator.trend.delta > 0 ? '▲ +' : '▼ '}
                            {Math.abs(currentIndicator.trend.delta)} vs {currentIndicator.trend.baseline}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}

                {/* 3. Desglose de datos en tabla */}
                {displayRows && displayRows.length > 0 ? (
                  <Box sx={{ mt: 0.5 }}>
                    <Box sx={styles.drawerTableWrap}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'Inter', sans-serif" }}>
                        <thead>
                          <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', position: 'sticky', top: 0, zIndex: 1 }}>
                            {(currentIndicator.colLabels || ['Categoría', 'Valor']).map((col, idx) => (
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
                                    color: '#1E2875', 
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
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 160, color: '#64748b', fontSize: '13px', fontWeight: 500, border: '1px dashed #E2E8F0', borderRadius: '12px', bgcolor: '#F8FAFC', width: '100%', mt: 2 }}>
                    Sin datos disponibles
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Footer exacto a dashboard-admision */}
          <Box component="footer" sx={styles.drawerFooter}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CalendarIcon sx={{ fontSize: 14, color: '#64748B' }} />
              <Typography component="label" htmlFor="drawerPeriodSelect" sx={{ fontSize: '12px', color: '#64748B' }}>
                Año
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
                  color: '#1E2875',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {drawerYears.map((yr) => (
                  <option key={yr} value={String(yr)}>{yr}</option>
                ))}
              </select>
            </Box>
            <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
              {drawerPeriodText}
            </Typography>
          </Box>
        </Box>

        {/* Centro de Ayuda contextual unificado */}
        <CentroDeAyuda modulo="desarrollo_curricular" />
      </Box>
    </ThemeProvider>
  );
};
