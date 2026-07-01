// =========================================================================
// ARCHIVO DE ESTILOS: DashboardEducacionContinua.styles.js
// =========================================================================
// Define los estilos premium del dashboard de Educación Continua,
// alineado a las directrices de UI_Kit.pdf de P.I.A.D.I.

export const styles = {
  // Contenedor principal
  mainLayout: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    minHeight: '100vh',
    bgcolor: '#F5F5F7', // Fondo gris claro premium
    fontFamily: "'Inter', sans-serif",
  },

  // Sidebar lateral izquierdo (Navegación fija)
  sidebar: {
    width: 260,
    bgcolor: '#1E2875', // Azul institucional
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    px: 3,
    height: '100%',
    minHeight: '50px',
    '@media (min-width: 0px)': {
      minHeight: '50px',
    },
  },

  // Área de contenido central
  contentArea: {
    flexGrow: 1,
    p: { xs: 3, md: 4 },
    pt: { xs: 11, md: 4 },
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    minWidth: 0, // Evita desbordamiento de contenedores flex hijos
  },

  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mt: 1,
  },

  panelIconContainer: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    bgcolor: '#46D19F', // Menta/turquesa de Educación Continua
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  panelTitle: {
    fontWeight: 700,
    fontSize: { xs: '24px', md: '30px' },
    color: '#1E2875',
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

  breadcrumbsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.8,
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: 500,
  },

  // Banner informativo del período visualizado
  periodBanner: {
    bgcolor: '#F1F5F9',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    p: '16px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
  },

  periodBannerLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#1E2875',
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },

  periodBannerValue: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#334155',
  },

  // Contenedor de visualizaciones vacías/gráficos no replicados
  graphsPlaceholder: {
    border: '2px dashed #CBD5E1',
    borderRadius: '12px',
    bgcolor: '#FFFFFF',
    p: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: '400px',
  },

  // SIDEBAR LATERAL DERECHO (Filtros persistentes)
  filtersSidebar: {
    width: { xs: '100%', md: 280 },
    bgcolor: '#FFFFFF',
    borderLeft: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    flexShrink: 0,
    zIndex: 90,
  },

  filtersHeader: {
    p: '24px 20px 12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 1.2,
  },

  filtersTitle: {
    fontWeight: 700,
    fontSize: '18px',
    color: '#1E2875',
    fontFamily: "'Inter', sans-serif",
  },

  filtersScrollContent: {
    flexGrow: 1,
    overflowY: 'auto',
    px: 2.5,
    pb: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 3.5,
  },

  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  },

  filterSectionTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  selectLabelStyle: {
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
  },

  selectInputStyle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E2E8F0',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#CBD5E1',
    },
  },

  menuItemCheckStyle: {
    fontSize: '14px',
    fontFamily: "'Inter', sans-serif",
  },

  checkboxStyle: {
    color: '#CBD5E1',
    '&.Mui-checked': {
      color: '#1E2875',
    },
  },

  ageSliderStyle: {
    color: '#1E2875',
    '& .MuiSlider-thumb': {
      bgcolor: '#FFFFFF',
      border: '2px solid #1E2875',
    },
    '& .MuiSlider-rail': {
      color: '#E2E8F0',
    },
  },

  ageRangeLabels: {
    fontSize: '13px',
    color: '#475569',
    fontWeight: 500,
    '& span': {
      fontWeight: 700,
      color: '#1E2875',
      borderBottom: '2px dotted #1DC2A0',
      pb: 0.2,
    },
  },

  filtersFooter: {
    p: 2.5,
    borderTop: '1px solid #F1F5F9',
    bgcolor: '#FFFFFF',
  },

  resetFiltersButton: {
    borderColor: '#E2E8F0',
    color: '#475569',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
    py: 1,
    borderRadius: 2,
    '&:hover': {
      bgcolor: '#F8FAFC',
      borderColor: '#CBD5E1',
    },
  },

  // KPI Cards Styles
  kpiCardHeaderLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    mb: 1,
  },
  kpiCardHeaderVal: {
    fontWeight: 700,
    color: '#1e1b4b',
    mb: 0.5,
  },
  kpiCardHeaderIcon: (color) => ({
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
};
