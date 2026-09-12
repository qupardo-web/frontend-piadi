import React from 'react';
import { useAuditoria } from './Auditoria.hooks';
import { styles } from './Auditoria.styles';
import { Header, Sidebar } from '../../../components';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Shield as AuditoriaIcon,
  Help as HelpIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as ExportIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

export const Auditoria = () => {
  const {
    activeTab,
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    filterRole,
    setFilterRole,
    filterDesde,
    setFilterDesde,
    filterHasta,
    setFilterHasta,
    sortKey,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    openHelpDialog,
    setOpenHelpDialog,
    faqData,
    handleTabChange,
    roleOptions,
    filteredLogs,
    totalPages,
    paginatedLogs,
    canExportCsv,
    handleExportCsv,
    isLoading,
    loadError,
  } = useAuditoria();

  const getActionBadgeStyle = (action) => {
    if (action === 'Carga' || action === 'Carga de plantilla') return styles.badgeCarga;
    if (action === 'Creación') return styles.badgeCreacion;
    if (action === 'Edición') return styles.badgeEdicion;
    if (action === 'Modificación departamental por Rectoría') return styles.badgeEdicion;
    if (action === 'Eliminación') return styles.badgeEliminacion;
    if (action === 'Inicio sesión' || action === 'Inicio de sesión exitoso') return styles.badgeInicioSesion;
    if (
      action === 'Inicio fallido' ||
      action === 'Inicio de sesión fallido' ||
      action === 'Cierre sesión' ||
      action === 'Cierre de sesión'
    ) {
      return styles.badgeCierreSesion;
    }
    return styles.badgeLogin;
  };

  const renderSortIndicator = (key) => (
    sortKey === key ? (
      <Box component="span" sx={{ ml: 0.75, fontSize: '12px', color: '#0F4AFF' }}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </Box>
    ) : null
  );

  const sortableHeaderProps = (key) => ({
    sx: { ...styles.tableHeadCell, cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' },
    role: 'button',
    tabIndex: 0,
    onClick: () => handleSort(key),
    onKeyDown: (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSort(key);
      }
    },
  });

  return (
    <Box sx={styles.mainLayout}>
      {/* SIDEBAR TRANSVERSAL (Escritorio + Drawer + AppBar Móvil) */}
      <Sidebar />

      {/* =========================================================================
          SECCIÓN 2: ÁREA DE CONTENIDO (DERECHA)
          ========================================================================= */}
      <Box component="main" sx={styles.contentArea}>
        
        {/* Cabecera del Panel Principal */}
        <Header
          title="Auditoría del Sistema"
          subtitle="Registro completo de todas las acciones realizadas en el sistema"
          icon={<AuditoriaIcon />}
          iconColor="#FFFFFF"
          breadcrumbs={[
            { label: 'Inicio', path: '/' },
            { label: 'Auditoría', path: null },
          ]}
        />

        {/* Tarjeta de Búsqueda y Filtros Desplegables */}
        <Box sx={styles.filterCard}>
          {/* Barra de Acciones: Buscador + Botones */}
          <Box sx={styles.actionsBar}>
            <TextField
              sx={styles.searchField}
              placeholder="Buscar por usuario, entidad, plantilla..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#94A3B8' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
              <Button 
                startIcon={<FilterIcon />} 
                sx={styles.filterButton}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtrar
              </Button>
              <Button
                startIcon={<ExportIcon />}
                sx={styles.exportButton}
                onClick={handleExportCsv}
                disabled={!canExportCsv}
              >
                Exportar
              </Button>
            </Box>
          </Box>

          {/* Menú de Filtros Desplegable */}
          {showFilters && (
            <Box sx={styles.filterRow}>
              {/* Filtro: Rol */}
              <Box sx={styles.filterInputContainer}>
                <Typography sx={styles.filterLabel}>Rol:</Typography>
                <FormControl fullWidth size="small">
                  <Select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    sx={styles.filterSelect}
                  >
                    <MenuItem value="Todos">Todos</MenuItem>
                    {roleOptions.map((role) => (
                      <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Filtro: Desde (Fecha) */}
              <Box sx={styles.filterInputContainer}>
                <Typography sx={styles.filterLabel}>Desde:</Typography>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  value={filterDesde}
                  onChange={(e) => setFilterDesde(e.target.value)}
                  sx={styles.filterDateInput}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              {/* Filtro: Hasta (Fecha) */}
              <Box sx={styles.filterInputContainer}>
                <Typography sx={styles.filterLabel}>Hasta:</Typography>
                <TextField
                  type="date"
                  fullWidth
                  size="small"
                  value={filterHasta}
                  onChange={(e) => setFilterHasta(e.target.value)}
                  sx={styles.filterDateInput}
                  InputLabelProps={{ shrink: true }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Tarjeta de Contenedor de Registros con Pestañas (Tabs) */}
        <Card sx={styles.sectionCard}>
          <Box sx={styles.tabsContainer}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              sx={styles.tabsList}
            >
              <Tab value="carga" label="Carga de datos" />
              <Tab value="session" label="Inicios de sesión" />
              <Tab value="metas" label="Metas" />
            </Tabs>
          </Box>

          {/* Contador de registros */}
          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '14px', mt: -1 }}>
            Mostrando 1 - {filteredLogs.length} de {filteredLogs.length} registros
          </Typography>

          {/* -------------------------------------------------------------------------
              VISTA ESCRITORIO: TABLA COMPLETA
              ------------------------------------------------------------------------- */}
          <TableContainer sx={{ ...styles.tableContainer, display: { xs: 'none', md: 'block' } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell {...sortableHeaderProps('fecha')}>
                    Fecha y hora{renderSortIndicator('fecha')}
                  </TableCell>
                  <TableCell {...sortableHeaderProps('usuario')}>
                    Usuario{renderSortIndicator('usuario')}
                  </TableCell>
                  <TableCell {...sortableHeaderProps('rol')}>
                    Rol{renderSortIndicator('rol')}
                  </TableCell>
                  <TableCell {...sortableHeaderProps('accion')}>
                    Acción{renderSortIndicator('accion')}
                  </TableCell>
                  <TableCell {...sortableHeaderProps('entidadRegistros')}>
                    Entidad / Registros{renderSortIndicator('entidadRegistros')}
                  </TableCell>
                  {activeTab === 'carga' ? (
                    <>
                      <TableCell {...sortableHeaderProps('plantilla')}>
                        Plantilla{renderSortIndicator('plantilla')}
                      </TableCell>
                      <TableCell {...sortableHeaderProps('archivo')}>
                        Archivo de origen{renderSortIndicator('archivo')}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell {...sortableHeaderProps('detalle')}>
                        Detalles{renderSortIndicator('detalle')}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={activeTab === 'carga' ? 7 : 6} sx={{ textAlign: 'center', color: '#94A3B8', py: 4, fontSize: '14px' }}>
                      {isLoading
                        ? 'Cargando registros...'
                        : loadError
                          ? 'No se pudieron cargar los registros de auditoría.'
                          : activeTab === 'session'
                            ? 'No hay registros de sesión disponibles.'
                            : activeTab === 'metas'
                              ? 'No hay registros de Metas disponibles.'
                              : 'No hay registros disponibles.'}
                    </TableCell>
                  </TableRow>
                )}
                {filteredLogs.map((log, index) => (
                  <TableRow key={index} hover>
                    {/* Fecha y hora */}
                    <TableCell sx={styles.tableBodyCell}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                        <Typography sx={{ fontSize: '14px' }}>{log.fecha}</Typography>
                      </Box>
                    </TableCell>

                    {/* Usuario */}
                    <TableCell sx={styles.tableBodyCell}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                        <Typography sx={{ fontSize: '14px' }}>{log.usuario}</Typography>
                      </Box>
                    </TableCell>

                    {/* Rol */}
                    <TableCell sx={styles.tableBodyCell}>{log.rol}</TableCell>

                    {/* Acción */}
                    <TableCell sx={styles.tableBodyCell}>
                      <Box sx={getActionBadgeStyle(log.accion)}>
                        {log.accion}
                      </Box>
                    </TableCell>

                    {/* Entidad / Registros */}
                    <TableCell sx={styles.tableBodyCell}>
                      <Box>
                        <Typography sx={styles.entidadBold}>{log.entidad}</Typography>
                        <Typography sx={styles.entidadSub}>{log.registros} registros</Typography>
                      </Box>
                    </TableCell>

                    {/* Columnas específicas */}
                    {activeTab === 'carga' ? (
                      <>
                        <TableCell sx={styles.tableBodyCell}>{log.plantilla}</TableCell>
                        <TableCell sx={styles.tableBodyCell}>
                          <Box component="a" href="#" sx={styles.fileLink}>
                            <DescriptionIcon sx={{ fontSize: 16 }} />
                            {log.archivo}
                          </Box>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell sx={styles.tableBodyCell}>{log.detalle}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* -------------------------------------------------------------------------
              VISTA MÓVIL: DISEÑO DE TARJETAS RESPONSIVO
              ------------------------------------------------------------------------- */}
          <Box sx={styles.mobileCardsContainer}>
            {filteredLogs.length === 0 && (
              <Typography sx={{ textAlign: 'center', color: '#94A3B8', py: 3, fontSize: '14px' }}>
                {isLoading
                  ? 'Cargando registros...'
                  : loadError
                    ? 'No se pudieron cargar los registros de auditoría.'
                    : activeTab === 'session'
                      ? 'No hay registros de sesión disponibles.'
                      : activeTab === 'metas'
                        ? 'No hay registros de Metas disponibles.'
                        : 'No hay registros disponibles.'}
              </Typography>
            )}
            {paginatedLogs.map((log, index) => (
              <Box key={index} sx={styles.mobileAuditCard}>
                <Box sx={styles.mobileCardHeader}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0, flexGrow: 1, overflow: 'hidden' }}>
                    {activeTab === 'carga' ? (
                      <Box component="a" href="#" sx={styles.mobileFileLink}>
                        <DescriptionIcon sx={{ fontSize: 16, flexShrink: 0 }} />
                        <Box component="span" sx={styles.mobileFileLinkText}>
                          {log.archivo}
                        </Box>
                      </Box>
                    ) : (
                      <Typography sx={styles.entidadBold}>{log.entidad}</Typography>
                    )}
                  </Box>
                  <Box sx={getActionBadgeStyle(log.accion)}>
                    {log.accion}
                  </Box>
                </Box>

                <Box sx={styles.mobileMetadataRow}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={styles.metadataItem}>
                      <PersonIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                      <Typography variant="body2" sx={{ fontSize: '12px', color: '#475569' }}>
                        {log.usuario} ({log.rol})
                      </Typography>
                    </Box>
                    <Box sx={styles.metadataItem}>
                      <CalendarIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                      <Typography variant="body2" sx={{ fontSize: '12px', color: '#475569' }}>
                        {log.fecha}
                      </Typography>
                    </Box>
                    {activeTab === 'carga' ? (
                      <Box sx={styles.metadataItem}>
                        <DescriptionIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                        <Typography variant="body2" sx={{ fontSize: '12px', color: '#475569' }}>
                          Plantilla: {log.plantilla} | {log.registros} registros
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={styles.metadataItem}>
                        <DescriptionIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                        <Typography variant="body2" sx={{ fontSize: '12px', color: '#475569' }}>
                          {log.entidad} | {log.registros} registros
                        </Typography>
                      </Box>
                    )}
                    {log.detalle && (
                      <Typography variant="body2" sx={{ fontSize: '12px', color: '#475569', mt: 0.5, pl: 3.2 }}>
                        Detalle: {log.detalle}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}

            {/* Paginación móvil */}
            {totalPages > 1 && (
              <Box sx={styles.paginationContainer}>
                <IconButton 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  sx={styles.paginationArrow}
                  size="small"
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>
                
                <Typography sx={styles.paginationDot}>...</Typography>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Typography
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    sx={styles.paginationPage(currentPage === pageNum)}
                  >
                    {pageNum}
                  </Typography>
                ))}
                
                <Typography sx={styles.paginationDot}>...</Typography>
                
                <IconButton 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  sx={styles.paginationArrow}
                  size="small"
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

        </Card>
      </Box>

      {/* Botón flotante de ayuda */}
      <IconButton sx={styles.floatingHelpButton} onClick={() => setOpenHelpDialog(true)}>
        <HelpIcon />
      </IconButton>

      {/* =========================================================================
          DIÁLOGO: CENTRO DE AYUDA (FAQ)
          ========================================================================= */}
      <Dialog
        open={openHelpDialog}
        onClose={() => setOpenHelpDialog(false)}
        PaperProps={{ sx: styles.helpDialogPaper }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ p: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography sx={styles.helpDialogTitle}>Centro de Ayuda</Typography>
            <Typography sx={styles.helpDialogSubtitle}>
              Encuentra respuestas a preguntas frecuentes sobre PIADI ECAS
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenHelpDialog(false)} sx={{ color: '#94A3B8', mt: -1 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflowY: 'auto', maxHeight: '60vh' }}>
          {faqData.map((faq, idx) => (
            <Accordion key={idx} disableGutters elevation={0} sx={styles.helpAccordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#6B7280' }} />}>
                <Typography sx={styles.helpAccordionQuestion}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {faq.isRich ? (
                  <Box sx={{ color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E2875', mb: 0.5, fontFamily: "'Inter', sans-serif" }}>
                      Aporte porcentual a la meta
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      El aporte porcentual define cuánto peso tiene cada métrica dentro del cumplimiento total de la meta. La suma de los aportes de todas las métricas asociadas debe ser exactamente <strong>100%</strong>.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      Por ejemplo, si una meta tiene dos métricas:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2.5, mb: 1.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      <li><strong>Total de matriculados</strong> con un aporte del <strong>70%</strong></li>
                      <li><strong>Tasa de retención</strong> con un aporte del <strong>30%</strong></li>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      El progreso final de la meta será la suma ponderada: si la primera métrica se cumplió al 100% y la segunda al 50%, el avance total será <strong>(100% × 0.7) + (50% × 0.3) = 85%</strong>.
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E2875', mb: 0.5, fontFamily: "'Inter', sans-serif" }}>
                      Valor esperado y comportamiento esperado
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      El <strong>valor esperado</strong> es el umbral que determina si la métrica se cumple o no. Puede expresarse de dos formas:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2.5, mb: 1.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      <li><strong>Numérico (#)</strong>: un conteo absoluto, por ejemplo "200 matriculados".</li>
                      <li><strong>Porcentual (%)</strong>: una proporción, por ejemplo "30% de tasa de abandono".</li>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      El <strong>comportamiento esperado</strong> indica la dirección en que debe moverse el valor real respecto al umbral:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      <li style={{ marginBottom: '8px' }}><strong>Debe superar</strong>: el valor real debe ser mayor o igual al valor esperado para considerar la métrica cumplida. Se usa en indicadores de crecimiento (ej. cantidad de matriculados, cursos ejecutados).</li>
                      <li><strong>No debe superar</strong>: el valor real debe ser menor o igual al valor esperado para considerar la métrica cumplida. Se usa en indicadores que deben mantenerse bajos (ej. tasa de deserción, número de abandonos).</li>
                    </Box>
                  </Box>
                ) : (
                  <Typography sx={styles.helpAccordionAnswer}>{faq.a}</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Tip de ayuda inferior */}
          <Box sx={styles.helpTipContainer}>
            <Typography variant="body2" sx={styles.helpTipText}>
              💡 <strong>Tip:</strong> Puedes acceder a esta ayuda en cualquier momento haciendo clic en el botón "?" en la esquina inferior derecha.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
