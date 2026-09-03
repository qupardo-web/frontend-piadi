import React from 'react';
import { useVisualizacionMetas } from './VisualizacionMetas.hooks';
import { isRectoriaUser } from '../access';
import { styles } from './VisualizacionMetas.styles';
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
  Menu as MenuIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  CheckCircle as CheckCircleIcon,
  WatchLater as WatchLaterIcon,
  Warning as WarningIcon,
  Adjust as TargetIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';

export const VisualizacionMetas = ({ institutionalOnly = false }) => {
  const {
    navigate,
    user,
    logout,
    activeMenu,
    setActiveMenu,
    mobileOpen,
    setMobileOpen,
    openHelpDialog,
    setOpenHelpDialog,
    filtersVisible,
    handleToggleFilters,
    handleResetFilters,
    searchQuery,
    setSearchQuery,
    filtroDepartamento,
    setFiltroDepartamento,
    filtroEstado,
    setFiltroEstado,
    filtroDesde,
    setFiltroDesde,
    filtroHasta,
    setFiltroHasta,
    sortField,
    sortDir,
    sortMenuOpen,
    setSortMenuOpen,
    handleSortFieldChange,
    handleToggleSortDir,
    paginaActual,
    setPaginaActual,
    totalPages,
    paginatedMetas,
    totalMetas,
    totalMetasOriginal,
    pageSize,
    handleDrawerToggle,
    fmtFecha,
    diasHasta,
    faqData,
    loading,
    error,
    kpis,
    departmentsList,
    deleteDialogOpen,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
  } = useVisualizacionMetas({ institutionalOnly });

  // Sidebar navigation menu options
  const navItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboards', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Metas', icon: <TargetIcon />, path: '/metas' },
    ...(isRectoriaUser(user)
      ? [{ text: 'Metas Institucionales', icon: <TargetIcon />, path: '/metas-institucionales' }]
      : []),
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
  });

  const sidebarContent = (
    <Box sx={styles.drawerContent}>
      <Box>
        {/* Brand/Logo Container */}
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
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, ml: 'auto', color: 'rgba(255,255,255,0.8)' }}
            aria-label="Cerrar menú"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={styles.divider} />

        {/* Menu Navigation */}
        <Box sx={styles.menuContainer}>
          {navItems.map((item) => {
            const isSelected = activeMenu === item.text;
            return (
              <Box
                key={item.text}
                onClick={() => {
                  setActiveMenu(item.text);
                  setMobileOpen(false);
                  navigate(item.path);
                }}
                sx={styles.menuItem(isSelected)}
              >
                <Box className="nav-icon" sx={{ display: 'flex', color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.5)' }}>
                  {item.icon}
                </Box>
                <Typography 
                  variant="body2" 
                  className="nav-text"
                  sx={{ 
                    fontWeight: isSelected ? 600 : 400, 
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

      {/* Sidebar Footer */}
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

  // Sorting Helper Labels
  const sortLabels = {
    prioridad: 'Prioridad',
    fecha: 'Fecha límite',
    progreso: 'Progreso',
    nombre: 'Nombre',
  };

  return (
    <Box sx={styles.mainLayout}>
      {/* Mobile Top AppBar */}
      <AppBar position="fixed" sx={styles.mobileAppBar}>
        <Toolbar sx={styles.mobileToolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ p: 0, width: 40, height: 40 }}
          >
            <MenuIcon sx={{ fontSize: 32 }} />
          </IconButton>
          <Typography variant="h6" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#ffffff' }}>
            PIADI
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Desktop Sidebar */}
      <Box component="nav" sx={styles.sidebar}>
        {sidebarContent}
      </Box>

      {/* Mobile Sidebar Drawer */}
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

      {/* Content Area */}
      <Box component="main" sx={styles.contentArea}>
        {/* Cabecera de la Página */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mb: 4 }}>
          {/* Breadcrumbs */}
          <Box sx={styles.breadcrumb}>
            <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' }, fontSize: '16px' }} onClick={() => navigate('/')}>
              Inicio
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7 }} />
            <Typography variant="body1" sx={styles.breadcrumbCurrent}>
              {institutionalOnly ? 'Metas Institucionales' : 'Metas'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, width: '100%' }}>
            <Box sx={styles.pageHeader}>
              <Box sx={styles.headerIcon}>
                <TargetIcon />
              </Box>
              <Box>
                <Typography variant="h5" sx={styles.pageTitle}>
                  {institutionalOnly ? 'Metas Institucionales' : 'Visualización de Metas'}
                </Typography>
                <Typography variant="body2" sx={styles.pageSubtitle}>
                  {institutionalOnly
                    ? 'Gestiona y da seguimiento a las metas institucionales'
                    : 'Gestiona y da seguimiento a las metas institucionales por área'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* KPIs globales (Solo Rectoría) */}
        {user?.role === 'Rector' && (
          <Box sx={styles.kpiRow}>
            {/* Card 1: Total metas */}
            <Box sx={styles.kpiCard}>
              <Box sx={styles.kpiHeader}>
                <Typography sx={styles.kpiLabel}>Total metas</Typography>
                <Box sx={styles.kpiIcon}>
                  <TargetIcon />
                </Box>
              </Box>
              <Typography sx={styles.kpiValue}>{kpis.total}</Typography>
            </Box>

            {/* Card 2: % Cumplimiento institucional */}
            <Box sx={styles.kpiCard}>
              <Box sx={styles.kpiHeader}>
                <Typography sx={styles.kpiLabel}>% Cumplimiento institucional</Typography>
                <Box sx={styles.kpiIcon}>
                  <CheckCircleIcon />
                </Box>
              </Box>
              <Typography sx={styles.kpiValue}>{kpis.cumplimiento}%</Typography>
            </Box>

            {/* Card 3: Metas en riesgo */}
            <Box sx={styles.kpiCard}>
              <Box sx={styles.kpiHeader}>
                <Typography sx={styles.kpiLabel}>Metas en riesgo</Typography>
                <Box sx={styles.kpiIcon}>
                  <WarningIcon />
                </Box>
              </Box>
              <Typography sx={styles.kpiValue}>{kpis.riesgo}</Typography>
            </Box>
          </Box>
        )}

        {/* Toolbar */}
        <Box sx={styles.toolbar}>
          {/* Button "Crear meta" */}
          <Button 
            variant="contained" 
            sx={styles.createMetaBtn}
            onClick={() => navigate('/meta-form')}
          >
            <Box component="span" sx={{ display: 'flex', mr: 0.5, fontSize: '18px', fontWeight: 'bold' }}>+</Box>
            Crear meta
          </Button>

          {/* Sort Control */}
          <Box sx={styles.sortSelectWrap}>
            <Box 
              component="button" 
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
              sx={styles.sortSelect}
              aria-haspopup="listbox"
              aria-expanded={sortMenuOpen}
            >
              <span style={{ fontWeight: 500 }}>Ordenar por: {sortLabels[sortField]}</span>
              <ExpandMoreIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
            </Box>

            <Box 
              component="button" 
              onClick={handleToggleSortDir}
              sx={styles.sortDirBtn}
              aria-label="Alternar dirección de ordenamiento"
            >
              {sortDir === 'asc' ? (
                <ArrowUpIcon sx={{ fontSize: 18 }} />
              ) : (
                <ArrowDownIcon sx={{ fontSize: 18 }} />
              )}
            </Box>

            {/* Sort Menu Dropdown */}
            {sortMenuOpen && (
              <Box sx={styles.sortMenu} role="listbox">
                {Object.entries(sortLabels).map(([key, label]) => (
                  <Box
                    component="button"
                    key={key}
                    onClick={() => handleSortFieldChange(key)}
                    sx={styles.sortMenuItem(sortField === key)}
                    role="option"
                    aria-selected={sortField === key}
                  >
                    {label}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Search Box */}
          <Box sx={styles.searchBox}>
            <SearchIcon sx={{ color: '#9ca3af', fontSize: 18 }} />
            <Box 
              component="input" 
              type="search"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={styles.searchInput}
              aria-label="Buscar metas"
            />
          </Box>
        </Box>

        {/* Filter Card */}
        <Box sx={styles.filterCard}>
          <Box sx={styles.filterHeader}>
            <Typography variant="h6" sx={styles.filterTitle}>
              <FilterIcon sx={{ fontSize: 18 }} />
              Filtrar por:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Box 
                component="button" 
                onClick={handleResetFilters}
                sx={{
                  bgcolor: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  '&:hover': { bgcolor: '#F1F5F9', color: '#1E2875' }
                }}
              >
                <ResetIcon sx={{ fontSize: 16 }} />
                Limpiar filtros
              </Box>
              <Box 
                component="button" 
                onClick={handleToggleFilters}
                sx={styles.filterToggleBtn}
              >
                {filtersVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
                <ExpandMoreIcon sx={{ fontSize: 16, transform: filtersVisible ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
              </Box>
            </Box>
          </Box>

          {filtersVisible && (
            <Box sx={styles.filterFieldsGrid}>
              {/* Departamento Select */}
              <Box sx={styles.filterField}>
                <Typography component="label" sx={styles.filterLabel} htmlFor="filtro-dept">
                  Departamento
                </Typography>
                <Box 
                  component="select" 
                  id="filtro-dept"
                  value={filtroDepartamento}
                  onChange={(e) => setFiltroDepartamento(e.target.value)}
                  sx={styles.filterInput}
                >
                  <option value="todas">Todas</option>
                  {departmentsList.map((dept) => (
                    <option key={dept.key} value={dept.key}>
                      {dept.name}
                    </option>
                  ))}
                </Box>
              </Box>

              {/* Estado Select */}
              <Box sx={styles.filterField}>
                <Typography component="label" sx={styles.filterLabel} htmlFor="filtro-estado">
                  Estado
                </Typography>
                <Box 
                  component="select" 
                  id="filtro-estado"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  sx={styles.filterInput}
                >
                  <option value="todos">Todos</option>
                  <option value="en-curso">En progreso</option>
                  <option value="completada">Completada</option>
                  <option value="alerta">Requiere atención</option>
                </Box>
              </Box>

              {/* Fecha Inicio Input */}
              <Box sx={styles.filterField}>
                <Typography component="label" sx={styles.filterLabel} htmlFor="filtro-desde">
                  Fecha de inicio
                </Typography>
                <Box 
                  component="input" 
                  type="date"
                  id="filtro-desde"
                  value={filtroDesde}
                  onChange={(e) => setFiltroDesde(e.target.value)}
                  sx={styles.filterInput}
                />
              </Box>

              {/* Fecha Límite Input */}
              <Box sx={styles.filterField}>
                <Typography component="label" sx={styles.filterLabel} htmlFor="filtro-hasta">
                  Fecha límite
                </Typography>
                <Box 
                  component="input" 
                  type="date"
                  id="filtro-hasta"
                  value={filtroHasta}
                  onChange={(e) => setFiltroHasta(e.target.value)}
                  sx={styles.filterInput}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Metas List Grid */}
        <Box sx={styles.metasGrid}>
          {loading ? (
            /* Loading State */
            <Box sx={styles.emptyState}>
              <Typography variant="h6" sx={styles.emptyStateTitle}>
                Cargando metas...
              </Typography>
            </Box>
          ) : error ? (
            /* Error State */
            <Box sx={styles.emptyState}>
              <WarningIcon sx={{ fontSize: 48, color: '#ef4444' }} />
              <Typography variant="h6" sx={{ ...styles.emptyStateTitle, color: '#ef4444' }}>
                Error al cargar metas
              </Typography>
              <Typography variant="body2" sx={styles.emptyStateText}>
                {error}
              </Typography>
            </Box>
          ) : paginatedMetas.length === 0 ? (
            /* Empty State */
            <Box sx={styles.emptyState}>
              <TargetIcon sx={{ fontSize: 48, color: '#d1d5db' }} />
              <Typography variant="h6" sx={styles.emptyStateTitle}>
                No se encontraron metas
              </Typography>
              <Typography variant="body2" sx={styles.emptyStateText}>
                Intenta ajustar los filtros o crear una nueva meta
              </Typography>
            </Box>
          ) : (
            /* Meta Cards Map */
            paginatedMetas.map((meta) => {
              const dias = diasHasta(meta.fechaLimite);
              const vence = dias !== null && dias < 15 && meta.progreso < 80;
              
              // Estado labels & icons
              let estadoLabel = 'En progreso';
              let estadoIcon = <WatchLaterIcon sx={{ fontSize: 12 }} />;
              if (meta.estado === 'completada') {
                estadoLabel = 'Completada';
                estadoIcon = <CheckCircleIcon sx={{ fontSize: 12 }} />;
              } else if (meta.estado === 'alerta') {
                estadoLabel = 'Requiere atención';
                estadoIcon = <WarningIcon sx={{ fontSize: 12 }} />;
              }

              // Prioridad labels
              let prioLabel = 'Media';
              if (meta.prioridad === 'alta') prioLabel = 'Alta';
              else if (meta.prioridad === 'baja') prioLabel = 'Baja';

              return (
                <Box 
                  key={meta.id} 
                  sx={styles.metaCard(meta.estado)}
                >
                  <Box sx={styles.metaHeaderGrid}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={styles.metaCardTitle}>
                        {meta.nombre}
                      </Typography>
                      <Typography variant="body2" sx={styles.metaCardArea}>
                        {meta.area}
                      </Typography>
                    </Box>

                    <Box sx={styles.metaHeadRight}>
                      <Box sx={styles.metaBadgesContainer}>
                        <Box sx={styles.estadoBadge(meta.estado)}>
                          {estadoIcon}
                          {estadoLabel}
                        </Box>
                        <Box sx={styles.prioridadBadge(meta.prioridad)}>
                          <span className="dot"></span>
                          {prioLabel}
                        </Box>
                      </Box>

                      {/* Action buttons (CRUD placeholders) */}
                      <Box sx={styles.actionBtns}>
                        <Button 
                          sx={styles.iconActionBtn('edit')}
                          aria-label="Editar meta"
                          onClick={() => navigate(`/meta-form/${meta.id}`)}
                        >
                          <EditIcon sx={{ fontSize: 16 }} />
                        </Button>
                        <Button 
                          sx={styles.iconActionBtn('delete')}
                          aria-label="Eliminar meta"
                          onClick={() => handleOpenDeleteDialog(meta.id)}
                        >
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </Button>
                      </Box>
                    </Box>
                  </Box>

                  {/* Progress Section */}
                  <Box sx={styles.metaProgress}>
                    <Box sx={styles.progressRow}>
                      <Typography variant="body2" sx={styles.progressLabel}>
                        {meta.comportamiento === 'debe-mantenerse-en-rango' ? (
                          <>
                            Progreso: <strong>{meta.actual}{meta.tipoValor === 'percentage' || meta.tipoValor === 'porcentaje' || meta.tipoValor === 'porcentual' ? '%' : ''}</strong> (Rango: {meta.lowerLimit} - {meta.upperLimit}{meta.tipoValor === 'percentage' || meta.tipoValor === 'porcentaje' || meta.tipoValor === 'porcentual' ? '%' : ''})
                          </>
                        ) : (
                          <>
                            Progreso: <strong>{meta.actual}{meta.tipoValor === 'percentage' || meta.tipoValor === 'porcentaje' || meta.tipoValor === 'porcentual' ? '%' : ''}</strong> / {meta.objetivo}{meta.tipoValor === 'percentage' || meta.tipoValor === 'porcentaje' || meta.tipoValor === 'porcentual' ? '%' : ''}
                          </>
                        )}
                      </Typography>
                      <Typography sx={styles.progressPct}>
                        {meta.progreso.toFixed(2)}%
                      </Typography>
                    </Box>
                    
                    <Box sx={styles.progressBarContainer}>
                      <Box sx={styles.progressBarFill(meta.estado, meta.progreso)} />
                    </Box>

                    {vence && (
                      <Box sx={styles.venceLine}>
                        <WatchLaterIcon sx={{ fontSize: 13 }} />
                        <span>Vence en {dias} día{dias === 1 ? '' : 's'}</span>
                      </Box>
                    )}
                  </Box>

                  {/* Footer Info Dates */}
                  <Box sx={styles.cardFoot}>
                    <Box sx={styles.dateItem}>
                      <CalendarIcon sx={{ fontSize: 14 }} />
                      <span>Fecha de inicio: {fmtFecha(meta.inicio)}</span>
                    </Box>
                    <Box sx={styles.dateItem}>
                      <CalendarIcon sx={{ fontSize: 14 }} />
                      <span>Fecha límite: {fmtFecha(meta.fechaLimite)}</span>
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </Box>

        {/* Pagination Section */}
        {totalMetas > pageSize && (
          <Box sx={styles.paginationSection}>
            <Box component="ul" sx={styles.paginationList}>
              <li>
                <Button
                  onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                  disabled={paginaActual === 1}
                  sx={styles.paginationBtn(false)}
                  startIcon={<ChevronLeftIcon sx={{ fontSize: 16 }} />}
                >
                  Anterior
                </Button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <li key={pg}>
                  <Button
                    onClick={() => setPaginaActual(pg)}
                    sx={styles.paginationBtn(paginaActual === pg)}
                  >
                    {pg}
                  </Button>
                </li>
              ))}

              <li>
                <Button
                  onClick={() => setPaginaActual(prev => Math.min(totalPages, prev + 1))}
                  disabled={paginaActual === totalPages}
                  sx={styles.paginationBtn(false)}
                  endIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
                >
                  Siguiente
                </Button>
              </li>
            </Box>
          </Box>
        )}

        {/* Counters */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography variant="body2" sx={styles.metasCounter}>
            {totalMetas === 0 ? (
              `Mostrando 0 de ${totalMetasOriginal} metas`
            ) : (
              `Mostrando ${Math.min((paginaActual - 1) * pageSize + 1, totalMetas)}-${Math.min(paginaActual * pageSize, totalMetas)} de ${totalMetas} metas`
            )}
          </Typography>
        </Box>
      </Box>

      {/* Floating Help Button */}
      <IconButton
        onClick={() => setOpenHelpDialog(true)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#1E2875',
          color: '#ffffff',
          boxShadow: '0 4px 10px rgba(30, 40, 117, 0.3)',
          '&:hover': {
            bgcolor: '#1560d3',
          },
        }}
        aria-label="Abrir centro de ayuda"
      >
        <HelpIcon />
      </IconButton>

      {/* Help Dialog Modal */}
      <Dialog
        open={openHelpDialog}
        onClose={() => setOpenHelpDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, p: 1, bgcolor: '#ffffff', color: '#111827', border: '1px solid #e5e7eb' },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: '#1E2875' }}>
            Centro de Ayuda - Metas
          </Typography>
          <IconButton onClick={() => setOpenHelpDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {faqData.map((faq, index) => (
              <Accordion 
                key={index}
                elevation={0}
                sx={{
                  bgcolor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px !important',
                  mb: 1,
                  '&::before': { display: 'none' },
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E2875' }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ borderTop: '1px solid #e5e7eb', pt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#070c12' }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}

            {/* Banner info badge tip */}
            <Box 
              sx={{
                bgcolor: '#F0FDF4',
                border: '1px solid #1DC2A0',
                borderRadius: 2,
                p: 2,
                mt: 1,
              }}
            >
              <Typography variant="caption" sx={{ color: '#15803d', fontWeight: 600, display: 'block', mb: 0.5 }}>
                💡 Tip de Gestión:
              </Typography>
              <Typography variant="body2" sx={{ color: '#166534', fontSize: '13px' }}>
                Las metas en estado "Requiere atención" (alerta) tienen un progreso significativamente inferior al esperado para su fecha límite. ¡Revísalas periódicamente!
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2, bgcolor: '#ffffff', color: '#111827', textAlign: 'center' } }}
      >
        <DialogTitle sx={{ m: 0, p: 1, display: 'flex', justifyContent: 'flex-end', pb: 0 }}>
          <IconButton onClick={handleCloseDeleteDialog} size="small" sx={{ color: '#6b7280' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3, pt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', mb: 1 }}>
            <WarningIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif" }}>
            ¿Eliminar esta meta?
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}>
            Esta acción es permanente y eliminará todas las métricas y ponderaciones asociadas.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2, width: '100%' }}>
            <Button
              onClick={handleCloseDeleteDialog}
              variant="outlined"
              fullWidth
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600,
                color: '#4b5563',
                borderColor: '#d1d5db',
                fontFamily: "'Inter', sans-serif",
                '&:hover': {
                  bgcolor: '#f3f4f6',
                  borderColor: '#9ca3af',
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#ef4444',
                color: '#ffffff',
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                '&:hover': {
                  bgcolor: '#dc2626',
                }
              }}
            >
              Eliminar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
