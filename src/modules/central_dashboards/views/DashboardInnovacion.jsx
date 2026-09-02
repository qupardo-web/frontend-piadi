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

import { useDashboardInnovacion, YEARS, CAT_COLORS } from './DashboardInnovacion.hooks';
import { styles } from './DashboardInnovacion.styles';
import { DashboardHeader, KpiCard } from '../components';
import logoEcas from '../../../assets/logo_ECAS_white.svg';

// =========================================================================
// SUBCOMPONENTES DE GRÁFICOS SVG INTERACTIVOS
// =========================================================================

// 1. Gráfico de Barras Verticales por Año
const YearBarChart = ({ data, years = YEARS, indicatorKey, onBarClick, onHover, onLeave }) => {
  const width = 600;
  const height = 240;
  const m = { top: 20, right: 20, bottom: 35, left: 40 };
  const iw = width - m.left - m.right;
  const ih = height - m.top - m.bottom;
  const maxVal = Math.max(...data, 1) * 1.2;

  const barWidth = iw / data.length * 0.55;
  const step = iw / data.length;

  return (
    <Box sx={styles.chartCanvasWrap}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Grid lines */}
        <g transform={`translate(${m.left}, ${m.top})`}>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = ih - ratio * ih;
            const val = Math.round(ratio * maxVal);
            return (
              <g key={idx}>
                <line x1={0} y1={y} x2={iw} y2={y} stroke="#E5E7EB" strokeDasharray="3 3" />
                <text x={-10} y={y + 4} textAnchor="end" fontSize="11" fill="#9E9E9E" fontFamily="Inter">
                  {val}
                </text>
              </g>
            );
          })}
          {/* Eje X */}
          <line x1={0} y1={ih} x2={iw} y2={ih} stroke="#E5E7EB" />
        </g>

        {/* Barras */}
        <g transform={`translate(${m.left}, ${m.top})`}>
          {data.map((val, i) => {
            const barH = (val / maxVal) * ih;
            const x = i * step + (step - barWidth) / 2;
            const y = ih - barH;
            const isLast = i === data.length - 1;
            const color = isLast ? '#0E86B8' : i % 2 === 1 ? '#3EC9FF' : '#EAF9FF';
            const strokeColor = color === '#EAF9FF' ? '#BCE9FC' : 'none';
            const currentYear = years[i] || YEARS[i];

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx={4}
                  fill={color}
                  stroke={strokeColor}
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onClick={() => onBarClick(indicatorKey)}
                  onMouseMove={(e) => onHover(String(currentYear), `Valor: ${val}`, e)}
                  onMouseLeave={onLeave}
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#212121"
                  fontFamily="Inter"
                >
                  {val}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={ih + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#616161"
                  fontWeight="500"
                  fontFamily="Inter"
                >
                  {currentYear}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </Box>
  );
};

// 2. Gráfico Donut para Áreas Temáticas
const DonutChart = ({ data, onSegmentClick, onHover, onLeave }) => {
  const width = 600;
  const height = 260;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 95;
  const innerRadius = 55;
  const total = data.reduce((acc, d) => acc + d.value, 0);

  let currentAngle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const angle = (d.value / total) * 2 * Math.PI;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const x1In = cx + innerRadius * Math.cos(startAngle);
    const y1In = cy + innerRadius * Math.sin(startAngle);
    const x2In = cx + innerRadius * Math.cos(endAngle);
    const y2In = cy + innerRadius * Math.sin(endAngle);

    const largeArc = angle > Math.PI ? 1 : 0;
    const pathData = `M ${x1In} ${y1In} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x2In} ${y2In} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1In} ${y1In} Z`;

    const midAngle = startAngle + angle / 2;
    const labelR = (radius + innerRadius) / 2;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);

    return {
      ...d,
      color: CAT_COLORS[i % CAT_COLORS.length],
      pathData,
      lx,
      ly,
      pct: Math.round((d.value / total) * 100),
    };
  });

  return (
    <Box sx={styles.chartCanvasWrap}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {slices.map((slice, i) => (
          <g key={i}>
            <path
              d={slice.pathData}
              fill={slice.color}
              stroke="#FFFFFF"
              strokeWidth={2}
              style={{ cursor: 'pointer', transition: 'opacity 0.15s ease' }}
              onClick={() => onSegmentClick('proyectos-areas')}
              onMouseMove={(e) => onHover(slice.label, `${slice.value} proyectos (${slice.pct}%)`, e)}
              onMouseLeave={onLeave}
            />
            {slice.value > 1 && (
              <text
                x={slice.lx}
                y={slice.ly + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="#FFFFFF"
                fontFamily="Inter"
                pointerEvents="none"
              >
                {slice.value}
              </text>
            )}
          </g>
        ))}
        {/* Centro del Donut con total */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="20" fontWeight="700" fill="#161796" fontFamily="Inter">
          {total}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fontWeight="600" fill="#9E9E9E" textTransform="uppercase" letterSpacing="0.5px" fontFamily="Inter">
          PROYECTOS
        </text>
      </svg>
    </Box>
  );
};

// 3. Gráfico de Barras Horizontales (Secciones del curso)
const HorizontalBarChart = ({ data, onBarClick, onHover, onLeave }) => {
  const width = 600;
  const height = 220;
  const m = { top: 15, right: 40, bottom: 20, left: 120 };
  const iw = width - m.left - m.right;
  const ih = height - m.top - m.bottom;
  const maxVal = Math.max(...data.map(d => d.value), 1) * 1.2;
  const barHeight = ih / data.length * 0.55;
  const step = ih / data.length;

  return (
    <Box sx={styles.chartCanvasWrap}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <g transform={`translate(${m.left}, ${m.top})`}>
          {/* Líneas de cuadrícula verticales */}
          {[0, 1, 2, 3, 4, 5, 6].map((tick) => {
            const x = (tick / maxVal) * iw;
            if (x > iw) return null;
            return (
              <g key={tick}>
                <line x1={x} y1={0} x2={x} y2={ih} stroke="#E5E7EB" strokeDasharray="3 3" />
              </g>
            );
          })}

          {data.map((d, i) => {
            const barW = (d.value / maxVal) * iw;
            const y = i * step + (step - barHeight) / 2;

            return (
              <g key={i}>
                <text
                  x={-12}
                  y={y + barHeight / 2 + 4}
                  textAnchor="end"
                  fontSize="12"
                  fontWeight="500"
                  fill="#212121"
                  fontFamily="Inter"
                >
                  {d.label}
                </text>
                <rect
                  x={0}
                  y={y}
                  width={barW}
                  height={barHeight}
                  rx={4}
                  fill="#3EC9FF"
                  style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onClick={() => onBarClick('secciones')}
                  onMouseMove={(e) => onHover(d.label, `Secciones: ${d.value}`, e)}
                  onMouseLeave={onLeave}
                />
                <text
                  x={barW + 8}
                  y={y + barHeight / 2 + 4}
                  fontSize="12"
                  fontWeight="600"
                  fill="#212121"
                  fontFamily="Inter"
                >
                  {d.value}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </Box>
  );
};

// 4. Gráfico de Línea con Área (Docentes involucrados)
const LineAreaChart = ({ data, years = YEARS, onLineClick, onHover, onLeave }) => {
  const width = 600;
  const height = 240;
  const m = { top: 20, right: 30, bottom: 35, left: 40 };
  const iw = width - m.left - m.right;
  const ih = height - m.top - m.bottom;
  const maxVal = Math.max(...data, 1) * 1.2;
  const step = data.length > 1 ? iw / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    x: data.length > 1 ? i * step : iw / 2,
    y: ih - (d / maxVal) * ih,
    val: d,
    year: years[i] || YEARS[i],
  }));

  const linePath = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');
  const areaPath = points.length > 1 ? `${linePath} L ${points[points.length - 1].x} ${ih} L ${points[0].x} ${ih} Z` : '';

  return (
    <Box sx={styles.chartCanvasWrap}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <g transform={`translate(${m.left}, ${m.top})`}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = ih - ratio * ih;
            const val = Math.round(ratio * maxVal);
            return (
              <g key={idx}>
                <line x1={0} y1={y} x2={iw} y2={y} stroke="#E5E7EB" strokeDasharray="3 3" />
                <text x={-10} y={y + 4} textAnchor="end" fontSize="11" fill="#9E9E9E" fontFamily="Inter">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Área */}
          <path d={areaPath} fill="#EAF9FF" opacity={0.6} />

          {/* Línea */}
          <path d={linePath} fill="none" stroke="#0E86B8" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

          {/* Puntos y etiquetas */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={6}
                fill="#0E86B8"
                stroke="#FFFFFF"
                strokeWidth={2}
                style={{ cursor: 'pointer', transition: 'transform 0.15s ease' }}
                onClick={() => onLineClick('docentes')}
                onMouseMove={(e) => onHover(String(pt.year), `Docentes: ${pt.val}`, e)}
                onMouseLeave={onLeave}
              />
              <text
                x={pt.x}
                y={pt.y - 12}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill="#0E86B8"
                fontFamily="Inter"
              >
                {pt.val}
              </text>
              <text
                x={pt.x}
                y={ih + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#616161"
                fontWeight="500"
                fontFamily="Inter"
              >
                {pt.year}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </Box>
  );
};

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
    visibleYears,
    proyActivos,
    proyFinalizados,
    proyAreas,
    seccionesCurso,
    docentes,
    finExterno,
    activeMenu,
  } = useDashboardInnovacion();

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

  return (
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
            compareText={`vs base (${kpis.activos.baseYear}): ${kpis.activos.baseVal}`}
            evolution={kpis.activos.evo !== null ? `${kpis.activos.evo}%` : null}
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
            compareText={`vs base (${kpis.finalizados.baseYear}): ${kpis.finalizados.baseVal}`}
            evolution={kpis.finalizados.evo !== null ? `${kpis.finalizados.evo}%` : null}
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
            compareText={`vs base (${kpis.docentes.baseYear}): ${kpis.docentes.baseVal}`}
            evolution={kpis.docentes.evo !== null ? `${kpis.docentes.evo}%` : null}
            isPositive={kpis.docentes.isPositive}
            onClick={() => handleOpenIndicator('docentes')}
          />
        </Box>

            {/* 1. Proyectos de innovación activos */}
            <Box sx={styles.chartSection}>
              <Box sx={styles.chartHeader}>
                <Box sx={styles.chartHeaderRow}>
                  <Typography sx={styles.chartTitle}>
                    <LightbulbIcon sx={{ color: '#0E86B8', fontSize: '20px' }} />
                    Proyectos de innovación activos
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      ...styles.chartToggleBtn,
                      transform: collapsedSections['proy-year'] ? 'rotate(-90deg)' : 'none',
                    }}
                    onClick={() => handleToggleSection('proy-year')}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
              </Box>
              {!collapsedSections['proy-year'] && (
                <Box>
                  <Typography sx={styles.chartSubtitle}>Distribución por año</Typography>
                  {!hasData || proyActivos.every(v => v === 0) ? (
                    <Box sx={styles.noDataPlaceholder}>Sin datos disponibles</Box>
                  ) : (
                    <YearBarChart
                      data={proyActivos}
                      years={visibleYears}
                      indicatorKey="proyectos-activos"
                      onBarClick={handleOpenIndicator}
                      onHover={showTooltip}
                      onLeave={hideTooltip}
                    />
                  )}
                </Box>
              )}
            </Box>

            {/* 2. Proyectos finalizados */}
            <Box sx={styles.chartSection}>
              <Box sx={styles.chartHeader}>
                <Box sx={styles.chartHeaderRow}>
                  <Typography sx={styles.chartTitle}>
                    <CheckCircleOutline sx={{ color: '#0E86B8', fontSize: '20px' }} />
                    Proyectos finalizados
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      ...styles.chartToggleBtn,
                      transform: collapsedSections['fin-year'] ? 'rotate(-90deg)' : 'none',
                    }}
                    onClick={() => handleToggleSection('fin-year')}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
              </Box>
              {!collapsedSections['fin-year'] && (
                <Box>
                  <Typography sx={styles.chartSubtitle}>Distribución por año</Typography>
                  {!hasData || proyFinalizados.every(v => v === 0) ? (
                    <Box sx={styles.noDataPlaceholder}>Sin datos disponibles</Box>
                  ) : (
                    <YearBarChart
                      data={proyFinalizados}
                      years={visibleYears}
                      indicatorKey="proyectos-finalizados"
                      onBarClick={handleOpenIndicator}
                      onHover={showTooltip}
                      onLeave={hideTooltip}
                    />
                  )}
                </Box>
              )}
            </Box>

            {/* 3. Áreas temáticas de innovación */}
            <Box sx={styles.chartSection}>
              <Box sx={styles.chartHeader}>
                <Box sx={styles.chartHeaderRow}>
                  <Typography sx={styles.chartTitle}>
                    <TargetIcon sx={{ color: '#0E86B8', fontSize: '20px' }} />
                    Áreas temáticas de innovación
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      ...styles.chartToggleBtn,
                      transform: collapsedSections['proy-area'] ? 'rotate(-90deg)' : 'none',
                    }}
                    onClick={() => handleToggleSection('proy-area')}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
              </Box>
              {!collapsedSections['proy-area'] && (
                <Box>
                  <Typography sx={styles.chartSubtitle}>Distribución por área temática</Typography>
                  {!hasData || proyAreas.length === 0 ? (
                    <Box sx={styles.noDataPlaceholder}>Sin datos disponibles</Box>
                  ) : (
                    <DonutChart
                      data={proyAreas}
                      onSegmentClick={handleOpenIndicator}
                      onHover={showTooltip}
                      onLeave={hideTooltip}
                    />
                  )}
                </Box>
              )}
            </Box>

            {/* 4. Secciones del curso de innovación */}
            <Box sx={styles.chartSection}>
              <Box sx={styles.chartHeader}>
                <Box sx={styles.chartHeaderRow}>
                  <Typography sx={styles.chartTitle}>
                    <CalendarIcon sx={{ color: '#0E86B8', fontSize: '20px' }} />
                    Secciones del curso de innovación
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      ...styles.chartToggleBtn,
                      transform: collapsedSections['secciones-hbar'] ? 'rotate(-90deg)' : 'none',
                    }}
                    onClick={() => handleToggleSection('secciones-hbar')}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
              </Box>
              {!collapsedSections['secciones-hbar'] && (
                <Box>
                  <Typography sx={styles.chartSubtitle}>Secciones por semestre</Typography>
                  {!hasData || seccionesCurso.length === 0 ? (
                    <Box sx={styles.noDataPlaceholder}>Sin datos disponibles</Box>
                  ) : (
                    <HorizontalBarChart
                      data={seccionesCurso}
                      onBarClick={handleOpenIndicator}
                      onHover={showTooltip}
                      onLeave={hideTooltip}
                    />
                  )}
                </Box>
              )}
            </Box>

            {/* 5. Docentes involucrados */}
            <Box sx={styles.chartSection}>
              <Box sx={styles.chartHeader}>
                <Box sx={styles.chartHeaderRow}>
                  <Typography sx={styles.chartTitle}>
                    <TrendingUpIcon sx={{ color: '#0E86B8', fontSize: '20px' }} />
                    Docentes involucrados
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      ...styles.chartToggleBtn,
                      transform: collapsedSections['doc-line'] ? 'rotate(-90deg)' : 'none',
                    }}
                    onClick={() => handleToggleSection('doc-line')}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
              </Box>
              {!collapsedSections['doc-line'] && (
                <Box>
                  <Typography sx={styles.chartSubtitle}>Tendencia por año</Typography>
                  {!hasData || docentes.every(v => v === 0) ? (
                    <Box sx={styles.noDataPlaceholder}>Sin datos disponibles</Box>
                  ) : (
                    <LineAreaChart
                      data={docentes}
                      years={visibleYears}
                      onLineClick={handleOpenIndicator}
                      onHover={showTooltip}
                      onLeave={hideTooltip}
                    />
                  )}
                </Box>
              )}
            </Box>

            {/* 6. Proyectos con financiamiento externo */}
            <Box sx={styles.chartSection}>
              <Box sx={styles.chartHeader}>
                <Box sx={styles.chartHeaderRow}>
                  <Typography sx={styles.chartTitle}>
                    <AuditoriaIcon sx={{ color: '#0E86B8', fontSize: '20px' }} />
                    Proyectos con financiamiento externo
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      ...styles.chartToggleBtn,
                      transform: collapsedSections['fin-externo'] ? 'rotate(-90deg)' : 'none',
                    }}
                    onClick={() => handleToggleSection('fin-externo')}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
              </Box>
              {!collapsedSections['fin-externo'] && (
                <Box>
                  <Typography sx={styles.chartSubtitle}>Proyectos FDI por año</Typography>
                  {!hasData || finExterno.every(v => v === 0) ? (
                    <Box sx={styles.noDataPlaceholder}>Sin datos disponibles</Box>
                  ) : (
                    <YearBarChart
                      data={finExterno}
                      years={visibleYears}
                      indicatorKey="financiamiento"
                      onBarClick={handleOpenIndicator}
                      onHover={showTooltip}
                      onLeave={hideTooltip}
                    />
                  )}
                </Box>
              )}
            </Box>
          </Box>

          {/* Sidebar colapsable para Desktop integrado con el diseño (Sticky top 20px) */}
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
            )}

        {/* Contenido de los filtros (solo visible si no está colapsado) */}
        {!filtersCollapsed && (
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100% - 56px)',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              px: 2.5, 
              py: 2.5, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 2.5 
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
                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 1.5, fontWeight: 600, color: '#1E2875', fontSize: '13px' }}>
                      {yearRange[0]} — {yearRange[1]}
                    </Typography>
                  </Box>
                </Box>

                {/* Acordeón: Estado */}
                {dynamicEstados.length > 0 && (
                  <Accordion
                    expanded={accordionsOpen.estado}
                    onChange={() => handleToggleAccordion('estado')}
                    sx={{ boxShadow: 'none', border: 'none', margin: '0 !important', '&:before': { display: 'none' } }}
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
                    sx={{ boxShadow: 'none', border: 'none', margin: '0 !important', '&:before': { display: 'none' } }}
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
                    sx={{ boxShadow: 'none', border: 'none', margin: '0 !important', '&:before': { display: 'none' } }}
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
                    sx={{ boxShadow: 'none', border: 'none', margin: '0 !important', '&:before': { display: 'none' } }}
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
                    sx={{ boxShadow: 'none', border: 'none', margin: '0 !important', '&:before': { display: 'none' } }}
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
  );
};
