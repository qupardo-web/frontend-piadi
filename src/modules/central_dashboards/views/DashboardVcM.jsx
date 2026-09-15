import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../auth';
import { styles } from './DashboardVcM.styles';
import { Header, Sidebar, KpiCard, DashboardSection, DashboardFilterSidebar } from '../../../components';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
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

// Lucide Icons
import { 
  Calendar as CalendarLucide, Search, Filter, ChevronRight as ChevronRightLucide, ChevronDown, 
  Users, Maximize2, X, Info, GraduationCap,
  BookOpen, CheckCircle, TrendingUp, Percent,
  Award, Layers, Briefcase, DollarSign, UserCheck,
  RefreshCw, ClipboardList
} from 'lucide-react';

// MUI X-Charts
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { cheerfulFiestaPalette } from '@mui/x-charts/colorPalettes';
import { useDrawingArea } from '@mui/x-charts/hooks';

function PieCenterLabel({ primary, secondary }) {
  const { width, height, left, top } = useDrawingArea();
  const centerX = left + width / 2;
  const centerY = top + height / 2;
  return (
    <g style={{ pointerEvents: 'none' }}>
      <text
        x={centerX}
        y={centerY - 6}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '22px',
          fontWeight: 800,
          fill: '#1E2875',
        }}
      >
        {primary}
      </text>
      <text
        x={centerX}
        y={centerY + 14}
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '10px',
          fontWeight: 600,
          fill: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {secondary}
      </text>
    </g>
  );
}

import {
  useDashboardVcM,
  SEMESTRES_LIST,
  SEXO_LIST,
  MESES_LIST,
  TIPOS_LIST,
  MODALIDADES_LIST,
  AREAS_LIST
} from './DashboardVcM.hooks';

const dashboardLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E2875',
    },
    secondary: {
      main: '#E27800', // Naranja para VcM
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
    MuiBarChart: {
      defaultProps: {
        grid: { horizontal: true }
      }
    },
    MuiLineChart: {
      defaultProps: {
        grid: { horizontal: true }
      }
    },
  },
});

