// =========================================================================
// ARCHIVO DE ESTILOS: CentralDashboards.styles.js
// =========================================================================
// Este archivo contiene los estilos del módulo Central de Dashboards.
// Alineado con el UI_Kit.pdf de P.I.A.D.I. y el diseño de Central_de_dashboards.png.

export const styles = {
  // Contenedor principal
  mainLayout: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    minHeight: '100vh',
    bgcolor: '#F5F5F7', // Fondo general gris claro
    fontFamily: "'Inter', sans-serif",
  },

  // Sidebar lateral (escritorio)
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

  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    bgcolor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
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

  // Área de contenido
  contentArea: {
    flexGrow: 1,
    p: { xs: 3, md: 4 },
    pt: { xs: 11, md: 4 },
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
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
    bgcolor: '#1E2875',
    color: '#ffffff',
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

  breadcrumbsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.8,
    color: '#6B7280',
    fontSize: '16px',
    fontWeight: 500,
  },

  // Grilla y Tarjetas de Dashboards
  dashboardCard: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    bgcolor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
    overflow: 'hidden',
    height: '100%',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(30, 40, 117, 0.08)',
    },
  },

  cardHeaderColor: (color) => ({
    height: 160,
    bgcolor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    '& svg': {
      fontSize: 64,
    },
  }),

  cardBody: {
    p: 3,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  },

  cardTitle: {
    fontWeight: 700,
    fontSize: '18px',
    color: '#1E2875',
    fontFamily: "'Inter', sans-serif",
  },

  cardDesc: {
    fontSize: '14px',
    color: '#6B7280',
    lineHeight: 1.6,
    flexGrow: 1,
  },

  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mt: 'auto',
    pt: 2,
    borderTop: '1px solid #F3F4F6',
  },

  cardDateContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.8,
    color: '#94A3B8',
  },

  cardDateText: {
    fontSize: '13px',
    fontWeight: 500,
  },

  cardButton: (color) => ({
    bgcolor: color,
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
    borderRadius: 2,
    px: 2,
    py: 0.8,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    '&:hover': {
      bgcolor: color,
      filter: 'brightness(90%)',
    },
  }),

  // Botón flotante de ayuda
  floatingHelpButton: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    bgcolor: '#1E2875',
    color: '#ffffff',
    width: 48,
    height: 48,
    zIndex: 1000,
    boxShadow: '0 4px 14px rgba(30, 40, 117, 0.3)',
    '&:hover': {
      bgcolor: '#1DC2A0', // Cambia a turquesa en hover
    },
    '& svg': {
      fontSize: 28,
    },
  },

  // Estilos del Centro de Ayuda
  helpDialogPaper: {
    borderRadius: 4,
    p: 3,
    maxWidth: '650px',
    bgcolor: '#FFFFFF',
    color: '#1F2937',
  },
  helpDialogTitle: {
    fontWeight: 700,
    fontSize: '24px',
    color: '#1E2875',
    fontFamily: "'Inter', sans-serif",
  },
  helpDialogSubtitle: {
    color: '#6B7280',
    fontSize: '14px',
    mb: 2,
  },
  helpAccordion: {
    bgcolor: '#ffffff',
    borderBottom: '1px solid #E5E7EB',
    '&:before': {
      display: 'none',
    },
    '& .MuiAccordionSummary-root': {
      px: 1,
      py: 1,
      minHeight: 'auto',
      '&.Mui-expanded': {
        minHeight: 'auto',
      },
    },
    '& .MuiAccordionSummary-content': {
      margin: '8px 0',
      '&.Mui-expanded': {
        margin: '8px 0',
      },
    },
    '& .MuiAccordionDetails-root': {
      px: 1,
      pb: 2.5,
    },
  },
  helpAccordionQuestion: {
    fontWeight: 600,
    fontSize: '15px',
    color: '#1F2937',
    fontFamily: "'Inter', sans-serif",
  },
  helpAccordionAnswer: {
    color: '#475569',
    fontSize: '14px',
    lineHeight: 1.6,
    fontFamily: "'Inter', sans-serif",
  },
  helpTipContainer: {
    border: '1px solid #1DC2A0',
    bgcolor: '#F0FDF4',
    p: 2,
    borderRadius: 3,
    mt: 3,
  },
  helpTipText: {
    color: '#1F2937',
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
  },
};
