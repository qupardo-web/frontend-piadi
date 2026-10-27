import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Menu,
  Tooltip,
  Snackbar,
  Alert,
  Divider,
  GlobalStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Description as ReportesIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  ArrowBack as BackIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  School as AdmisionIcon,
  MenuBook as CurricularIcon,
  Lightbulb as InnovacionIcon,
  AutoStories as ContinuaIcon,
  Handshake as VcmIcon,
  Apps as AllIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

import { Header, Sidebar } from '../../../components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  useReportes,
  AREA_COLORS,
  formatOptionLabel,
  resolveDimensionKey,
  resolveDimensionLabel,
  THEMATIC_FILTER_PARAM_MAP,
} from './Reportes.hooks';
import { styles } from './Reportes.styles';
import logoEcas from '../../../assets/logo_ECAS.svg';

const reportesLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E2875',
    },
    secondary: {
      main: '#1DC2A0',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
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
    MuiSelect: {
      styleOverrides: {
        root: {
          color: '#1e293b',
        },
        select: {
          color: '#1e293b',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#1e293b',
          fontSize: '13.5px',
          '&:hover': {
            backgroundColor: '#F1F5F9',
          },
          '&.Mui-selected': {
            backgroundColor: '#E2E8F0',
            color: '#1E2875',
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#CBD5E1',
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#1e293b',
        },
        input: {
          color: '#1e293b',
        },
      },
    },
  },
});