export const DashboardVcM = () => {
  const catColors = ['#E27800', '#2196F3', '#4CAF50', '#9C27B0', '#FF5722', '#607D8B'];
  const getSectorColor = (label) => {
    const clean = String(label).toLowerCase().trim();
    if (clean.includes('público') || clean.includes('publico')) return '#E27800'; // Naranja
    if (clean.includes('privado')) return '#2196F3'; // Azul
    if (clean.includes('ong') || clean.includes('fundación') || clean.includes('fundacion')) return '#4CAF50'; // Verde
    if (clean.includes('academia')) return '#9C27B0'; // Morado
    if (clean.includes('comunidad') || clean.includes('educación tp') || clean.includes('edtp')) return '#FF5722'; // Coral
    return '#607D8B'; // Gris
  };
  const wrapText = (text, maxChars = 12) => {
    if (!text) return '';
    if (text.length <= maxChars) return text;
    const words = text.split(' ');
    let currentLine = '';
    const lines = [];
    words.forEach(word => {
      if ((currentLine + word).length > maxChars) {
        if (currentLine) {
          lines.push(currentLine.trim());
        }
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });
    if (currentLine) {
      lines.push(currentLine.trim());
    }
    return lines.join('\n');
  };
  const getSexoColor = (label) => {
    const clean = String(label).toLowerCase().trim();
    if (clean.includes('femenino') || clean.includes('mujer') || clean.includes('femenina')) return '#E91E63'; // Fucsia/Rosa
    if (clean.includes('masculino') || clean.includes('hombre')) return '#2196F3'; // Azul
    return '#9E9E9E'; // Gris
  };
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
  const location = useLocation();
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [filtersCollapsed, setFiltersCollapsed] = React.useState(false);
  
  // Estados locales para controlar los acordeones de los filtros
  const [openConvenios, setOpenConvenios] = React.useState(true);
  const [openActividades, setOpenActividades] = React.useState(true);
  const [openArticulacion, setOpenArticulacion] = React.useState(true);

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
    selectedSectores,
    setSelectedSectores,
    selectedTiposConvenio,
    setSelectedTiposConvenio,
    selectedEstados,
    setSelectedEstados,
    selectedLineas,
    setSelectedLineas,
    selectedModalidades,
    setSelectedModalidades,
    selectedPlataformas,
    setSelectedPlataformas,
    selectedTiposArticulacion,
    setSelectedTiposArticulacion,
    selectedAreas,
    setSelectedAreas,
    periodoAcumulado,
    setPeriodoAcumulado,
    ofertaViewMode,
    setOfertaViewMode,
    perfilViewMode,
    setPerfilViewMode,
    localSexoFilter,
    setLocalSexoFilter,
    localEdadFilter,
    setLocalEdadFilter,
    activeModal,
    setActiveModal,
    dynamicAreas,
    dynamicTipos,
    dynamicModalidades,
    dynamicSemestres,
    dynamicLineas,
    dynamicPlataformas,
    dynamicTiposArticulacion,
    activeMenu,
    handleDrawerToggle,
    handleResetFilters,
    sectionsOpen,
    toggleSection,
    sec1Segment,
    setSec1Segment,
    sec2Segment,
    setSec2Segment,
    datasetsSec2,
    datasetsSec3,
    sec4Segment,
    setSec4Segment,
    datasetsSec4,
    sec5Segment,
    setSec5Segment,
    datasetsSec5,
    sec6Segment,
    setSec6Segment,
    datasetsSec6,
    sortStates,
    handleSort,
    getSortedData,
    getFilteredYears,
    datasetsSec1,
    kpiCardsData,
    apiFilters,
    apiSummary,
    apiLoading,
    apiError,
    hasRealData,
    apiConveniosActivosSeries,
    apiTotalConveniosSeries,
    apiActividadesRealizadasSeries,
    apiParticipacionesSeries,
    apiArticulacionesTPSeries,
  } = useDashboardVcM();

  const sectorsList = hasRealData && apiFilters?.filters?.sectores?.length
    ? apiFilters.filters.sectores.map(s => {
        return { label: s, val: s };
      })
    : [];

  const modalidadesList = hasRealData && apiFilters?.filters?.modalidades?.length
    ? apiFilters.filters.modalidades.map(m => ({ label: m, val: m }))
    : [];

  const availableYears = apiFilters?.filters?.years ?? [];
  const minYear = availableYears.length ? Math.min(...availableYears) : 2023;
  const maxYear = availableYears.length ? Math.max(...availableYears) : 2026;

  const isNoData = !hasRealData;

  const renderDataOrPlaceholder = (hasData, component, height = 240) => {
    if (!hasData || isNoData) {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: height, 
          color: '#64748b', 
          fontSize: '13px', 
          fontWeight: 500,
          border: '1px dashed #E2E8F0',
          borderRadius: '12px',
          bgcolor: '#F8FAFC',
          width: '100%'
        }}>
          Sin datos disponibles
        </Box>
      );
    }
    return component;
  };

  const toggleChip = (list, setList, val) => {
    if (list.includes(val)) {
      setList(list.filter(item => item !== val));
    } else {
      setList([...list, val]);
    }
  };

  const FilterChip = ({ label, selected, onClick }) => (
    <Button
      onClick={onClick}
      sx={{
        textTransform: 'none',
        fontSize: '11.5px',
        py: 0.5,
        px: 1.5,
        m: 0.4,
        borderRadius: '20px',
        minWidth: 0,
        bgcolor: selected ? '#E27800' : '#F1F5F9',
        color: selected ? '#ffffff' : '#475569',
        border: `1px solid ${selected ? '#E27800' : '#E2E8F0'}`,
        fontWeight: selected ? 600 : 500,
        display: 'inline-flex',
        boxShadow: selected ? '0 2px 4px rgba(226, 120, 0, 0.15)' : 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          bgcolor: selected ? '#B35E00' : '#E2E8F0',
          borderColor: selected ? '#B35E00' : '#CBD5E1',
          transform: 'translateY(-1px)',
        },
        '&:active': {
          transform: 'translateY(0)',
        }
      }}
    >
      {label}
    </Button>
  );

  return (
    <ThemeProvider theme={dashboardLightTheme}>
      <Box sx={styles.mainLayout}>
      
      {/* SCOPED STYLE BLOCK TO AVOID GLOBAL COLLISION */}
      <style dangerouslySetInnerHTML={{__html: `
        .vcm-dashboard {
          font-family: 'Inter', sans-serif;
          color: #1e293b;
        }
        .vcm-dashboard svg text,
        .vcm-dashboard svg text tspan,
        .vcm-dashboard svg tspan {
          fill: #1e293b !important;
          opacity: 1 !important;
          fill-opacity: 1 !important;
        }
        .vcm-dashboard .MuiChartsAxis-label,
        .vcm-dashboard .MuiChartsAxis-tickLabel,
        .vcm-dashboard .MuiChartsLegend-root text,
        .vcm-dashboard .MuiChartsLegend-root text tspan,
        .vcm-dashboard .MuiChartsLegend-root tspan {
          fill: #1E2875 !important;
          font-weight: 600 !important;
          opacity: 1 !important;
          fill-opacity: 1 !important;
        }
        .vcm-dashboard .MuiChartsGrid-line {
          stroke: #CBD5E1 !important;
          stroke-width: 1.5px !important;
          stroke-dasharray: none !important;
        }
        .vcm-dashboard .MuiToggleButtonGroup-root {
          background-color: #F1F5F9 !important;
          border-radius: 8px !important;
          padding: 3px !important;
          border: none !important;
        }
        .vcm-dashboard .custom-toggle-btn {
          background: transparent !important;
          border: none !important;
          padding: 5px 12px !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          border-radius: 6px !important;
          color: #475569 !important;
          text-transform: none !important;
          transition: background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease !important;
        }
        .vcm-dashboard .custom-toggle-btn.Mui-selected {
          background-color: #ffffff !important;
          color: #1E2875 !important;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
        }
        .vcm-dashboard .custom-toggle-btn:hover {
          background-color: rgba(255, 255, 255, 0.5) !important;
        }
        .vcm-dashboard .custom-toggle-btn.Mui-selected:hover {
          background-color: #ffffff !important;
        }
        .vcm-table {
          width: 100%;
          border-collapse: collapse;
          font-family: 'Inter', sans-serif;
          font-size: 13px;
        }
        .vcm-table th, .vcm-table td {
          padding: 10px 12px;
          text-align: left;
          border-bottom: 1px solid #E2E8F0;
        }
        .vcm-table th {
          background-color: #F8FAFC;
          color: #475569;
          font-weight: 600;
        }
        .vcm-table tr:hover {
          background-color: #F8FAFC;
        }
        .sortable-th {
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s ease;
        }
        .sortable-th:hover {
          background-color: #F1F5F9;
        }
      `}} />

      {/* SIDEBAR TRANSVERSAL (Escritorio + Drawer + AppBar Móvil con botón de filtros) */}
      <Sidebar
        mobileRightAction={
          <IconButton
            color="inherit"
            onClick={() => setMobileFiltersOpen(true)}
            sx={{ p: 0.5, color: '#ffffff' }}
          >
            <FilterIcon />
          </IconButton>
        }
      />

      {/* ----------------- CONTENIDO PRINCIPAL ----------------- */}
      <Box component="main" sx={styles.contentArea} className="vcm-dashboard">
        
        {/* Encabezado y Breadcrumbs */}
        <Header
          title="Dashboard de Vinculación con el Medio"
          subtitle="Visualización de estadísticas y métricas del departamento de Vinculación con el Medio"
          icon={<PublicIcon />}
          iconColor="#E27800"
          loading={apiLoading}
        />

        {/* ----------------- SECCIÓN 1: TARJETAS KPI (3 de Vinculación) ----------------- */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, width: '100%' }}>
          {kpiCardsData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <KpiCard
                key={kpi.key}
                id={kpi.key}
                label={kpi.title}
                value={kpi.value}
                icon={<Icon size={24} />}
                accentColor={kpi.color}
                hasData={hasRealData && kpi.value !== null}
                loading={apiLoading}
                compareText={
                  kpi.isBaseline
                    ? `Año ${cohorteDesde} es la línea base`
                    : `${kpi.isAccumulated ? 'vs Año base' : (cohorteDesde === cohorteHasta ? 'vs Año anterior' : 'vs Año más anterior')} (${kpi.compareYearLabel}): ${kpi.baseVal}`
                }
                evolution={kpi.hasEvo ? kpi.evolution : null}
                isPositive={kpi.isPositive}
              />
            );
          })}
        </Box>

        {/* ----------------- SECCIÓN 1: Total de convenios vigentes ----------------- */}
        <DashboardSection
          title="Total de convenios vigentes"
          icon={<Award size={20} />}
          iconColor="#E27800"
          isOpen={sectionsOpen.sec1}
          onToggle={() => toggleSection('sec1')}
          hasData={!isNoData}
          noDataHeight={260}
        >
          <Grid container spacing={3}>
            {/* Distribución por año */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875', mb: 1 }}>
                Distribución por año
              </Typography>
              <Box sx={{ minHeight: 260, pb: 2, width: '100%' }}>
                {getFilteredYears(datasetsSec1['Año']).length > 0 ? (
                  <BarChart
                    colors={cheerfulFiestaPalette}
                    grid={{ horizontal: true }}
                    xAxis={[{ 
                      scaleType: 'band', 
                      data: getFilteredYears(datasetsSec1['Año']).map(d => d.label)
                    }]}
                    series={[{ 
                      data: getFilteredYears(datasetsSec1['Año']).map(d => d.value),
                      label: 'Convenios Vigentes',
                      barLabel: 'value',
                      barLabelPlacement: 'outside'
                    }]}
                    yAxis={[{ 
                      max: getAxisMax(Math.max(...getFilteredYears(datasetsSec1['Año']).map(d => d.value), 0)), 
                      width: 35,
                      domainLimit: 'strict',
                      tickInterval: getAxisTicks(Math.max(...getFilteredYears(datasetsSec1['Año']).map(d => d.value), 0))
                    }]}
                    height={270}
                    margin={{ top: 30, right: 10, bottom: 65, left: 40 }}
                    slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '11px' } } }}
                  />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#64748b', fontSize: '13px', fontWeight: 500, border: '1px dashed #E2E8F0', borderRadius: '12px', bgcolor: '#F8FAFC', width: '100%' }}>
                    Sin datos disponibles
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1.5 }} />
            </Grid>

            {/* Convenios vigentes por categoría */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2, gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875' }}>
                  Convenios vigentes por categoría
                </Typography>
                
                <ToggleButtonGroup
                  value={sec1Segment}
                  exclusive
                  onChange={(e, val) => val && setSec1Segment(val)}
                  size="small"
                >
                  {['Sector', 'Tipo', 'Contraparte', 'Área vinculada'].map((lbl) => (
                    <ToggleButton key={lbl} value={lbl} className="custom-toggle-btn">
                      {lbl}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>

              <Box sx={{ minHeight: 260, pb: 2 }}>
                {sec1Segment === 'Sector' && renderDataOrPlaceholder(
                  datasetsSec1.Sector.some(d => d.value > 0),
                  <PieChart
                    colors={cheerfulFiestaPalette}
                    series={[{
                      data: datasetsSec1.Sector.filter(d => d.value > 0).map((d, i) => ({ id: i, value: d.value, label: d.label })),
                      innerRadius: 40,
                      outerRadius: 80,
                    }]}
                    height={260}
                    margin={{ top: 10, bottom: 65, left: 10, right: 10 }}
                    slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '10px' } } }}
                  />,
                  260
                )}

                {sec1Segment === 'Tipo' && renderDataOrPlaceholder(
                  datasetsSec1.Tipo.some(d => d.value > 0),
                  <BarChart
                    colors={cheerfulFiestaPalette}
                    grid={{ horizontal: true }}
                    xAxis={[{ 
                      scaleType: 'band', 
                      data: datasetsSec1.Tipo.map(d => d.label), 
                      tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                      valueFormatter: (value, context) => {
                          if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                        return value;
                      }
                    }]}
                    series={datasetsSec1.Tipo.map((d, idx) => ({
                      data: datasetsSec1.Tipo.map((x, i) => i === idx ? x.value : null),
                      label: d.label,
                      stack: 'total',
                      barLabel: 'value',
                      barLabelPlacement: 'outside',
                      valueFormatter: (value) => value === null ? null : String(value)
                    }))}
                    yAxis={[{ 
                      max: getAxisMax(Math.max(...datasetsSec1.Tipo.map(d => d.value), 0)), 
                      width: 35,
                      domainLimit: 'strict',
                      tickInterval: getAxisTicks(Math.max(...datasetsSec1.Tipo.map(d => d.value), 0))
                    }]}
                    height={250}
                    margin={{ top: 30, right: 10, bottom: 65, left: 40 }}
                    slotProps={{
                      legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '10px' } },
                      tooltip: { trigger: 'axis' }
                    }}
                  />,
                  250
                )}

                {sec1Segment === 'Contraparte' && renderDataOrPlaceholder(
                  datasetsSec1.Contraparte.some(d => d.value > 0),
                  <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid #E0E0E0', borderRadius: 4 }}>
                    <table className="vcm-table">
                      <thead>
                        <tr>
                          <th className="sortable-th" onClick={() => handleSort('sec1', 'label')}>
                            Contraparte {sortStates.sec1.key === 'label' ? (sortStates.sec1.asc ? ' ▲' : ' ▼') : ''}
                          </th>
                          <th className="sortable-th" style={{ textAlign: 'right' }} onClick={() => handleSort('sec1', 'value')}>
                            Vigentes {sortStates.sec1.key === 'value' ? (sortStates.sec1.asc ? ' ▲' : ' ▼') : ''}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSortedData(datasetsSec1.Contraparte, sortStates.sec1).map((row, idx) => (
                          <tr key={idx}>
                            <td>{row.label}</td>
                            <td style={{ textAlign: 'right' }}>{row.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>,
                  220
                )}

                {sec1Segment === 'Área vinculada' && renderDataOrPlaceholder(
                  datasetsSec1['Área vinculada'].some(d => d.value > 0),
                  <BarChart
                    colors={cheerfulFiestaPalette}
                    grid={{ horizontal: true }}
                    xAxis={[{ 
                      scaleType: 'band', 
                      data: datasetsSec1['Área vinculada'].map(d => d.label), 
                      tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                      valueFormatter: (value, context) => {
                        if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                        return value;
                      }
                    }]}
                    series={datasetsSec1['Área vinculada'].map((d, idx) => ({
                      data: datasetsSec1['Área vinculada'].map((x, i) => i === idx ? x.value : null),
                      label: d.label,
                      stack: 'total',
                      barLabel: 'value',
                      barLabelPlacement: 'outside',
                      valueFormatter: (value) => value === null ? null : String(value)
                    }))}
                    yAxis={[{ 
                      max: getAxisMax(Math.max(...datasetsSec1['Área vinculada'].map(d => d.value), 0)), 
                      width: 35,
                      domainLimit: 'strict',
                      tickInterval: getAxisTicks(Math.max(...datasetsSec1['Área vinculada'].map(d => d.value), 0))
                    }]}
                    height={250}
                    margin={{ top: 30, right: 10, bottom: 65, left: 40 }}
                    slotProps={{
                      legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '10px' } },
                      tooltip: { trigger: 'axis' }
                    }}
                  />,
                  250
                )}
              </Box>
            </Grid>
          </Grid>
        </DashboardSection>

        {/* ----------------- SECCIÓN 2: Nuevos convenios firmados ----------------- */}
        <DashboardSection
          title="Nuevos convenios firmados"
          icon={<TrendingUp size={20} />}
          iconColor="#E27800"
          isOpen={sectionsOpen.sec2}
          onToggle={() => toggleSection('sec2')}
          hasData={!isNoData}
          noDataHeight={260}
        >
          <Grid container spacing={3}>
                  {/* Distribución por año */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875', mb: 1 }}>
                      Distribución por año
                    </Typography>
                    <Box sx={{ minHeight: 260, pb: 2, width: '100%' }}>
                      {getFilteredYears(datasetsSec2['Año']).length > 0 ? (
                        <BarChart
                          colors={cheerfulFiestaPalette}
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: getFilteredYears(datasetsSec2['Año']).map(d => d.label)
                          }]}
                          series={[{ 
                            data: getFilteredYears(datasetsSec2['Año']).map(d => d.value),
                            label: 'Nuevos Convenios',
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...getFilteredYears(datasetsSec2['Año']).map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...getFilteredYears(datasetsSec2['Año']).map(d => d.value), 0))
                          }]}
                          height={270}
                          margin={{ top: 30, right: 10, bottom: 65, left: 40 }}
                          slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '11px' } } }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#64748b', fontSize: '13px', fontWeight: 500, border: '1px dashed #E2E8F0', borderRadius: '12px', bgcolor: '#F8FAFC', width: '100%' }}>
                          Sin datos disponibles
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1.5 }} />
                  </Grid>

                  {/* Nuevos convenios por categoría */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2, gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875' }}>
                        Nuevos convenios por categoría
                      </Typography>
                      
                      <ToggleButtonGroup
                        value={sec2Segment}
                        exclusive
                        onChange={(e, val) => val && setSec2Segment(val)}
                        size="small"
                      >
                        {['Sector', 'Tipo', 'Responsable'].map((lbl) => (
                          <ToggleButton key={lbl} value={lbl} className="custom-toggle-btn">
                            {lbl}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ minHeight: 260, pb: 2 }}>
                      {sec2Segment === 'Sector' && renderDataOrPlaceholder(
                        datasetsSec2.Sector.some(d => d.value > 0),
                        <BarChart
                          colors={cheerfulFiestaPalette}
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec2.Sector.map(d => d.label), 
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                              return value;
                            }
                          }]}
                          series={datasetsSec2.Sector.map((d, idx) => ({
                            data: datasetsSec2.Sector.map((x, i) => i === idx ? x.value : null),
                            label: d.label,
                            stack: 'total',
                            barLabel: 'value',
                            barLabelPlacement: 'outside',
                            valueFormatter: (value) => value === null ? null : String(value)
                          }))}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...datasetsSec2.Sector.map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...datasetsSec2.Sector.map(d => d.value), 0))
                          }]}
                          height={250}
                          margin={{ top: 30, right: 10, bottom: 65, left: 40 }}
                          slotProps={{
                            legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '10px' } },
                            tooltip: { trigger: 'axis' }
                          }}
                        />,
                        250
                      )}

                      {sec2Segment === 'Tipo' && renderDataOrPlaceholder(
                        datasetsSec2.Tipo.some(d => d.value > 0),
                        <BarChart
                          colors={cheerfulFiestaPalette}
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec2.Tipo.map(d => d.label), 
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                              return value;
                            }
                          }]}
                          series={datasetsSec2.Tipo.map((d, idx) => ({
                            data: datasetsSec2.Tipo.map((x, i) => i === idx ? x.value : null),
                            label: d.label,
                            stack: 'total',
                            barLabel: 'value',
                            barLabelPlacement: 'outside',
                            valueFormatter: (value) => value === null ? null : String(value)
                          }))}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...datasetsSec2.Tipo.map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...datasetsSec2.Tipo.map(d => d.value), 0))
                          }]}
                          height={250}
                          margin={{ top: 30, right: 10, bottom: 65, left: 40 }}
                          slotProps={{
                            legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '10px' } },
                            tooltip: { trigger: 'axis' }
                          }}
                        />,
                        250
                      )}

                      {sec2Segment === 'Responsable' && renderDataOrPlaceholder(
                        datasetsSec2.Responsable.some(d => d.value > 0),
                        <BarChart
                          colors={cheerfulFiestaPalette}
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec2.Responsable.map(d => d.label), 
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                              return value;
                            }
                          }]}
                          series={datasetsSec2.Responsable.map((d, idx) => ({
                            data: datasetsSec2.Responsable.map((x, i) => i === idx ? x.value : null),
                            label: d.label,
                            stack: 'total',
                            barLabel: 'value',
                            barLabelPlacement: 'outside',
                            valueFormatter: (value) => value === null ? null : String(value)
                          }))}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...datasetsSec2.Responsable.map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...datasetsSec2.Responsable.map(d => d.value), 0))
                          }]}
                          height={250}
                          margin={{ top: 30, right: 10, bottom: 65, left: 40 }}
                          slotProps={{
                            legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '10px' } },
                            tooltip: { trigger: 'axis' }
                          }}
                        />,
                        250
                      )}
                    </Box>
                  </Grid>
                </Grid>
        </DashboardSection>

        {/* ----------------- SECCIÓN 3: Convenios por sector ----------------- */}
        <DashboardSection
          title="Convenios por sector"
          icon={<Layers size={20} />}
          iconColor="#E27800"
          isOpen={sectionsOpen.sec3}
          onToggle={() => toggleSection('sec3')}
          hasData={!isNoData}
          noDataHeight={260}
        >
          <Grid container spacing={3} alignItems="center">
            {/* Donut Chart */}
            <Grid item xs={12} md={6}>
              <Box sx={{ minHeight: 270, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {renderDataOrPlaceholder(
                  datasetsSec3.some(d => d.vigentes > 0),
                  <PieChart
                    colors={cheerfulFiestaPalette}
                    series={[{
                      data: datasetsSec3.filter(d => d.vigentes > 0).map((d, i) => ({ id: i, value: d.vigentes, label: d.label })),
                      innerRadius: 50,
                      outerRadius: 90,
                      paddingAngle: 2,
                      cornerRadius: 4,
                    }]}
                    height={270}
                    margin={{ top: 10, bottom: 65, left: 10, right: 10 }}
                    slotProps={{ 
                      legend: { 
                        direction: 'horizontal', 
                        position: { vertical: 'bottom', horizontal: 'center' },
                        labelStyle: { fontSize: '11px', fontWeight: 500 }
                      } 
                    }}
                  >
                    <PieCenterLabel
                      primary={datasetsSec3.reduce((sum, d) => sum + (d.vigentes || 0), 0)}
                      secondary="Vigentes"
                    />
                  </PieChart>,
                  270
                )}
              </Box>
            </Grid>

            {/* Data Table */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {renderDataOrPlaceholder(
                datasetsSec3.some(d => (d.vigentes > 0 || d.cerrados > 0 || d.total > 0)),
                <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #E0E0E0', borderRadius: 4, width: '100%' }}>
                  <table className="vcm-table">
                    <thead>
                      <tr>
                        <th>Sector</th>
                        <th style={{ textAlign: 'right', color: '#E27800' }}>Vigentes</th>
                        <th style={{ textAlign: 'right', color: '#6B7280' }}>Cerrados</th>
                        <th style={{ textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datasetsSec3.map((row, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{row.label}</td>
                          <td style={{ textAlign: 'right', color: '#E27800', fontWeight: 600 }}>{row.vigentes}</td>
                          <td style={{ textAlign: 'right', color: '#6B7280' }}>{row.cerrados}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>,
                240
              )}
            </Grid>
          </Grid>
        </DashboardSection>

        {/* ----------------- SECCIÓN 4: Actividades VcM ----------------- */}
        <DashboardSection
          title="Actividades VcM"
          icon={<CalendarLucide size={20} />}
          iconColor="#E27800"
          isOpen={sectionsOpen.sec4}
          onToggle={() => toggleSection('sec4')}
          hasData={!isNoData}
          noDataHeight={260}
        >
          <Grid container spacing={3}>
                  {/* Distribución por año */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875', mb: 1 }}>
                      Distribución por año
                    </Typography>
                    <Box sx={{ minHeight: 260, pb: 2, width: '100%' }}>
                      {getFilteredYears(datasetsSec4['Año']).length > 0 ? (
                        <LineChart
                          grid={{ horizontal: true }}
                          xAxis={[{ scaleType: 'band', data: getFilteredYears(datasetsSec4['Año']).map(d => d.label) }]}
                          series={[{ 
                            data: getFilteredYears(datasetsSec4['Año']).map(d => d.value),
                            label: 'Actividades VcM',
                            color: '#4CAF50',
                            showMark: true
                          }]}
                          yAxis={[{ 
                            min: 0,
                            max: getAxisMax(Math.max(...getFilteredYears(datasetsSec4['Año']).map(d => d.value), 0)), 
                            width: 35,
                            tickInterval: getAxisTicks(Math.max(...getFilteredYears(datasetsSec4['Año']).map(d => d.value), 0))
                          }]}
                          height={270}
                          margin={{ top: 30, right: 10, bottom: 65, left: 40 }}
                          slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '11px' } } }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#64748b', fontSize: '13px', fontWeight: 500, border: '1px dashed #E2E8F0', borderRadius: '12px', bgcolor: '#F8FAFC', width: '100%' }}>
                          Sin datos disponibles
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1.5 }} />
                  </Grid>

                  {/* Actividades por categoría */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2, gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875' }}>
                        Actividades por categoría
                      </Typography>
                      
                      <ToggleButtonGroup
                        value={sec4Segment}
                        exclusive
                        onChange={(e, val) => val && setSec4Segment(val)}
                        size="small"
                      >
                        {['Línea VcM', 'Modalidad', 'Tipo de Actividad', 'Comuna'].map((lbl) => (
                          <ToggleButton key={lbl} value={lbl} className="custom-toggle-btn">
                            {lbl}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ minHeight: 260 }}>
                      {sec4Segment === 'Línea VcM' && renderDataOrPlaceholder(
                        datasetsSec4['Línea VcM'].some(d => d.value > 0),
                        <BarChart
                          colors={cheerfulFiestaPalette}
                          grid={{ horizontal: false, vertical: false }}
                          xAxis={[{ max: Math.max(...datasetsSec4['Línea VcM'].map(d => d.value), 0) * 1.15 + 2 }]}
                          yAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec4['Línea VcM'].map(d => d.label), 
                            width: isMobile ? 55 : 120, 
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 9) {
                                  return value.substring(0, 6) + '...';
                              }
                              return value;
                            }
                          }]}
                          series={datasetsSec4['Línea VcM'].map((d, idx) => ({
                            data: datasetsSec4['Línea VcM'].map((x, i) => i === idx ? x.value : null),
                            label: d.label,
                            stack: 'total',
                            barLabel: 'value',
                            barLabelPlacement: 'outside',
                            valueFormatter: (value) => value === null ? null : String(value)
                          }))}
                          layout="horizontal"
                          height={270}
                          margin={{ top: 10, right: 50, bottom: 70, left: isMobile ? 65 : 130 }}
                          slotProps={{
                            legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '10px' } },
                            tooltip: { trigger: 'axis' }
                          }}
                        />,
                        270
                      )}

                      {sec4Segment === 'Modalidad' && renderDataOrPlaceholder(
                        datasetsSec4.Modalidad.some(d => d.value > 0),
                        <BarChart
                          colors={cheerfulFiestaPalette}
                          grid={{ horizontal: false, vertical: false }}
                          xAxis={[{ max: Math.max(...datasetsSec4.Modalidad.map(d => d.value), 0) * 1.15 + 2 }]}
                          yAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec4.Modalidad.map(d => d.label), 
                            width: isMobile ? 55 : 110, 
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 9) {
                                return value.substring(0, 6) + '...';
                              }
                              return value;
                            }
                          }]}
                          series={datasetsSec4.Modalidad.map((d, idx) => ({
                            data: datasetsSec4.Modalidad.map((x, i) => i === idx ? x.value : null),
                            label: d.label,
                            stack: 'total',
                            barLabel: 'value',
                            barLabelPlacement: 'outside',
                            valueFormatter: (value) => value === null ? null : String(value)
                          }))}
                          layout="horizontal"
                          height={270}
                          margin={{ top: 10, right: 50, bottom: 70, left: isMobile ? 65 : 120 }}
                          slotProps={{
                            legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '10px' } },
                            tooltip: { trigger: 'axis' }
                          }}
                        />,
                        270
                      )}

                      {sec4Segment === 'Tipo de Actividad' && renderDataOrPlaceholder(
                        datasetsSec4['Tipo de Actividad'].some(d => d.months?.some(m => m > 0)),
                        <div style={{ overflowX: 'auto', border: '1px solid #E0E0E0', borderRadius: 4, padding: '12px' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                              <tr style={{ background: '#F8FAFC' }}>
                                <th style={{ padding: '8px', textAlign: 'left', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E2E8F0' }}>
                                  Actividad / Meses
                                </th>
                                {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((m) => (
                                  <th key={m} style={{ width: '32px', padding: '8px', textAlign: 'center', fontWeight: 600, color: '#475569', borderBottom: '1px solid #E2E8F0' }}>
                                    {m}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {datasetsSec4['Tipo de Actividad'].map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                  <td style={{ padding: '8px', fontWeight: 500, color: '#1E293B' }}>
                                    {row.label}
                                  </td>
                                  {row.months.map((v, mIdx) => {
                                    const cellBg = v === 0 ? '#F8FAFC' : v === 1 ? '#FFE8CC' : '#E27800';
                                    const cellColor = v === 0 ? '#94A3B8' : v === 1 ? '#C25E00' : '#FFFFFF';
                                    return (
                                      <td
                                        key={mIdx}
                                        style={{
                                          textAlign: 'center',
                                          padding: '4px',
                                        }}
                                      >
                                        <div
                                          style={{
                                            background: cellBg,
                                            color: cellColor,
                                            fontWeight: 600,
                                            borderRadius: '4px',
                                            height: '24px',
                                            lineHeight: '24px',
                                            fontSize: '11px',
                                          }}
                                        >
                                          {v > 0 ? v : ''}
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>,
                        260
                      )}

                      {sec4Segment === 'Comuna' && renderDataOrPlaceholder(
                        datasetsSec4.Comuna?.some(d => d.value > 0),
                        <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #E0E0E0', borderRadius: 4, width: '100%' }}>
                          <table className="vcm-table">
                            <thead>
                              <tr>
                                <th className="sortable-th" onClick={() => handleSort('sec4', 'label')}>
                                  Comuna {sortStates.sec4.key === 'label' ? (sortStates.sec4.asc ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th className="sortable-th" style={{ textAlign: 'right' }} onClick={() => handleSort('sec4', 'value')}>
                                  Actividades {sortStates.sec4.key === 'value' ? (sortStates.sec4.asc ? ' ▲' : ' ▼') : ''}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {getSortedData(datasetsSec4.Comuna, sortStates.sec4).map((row, idx) => (
                                <tr key={idx}>
                                  <td>{row.label}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>,
                        240
                      )}
                    </Box>
                  </Grid>
                </Grid>
        </DashboardSection>

        {/* ----------------- SECCIÓN 5: Participantes en actividades VcM ----------------- */}
        <DashboardSection
          title="Participantes en actividades VcM"
          icon={<Users size={20} />}
          iconColor="#E27800"
          isOpen={sectionsOpen.sec5}
          onToggle={() => toggleSection('sec5')}
          hasData={!isNoData}
          noDataHeight={260}
          bodySx={{ pb: '35px' }}
        >
          <Grid container spacing={3}>
                  {/* Distribución por año */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875', mb: 1 }}>
                      Distribución por año (Interno vs Externo)
                    </Typography>
                    <Box sx={{ minHeight: 260, pb: 2, width: '100%' }}>
                      {getFilteredYears(datasetsSec5['Año']).length > 0 ? (
                        <BarChart
                          colors={cheerfulFiestaPalette}
                          grid={{ horizontal: true }}
                          xAxis={[{ scaleType: 'band', data: getFilteredYears(datasetsSec5['Año']).map(d => d.label) }]}
                          series={[
                            { data: getFilteredYears(datasetsSec5['Año']).map(d => d.interno), label: 'Interno', stack: 'total' },
                            { data: getFilteredYears(datasetsSec5['Año']).map(d => d.externo), label: 'Externo', stack: 'total' }
                          ]}
                          yAxis={[{ 
                            min: 0,
                            max: getAxisMax(Math.max(...getFilteredYears(datasetsSec5['Año']).map(d => d.interno + d.externo), 0)), 
                            width: 45,
                            tickInterval: getAxisTicks(Math.max(...getFilteredYears(datasetsSec5['Año']).map(d => d.interno + d.externo), 0))
                          }]}
                          height={270}
                          margin={{ top: 30, right: 10, bottom: 65, left: 55 }}
                          slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '11px' } } }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#64748b', fontSize: '13px', fontWeight: 500, border: '1px dashed #E2E8F0', borderRadius: '12px', bgcolor: '#F8FAFC', width: '100%' }}>
                          Sin datos disponibles
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1.5 }} />
                  </Grid>

                  {/* Participantes por categoría */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2, gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875' }}>
                        Participantes por categoría
                      </Typography>
                      
                      <ToggleButtonGroup
                        value={sec5Segment}
                        exclusive
                        onChange={(e, val) => val && setSec5Segment(val)}
                        size="small"
                      >
                        {['Público objetivo', 'Sexo', 'Institución', 'Comuna'].map((lbl) => (
                          <ToggleButton key={lbl} value={lbl} className="custom-toggle-btn">
                            {lbl}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ minHeight: 260, pb: 2 }}>
                      {sec5Segment === 'Público objetivo' && renderDataOrPlaceholder(
                        datasetsSec5['Público objetivo']?.some(d => d.value > 0),
                        <BarChart
                          colors={cheerfulFiestaPalette}
                          grid={{ horizontal: false, vertical: false }}
                          xAxis={[{ max: Math.max(...datasetsSec5['Público objetivo'].map(d => d.value), 0) * 1.15 + 10 }]}
                          yAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec5['Público objetivo'].map(d => d.label), 
                            width: isMobile ? 55 : 120, 
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 9) {
                                  return value.substring(0, 6) + '...';
                              }
                              return value;
                            }
                          }]}
                          series={datasetsSec5['Público objetivo'].map((d, idx) => ({
                            data: datasetsSec5['Público objetivo'].map((x, i) => i === idx ? x.value : null),
                            label: d.label,
                            stack: 'total',
                            barLabel: 'value',
                            barLabelPlacement: 'outside',
                            valueFormatter: (value) => value === null ? null : String(value)
                          }))}
                          layout="horizontal"
                          height={380}
                          margin={{ top: 10, right: 50, bottom: 70, left: isMobile ? 65 : 130 }}
                          slotProps={{
                            legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '10px' } },
                            tooltip: { trigger: 'axis' }
                          }}
                        />,
                        380
                      )}
                      {sec5Segment === 'Sexo' && renderDataOrPlaceholder(
                        datasetsSec5.Sexo?.some(d => d.value > 0),
                        <Box sx={{ minHeight: 270, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          <PieChart
                            colors={cheerfulFiestaPalette}
                            series={[{
                              data: datasetsSec5.Sexo.map((d, i) => ({ id: i, value: d.value, label: d.label })),
                              innerRadius: 50,
                              outerRadius: 90,
                              paddingAngle: 2,
                              cornerRadius: 4,
                            }]}
                            height={270}
                            margin={{ top: 10, bottom: 65, left: 10, right: 10 }}
                            slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '11px' } } }}
                          >
                            <PieCenterLabel
                              primary={datasetsSec5.Sexo.reduce((sum, d) => sum + (d.value || 0), 0)}
                              secondary="TOTAL"
                            />
                          </PieChart>
                        </Box>,
                        270
                      )}

                      {sec5Segment === 'Institución' && renderDataOrPlaceholder(
                        datasetsSec5['Institución']?.some(d => d.value > 0),
                        <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #E0E0E0', borderRadius: 4, width: '100%' }}>
                          <table className="vcm-table">
                            <thead>
                              <tr>
                                <th className="sortable-th" onClick={() => handleSort('sec5', 'label')}>
                                  Institución {sortStates.sec5.key === 'label' ? (sortStates.sec5.asc ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th className="sortable-th" style={{ textAlign: 'right' }} onClick={() => handleSort('sec5', 'value')}>
                                  Participantes {sortStates.sec5.key === 'value' ? (sortStates.sec5.asc ? ' ▲' : ' ▼') : ''}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {getSortedData(datasetsSec5['Institución'], sortStates.sec5).map((row, idx) => (
                                <tr key={idx}>
                                  <td>{row.label}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>,
                        240
                      )}

                      {sec5Segment === 'Comuna' && renderDataOrPlaceholder(
                        datasetsSec5.Comuna?.some(d => d.value > 0),
                        <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #E0E0E0', borderRadius: 4, width: '100%' }}>
                          <table className="vcm-table">
                            <thead>
                              <tr>
                                <th className="sortable-th" onClick={() => handleSort('sec5', 'label')}>
                                  Comuna {sortStates.sec5.key === 'label' ? (sortStates.sec5.asc ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th className="sortable-th" style={{ textAlign: 'right' }} onClick={() => handleSort('sec5', 'value')}>
                                  Participantes {sortStates.sec5.key === 'value' ? (sortStates.sec5.asc ? ' ▲' : ' ▼') : ''}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {getSortedData(datasetsSec5.Comuna, sortStates.sec5).map((row, idx) => (
                                <tr key={idx}>
                                  <td>{row.label}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>,
                        240
                      )}
                    </Box>
                  </Grid>
                </Grid>
        </DashboardSection>

        {/* ----------------- SECCIÓN 6: Articulaciones TP ejecutadas ----------------- */}
        <DashboardSection
          title="Articulaciones TP ejecutadas"
          icon={<GraduationCap size={20} />}
          iconColor="#E27800"
          isOpen={sectionsOpen.sec6}
          onToggle={() => toggleSection('sec6')}
          hasData={!isNoData}
          noDataHeight={260}
        >
          <Grid container spacing={3}>
                  {/* Distribución por año */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875', mb: 1 }}>
                      Distribución por año
                    </Typography>
                    <Box sx={{ minHeight: 260, pb: 2, width: '100%' }}>
                      {getFilteredYears(datasetsSec6['Año']).length > 0 ? (
                        <LineChart
                          grid={{ horizontal: true }}
                          xAxis={[{ scaleType: 'band', data: getFilteredYears(datasetsSec6['Año']).map(d => d.label) }]}
                          series={[{ 
                            data: getFilteredYears(datasetsSec6['Año']).map(d => d.value),
                            label: 'Articulaciones TP',
                            color: '#E27800',
                            showMark: true
                          }]}
                          yAxis={[{ 
                            min: 0,
                            max: getAxisMax(Math.max(...getFilteredYears(datasetsSec6['Año']).map(d => d.value), 0)), 
                            width: 35,
                            tickInterval: getAxisTicks(Math.max(...getFilteredYears(datasetsSec6['Año']).map(d => d.value), 0))
                          }]}
                          height={270}
                          margin={{ top: 30, right: 10, bottom: 65, left: 40 }}
                          slotProps={{ legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '11px' } } }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#64748b', fontSize: '13px', fontWeight: 500, border: '1px dashed #E2E8F0', borderRadius: '12px', bgcolor: '#F8FAFC', width: '100%' }}>
                          Sin datos disponibles
                        </Box>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 1.5 }} />
                  </Grid>

                  {/* Articulaciones por categoría */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2, gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875' }}>
                        Articulaciones por categoría
                      </Typography>
                      
                      <ToggleButtonGroup
                        value={sec6Segment}
                        exclusive
                        onChange={(e, val) => val && setSec6Segment(val)}
                        size="small"
                      >
                        {['Plataforma', 'Tipo', 'Especialidad', 'Colegio'].map((lbl) => (
                          <ToggleButton key={lbl} value={lbl} className="custom-toggle-btn">
                            {lbl}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ minHeight: 260 }}>
                      {sec6Segment === 'Plataforma' && renderDataOrPlaceholder(
                        datasetsSec6.Plataforma?.some(d => d.value > 0),
                        <BarChart
                          colors={cheerfulFiestaPalette}
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec6.Plataforma.map(d => wrapText(d.label, 12)), 
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                              return value;
                            }
                          }]}
                          series={datasetsSec6.Plataforma.map((d, idx) => ({
                            data: datasetsSec6.Plataforma.map((x, i) => i === idx ? x.value : null),
                            label: d.label,
                            stack: 'total',
                            barLabel: 'value',
                            barLabelPlacement: 'outside',
                            valueFormatter: (value) => value === null ? null : String(value)
                          }))}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...datasetsSec6.Plataforma.map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...datasetsSec6.Plataforma.map(d => d.value), 0))
                          }]}
                          height={270}
                          margin={{ top: 30, right: 10, bottom: 75, left: 40 }}
                          slotProps={{
                            legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '10px' } },
                            tooltip: { trigger: 'axis' }
                          }}
                        />,
                        270
                      )}

                      {sec6Segment === 'Tipo' && renderDataOrPlaceholder(
                        datasetsSec6.Tipo?.some(d => d.value > 0),
                        <BarChart
                          colors={cheerfulFiestaPalette}
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec6.Tipo.map(d => wrapText(d.label, 12)), 
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                              return value;
                            }
                          }]}
                          series={datasetsSec6.Tipo.map((d, idx) => ({
                            data: datasetsSec6.Tipo.map((x, i) => i === idx ? x.value : null),
                            label: d.label,
                            stack: 'total',
                            barLabel: 'value',
                            barLabelPlacement: 'outside',
                            valueFormatter: (value) => value === null ? null : String(value)
                          }))}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...datasetsSec6.Tipo.map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...datasetsSec6.Tipo.map(d => d.value), 0))
                          }]}
                          height={270}
                          margin={{ top: 30, right: 10, bottom: 75, left: 40 }}
                          slotProps={{
                            legend: { direction: 'horizontal', position: { vertical: 'bottom', horizontal: 'center' }, labelStyle: { fontSize: '10px' } },
                            tooltip: { trigger: 'axis' }
                          }}
                        />,
                        270
                      )}

                      {sec6Segment === 'Especialidad' && renderDataOrPlaceholder(
                        datasetsSec6.Especialidad?.some(d => d.value > 0),
                        <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #E0E0E0', borderRadius: 4, width: '100%' }}>
                          <table className="vcm-table">
                            <thead>
                              <tr>
                                <th className="sortable-th" onClick={() => handleSort('sec6', 'label')}>
                                  Especialidad {sortStates.sec6.key === 'label' ? (sortStates.sec6.asc ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th className="sortable-th" style={{ textAlign: 'right' }} onClick={() => handleSort('sec6', 'value')}>
                                  Articulaciones {sortStates.sec6.key === 'value' ? (sortStates.sec6.asc ? ' ▲' : ' ▼') : ''}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {getSortedData(datasetsSec6.Especialidad, sortStates.sec6).map((row, idx) => (
                                <tr key={idx}>
                                  <td>{row.label}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>,
                        240
                      )}

                      {sec6Segment === 'Colegio' && renderDataOrPlaceholder(
                        datasetsSec6.Colegio?.some(d => d.value > 0),
                        <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #E0E0E0', borderRadius: 4, width: '100%' }}>
                          <table className="vcm-table">
                            <thead>
                              <tr>
                                <th className="sortable-th" onClick={() => handleSort('sec6', 'label')}>
                                  Colegio {sortStates.sec6.key === 'label' ? (sortStates.sec6.asc ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th className="sortable-th" style={{ textAlign: 'right' }} onClick={() => handleSort('sec6', 'value')}>
                                  Articulaciones {sortStates.sec6.key === 'value' ? (sortStates.sec6.asc ? ' ▲' : ' ▼') : ''}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {getSortedData(datasetsSec6.Colegio, sortStates.sec6).map((row, idx) => (
                                <tr key={idx}>
                                  <td>{row.label}</td>
                                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>,
                        240
                      )}
                    </Box>
                  </Grid>
                </Grid>
        </DashboardSection>
      </Box>

      {/* ----------------- SIDEBAR DE FILTROS MODULAR ----------------- */}
      <DashboardFilterSidebar
        title="Filtros VcM"
        icon={<FilterIcon sx={{ color: '#E27800', fontSize: 18 }} />}
        iconColor="#E27800"
        collapsed={filtersCollapsed}
        onToggleCollapse={() => setFiltersCollapsed(!filtersCollapsed)}
        mobileOpen={mobileFiltersOpen}
        onCloseMobile={() => setMobileFiltersOpen(false)}
        hasData={hasRealData}
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
              value={[parseInt(cohorteDesde), parseInt(cohorteHasta)]}
              onChange={(e, val) => {
                setCohorteDesde(String(val[0]));
                setCohorteHasta(String(val[1]));
              }}
              min={minYear}
              max={maxYear}
              step={1}
              marks={availableYears.length ? availableYears.map(y => ({ value: y, label: String(y) })) : [
                { value: 2023, label: '2023' },
                { value: 2024, label: '2024' },
                { value: 2025, label: '2025' },
                { value: 2026, label: '2026' }
              ]}
              valueLabelDisplay="auto"
              sx={styles.ageSliderStyle}
            />
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 1.5, fontWeight: 600, color: '#1E2875', fontSize: '13px' }}>
              {cohorteDesde === cohorteHasta ? cohorteDesde : `${cohorteDesde} — ${cohorteHasta}`}
            </Typography>

            {/* Checkbox para Periodo Acumulado */}
            {cohorteDesde !== cohorteHasta && (
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

        {/* Accordions de filtros (solo si hay datos) */}
        {hasRealData && (
          <>
            {/* Convenios */}
            {(sectorsList.length > 0 || dynamicTipos.length > 0 || dynamicAreas.length > 0) && (
              <Accordion 
                expanded={openConvenios} 
                onChange={(e, expanded) => setOpenConvenios(expanded)}
                sx={{ boxShadow: 'none', border: 'none', mt: -0.5, margin: '0 !important', '&:before': { display: 'none' } }}
              >
                <AccordionSummary sx={{ p: 0, minHeight: '0 !important', margin: '0 !important', '& .MuiAccordionSummary-content': { my: 1, margin: '0 !important', display: 'flex', alignItems: 'center', gap: 1 } }}>
                  <ChevronDown style={{ transform: openConvenios ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms', color: '#475569' }} size={16} />
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'none', letterSpacing: '0.06em' }}>
                    Convenios
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {sectorsList.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9E9E9E', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Sector
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {sectorsList.map((chip) => (
                          <FilterChip
                            key={chip.val}
                            label={chip.label}
                            selected={selectedSectores.includes(chip.val)}
                            onClick={() => toggleChip(selectedSectores, setSelectedSectores, chip.val)}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {dynamicTipos.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9E9E9E', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Tipo de convenio
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {dynamicTipos.map((chip) => (
                          <FilterChip
                            key={chip.val}
                            label={chip.label}
                            selected={selectedTiposConvenio.includes(chip.val)}
                            onClick={() => toggleChip(selectedTiposConvenio, setSelectedTiposConvenio, chip.val)}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {dynamicAreas.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9E9E9E', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Área vinculada
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {dynamicAreas.map((chip) => (
                          <FilterChip
                            key={chip.val}
                            label={chip.label}
                            selected={selectedAreas.includes(chip.val)}
                            onClick={() => toggleChip(selectedAreas, setSelectedAreas, chip.val)}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            )}

            {/* Actividades */}
            {(dynamicLineas.length > 0 || modalidadesList.length > 0) && (
              <Accordion 
                expanded={openActividades} 
                onChange={(e, expanded) => setOpenActividades(expanded)}
                sx={{ boxShadow: 'none', border: 'none', margin: '0 !important', '&:before': { display: 'none' } }}
              >
                <AccordionSummary sx={{ p: 0, minHeight: '0 !important', margin: '0 !important', '& .MuiAccordionSummary-content': { my: 1, margin: '0 !important', display: 'flex', alignItems: 'center', gap: 1 } }}>
                  <ChevronDown style={{ transform: openActividades ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms', color: '#475569' }} size={16} />
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'none', letterSpacing: '0.06em' }}>
                    Actividades
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {dynamicLineas.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9E9E9E', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Línea VcM
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {dynamicLineas.map((chip) => (
                          <FilterChip
                            key={chip.val}
                            label={chip.label}
                            selected={selectedLineas.includes(chip.val)}
                            onClick={() => toggleChip(selectedLineas, setSelectedLineas, chip.val)}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {modalidadesList.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9E9E9E', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Modalidad
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {modalidadesList.map((chip) => (
                          <FilterChip
                            key={chip.val}
                            label={chip.label}
                            selected={selectedModalidades.includes(chip.val)}
                            onClick={() => toggleChip(selectedModalidades, setSelectedModalidades, chip.val)}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            )}

            {/* Articulación TP */}
            {(dynamicPlataformas.length > 0 || dynamicTiposArticulacion.length > 0) && (
              <Accordion 
                expanded={openArticulacion} 
                onChange={(e, expanded) => setOpenArticulacion(expanded)}
                sx={{ boxShadow: 'none', border: 'none', margin: '0 !important', '&:before': { display: 'none' } }}
              >
                <AccordionSummary sx={{ p: 0, minHeight: '0 !important', margin: '0 !important', '& .MuiAccordionSummary-content': { my: 1, margin: '0 !important', display: 'flex', alignItems: 'center', gap: 1 } }}>
                  <ChevronDown style={{ transform: openArticulacion ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms', color: '#475569' }} size={16} />
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'none', letterSpacing: '0.06em' }}>
                    Articulación TP
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {dynamicPlataformas.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9E9E9E', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Plataforma Foco
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {dynamicPlataformas.map((chip) => (
                          <FilterChip
                            key={chip.val}
                            label={chip.label}
                            selected={selectedPlataformas.includes(chip.val)}
                            onClick={() => toggleChip(selectedPlataformas, setSelectedPlataformas, chip.val)}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {dynamicTiposArticulacion.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#9E9E9E', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Tipo de articulación
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {dynamicTiposArticulacion.map((chip) => (
                          <FilterChip
                            key={chip.val}
                            label={chip.label}
                            selected={selectedTiposArticulacion.includes(chip.val)}
                            onClick={() => toggleChip(selectedTiposArticulacion, setSelectedTiposArticulacion, chip.val)}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            )}
          </>
        )}
      </DashboardFilterSidebar>
      </Box>
    </ThemeProvider>
  );
};
