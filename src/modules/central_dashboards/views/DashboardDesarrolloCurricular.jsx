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
  Drawer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDashboardDesarrolloCurricular } from './DashboardDesarrolloCurricular.hooks';
import { styles } from './DashboardDesarrolloCurricular.styles';
import { Header, Sidebar, KpiCard, DashboardSection, DashboardFilterSidebar } from '../../../components';

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
// COMPONENTES DE GRÁFICOS SVG INTERACTIVOS
// =========================================================================

const SvgYearBarChart = ({ data, onBarClick, color = '#0E86B8', accentColor = '#3EC9FF', isPercent = true }) => {
  const [hovered, setHovered] = useState(null);
  const maxVal = Math.max(...data.map((d) => d.value), 10);
  const chartHeight = 180;
  const chartWidth = 540;
  const paddingLeft = 40;
  const paddingBottom = 30;
  const innerWidth = chartWidth - paddingLeft - 20;
  const innerHeight = chartHeight - 20;

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight + paddingBottom}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      >
        {/* Líneas de cuadrícula horizontal */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const yPos = 20 + innerHeight * (1 - pct);
          const valLabel = Math.round(maxVal * pct);
          return (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={yPos}
                x2={chartWidth - 20}
                y2={yPos}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray={pct === 0 ? 'none' : '3 3'}
              />
              <text
                x={paddingLeft - 8}
                y={yPos + 4}
                textAnchor="end"
                fontSize="11"
                fill="#94A3B8"
                fontFamily="Inter"
              >
                {valLabel}
              </text>
            </g>
          );
        })}

        {/* Barras verticales */}
        {data.map((item, idx) => {
          const barWidth = Math.min(innerWidth / data.length - 24, 52);
          const xPos = paddingLeft + (innerWidth / data.length) * idx + (innerWidth / data.length - barWidth) / 2;
          const barHeight = Math.max(0, (item.value / maxVal) * innerHeight);
          const yPos = 20 + innerHeight - barHeight;
          const isLatest = idx === data.length - 1;
          const isHov = hovered === idx;

          return (
            <g
              key={item.year}
              style={{ cursor: 'pointer' }}
              onClick={() => onBarClick && onBarClick(item)}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
            >
              <rect
                x={xPos}
                y={yPos}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill={isHov ? '#124477' : isLatest ? color : accentColor}
                opacity={isHov ? 1 : 0.9}
                transition="all 150ms ease"
              />
              {/* Valor encima de la barra */}
              <text
                x={xPos + barWidth / 2}
                y={yPos - 6}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="#1E293B"
                fontFamily="Inter"
              >
                {item.value}{isPercent ? '%' : ''}
              </text>
              {/* Etiqueta del año en eje X */}
              <text
                x={xPos + barWidth / 2}
                y={chartHeight + 18}
                textAnchor="middle"
                fontSize="12"
                fontWeight={isHov ? '700' : '500'}
                fill={isHov ? '#1E2875' : '#64748B'}
                fontFamily="Inter"
              >
                {item.year}
              </text>
            </g>
          );
        })}
      </svg>
    </Box>
  );
};