const DepartmentFilterCarousel = React.memo(({
  builderCatalogo,
  selectedDepCard,
  setSelectedDepCard,
  isDepartmentRestricted,
  userDept,
  builderInds,
  AREA_COLORS,
}) => {
  const carouselRef = React.useRef(null);
  const scrollTimeoutRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = React.useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const nextCanLeft = scrollLeft > 6;
    const nextCanRight = Math.ceil(scrollLeft + clientWidth) < scrollWidth - 6;
    setCanScrollLeft(nextCanLeft);
    setCanScrollRight(nextCanRight);
  }, []);

  React.useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    checkScroll();

    // scrollend dispara de forma nativa solo cuando la animación ha terminado
    const handleScrollEnd = () => checkScroll();
    const handleScrollDebounced = () => {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(checkScroll, 120);
    };

    el.addEventListener('scrollend', handleScrollEnd, { passive: true });
    el.addEventListener('scroll', handleScrollDebounced, { passive: true });
    window.addEventListener('resize', handleScrollDebounced);

    return () => {
      clearTimeout(scrollTimeoutRef.current);
      el.removeEventListener('scrollend', handleScrollEnd);
      el.removeEventListener('scroll', handleScrollDebounced);
      window.removeEventListener('resize', handleScrollDebounced);
    };
  }, [checkScroll, builderCatalogo, isDepartmentRestricted]);

  const handleScroll = (direction) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardStep = 195;
    const scrollAmount = Math.max(cardStep, Math.floor(el.clientWidth * 0.65));
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const totalIndicatorsCount = React.useMemo(() => {
    return builderCatalogo.reduce((acc, g) => acc + g.items.length, 0);
  }, [builderCatalogo]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, width: '100%' }}>
      {!isDepartmentRestricted && (
        <IconButton
          size="small"
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label="Desplazar a la izquierda"
          sx={{
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            color: canScrollLeft ? '#1E2875' : '#CBD5E1',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
            flexShrink: 0,
            width: 34,
            height: 34,
            transition: 'border-color 0.15s ease, background-color 0.15s ease',
            '&:hover': {
              bgcolor: canScrollLeft ? '#F8FAFC' : '#FFFFFF',
              borderColor: canScrollLeft ? '#CBD5E1' : '#E2E8F0',
            },
            '&.Mui-disabled': {
              bgcolor: '#F8FAFC',
              color: '#CBD5E1',
              borderColor: '#E2E8F0',
              opacity: 0.5,
            },
          }}
        >
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
      )}

      <Box
        ref={carouselRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          scrollSnapType: 'x mandatory',
          flex: 1,
          py: 1,
          px: 0.5,
          minWidth: 0,
          willChange: 'scroll-position',
          transform: 'translateZ(0)',
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Card: Todos (solo visible si no está restringido por departamento) */}
        {!isDepartmentRestricted && (
          <Card
            onClick={() => setSelectedDepCard('all')}
            sx={{
              ...styles.deptFilterCard(selectedDepCard === 'all', '#1E2875'),
              flex: '0 0 175px',
              minWidth: 175,
              maxWidth: 175,
              boxSizing: 'border-box',
              scrollSnapAlign: 'start',
              userSelect: 'none',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: selectedDepCard === 'all' ? '#1E2875' : '#F1F5F9', color: selectedDepCard === 'all' ? '#FFFFFF' : '#1E2875', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AllIcon sx={{ fontSize: 18 }} />
              </Box>
              {builderInds.length > 0 && (
                <Box sx={{ bgcolor: '#10B981', color: '#FFFFFF', fontSize: '10px', fontWeight: 700, px: 0.8, py: 0.2, borderRadius: '10px' }}>
                  {builderInds.length} sel.
                </Box>
              )}
            </Box>
            <Box sx={{ mt: 0.5 }}>
              <Typography sx={{ fontSize: '12.5px', fontWeight: 700, color: '#1E2875', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Todas
              </Typography>
              <Typography sx={{ fontSize: '11px', color: '#64748B' }}>
                {totalIndicatorsCount} indicad.
              </Typography>
            </Box>
          </Card>
        )}

        {/* Cards por departamento */}
        {builderCatalogo.map((group) => {
          const isSelected = selectedDepCard === group.dep || selectedDepCard === group.key || (isDepartmentRestricted && userDept);
          const color = AREA_COLORS[group.dep] || '#1E2875';
          const selectedInDep = group.items.filter((item) => builderInds.includes(item.id)).length;

          let depIcon = <AdmisionIcon sx={{ fontSize: 18 }} />;
          if (group.dep.includes('Curricular')) depIcon = <CurricularIcon sx={{ fontSize: 18 }} />;
          else if (group.dep.includes('Innovación')) depIcon = <InnovacionIcon sx={{ fontSize: 18 }} />;
          else if (group.dep.includes('Continua')) depIcon = <ContinuaIcon sx={{ fontSize: 18 }} />;
          else if (group.dep.includes('Vinculación')) depIcon = <VcmIcon sx={{ fontSize: 18 }} />;

          return (
            <Card
              key={group.key || group.dep}
              title={group.dep}
              onClick={() => setSelectedDepCard(group.dep)}
              sx={{
                ...styles.deptFilterCard(isSelected, color),
                flex: isDepartmentRestricted ? '0 0 240px' : '0 0 175px',
                minWidth: isDepartmentRestricted ? 240 : 175,
                maxWidth: isDepartmentRestricted ? 280 : 175,
                boxSizing: 'border-box',
                scrollSnapAlign: 'start',
                userSelect: 'none',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '8px', bgcolor: isSelected ? color : `${color}15`, color: isSelected ? '#FFFFFF' : color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {depIcon}
                </Box>
                {selectedInDep > 0 && (
                  <Box sx={{ bgcolor: '#10B981', color: '#FFFFFF', fontSize: '10px', fontWeight: 700, px: 0.8, py: 0.2, borderRadius: '10px' }}>
                    {selectedInDep} sel.
                  </Box>
                )}
              </Box>
              <Box sx={{ mt: 0.5 }}>
                <Typography sx={{ fontSize: '12.5px', fontWeight: 700, color: '#1E2875', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {group.dep}
                </Typography>
                <Typography sx={{ fontSize: '11px', color: '#64748B' }}>
                  {group.items.length} indicad.
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Box>

      {!isDepartmentRestricted && (
        <IconButton
          size="small"
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          aria-label="Desplazar a la derecha"
          sx={{
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            color: canScrollRight ? '#1E2875' : '#CBD5E1',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)',
            flexShrink: 0,
            width: 34,
            height: 34,
            transition: 'border-color 0.15s ease, background-color 0.15s ease',
            '&:hover': {
              bgcolor: canScrollRight ? '#F8FAFC' : '#FFFFFF',
              borderColor: canScrollRight ? '#CBD5E1' : '#E2E8F0',
            },
            '&.Mui-disabled': {
              bgcolor: '#F8FAFC',
              color: '#CBD5E1',
              borderColor: '#E2E8F0',
              opacity: 0.5,
            },
          }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
});

export const Reportes = () => {
  const {
    navigate,
    user,
    viewMode,
    isAdmin,
    isRector,
    isCalidad,
    userDept,
    isDepartmentRestricted,
    canCreateReport,
    canCreatePredefinido,
    loading,
    catalogo,
    builderCatalogo,
    areasList,
    searchQuery,
    setSearchQuery,
    filtroDepartamento,
    setFiltroDepartamento,
    filtroTipo,
    setFiltroTipo,
    filtroFormato,
    setFiltroFormato,
    filtroCreadoPor,
    setFiltroCreadoPor,
    filtroDesde,
    setFiltroDesde,
    filtroHasta,
    setFiltroHasta,
    filtersCollapsed,
    setFiltersCollapsed,
    filteredMisReportes,
    filteredPredefinidos,
    misReportes,
    kebabAnchorEl,
    setKebabAnchorEl,
    kebabTargetId,
    setKebabTargetId,
    deleteModalOpen,
    setDeleteModalOpen,
    deleteTargetId,
    deleteConfirmInput,
    setDeleteConfirmInput,
    handleOpenDeleteModal,
    handleConfirmDelete,
    toastMessage,
    toastOpen,
    setToastOpen,
    toastSeverity,
    showToast,
    openHelpDialog,
    setOpenHelpDialog,
    builder,
    setBuilder,
    indicatorSearch,
    setIndicatorSearch,
    selectedDepCard,
    setSelectedDepCard,
    handleOpenNewBuilder,
    handleUseAsBase,
    handleEditReport,
    handleAreaChange,
    handleStartGenerate,
    handleSaveBuilder,
    handleOpenHistorial,
    handleBackToList,
    handleBackFromPreview,
    currentPreviewReport,
    previewDataByIndicator,
    isGenerating,
    progressValue,
    progressText,
    handleDownloadDoc,
    histReporteFilter,
    setHistReporteFilter,
    histFechaFilter,
    setHistFechaFilter,
    histPage,
    setHistPage,
    paginatedHistorial,
    totalHistPages,
    filteredHistorial,
    getIndicatorInfo,
    getDesagsForIndicator,
    getFiltersForArea,
    availableYears,
    dimensionNameToKey,
    areaName,
    formatDate,
  } = useReportes();

  // Active kebab report
  const selectedKebabReport = misReportes.find((r) => r.id === kebabTargetId);


  return (
    <ThemeProvider theme={reportesLightTheme}>
      <GlobalStyles
        styles={{
          '@media print': {
            '@page': {
              size: 'A4 portrait',
              margin: '12mm 15mm 15mm 15mm',
            },
            'html, body': {
              background: '#FFFFFF !important',
              backgroundColor: '#FFFFFF !important',
              color: '#1E293B !important',
              width: '100% !important',
              height: 'auto !important',
              margin: '0 !important',
              padding: '0 !important',
              overflow: 'visible !important',
              fontFamily: "'Inter', sans-serif !important",
            },
            /* Ocultar elementos no imprimibles */
            'aside, nav, .sidebar-root, [role="navigation"], header, .MuiAppBar-root, .no-print': {
              display: 'none !important',
            },
            '.MuiSnackbar-root, .MuiDialog-root': {
              display: 'none !important',
            },
            /* Contenedor principal expandido al 100% sin scrollbars ni fondos grises */
            'main, #root, #root > div': {
              width: '100% !important',
              maxWidth: '100% !important',
              padding: '0 !important',
              margin: '0 !important',
              background: 'transparent !important',
              overflow: 'visible !important',
            },
            /* Hoja A4 */
            '.doc-page-print': {
              width: '100% !important',
              maxWidth: '100% !important',
              minHeight: 'auto !important',
              margin: '0 !important',
              padding: '0 !important',
              boxShadow: 'none !important',
              border: 'none !important',
              background: '#FFFFFF !important',
              color: '#1E293B !important',
            },
            /* Preservar colores exactos en la impresión */
            '*': {
              WebkitPrintColorAdjust: 'exact !important',
              printColorAdjust: 'exact !important',
              colorAdjust: 'exact !important',
            },
            /* Evitar cortes indeseados dentro de un bloque o indicador */
            '.print-avoid-break': {
              pageBreakInside: 'avoid !important',
              breakInside: 'avoid !important',
            },
          },
        }}
      />
      <Box sx={styles.mainLayout}>
        {/* Sidebar institucional */}
        <Sidebar activeMenu="Reportes" />

        {/* Área de contenido principal */}
        <Box component="main" sx={styles.contentArea}>
        {/* =========================================================================
            1. VISTA: LISTADO DE REPORTES
            ========================================================================= */}
        {viewMode === 'lista' && (
          <>
            <Header
              title="Reportes"
              subtitle="Crea y exporta reportes con los indicadores institucionales"
              icon={<ReportesIcon />}
              iconColor="#FFFFFF"
              breadcrumbs={[
                { label: 'Inicio', path: '/' },
                { label: 'Reportes', path: null },
              ]}
              rightAction={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  {isDepartmentRestricted && userDept && (
                    <Box
                      sx={{
                        px: 1.8,
                        py: 0.6,
                        bgcolor: 'rgba(30, 40, 117, 0.08)',
                        color: '#1E2875',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        border: '1px solid #C7D2FE',
                      }}
                    >
                      Departamento: {userDept.name}
                    </Box>
                  )}
                  {canCreateReport ? (
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleOpenNewBuilder}
                      sx={{
                        bgcolor: '#1E2875',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 2.5,
                        height: 38,
                        '&:hover': { bgcolor: '#131a52' },
                      }}
                    >
                      Crear reporte
                    </Button>
                  ) : (
                    <Box
                      sx={{
                        px: 2,
                        py: 0.8,
                        bgcolor: '#F1F5F9',
                        color: '#64748B',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      Solo lectura (Calidad)
                    </Box>
                  )}
                </Box>
              }
            />

            {/* Buscador Superior y Botón Filtros */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
              <TextField
                size="small"
                placeholder="Buscar reporte…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#94A3B8', mr: 1, fontSize: 20 }} />,
                }}
                sx={{
                  width: { xs: '100%', sm: 300 },
                  bgcolor: '#FFFFFF',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                }}
              />
            </Box>

            {/* Tarjeta de Filtros Colapsable */}
            <Card sx={styles.filterCard}>
              <Box sx={styles.filterHeader}>
                <Typography sx={styles.filterTitle}>
                  <FilterIcon sx={{ color: '#1E2875', fontSize: 20 }} />
                  Filtrar por:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setFiltersCollapsed(!filtersCollapsed)}
                  sx={styles.filterToggleBtn}
                  endIcon={
                    <ExpandMoreIcon
                      sx={{
                        transform: filtersCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s',
                      }}
                    />
                  }
                >
                  {filtersCollapsed ? 'Mostrar filtros' : 'Ocultar filtros'}
                </Button>
              </Box>

              {!filtersCollapsed && (
                <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid #F1F5F9' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={2.5}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: 'block' }}>
                        Departamento {isDepartmentRestricted ? '(Asignado por rol)' : ''}
                      </Typography>
                      <Select
                        size="small"
                        fullWidth
                        value={filtroDepartamento}
                        onChange={(e) => setFiltroDepartamento(e.target.value)}
                        disabled={isDepartmentRestricted}
                        sx={{ bgcolor: isDepartmentRestricted ? '#F8FAFC' : '#FFFFFF', borderRadius: '8px' }}
                      >
                        {isDepartmentRestricted && userDept ? (
                          <MenuItem value={userDept.name}>{userDept.name}</MenuItem>
                        ) : [
                          <MenuItem key="todas" value="todas">Todos</MenuItem>,
                          <MenuItem key="Admisión" value="Admisión">Admisión</MenuItem>,
                          <MenuItem key="Desarrollo Curricular" value="Desarrollo Curricular">Desarrollo Curricular</MenuItem>,
                          <MenuItem key="Innovación" value="Innovación">Innovación</MenuItem>,
                          <MenuItem key="Educación Continua" value="Educación Continua">Educación Continua</MenuItem>,
                          <MenuItem key="Vinculación con el Medio" value="Vinculación">Vinculación con el Medio</MenuItem>,
                          <MenuItem key="Relaciones Estudiantiles" value="Relaciones Estudiantiles">Relaciones Estudiantiles</MenuItem>,
                        ]}
                      </Select>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: 'block' }}>
                        Tipo
                      </Typography>
                      <Select
                        size="small"
                        fullWidth
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
                      >
                        <MenuItem value="todas">Todos</MenuItem>
                        <MenuItem value="predefinido">Predefinidos</MenuItem>
                        <MenuItem value="mis">Mis reportes</MenuItem>
                      </Select>
                    </Grid>

                    <Grid item xs={12} sm={6} md={1.8}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: 'block' }}>
                        Formato
                      </Typography>
                      <Select
                        size="small"
                        fullWidth
                        value={filtroFormato}
                        onChange={(e) => setFiltroFormato(e.target.value)}
                        sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
                      >
                        <MenuItem value="todos">Excel / PDF</MenuItem>
                        <MenuItem value="excel">Excel</MenuItem>
                        <MenuItem value="pdf">PDF</MenuItem>
                      </Select>
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.2}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: 'block' }}>
                        Creado por
                      </Typography>
                      <Select
                        size="small"
                        fullWidth
                        value={filtroCreadoPor}
                        onChange={(e) => setFiltroCreadoPor(e.target.value)}
                        sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
                      >
                        <MenuItem value="todos">Todos</MenuItem>
                        <MenuItem value="John Doe">John Doe</MenuItem>
                        <MenuItem value="María López">María López</MenuItem>
                        <MenuItem value="Carlos Rojas">Carlos Rojas</MenuItem>
                      </Select>
                    </Grid>

                    <Grid item xs={12} sm={12} md={3.5}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: 'block' }}>
                        Creado en
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          type="date"
                          size="small"
                          fullWidth
                          value={filtroDesde}
                          onChange={(e) => setFiltroDesde(e.target.value)}
                          inputProps={{ style: { fontSize: '13px', padding: '8.5px 8px' } }}
                          sx={{
                            bgcolor: '#FFFFFF',
                            borderRadius: '8px',
                            minWidth: 125,
                            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                          }}
                        />
                        <Typography sx={{ color: '#94A3B8', fontWeight: 600 }}>–</Typography>
                        <TextField
                          type="date"
                          size="small"
                          fullWidth
                          value={filtroHasta}
                          onChange={(e) => setFiltroHasta(e.target.value)}
                          inputProps={{ style: { fontSize: '13px', padding: '8.5px 8px' } }}
                          sx={{
                            bgcolor: '#FFFFFF',
                            borderRadius: '8px',
                            minWidth: 125,
                            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Card>

            {/* SECCIÓN 1: REPORTES PREDEFINIDOS */}
            {filtroTipo !== 'mis' && (
              <Box sx={styles.sectionBlock}>
                <Box sx={styles.sectionHeader}>
                  <Typography sx={styles.sectionTitle}>Predefinidos</Typography>
                  <Typography sx={styles.sectionHint}>Plantillas listas para usar como base</Typography>
                </Box>

                {filteredPredefinidos.length === 0 ? (
                  <Card sx={{ p: 4, textAlign: 'center', bgcolor: '#FFFFFF', border: '1px dashed #CBD5E1', borderRadius: '12px' }}>
                    <Typography sx={{ color: '#94A3B8', fontSize: '14px' }}>
                      No hay reportes predefinidos para los filtros seleccionados.
                    </Typography>
                  </Card>
                ) : (
                  <Grid container spacing={2.5}>
                    {filteredPredefinidos.map((p) => {
                      const color = AREA_COLORS[p.area] || '#1E2875';
                      return (
                        <Grid item xs={12} sm={6} md={4} key={p.id || p.name}>
                          <Card sx={styles.reportCard}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1E2875', lineHeight: 1.3 }}>
                                  {p.name}
                                </Typography>
                                <Box sx={styles.reportBadge(color)}>{areaName(p.area)}</Box>
                              </Box>

                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                {p.inds.map((indId) => {
                                  const info = getIndicatorInfo(indId);
                                  return (
                                    <Box key={indId} sx={styles.chip}>
                                      {info.name}
                                    </Box>
                                  );
                                })}
                              </Box>

                              <Typography sx={{ fontSize: '12.5px', color: '#64748B' }}>
                                {p.tipo === 'segmento' ? 'Segmento de área' : 'Departamento completo'} · Formato{' '}
                                {p.formato.toUpperCase()}
                              </Typography>
                            </Box>

                            <Box sx={{ pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
                              <Button
                                fullWidth
                                variant="outlined"
                                size="small"
                                startIcon={<CopyIcon sx={{ fontSize: '16px !important' }} />}
                                onClick={() => handleUseAsBase(p)}
                                sx={{
                                  color: '#1E2875',
                                  borderColor: '#CBD5E1',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  borderRadius: '8px',
                                  '&:hover': { borderColor: '#1E2875', bgcolor: 'rgba(30, 40, 117, 0.04)' },
                                }}
                              >
                                Usar como base
                              </Button>
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            )}

            {/* SECCIÓN 2: MIS REPORTES */}
            {filtroTipo !== 'predefinido' && (
              <Box sx={styles.sectionBlock}>
                <Box sx={styles.sectionHeader}>
                  <Typography sx={styles.sectionTitle}>Mis reportes</Typography>
                  <Typography sx={styles.sectionHint}>
                    {filteredMisReportes.length} reporte{filteredMisReportes.length === 1 ? '' : 's'}
                  </Typography>
                </Box>

                {filteredMisReportes.length === 0 ? (
                  <Card sx={{ p: 5, textAlign: 'center', bgcolor: '#FFFFFF', border: '1px dashed #CBD5E1', borderRadius: '12px' }}>
                    <ReportesIcon sx={{ fontSize: 44, color: '#CBD5E1', mb: 1 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '16px', color: '#1E2875', mb: 0.5 }}>
                      Aún no tienes reportes creados
                    </Typography>
                    <Typography sx={{ fontSize: '13.5px', color: '#64748B', mb: 2 }}>
                      Crea tu primer reporte personalizado o usa una plantilla como base.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleOpenNewBuilder}
                      sx={{ bgcolor: '#1E2875', color: '#FFFFFF', textTransform: 'none', borderRadius: '8px' }}
                    >
                      Crear primer reporte
                    </Button>
                  </Card>
                ) : (
                  <Grid container spacing={2.5}>
                    {filteredMisReportes.map((r) => {
                      const color = AREA_COLORS[r.area] || '#1E2875';
                      const updatedText = r.ultimo ? `Actualizado ${formatDate(r.ultimo)}` : 'Sin generar';

                      return (
                        <Grid item xs={12} sm={6} md={4} key={r.id}>
                          <Card sx={styles.reportCard}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1E2875', lineHeight: 1.3 }}>
                                  {r.name}
                                </Typography>
                                <Box sx={styles.reportBadge(color)}>{areaName(r.area)}</Box>
                              </Box>

                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                {r.inds.map((indId) => {
                                  const info = getIndicatorInfo(indId);
                                  return (
                                    <Box key={indId} sx={styles.chip}>
                                      {info.name}
                                    </Box>
                                  );
                                })}
                              </Box>

                              <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
                                {updatedText} · {r.creadoPor || '—'}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
                              <Button
                                fullWidth
                                variant="contained"
                                size="small"
                                onClick={() => {
                                  if (r.formato === 'excel' || r.formato === 'xlsx') {
                                    handleDownloadDoc(r);
                                  } else {
                                    handleStartGenerate(r);
                                  }
                                }}
                                sx={{
                                  bgcolor: '#1E2875',
                                  color: '#FFFFFF',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  borderRadius: '8px',
                                  '&:hover': { bgcolor: '#131a52' },
                                }}
                              >
                                Descargar
                              </Button>

                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  setKebabAnchorEl(e.currentTarget);
                                  setKebabTargetId(r.id);
                                }}
                                sx={{
                                  border: '1px solid #E2E8F0',
                                  borderRadius: '8px',
                                  p: 0.75,
                                  color: '#64748B',
                                  '&:hover': { bgcolor: '#F8FAFC', color: '#1E2875' },
                                }}
                              >
                                <MoreVertIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            )}

            {/* Menú Contextual (Kebab) de Acciones */}
            <Menu
              anchorEl={kebabAnchorEl}
              open={Boolean(kebabAnchorEl)}
              onClose={() => setKebabAnchorEl(null)}
              PaperProps={{
                sx: {
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.12)',
                  minWidth: 160,
                  p: 0.5,
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  if (selectedKebabReport) handleEditReport(selectedKebabReport);
                  setKebabAnchorEl(null);
                }}
                sx={{ fontSize: '13.5px', gap: 1.5, py: 1 }}
              >
                <EditIcon fontSize="small" sx={{ color: '#1E2875' }} />
                Editar
              </MenuItem>
              <MenuItem
                onClick={() => {
                  if (selectedKebabReport) handleUseAsBase(selectedKebabReport);
                  setKebabAnchorEl(null);
                }}
                sx={{ fontSize: '13.5px', gap: 1.5, py: 1 }}
              >
                <CopyIcon fontSize="small" sx={{ color: '#1E2875' }} />
                Usar como base
              </MenuItem>
              <MenuItem
                onClick={() => {
                  if (selectedKebabReport) handleOpenHistorial(selectedKebabReport.id);
                }}
                sx={{ fontSize: '13.5px', gap: 1.5, py: 1 }}
              >
                <HistoryIcon fontSize="small" sx={{ color: '#1E2875' }} />
                Historial
              </MenuItem>
              <Divider sx={{ my: 0.5 }} />
              <MenuItem
                onClick={() => {
                  if (kebabTargetId) handleOpenDeleteModal(kebabTargetId);
                }}
                sx={{ fontSize: '13.5px', gap: 1.5, py: 1, color: '#D64545' }}
              >
                <DeleteIcon fontSize="small" />
                Eliminar
              </MenuItem>
            </Menu>

            {/* Modal de Confirmación de Eliminación */}
            <Dialog
              open={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              PaperProps={{ sx: { borderRadius: '14px', p: 1, maxWidth: 420 } }}
            >
              <DialogTitle sx={{ fontWeight: 700, color: '#1E2875', fontSize: '18px' }}>
                Eliminar reporte
              </DialogTitle>
              <DialogContent>
                <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
                  Se eliminará permanentemente el reporte seleccionado. Esta acción no se puede deshacer. Escribe{' '}
                  <strong>eliminar</strong> para confirmar.
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="escribe «eliminar»"
                  value={deleteConfirmInput}
                  onChange={(e) => setDeleteConfirmInput(e.target.value)}
                  autoFocus
                />
              </DialogContent>
              <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                  onClick={() => setDeleteModalOpen(false)}
                  sx={{ color: '#64748B', textTransform: 'none' }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  disabled={deleteConfirmInput.trim().toLowerCase() !== 'eliminar'}
                  onClick={handleConfirmDelete}
                  sx={{
                    bgcolor: '#D64545',
                    color: '#FFFFFF',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#b91c1c' },
                  }}
                >
                  Eliminar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}

        {/* =========================================================================
            2. VISTA: CONSTRUCTOR / ASISTENTE WIZARD
            ========================================================================= */}
        {viewMode === 'constructor' && (
          <>
            <Header
              title={builder.editId ? 'Editar reporte' : 'Crear un reporte'}
              subtitle="Define datos, indicadores, período y formato del reporte"
              icon={<ReportesIcon />}
              iconColor="#FFFFFF"
              breadcrumbs={[
                { label: 'Inicio', path: '/' },
                { label: 'Reportes', path: '/reportes', onClick: handleBackToList },
                { label: builder.editId ? 'Editar reporte' : 'Crear un reporte', path: null },
              ]}
              rightAction={
                <Button
                  variant="outlined"
                  startIcon={<BackIcon />}
                  onClick={handleBackToList}
                  sx={{
                    color: '#1E2875',
                    borderColor: '#CBD5E1',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Volver a la lista
                </Button>
              }
            />

            <Grid container spacing={3}>
              {/* Asistente Principal (Izquierda) */}
              <Grid item xs={12} md={8}>
                {/* Stepper Superior */}
                <Box sx={styles.stepperContainer}>
                  {[
                    { num: 1, label: 'Datos' },
                    { num: 2, label: 'Indicadores' },
                    { num: 3, label: 'Período y filtros' },
                    { num: 4, label: 'Formato' },
                  ].map((s, idx) => {
                    const isDone = s.num < builder.step;
                    const isActive = s.num === builder.step;
                    return (
                      <React.Fragment key={s.num}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={styles.stepCircle(isActive, isDone)}>
                            {isDone ? <CheckIcon sx={{ fontSize: 16 }} /> : s.num}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: '13.5px',
                              fontWeight: isActive ? 700 : 500,
                              color: isActive ? '#1E2875' : isDone ? '#1E2875' : '#94A3B8',
                            }}
                          >
                            {s.label}
                          </Typography>
                        </Box>
                        {idx < 3 && <Box sx={styles.stepConnector(isDone)} />}
                      </React.Fragment>
                    );
                  })}
                </Box>

                {/* PASO 1: DATOS */}
                {builder.step === 1 && (
                  <Card sx={styles.builderCard}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2875', mb: 2 }}>
                      Datos del reporte
                    </Typography>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: 'block' }}>
                        Nombre del reporte *
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Ej. Reporte de Matrícula 2026"
                        value={builder.nombre}
                        onChange={(e) => setBuilder({ ...builder, nombre: e.target.value.slice(0, 200) })}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          {builder.nombre.length} / 200
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: 'block' }}>
                        Descripción
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Breve descripción del contenido y propósito del reporte..."
                        value={builder.desc}
                        onChange={(e) => setBuilder({ ...builder, desc: e.target.value.slice(0, 1000) })}
                      />
                      <Typography variant="caption" sx={{ color: '#64748B', textAlign: 'right', display: 'block', mt: 0.5 }}>
                        {builder.desc.length} / 1000
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: 'block' }}>
                        Área / Departamento * {isDepartmentRestricted ? '(Fijo por rol)' : ''}
                      </Typography>
                      <Select
                        fullWidth
                        size="small"
                        displayEmpty
                        value={builder.area || ''}
                        onChange={(e) => handleAreaChange(e.target.value)}
                        disabled={isDepartmentRestricted}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: '#94A3B8' }}>Elija una opción</span>;
                          }
                          return selected;
                        }}
                        sx={{ bgcolor: isDepartmentRestricted ? '#F8FAFC' : '#FFFFFF', borderRadius: '8px' }}
                      >
                        <MenuItem value="" disabled sx={{ color: '#94A3B8' }}>
                          Elija una opción
                        </MenuItem>
                        {isDepartmentRestricted && userDept ? (
                          <MenuItem value={userDept.name}>{userDept.name}</MenuItem>
                        ) : [
                          <MenuItem key="Admisión" value="Admisión">Admisión</MenuItem>,
                          <MenuItem key="Desarrollo Curricular" value="Desarrollo Curricular">Desarrollo Curricular</MenuItem>,
                          <MenuItem key="Innovación" value="Innovación">Innovación</MenuItem>,
                          <MenuItem key="Educación Continua" value="Educación Continua">Educación Continua</MenuItem>,
                          <MenuItem key="Vinculación con el Medio" value="Vinculación con el Medio">Vinculación con el Medio</MenuItem>,
                        ]}
                      </Select>
                      <Typography variant="caption" sx={{ color: '#64748B', mt: 0.5, display: 'block' }}>
                        {isDepartmentRestricted && userDept
                          ? `Asignado automáticamente a tu departamento: ${userDept.name}.`
                          : 'Puedes seleccionar cualquier área institucional según tus permisos.'}
                      </Typography>
                    </Box>

                    {isRector && (
                      <Box sx={{ mb: 2.5 }}>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: 'block' }}>
                          Tipo de reporte *
                        </Typography>
                        <Select
                          fullWidth
                          size="small"
                          displayEmpty
                          value={builder.tipo || ''}
                          onChange={(e) => setBuilder({ ...builder, tipo: e.target.value })}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: '#94A3B8' }}>Elija una opción</span>;
                            }
                            if (selected === 'PERSONALIZADO') return 'Reporte personalizado (Mis reportes)';
                            if (selected === 'PREDEFINIDO') return 'Plantilla predefinida institucional (Visible para todos)';
                            return selected;
                          }}
                          sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
                        >
                          <MenuItem value="" disabled sx={{ color: '#94A3B8' }}>
                            Elija una opción
                          </MenuItem>
                          <MenuItem value="PERSONALIZADO">Reporte personalizado (Mis reportes)</MenuItem>
                          <MenuItem value="PREDEFINIDO">Plantilla predefinida institucional (Visible para todos)</MenuItem>
                        </Select>
                        <Typography variant="caption" sx={{ color: '#64748B', mt: 0.5, display: 'block' }}>
                          Como Rectoría, puedes publicar plantillas predefinidas oficiales para la institución.
                        </Typography>
                      </Box>
                    )}
                  </Card>
                )}

                {/* PASO 2: INDICADORES */}
                {builder.step === 2 && (
                  <Card sx={styles.builderCard}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2875' }}>
                        Selecciona indicadores
                      </Typography>
                      {builder.inds.length > 0 && (
                        <Box sx={{ bgcolor: '#EEF2FF', color: '#1E2875', px: 1.5, py: 0.4, borderRadius: '20px', fontSize: '12px', fontWeight: 700, border: '1px solid #C7D2FE' }}>
                          {builder.inds.length} {builder.inds.length === 1 ? 'indicador seleccionado' : 'indicadores seleccionados'}
                        </Box>
                      )}
                    </Box>

                    {/* Cards de Departamentos (Carrusel Optimizado) */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                        Filtrar por departamento:
                      </Typography>
                    </Box>

                    <DepartmentFilterCarousel
                      builderCatalogo={builderCatalogo}
                      selectedDepCard={selectedDepCard}
                      setSelectedDepCard={setSelectedDepCard}
                      isDepartmentRestricted={isDepartmentRestricted}
                      userDept={userDept}
                      builderInds={builder.inds}
                      AREA_COLORS={AREA_COLORS}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Buscar indicador por nombre o descripción${selectedDepCard !== 'all' ? ` en ${selectedDepCard}` : ''}…`}
                      value={indicatorSearch}
                      onChange={(e) => setIndicatorSearch(e.target.value)}
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ color: '#94A3B8', mr: 1, fontSize: 20 }} />,
                      }}
                      sx={{ mb: 2.5 }}
                    />

                    <Box sx={{ maxHeight: 460, overflowY: 'auto', pr: 1 }}>
                      {builderCatalogo
                        .filter((group) => {
                          if (selectedDepCard === 'all') return true;
                          return group.dep === selectedDepCard || group.key === selectedDepCard;
                        })
                        .map((group) => {
                          const filteredGroupItems = group.items.filter((item) => {
                            const q = indicatorSearch.toLowerCase();
                            return !q || item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
                          });

                          if (filteredGroupItems.length === 0) return null;

                        return (
                          <Box key={group.dep} sx={{ mb: 2.5 }}>
                            <Typography
                              sx={{
                                fontSize: '12.5px',
                                fontWeight: 700,
                                color: '#1E2875',
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                mb: 1,
                              }}
                            >
                              {group.dep}
                            </Typography>

                            {filteredGroupItems.map((item) => {
                              const isChecked = builder.inds.includes(item.id);
                              const desags = item.desags || getDesagsForIndicator(item.id) || [];

                              return (
                                <Box
                                  key={item.id}
                                  sx={{
                                    p: 1.5,
                                    mb: 1.2,
                                    borderRadius: '8px',
                                    border: `1px solid ${isChecked ? '#1E2875' : '#E2E8F0'}`,
                                    bgcolor: isChecked ? 'rgba(30, 40, 117, 0.03)' : '#FFFFFF',
                                    transition: 'all 0.15s',
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2, cursor: 'pointer' }}>
                                    <Checkbox
                                      size="small"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        const prefix = `${item.id}|`;
                                        if (e.target.checked) {
                                          let defaultOption = [];
                                          if (item.defaultGroupBy) {
                                            const baseLabel = resolveDimensionLabel(item.defaultGroupBy, dimensionNameToKey);
                                            if (baseLabel) {
                                              defaultOption = [`${item.id}|${baseLabel}`];
                                            } else if (desags.length > 0) {
                                              defaultOption = [`${item.id}|${desags[0]}`];
                                            }
                                          } else if (desags.length > 0) {
                                            defaultOption = [`${item.id}|${desags[0]}`];
                                          }
                                          setBuilder({
                                            ...builder,
                                            inds: [...builder.inds, item.id],
                                            desag: [...builder.desag.filter((x) => !x.startsWith(prefix)), ...defaultOption],
                                          });
                                        } else {
                                          setBuilder({
                                            ...builder,
                                            inds: builder.inds.filter((x) => x !== item.id),
                                            desag: builder.desag.filter((x) => !x.startsWith(prefix)),
                                          });
                                        }
                                      }}
                                      sx={{ color: '#1E2875', '&.Mui-checked': { color: '#1E2875' }, p: 0.2 }}
                                    />
                                    <Box
                                      onClick={() => {
                                        const prefix = `${item.id}|`;
                                        if (isChecked) {
                                          setBuilder({
                                            ...builder,
                                            inds: builder.inds.filter((x) => x !== item.id),
                                            desag: builder.desag.filter((x) => !x.startsWith(prefix)),
                                          });
                                        } else {
                                          let defaultOption = [];
                                          if (item.defaultGroupBy) {
                                            const baseLabel = resolveDimensionLabel(item.defaultGroupBy, dimensionNameToKey);
                                            if (baseLabel) {
                                              defaultOption = [`${item.id}|${baseLabel}`];
                                            } else if (desags.length > 0) {
                                              defaultOption = [`${item.id}|${desags[0]}`];
                                            }
                                          } else if (desags.length > 0) {
                                            defaultOption = [`${item.id}|${desags[0]}`];
                                          }
                                          setBuilder({
                                            ...builder,
                                            inds: [...builder.inds, item.id],
                                            desag: [...builder.desag.filter((x) => !x.startsWith(prefix)), ...defaultOption],
                                          });
                                        }
                                      }}
                                      sx={{ flex: 1 }}
                                    >
                                      <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1E2875' }}>
                                        {item.name}
                                      </Typography>
                                      <Typography sx={{ fontSize: '12px', color: '#64748B', mt: 0.2 }}>
                                        {item.desc}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  {/* Chips de desagregación */}
                                  {/* Chips de desagregación divididos en Temporal y Categoría */}
                                  {desags.length > 0 && (() => {
                                    const isTemporal = (name) => {
                                      const norm = String(name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                                      return norm === 'ano' || norm === 'periodo';
                                    };

                                    const temporalDesags = desags.filter(isTemporal);
                                    const categoricDesags = desags.filter((d) => !isTemporal(d));

                                    const renderChip = (d) => {
                                      const key = `${item.id}|${d}`;
                                      const dimKey = resolveDimensionKey(d, dimensionNameToKey);
                                      const isBaseDim = Boolean(item.defaultGroupBy && dimKey === item.defaultGroupBy);
                                      const isSelected = isChecked && (builder.desag.includes(key) || isBaseDim);

                                      return (
                                        <Button
                                          key={d}
                                          size="small"
                                          disabled={!isChecked}
                                          onClick={() => {
                                            if (!isChecked || isBaseDim) return;
                                            if (isSelected) {
                                              setBuilder({
                                                ...builder,
                                                desag: builder.desag.filter((x) => x !== key),
                                              });
                                            } else {
                                              // Regla de máximo 2 dimensiones (1 secundaria adicional):
                                              // Si el indicador tiene dimensión base, solo puede haber 1 chip adicional
                                              // Si el indicador no tiene dimensión base, puede tener hasta 2 chips
                                              const prefix = `${item.id}|`;
                                              const otherSelectedChipsOfThisItem = builder.desag.filter((x) => {
                                                if (!x.startsWith(prefix) || x === key) return false;
                                                const chipDim = x.split('|')[1];
                                                const chipDimKey = resolveDimensionKey(chipDim, dimensionNameToKey);
                                                return !(item.defaultGroupBy && chipDimKey === item.defaultGroupBy);
                                              });

                                              if (item.defaultGroupBy) {
                                                // Reemplaza cualquier otro chip secundario para mantener Base + 1 elegida
                                                const cleanedDesags = builder.desag.filter((x) => !otherSelectedChipsOfThisItem.includes(x));
                                                setBuilder({
                                                  ...builder,
                                                  desag: [...cleanedDesags, key],
                                                });
                                              } else {
                                                // Si no tiene dimensión base fija, permitir hasta 2 chips secundarios
                                                let baseList = builder.desag;
                                                if (otherSelectedChipsOfThisItem.length >= 2) {
                                                  const chipToReplace = otherSelectedChipsOfThisItem[otherSelectedChipsOfThisItem.length - 1];
                                                  baseList = baseList.filter((x) => x !== chipToReplace);
                                                }
                                                setBuilder({
                                                  ...builder,
                                                  desag: [...baseList, key],
                                                });
                                              }
                                            }
                                          }}
                                          sx={{
                                            textTransform: 'none',
                                            borderRadius: '999px',
                                            px: 1.5,
                                            py: 0.2,
                                            fontSize: '11.5px',
                                            fontWeight: 600,
                                            bgcolor: isSelected
                                              ? (isBaseDim ? '#94A3B8' : '#1E2875')
                                              : '#FFFFFF',
                                            color: isSelected
                                              ? '#FFFFFF'
                                              : '#334155',
                                            border: `1px solid ${
                                              isSelected
                                                ? (isBaseDim ? '#94A3B8' : '#1E2875')
                                                : '#CBD5E1'
                                            }`,
                                            cursor: isBaseDim ? 'default' : 'pointer',
                                            userSelect: 'none',
                                            '&:hover': {
                                              bgcolor: isSelected
                                                ? (isBaseDim ? '#94A3B8' : '#131a52')
                                                : '#F1F5F9',
                                            },
                                          }}
                                        >
                                          {d}
                                        </Button>
                                      );
                                    };

                                    return (
                                      <Box
                                        sx={{
                                          mt: 1.2,
                                          ml: 3.8,
                                          p: 1.4,
                                          bgcolor: '#F8FAFC',
                                          borderRadius: '8px',
                                          border: '1px solid #EDF0F4',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: 1.2,
                                        }}
                                      >
                                        {/* Grupo 1: Temporal */}
                                        {temporalDesags.length > 0 && (
                                          <Box>
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontWeight: 700,
                                                color: '#64748B',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                mb: 0.8,
                                                fontSize: '11px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.04em',
                                              }}
                                            >
                                              Temporal
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                              {temporalDesags.map(renderChip)}
                                            </Box>
                                          </Box>
                                        )}

                                        {/* Grupo 2: Caracterización / Categorías */}
                                        {categoricDesags.length > 0 && (
                                          <Box>
                                            <Typography
                                              variant="caption"
                                              sx={{
                                                fontWeight: 700,
                                                color: '#64748B',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                mb: 0.8,
                                                fontSize: '11px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.04em',
                                              }}
                                            >
                                              {temporalDesags.length > 0 ? 'Categoría / Caracterización' : 'Desagregar por'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                              {categoricDesags.map(renderChip)}
                                            </Box>
                                          </Box>
                                        )}
                                      </Box>
                                    );
                                  })()}
                                </Box>
                              );
                            })}
                          </Box>
                        );
                      })}

                      {builderCatalogo
                        .filter((group) => selectedDepCard === 'all' || group.dep === selectedDepCard || group.key === selectedDepCard)
                        .every((group) => group.items.filter((item) => {
                          const q = indicatorSearch.toLowerCase();
                          return !q || item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q);
                        }).length === 0) && (
                        <Box sx={{ py: 4, textAlign: 'center', color: '#64748B' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            No se encontraron indicadores en {selectedDepCard === 'all' ? 'los departamentos' : selectedDepCard} para tu búsqueda.
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Card>
                )}

                {/* PASO 3: PERÍODO Y FILTROS */}
                {builder.step === 3 && (
                  <Card sx={styles.builderCard}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2875', mb: 2 }}>
                      Período y filtros
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: 'block' }}>
                        Rango de años
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Select
                          size="small"
                          fullWidth
                          value={builder.annoMin}
                          onChange={(e) => setBuilder({ ...builder, annoMin: e.target.value })}
                          sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
                        >
                          {(availableYears || ['2023', '2024', '2025', '2026']).map((y) => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                          ))}
                        </Select>
                        <Typography sx={{ color: '#64748B' }}>a</Typography>
                        <Select
                          size="small"
                          fullWidth
                          value={builder.annoMax}
                          onChange={(e) => setBuilder({ ...builder, annoMax: e.target.value })}
                          sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
                        >
                          {(availableYears || ['2023', '2024', '2025', '2026']).map((y) => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                          ))}
                        </Select>
                      </Box>
                    </Box>

                    {/* Filtros específicos de área */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E2875', mb: 1.5 }}>
                      Filtros temáticos del área ({areaName(builder.area)})
                    </Typography>

                    {(() => {
                      // Determinar los parámetros de filtro temático que corresponden estrictamente a los indicadores seleccionados
                      const activeFilterParamKeys = new Set();
                      (builder.inds || []).forEach((indId) => {
                        const info = getIndicatorInfo(indId);
                        const baseDim = info?.defaultGroupBy || (indId === 'matricula_por_asignatura' ? 'asignatura' : null);
                        if (baseDim) {
                          activeFilterParamKeys.add(baseDim);
                        }
                        if (indId === 'nivel_socioeconomico') activeFilterParamKeys.add('nivelSocioeconomico');
                        if (indId === 'tipo_colegio') activeFilterParamKeys.add('tipoColegio');
                        if (indId === 'via_acceso') activeFilterParamKeys.add('viaAcceso');
                        if (indId === 'situacion_familiar') activeFilterParamKeys.add('situacionFamiliar');
                        if (indId === 'beneficios_becas' || indId === 'beneficios') activeFilterParamKeys.add('beneficios');
                        if (indId === 'matricula_por_estado_academico' || indId === 'estado_academico') activeFilterParamKeys.add('estadoAcademico');
                        if (indId.includes('estado')) activeFilterParamKeys.add('estado');
                        if (indId.includes('fuente')) activeFilterParamKeys.add('fuenteFinanciamiento');
                        if (indId.includes('modalidad')) activeFilterParamKeys.add('modalidad');
                        if (indId.includes('sector')) activeFilterParamKeys.add('sector');
                        if (indId.includes('regimen')) activeFilterParamKeys.add('regimen');
                        if (indId.includes('area')) {
                          activeFilterParamKeys.add('area');
                          activeFilterParamKeys.add('areaVinculada');
                        }
                        if (indId.includes('tipo')) activeFilterParamKeys.add('tipo');
                      });

                      const areasToRender = [builder.area];

                      const renderedAreas = areasToRender
                        .map((areaKey) => {
                          const cfg = getFiltersForArea(areaKey);
                          if (!cfg || !cfg.filtros || cfg.filtros.length === 0) return null;

                          // Filtrar para mostrar únicamente el filtro temático respectivo al indicador elegido
                          const visibleFiltros = cfg.filtros.filter(([filtroName]) => {
                            const paramKey = THEMATIC_FILTER_PARAM_MAP[filtroName];
                            return activeFilterParamKeys.has(paramKey);
                          });

                          if (visibleFiltros.length === 0) return null;

                          return (
                            <Box
                              key={areaKey}
                              sx={{
                                p: 2,
                                mb: 2,
                                borderRadius: '10px',
                                border: '1px solid #E2E8F0',
                                bgcolor: '#FAFBFC',
                              }}
                            >
                              <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1E2875', mb: 1.5 }}>
                                {areaName(areaKey)}
                              </Typography>

                              {visibleFiltros.map(([filtroName, options]) => (
                                <Accordion
                                  key={filtroName}
                                  disableGutters
                                  elevation={0}
                                  sx={{
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px !important',
                                    mb: 1,
                                    '&:before': { display: 'none' },
                                  }}
                                >
                                  <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#64748B' }} />}>
                                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                                      {filtroName}
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails sx={{ pt: 0 }}>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                      {options.map((opt) => {
                                        const key = `${areaKey}|${filtroName}|${opt}`;
                                        const isSelected = builder.filtrosSeleccionados.includes(key);

                                        return (
                                          <Button
                                            key={opt}
                                            size="small"
                                            onClick={() => {
                                              if (isSelected) {
                                                setBuilder({
                                                  ...builder,
                                                  filtrosSeleccionados: builder.filtrosSeleccionados.filter((x) => x !== key),
                                                });
                                              } else {
                                                setBuilder({
                                                  ...builder,
                                                  filtrosSeleccionados: [...builder.filtrosSeleccionados, key],
                                                });
                                              }
                                            }}
                                            sx={{
                                              textTransform: 'none',
                                              borderRadius: '999px',
                                              px: 1.5,
                                              py: 0.3,
                                              fontSize: '12px',
                                              fontWeight: 500,
                                              bgcolor: isSelected ? '#1E2875' : '#F1F5F9',
                                              color: isSelected ? '#FFFFFF' : '#475569',
                                              border: `1px solid ${isSelected ? '#1E2875' : '#E2E8F0'}`,
                                              '&:hover': {
                                                bgcolor: isSelected ? '#131a52' : '#E2E8F0',
                                              },
                                            }}
                                          >
                                            {formatOptionLabel(opt)}
                                          </Button>
                                        );
                                      })}
                                    </Box>
                                  </AccordionDetails>
                                </Accordion>
                              ))}
                            </Box>
                          );
                        })
                        .filter(Boolean);

                      if (renderedAreas.length === 0) {
                        return (
                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: '8px',
                              border: '1px dashed #CBD5E1',
                              bgcolor: '#F8FAFC',
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="body2" sx={{ color: '#64748B' }}>
                              No hay filtros temáticos adicionales aplicables a los indicadores seleccionados.
                            </Typography>
                          </Box>
                        );
                      }

                      return renderedAreas;
                    })()}
                  </Card>
                )}

                {/* PASO 4: FORMATO */}
                {builder.step === 4 && (
                  <Card sx={styles.builderCard}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2875', mb: 2 }}>
                      Formato de salida
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: builder.formato === 'pdf' ? 2 : 3 }}>
                      <Box
                        onClick={() => setBuilder({ ...builder, formato: 'excel' })}
                        sx={styles.formatCard(builder.formato === 'excel')}
                      >
                        <ReportesIcon sx={{ fontSize: 32, color: builder.formato === 'excel' ? '#1E2875' : '#94A3B8', mb: 1 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1E2875' }}>
                          Excel (.xlsx)
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          Tablas estructuradas y fórmulas
                        </Typography>
                      </Box>

                      <Box
                        onClick={() => setBuilder({ ...builder, formato: 'pdf' })}
                        sx={styles.formatCard(builder.formato === 'pdf')}
                      >
                        <ReportesIcon sx={{ fontSize: 32, color: builder.formato === 'pdf' ? '#1E2875' : '#94A3B8', mb: 1 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '15px', color: '#1E2875' }}>
                          PDF Documental
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          Documento institucional A4 con tablas de detalle
                        </Typography>
                      </Box>
                    </Box>

                    {builder.formato === 'pdf' ? (
                      <Box
                        sx={{
                          pt: 1.5,
                          borderTop: '1px solid #F1F5F9',
                          fontSize: '12.5px',
                          color: '#64748B',
                          lineHeight: 1.5,
                        }}
                      >
                        El informe PDF Documental generará un documento oficial institucional en formato A4 con diseño ejecutivo optimizado para lectura e impresión, conteniendo la ficha ejecutiva y tablas numéricas completas de desglose para cada indicador seleccionado.
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          pt: 1.5,
                          borderTop: '1px solid #F1F5F9',
                          fontSize: '12.5px',
                          color: '#64748B',
                          lineHeight: 1.5,
                        }}
                      >
                        El libro Excel (.xlsx) incluirá automáticamente una hoja de resumen general y hojas dedicadas con las matrices de datos numéricos estructurados para cada indicador seleccionado.
                      </Box>
                    )}
                  </Card>
                )}

                {/* Botones de Navegación del Wizard */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBackToList}
                    sx={{ color: '#64748B', borderColor: '#CBD5E1', textTransform: 'none', borderRadius: '8px' }}
                  >
                    Cancelar
                  </Button>

                  {builder.step > 1 && (
                    <Button
                      variant="outlined"
                      onClick={() => setBuilder({ ...builder, step: builder.step - 1 })}
                      sx={{ color: '#1E2875', borderColor: '#CBD5E1', textTransform: 'none', borderRadius: '8px' }}
                    >
                      Anterior
                    </Button>
                  )}

                  {builder.step < 4 ? (() => {
                    const isNextDisabled = (() => {
                      if (builder.step === 1) {
                        if (!builder.nombre || !builder.nombre.trim()) return true;
                        if (!builder.area || !builder.area.trim()) return true;
                        if (isRector && (!builder.tipo || !builder.tipo.trim())) return true;
                        return false;
                      }
                      if (builder.step === 2) {
                        return builder.inds.length === 0;
                      }
                      if (builder.step === 3) {
                        if (!builder.annoMin || !builder.annoMax) return true;
                        if (Number(builder.annoMin) > Number(builder.annoMax)) return true;
                        return false;
                      }
                      return false;
                    })();

                    return (
                      <Button
                        variant="contained"
                        disabled={isNextDisabled}
                        onClick={() => {
                          const nextStep = builder.step + 1;
                          setBuilder({
                            ...builder,
                            step: nextStep,
                            maxStep: Math.max(builder.maxStep || 1, nextStep),
                          });
                        }}
                        sx={{
                          bgcolor: '#1E2875',
                          color: '#FFFFFF',
                          textTransform: 'none',
                          borderRadius: '8px',
                          '&.Mui-disabled': {
                            bgcolor: '#E2E8F0',
                            color: '#94A3B8',
                          },
                        }}
                      >
                        Siguiente
                      </Button>
                    );
                  })() : (
                    <>
                      <Button
                        variant="outlined"
                        onClick={() => handleSaveBuilder(false)}
                        sx={{
                          color: '#1E2875',
                          borderColor: '#1E2875',
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: '8px',
                        }}
                      >
                        Guardar borrador
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleSaveBuilder(true)}
                        sx={{
                          bgcolor: '#1E2875',
                          color: '#FFFFFF',
                          textTransform: 'none',
                          fontWeight: 600,
                          borderRadius: '8px',
                          '&:hover': { bgcolor: '#131a52' },
                        }}
                      >
                        Guardar y generar
                      </Button>
                    </>
                  )}
                </Box>
              </Grid>

              {/* Panel de Resumen Lateral (Derecha) */}
              <Grid item xs={12} md={4}>
                <Card sx={styles.summaryPanel}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2875', mb: 2 }}>
                    Resumen del reporte
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Nombre</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E2875', textAlign: 'right' }}>
                        {builder.nombre || '—'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Área</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E2875' }}>
                        {areaName(builder.area)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Período</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E2875' }}>
                        {(builder.maxStep || builder.step) >= 3 ? `${builder.annoMin} — ${builder.annoMax}` : '—'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Formato</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E2875' }}>
                        {(builder.maxStep || builder.step) >= 4 ? (builder.formato === 'excel' ? 'Excel (.xlsx)' : 'PDF Documento') : '—'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Indicadores</Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: (builder.maxStep || builder.step) >= 2 && builder.inds.length > 0 ? '#1DC2A0' : '#64748B'
                        }}
                      >
                        {(builder.maxStep || builder.step) >= 2
                          ? `${builder.inds.length} seleccionados`
                          : '—'}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {builder.filtrosSeleccionados && builder.filtrosSeleccionados.length > 0 && (() => {
                    const groupedFilters = {};
                    builder.filtrosSeleccionados.forEach((item) => {
                      const parts = item.split('|');
                      if (parts.length >= 3) {
                        const [areaKey, filtroName, opt] = parts;
                        if (!groupedFilters[filtroName]) {
                          groupedFilters[filtroName] = {
                            area: areaName(areaKey),
                            opts: [],
                          };
                        }
                        groupedFilters[filtroName].opts.push(formatOptionLabel(opt));
                      }
                    });

                    return (
                      <>
                        <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 1 }}>
                          Filtros temáticos aplicados:
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 180, overflowY: 'auto', mb: 2 }}>
                          {Object.entries(groupedFilters).map(([filtroName, data]) => (
                            <Box key={filtroName} sx={{ p: 1, bgcolor: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#1E2875' }}>
                                  {filtroName}
                                </Typography>
                                <Typography sx={{ fontSize: '10.5px', fontWeight: 600, color: '#64748B' }}>
                                  {data.area}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {data.opts.map((opt) => (
                                  <Box
                                    key={opt}
                                    sx={{
                                      px: 1,
                                      py: 0.2,
                                      bgcolor: 'rgba(30, 40, 117, 0.08)',
                                      borderRadius: '999px',
                                      fontSize: '11px',
                                      fontWeight: 600,
                                      color: '#1E2875',
                                    }}
                                  >
                                    {opt}
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                        <Divider sx={{ my: 2 }} />
                      </>
                    );
                  })()}

                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 1 }}>
                    Indicadores incluidos:
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 220, overflowY: 'auto' }}>
                    {(builder.maxStep || builder.step) < 2 ? (
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
                        —
                      </Typography>
                    ) : builder.inds.length === 0 ? (
                      <Typography variant="caption" sx={{ color: '#94A3B8', fontStyle: 'italic' }}>
                        Aún no has seleccionado ningún indicador.
                      </Typography>
                    ) : (
                      builder.inds.map((id) => {
                        const info = getIndicatorInfo(id);
                        const activeDesags = builder.desag
                          .filter((x) => x.startsWith(`${id}|`))
                          .map((x) => x.split('|')[1]);

                        return (
                          <Box key={id} sx={{ p: 1, bgcolor: '#F8FAFC', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                            <Typography sx={{ fontSize: '12.5px', fontWeight: 600, color: '#1E2875' }}>
                              {info.name}
                            </Typography>
                            {activeDesags.length > 0 && (
                              <Typography sx={{ fontSize: '11px', color: '#64748B' }}>
                                Desglose: {activeDesags.join(', ')}
                              </Typography>
                            )}
                          </Box>
                        );
                      })
                    )}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </>
        )}

        {/* =========================================================================
            3. VISTA: PREVIEW / DOCUMENTO GENERADO
            ========================================================================= */}
        {viewMode === 'preview' && (
          <>
            <Box className="no-print">
              <Header
                title="Vista Previa de Reporte"
                subtitle="Previsualización y exportación del documento generado"
                icon={<ReportesIcon />}
                iconColor="#FFFFFF"
                breadcrumbs={[
                  { label: 'Inicio', path: '/' },
                  { label: 'Reportes', path: '/reportes', onClick: handleBackToList },
                  { label: 'Vista previa', path: null },
                ]}
                rightAction={
                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Button
                      variant="outlined"
                      startIcon={<BackIcon />}
                      onClick={handleBackFromPreview}
                      sx={{ color: '#1E2875', borderColor: '#CBD5E1', borderRadius: '8px', textTransform: 'none' }}
                    >
                      Volver
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PrintIcon />}
                      onClick={() => window.print()}
                      sx={{ color: '#1E2875', borderColor: '#CBD5E1', borderRadius: '8px', textTransform: 'none' }}
                    >
                      Imprimir
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={() => {
                        if (currentPreviewReport?.formato === 'pdf' || !currentPreviewReport?.formato) {
                          window.print();
                        } else {
                          handleDownloadDoc();
                        }
                      }}
                      sx={{
                        bgcolor: '#1E2875',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#131a52' },
                      }}
                    >
                      Descargar PDF
                    </Button>
                  </Box>
                }
              />
            </Box>

            {/* Simulación de Generación con Barra de Progreso */}
            {isGenerating ? (
              <Card sx={{ p: 6, textAlign: 'center', bgcolor: '#FFFFFF', borderRadius: '12px', my: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2875', mb: 2 }}>
                  Generando reporte institucional…
                </Typography>
                <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{ height: 8, borderRadius: 4, bgcolor: '#E2E8F0', '& .MuiLinearProgress-bar': { bgcolor: '#1DC2A0' } }}
                  />
                </Box>
                <Typography sx={{ color: '#64748B', fontSize: '14px' }}>{progressText}</Typography>
              </Card>
            ) : (
              /* Hoja A4 de Documento */
              <Box sx={{ py: 2 }}>
                <Paper className="doc-page-print" sx={styles.docPage} elevation={4}>
                  {/* Encabezado del Documento */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2.5, borderBottom: '2px solid #1E2875', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        component="img"
                        src={logoEcas}
                        alt="Logo ECAS"
                        sx={{ width: 44, height: 44, objectFit: 'contain' }}
                      />
                      <Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '18px', color: '#1E2875', letterSpacing: '0.05em' }}>
                          PIADI / ECAS
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
                          Instituto Profesional Escuela de Contadores Auditores
                        </Typography>
                      </Box>
                    </Box>

                    <Typography sx={{ fontWeight: 700, fontSize: '20px', color: '#1E2875', textAlign: 'right' }}>
                      {currentPreviewReport?.name || 'Reporte Institucional'}
                    </Typography>
                  </Box>

                  {/* Metadatos */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, fontSize: '12.5px', color: '#64748B', mb: 3 }}>
                    <span><strong>Área:</strong> {areaName(currentPreviewReport?.area || 'Admisión')}</span>
                    <span><strong>Período:</strong> {currentPreviewReport?.annoMin || '2023'} — {currentPreviewReport?.annoMax || '2026'}</span>
                    <span><strong>Creado por:</strong> {currentPreviewReport?.creadoPor || 'John Doe'}</span>
                    <span><strong>Generado el:</strong> {new Date().toLocaleDateString('es-CL')}</span>
                  </Box>

                  {/* Filtros temáticos involucrados en el reporte */}
                  {(() => {
                    const sel = currentPreviewReport?.filtrosSeleccionados || currentPreviewReport?.filtros?.filtrosSeleccionados || [];
                    if (!sel || sel.length === 0) return null;

                    const groupedFilters = {};
                    sel.forEach((item) => {
                      const parts = item.split('|');
                      if (parts.length >= 3) {
                        const [areaKey, filtroName, opt] = parts;
                        if (!groupedFilters[filtroName]) {
                          groupedFilters[filtroName] = {
                            area: areaName(areaKey),
                            opts: [],
                          };
                        }
                        groupedFilters[filtroName].opts.push(formatOptionLabel(opt));
                      }
                    });

                    const entries = Object.entries(groupedFilters);
                    if (entries.length === 0) return null;

                    return (
                      <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', mb: 3.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '12.5px', color: '#1E2875', mb: 1, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <FilterIcon sx={{ fontSize: 16, color: '#1E2875' }} />
                          Filtros temáticos aplicados:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {entries.map(([filtroName, data]) => (
                            <Box
                              key={filtroName}
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75,
                                fontSize: '12px',
                                bgcolor: '#FFFFFF',
                                px: 1.25,
                                py: 0.5,
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                              }}
                            >
                              <Typography component="span" sx={{ fontWeight: 700, fontSize: '12px', color: '#1E2875' }}>
                                {filtroName}:
                              </Typography>
                              <Typography component="span" sx={{ fontWeight: 600, fontSize: '12px', color: '#0F172A' }}>
                                {data.opts.join(', ')}
                              </Typography>
                              <Typography component="span" sx={{ fontSize: '11px', color: '#64748B', ml: 0.25 }}>
                                ({data.area})
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    );
                  })()}

                  {/* Tabla de Contenidos (Índice) */}
                  <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', mb: 3.5 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#1E2875', mb: 1 }}>
                      Índice del Reporte
                    </Typography>
                    <Box component="ol" sx={{ pl: 2.5, m: 0, fontSize: '13px', color: '#334155' }}>
                      {(currentPreviewReport?.inds || []).map((id, idx) => {
                        const info = getIndicatorInfo(id);
                        return (
                          <li key={id} style={{ marginBottom: 4 }}>
                            {idx + 1}. {info.name}
                          </li>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Secciones por cada indicador */}
                  {(currentPreviewReport?.inds || []).map((id, idx) => {
                    const info = getIndicatorInfo(id);
                    const indicatorData = previewDataByIndicator[id] || {
                      val: 'Sin datos',
                      desc: info.desc,
                      table: [],
                      chart: [],
                      labels: [],
                    };

                    return (
                      <Box key={id} className="print-avoid-break" sx={{ mb: 4, pt: 2.5, borderTop: '1px solid #E2E8F0' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#1E2875', mb: 0.5 }}>
                          {idx + 1}. {info.name}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#64748B', mb: 1.5 }}>
                          Departamento de {info.dep}
                        </Typography>

                        {/* Valor Destacado */}
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.5, flexWrap: 'wrap' }}>
                          <Typography sx={{ fontSize: '26px', fontWeight: 800, color: '#1E2875' }}>
                            {indicatorData.val}
                          </Typography>
                          {indicatorData.valSuffix && (
                            <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#64748B' }}>
                              {indicatorData.valSuffix}
                            </Typography>
                          )}
                          <Typography sx={{ fontSize: '12.5px', color: '#64748B' }}>
                            (cierre {currentPreviewReport?.annoMax || '2026'})
                          </Typography>
                        </Box>

                        <Typography sx={{ fontSize: '13px', color: '#475569', mb: 2 }}>
                          {indicatorData.desc} Los datos corresponden al seguimiento del período {currentPreviewReport?.annoMin || '2023'} al {currentPreviewReport?.annoMax || '2026'}.
                        </Typography>

                        {/* Tabla de Datos */}
                        {indicatorData.isBidimensional && indicatorData.bidimensionalData ? (
                          <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
                            <Table size="small">
                              <TableHead sx={{ bgcolor: '#F1F5F9' }}>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '12px', color: '#1E2875', py: 1 }}>
                                    {indicatorData.dimensionName ? `Desglose (${indicatorData.dimensionName})` : 'Desglose'}
                                  </TableCell>
                                  {(indicatorData.bidimensionalData.columns || []).map((colKey) => {
                                    const rawColTitle = indicatorData.bidimensionalData.columnLabels?.[colKey] || colKey;
                                    const colUpper = String(rawColTitle).trim().toUpperCase();
                                    const colTitle = colUpper === 'F' ? 'Femenino' : colUpper === 'M' ? 'Masculino' : colUpper === 'O' ? 'Otros' : rawColTitle;
                                    return (
                                      <TableCell key={colKey} align="right" sx={{ fontWeight: 700, fontSize: '12px', color: '#1E2875', py: 1 }}>
                                        {colTitle}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {(indicatorData.bidimensionalData.matrix || []).map((row, rIdx) => {
                                  const rowUpper = String(row.row).trim().toUpperCase();
                                  const rowLabel = rowUpper === 'F' ? 'Femenino' : rowUpper === 'M' ? 'Masculino' : rowUpper === 'O' ? 'Otros' : row.row;
                                  return (
                                    <TableRow key={rIdx} sx={{ '&:nth-of-type(even)': { bgcolor: '#F8FAFC' } }}>
                                      <TableCell sx={{ fontSize: '12.5px', fontWeight: 500, color: '#1E293B', py: 0.8 }}>
                                        {rowLabel}
                                      </TableCell>
                                      {(indicatorData.bidimensionalData.columns || []).map((colKey) => {
                                        const cellVal = row.values?.[colKey];
                                        return (
                                          <TableCell key={colKey} align="right" sx={{ fontSize: '12.5px', fontWeight: 600, py: 0.8 }}>
                                            {cellVal != null ? cellVal.toLocaleString('es-CL') : '—'}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  );
                                })}
                                {/* Fila de Totales Marginales */}
                                {indicatorData.bidimensionalData.totals && (
                                  <TableRow sx={{ bgcolor: '#F1F5F9', borderTop: '2px solid #CBD5E1' }}>
                                    <TableCell sx={{ fontSize: '12.5px', fontWeight: 800, color: '#1E2875', py: 1 }}>
                                      Total
                                    </TableCell>
                                    {(indicatorData.bidimensionalData.columns || []).map((colKey) => {
                                      const colTotal = indicatorData.bidimensionalData.totals.columns?.[colKey] ?? indicatorData.bidimensionalData.totals[colKey];
                                      return (
                                        <TableCell key={colKey} align="right" sx={{ fontSize: '12.5px', fontWeight: 800, py: 1, color: '#1E2875' }}>
                                          {colTotal != null ? colTotal.toLocaleString('es-CL') : '—'}
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : indicatorData.isMatrix && indicatorData.matrixRows.length > 0 ? (
                          <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
                            <Table size="small">
                              <TableHead sx={{ bgcolor: '#F1F5F9' }}>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '12px', color: '#1E2875', py: 1 }}>
                                    {indicatorData.dimensionName ? `Desglose (${indicatorData.dimensionName})` : 'Desglose'}
                                  </TableCell>
                                  {indicatorData.matrixYears.map((yr) => (
                                    <TableCell key={yr} align="right" sx={{ fontWeight: 700, fontSize: '12px', color: '#1E2875', py: 1 }}>
                                      {yr}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {indicatorData.matrixRows.map((row, rIdx) => {
                                  const matrixUpper = String(row.label).trim().toUpperCase();
                                  const matrixLabel = matrixUpper === 'F' ? 'Femenino' : matrixUpper === 'M' ? 'Masculino' : matrixUpper === 'O' ? 'Otros' : row.label;
                                  return (
                                    <TableRow key={rIdx} sx={{ '&:nth-of-type(even)': { bgcolor: '#F8FAFC' } }}>
                                      <TableCell sx={{ fontSize: '12.5px', fontWeight: 500, color: '#1E293B', py: 0.8 }}>
                                        {matrixLabel}
                                      </TableCell>
                                      {row.values.map((v, vIdx) => (
                                        <TableCell key={vIdx} align="right" sx={{ fontSize: '12.5px', fontWeight: 600, py: 0.8 }}>
                                          {v.toLocaleString('es-CL')}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : indicatorData.table.length > 0 ? (
                          <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: '6px', overflow: 'hidden' }}>
                            <Table size="small">
                              <TableHead sx={{ bgcolor: '#F1F5F9' }}>
                                <TableRow>
                                  <TableCell sx={{ fontWeight: 700, fontSize: '12px', color: '#1E2875', py: 1 }}>
                                    {indicatorData.dimensionName ? `Desglose (${indicatorData.dimensionName})` : 'Período / Desglose'}
                                  </TableCell>
                                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '12px', color: '#1E2875', py: 1 }}>
                                    Valor
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {indicatorData.table.map(([label, val], rIdx) => {
                                  const labelUpper = String(label).trim().toUpperCase();
                                  const tableLabel = labelUpper === 'F' ? 'Femenino' : labelUpper === 'M' ? 'Masculino' : labelUpper === 'O' ? 'Otros' : label;
                                  return (
                                    <TableRow key={rIdx} sx={{ '&:nth-of-type(even)': { bgcolor: '#F8FAFC' } }}>
                                      <TableCell sx={{ fontSize: '12.5px', py: 0.8 }}>{tableLabel}</TableCell>
                                      <TableCell align="right" sx={{ fontSize: '12.5px', fontWeight: 600, py: 0.8 }}>
                                        {val.toLocaleString('es-CL')}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : null}
                      </Box>
                    );
                  })}

                  {/* Pie de Página del Documento */}
                  <Box className="print-avoid-break" sx={{ display: 'flex', justifyContent: 'space-between', pt: 3, mt: 4, borderTop: '1px solid #E2E8F0', fontSize: '11px', color: '#94A3B8' }}>
                    <span>PIADI ECAS — Sistema de Inteligencia y Gestión de Datos</span>
                    <span>Documento Oficial Institucional</span>
                  </Box>
                </Paper>
              </Box>
            )}
          </>
        )}

        {/* =========================================================================
            4. VISTA: HISTORIAL DE DESCARGAS Y EJECUCIONES
            ========================================================================= */}
        {viewMode === 'historial' && (
          <>
            <Header
              title="Historial de Reportes"
              subtitle="Registro y descargas de las ejecuciones previas de reportes institucionales"
              icon={<HistoryIcon />}
              iconColor="#FFFFFF"
              breadcrumbs={[
                { label: 'Inicio', path: '/' },
                { label: 'Reportes', path: '/reportes', onClick: handleBackToList },
                { label: 'Historial', path: null },
              ]}
              rightAction={
                <Button
                  variant="outlined"
                  startIcon={<BackIcon />}
                  onClick={handleBackToList}
                  sx={{ color: '#1E2875', borderColor: '#CBD5E1', borderRadius: '8px', textTransform: 'none' }}
                >
                  Volver a reportes
                </Button>
              }
            />

            {/* Filtros de Historial */}
            <Card sx={styles.filterCard}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Filtrar por reporte
                  </Typography>
                  <Select
                    fullWidth
                    size="small"
                    value={histReporteFilter}
                    onChange={(e) => {
                      setHistReporteFilter(e.target.value);
                      setHistPage(1);
                    }}
                    sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
                  >
                    <MenuItem value="todos">Todos los reportes</MenuItem>
                    {misReportes.map((r) => (
                      <MenuItem key={r.id} value={r.id}>
                        {r.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Filtrar por fecha
                  </Typography>
                  <TextField
                    type="date"
                    size="small"
                    fullWidth
                    value={histFechaFilter}
                    onChange={(e) => {
                      setHistFechaFilter(e.target.value);
                      setHistPage(1);
                    }}
                    sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Tabla de Historial */}
            <TableContainer component={Paper} sx={{ borderRadius: '12px', border: '1px solid #E2E8F0', mt: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: '#1E2875', fontSize: '13px' }}>Reporte</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1E2875', fontSize: '13px' }}>Usuario</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1E2875', fontSize: '13px' }}>Fecha</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1E2875', fontSize: '13px' }}>Formato</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#1E2875', fontSize: '13px' }}>Estado</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#1E2875', fontSize: '13px' }}>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedHistorial.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94A3B8' }}>
                        No hay ejecuciones registradas para los filtros seleccionados.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedHistorial.map((h) => {
                      let statusBadge = { bg: '#ECFDF5', color: '#047857', label: 'Completado' };
                      if (h.estado === 'pending') statusBadge = { bg: '#FFF7ED', color: '#C2410C', label: 'En proceso' };
                      if (h.estado === 'error') statusBadge = { bg: '#FEF2F2', color: '#B91C1C', label: 'Error' };

                      return (
                        <TableRow key={h.id} hover>
                          <TableCell sx={{ fontWeight: 600, color: '#1E2875' }}>
                            {h.reporteName}
                          </TableCell>
                          <TableCell sx={{ color: '#475569' }}>{h.usuario}</TableCell>
                          <TableCell sx={{ color: '#64748B' }}>{formatDate(h.fecha)}</TableCell>
                          <TableCell sx={{ color: '#475569' }}>{h.formato}</TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: 1.2,
                                py: 0.3,
                                borderRadius: '999px',
                                bgcolor: statusBadge.bg,
                                color: statusBadge.color,
                                fontSize: '11.5px',
                                fontWeight: 700,
                              }}
                            >
                              {statusBadge.label}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DownloadIcon sx={{ fontSize: '16px !important' }} />}
                              onClick={() => handleDownloadDoc({ id: h.reporteId, name: h.reporteName })}
                              sx={{
                                color: '#1E2875',
                                borderColor: '#CBD5E1',
                                borderRadius: '6px',
                                textTransform: 'none',
                                fontWeight: 600,
                                '&:hover': { borderColor: '#1E2875', bgcolor: 'rgba(30, 40, 117, 0.04)' },
                              }}
                            >
                              Descargar
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Paginación */}
            {totalHistPages > 1 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <Button
                  size="small"
                  disabled={histPage === 1}
                  onClick={() => setHistPage(histPage - 1)}
                  sx={{ minWidth: 32, p: 0.5 }}
                >
                  ‹
                </Button>
                {Array.from({ length: totalHistPages }, (_, i) => i + 1).map((p) => (
                  <Button
                    key={p}
                    size="small"
                    variant={p === histPage ? 'contained' : 'outlined'}
                    onClick={() => setHistPage(p)}
                    sx={{
                      minWidth: 32,
                      p: 0.5,
                      bgcolor: p === histPage ? '#1E2875' : '#FFFFFF',
                      color: p === histPage ? '#FFFFFF' : '#1E2875',
                      borderColor: '#CBD5E1',
                    }}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  size="small"
                  disabled={histPage === totalHistPages}
                  onClick={() => setHistPage(histPage + 1)}
                  sx={{ minWidth: 32, p: 0.5 }}
                >
                  ›
                </Button>
                <Typography variant="caption" sx={{ color: '#64748B', ml: 1 }}>
                  {filteredHistorial.length} ejecuciones totales
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Botón Flotante de Ayuda (?) */}
      <IconButton className="no-print" sx={styles.floatingHelpButton} onClick={() => setOpenHelpDialog(true)}>
        <HelpIcon />
      </IconButton>

      {/* Centro de Ayuda (FAQ) Modal */}
      <Dialog
        open={openHelpDialog}
        onClose={() => setOpenHelpDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '14px', p: 1 } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2875' }}>
            Centro de Ayuda — Módulo de Reportes
          </Typography>
          <IconButton onClick={() => setOpenHelpDialog(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Accordion disableGutters elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1E2875' }}>
                ¿Cómo creo un nuevo reporte?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                Haz clic en el botón principal «Crear reporte». Sigue los 4 pasos del asistente: define el nombre y área, selecciona los indicadores que deseas incluir con sus desagregaciones, ajusta el período de años y filtros temáticos, y finalmente escoge el formato de salida (Excel o PDF).
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion disableGutters elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1E2875' }}>
                ¿Qué diferencia hay entre un reporte predefinido y mis reportes?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                Los reportes predefinidos son plantillas base institucionales configuradas para cada departamento. Puedes usarlos como punto de partida presionando «Usar como base». «Mis reportes» contiene los reportes personalizados que tú o tu equipo han guardado.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion disableGutters elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1E2875' }}>
                ¿Dónde puedo ver las descargas anteriores?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                Puedes presionar el botón «Historial» en la cabecera principal o en el menú de cada tarjeta para consultar las fechas, estados de generación y volver a descargar el archivo en cualquier momento.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
      </Dialog>

        {/* Notificación Toast */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} sx={{ width: '100%', borderRadius: '8px' }}>
            {toastMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};
