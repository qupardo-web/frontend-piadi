import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styles } from './DashboardEducacionContinua.styles';
import { Header, Sidebar, KpiCard, DashboardChartCard, DashboardPersistentFilterSidebar } from '../../../components';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  IconButton,
  Divider,
  Drawer,
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
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  TableChart as TablaIcon,
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
  ExpandMore as ExpandMoreIcon,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const hasData = !apiLoading && apiSummary && Object.keys(apiSummary).length > 0;

  useEffect(() => {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (!target) return;
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [location.hash]);

  const filtersContent = (
    <>
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
      {hasData && (
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
      )}

      {/* Selector de Mes (Rango) */}
      {hasData && (
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
      )}

      {/* Tipo de programa (Selector Múltiple) */}
      {hasData && (
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
      )}

      {/* Modalidad (Selector Múltiple) */}
      {hasData && (
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
      )}

      {/* Área (Selector Múltiple) */}
      {hasData && (
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
      )}
    </>
  );

  return (
    <ThemeProvider theme={dashboardLightTheme}>
      <Box sx={styles.mainLayout}>
      
      {/* SCOPED STYLE BLOCK TO AVOID GLOBAL COLLISION */}
      <style dangerouslySetInnerHTML={{__html: `
        .taller-devops-dashboard {
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
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
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: 1100px) {
          .taller-devops-dashboard .kpi-container {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
        @media (max-width: 600px) {
          .taller-devops-dashboard .kpi-container {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
        .taller-devops-dashboard .kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #1E2875;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          width: 100%;
          box-sizing: border-box;
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
          width: 100%;
          box-sizing: border-box;
          flex-wrap: wrap;
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
          width: 100%;
          box-sizing: border-box;
        }
        @media (max-width: 1024px) {
          .taller-devops-dashboard .charts-grid {
            grid-template-columns: 1fr;
            gap: 16px;
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
          min-height: 380px;
          height: auto;
          width: 100%;
          min-width: 0;
          max-width: 100%;
          box-sizing: border-box;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        @media (max-width: 600px) {
          .taller-devops-dashboard .chart-card {
            padding: 16px 14px;
            min-height: 340px;
          }
        }
        .taller-devops-dashboard .chart-card:hover {
          box-shadow: 0 4px 12px rgba(30, 40, 117, 0.05);
        }
        .taller-devops-dashboard .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 10px;
          width: 100%;
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
          min-height: 280px;
          width: 100%;
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .taller-devops-dashboard .chart-wrapper .MuiResponsiveChart-container {
          width: 100% !important;
          max-width: 100% !important;
        }

        /* Toggle Buttons */
        .taller-devops-dashboard .card-toggle-group {
          display: flex;
          flex-wrap: wrap;
          background-color: #f1f5f9;
          border-radius: 8px;
          padding: 3px;
          gap: 2px;
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

      {/* SIDEBAR TRANSVERSAL (Escritorio + Drawer + AppBar Móvil) */}
      <Sidebar />

      {/* ÁREA DE CONTENIDO CENTRAL */}
      <Box component="main" sx={styles.contentArea} className="taller-devops-dashboard">
        
        {/* Cabecera del Panel Principal */}
        <Header
          title="Dashboard de Educación Continua"
          subtitle="Visualización de estadísticas y métricas del departamento de Educación Continua"
          icon={<SchoolIcon />}
          iconColor="#46D19F"
          loading={apiLoading}
        />

        {/* SECCIÓN DE FILTROS EN MÓVIL (ACORDEÓN) */}
        <DashboardPersistentFilterSidebar
          variant="accordion"
          title="Filtros"
          hasData={hasData}
          onReset={handleResetFilters}
        >
          {filtersContent}
        </DashboardPersistentFilterSidebar>

        {/* Top Summary Cards — 4 indicadores clave con evolución 2023→2026 */}
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
          {kpiCardsData.map(card => {
            const { Icon } = card;
            const evoPos = card.evo != null && card.evo >= 0;
            const hasDiffYears = card.yHasta !== card.yDesde;
            return (
              <Grid item xs={12} sm={6} md={3} key={card.key} sx={{ display: 'flex' }}>
                <KpiCard
                  label={card.label}
                  value={card.valHasta != null ? card.fmt(card.valHasta) : '-'}
                  icon={<Icon size={24} />}
                  accentColor={card.borderColor}
                  hasData={card.valHasta != null}
                  loading={apiLoading}
                  compareText={
                    card.valDesde != null && hasDiffYears
                      ? `${card.yDesde}: ${card.fmt(card.valDesde)}`
                      : null
                  }
                  evolution={card.evo != null && hasDiffYears ? `${Math.abs(card.evo)}%` : null}
                  isPositive={evoPos}
                />
              </Grid>
            );
          })}
        </Grid>

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

          {/* Card 1: Oferta de cursos programada */}
          <DashboardChartCard
            id="oferta-programada"
            fullWidth
            minHeight="390px"
            icon={<BookOpen size={16} />}
            iconColor="#1E2875"
            title="Oferta programada"
            actions={
              <div className="card-toggle-group">
                <button className={`btn-toggle ${ofertaViewMode === 'total' ? 'active' : ''}`} onClick={() => setOfertaViewMode('total')}>Total</button>
                <button className={`btn-toggle ${ofertaViewMode === 'area' ? 'active' : ''}`} onClick={() => setOfertaViewMode('area')}>Área</button>
                <button className={`btn-toggle ${ofertaViewMode === 'tipo' ? 'active' : ''}`} onClick={() => setOfertaViewMode('tipo')}>Tipo</button>
                <button className={`btn-toggle ${ofertaViewMode === 'modalidad' ? 'active' : ''}`} onClick={() => setOfertaViewMode('modalidad')}>Modalidad</button>
              </div>
            }
            hasData={ofertaChartData.labels.length > 0}
          >
            <BarChart
              xAxis={[{
                scaleType: 'band',
                data: ofertaChartData.labels,
                label: isMobile ? undefined : (ofertaViewMode === 'total' ? 'Año' : (ofertaViewMode === 'area' ? 'Área' : (ofertaViewMode === 'tipo' ? 'Tipo' : 'Modalidad'))),
                tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                valueFormatter: (value, context) => {
                  if (isMobile && context?.location === 'tick' && value && String(value).length > 6) {
                    return String(value).substring(0, 4) + '...';
                  }
                  return value;
                }
              }]}
              series={ofertaChartData.series}
              margin={{ top: 15, right: 15, bottom: isMobile ? 65 : 60, left: isMobile ? 35 : 40 }}
              slotProps={{
                legend: {
                  direction: 'horizontal',
                  position: { vertical: 'bottom', horizontal: 'center' },
                  labelStyle: { fontSize: isMobile ? '10px' : '11px', fill: '#1e293b' }
                },
                tooltip: { trigger: 'axis' }
              }}
            />
          </DashboardChartCard>

          {/* Card 2: Cursos efectivamente dictados */}
          <DashboardChartCard
            id="cursos-dictados"
            icon={<CheckCircle size={16} />}
            iconColor="#10B981"
            title="Cursos efectivamente dictados"
            hasData={Boolean(effectiveDictadosSeries && effectiveDictadosSeries.length > 0)}
          >
            <BarChart
              xAxis={[{ 
                scaleType: 'band', 
                data: (effectiveDictadosSeries || []).map(d => d.cohorte), 
                label: isMobile ? undefined : 'Año',
                tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 }
              }]}
              series={[
                { data: (effectiveDictadosSeries || []).map(d => d.planificados), label: 'Programados', color: '#cbd5e1' },
                { data: (effectiveDictadosSeries || []).map(d => d.dictados), label: 'Dictados', color: '#10B981' }
              ]}
              margin={{ top: 15, right: 15, bottom: isMobile ? 55 : 40, left: isMobile ? 35 : 40 }}
              slotProps={{
                legend: {
                  direction: 'horizontal',
                  position: { vertical: 'bottom', horizontal: 'center' },
                  labelStyle: { fontSize: isMobile ? '9px' : '10px', fill: '#1e293b' }
                },
                tooltip: { trigger: 'axis' }
              }}
            />
          </DashboardChartCard>

          {/* Card 3: Tasa de ejecución (%) */}
          <DashboardChartCard
            id="tasa-ejecucion"
            icon={<Percent size={16} />}
            iconColor="#1E2875"
            title="Tasa de ejecución (%)"
            hasData={Boolean(effectiveEjecucionSeries && effectiveEjecucionSeries.length > 0)}
          >
            <LineChart
              xAxis={[{ 
                scaleType: 'point', 
                data: (effectiveEjecucionSeries || []).map(d => d.cohorte), 
                label: isMobile ? undefined : 'Año',
                tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 }
              }]}
              series={[{
                data: (effectiveEjecucionSeries || []).map(d => d.tasa),
                color: '#1E2875',
                label: 'Tasa Ejecución %',
                valueFormatter: (value) => `${value}%`,
                showMark: true,
              }]}
              margin={{ top: 15, right: 15, bottom: isMobile ? 55 : 40, left: isMobile ? 35 : 45 }}
              slotProps={{
                tooltip: { trigger: 'axis' }
              }}
            />
          </DashboardChartCard>

          {/* Card 4: Ingresos Generados */}
          <DashboardChartCard
            id="ingresos-generados"
            fullWidth
            minHeight="390px"
            icon={<DollarSign size={16} />}
            iconColor="#10B981"
            title={`Ingresos por ${ingresosViewMode === 'area' ? 'área' : (ingresosViewMode === 'tipo' ? 'tipo de programa' : 'modalidad')} ($M CLP)`}
            actions={
              <div className="card-toggle-group">
                <button className={`btn-toggle ${ingresosViewMode === 'area' ? 'active' : ''}`} onClick={() => setIngresosViewMode('area')}>Área</button>
                <button className={`btn-toggle ${ingresosViewMode === 'tipo' ? 'active' : ''}`} onClick={() => setIngresosViewMode('tipo')}>Tipo</button>
                <button className={`btn-toggle ${ingresosViewMode === 'modalidad' ? 'active' : ''}`} onClick={() => setIngresosViewMode('modalidad')}>Modalidad</button>
              </div>
            }
            hasData={ingresosChartData.labels.length > 0}
          >
            <BarChart
              xAxis={[{
                scaleType: 'band',
                data: ingresosChartData.labels,
                label: isMobile ? undefined : (ingresosViewMode === 'area' ? 'Área' : (ingresosViewMode === 'tipo' ? 'Tipo' : 'Modalidad')),
                tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                valueFormatter: (value, context) => {
                  if (isMobile && context?.location === 'tick' && value && String(value).length > 6) {
                    return String(value).substring(0, 4) + '...';
                  }
                  return value;
                }
              }]}
              series={ingresosChartData.series}
              margin={{ top: 15, right: 15, bottom: isMobile ? 70 : 80, left: isMobile ? 40 : 50 }}
              slotProps={{ 
                legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: isMobile ? '9px' : '10px' } },
                tooltip: { trigger: 'axis' }
              }}
            />
          </DashboardChartCard>

          {/* Card 5: Matrícula por programa (Radar Chart) */}
          <DashboardChartCard
            id="matricula-por-programa"
            fullWidth
            minHeight="480px"
            title="Matrícula por programa"
            headerContent={
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                <div className="card-toggle-group">
                  <button className={`btn-toggle ${matriculaViewMode === 'total' ? 'active' : ''}`} onClick={() => setMatriculaViewMode('total')}>Total</button>
                  <button className={`btn-toggle ${matriculaViewMode === 'area' ? 'active' : ''}`} onClick={() => setMatriculaViewMode('area')}>Área</button>
                  <button className={`btn-toggle ${matriculaViewMode === 'modalidad' ? 'active' : ''}`} onClick={() => setMatriculaViewMode('modalidad')}>Modalidad</button>
                  <button className={`btn-toggle ${matriculaViewMode === 'tipo' ? 'active' : ''}`} onClick={() => setMatriculaViewMode('tipo')}>Tipo Programa</button>
                </div>
              </div>
            }
            wrapperStyle={{ height: isMobile ? '340px' : '390px' }}
            hasData={matriculaChartData.labels.length > 0}
          >
            <BarChart
              height={isMobile ? 330 : 370}
              xAxis={[{
                scaleType: 'band',
                data: matriculaChartData.labels,
                label: isMobile ? undefined : (matriculaViewMode === 'total' ? 'Año' : (matriculaViewMode === 'area' ? 'Área' : (matriculaViewMode === 'modalidad' ? 'Modalidad' : 'Tipo'))),
                tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                valueFormatter: (value, context) => {
                  if (isMobile && context?.location === 'tick' && value && String(value).length > 6) {
                    return String(value).substring(0, 4) + '...';
                  }
                  return value;
                }
              }]}
              series={matriculaChartData.series}
              margin={{ top: 15, right: 15, bottom: isMobile ? 70 : 80, left: isMobile ? 40 : 50 }}
              slotProps={{ 
                legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: isMobile ? '9px' : '10px' } },
                tooltip: { trigger: 'axis' }
              }}
            />
          </DashboardChartCard>

          {/* Card 6: Tasa de aprobación por programa */}
          <DashboardChartCard
            id="tasa-aprobacion"
            fullWidth
            minHeight="380px"
            icon={<Award size={16} />}
            iconColor="#a855f7"
            title="Tasa de aprobación"
            wrapperStyle={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', padding: '8px' }}
            hasData={aprobacionProgramasData.length > 0}
            noDataMessage="No hay datos coincidentes"
          >
            {aprobacionProgramasData.map(row => (
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
            ))}
          </DashboardChartCard>

          {/* Card 7: Perfil del participante */}
          <DashboardChartCard
            fullWidth
            icon={<UserCheck size={16} />}
            iconColor="#F59E0B"
            title="Perfil del participante"
            headerContent={
              <div className="card-toggle-group" style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '380px', marginTop: '4px' }}>
                <button className={`btn-toggle ${perfilViewMode === 'region' ? 'active' : ''}`} onClick={() => setPerfilViewMode('region')}>Región</button>
                <button className={`btn-toggle ${perfilViewMode === 'sector' ? 'active' : ''}`} onClick={() => setPerfilViewMode('sector')}>Sector</button>
                <button className={`btn-toggle ${perfilViewMode === 'escolaridad' ? 'active' : ''}`} onClick={() => setPerfilViewMode('escolaridad')}>Escolaridad</button>
                <button className={`btn-toggle ${perfilViewMode === 'edad' ? 'active' : ''}`} onClick={() => setPerfilViewMode('edad')}>Edad</button>
                <button className={`btn-toggle ${perfilViewMode === 'genero' ? 'active' : ''}`} onClick={() => setPerfilViewMode('genero')}>Género</button>
                <button className={`btn-toggle ${perfilViewMode === 'tipo' ? 'active' : ''}`} onClick={() => setPerfilViewMode('tipo')}>Tipo</button>
              </div>
            }
            wrapperStyle={{ marginTop: '8px' }}
            hasData={Boolean(perfilParticipantesData && perfilParticipantesData.length > 0)}
          >
            <PieChart
              series={[
                {
                  data: perfilParticipantesData,
                  innerRadius: 20,
                  outerRadius: isMobile ? 70 : 85,
                  paddingAngle: 3,
                  cornerRadius: 4,
                },
              ]}
              height={isMobile ? 260 : 220}
              margin={{ top: 10, bottom: isMobile ? 50 : 10, left: 10, right: 10 }}
              slotProps={{
                legend: {
                  direction: isMobile ? 'horizontal' : 'vertical',
                  position: { vertical: isMobile ? 'bottom' : 'middle', horizontal: isMobile ? 'center' : 'end' },
                  labelStyle: { fontSize: isMobile ? '9px' : '10px', fill: '#1e293b' }
                }
              }}
            />
          </DashboardChartCard>

          {/* Card 8: Pictograma: Participantes Únicos */}
          <DashboardChartCard
            minHeight="380px"
            icon={<Users size={16} />}
            iconColor="#8b5cf6"
            title="Pictograma: Participantes Únicos"
            wrapperStyle={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '12px', justifyContent: 'space-between' }}
            hasData={uniqueParticipantsAgeDist.length > 0}
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, gap: '20px', padding: '12px 0', width: '100%' }}>
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
            <div style={{ fontSize: '12px', color: '#1e293b', fontWeight: 500, borderTop: '1px solid #f1f5f9', paddingTop: '8px', textAlign: 'center', lineHeight: '1.4', width: '100%' }}>
              Cada figura representa un 10% del total de participantes únicos ({uniqueParticipantsTotal})
            </div>
          </DashboardChartCard>

          {/* Card 9: Pictograma: Frecuencia de Matrículas */}
          <DashboardChartCard
            minHeight="380px"
            icon={<RefreshCw size={16} />}
            iconColor="#ec4899"
            title="Pictograma: Frecuencia de Matrículas"
            wrapperStyle={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '12px', justifyContent: 'space-between' }}
            hasData={recurrenceFreqDist.length > 0}
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flexGrow: 1, gap: '24px', padding: '20px 0', width: '100%' }}>
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
            <div style={{ fontSize: '12px', color: '#1e293b', fontWeight: 500, borderTop: '1px solid #f1f5f9', paddingTop: '8px', textAlign: 'center', lineHeight: '1.4', width: '100%' }}>
              Cada figura representa un 10% del total de personas con recurrencia formativa
            </div>
          </DashboardChartCard>

        </div>

      </Box>

      {/* SECCIÓN DE FILTROS PERSISTENTES (DERECHA EN ESCRITORIO) */}
      <DashboardPersistentFilterSidebar
        variant="aside"
        title="Filtros"
        hasData={hasData}
        onReset={handleResetFilters}
      >
        {filtersContent}
      </DashboardPersistentFilterSidebar>

      </Box>
    </ThemeProvider>
  );
};