const SvgHorizontalBarChart = ({
  data,
  onBarClick,
  threshold = null,
  thresholdLabel = '',
  height = null,
  isPercent = true,
}) => {
  const [hovered, setHovered] = useState(null);
  const chartHeight = height || (data.length > 2 ? 320 : data.length === 2 ? 160 : 140);
  const chartWidth = 580;
  const m = { top: 22, right: 40, bottom: 12, left: 145 };
  const iw = chartWidth - m.left - m.right;
  const ih = chartHeight - m.top - m.bottom;

  const maxVal = Math.max(...data.map((d) => d.value), threshold || 0) || 1;
  const domainMax = maxVal * 1.12;

  const getX = (val) => Math.max(0, (val / domainMax) * iw);

  // Bandwidth y espaciado vertical
  const numItems = data.length;
  const step = ih / (numItems + (numItems === 1 ? 0.32 : 0.2));
  const bandwidth = Math.min(step * 0.68, numItems === 1 ? 40 : 18);
  const startY = (ih - numItems * step) / 2;

  // 5 marcas para la cuadrícula superior
  const ticks = [0, 0.25, 0.5, 0.75, 1.0].map((pct) => {
    const val = domainMax * pct;
    return {
      val,
      label: val < 10 ? val.toFixed(1).replace('.', ',') : Math.round(val).toString(),
      x: pct * iw,
    };
  });

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      >
        <g transform={`translate(${m.left}, ${m.top})`}>
          {/* Líneas de cuadrícula vertical */}
          {ticks.map((t, idx) => (
            <g key={idx}>
              <line
                x1={t.x}
                y1={0}
                x2={t.x}
                y2={ih}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray={idx === 0 ? 'none' : '3 3'}
              />
              <text
                x={t.x}
                y={-8}
                textAnchor="middle"
                fontSize="10"
                fill="#94A3B8"
                fontFamily="Inter"
              >
                {t.label}
              </text>
            </g>
          ))}

          {/* Eje vertical izquierdo */}
          <line x1={0} y1={0} x2={0} y2={ih} stroke="#CBD5E1" strokeWidth="1" />

          {/* Barras horizontales en celeste (#3EC9FF) */}
          {data.map((item, idx) => {
            const barY = startY + idx * step + (step - bandwidth) / 2;
            const barWidth = getX(item.value);
            const isHov = hovered === idx;
            const formattedVal = item.value.toLocaleString('es-CL', {
              minimumFractionDigits: Number.isInteger(item.value) ? 0 : 1,
              maximumFractionDigits: 2,
            });

            return (
              <g
                key={item.label}
                style={{ cursor: 'pointer' }}
                onClick={() => onBarClick && onBarClick(item)}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Etiqueta de la categoría a la izquierda */}
                <text
                  x={-10}
                  y={barY + bandwidth / 2}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontSize="12"
                  fontWeight={isHov ? '600' : '500'}
                  fill={isHov ? '#1E2875' : '#334155'}
                  fontFamily="Inter"
                >
                  {item.label}
                </text>

                {/* Barra horizontal en celeste (#3EC9FF) */}
                <rect
                  x={0}
                  y={barY}
                  width={barWidth}
                  height={bandwidth}
                  rx="3"
                  fill={isHov ? '#0E86B8' : '#3EC9FF'}
                  transition="all 150ms ease"
                />

                {/* Valor numérico a la derecha de la barra */}
                <text
                  x={barWidth + 7}
                  y={barY + bandwidth / 2}
                  dominantBaseline="central"
                  fontSize="11"
                  fontWeight="600"
                  fill="#1E293B"
                  fontFamily="Inter"
                >
                  {formattedVal}{isPercent ? ' %' : ''}
                </text>
              </g>
            );
          })}

          {/* Línea roja discontinua del umbral con etiqueta superior */}
          {threshold !== null && (
            <g>
              <line
                x1={getX(threshold)}
                y1={0}
                x2={getX(threshold)}
                y2={ih}
                stroke="#EF5350"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={getX(threshold) + 4}
                y={-8}
                fontSize="10.5"
                fontWeight="700"
                fill="#EF5350"
                fontFamily="Inter"
              >
                {thresholdLabel || `Umbral ${threshold}`}
              </text>
            </g>
          )}
        </g>
      </svg>
    </Box>
  );
};

