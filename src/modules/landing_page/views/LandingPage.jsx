import React from 'react';
import { useLandingPage } from './LandingPage.hooks';
import { styles } from './LandingPage.styles';
import logoEcas from '../../../assets/logo_ECAS_white.svg';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Avatar,
  IconButton,
  Divider,
  Drawer,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  UploadFile as CargaIcon,
  Shield as AuditoriaIcon,
  ExitToApp as LogoutIcon,
  ArrowUpward as ArrowUpIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  Adjust as TargetIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

export const LandingPage = () => {
  const {
    navigate,
    user,
    logout,
    activeTab,
    setActiveTab,
    activeMenu,
    setActiveMenu,
    mobileOpen,
    openHelpDialog,
    setOpenHelpDialog,
    departments,
    currentData,
    deptColor,
    isLight,
    customTextColor,
    faqData,
    handleTabChange,
    handleDrawerToggle,
  } = useLandingPage();

  const handleKpiCardClick = (targetHash) => {
    const hash = targetHash ? `#${targetHash}` : '';
    const dashboardPath = currentData.departmentId === 'vinculacion_medio'
      ? '/dashboard-vcm'
      : '/dashboard-educacion-continua';
    navigate(`${dashboardPath}${hash}`);
  };

  // =========================================================================
  // SUB-COMPONENTE: CONTENIDO DEL SIDEBAR (REUTILIZABLE)
  // =========================================================================
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
            const isSelected = activeMenu === item.text;
            return (
              <Box
                key={item.text}
                onClick={() => {
                  setActiveMenu(item.text);
                  handleDrawerToggle(); // Cierra el drawer móvil si se hace click
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
      <Box sx={styles.sidebar}>
        {sidebarContent}
      </Box>

      {/* =========================================================================
          SECCIÓN 1B: SIDEBAR TEMPORAL / DESPLEGABLE (MÓVILES Y TABLETS)
          ========================================================================= */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Optimiza el rendimiento de apertura en móviles.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, border: 'none' },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* =========================================================================
          SECCIÓN 2: ÁREA DE CONTENIDO PRINCIPAL (DERECHA / ABAJO)
          ========================================================================= */}
      <Box sx={styles.contentArea}>
        {/* Cabecera y Bienvenida */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="body1" sx={{ color: '#6B7280', fontWeight: 500, fontSize: '16px' }}>
            Buenos días, {user?.username || 'John'} ✍️
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, width: '100%' }}>
            <Box sx={styles.panelHeader}>
              <Box sx={styles.panelIconContainer}>
                <HomeIcon />
              </Box>
              <Box>
                <Typography variant="h5" sx={styles.panelTitle}>
                  Panel de Inicio
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Aquí encontrarás un resumen de tus metas y actividades institucionales.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Pestañas de Navegación Secundarias */}
        <Box sx={{ ...styles.tabsContainer, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            disabled={activeTab === 0}
            onClick={() => setActiveTab(prev => Math.max(0, prev - 1))}
            sx={{
              color: '#1E2875',
              width: 32,
              height: 32,
              border: '1px solid #E5E7EB',
              bgcolor: '#FFFFFF',
              transition: 'background-color 150ms ease-out, border-color 150ms ease-out, opacity 150ms ease-out',
              '&:hover': { bgcolor: '#F0F1FF', borderColor: '#C7C9F0' },
              '&.Mui-disabled': { opacity: 0.35, bgcolor: '#FFFFFF' }
            }}
            aria-label="Anterior sección"
          >
            <ArrowUpIcon sx={{ transform: 'rotate(-90deg)', fontSize: '1.2rem' }} />
          </IconButton>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons={false}
            sx={{ ...styles.tabsList, flexGrow: 1 }}
          >
            {departments.map((department) => (
              <Tab key={department.departmentId} label={department.name} />
            ))}
          </Tabs>

          <IconButton 
            disabled={activeTab === departments.length - 1}
            onClick={() => setActiveTab(prev => Math.min(departments.length - 1, prev + 1))}
            sx={{
              color: '#1E2875',
              width: 32,
              height: 32,
              border: '1px solid #E5E7EB',
              bgcolor: '#FFFFFF',
              transition: 'background-color 150ms ease-out, border-color 150ms ease-out, opacity 150ms ease-out',
              '&:hover': { bgcolor: '#F0F1FF', borderColor: '#C7C9F0' },
              '&.Mui-disabled': { opacity: 0.35, bgcolor: '#FFFFFF' }
            }}
            aria-label="Siguiente sección"
          >
            <ArrowUpIcon sx={{ transform: 'rotate(90deg)', fontSize: '1.2rem' }} />
          </IconButton>
        </Box>

        {/* =========================================================================
            SECCIÓN 3: TARJETAS KPI (METRICAS DINÁMICAS)
            ========================================================================= */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#475569', 
            fontWeight: 600,
            mt: 0.5,
            mb: -1
          }}
        >
          {currentData.hasData 
            ? `Los datos mostrados actualmente corresponden al año ${currentData.year}.`
            : "No hay datos cargados en este departamento."
          }
        </Typography>


        <Grid container spacing={3}>
          {currentData.kpis.map((kpi, index) => {
            const cardStyle = kpi.isBlue 
              ? styles.kpiCardBlue(deptColor, customTextColor) 
              : styles.kpiCardWhite;
            const isNegative = kpi.trend && kpi.trend.startsWith('-');
            const trendColor = kpi.isBlue
              ? (isLight ? (isNegative ? '#B91C1C' : '#059669') : (isNegative ? '#F87171' : '#4ADE80'))
              : (isNegative ? '#EF4444' : '#10B981');
            const valStr = String(kpi.value || '');
            const fontSize = valStr.length > 12 
              ? '20px' 
              : (valStr.length > 9 ? '24px' : '30px');
            const valueStyle = kpi.isBlue 
              ? [styles.kpiValue, { color: customTextColor, fontSize }] 
              : [styles.kpiValue, { color: '#1E2875', fontSize }];

            return (
              <Grid item xs={12} sm={6} md={3} key={`${activeTab}-kpi-${index}`} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    ...cardStyle,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                    width: '100%',
                    minHeight: 155,
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(30, 40, 117, 0.08)',
                    },
                    '&:focus-visible': {
                      outline: '2px solid #0F4AFF',
                      outlineOffset: 2,
                    },
                  }}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleKpiCardClick(kpi.targetHash)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleKpiCardClick(kpi.targetHash);
                    }
                  }}
                >
                  <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', '&:last-child': { pb: 2.5 } }}>
                    {/* Top row: Title and expand arrow */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, gap: 1.5 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600, 
                          color: kpi.isBlue ? customTextColor : '#111827', 
                          opacity: kpi.isBlue ? 0.95 : 1,
                          fontSize: '15px',
                          lineHeight: 1.35,
                          maxWidth: '85%' 
                        }}
                      >
                        {kpi.title}
                      </Typography>
                      <ArrowUpIcon 
                        sx={{ 
                          transform: 'rotate(45deg)', 
                          color: kpi.isBlue ? customTextColor : '#111827',
                          opacity: kpi.isBlue ? 0.8 : 0.7,
                          fontSize: '1.25rem',
                          flexShrink: 0
                        }} 
                      />
                    </Box>

                    {/* Bottom layout: Value (left) and Trend/Comparison stacked (right) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, mt: 'auto', width: '100%' }}>
                      <Typography variant="h3" sx={valueStyle}>
                        {kpi.value}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, flexShrink: 0 }}>
                        {kpi.trend ? (
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.25,
                              ...(kpi.isBlue && {
                                bgcolor: '#FFFFFF',
                                px: 1,
                                py: 0.35,
                                borderRadius: '6px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.06)'
                              })
                            }}
                          >
                            <ArrowUpIcon 
                              sx={{ 
                                fontSize: '0.9rem', 
                                color: kpi.isBlue ? (isNegative ? '#EF4444' : '#10B981') : trendColor, 
                                transform: isNegative ? 'rotate(135deg)' : 'rotate(45deg)' 
                              }} 
                            />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: kpi.isBlue ? (isNegative ? '#EF4444' : '#10B981') : trendColor, 
                                fontWeight: 700,
                                fontSize: '12px'
                              }}
                            >
                              {kpi.trend}
                            </Typography>
                          </Box>
                        ) : null}
                        
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: '12px',
                            color: kpi.isBlue 
                              ? (isLight ? 'rgba(31, 41, 55, 0.7)' : 'rgba(255,255,255,0.85)') 
                              : '#6B7280', 
                            textAlign: 'right',
                            lineHeight: 1.2,
                            maxWidth: '130px'
                          }}
                        >
                          {kpi.trendDesc}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Box 
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 1, 
            mt: -1, 
            fontSize: '14px', 
            color: '#6b7280' 
          }}
          title="El valor y la línea muestran la variación respecto al mismo período del año anterior"
        >
          <InfoIcon sx={{ fontSize: '18px', opacity: 0.7 }} />
          <span>Comparación con el año anterior</span>
        </Box>

        {/* =========================================================================
            SECCIÓN 4: METAS PRIORITARIAS
            ========================================================================= */}
        {currentData.departmentId && (
          <Box sx={styles.metasSectionContainer}>
            <Box sx={styles.metasHeader}>
              <Box>
                <Typography variant="h6" sx={styles.metasTitle}>
                  Metas Prioritarias
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Seguimiento de objetivos clave ordenados por prioridad
                </Typography>
              </Box>
              <Box 
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: '#1E2875',
                  color: '#ffffff',
                  borderRadius: 2,
                  px: 2.25,
                  py: 1.35,
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease-out',
                  '&:hover': { bgcolor: '#1DC2A0' }
                }}
                onClick={() => {
                  navigate('/metas');
                }}
              >
                Ver todas las metas
                <ArrowUpIcon sx={{ transform: 'rotate(90deg)', fontSize: '1.1rem', ml: 1 }} />
              </Box>
            </Box>

            {(currentData.metas || []).length === 0 ? (
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                bgcolor: '#FFFFFF',
                borderRadius: 3,
                border: '1px solid #E5E7EB',
                width: '100%',
                gap: 1.5
              }}>
                <TargetIcon sx={{ fontSize: 48, color: '#d1d5db' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E2875', fontSize: '18px', fontFamily: "'Inter', sans-serif" }}>
                  No se encontraron metas prioritarias
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280', fontFamily: "'Inter', sans-serif" }}>
                  No hay metas de prioridad alta registradas para este departamento.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {(currentData.metas || []).map((meta, index) => {
                  let borderLeftColor = '#10B981'; // completada
                  let statusLabel = 'Completada';
                  if (meta.estado === 'progreso') {
                    borderLeftColor = '#3B82F6';
                    statusLabel = 'En progreso';
                  } else if (meta.estado === 'atencion') {
                    borderLeftColor = '#EF4444';
                    statusLabel = 'Requiere atención';
                  }

                  let priorityColor = '#EF4444';
                  let priorityBg = '#fef2f2';
                  let priorityLabel = 'Alta';
                  if (meta.prioridad === 'media') {
                    priorityColor = '#F59E0B';
                    priorityBg = '#fffbeb';
                    priorityLabel = 'Media';
                  } else if (meta.prioridad === 'baja') {
                    priorityColor = '#22C55E';
                    priorityBg = '#f0fdf4';
                    priorityLabel = 'Baja';
                  }

                  return (
                    <Grid item xs={12} md={6} key={`meta-${index}`}>
                      <Card sx={{ ...styles.metaCard, borderLeft: `4px solid ${borderLeftColor}` }}>
                        <CardContent sx={styles.metaCardContent}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, gap: 1.5 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E2875', fontFamily: "'Inter', sans-serif", fontSize: '18px', lineHeight: 1.3 }}>
                              {meta.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
                              <Box sx={styles.metaStatusBadge(meta.estado)}>
                                {statusLabel}
                              </Box>
                              <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                borderRadius: 999,
                                px: 1.25,
                                py: 0.5,
                                fontSize: '11.5px',
                                fontWeight: 600,
                                color: priorityColor,
                                bgcolor: priorityBg
                              }}>
                                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: priorityColor }} />
                                {priorityLabel}
                              </Box>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <Typography variant="body2" sx={{ color: '#666666' }}>
                                Progreso: <strong>{meta.actual}</strong> / {meta.objetivo}
                              </Typography>
                              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E2875' }}>
                                {meta.pct}%
                              </Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={Math.min(meta.pct, 100)} sx={styles.metaProgressBar(meta.estado)} />
                          </Box>

                          <Divider sx={{ my: 1.5 }} />

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', gap: 2.5, color: '#666666', fontSize: '12px' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarIcon sx={{ fontSize: '1.1rem', color: '#9CA3AF' }} />
                                <span style={{ fontWeight: 500 }}>Fecha de inicio: {(meta.inicio || '').slice(0, 7)}</span>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarIcon sx={{ fontSize: '1.1rem', color: '#9CA3AF' }} />
                                <span style={{ fontWeight: 500 }}>Fecha límite: {(meta.limite || '').slice(0, 7)}</span>
                              </Box>
                            </Box>
                            <Box 
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                color: '#0F4AFF',
                                fontWeight: 600,
                                fontSize: '13px',
                                cursor: 'pointer',
                                borderRadius: 1,
                                px: 1.25,
                                py: 0.75,
                                '&:hover': { bgcolor: '#eff6ff' }
                              }}
                              onClick={() => {
                                const dashboardPath = currentData.departmentId === 'vinculacion_medio'
                                  ? '/dashboard-vcm'
                                  : '/dashboard-educacion-continua';
                                navigate(dashboardPath);
                              }}
                            >
                              Ver detalles
                              <ArrowUpIcon sx={{ transform: 'rotate(90deg)', fontSize: '0.95rem', ml: 0.5 }} />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}

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
