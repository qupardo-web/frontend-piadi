// =========================================================================
// COMPONENTE: MetaForm.jsx
// =========================================================================

import React from 'react';
import { useMetaForm } from './MetaForm.hooks';
import { styles } from './MetaForm.styles';
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
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  UploadFile as CargaIcon,
  Shield as AuditoriaIcon,
  ExitToApp as LogoutIcon,
  Adjust as TargetIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as PreviewIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  Menu as MenuIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapHoriz as RangeIcon,
} from '@mui/icons-material';

export const MetaForm = () => {
  const {
    navigate,
    user,
    logout,
    activeMenu,
    setActiveMenu,
    mobileOpen,
    handleDrawerToggle,
    modo,
    nombre,
    setNombre,
    departamento,
    setDepartamento,
    comportamiento,
    setComportamiento,
    inicio,
    setInicio,
    limite,
    setLimite,
    prioridad,
    setPrioridad,
    creadaPor,
    metricas,
    errors,
    showSaveAlert,
    setShowSaveAlert,
    metricModalOpen,
    setMetricModalOpen,
    previewModalOpen,
    setPreviewModalOpen,
    editMetricIndex,
    metricSearch,
    setMetricSearch,
    metricNombre,
    setMetricNombre,
    metricDropdownOpen,
    setMetricDropdownOpen,
    metricAporte,
    setMetricAporte,
    metricComportamiento,
    setMetricComportamiento,
    metricValorTipo,
    setMetricValorTipo,
    metricValor,
    setMetricValor,
    metricLowerLimit,
    setMetricLowerLimit,
    metricUpperLimit,
    setMetricUpperLimit,
    metricModalError,
    totalAporte,
    filteredMetricsPool,
    handleOpenAddMetric,
    handleOpenEditMetric,
    handleSaveMetric,
    handleDeleteMetric,
    handleSaveMeta,
    handleOpenPreview,
    departmentsList,
    kpisList,
    showSuccessAlert,
    setShowSuccessAlert,
    successMsg,
  } = useMetaForm();

  // Ref and click outside listener to close autocomplete dropdown
  const comboboxRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        setMetricDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setMetricDropdownOpen]);

  // Sidebar navigation menu options (matching layout)
  const navItems = [
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
            const isSelected = activeMenu === item.text || item.text === 'Metas';
            return (
              <Box
                key={item.text}
                onClick={() => {
                  setActiveMenu(item.text);
                  handleDrawerToggle();
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
        </Box>
      </Box>
    </Box>
  );

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
            <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' }, fontSize: '16px' }} onClick={() => navigate('/metas')}>
              Metas
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7 }} />
            <Box component="span" sx={styles.breadcrumbCurrent}>
              Nueva Meta
            </Box>
          </Box>

          <Box sx={styles.pageHeader}>
            <Box sx={styles.headerIconText}>
              <Box sx={styles.headerIcon}>
                <TargetIcon />
              </Box>
              <Box>
                <Typography variant="h5" sx={styles.pageTitle}>
                  Nueva Meta
                </Typography>
                <Typography variant="body2" sx={styles.pageSubtitle}>
                  Registra una nueva meta institucional con sus métricas asociadas
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Form Container */}
        <Box sx={styles.formCard}>
          {/* General Save Failure Alert */}
          {showSaveAlert && (
            <Box sx={styles.saveAlert}>
              <WarningIcon sx={{ fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                No se pudo guardar la meta. Revisa los campos obligatorios marcados y asegura que las métricas sumen 100%.
              </Typography>
            </Box>
          )}

          {/* Section 1: Detalle de Meta */}
          <Box sx={styles.formSection}>
            <Typography variant="h6" sx={styles.sectionTitle}>
              Detalle de Meta
            </Typography>

            <Box sx={styles.grid2}>
              {/* Meta Name */}
              <Box sx={{ ...styles.field, gridColumn: '1 / -1' }}>
                <Typography component="label" htmlFor="campo-nombre" sx={styles.fieldLabel}>
                  Nombre de la meta <span style={styles.required}>*</span>
                </Typography>
                <Box 
                  component="input" 
                  type="text" 
                  id="campo-nombre" 
                  placeholder="Mas de 3 nuevos convenios..."
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  sx={styles.input(errors.nombre)}
                />
                {errors.nombre && <Typography sx={styles.fieldError}>El nombre es obligatorio</Typography>}
              </Box>

              {/* Department */}
              <Box sx={styles.field}>
                <Typography component="label" htmlFor="campo-departamento" sx={styles.fieldLabel}>
                  Departamento / Dirección <span style={styles.required}>*</span>
                </Typography>
                <Box 
                  component="select" 
                  id="campo-departamento"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  sx={styles.select(errors.departamento)}
                >
                  <option value="">Selecciona una dirección</option>
                  {departmentsList.map((dept) => (
                    <option key={dept.key} value={dept.key}>
                      {dept.name}
                    </option>
                  ))}
                </Box>
                {errors.departamento && <Typography sx={styles.fieldError}>Selecciona un departamento</Typography>}
              </Box>

              {/* Comportamiento esperado */}
              <Box sx={styles.field}>
                <Typography component="label" htmlFor="campo-comportamiento" sx={styles.fieldLabel}>
                  Comportamiento Esperado <span style={styles.required}>*</span>
                </Typography>
                <Box 
                  component="select" 
                  id="campo-comportamiento"
                  value={comportamiento}
                  onChange={(e) => setComportamiento(e.target.value)}
                  sx={styles.select(false)}
                >
                  <option value="no-debe-superar">No debe superar</option>
                  <option value="debe-alcanzar-o-superar">Debe alcanzar o superar</option>
                  <option value="debe-mantenerse-en-rango">Debe mantenerse en el rango</option>
                </Box>
              </Box>

              {/* Fecha Inicio */}
              <Box sx={styles.field}>
                <Typography component="label" htmlFor="campo-inicio" sx={styles.fieldLabel}>
                  Fecha de inicio <span style={styles.required}>*</span>
                </Typography>
                <Box 
                  component="input" 
                  type="date" 
                  id="campo-inicio"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  sx={{ ...styles.input(errors.inicio), paddingRight: '12px' }}
                />
                {errors.inicio && <Typography sx={styles.fieldError}>Selecciona la fecha de inicio</Typography>}
              </Box>

              {/* Fecha Límite */}
              <Box sx={styles.field}>
                <Typography component="label" htmlFor="campo-limite" sx={styles.fieldLabel}>
                  Fecha límite <span style={styles.required}>*</span>
                </Typography>
                <Box 
                  component="input" 
                  type="date" 
                  id="campo-limite"
                  value={limite}
                  onChange={(e) => setLimite(e.target.value)}
                  min={inicio || undefined}
                  sx={{ ...styles.input(errors.limite), paddingRight: '12px' }}
                />
                {errors.limite && (
                  <Typography sx={styles.fieldError}>
                    {!limite ? 'Selecciona la fecha límite' : 'La fecha límite no puede ser anterior a la de inicio'}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Prioridad segmented options */}
            <Box sx={{ ...styles.field, mt: 3.5 }}>
              <Typography component="label" sx={styles.fieldLabel}>
                Prioridad <span style={styles.required}>*</span>
              </Typography>
              <Box sx={styles.prioridadSegmented} role="group" aria-label="Prioridad">
                {['alta', 'media', 'baja'].map((prio) => (
                  <Box
                    component="button"
                    type="button"
                    key={prio}
                    onClick={() => setPrioridad(prio)}
                    sx={styles.prioridadChip(prio, prioridad === prio)}
                  >
                    <span className="dot" />
                    {prio === 'alta' ? 'Alta' : prio === 'media' ? 'Media' : 'Baja'}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Section 2: Métricas asociadas */}
          {departamento && (
            <Box sx={styles.formSection}>
              <Box sx={styles.metricasHead}>
                <Typography variant="h6" sx={{ ...styles.sectionTitle, mb: 0 }}>
                  Métricas asociadas
                </Typography>

                {/* Progress Weight Tracker */}
                <Box sx={styles.aporteBlock}>
                  <Box sx={styles.aporteBarWrap}>
                    <Box sx={styles.aporteBar}>
                      <Box sx={styles.aporteBarFill(totalAporte)} />
                    </Box>
                  </Box>
                  <Typography sx={styles.aporteText}>
                    {totalAporte}% asignado
                  </Typography>
                </Box>

                {/* Add Metric Trigger Button */}
                <Box
                  component="button"
                  type="button"
                  onClick={handleOpenAddMetric}
                  sx={styles.btnAnadirMetrica}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                  Añadir métrica
                </Box>
              </Box>

              {/* Metrics Warning */}
              {metricas.length === 0 && (
                <Box sx={styles.metricasWarn}>
                  <InfoIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Agrega al menos una métrica y asegura que sumen 100% (Actual: {totalAporte}%)
                  </Typography>
                </Box>
              )}

              {/* Metrics Table */}
              {metricas.length > 0 ? (
                <Box sx={styles.tableContainer}>
                  <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                    <Box component="thead">
                      <Box component="tr">
                        <Box component="th" sx={styles.th}>Nombre métrica</Box>
                        <Box component="th" sx={styles.th}>Aporte a meta</Box>
                        <Box component="th" sx={styles.th}>Comportamiento</Box>
                        <Box component="th" sx={styles.th}>Valor esperado</Box>
                        <Box component="th" sx={{ ...styles.th, textAlign: 'right' }}>Acciones</Box>
                      </Box>
                    </Box>
                    <Box component="tbody">
                      {metricas.map((m, index) => (
                        <Box component="tr" key={m.id} sx={{ borderBottom: '1px solid #e5e7eb', '&:last-child': { borderBottom: 'none' } }}>
                          <Box component="td" sx={{ ...styles.td, fontWeight: 500 }}>{m.nombre}</Box>
                          <Box component="td" sx={styles.td}>
                            <Box sx={styles.badge('aporte')}>{m.aporte}%</Box>
                          </Box>
                          <Box component="td" sx={styles.td}>
                            {m.comportamiento === 'debe-superar' || m.comportamiento === 'debe-alcanzar-o-superar' ? (
                              <Box sx={styles.badge('sup')}>Debe superar</Box>
                            ) : m.comportamiento === 'debe-mantenerse-en-rango' ? (
                              <Box sx={styles.badge('rango')}>En rango</Box>
                            ) : (
                              <Box sx={styles.badge('nosup')}>No debe superar</Box>
                            )}
                          </Box>
                          <Box component="td" sx={styles.td}>
                            {m.comportamiento === 'debe-mantenerse-en-rango' ? (
                              `${m.lowerLimit} - ${m.upperLimit}${m.tipoValor === 'porcentual' || m.tipoValor === 'porcentaje' ? '%' : ''}`
                            ) : (
                              `${m.valor}${m.tipoValor === 'porcentual' || m.tipoValor === 'porcentaje' ? '%' : ''}`
                            )}
                          </Box>
                          <Box component="td" sx={{ ...styles.td, textAlign: 'right' }}>
                            <Box sx={styles.actionBtns}>
                              <IconButton 
                                onClick={() => handleOpenEditMetric(index)}
                                sx={{ color: '#0F4AFF', '&:hover': { bgcolor: '#eff6ff' } }}
                                size="small"
                              >
                                <EditIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDeleteMetric(index)}
                                sx={{ color: '#dc2626', '&:hover': { bgcolor: '#fef2f2' } }}
                                size="small"
                              >
                                <DeleteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              ) : (
                /* Empty Table State */
                <Box sx={styles.emptyState}>
                  <TargetIcon sx={{ fontSize: 32 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    No hay métricas asociadas
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Section 3: Auditoría (Solo si es edición) */}
          {modo === 'editar' && creadaPor && (
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.sectionTitle}>
                Auditoría
              </Typography>
              <Box sx={styles.grid2}>
                <Box sx={styles.field}>
                  <Typography component="label" htmlFor="campo-creada" sx={styles.fieldLabel}>
                    Creada por
                  </Typography>
                  <Box 
                    component="input" 
                    type="text" 
                    id="campo-creada"
                    value={creadaPor}
                    readOnly
                    sx={{ ...styles.input(false), bgcolor: '#f9fafb', color: '#64748b', cursor: 'not-allowed' }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* Form Action Buttons */}
          <Box sx={styles.formActions}>
            <Box 
              component="button" 
              onClick={() => navigate('/metas')}
              sx={styles.btnCancelar}
            >
              Cancelar
            </Box>
            <Box 
              component="button" 
              onClick={handleOpenPreview}
              sx={styles.btnPreview}
            >
              <PreviewIcon sx={{ fontSize: 16 }} />
              Vista previa
            </Box>
            <Box 
              component="button" 
              onClick={handleSaveMeta}
              sx={styles.btnGuardar}
            >
              <SaveIcon sx={{ fontSize: 16 }} />
              Guardar meta
            </Box>
          </Box>
        </Box>
      </Box>

      {/* =========================================================================
          MODAL: AÑADIR / EDITAR MÉTRICA
          ========================================================================= */}
      <Dialog 
        open={metricModalOpen} 
        onClose={() => setMetricModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: '#ffffff', color: '#111827', border: '1px solid #e5e7eb' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, py: 2 }}>
          {editMetricIndex !== null ? 'Editar métrica' : 'Añadir métrica'}
          <IconButton onClick={() => setMetricModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pb: 3 }}>
          {/* Autocomplete Metric Search */}
          <Box ref={comboboxRef} sx={styles.combobox}>
            <Typography component="label" sx={styles.fieldLabel}>
              Nombre de la métrica <span style={styles.required}>*</span>
            </Typography>
            <Box sx={styles.searchWrap}>
              <SearchIcon sx={{ color: '#9ca3af' }} />
              <Box 
                component="input"
                type="text"
                placeholder="Buscar métrica..."
                value={metricSearch}
                onFocus={() => setMetricDropdownOpen(true)}
                onChange={(e) => {
                  setMetricSearch(e.target.value);
                  setMetricDropdownOpen(true);
                }}
                sx={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px', bgcolor: 'transparent' }}
              />
            </Box>

            {/* Dropdown Options */}
            {metricDropdownOpen && (
              <Box sx={styles.dropdownList}>
                <Typography sx={styles.dropdownCount}>
                  {filteredMetricsPool.length} métricas disponibles
                </Typography>
                {filteredMetricsPool.map((item) => (
                  <Box
                    key={item}
                    onClick={() => {
                      setMetricNombre(item);
                      setMetricSearch(item);
                      setMetricDropdownOpen(false);
                    }}
                    sx={styles.dropdownItem(metricNombre === item)}
                  >
                    {item}
                    {metricNombre === item && <CheckIcon sx={{ fontSize: 16, color: '#0F4AFF' }} />}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Metric Aporte */}
          <Box sx={styles.field}>
            <Typography component="label" htmlFor="metric-aporte-input" sx={styles.fieldLabel}>
              Aporte porcentual a la meta <span style={styles.required}>*</span>
            </Typography>
            <Box sx={styles.inputWithIcon}>
              <Box 
                component="input"
                type="number"
                id="metric-aporte-input"
                min="1"
                max="100"
                placeholder="Máx. 100%"
                value={metricAporte}
                onChange={(e) => setMetricAporte(e.target.value)}
                sx={styles.input(false)}
              />
              <span style={styles.inputSuffix}>%</span>
            </Box>
          </Box>

          {/* Comportamiento esperado toggle */}
          <Box sx={styles.field}>
            <Typography component="label" sx={styles.fieldLabel}>
              Comportamiento esperado <span style={styles.required}>*</span>
            </Typography>
            <Box sx={styles.compToggle} role="group" aria-label="Comportamiento">
              <Box
                component="button"
                type="button"
                onClick={() => setMetricComportamiento('debe-superar')}
                sx={styles.compBtn(metricComportamiento === 'debe-superar', 'debe-superar')}
              >
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Debe superar
              </Box>
              <Box
                component="button"
                type="button"
                onClick={() => setMetricComportamiento('no-debe-superar')}
                sx={styles.compBtn(metricComportamiento === 'no-debe-superar', 'no-debe-superar')}
              >
                <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5 }} />
                No debe superar
              </Box>
              <Box
                component="button"
                type="button"
                onClick={() => setMetricComportamiento('debe-mantenerse-en-rango')}
                sx={styles.compBtn(metricComportamiento === 'debe-mantenerse-en-rango', 'debe-mantenerse-en-rango')}
              >
                <RangeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                En Rango
              </Box>
            </Box>
          </Box>

          {/* Expected Value or Limits Rango */}
          {metricComportamiento !== 'debe-mantenerse-en-rango' ? (
            /* Original Inline Design */
            <Box sx={styles.field}>
              <Typography component="label" htmlFor="metric-valor-input" sx={styles.fieldLabel}>
                Valor esperado <span style={styles.required}>*</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Box sx={styles.valorTipo} role="group" aria-label="Tipo de valor">
                  <Box 
                    component="button"
                    type="button"
                    onClick={() => setMetricValorTipo('numerico')}
                    sx={styles.valorTipoBtn(metricValorTipo === 'numerico')}
                  >
                    Numérico
                  </Box>
                  <Box 
                    component="button"
                    type="button"
                    onClick={() => setMetricValorTipo('porcentual')}
                    sx={styles.valorTipoBtn(metricValorTipo === 'porcentual')}
                  >
                    Porcentual
                  </Box>
                </Box>
                <Box sx={{ ...styles.inputWithIcon, flex: 1 }}>
                  <Box 
                    component="input"
                    type="number"
                    id="metric-valor-input"
                    placeholder="0"
                    value={metricValor}
                    onChange={(e) => setMetricValor(e.target.value)}
                    sx={styles.input(false)}
                  />
                  <span style={styles.inputSuffix}>{metricValorTipo === 'porcentual' ? '%' : '#'}</span>
                </Box>
              </Box>
            </Box>
          ) : (
            /* New Range Design */
            <>
              {/* Tipo de valor toggle */}
              <Box sx={styles.field}>
                <Typography component="label" sx={styles.fieldLabel}>
                  Tipo de valor <span style={styles.required}>*</span>
                </Typography>
                <Box sx={styles.valorTipo} role="group" aria-label="Tipo de valor" sx={{ display: 'inline-flex', mt: 0.5 }}>
                  <Box 
                    component="button"
                    type="button"
                    onClick={() => setMetricValorTipo('numerico')}
                    sx={styles.valorTipoBtn(metricValorTipo === 'numerico')}
                  >
                    Numérico
                  </Box>
                  <Box 
                    component="button"
                    type="button"
                    onClick={() => setMetricValorTipo('porcentual')}
                    sx={styles.valorTipoBtn(metricValorTipo === 'porcentual')}
                  >
                    Porcentual
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Box sx={{ ...styles.field, flex: 1 }}>
                  <Typography component="label" htmlFor="metric-lower-input" sx={styles.fieldLabel}>
                    Límite inferior <span style={styles.required}>*</span>
                  </Typography>
                  <Box sx={{ ...styles.inputWithIcon, width: '100%' }}>
                    <Box 
                      component="input"
                      type="number"
                      id="metric-lower-input"
                      placeholder="Mínimo"
                      value={metricLowerLimit}
                      onChange={(e) => setMetricLowerLimit(e.target.value)}
                      sx={styles.input(false)}
                    />
                    <span style={styles.inputSuffix}>{metricValorTipo === 'porcentual' ? '%' : '#'}</span>
                  </Box>
                </Box>
                <Box sx={{ ...styles.field, flex: 1 }}>
                  <Typography component="label" htmlFor="metric-upper-input" sx={styles.fieldLabel}>
                    Límite superior <span style={styles.required}>*</span>
                  </Typography>
                  <Box sx={{ ...styles.inputWithIcon, width: '100%' }}>
                    <Box 
                      component="input"
                      type="number"
                      id="metric-upper-input"
                      placeholder="Máximo"
                      value={metricUpperLimit}
                      onChange={(e) => setMetricUpperLimit(e.target.value)}
                      sx={styles.input(false)}
                    />
                    <span style={styles.inputSuffix}>{metricValorTipo === 'porcentual' ? '%' : '#'}</span>
                  </Box>
                </Box>
              </Box>
            </>
          )}

          {/* Modal Error Message */}
          {metricModalError && (
            <Box sx={{ ...styles.metricasWarn, mb: 0 }}>
              <WarningIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">{metricModalError}</Typography>
            </Box>
          )}

          {/* Save Metric Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1.5 }}>
            <Box
              component="button"
              type="button"
              onClick={() => setMetricModalOpen(false)}
              sx={styles.btnCancelar}
            >
              <CloseIcon sx={{ fontSize: 16, mr: 0.5 }} />
              Cancelar
            </Box>
            <Box
              component="button"
              type="button"
              onClick={handleSaveMetric}
              sx={styles.btnGuardar}
            >
              <AddIcon sx={{ fontSize: 16, mr: 0.5 }} />
              Añadir métrica
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL: VISTA PREVIA / RESUMEN
          ========================================================================= */}
      <Dialog
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1, bgcolor: '#ffffff', color: '#111827', border: '1px solid #e5e7eb' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Resumen de la meta
          <IconButton onClick={() => setPreviewModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 3 }}>
          <Box sx={styles.prevSummary}>
            <Box sx={styles.prevGrid}>
              <Box>
                <Typography sx={styles.prevLabel}>Nombre de la meta</Typography>
                <Typography sx={styles.prevVal}>{nombre}</Typography>
              </Box>
              <Box>
                <Typography sx={styles.prevLabel}>Dirección / Depto</Typography>
                <Typography sx={styles.prevVal}>
                  {departmentsList.find(d => d.key === departamento)?.name || departamento}
                </Typography>
              </Box>
              <Box>
                <Typography sx={styles.prevLabel}>Comportamiento esperado</Typography>
                <Typography sx={styles.prevVal}>
                  {comportamiento === 'no-debe-superar' ? 'No debe superar' : comportamiento === 'debe-alcanzar-o-superar' ? 'Debe alcanzar o superar' : comportamiento === 'debe-mantenerse-en-rango' ? 'Debe mantenerse en rango' : 'Debe reducirse'}
                </Typography>
              </Box>
              <Box>
                <Typography sx={styles.prevLabel}>Prioridad</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Box sx={styles.prioridadBadge(prioridad, true)}>
                    <span className="dot" />
                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{prioridad}</span>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography sx={styles.prevLabel}>Fecha Inicio</Typography>
                <Typography sx={styles.prevVal}>{inicio}</Typography>
              </Box>
              <Box>
                <Typography sx={styles.prevLabel}>Fecha Límite</Typography>
                <Typography sx={styles.prevVal}>{limite}</Typography>
              </Box>
            </Box>

            <Divider />

            <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
              Métricas Asociadas
            </Typography>

            <Box sx={styles.tableContainer}>
              <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                <Box component="thead">
                  <Box component="tr">
                    <Box component="th" sx={styles.th}>Nombre métrica</Box>
                    <Box component="th" sx={styles.th}>Aporte</Box>
                    <Box component="th" sx={styles.th}>Comportamiento</Box>
                    <Box component="th" sx={styles.th}>Esperado</Box>
                    <Box component="th" sx={styles.th}>Estado</Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {metricas.map((m) => {
                    const total = totalAporte;
                    const estado = total === 100 ? 'ok' : total < 100 ? 'incompleta' : 'excede';
                    const estadoLabel = total === 100 ? '100%' : total < 100 ? '<100% incompleta' : '>100% excede';
                    
                    return (
                      <Box component="tr" key={m.id} sx={{ borderBottom: '1px solid #e5e7eb', '&:last-child': { borderBottom: 'none' } }}>
                        <Box component="td" sx={styles.td}>{m.nombre}</Box>
                        <Box component="td" sx={styles.td}>{m.aporte}%</Box>
                        <Box component="td" sx={styles.td}>
                          {m.comportamiento === 'debe-superar' || m.comportamiento === 'debe-alcanzar-o-superar' ? 'Debe superar' : m.comportamiento === 'debe-mantenerse-en-rango' ? 'En rango' : 'No debe superar'}
                        </Box>
                        <Box component="td" sx={styles.td}>
                          {m.comportamiento === 'debe-mantenerse-en-rango' ? (
                            `${m.lowerLimit} - ${m.upperLimit}${m.tipoValor === 'porcentual' ? '%' : ''}`
                          ) : (
                            `${m.valor}${m.tipoValor === 'porcentual' ? '%' : ''}`
                          )}
                        </Box>
                        <Box component="td" sx={styles.td}>
                          <Box sx={styles.badge(estado)}>{estadoLabel}</Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
            <Box
              component="button"
              type="button"
              onClick={() => setPreviewModalOpen(false)}
              sx={styles.btnCancelar}
            >
              Volver a editar
            </Box>
            <Box
              component="button"
              type="button"
              onClick={() => {
                setPreviewModalOpen(false);
                handleSaveMeta();
              }}
              sx={styles.btnGuardar}
            >
              Confirmar y guardar
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Floating Success Alert Dialog */}
      <Dialog 
        open={showSuccessAlert} 
        onClose={() => setShowSuccessAlert(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2, bgcolor: '#ffffff', color: '#111827', textAlign: 'center' } }}
      >
        <DialogTitle sx={{ m: 0, p: 1, display: 'flex', justifyContent: 'flex-end', pb: 0 }}>
          <IconButton onClick={() => setShowSuccessAlert(false)} size="small" sx={{ color: '#6b7280' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3, pt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', mb: 1 }}>
            <CheckIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif" }}>
            {successMsg}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}>
            Los datos han sido registrados correctamente en el servidor.
          </Typography>
          <Button
            onClick={() => setShowSuccessAlert(false)}
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: '#1DC2A0',
              color: '#ffffff',
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
              px: 4,
              py: 1,
              fontFamily: "'Inter', sans-serif",
              '&:hover': {
                bgcolor: '#179e82',
              }
            }}
          >
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
