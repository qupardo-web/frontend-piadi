import React from 'react';
import { useAuditoria } from './Auditoria.hooks';
import { styles } from './Auditoria.styles';
import logoEcas from '../../../assets/logo_ECAS_white.svg';
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Divider,
  Drawer,
  AppBar,
  Toolbar,
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
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  UploadFile as CargaIcon,
  Shield as AuditoriaIcon,
  ExitToApp as LogoutIcon,
  MoreVert as MoreVertIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
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
    navigate,
    user,
    logout,
    mobileOpen,
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
    activeMenu,
    handleDrawerToggle,
    handleTabChange,
    roleOptions,
    filteredLogs,
    totalPages,
    paginatedLogs,
    canExportCsv,
    handleExportCsv,
  } = useAuditoria();

  const getActionBadgeStyle = (action) => {
    if (action === 'Carga' || action === 'Carga de plantilla') return styles.badgeCarga;
    if (action === 'Creación') return styles.badgeCreacion;
    if (action === 'Edición') return styles.badgeEdicion;
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
    <Box sx={styles.mainLayout}>
      
      {/* =========================================================================
          BARRA DE NAVEGACIÓN SUPERIOR PARA MÓVILES (APPBAR)
          ========================================================================= */}
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
        </Toolbar>
      </AppBar>

      {/* =========================================================================
          SECCIÓN 1A: SIDEBAR PERSISTENTE (ESCRITORIO)
          ========================================================================= */}
      <Box component="nav" sx={styles.sidebar}>
        {sidebarContent}
      </Box>

      {/* =========================================================================
          SECCIÓN 1B: SIDEBAR DESPLEGABLE (MÓVIL)
          ========================================================================= */}
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

      {/* =========================================================================
          SECCIÓN 2: ÁREA DE CONTENIDO (DERECHA)
          ========================================================================= */}
      <Box component="main" sx={styles.contentArea}>
        
        {/* Cabecera del Panel Principal */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, width: '100%' }}>
            <Box sx={styles.panelHeader}>
              <Box sx={styles.panelIconContainer}>
                <AuditoriaIcon />
              </Box>
              <Box>
                <Typography variant="h5" sx={styles.panelTitle}>
                  Auditoría del Sistema
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Registro completo de todas las acciones realizadas en el sistema
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Breadcrumbs de orientación */}
          <Box sx={styles.breadcrumbsContainer}>
            <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/')}>
              Inicio
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7 }} />
            <Typography variant="body1" sx={{ color: '#1E2875', fontWeight: 600 }}>
              Auditoría
            </Typography>
          </Box>
        </Box>

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
                      {activeTab === 'session' ? 'No hay registros de sesión disponibles.' : 'No hay registros disponibles.'}
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
