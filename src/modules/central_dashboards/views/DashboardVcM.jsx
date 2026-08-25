import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../auth';
import { styles } from './DashboardVcM.styles';
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
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Adjust as TargetIcon,
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
    if (val <= 50) return Math.ceil(val / 10) * 10;
    if (val <= 200) return Math.ceil(val / 40) * 40;
    if (val <= 500) return Math.ceil(val / 100) * 100;
    if (val <= 1500) return Math.ceil(val / 500) * 500;
    if (val <= 4000) return Math.ceil(val / 1000) * 1000;
    return Math.ceil(val / 2000) * 2000;
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
    filteredProgramasData,
    ofertaChartData,
    dictadosSummaryData,
    effectiveDictadosSeries,
    effectiveEjecucionSeries,
    kpiCardsData,
    uniqueParticipantsData,
    filteredUniqueParticipantsLocal,
    uniqueParticipantsAgeDist,
    recurrenceFreqDist,
    uniqueParticipantsTotal,
    recurrenciaStats,
    apiFilters,
    apiPerfilMap,
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

  const sectorsList = apiFilters?.filters?.sectores?.length
    ? apiFilters.filters.sectores.map(s => {
        let val = s.toLowerCase();
        if (val.includes('público') || val.includes('publico')) val = 'publico';
        return { label: s, val };
      })
    : [
        { label: 'Público', val: 'publico' },
        { label: 'Privado', val: 'privado' },
        { label: 'ONG / Fundación', val: 'ong' },
        { label: 'Academia', val: 'academia' },
        { label: 'Educación TP', val: 'edtp' }
      ];

  const modalidadesList = apiFilters?.filters?.modalidades?.length
    ? apiFilters.filters.modalidades.map(m => {
        let val = m.toLowerCase();
        if (val.includes('híbrida') || val.includes('hibrida')) val = 'hibrida';
        return { label: m, val };
      })
    : [
        { label: 'Presencial', val: 'presencial' },
        { label: 'Online', val: 'online' },
        { label: 'Híbrida', val: 'hibrida' }
      ];

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

  // NAV NAVEGACIÃ“N IZQUIERDA
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
            const isSelected = item.text === 'Dashboards'; // Highlight dashboards since we are in a dashboard
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

  const filtersContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#FFFFFF' }}>
      {/* Encabezado Filtros */}
      <Box sx={styles.filtersHeader}>
        <FilterIcon sx={{ color: '#E27800' }} />
        <Typography variant="h6" sx={styles.filtersTitle}>
          Filtros VcM
        </Typography>
        <IconButton 
          onClick={() => setMobileFiltersOpen(false)} 
          sx={{ display: { xs: 'flex', md: 'none' }, ml: 'auto' }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      <Divider />

      {/* Scroll de Filtros */}
      <Box sx={styles.filtersScrollContent}>
        {/* Filtro Rango de Años (Slider de dos perillas) */}
        <Box sx={{ ...styles.filterSection, pt: 2.5 }}>
          <Typography variant="subtitle2" sx={styles.filterSectionTitle}>
            Año
          </Typography>
          <Box sx={{ px: 1, mt: 1 }}>
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
            {/* Indicador del rango seleccionado */}
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 1.5, fontWeight: 600, color: '#1E2875', fontSize: '13px' }}>
              {cohorteDesde === cohorteHasta ? cohorteDesde : `${cohorteDesde} - ${cohorteHasta}`}
            </Typography>
          </Box>
        </Box>

        {/* Accordion: Convenios (default expanded) */}
        <Accordion defaultExpanded sx={{ boxShadow: 'none', border: 'none', mt: -1.5, '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0, minHeight: 0, '& .MuiAccordionSummary-content': { my: 1 } }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'none', letterSpacing: '0.06em' }}>
              Convenios
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            
            {/* Sector */}
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

            {/* Tipo de convenio */}
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

            {/* Estado */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#9E9E9E', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Estado
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {[
                  { label: 'Activo', val: 'activo' },
                  { label: 'Cerrado', val: 'cerrado' },
                  { label: 'En renovación', val: 'renovacion' }
                ].map((chip) => (
                  <FilterChip
                    key={chip.val}
                    label={chip.label}
                    selected={selectedEstados.includes(chip.val)}
                    onClick={() => toggleChip(selectedEstados, setSelectedEstados, chip.val)}
                  />
                ))}
              </Box>
            </Box>

          </AccordionDetails>
        </Accordion>

        {/* Accordion: Actividades (default collapsed) */}
        <Accordion sx={{ boxShadow: 'none', border: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0, minHeight: 0, '& .MuiAccordionSummary-content': { my: 1 } }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'none', letterSpacing: '0.06em' }}>
              Actividades
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Línea VcM */}
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

            {/* Modalidad */}
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

          </AccordionDetails>
        </Accordion>

        {/* Accordion: Articulaciones TP (default collapsed) */}
        <Accordion sx={{ boxShadow: 'none', border: 'none', '&:before': { display: 'none' } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ p: 0, minHeight: 0, '& .MuiAccordionSummary-content': { my: 1 } }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#475569', textTransform: 'none', letterSpacing: '0.06em' }}>
              Articulaciones TP
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>

            {/* Plataforma */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#9E9E9E', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Plataforma
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

            {/* Tipo articulación */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#9E9E9E', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Tipo articulación
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

          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Footer Filtros */}
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
        .collapsible-card {
          background: #ffffff;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          margin-bottom: 12px;
          overflow: hidden;
          transition: all 0.2s ease-in-out;
        }
        .collapsible-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          border-color: #CBD5E1;
        }
        .collapsible-header {
          background: #F8FAFC;
          transition: background 0.2s ease;
        }
        .collapsible-header:hover {
          background: #F1F5F9;
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
        /* Forzar que las líneas del grid y de los ejes sean lisas y continuas */
        .collapsible-body {
          padding: 24px 30px !important;
        }
      `}} />

      {/* Navigation Bars */}
      <AppBar position="fixed" sx={styles.mobileAppBar}>
        <Toolbar sx={styles.mobileToolbar}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0.5, flexGrow: 1 }}>
            PIADI - VcM
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => setMobileFiltersOpen(true)}
            sx={{ ml: 'auto' }}
          >
            <FilterIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar fijo para Desktop */}
      <Box component="nav" sx={styles.sidebar}>
        {sidebarContent}
      </Box>

      {/* Sidebar Drawer temporal para MÃ³vil */}
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

      {/* ----------------- CONTENIDO PRINCIPAL ----------------- */}
      <Box component="main" sx={styles.contentArea} className="vcm-dashboard">
        
        {/* Encabezado y Breadcrumbs */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={styles.breadcrumbsContainer}>
            <Typography 
              variant="body1" 
              onClick={() => navigate('/')}
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Inicio
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7 }} />
            <Typography 
              variant="body1" 
              onClick={() => navigate('/dashboard')}
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              Central de Dashboards
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7 }} />
            <Typography variant="body1" sx={{ color: '#1E2875', fontWeight: 600 }}>
              Vinculación con el medio
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, width: '100%' }}>
            <Box sx={styles.panelHeader}>
              <Box sx={styles.panelIconContainer}>
                <PublicIcon />
              </Box>
              <Box>
                 <Typography variant="h5" sx={styles.panelTitle}>
                  Dashboard de Vinculación con el Medio
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Visualización de estadísticas y métricas del departamento de Vinculación con el Medio
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>



        {/* ----------------- SECCIÓN 1: TARJETAS KPI (3 de Vinculación) ----------------- */}
        <Grid container spacing={3}>
          {kpiCardsData.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Grid item xs={12} sm={6} md={4} key={kpi.key} sx={{ display: 'flex' }}>
                <Card 
                  id={kpi.key} 
                  sx={{ 
                    p: 2.5, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    height: '100%',
                    minHeight: 120,
                    borderLeft: `4px solid ${kpi.color}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 16px -4px ${kpi.color}1f`,
                      borderColor: kpi.color
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="caption" sx={{ ...styles.kpiCardHeaderLabel, color: kpi.color }}>
                        {kpi.title}
                      </Typography>
                      <Typography variant="h4" sx={styles.kpiCardHeaderVal}>
                        {apiLoading ? '...' : (isNoData ? '-' : kpi.value)}
                      </Typography>
                    </Box>
                    <Box sx={styles.kpiCardHeaderIcon(kpi.color)}>
                      <Icon size={24} />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    {kpi.isBaseline ? (
                      <Typography variant="caption" sx={styles.kpiCardFooterLabel}>
                        Año {cohorteDesde} es la línea base
                      </Typography>
                    ) : (
                      <Typography variant="caption" sx={styles.kpiCardFooterLabel}>
                        vs Año anterior ({kpi.compareYearLabel}): {isNoData ? '-' : kpi.baseVal} {' '}
                        {kpi.hasEvo && (
                          <Box component="span" sx={styles.kpiEvoBadge(isNoData ? true : kpi.isPositive)}>
                            {isNoData ? '→' : (kpi.isPositive ? '↑' : '↓')} {isNoData ? '-' : kpi.evolution}
                          </Box>
                        )}
                      </Typography>
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* ----------------- SECCIÓN 1: Total de convenios vigentes ----------------- */}
        <div className="collapsible-card" style={{ marginTop: '12px' }}>
          <div className="collapsible-header" onClick={() => toggleSection('sec1')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px 20px' }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 600, color: '#1E2875', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={20} style={{ color: '#E27800' }} />
              Total de convenios vigentes
            </h2>
            <ChevronDown style={{ transform: sectionsOpen.sec1 ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms', color: '#1E2875' }} size={18} />
          </div>
          {sectionsOpen.sec1 && (
            <div className="collapsible-body" style={{ padding: '20px', borderTop: '1px solid #E0E0E0' }}>
              {isNoData ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#64748b', fontSize: '13px', fontWeight: 500, border: '1px dashed #E2E8F0', borderRadius: '12px', bgcolor: '#F8FAFC', width: '100%' }}>
                  Sin datos disponibles
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {/* Distribución por año */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875', mb: 1 }}>
                      Distribución por año
                    </Typography>
                    <Box sx={{ height: 260, width: '100%' }}>
                      {getFilteredYears(datasetsSec1['Año']).length > 0 ? (
                        <BarChart
                          grid={{ horizontal: true }}
                          xAxis={[{ scaleType: 'band', data: getFilteredYears(datasetsSec1['Año']).map(d => d.label) }]}
                          series={[{ 
                            data: getFilteredYears(datasetsSec1['Año']).map(d => d.value),
                            label: 'Convenios Vigentes',
                            color: '#E27800',
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...getFilteredYears(datasetsSec1['Año']).map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...getFilteredYears(datasetsSec1['Año']).map(d => d.value), 0))
                          }]}
                          height={240}
                          margin={{ top: 30, right: 10, bottom: 40, left: 40 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9E9E9E' }}>
                          No hay datos en el rango seleccionado
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

                    <Box sx={{ height: 260 }}>
                      {sec1Segment === 'Sector' && (
                        <PieChart
                          series={[{
                            data: datasetsSec1.Sector.filter(d => d.value > 0).map((d, i) => ({ id: i, value: d.value, label: d.label, color: getSectorColor(d.label) })),
                            innerRadius: 40,
                            outerRadius: 80,
                          }]}
                          height={220}
                          slotProps={{ legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' }, labelStyle: { fontSize: '10px' } } }}
                        />
                      )}

                      {sec1Segment === 'Tipo' && (
                        <BarChart
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec1.Tipo.map(d => d.label), 
                            colorMap: { 
                              type: 'ordinal', 
                              values: ['Admisión y orientación', 'Articulación TP', 'Empleabilidad y prácticas', 'Transferencia disciplinar', 'Certificación y competencias', 'Relacionamiento territorial', 'Vínculo Académico', 'Extensión'],
                              colors: ['#E27800', '#2196F3', '#4CAF50', '#9C27B0', '#FF5722', '#607D8B', '#009688', '#795548']
                            },
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                                if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                              return value;
                            }
                          }]}
                          series={[{ 
                            data: datasetsSec1.Tipo.map(d => d.value),
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...datasetsSec1.Tipo.map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...datasetsSec1.Tipo.map(d => d.value), 0))
                          }]}
                          height={220}
                          margin={{ top: 30, right: 10, bottom: 40, left: 40 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      )}

                      {sec1Segment === 'Contraparte' && (
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
                        </div>
                      )}

                      {sec1Segment === 'Área vinculada' && (
                        <BarChart
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec1['Área vinculada'].map(d => d.label), 
                            colorMap: { 
                              type: 'ordinal', 
                              values: ['Presencial', 'Híbrida', 'Online', 'Online sincrónica'],
                              colors: ['#E27800', '#4CAF50', '#2196F3', '#2196F3']
                            },
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                              return value;
                            }
                          }]}
                          series={[{ 
                            data: datasetsSec1['Área vinculada'].map(d => d.value),
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...datasetsSec1['Área vinculada'].map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...datasetsSec1['Área vinculada'].map(d => d.value), 0))
                          }]}
                          height={220}
                          margin={{ top: 30, right: 10, bottom: 40, left: 40 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              )}
            </div>
          )}
        </div>

        {/* ----------------- SECCIÓN 2: Nuevos convenios firmados ----------------- */}
        <div className="collapsible-card" style={{ marginTop: '12px' }}>
          <div className="collapsible-header" onClick={() => toggleSection('sec2')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px 20px' }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 600, color: '#1E2875', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={20} style={{ color: '#E27800' }} />
              Nuevos convenios firmados
            </h2>
            <ChevronDown style={{ transform: sectionsOpen.sec2 ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms', color: '#1E2875' }} size={18} />
          </div>
          {sectionsOpen.sec2 && (
            <div className="collapsible-body" style={{ padding: '20px', borderTop: '1px solid #E0E0E0' }}>
              {isNoData ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#64748b', fontSize: '13px', fontWeight: 500, border: '1px dashed #E2E8F0', borderRadius: '12px', bgcolor: '#F8FAFC', width: '100%' }}>
                  Sin datos disponibles
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {/* Distribución por año */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875', mb: 1 }}>
                      Distribución por año
                    </Typography>
                    <Box sx={{ height: 260, width: '100%' }}>
                      {getFilteredYears(datasetsSec2['Año']).length > 0 ? (
                        <BarChart
                          grid={{ horizontal: true }}
                          xAxis={[{ scaleType: 'band', data: getFilteredYears(datasetsSec2['Año']).map(d => d.label) }]}
                          series={[{ 
                            data: getFilteredYears(datasetsSec2['Año']).map(d => d.value),
                            label: 'Nuevos Convenios',
                            color: '#2196F3',
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...getFilteredYears(datasetsSec2['Año']).map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...getFilteredYears(datasetsSec2['Año']).map(d => d.value), 0))
                          }]}
                          height={240}
                          margin={{ top: 30, right: 10, bottom: 40, left: 40 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9E9E9E' }}>
                          No hay datos en el rango seleccionado
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

                    <Box sx={{ height: 260 }}>
                      {sec2Segment === 'Sector' && (
                        <BarChart
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec2.Sector.map(d => d.label), 
                            colorMap: { 
                              type: 'ordinal', 
                              values: ['Administración', 'Finanzas', 'Social', 'Ingeniería', 'Salud', 'Educación', 'Ambiental'],
                              colors: ['#E27800', '#2196F3', '#4CAF50', '#9C27B0', '#FF5722', '#607D8B', '#00BCD4']
                            },
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                              return value;
                            }
                          }]}
                          series={[{ 
                            data: datasetsSec2.Sector.map(d => d.value),
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...datasetsSec2.Sector.map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...datasetsSec2.Sector.map(d => d.value), 0))
                          }]}
                          height={220}
                          margin={{ top: 30, right: 10, bottom: 40, left: 40 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      )}

                      {sec2Segment === 'Tipo' && (
                        <BarChart
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec2.Tipo.map(d => d.label), 
                            colorMap: { 
                              type: 'ordinal', 
                              values: ['Marco', 'Específico', 'Colaboración'],
                              colors: ['#E27800', '#2196F3', '#4CAF50']
                            },
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                              return value;
                            }
                          }]}
                          series={[{ 
                            data: datasetsSec2.Tipo.map(d => d.value),
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...datasetsSec2.Tipo.map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...datasetsSec2.Tipo.map(d => d.value), 0))
                          }]}
                          height={220}
                          margin={{ top: 30, right: 10, bottom: 40, left: 40 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      )}

                      {sec2Segment === 'Responsable' && (
                        <BarChart
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec2.Responsable.map(d => d.label), 
                            colorMap: { type: 'ordinal', colors: catColors },
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                              return value;
                            }
                          }]}
                          series={[{ 
                            data: datasetsSec2.Responsable.map(d => d.value),
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...datasetsSec2.Responsable.map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...datasetsSec2.Responsable.map(d => d.value), 0))
                          }]}
                          height={220}
                          margin={{ top: 30, right: 10, bottom: 40, left: 40 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              )}
            </div>
          )}
        </div>

        {/* ----------------- SECCIÓN 3: Convenios por sector ----------------- */}
        <div className="collapsible-card" style={{ marginTop: '12px' }}>
          <div className="collapsible-header" onClick={() => toggleSection('sec3')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px 20px' }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 600, color: '#1E2875', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers size={20} style={{ color: '#E27800' }} />
              Convenios por sector
            </h2>
            <ChevronDown style={{ transform: sectionsOpen.sec3 ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms', color: '#1E2875' }} size={18} />
          </div>
          {sectionsOpen.sec3 && (
            <div className="collapsible-body" style={{ padding: '20px', borderTop: '1px solid #E0E0E0' }}>
              {isNoData ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#64748b', fontSize: '13px', fontWeight: 500, border: '1px dashed #E2E8F0', borderRadius: '12px', bgcolor: '#F8FAFC', width: '100%' }}>
                  Sin datos disponibles
                </Box>
              ) : (
                <Grid container spacing={3} alignItems="center">
                  {/* Donut Chart */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <PieChart
                        series={[{
                          data: datasetsSec3.filter(d => d.vigentes > 0).map((d, i) => ({ id: i, value: d.vigentes, label: d.label, color: getSectorColor(d.label) })),
                          innerRadius: 50,
                          outerRadius: 90,
                          paddingAngle: 2,
                          cornerRadius: 4,
                        }]}
                        height={250}
                        margin={{ top: 10, bottom: 50, left: 10, right: 10 }}
                        slotProps={{ legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' }, labelStyle: { fontSize: '11px' } } }}
                      />

                      {/* Texto en el centro del Donut */}
                      <Box sx={{ 
                        position: 'absolute', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        pointerEvents: 'none',
                        transform: 'translateY(-20px)'
                      }}>
                        <Typography sx={{ fontSize: '24px', fontWeight: 800, color: '#1E2875', lineHeight: 1 }}>
                          {datasetsSec3.reduce((sum, d) => sum + (d.vigentes || 0), 0)}
                        </Typography>
                        <Typography sx={{ fontSize: '10px', fontWeight: 600, color: '#64748b', mt: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Vigentes
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Tabla de detalle */}
                  <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #E0E0E0', borderRadius: 4, width: '100%' }}>
                      <table className="vcm-table">
                        <thead>
                          <tr style={{ background: '#F8FAFC' }}>
                            <th style={{ padding: '10px', fontWeight: 600, borderBottom: '2px solid #E0E0E0' }}>
                              Sector
                            </th>
                            <th style={{ padding: '10px', fontWeight: 600, borderBottom: '2px solid #E0E0E0', textAlign: 'right' }}>
                              Vigentes
                            </th>
                            <th style={{ padding: '10px', fontWeight: 600, borderBottom: '2px solid #E0E0E0', textAlign: 'right' }}>
                              Cerrados
                            </th>
                            <th style={{ padding: '10px', fontWeight: 600, borderBottom: '2px solid #E0E0E0', textAlign: 'right' }}>
                              Total
                            </th>
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
                    </div>
                  </Grid>
                </Grid>
              )}
            </div>
          )}
        </div>

        {/* ----------------- SECCIÓN 4: Actividades VcM ----------------- */}
        <div className="collapsible-card" style={{ marginTop: '12px' }}>
          <div className="collapsible-header" onClick={() => toggleSection('sec4')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px 20px' }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 600, color: '#1E2875', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CalendarLucide size={20} style={{ color: '#E27800' }} />
              Actividades VcM
            </h2>
            <ChevronDown style={{ transform: sectionsOpen.sec4 ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms', color: '#1E2875' }} size={18} />
          </div>
          {sectionsOpen.sec4 && (
            <div className="collapsible-body" style={{ padding: '20px', borderTop: '1px solid #E0E0E0' }}>
              {isNoData ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#64748b', fontSize: '13px', fontWeight: 500, border: '1px dashed #E2E8F0', borderRadius: '12px', bgcolor: '#F8FAFC', width: '100%' }}>
                  Sin datos disponibles
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {/* Distribución por año */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875', mb: 1 }}>
                      Distribución por año
                    </Typography>
                    <Box sx={{ height: 260, width: '100%' }}>
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
                          height={240}
                          margin={{ top: 30, right: 10, bottom: 40, left: 40 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9E9E9E' }}>
                          No hay datos en el rango seleccionado
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
                      {sec4Segment === 'Línea VcM' && (
                        <BarChart
                          grid={{ horizontal: false, vertical: false }}
                          xAxis={[{ max: Math.max(...datasetsSec4['Línea VcM'].map(d => d.value), 0) * 1.15 + 2 }]}
                          yAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec4['Línea VcM'].map(d => d.label), 
                            width: isMobile ? 55 : 120, 
                            colorMap: { 
                              type: 'ordinal', 
                              values: ['Admisión y orientación', 'Articulación TP', 'Empleabilidad y prácticas', 'Transferencia disciplinar', 'Certificación y competencias', 'Relacionamiento territorial', 'Vínculo Académico', 'Extensión'],
                              colors: ['#E27800', '#2196F3', '#4CAF50', '#9C27B0', '#FF5722', '#607D8B', '#009688', '#795548']
                            },
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 9) {
                                  return value.substring(0, 6) + '...';
                              }
                              return value;
                            }
                          }]}
                          series={[{ 
                            data: datasetsSec4['Línea VcM'].map(d => d.value),
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          layout="horizontal"
                          height={240}
                          margin={{ top: 10, right: 50, bottom: 45, left: isMobile ? 65 : 130 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      )}

                      {sec4Segment === 'Modalidad' && (
                        <BarChart
                          grid={{ horizontal: false, vertical: false }}
                          xAxis={[{ max: Math.max(...datasetsSec4.Modalidad.map(d => d.value), 0) * 1.15 + 2 }]}
                          yAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec4.Modalidad.map(d => d.label), 
                            width: isMobile ? 55 : 110, 
                            colorMap: { 
                              type: 'ordinal', 
                              values: ['Presencial', 'Híbrida', 'Online', 'Online sincrónica'],
                              colors: ['#E27800', '#4CAF50', '#2196F3', '#2196F3']
                            },
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 9) {
                                return value.substring(0, 6) + '...';
                              }
                              return value;
                            }
                          }]}
                          series={[{ 
                            data: datasetsSec4.Modalidad.map(d => d.value),
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          layout="horizontal"
                          height={240}
                          margin={{ top: 10, right: 50, bottom: 45, left: isMobile ? 65 : 120 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      )}

                      {sec4Segment === 'Tipo de Actividad' && (
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
                        </div>
                      )}

                      {sec4Segment === 'Comuna' && (
                        <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid #E0E0E0', borderRadius: 4, width: '100%' }}>
                          <table className="vcm-table">
                            <thead>
                              <tr>
                                <th className="sortable-th" onClick={() => handleSort('sec4', 'label')}>
                                  Comuna {sortStates.sec4.key === 'label' ? (sortStates.sec4.asc ? ' ▲' : ' ▼') : ''}
                                </th>
                                <th className="sortable-th" style={{ textAlign: 'right' }} onClick={() => handleSort('sec4', 'value')}>
                                  Cantidad {sortStates.sec4.key === 'value' ? (sortStates.sec4.asc ? ' ▲' : ' ▼') : ''}
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
                        </div>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              )}
            </div>
          )}
        </div>

        {/* ----------------- SECCIÓN 5: Participantes en actividades VcM ----------------- */}
        <div className="collapsible-card" style={{ marginTop: '12px' }}>
          <div className="collapsible-header" onClick={() => toggleSection('sec5')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px 20px' }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 600, color: '#1E2875', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={20} style={{ color: '#E27800' }} />
              Participantes en actividades VcM
            </h2>
            <ChevronDown style={{ transform: sectionsOpen.sec5 ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms', color: '#1E2875' }} size={18} />
          </div>
          {sectionsOpen.sec5 && (
            <div className="collapsible-body" style={{ padding: '20px', paddingBottom: '35px', borderTop: '1px solid #E0E0E0' }}>
              {isNoData ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#64748b', fontSize: '13px', fontWeight: 500, border: '1px dashed #E2E8F0', borderRadius: '12px', bgcolor: '#F8FAFC', width: '100%' }}>
                  Sin datos disponibles
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {/* Distribución por año */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875', mb: 1 }}>
                      Distribución por año (Interno vs Externo)
                    </Typography>
                    <Box sx={{ height: 260, width: '100%' }}>
                      {getFilteredYears(datasetsSec5['Año']).length > 0 ? (
                        <BarChart
                          grid={{ horizontal: true }}
                          xAxis={[{ scaleType: 'band', data: getFilteredYears(datasetsSec5['Año']).map(d => d.label) }]}
                          series={[
                            { data: getFilteredYears(datasetsSec5['Año']).map(d => d.interno), label: 'Interno', color: '#2196F3', stack: 'total' },
                            { data: getFilteredYears(datasetsSec5['Año']).map(d => d.externo), label: 'Externo', color: '#4CAF50', stack: 'total' }
                          ]}
                          yAxis={[{ 
                            min: 0,
                            max: getAxisMax(Math.max(...getFilteredYears(datasetsSec5['Año']).map(d => d.interno + d.externo), 0)), 
                            width: 45,
                            tickInterval: getAxisTicks(Math.max(...getFilteredYears(datasetsSec5['Año']).map(d => d.interno + d.externo), 0))
                          }]}
                          height={240}
                          margin={{ top: 30, right: 10, bottom: 40, left: 55 }}
                          slotProps={{ legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' }, labelStyle: { fontSize: '11px' } } }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9E9E9E' }}>
                          No hay datos en el rango seleccionado
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
                      {sec5Segment === 'Público objetivo' && (
                        <BarChart
                          grid={{ horizontal: false, vertical: false }}
                          xAxis={[{ max: Math.max(...datasetsSec5['Público objetivo'].map(d => d.value), 0) * 1.15 + 10 }]}
                          yAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec5['Público objetivo'].map(d => d.label), 
                            width: isMobile ? 55 : 120, 
                            colorMap: { type: 'ordinal', colors: catColors },
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 9) {
                                return value.substring(0, 6) + '...';
                              }
                              return value;
                            }
                          }]}
                          series={[{ 
                            data: datasetsSec5['Público objetivo'].map(d => d.value),
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          layout="horizontal"
                          height={350}
                          margin={{ top: 10, right: 50, bottom: 45, left: isMobile ? 65 : 130 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      )}

                      {sec5Segment === 'Sexo' && (
                        <Box sx={{ height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                          <PieChart
                            series={[{
                              data: datasetsSec5.Sexo.map((d, i) => ({ id: i, value: d.value, label: d.label, color: getSexoColor(d.label) })),
                              innerRadius: 50,
                              outerRadius: 90,
                              paddingAngle: 2,
                              cornerRadius: 4,
                            }]}
                            height={240}
                            slotProps={{ legend: { direction: 'row', position: { vertical: 'bottom', horizontal: 'middle' }, labelStyle: { fontSize: '11px' } } }}
                          />
                          <Box sx={{ 
                            position: 'absolute', 
                            top: '50%', 
                            left: '50%', 
                            transform: 'translate(-50%, -50%) translateY(-10px)', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            pointerEvents: 'none'
                          }}>
                            <Typography sx={{ fontSize: '22px', fontWeight: 800, color: '#1E2875', lineHeight: 1 }}>
                              {datasetsSec5.Sexo.reduce((sum, d) => sum + (d.value || 0), 0)}
                            </Typography>
                            <Typography sx={{ fontSize: '9px', fontWeight: 600, color: '#64748b', mt: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              TOTAL
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {sec5Segment === 'Institución' && (
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
                        </div>
                      )}

                      {sec5Segment === 'Comuna' && (
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
                        </div>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              )}
            </div>
          )}
        </div>

        {/* ----------------- SECCIÓN 6: Articulaciones TP ejecutadas ----------------- */}
        <div className="collapsible-card" style={{ marginTop: '12px' }}>
          <div className="collapsible-header" onClick={() => toggleSection('sec6')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: '16px 20px' }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 600, color: '#1E2875', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GraduationCap size={20} style={{ color: '#E27800' }} />
              Articulaciones TP ejecutadas
            </h2>
            <ChevronDown style={{ transform: sectionsOpen.sec6 ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms', color: '#1E2875' }} size={18} />
          </div>
          {sectionsOpen.sec6 && (
            <div className="collapsible-body" style={{ padding: '20px', borderTop: '1px solid #E0E0E0' }}>
              {isNoData ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: '#64748b', fontSize: '13px', fontWeight: 500, border: '1px dashed #E2E8F0', borderRadius: '12px', bgcolor: '#F8FAFC', width: '100%' }}>
                  Sin datos disponibles
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {/* Distribución por año */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontSize: '17px', fontWeight: 700, color: '#1E2875', mb: 1 }}>
                      Distribución por año
                    </Typography>
                    <Box sx={{ height: 260, width: '100%' }}>
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
                          height={240}
                          margin={{ top: 30, right: 10, bottom: 40, left: 40 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9E9E9E' }}>
                          No hay datos en el rango seleccionado
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
                      {sec6Segment === 'Plataforma' && (
                        <BarChart
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec6.Plataforma.map(d => wrapText(d.label, 12)), 
                            colorMap: { 
                              type: 'ordinal', 
                              values: ['SAP', 'Defontana', 'Excel', 'Excel aplicado', 'Power BI', 'PowerBI'].map(v => wrapText(v, 12)),
                              colors: ['#3F51B5', '#009688', '#4CAF50', '#4CAF50', '#FFC107', '#FFC107']
                            },
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                              return value;
                            }
                          }]}
                          series={[{ 
                            data: datasetsSec6.Plataforma.map(d => d.value),
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...datasetsSec6.Plataforma.map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...datasetsSec6.Plataforma.map(d => d.value), 0))
                          }]}
                          height={240}
                          margin={{ top: 30, right: 10, bottom: 50, left: 40 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      )}

                      {sec6Segment === 'Tipo' && (
                        <BarChart
                          grid={{ horizontal: true }}
                          xAxis={[{ 
                            scaleType: 'band', 
                            data: datasetsSec6.Tipo.map(d => wrapText(d.label, 12)), 
                            colorMap: { 
                              type: 'ordinal', 
                              values: [
                                'Reconocimiento de aprendizajes', 'Alternancia', 'Taller práctico', 
                                'Charla técnica', 'Feria TP', 'Mesa sectorial', 'Reconocimiento'
                              ].map(v => wrapText(v, 12)),
                              colors: ['#E27800', '#2196F3', '#4CAF50', '#9C27B0', '#FF5722', '#607D8B', '#E27800']
                            },
                            tickLabelStyle: { fontSize: isMobile ? 8 : 10, fontWeight: 500 },
                            valueFormatter: (value, context) => {
                              if (isMobile && context?.location === 'tick' && value && value.length > 6) return value.substring(0, 4) + '...';
                              return value;
                            }
                          }]}
                          series={[{ 
                            data: datasetsSec6.Tipo.map(d => d.value),
                            barLabel: 'value',
                            barLabelPlacement: 'outside'
                          }]}
                          yAxis={[{ 
                            max: getAxisMax(Math.max(...datasetsSec6.Tipo.map(d => d.value), 0)), 
                            width: 35,
                            domainLimit: 'strict',
                            tickInterval: getAxisTicks(Math.max(...datasetsSec6.Tipo.map(d => d.value), 0))
                          }]}
                          height={240}
                          margin={{ top: 30, right: 10, bottom: 70, left: 40 }}
                          slotProps={{ legend: { hidden: true } }}
                        />
                      )}

                      {sec6Segment === 'Especialidad' && (
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
                        </div>
                      )}

                      {sec6Segment === 'Colegio' && (
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
                        </div>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              )}
            </div>
          )}
        </div>
      </Box>

      {/* ----------------- SIDEBAR LATERAL DERECHO (Filtros responsive) ----------------- */}
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
        sx={{
          width: filtersCollapsed ? '40px' : '290px',
          height: filtersCollapsed ? '40px' : 'calc(100vh - 40px)',
          transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1), height 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 250ms',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          position: 'sticky',
          top: '20px',
          mr: '20px',
          my: '20px',
          borderRadius: filtersCollapsed ? '50%' : '16px',
          overflow: 'hidden',
          bgcolor: filtersCollapsed ? 'transparent' : '#FFFFFF',
          border: filtersCollapsed ? 'none' : '1px solid #E2E8F0',
          boxShadow: filtersCollapsed ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.03), 0 2px 4px -1px rgba(0,0,0,0.02)',
          flexShrink: 0,
          zIndex: 90,
        }}
      >
        {/* Botón Toggle Colapsar/Expandir en la cabecera */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: filtersCollapsed ? 'center' : 'space-between',
          p: filtersCollapsed ? '0px' : '16px 12px',
          bgcolor: filtersCollapsed ? 'transparent' : '#F8FAFC',
          borderBottom: filtersCollapsed ? 'none' : '1px solid #E2E8F0',
          height: filtersCollapsed ? '40px' : '56px',
          width: filtersCollapsed ? '40px' : '100%',
          boxSizing: 'border-box'
        }}>
          {!filtersCollapsed && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FilterIcon sx={{ color: '#E27800', fontSize: 18 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E2875', fontSize: '14px' }}>
                Filtros VcM
              </Typography>
            </Box>
          )}
          <IconButton 
            onClick={() => setFiltersCollapsed(!filtersCollapsed)}
            size="medium"
            sx={{ 
              color: '#1E2875',
              width: filtersCollapsed ? '40px' : '32px',
              height: filtersCollapsed ? '40px' : '32px',
              bgcolor: filtersCollapsed ? '#FFFFFF' : 'rgba(30, 40, 117, 0.05)',
              border: filtersCollapsed ? '1px solid #E2E8F0' : 'none',
              boxShadow: filtersCollapsed ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
              '&:hover': { bgcolor: filtersCollapsed ? '#F8FAFC' : 'rgba(30, 40, 117, 0.1)' }
            }}
          >
            {filtersCollapsed ? <ChevronRightIcon /> : <ChevronRightIcon style={{ transform: 'rotate(180deg)', transition: 'transform 200ms' }} />}
          </IconButton>
        </Box>

        {/* Contenido de los filtros (solo visible si no está colapsado) */}
        <Box sx={{ 
          flexGrow: 1, 
          opacity: filtersCollapsed ? 0 : 1,
          visibility: filtersCollapsed ? 'hidden' : 'visible',
          transition: 'opacity 150ms ease-in-out, visibility 150ms ease-in-out',
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
                  {cohorteDesde === cohorteHasta ? cohorteDesde : `${cohorteDesde} - ${cohorteHasta}`}
                </Typography>
              </Box>
            </Box>

            {/* Accordions de filtros */}
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#9E9E9E', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Estado
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {['Activo', 'Cerrado'].map((lbl) => (
                      <FilterChip
                        key={lbl}
                        label={lbl}
                        selected={selectedEstados.includes(lbl.toLowerCase())}
                        onClick={() => toggleChip(selectedEstados, setSelectedEstados, lbl.toLowerCase())}
                      />
                    ))}
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>

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
              </AccordionDetails>
            </Accordion>

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
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Footer Reset Button */}
          <Box sx={{ p: 2, borderTop: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ResetIcon />}
              onClick={handleResetFilters}
              fullWidth
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
              }}
            >
              Restablecer filtros
            </Button>
          </Box>
        </Box>
      </Box>
      </Box>
    </ThemeProvider>
  );
};