const SvgGroupedBarsChart = ({ labels, series, onBarClick }) => {
  const [hovered, setHovered] = useState(null);
  const allValues = series.flatMap((s) => s.values);
  const maxVal = Math.max(...allValues, 10);
  const chartHeight = 190;
  const chartWidth = 540;
  const paddingLeft = 40;
  const paddingBottom = 30;
  const innerWidth = chartWidth - paddingLeft - 20;
  const innerHeight = chartHeight - 20;
  const groupWidth = innerWidth / labels.length;
  const barWidth = 26;

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight + paddingBottom}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      >
        {/* Cuadrícula */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
          const yPos = 20 + innerHeight * (1 - pct);
          const valLabel = Math.round(maxVal * pct);
          return (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={yPos}
                x2={chartWidth - 20}
                y2={yPos}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray={pct === 0 ? 'none' : '3 3'}
              />
              <text
                x={paddingLeft - 8}
                y={yPos + 4}
                textAnchor="end"
                fontSize="11"
                fill="#94A3B8"
                fontFamily="Inter"
              >
                {valLabel}
              </text>
            </g>
          );
        })}

        {/* Grupos de barras */}
        {labels.map((lbl, gIdx) => {
          const gX = paddingLeft + gIdx * groupWidth + (groupWidth - (barWidth * 2 + 6)) / 2;

          return (
            <g key={lbl}>
              {series.map((s, sIdx) => {
                const val = s.values[gIdx] || 0;
                const barHeight = Math.max(0, (val / maxVal) * innerHeight);
                const bX = gX + sIdx * (barWidth + 6);
                const bY = 20 + innerHeight - barHeight;
                const hovKey = `${gIdx}-${sIdx}`;
                const isHov = hovered === hovKey;
                const color = sIdx === 0 ? '#0E86B8' : '#3EC9FF';

                return (
                  <g
                    key={s.label}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onBarClick && onBarClick({ label: lbl, series: s.label, value: val })}
                    onMouseEnter={() => setHovered(hovKey)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <rect
                      x={bX}
                      y={bY}
                      width={barWidth}
                      height={barHeight}
                      rx="3"
                      fill={isHov ? '#124477' : color}
                      transition="all 150ms ease"
                    />
                    <text
                      x={bX + barWidth / 2}
                      y={bY - 6}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="600"
                      fill="#1E293B"
                      fontFamily="Inter"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}
              {/* Etiqueta del grupo en eje X */}
              <text
                x={gX + barWidth + 3}
                y={chartHeight + 18}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="#475569"
                fontFamily="Inter"
              >
                {lbl}
              </text>
            </g>
          );
        })}
      </svg>
    </Box>
  );
};

// =========================================================================
// COMPONENTE PRINCIPAL: DashboardDesarrolloCurricular
// =========================================================================

export const DashboardDesarrolloCurricular = () => {
  const {
    openHelpDialog,
    setOpenHelpDialog,
    collapsedSections,
    handleToggleSection,
    filtersCollapsed,
    setFiltersCollapsed,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    yearRange,
    setYearRange,
    selectedChips,
    handleToggleChip,
    accordionsOpen,
    handleToggleAccordion,
    handleResetFilters,
    activeFiltersCount,
    drawerOpen,
    drawerLoading,
    currentIndicator,
    currentIndicatorKey,
    drawerPeriod,
    handleOpenIndicator,
    handleCloseDrawer,
    stepDrawerPeriod,
    aprobacionYear,
    reprobacionYear,
    reprobacionAsignaturas,
    asignaturasCriticas,
    practicasYear,
    titulacionCohorte,
    tituladosYear,
    tiempoTitulacion,
    faqData,
  } = useDashboardDesarrolloCurricular();

  // Opciones de chips para los filtros
  const FILTER_OPTIONS = {
    cohorte: ['2021', '2022'],
    estado: ['Aprobado', 'Reprobado'],
    periodo: ['1', '2'],
    asignatura: [
      'Gestión de Personas',
      'Auditoría',
      'Economía',
      'Finanzas',
      'Taller de Titulación',
      'Derecho Tributario',
      'Contabilidad I',
      'Contabilidad II',
      'Estadística',
      'Costos',
    ],
    tipoPractica: ['Práctica I', 'Práctica II', 'Práctica Profesional'],
  };

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
            subtitle="Rendimiento académico, prácticas y titulación — datos simulados"
            icon={<BookIcon />}
            iconColor="#175696"
            breadcrumbs={[
              { label: 'Inicio', path: '/' },
              { label: 'Dashboards', path: '/dashboard' },
              { label: 'Desarrollo Curricular', path: null },
            ]}
          />

          {/* Disposición Horizontal: Columna Central (KPIs + Gráficos) + Sidebar de Filtros Lateral */}
          <Box sx={styles.dashboardContentLayout}>
            {/* COLUMNA CENTRAL (KPIs + GRÁFICOS) */}
            <Box sx={styles.chartsColumn}>
              {/* Fila de 3 Tarjetas KPI Superiores */}
              <Box sx={styles.kpiRow}>
                <KpiCard
                  label="TASA DE APROBACIÓN GLOBAL"
                  value="83,8 %"
                  icon={<CheckCircleOutline />}
                  accentColor="#175696"
                  compareText="vs año base (2023): 84,2 %"
                  evolution="−0,4 pp"
                  isPositive={false}
                  onClick={() => handleOpenIndicator('aprobacion')}
                />

                <KpiCard
                  label="ASIGNATURAS CRÍTICAS (REPROBACIÓN ≥ 20 %)"
                  value="1"
                  icon={<WarningIcon />}
                  accentColor="#EF5350"
                  compareText="Umbral de alerta: ≥ 20 % de reprobación"
                  evolution="1 sobre el umbral"
                  isPositive={false}
                  onClick={() => handleOpenIndicator('asignaturas-criticas')}
                />

                <KpiCard
                  label="TITULADOS EN TIEMPO NORMATIVO"
                  value="50,0 %"
                  icon={<GraduationIcon />}
                  accentColor="#46D19F"
                  compareText="11 de 22 titulados en tiempo normativo"
                  onClick={() => handleOpenIndicator('titulacion-tiempo')}
                />
              </Box>

              {/* 1. Tasa de aprobación por año */}
              <DashboardSection
                title="Tasa de aprobación por año"
                icon={<CheckCircleOutline />}
                iconColor="#175696"
                isOpen={!collapsedSections['aprobacion-year']}
                onToggle={() => handleToggleSection('aprobacion-year')}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Tasa de aprobación global por año
                  </Typography>
                  <button
                    type="button"
                    style={styles.detailButton}
                    onClick={() => handleOpenIndicator('aprobacion')}
                  >
                    Ver detalle &nbsp;➔
                  </button>
                </Box>
                <SvgYearBarChart
                  data={aprobacionYear}
                  color="#175696"
                  accentColor="#3EC9FF"
                  onBarClick={() => handleOpenIndicator('aprobacion')}
                />
              </DashboardSection>

              {/* 2. Tasa de reprobación por año */}
              <DashboardSection
                title="Tasa de reprobación por año"
                icon={<WarningIcon />}
                iconColor="#EF5350"
                isOpen={!collapsedSections['reprobacion-year']}
                onToggle={() => handleToggleSection('reprobacion-year')}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Tasa de reprobación por año
                  </Typography>
                  <button
                    type="button"
                    style={styles.detailButton}
                    onClick={() => handleOpenIndicator('reprobacion-asignatura')}
                  >
                    Ver detalle &nbsp;➔
                  </button>
                </Box>
                <SvgYearBarChart
                  data={reprobacionYear}
                  color="#0E86B8"
                  accentColor="#3EC9FF"
                  onBarClick={() => handleOpenIndicator('reprobacion-asignatura')}
                />
              </DashboardSection>

              {/* 3. Tasa de reprobación por asignatura */}
              <DashboardSection
                title="Tasa de reprobación por asignatura"
                icon={<BookIcon />}
                iconColor="#175696"
                isOpen={!collapsedSections['asignaturas-hbar']}
                onToggle={() => handleToggleSection('asignaturas-hbar')}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Reprobación por asignatura (mayor a menor)
                  </Typography>
                  <button
                    type="button"
                    style={styles.detailButton}
                    onClick={() => handleOpenIndicator('reprobacion-asignatura')}
                  >
                    Ver detalle &nbsp;➔
                  </button>
                </Box>
                <SvgHorizontalBarChart
                  data={reprobacionAsignaturas}
                  height={320}
                  isPercent={true}
                  onBarClick={() => handleOpenIndicator('reprobacion-asignatura')}
                />
              </DashboardSection>

              {/* 4. Asignaturas críticas */}
              <DashboardSection
                title="Asignaturas críticas"
                icon={<WarningIcon />}
                iconColor="#EF5350"
                isOpen={!collapsedSections['asignaturas-criticas-hbar']}
                onToggle={() => handleToggleSection('asignaturas-criticas-hbar')}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Asignaturas con reprobación ≥ 20 % (umbral de alerta)
                  </Typography>
                  <button
                    type="button"
                    style={styles.detailButton}
                    onClick={() => handleOpenIndicator('asignaturas-criticas')}
                  >
                    Ver detalle &nbsp;➔
                  </button>
                </Box>
                <SvgHorizontalBarChart
                  data={asignaturasCriticas}
                  height={150}
                  threshold={20}
                  thresholdLabel="Umbral 20 %"
                  isPercent={true}
                  onBarClick={() => handleOpenIndicator('asignaturas-criticas')}
                />
              </DashboardSection>

              {/* 5. Prácticas: inscritas vs. aprobadas */}
              <DashboardSection
                title="Prácticas: inscritas vs. aprobadas"
                icon={<BookIcon />}
                iconColor="#175696"
                isOpen={!collapsedSections['practicas-year']}
                onToggle={() => handleToggleSection('practicas-year')}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Inscritas vs. aprobadas por año
                  </Typography>
                  <button
                    type="button"
                    style={styles.detailButton}
                    onClick={() => handleOpenIndicator('practicas')}
                  >
                    Ver detalle &nbsp;➔
                  </button>
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
                <SvgGroupedBarsChart
                  labels={practicasYear.labels}
                  series={practicasYear.series}
                  onBarClick={() => handleOpenIndicator('practicas')}
                />

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
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Titulados por cohorte · en tiempo normativo vs. con desfase
                  </Typography>
                  <button
                    type="button"
                    style={styles.detailButton}
                    onClick={() => handleOpenIndicator('titulacion-cohorte')}
                  >
                    Ver detalle &nbsp;➔
                  </button>
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
                <SvgGroupedBarsChart
                  labels={titulacionCohorte.labels}
                  series={titulacionCohorte.series}
                  onBarClick={() => handleOpenIndicator('titulacion-cohorte')}
                />
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
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    Titulados por año calendario
                  </Typography>
                  <button
                    type="button"
                    style={styles.detailButton}
                    onClick={() => handleOpenIndicator('titulados-anio')}
                  >
                    Ver detalle &nbsp;➔
                  </button>
                </Box>
                <SvgYearBarChart
                  data={tituladosYear}
                  color="#175696"
                  accentColor="#3EC9FF"
                  isPercent={false}
                  onBarClick={() => handleOpenIndicator('titulados-anio')}
                />
              </DashboardSection>

              {/* 8. Tiempo promedio de titulación */}
              <DashboardSection
                title="Tiempo promedio de titulación"
                icon={<BookIcon />}
                iconColor="#175696"
                isOpen={!collapsedSections['tiempo-titulacion']}
                onToggle={() => handleToggleSection('tiempo-titulacion')}
              >
                <Box sx={styles.chartSubtitleRow}>
                  <Typography sx={styles.chartSubtitle}>
                    8,68 semestres promedio vs. tiempo normativo (8) · desfase +0,68
                  </Typography>
                  <button
                    type="button"
                    style={styles.detailButton}
                    onClick={() => handleOpenIndicator('tiempo-titulacion')}
                  >
                    Ver detalle &nbsp;➔
                  </button>
                </Box>
                <SvgHorizontalBarChart
                  data={[{ label: 'Promedio de titulación', value: tiempoTitulacion }]}
                  height={120}
                  threshold={8}
                  thresholdLabel="Normativo 8"
                  isPercent={false}
                  onBarClick={() => handleOpenIndicator('tiempo-titulacion')}
                />
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
              sx={{ mt: 0, mr: 0, top: '20px' }}
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
                    min={2023}
                    max={2026}
                    step={1}
                    marks={[
                      { value: 2023, label: '2023' },
                      { value: 2024, label: '2024' },
                      { value: 2025, label: '2025' },
                      { value: 2026, label: '2026' },
                    ]}
                    valueLabelDisplay="auto"
                    sx={styles.yearSliderStyle}
                  />
                </Box>
                <Typography sx={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#1E293B', mt: 0.5 }}>
                  {yearRange[0]} — {yearRange[1]}
                </Typography>
              </Box>

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
                    {FILTER_OPTIONS.cohorte.map((val) => {
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
                    {FILTER_OPTIONS.estado.map((val) => {
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
                    {FILTER_OPTIONS.periodo.map((val) => {
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
                    {FILTER_OPTIONS.asignatura.map((val) => {
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
                    {FILTER_OPTIONS.tipoPractica.map((val) => {
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
            </DashboardFilterSidebar>
          </Box>
        </Box>

        {/* DRAWER LATERAL DE DETALLE DE INDICADOR (PIADI-306) */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleCloseDrawer}
          PaperProps={{ sx: styles.drawerPaper }}
        >
          {/* Header del Drawer */}
          <Box sx={styles.drawerHeader}>
            <Box sx={styles.drawerTitleRow}>
              <Typography sx={styles.drawerTitle}>
                {currentIndicator.title}
              </Typography>
              <IconButton onClick={handleCloseDrawer} size="small" sx={{ color: '#64748B' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Cuerpo del Drawer */}
          <Box sx={styles.drawerBody}>
            {drawerLoading ? (
              <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <LinearProgress sx={{ bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#175696' } }} />
              </Box>
            ) : (
              <>
                {/* 1. Qué mide */}
                <Box>
                  <Typography sx={styles.drawerDescLabel}>Qué mide</Typography>
                  <Typography sx={styles.drawerDesc}>
                    {currentIndicator.desc}
                  </Typography>
                </Box>

                {/* 2. Métrica destacada */}
                {currentIndicator.metric && (
                  <Box sx={styles.drawerMetricBox}>
                    <Typography sx={styles.drawerMetricLabel}>
                      {currentIndicator.metric.label}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, flexWrap: 'wrap' }}>
                      <Typography sx={styles.drawerMetricValue}>
                        {typeof currentIndicator.metric.value === 'number'
                          ? currentIndicator.metric.value.toLocaleString('es-CL')
                          : currentIndicator.metric.value}
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

                {/* 3. Tabla histórica */}
                {currentIndicator.rows && (
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={styles.drawerDescLabel}>Desglose de datos</Typography>
                    <Box sx={styles.drawerTableWrap}>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                          <TableRow>
                            {currentIndicator.colLabels.map((col, idx) => (
                              <TableCell
                                key={idx}
                                align={idx === 0 ? 'left' : 'right'}
                                sx={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: '#64748B',
                                  borderBottom: '1px solid #E2E8F0',
                                  py: 1,
                                }}
                              >
                                {col}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {currentIndicator.rows.map((row, rIdx) => (
                            <TableRow key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <TableCell
                                  key={cIdx}
                                  align={cIdx === 0 ? 'left' : 'right'}
                                  sx={{
                                    fontSize: '12.5px',
                                    fontWeight: cIdx === 0 ? 500 : 600,
                                    color: cIdx === 0 ? '#334155' : '#1E293B',
                                    borderBottom: '1px solid #F1F5F9',
                                    py: 1,
                                  }}
                                >
                                  {cell}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </Box>

          {/* Footer del Drawer con Navegación de Períodos */}
          <Box sx={styles.drawerFooter}>
            <Typography sx={{ fontSize: '11.5px', color: '#64748B' }}>
              Período: {drawerPeriod}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={() => stepDrawerPeriod(-1)}
                disabled={drawerPeriod <= 2023}
                sx={{ p: 0.5, border: '1px solid #E2E8F0', borderRadius: '6px' }}
                aria-label="Año anterior"
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <Typography sx={{ px: 1, fontSize: '12px', fontWeight: 700, color: '#1E2875' }}>
                {drawerPeriod}
              </Typography>
              <IconButton
                size="small"
                onClick={() => stepDrawerPeriod(1)}
                disabled={drawerPeriod >= 2026}
                sx={{ p: 0.5, border: '1px solid #E2E8F0', borderRadius: '6px' }}
                aria-label="Año siguiente"
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Drawer>

        {/* MODAL CENTRO DE AYUDA (FAQ) */}
        <Dialog
          open={openHelpDialog}
          onClose={() => setOpenHelpDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2875', fontSize: '18px' }}>
              Centro de Ayuda — Desarrollo Curricular
            </Typography>
            <IconButton onClick={() => setOpenHelpDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            {faqData.map((item, idx) => (
              <Accordion key={idx} sx={{ mb: 1, border: '1px solid #E2E8F0', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#1E293B' }}>
                    {item.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                  <Typography sx={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
                    {item.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </DialogContent>
        </Dialog>

        {/* BOTÓN FLOTANTE CENTRO DE AYUDA */}
        <IconButton
          sx={styles.floatingHelpButton}
          onClick={() => setOpenHelpDialog(true)}
          aria-label="Centro de ayuda"
        >
          <HelpIcon />
        </IconButton>
      </Box>
    </ThemeProvider>
  );
};
