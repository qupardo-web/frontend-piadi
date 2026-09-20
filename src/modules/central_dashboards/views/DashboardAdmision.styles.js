// =========================================================================
// ARCHIVO DE ESTILOS: DashboardAdmision.styles.js
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

  // Área de contenido principal
  contentArea: {
    flexGrow: 1,
    p: { xs: 3, md: 4 },
    pt: { xs: 11, md: 4 },
    display: 'flex',
    flexDirection: 'column',
    gap: 3.5,
    minWidth: 0,
  },

  // Fila de KPIs superiores
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
    gap: 3,
    width: '100%',
  },

  // Toolbar de pestañas de sección
  toolbarRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    flexWrap: 'wrap',
    mt: 0.5,
  },

  sectionTabsContainer: {
    display: 'inline-flex',
    bgcolor: '#F1F5F9',
    borderRadius: '10px',
    p: '4px',
    gap: '4px',
    border: '1px solid #E2E8F0',
  },

  sectionTabBtn: (isActive) => ({
    px: 2.5,
    py: 1,
    fontSize: '13px',
    fontWeight: isActive ? 600 : 500,
    color: isActive ? '#1E2875' : '#64748B',
    bgcolor: isActive ? '#FFFFFF' : 'transparent',
    borderRadius: '8px',
    textTransform: 'none',
    boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' : 'none',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      bgcolor: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)',
      color: '#1E2875',
    },
  }),

  // Grid / Layout de contenido central
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
    gap: 3,
    minWidth: 0,
  },

  // Slider de años en filtros
  ageSliderStyle: {
    color: '#1E2875',
    '& .MuiSlider-thumb': {
      bgcolor: '#FFFFFF',
      border: '2px solid #1E2875',
      width: 16,
      height: 16,
    },
    '& .MuiSlider-track': {
      bgcolor: '#1E2875',
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
      color: '#1E2875',
      fontWeight: 700,
    },
  },

  // Estilos de acordeones de filtro
  filterAccordion: {
    border: 'none',
    boxShadow: 'none',
    bgcolor: 'transparent !important',
    m: '0 !important',
    '&:before': { display: 'none' },
    '&.Mui-expanded': {
      m: '0 !important',
    },
  },

  filterAccordionSummary: {
    p: 0,
    minHeight: '0 !important',
    m: '0 !important',
    '& .MuiAccordionSummary-content': {
      my: 1,
      m: '0 !important',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
  },

  filterAccordionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#475569',
    textTransform: 'none',
    letterSpacing: '0.06em',
  },

  filterAccordionDetails: {
    p: 0,
    pt: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 0.75,
  },

  filterCatLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#64748B',
    pt: 0.25,
    pb: 0.25,
  },

  // Estilos de chips de filtro
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
    bgcolor: isSelected ? '#1E2875' : '#F5F5F5',
    border: `1px solid ${isSelected ? '#1E2875' : '#C9C9C9'}`,
    borderRadius: '14px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 120ms ease-out',
    '&:hover': {
      bgcolor: isSelected ? '#161796' : '#ECECEC',
      borderColor: isSelected ? '#161796' : '#909090',
      color: isSelected ? '#FFFFFF' : '#212121',
    },
  }),

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
    width: { xs: '100vw', sm: 400 },
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
    fontFamily: "'Inter', sans-serif",
    fontSize: '18px',
    fontWeight: 700,
    color: '#1E2875',
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
    bgcolor: '#F8FAFC',
    borderRadius: '10px',
    p: '16px',
    border: '1px solid #E2E8F0',
  },

  drawerMetricLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#64748B',
    display: 'block',
    mb: 0.5,
  },

  drawerMetricValue: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '28px',
    fontWeight: 700,
    color: '#1E2875',
    letterSpacing: '-0.02em',
    lineHeight: 1.15,
  },

  drawerMetaBadge: (isPositive) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    mt: 1,
    px: 1.2,
    py: 0.4,
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    bgcolor: isPositive ? '#ECFDF5' : '#FEF2F2',
    color: isPositive ? '#059669' : '#DC2626',
  }),

  drawerTableWrap: {
    maxHeight: '240px',
    overflowY: 'auto',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    mt: 1,
  },

  drawerFooter: {
    p: '14px 24px',
    borderTop: '1px solid #e5e7eb',
    flexShrink: 0,
    fontSize: '12px',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
};
