// =========================================================================
// ARCHIVO DE ESTILOS: DashboardInnovacion.styles.js
// =========================================================================

export const styles = {
  // Contenedor principal
  mainLayout: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    minHeight: '100vh',
    bgcolor: '#F8F8F8',
    fontFamily: "'Inter', sans-serif",
  },

  // Sidebar lateral izquierdo (Navegación fija estándar ECAS)
  sidebar: {
    width: 260,
    bgcolor: '#1E2875',
    color: '#ffffff',
    display: { xs: 'none', md: 'flex' },
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRight: '1px solid #E5E7EB',
    position: 'sticky',
    top: 0,
    height: '100vh',
    zIndex: 100,
  },

  drawerContent: {
    width: 260,
    height: '100%',
    bgcolor: '#1E2875',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  logoContainer: {
    p: 3,
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
  },

  logoTitle: {
    fontWeight: 700,
    fontSize: '20px',
    letterSpacing: 0.5,
    lineHeight: 1.1,
  },

  logoSubtitle: {
    opacity: 0.7,
    fontWeight: 600,
    fontSize: '12px',
    letterSpacing: 1,
  },

  divider: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    mb: 2,
  },

  menuContainer: {
    px: 2,
  },

  menuItem: (isSelected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    py: 1.2,
    px: 2,
    mb: 0.8,
    borderRadius: 2,
    cursor: 'pointer',
    bgcolor: isSelected ? '#1DC2A0' : 'transparent',
    color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      bgcolor: isSelected ? '#1DC2A0' : 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
    },
  }),

  bottomSection: {
    p: 2,
  },

  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    py: 1.2,
    px: 2,
    mb: 2,
    borderRadius: 2,
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
    },
  },

  userCard: {
    p: 1.5,
    borderRadius: 3,
    bgcolor: 'rgba(255, 255, 255, 0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },

  userAvatar: {
    width: 36,
    height: 36,
    bgcolor: '#1DC2A0',
    fontSize: '0.9rem',
  },

  // AppBar móvil
  mobileAppBar: {
    display: { xs: 'flex', md: 'none' },
    bgcolor: '#1E2875',
    borderBottom: '1px solid #E5E7EB',
    boxShadow: 'none',
    borderRadius: 0,
    height: '50px',
  },

  mobileToolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    px: 1.5,
    height: '100%',
    minHeight: '50px',
    '@media (min-width: 0px)': {
      minHeight: '50px',
    },
  },

  // Contenido principal
  contentArea: {
    flexGrow: 1,
    p: { xs: 3, md: 4 },
    pt: { xs: 11, md: 4 },
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    minWidth: 0,
  },

  breadcrumbsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.8,
    color: '#6B7280',
    fontSize: '16px',
    fontWeight: 500,
  },

  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },

  panelIconContainer: {
    width: 48,
    height: 48,
    borderRadius: '12px',
    bgcolor: '#1E2875',
    color: '#3EC9FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  panelTitle: {
    fontWeight: 700,
    fontSize: { xs: '28px', md: '36px' },
    color: '#1E2875',
    fontFamily: "'Inter', sans-serif",
  },

  panelSubtitle: {
    fontSize: '14px',
    color: '#6B7280',
    fontFamily: "'Inter', sans-serif",
  },

  sessionCard: {
    bgcolor: '#ffffff', 
    border: '1px solid #e2e8f0', 
    borderRadius: '8px', 
    px: 2, 
    py: 1, 
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },

  // Grid / Layout de contenido y filtros
  mainContentRow: {
    display: 'flex',
    gap: 3,
    alignItems: 'flex-start',
    width: '100%',
  },

  centerColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2.5,
    minWidth: 0,
  },

  // KPI Row
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
    gap: 3,
  },

  kpiCard: (color = '#3EC9FF') => ({
    bgcolor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderLeft: `4px solid ${color}`,
    borderRadius: '8px',
    p: 2.5,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
    height: '100%',
    minHeight: 120,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 16px -4px ${color}1f`,
      borderColor: color,
    },
  }),

  kpiCardHeaderLabel: (color = '#64748b') => ({
    fontSize: '13px',
    fontWeight: 600,
    color: color,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    mb: 1,
    lineHeight: 1.2,
  }),

  kpiCardHeaderVal: {
    fontWeight: 700,
    color: '#1e1b4b',
    fontSize: '26px',
    mb: 0.5,
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.2,
  },

  kpiCardHeaderIcon: (color = '#3EC9FF') => ({
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  kpiCardFooterLabel: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: 500,
  },

  kpiEvoBadge: (isPositive) => ({
    display: 'inline-flex',
    alignItems: 'center',
    px: 1,
    py: 0.2,
    borderRadius: 1,
    bgcolor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: isPositive ? '#10B981' : '#ef4444',
    fontWeight: 700,
    fontSize: '12px',
  }),

  // Chart Section
  chartSection: {
    bgcolor: '#FFFFFF',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    p: { xs: 2.5, md: 3.5 },
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
  },

  chartHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    mb: 2,
  },

  chartHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  chartTitle: {
    fontSize: '18px',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    display: 'flex',
    alignItems: 'center',
    gap: 1.25,
    color: '#1E2875',
    fontFamily: "'Inter', sans-serif",
  },

  chartToggleBtn: {
    color: '#1E2875',
    p: 0.5,
    transition: 'transform 200ms ease-out',
  },

  chartSubtitle: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#64748B',
    mb: 1.5,
    fontFamily: "'Inter', sans-serif",
  },

  chartCanvasWrap: {
    position: 'relative',
    overflow: 'visible',
    width: '100%',
  },

  // Slider de años en filtros
  ageSliderStyle: {
    color: '#3EC9FF',
    '& .MuiSlider-thumb': {
      bgcolor: '#FFFFFF',
      border: '2px solid #3EC9FF',
      width: 16,
      height: 16,
    },
    '& .MuiSlider-track': {
      bgcolor: '#3EC9FF',
      height: 4,
    },
    '& .MuiSlider-rail': {
      bgcolor: '#E2E8F0',
      height: 4,
    },
    '& .MuiSlider-mark': {
      bgcolor: '#94A3B8',
      height: 6,
      width: 6,
      borderRadius: '50%',
    },
    '& .MuiSlider-markLabel': {
      fontSize: '11px',
      color: '#64748B',
      fontWeight: 600,
    },
    '& .MuiSlider-markLabelActive': {
      color: '#161796',
      fontWeight: 700,
    },
  },

  // Panel lateral derecho de Filtros (Desktop Sticky)
  filtersSidebar: (filtersCollapsed) => ({
    width: filtersCollapsed ? 'auto' : '290px',
    height: filtersCollapsed ? 'auto' : 'calc(100vh - 40px)',
    transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1), height 250ms cubic-bezier(0.4, 0, 0.2, 1)',
    display: { xs: 'none', md: 'flex' },
    flexDirection: 'column',
    position: 'sticky',
    top: '20px',
    alignSelf: 'flex-start',
    mr: '20px',
    my: '20px',
    borderRadius: filtersCollapsed ? '10px' : '16px',
    overflow: filtersCollapsed ? 'visible' : 'hidden',
    bgcolor: filtersCollapsed ? 'transparent' : '#FFFFFF',
    border: filtersCollapsed ? 'none' : '1px solid #E2E8F0',
    boxShadow: filtersCollapsed ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.03), 0 2px 4px -1px rgba(0,0,0,0.02)',
    flexShrink: 0,
    zIndex: 90,
  }),

  filtersHeader: {
    fontSize: '14px',
    fontWeight: 600,
    mb: 1.5,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    color: '#212121',
  },

  filtersTools: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    mb: 1.5,
  },

  filtersCount: (hasFilters) => ({
    fontSize: '11.5px',
    fontWeight: hasFilters ? 600 : 500,
    color: hasFilters ? '#0E86B8' : '#9E9E9E',
  }),

  filterGroup: {
    mb: 2,
  },

  filterLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#9E9E9E',
    mb: 0.8,
    display: 'flex',
    alignItems: 'center',
    gap: 0.8,
  },

  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#9E9E9E',
    mt: 0.5,
  },

  rangeValues: {
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 600,
    color: '#212121',
    mt: 0.5,
  },

  filterAccordion: {
    border: 'none',
    boxShadow: 'none',
    '&:before': { display: 'none' },
    bgcolor: 'transparent',
    m: '0 !important',
  },

  filterAccordionSummary: {
    px: 0,
    minHeight: '36px !important',
    '& .MuiAccordionSummary-content': {
      m: '6px 0 !important',
      fontSize: '13px',
      fontWeight: 600,
      color: '#212121',
    },
    '&:hover': {
      color: '#1a71f6',
    },
  },

  filterAccordionDetails: {
    px: 0,
    py: 0.5,
  },

  filterCatLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#212121',
    pt: 0.5,
    pb: 0.5,
  },

  filterChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    py: 0.5,
  },

  filterChip: (isSelected) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    py: '3px',
    px: '10px',
    fontSize: '11px',
    fontWeight: isSelected ? 600 : 500,
    color: isSelected ? '#FFFFFF' : '#616161',
    bgcolor: isSelected ? '#3EC9FF' : '#F5F5F5',
    border: `1px solid ${isSelected ? '#3EC9FF' : '#C9C9C9'}`,
    borderRadius: '14px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 120ms ease-out',
    '&:hover': {
      bgcolor: isSelected ? '#0E86B8' : '#ECECEC',
      borderColor: isSelected ? '#0E86B8' : '#909090',
      color: isSelected ? '#FFFFFF' : '#212121',
    },
  }),

  btnReset: {
    width: '100%',
    p: '8px',
    fontSize: '12px',
    fontWeight: 500,
    bgcolor: 'transparent',
    color: '#9E9E9E',
    border: '1px solid #E0E0E0',
    borderRadius: '6px',
    cursor: 'pointer',
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    mt: 1.5,
    transition: 'all 150ms ease-out',
    '&:hover': {
      borderColor: '#9E9E9E',
      color: '#212121',
      bgcolor: '#FAFAFA',
    },
  },

  filterReopenBtn: {
    position: 'sticky',
    top: 24,
    alignSelf: 'flex-start',
    bgcolor: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '6px',
    p: '6px 10px',
    color: '#9E9E9E',
    fontSize: '13px',
    fontWeight: 500,
    display: { xs: 'none', lg: 'inline-flex' },
    alignItems: 'center',
    gap: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    '&:hover': {
      bgcolor: '#F5F5F5',
      color: '#212121',
    },
  },

  // Drawer modal lateral de Detalle del indicador
  drawerOverlay: (isOpen) => ({
    position: 'fixed',
    inset: 0,
    bgcolor: 'rgba(0,0,0,0.4)',
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transition: 'opacity 250ms ease-out, visibility 250ms ease-out',
    zIndex: 1300,
  }),

  indicatorDrawer: (isOpen) => ({
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: { xs: '100vw', sm: 380 },
    maxWidth: '100vw',
    bgcolor: '#FFFFFF',
    borderLeft: '1px solid #e5e7eb',
    boxShadow: '-12px 0 28px rgba(0,0,0,0.22)',
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    visibility: isOpen ? 'visible' : 'hidden',
    transition: 'transform 250ms ease-out, visibility 250ms ease-out',
    zIndex: 1400,
    display: 'flex',
    flexDirection: 'column',
  }),

  drawerHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    p: '16px 24px 12px',
    borderBottom: '1px solid #e5e7eb',
    flexShrink: 0,
  },

  drawerTitleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 1.5,
  },

  drawerTitle: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    fontSize: '18px',
    fontWeight: 700,
    color: '#161796',
    letterSpacing: '-0.01em',
    lineHeight: 1.3,
    flex: 1,
  },

  drawerBody: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    p: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },

  drawerDescLabel: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#9E9E9E',
    mb: 0.5,
  },

  drawerDesc: {
    fontSize: '13px',
    lineHeight: 1.6,
    color: '#212121',
  },

  drawerMetricBox: {
    bgcolor: '#F5F5F5',
    borderRadius: '8px',
    p: '14px 16px',
  },

  drawerMetricLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#9E9E9E',
    display: 'block',
    mb: 0.5,
  },

  drawerMetricValue: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    fontSize: '26px',
    fontWeight: 700,
    color: '#212121',
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
  },

  drawerMetaBadge: (isMet) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.8,
    mt: 1.5,
    p: '6px 12px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: 600,
    bgcolor: isMet ? '#ecfdf5' : '#eff6ff',
    color: isMet ? '#059669' : '#1a71f6',
  }),

  drawerTableWrap: {
    maxHeight: '220px',
    overflowY: 'auto',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    mt: 1,
  },

  drawerFooter: {
    p: '14px 24px',
    borderTop: '1px solid #e5e7eb',
    flexShrink: 0,
    fontSize: '12px',
    color: '#9E9E9E',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },

  // Botón flotante de ayuda
  floatingHelpButton: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    bgcolor: '#1E2875',
    color: '#ffffff',
    width: 48,
    height: 48,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    '&:hover': {
      bgcolor: '#161796',
    },
  },

  noDataPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    color: '#64748b',
    fontSize: '13px',
    fontWeight: 500,
    border: '1px dashed #E2E8F0',
    borderRadius: '12px',
    bgcolor: '#F8FAFC',
    width: '100%',
  },

  filterNoDataBox: {
    mx: 2,
    mb: 2,
    p: 2,
    bgcolor: '#FEF3C7',
    borderRadius: 2,
    border: '1px solid #F59E0B',
  },

  filtersFooter: {
    p: 2.5,
    borderTop: '1px solid #F1F5F9',
    bgcolor: '#FFFFFF',
  },

  resetFiltersButton: {
    borderColor: '#1E2875',
    color: '#1E2875',
    borderWidth: '1.5px',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
    py: 1,
    borderRadius: '8px',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      bgcolor: '#EEF2FF',
      borderColor: '#1E2875',
      borderWidth: '1.5px',
      color: '#1E2875',
      boxShadow: '0 2px 8px rgba(30, 40, 117, 0.15)',
    },
  },
};
