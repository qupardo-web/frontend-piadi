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
  Switch,
  FormControlLabel,
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
} from '@mui/icons-material';

import { Header, Sidebar } from '../../../components';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  useReportes,
  AREA_COLORS,
  CATALOGO,
  DESAGREGACIONES,
  FILTROS_AREA,
  SAMPLE_INDICATOR_DATA,
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

export const Reportes = () => {
  const {
    navigate,
    user,
    viewMode,
    currentRole,
    setCurrentRole,
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
    handleOpenNewBuilder,
    handleUseAsBase,
    handleEditReport,
    handleAreaChange,
    handleStartGenerate,
    handleSaveBuilder,
    handleOpenHistorial,
    handleBackToList,
    currentPreviewReport,
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
    areaName,
    formatDate,
  } = useReportes();

  // Active kebab report
  const selectedKebabReport = misReportes.find((r) => r.id === kebabTargetId);

  return (
    <ThemeProvider theme={reportesLightTheme}>
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
                  <Select
                    size="small"
                    value={currentRole}
                    onChange={(e) => {
                      setCurrentRole(e.target.value);
                      showToast(`Rol: ${e.target.value === 'admin' ? 'Administrador' : e.target.value === 'jefe' ? 'Jefe de depto' : 'Usuario de área'}`);
                    }}
                    sx={{
                      bgcolor: '#FFFFFF',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      minWidth: 140,
                      height: 38,
                      border: '1px solid #CBD5E1',
                      '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                    }}
                  >
                    <MenuItem value="admin">Rol: Admin</MenuItem>
                    <MenuItem value="jefe">Rol: Jefe de depto</MenuItem>
                    <MenuItem value="area">Rol: Usuario de área</MenuItem>
                  </Select>
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
                        Departamento
                      </Typography>
                      <Select
                        size="small"
                        fullWidth
                        value={filtroDepartamento}
                        onChange={(e) => setFiltroDepartamento(e.target.value)}
                        sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
                      >
                        <MenuItem value="todas">Todos</MenuItem>
                        <MenuItem value="Admisión">Admisión</MenuItem>
                        <MenuItem value="Desarrollo Curricular">Desarrollo Curricular</MenuItem>
                        <MenuItem value="Innovación">Innovación</MenuItem>
                        <MenuItem value="Educación Continua">Educación Continua</MenuItem>
                        <MenuItem value="Vinculación">Vinculación con el Medio</MenuItem>
                        <MenuItem value="Relaciones Estudiantiles">Relaciones Estudiantiles</MenuItem>
                        <MenuItem value="institucional">Institucional</MenuItem>
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
                                onClick={() => handleStartGenerate(r)}
                                sx={{
                                  bgcolor: '#1E2875',
                                  color: '#FFFFFF',
                                  textTransform: 'none',
                                  fontWeight: 600,
                                  borderRadius: '8px',
                                  '&:hover': { bgcolor: '#131a52' },
                                }}
                              >
                                Generar
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
                        Área / Departamento *
                      </Typography>
                      <Select
                        fullWidth
                        size="small"
                        value={builder.area}
                        onChange={(e) => handleAreaChange(e.target.value)}
                        sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
                      >
                        <MenuItem value="Admisión">Admisión</MenuItem>
                        <MenuItem value="Desarrollo Curricular">Desarrollo Curricular</MenuItem>
                        <MenuItem value="Innovación">Innovación</MenuItem>
                        <MenuItem value="Educación Continua">Educación Continua</MenuItem>
                        <MenuItem value="Vinculación">Vinculación con el Medio</MenuItem>
                        <MenuItem value="Relaciones Estudiantiles">Relaciones Estudiantiles</MenuItem>
                        <MenuItem value="institucional">Institucional (Global)</MenuItem>
                      </Select>
                      <Typography variant="caption" sx={{ color: '#64748B', mt: 0.5, display: 'block' }}>
                        Puedes seleccionar cualquier área institucional según tus permisos.
                      </Typography>
                    </Box>
                  </Card>
                )}

                {/* PASO 2: INDICADORES */}
                {builder.step === 2 && (
                  <Card sx={styles.builderCard}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E2875', mb: 2 }}>
                      Selecciona indicadores
                    </Typography>

                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Buscar indicador por nombre o descripción…"
                      value={indicatorSearch}
                      onChange={(e) => setIndicatorSearch(e.target.value)}
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ color: '#94A3B8', mr: 1, fontSize: 20 }} />,
                      }}
                      sx={{ mb: 2.5 }}
                    />

                    <Box sx={{ maxHeight: 460, overflowY: 'auto', pr: 1 }}>
                      {CATALOGO.map((group) => {
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
                              const desags = DESAGREGACIONES[item.id] || [];

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
                                        if (e.target.checked) {
                                          setBuilder({
                                            ...builder,
                                            inds: [...builder.inds, item.id],
                                          });
                                        } else {
                                          setBuilder({
                                            ...builder,
                                            inds: builder.inds.filter((x) => x !== item.id),
                                            desag: builder.desag.filter((x) => !x.startsWith(`${item.id}|`)),
                                          });
                                        }
                                      }}
                                      sx={{ color: '#1E2875', '&.Mui-checked': { color: '#1E2875' }, p: 0.2 }}
                                    />
                                    <Box
                                      onClick={() => {
                                        if (isChecked) {
                                          setBuilder({
                                            ...builder,
                                            inds: builder.inds.filter((x) => x !== item.id),
                                            desag: builder.desag.filter((x) => !x.startsWith(`${item.id}|`)),
                                          });
                                        } else {
                                          setBuilder({
                                            ...builder,
                                            inds: [...builder.inds, item.id],
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
                                  {desags.length > 0 && (
                                    <Box
                                      sx={{
                                        mt: 1.2,
                                        ml: 3.8,
                                        p: 1.2,
                                        bgcolor: '#F8FAFC',
                                        borderRadius: '8px',
                                        border: '1px solid #EDF0F4',
                                      }}
                                    >
                                      <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748B', display: 'block', mb: 0.8 }}>
                                        Desagregar por:
                                      </Typography>
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                        {desags.map((d) => {
                                          const key = `${item.id}|${d}`;
                                          const isSelected = builder.desag.includes(key);

                                          return (
                                            <Button
                                              key={d}
                                              size="small"
                                              disabled={!isChecked}
                                              onClick={() => {
                                                if (isSelected) {
                                                  setBuilder({
                                                    ...builder,
                                                    desag: builder.desag.filter((x) => x !== key),
                                                  });
                                                } else {
                                                  setBuilder({
                                                    ...builder,
                                                    desag: [...builder.desag, key],
                                                  });
                                                }
                                              }}
                                              sx={{
                                                textTransform: 'none',
                                                borderRadius: '999px',
                                                px: 1.5,
                                                py: 0.2,
                                                fontSize: '11.5px',
                                                fontWeight: 600,
                                                bgcolor: isSelected ? '#1E2875' : '#FFFFFF',
                                                color: isSelected ? '#FFFFFF' : '#334155',
                                                border: `1px solid ${isSelected ? '#1E2875' : '#CBD5E1'}`,
                                                '&:hover': {
                                                  bgcolor: isSelected ? '#131a52' : '#F1F5F9',
                                                },
                                              }}
                                            >
                                              {d}
                                            </Button>
                                          );
                                        })}
                                      </Box>
                                    </Box>
                                  )}
                                </Box>
                              );
                            })}
                          </Box>
                        );
                      })}
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
                          <MenuItem value="2023">2023</MenuItem>
                          <MenuItem value="2024">2024</MenuItem>
                          <MenuItem value="2025">2025</MenuItem>
                          <MenuItem value="2026">2026</MenuItem>
                        </Select>
                        <Typography sx={{ color: '#64748B' }}>a</Typography>
                        <Select
                          size="small"
                          fullWidth
                          value={builder.annoMax}
                          onChange={(e) => setBuilder({ ...builder, annoMax: e.target.value })}
                          sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
                        >
                          <MenuItem value="2023">2023</MenuItem>
                          <MenuItem value="2024">2024</MenuItem>
                          <MenuItem value="2025">2025</MenuItem>
                          <MenuItem value="2026">2026</MenuItem>
                        </Select>
                      </Box>
                    </Box>

                    {/* Filtros específicos de área */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E2875', mb: 1.5 }}>
                      Filtros temáticos del área ({areaName(builder.area)})
                    </Typography>

                    {(() => {
                      const areasToRender =
                        builder.area === 'institucional'
                          ? ['Admisión', 'Desarrollo Curricular', 'Innovación', 'Educación Continua', 'Vinculación', 'Relaciones Estudiantiles']
                          : [builder.area];

                      return areasToRender.map((areaKey) => {
                        const cfg = FILTROS_AREA[areaKey];
                        if (!cfg) return null;

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
                              {areaKey}
                            </Typography>

                            {cfg.filtros.map(([filtroName, options]) => (
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
                                          {opt}
                                        </Button>
                                      );
                                    })}
                                  </Box>
                                </AccordionDetails>
                              </Accordion>
                            ))}
                          </Box>
                        );
                      });
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
                          Informe visual formateado A4
                        </Typography>
                      </Box>
                    </Box>

                    {builder.formato === 'pdf' && (
                      <Box
                        sx={{
                          fontSize: '12.5px',
                          color: '#B45309',
                          bgcolor: '#FEF3C7',
                          border: '1px solid #FDE68A',
                          borderRadius: '8px',
                          p: 1.5,
                          mb: 2,
                          lineHeight: 1.4,
                        }}
                      >
                        La vista previa solo está disponible en formato Excel. En PDF el reporte se descargará directamente.
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1, borderTop: '1px solid #F1F5F9' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={builder.graficos}
                            onChange={(e) => setBuilder({ ...builder, graficos: e.target.checked })}
                            sx={{ '& .Mui-checked': { color: '#1E2875' }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#1E2875' } }}
                          />
                        }
                        label={
                          <Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1E2875' }}>
                              Incluir gráficos visuales
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              Añade barras y tendencias por cada indicador
                            </Typography>
                          </Box>
                        }
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={builder.tablas}
                            onChange={(e) => setBuilder({ ...builder, tablas: e.target.checked })}
                            sx={{ '& .Mui-checked': { color: '#1E2875' }, '& .Mui-checked + .MuiSwitch-track': { bgcolor: '#1E2875' } }}
                          />
                        }
                        label={
                          <Box>
                            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1E2875' }}>
                              Incluir tablas de detalle
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              Agrega las matrices numéricas por año y categoría
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
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

                  {builder.step < 4 ? (
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (builder.step === 1 && !builder.nombre.trim()) {
                          showToast('Ingresa un nombre para el reporte', 'warning');
                          return;
                        }
                        if (builder.step === 2 && builder.inds.length === 0) {
                          showToast('Selecciona al menos un indicador', 'warning');
                          return;
                        }
                        setBuilder({ ...builder, step: builder.step + 1 });
                      }}
                      sx={{ bgcolor: '#1E2875', color: '#FFFFFF', textTransform: 'none', borderRadius: '8px' }}
                    >
                      Siguiente
                    </Button>
                  ) : (
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
                        {builder.annoMin} — {builder.annoMax}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Formato</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E2875' }}>
                        {builder.formato === 'excel' ? 'Excel (.xlsx)' : 'PDF Documento'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Indicadores</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1DC2A0' }}>
                        {builder.inds.length} seleccionados
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block', mb: 1 }}>
                    Indicadores incluidos:
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 220, overflowY: 'auto' }}>
                    {builder.inds.length === 0 ? (
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
                            <Typography sx={{ fontSize: '11px', color: '#64748B' }}>
                              1) Por año {activeDesags.length > 0 ? `· 2) Por ${activeDesags.join(', ').toLowerCase()}` : ''}
                            </Typography>
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
                    onClick={handleBackToList}
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
                    onClick={handleDownloadDoc}
                    sx={{
                      bgcolor: '#1E2875',
                      color: '#FFFFFF',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#131a52' },
                    }}
                  >
                    Descargar {currentPreviewReport?.formato?.toUpperCase() || 'PDF'}
                  </Button>
                </Box>
              }
            />

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
                <Paper sx={styles.docPage} elevation={4}>
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
                    const sample = SAMPLE_INDICATOR_DATA[id] || {
                      val: '100',
                      desc: info.desc,
                      table: [['2023', 80], ['2024', 90], ['2025', 95], ['2026', 100]],
                      chart: [80, 90, 95, 100],
                      labels: ['2023', '2024', '2025', '2026'],
                    };

                    const maxVal = Math.max(...sample.chart, 1);

                    return (
                      <Box key={id} sx={{ mb: 4, pt: 2.5, borderTop: '1px solid #E2E8F0' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#1E2875', mb: 0.5 }}>
                          {idx + 1}. {info.name}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#64748B', mb: 1.5 }}>
                          Departamento de {info.dep}
                        </Typography>

                        {/* Valor Destacado */}
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 1.5 }}>
                          <Typography sx={{ fontSize: '26px', fontWeight: 800, color: '#1E2875' }}>
                            {sample.val}
                          </Typography>
                          <Typography sx={{ fontSize: '12.5px', color: '#64748B' }}>
                            (cierre {currentPreviewReport?.annoMax || '2026'})
                          </Typography>
                        </Box>

                        <Typography sx={{ fontSize: '13px', color: '#475569', mb: 2 }}>
                          {sample.desc} Los datos corresponden al seguimiento del período {currentPreviewReport?.annoMin || '2023'} al {currentPreviewReport?.annoMax || '2026'}.
                        </Typography>

                        {/* Gráfico de Barras Documental */}
                        <Box sx={{ p: 2, bgcolor: '#FAFBFC', borderRadius: '8px', border: '1px solid #EDF0F4', mb: 2.5 }}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#1E2875', display: 'block', mb: 1.5 }}>
                            Evolución Anual
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 120, gap: 3, px: 2, pt: 1 }}>
                            {sample.chart.map((val, cIdx) => {
                              const pctHeight = Math.max(10, Math.round((val / maxVal) * 100));
                              return (
                                <Box
                                  key={cIdx}
                                  sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    height: '100%',
                                    justifyContent: 'flex-end',
                                  }}
                                >
                                  <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#1E2875' }}>
                                    {val.toLocaleString('es-CL')}
                                  </Typography>
                                  <Box
                                    sx={{
                                      width: '100%',
                                      maxWidth: 42,
                                      height: `${pctHeight}%`,
                                      bgcolor: '#1E2875',
                                      borderRadius: '4px 4px 0 0',
                                    }}
                                  />
                                  <Typography sx={{ fontSize: '11px', color: '#64748B' }}>
                                    {sample.labels[cIdx]}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>

                        {/* Tabla de Datos */}
                        <TableContainer sx={{ border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                          <Table size="small">
                            <TableHead sx={{ bgcolor: '#F1F5F9' }}>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 700, fontSize: '12px', color: '#1E2875' }}>Período / Desglose</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700, fontSize: '12px', color: '#1E2875' }}>Valor</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {sample.table.map(([label, val], rIdx) => (
                                <TableRow key={rIdx} sx={{ '&:nth-of-type(even)': { bgcolor: '#F8FAFC' } }}>
                                  <TableCell sx={{ fontSize: '12.5px' }}>{label}</TableCell>
                                  <TableCell align="right" sx={{ fontSize: '12.5px', fontWeight: 600 }}>
                                    {val.toLocaleString('es-CL')}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    );
                  })}

                  {/* Pie de Página del Documento */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3, mt: 4, borderTop: '1px solid #E2E8F0', fontSize: '11px', color: '#94A3B8' }}>
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
                              onClick={() => showToast(`Descargando archivo de ${h.reporteName}...`)}
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
      <IconButton sx={styles.floatingHelpButton} onClick={() => setOpenHelpDialog(true)}>
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
