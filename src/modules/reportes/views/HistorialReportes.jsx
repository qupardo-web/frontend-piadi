import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Typography,
  Grid,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassIcon,
  ErrorOutline as ErrorIcon,
  History as HistoryIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  FilterAltOff as ClearFilterIcon,
  Description as ReportIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Header, Sidebar, CentroDeAyuda } from '../../../components';
import { useHistorialReportes } from './HistorialReportes.hooks';
import { styles } from './HistorialReportes.styles';

const historialLightTheme = createTheme({
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
      primary: '#1E293B',
      secondary: '#64748B',
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
          color: '#1E293B',
        },
        select: {
          color: '#1E293B',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: '#1E293B',
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
          color: '#1E293B',
        },
        input: {
          color: '#1E293B',
          '&::placeholder': {
            color: '#64748B !important',
            opacity: '1 !important',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: '#1E293B',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          '& fieldset': {
            borderColor: '#CBD5E1',
          },
          '&:hover fieldset': {
            borderColor: '#94A3B8',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#1E2875',
          },
        },
        input: {
          color: '#1E293B',
          '&::placeholder': {
            color: '#64748B !important',
            opacity: '1 !important',
          },
        },
      },
    },
  },
});

export const HistorialReportes = () => {
  const navigate = useNavigate();
  const {
    loading,
    downloadingId,
    ejecuciones,
    totalRecords,
    reportesList,
    searchTerm,
    setSearchTerm,
    selectedReporteId,
    setSelectedReporteId,
    selectedEstado,
    setSelectedEstado,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    kpis,
    toast,
    closeToast,
    fetchEjecuciones,
    formatFecha,
    handleDescargar,
    handleResetFilters,
    filtersCollapsed,
    setFiltersCollapsed,
  } = useHistorialReportes();

  return (
    <ThemeProvider theme={historialLightTheme}>
      <Box sx={styles.mainLayout}>
        {/* Sidebar Fijo Lateral */}
        <Box sx={styles.sidebar}>
          <Sidebar activeMenu="Reportes" />
        </Box>

      {/* Área de Contenido Principal */}
      <Box sx={styles.contentArea}>
        <Header
          title="Historial de Ejecuciones de Reportes"
          subtitle="Registro de auditoría de descargas y re-descarga de archivos generados sin recalcular"
          icon={<HistoryIcon />}
          iconColor="#FFFFFF"
          breadcrumbs={[
            { label: 'Inicio', path: '/' },
            { label: 'Reportes', path: '/reportes' },
            { label: 'Historial de Ejecuciones', path: null },
          ]}
          rightAction={
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/reportes')}
                sx={{
                  color: '#1E2875',
                  borderColor: '#CBD5E1',
                  bgcolor: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  '&:hover': {
                    borderColor: '#1E2875',
                    bgcolor: '#F8FAFC',
                  },
                }}
              >
                Volver a Reportes
              </Button>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={fetchEjecuciones}
                disabled={loading}
                sx={{
                  bgcolor: '#1E2875',
                  color: '#FFFFFF',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: '8px',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#161F58',
                  },
                }}
              >
                Actualizar
              </Button>
            </Box>
          }
          sx={{ mb: 3 }}
        />

        {/* Tarjetas KPI de Resumen */}
        <Grid container spacing={2} sx={styles.kpiGrid}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.kpiCard} elevation={0}>
              <Box sx={styles.kpiIconWrapper('#1E2875', '#EFF6FF')}>
                <HistoryIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  Total Ejecuciones
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E2875' }}>
                  {kpis.total}
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.kpiCard} elevation={0}>
              <Box sx={styles.kpiIconWrapper('#10B981', '#ECFDF5')}>
                <CheckCircleIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  Completadas con Éxito
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#10B981' }}>
                  {kpis.listos}
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.kpiCard} elevation={0}>
              <Box sx={styles.kpiIconWrapper('#3B82F6', '#EFF6FF')}>
                <HourglassIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  En Proceso / Pendientes
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#3B82F6' }}>
                  {kpis.enProceso}
                </Typography>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.kpiCard} elevation={0}>
              <Box sx={styles.kpiIconWrapper('#EF4444', '#FEF2F2')}>
                <ErrorIcon />
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>
                  Con Errores
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#EF4444' }}>
                  {kpis.errores}
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>

        {/* Tarjeta de Filtros Colapsable */}
        <Card sx={styles.filterCard} elevation={0}>
          <Box sx={styles.filterHeader}>
            <Typography sx={styles.filterTitle}>
              <FilterIcon sx={{ color: '#1E2875', fontSize: 20 }} />
              Filtrar ejecuciones por:
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {(searchTerm || selectedReporteId !== 'todos' || selectedEstado !== 'todos' || fromDate || toDate) && (
                <Button
                  size="small"
                  onClick={handleResetFilters}
                  startIcon={<ClearFilterIcon />}
                  sx={{
                    color: '#64748B',
                    textTransform: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    mr: 1,
                    '&:hover': { color: '#1E2875' },
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
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
          </Box>

          {!filtersCollapsed && (
            <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid #F1F5F9' }}>
              <Grid container spacing={2} alignItems="center">
                {/* Buscador de texto */}
                <Grid item xs={12} sm={6} md={3.5}>
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Búsqueda general
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar por reporte, archivo o usuario…"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: '#64748B', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      bgcolor: '#FFFFFF',
                      borderRadius: '8px',
                      '& .MuiInputBase-input': {
                        color: '#1E293B',
                        fontSize: '13.5px',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: '#64748B !important',
                        opacity: '1 !important',
                      },
                    }}
                  />
                </Grid>

                {/* Selector de Reporte */}
                <Grid item xs={12} sm={6} md={2.5}>
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Filtrar por Reporte
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedReporteId}
                      onChange={(e) => {
                        setSelectedReporteId(e.target.value);
                        setPage(1);
                      }}
                      sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: '8px',
                        color: '#1E293B',
                        fontSize: '13.5px',
                      }}
                    >
                      <MenuItem value="todos">Todos los reportes</MenuItem>
                      {reportesList.map((r) => (
                        <MenuItem key={r.id} value={r.id}>
                          {r.nombre || r.name || `Reporte #${r.id}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Selector de Estado */}
                <Grid item xs={12} sm={4} md={2}>
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Estado
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={selectedEstado}
                      onChange={(e) => {
                        setSelectedEstado(e.target.value);
                        setPage(1);
                      }}
                      sx={{
                        bgcolor: '#FFFFFF',
                        borderRadius: '8px',
                        color: '#1E293B',
                        fontSize: '13.5px',
                      }}
                    >
                      <MenuItem value="todos">Todos los estados</MenuItem>
                      <MenuItem value="LISTO">Listo (Exitoso)</MenuItem>
                      <MenuItem value="GENERANDO">Generando</MenuItem>
                      <MenuItem value="PENDIENTE">Pendiente</MenuItem>
                      <MenuItem value="ERROR">Error</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Rango de Fechas */}
                <Grid item xs={6} sm={4} md={2}>
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Desde
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setPage(1);
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      bgcolor: '#FFFFFF',
                      borderRadius: '8px',
                      '& .MuiInputBase-input': {
                        color: '#1E293B',
                        fontSize: '13.5px',
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={6} sm={4} md={2}>
                  <Typography variant="caption" sx={{ color: '#475569', fontWeight: 600, mb: 0.5, display: 'block' }}>
                    Hasta
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setPage(1);
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      bgcolor: '#FFFFFF',
                      borderRadius: '8px',
                      '& .MuiInputBase-input': {
                        color: '#1E293B',
                        fontSize: '13.5px',
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Card>

        {/* Tabla de Ejecuciones */}
        <Card sx={styles.tableCard} elevation={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeaderCell} style={{ width: '80px' }}>
                    # ID
                  </TableCell>
                  <TableCell sx={styles.tableHeaderCell}>Reporte</TableCell>
                  <TableCell sx={styles.tableHeaderCell}>Solicitante</TableCell>
                  <TableCell sx={styles.tableHeaderCell}>Fecha y Hora</TableCell>
                  <TableCell sx={styles.tableHeaderCell} align="center" style={{ width: '100px' }}>
                    Formato
                  </TableCell>
                  <TableCell sx={styles.tableHeaderCell} align="center" style={{ width: '130px' }}>
                    Estado
                  </TableCell>
                  <TableCell sx={styles.tableHeaderCell} align="center" style={{ width: '120px' }}>
                    Acción
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} sx={{ color: '#1E2875', mb: 1.5 }} />
                      <Typography variant="body2" sx={{ color: '#64748B' }}>
                        Cargando historial de ejecuciones…
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : ejecuciones.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <ReportIcon sx={{ fontSize: 44, color: '#94A3B8', mb: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1E2875' }}>
                        No se encontraron ejecuciones
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
                        No hay registros que coincidan con los filtros aplicados.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  ejecuciones.map((ejec) => {
                    const repNombre =
                      ejec.reporte?.nombre ||
                      reportesList.find((r) => String(r.id) === String(ejec.reporteId))?.nombre ||
                      `Reporte #${ejec.reporteId || ejec.id}`;

                    const solicitanteName = ejec.solicitante?.name || 'Sistema / Sin registro';
                    const solicitanteEmail = ejec.solicitante?.email || '';

                    const isAvailable = ejec.archivoDisponible === true;
                    const isDownloading = downloadingId === ejec.id;

                    return (
                      <TableRow key={ejec.id} sx={styles.tableRow}>
                        <TableCell sx={styles.tableCell}>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                            #{ejec.id}
                          </Typography>
                        </TableCell>

                        <TableCell sx={styles.tableCell}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E2875' }}>
                            {repNombre}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block' }}>
                            {ejec.archivoNombre || `ID Reporte: #${ejec.reporteId}`}
                          </Typography>
                        </TableCell>

                        <TableCell sx={styles.tableCell}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: '#334155' }}>
                                {solicitanteName}
                              </Typography>
                              {solicitanteEmail && (
                                <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                                  {solicitanteEmail}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell sx={styles.tableCell}>
                          <Typography variant="body2" sx={{ color: '#475569' }}>
                            {formatFecha(ejec.generadoEn)}
                          </Typography>
                        </TableCell>

                        <TableCell sx={styles.tableCell} align="center">
                          <Box sx={styles.formatBadge}>
                            {(ejec.formato || 'XLSX').toUpperCase()}
                          </Box>
                        </TableCell>

                        <TableCell sx={styles.tableCell} align="center">
                          <Box sx={styles.statusBadge(ejec.estado)}>
                            {ejec.estado === 'LISTO' && <CheckCircleIcon sx={{ fontSize: 14 }} />}
                            {(ejec.estado === 'GENERANDO' || ejec.estado === 'PENDIENTE') && (
                              <HourglassIcon sx={{ fontSize: 14 }} />
                            )}
                            {ejec.estado === 'ERROR' && <ErrorIcon sx={{ fontSize: 14 }} />}
                            {ejec.estado || 'DESCONOCIDO'}
                          </Box>
                        </TableCell>

                        <TableCell sx={styles.tableCell} align="center">
                          {isAvailable ? (
                            <Tooltip title="Descargar archivo original persistido">
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDescargar(ejec)}
                                  disabled={isDownloading}
                                  sx={{
                                    bgcolor: '#EFF6FF',
                                    color: '#1E2875',
                                    border: '1px solid #BFDBFE',
                                    borderRadius: '6px',
                                    '&:hover': {
                                      bgcolor: '#DBEAFE',
                                    },
                                  }}
                                >
                                  {isDownloading ? (
                                    <CircularProgress size={16} sx={{ color: '#1E2875' }} />
                                  ) : (
                                    <DownloadIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </span>
                            </Tooltip>
                          ) : (
                            <Tooltip title="El archivo original no se encuentra almacenado en el servidor (ejecución antigua o archivo depurado)">
                              <span>
                                <IconButton
                                  size="small"
                                  disabled
                                  sx={{
                                    bgcolor: '#F1F5F9',
                                    color: '#CBD5E1',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '6px',
                                  }}
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          <Box sx={styles.paginationContainer}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Mostrando {totalRecords === 0 ? 0 : (page - 1) * rowsPerPage + 1} -{' '}
                {Math.min(page * rowsPerPage, totalRecords)} de {totalRecords} registros
              </Typography>

              <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                |
              </Typography>

              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Filas por página:
              </Typography>
              <Select
                size="small"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                sx={{
                  fontSize: '12px',
                  height: 30,
                  bgcolor: '#F8FAFC',
                  borderRadius: '6px',
                }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </Box>

            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              shape="rounded"
              size="small"
            />
          </Box>
        </Card>

        {/* Notificaciones Toast */}
        <Snackbar
          open={toast.open}
          autoHideDuration={4000}
          onClose={closeToast}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={closeToast} severity={toast.severity} sx={{ width: '100%', borderRadius: '8px' }}>
            {toast.message}
          </Alert>
        </Snackbar>

        {/* Centro de Ayuda contextual */}
        <CentroDeAyuda modulo="reportes" />
      </Box>
    </Box>
  </ThemeProvider>
  );
};
