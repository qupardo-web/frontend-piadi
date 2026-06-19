// =========================================================================
// ARCHIVO DE ESTILOS: RepositorioArchivos.styles.js
// =========================================================================
// Este archivo contiene los estilos de la vista Repositorio de Archivos.
// Implementa la Opción B: Scroll Natural con Sidebar Adherente (Sticky Sidebar Layout).

export const styles = {
  // Contenedor principal
  mainLayout: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    minHeight: '100vh',
    bgcolor: '#F5F5F7',
    fontFamily: "'Inter', sans-serif",
  },

  // -------------------------------------------------------------------------
  // ESTILOS DEL SIDEBAR LATERAL
  // -------------------------------------------------------------------------
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
    bgcolor: isSelected ? '#1DC2A0' : 'transparent', // Turquesa activo
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
    height: '50px', // Altura fija de la AppBar
  },

  mobileToolbar: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center', // Centrado vertical
    width: '100%',
    px: 3, // Aleja el botón del borde de la pantalla
    height: '100%', // Toma la altura completa de la AppBar
    minHeight: '50px',
    '@media (min-width: 0px)': {
      minHeight: '50px', // Fuerza altura uniforme de 50px en móviles
    },
  },

  // -------------------------------------------------------------------------
  // ESTILOS DEL ÁREA DE CONTENIDO (DERECHA)
  // -------------------------------------------------------------------------
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
    flexShrink: 0, // Evita que se deforme en pantallas pequeñas
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

  // Tabs
  tabsContainer: {
    borderBottom: '1px solid #E5E7EB',
    mb: 2,
    '& .MuiTabs-indicator': {
      backgroundColor: '#1E2875',
      height: 3,
    },
  },

  tabItem: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '15px',
    color: '#6B7280',
    px: 3,
    minWidth: 'auto',
    '&.Mui-selected': {
      color: '#1E2875',
    },
  },

  // Filtros y botón superior
  filterSection: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'stretch', sm: 'center' },
    gap: 2,
    mb: 1,
  },

  selectGroup: {
    display: 'flex',
    gap: 2,
    flexWrap: 'wrap',
  },

  selectInput: {
    bgcolor: '#FFFFFF',
    color: '#1F2937', // Texto oscuro para contrastar con el fondo blanco
    borderRadius: 2,
    minWidth: 160,
    '& .MuiSelect-icon': {
      color: '#1F2937', // Flecha select oscura
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E5E7EB',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#94A3B8',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1E2875',
    },
  },

  actionButton: {
    bgcolor: '#0F4AFF', // Azul acción
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    borderRadius: 2,
    px: 3,
    py: 1,
    boxShadow: '0 4px 12px rgba(15, 74, 255, 0.2)',
    '&:hover': {
      bgcolor: '#0c3bc6',
    },
  },

  // Grid de plantillas
  templatesGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
    gap: 3,
  },

  // Card de plantilla en repositorio
  templateCard: {
    bgcolor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 3,
    p: 3,
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 220,
    justifyContent: 'space-between',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.03)',
      borderColor: '#CBD5E1',
    },
  },

  templateCardHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  },

  templateCardIcon: (deptColor) => ({
    color: deptColor,
    display: 'flex',
    alignItems: 'center',
    mt: 0.2,
  }),

  templateCardTitle: {
    fontWeight: 700,
    fontSize: '16px',
    color: '#1E2875',
    mb: 0.5,
  },

  templateCardDesc: {
    fontSize: '13px',
    color: '#6B7280',
    lineHeight: 1.4,
  },

  templateCardFooter: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
    mt: 3,
  },

  badgeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  templateBadge: (deptColor) => ({
    display: 'inline-block',
    bgcolor: deptColor,
    color: '#ffffff',
    px: 1.2,
    py: 0.4,
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }),

  predefinedLabel: {
    fontSize: '12px',
    color: '#94A3B8',
    fontWeight: 500,
  },

  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    pt: 1,
    borderTop: '1px solid #F3F4F6',
  },

  usesText: {
    fontSize: '12px',
    color: '#94A3B8',
    fontWeight: 500,
  },

  downloadButton: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
    color: '#0F4AFF',
    p: 0,
    minWidth: 'auto',
    '&:hover': {
      color: '#0c3bc6',
      bgcolor: 'transparent',
      textDecoration: 'underline',
    },
    '& .MuiButton-startIcon': {
      marginRight: '4px',
    },
  },

  // -------------------------------------------------------------------------
  // PESTAÑA: ARCHIVOS HISTÓRICOS
  // -------------------------------------------------------------------------
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 2.5,
    flexWrap: 'wrap',
    gap: 2,
  },

  historicalTitle: {
    fontWeight: 600,
    fontSize: '20px',
    color: '#1E2875',
    fontFamily: "'Inter', sans-serif",
  },

  searchInput: {
    bgcolor: '#FFFFFF',
    borderRadius: 2,
    width: { xs: '100%', sm: 260 },
    '& .MuiOutlinedInput-input': {
      color: '#1F2937', // Texto oscuro al escribir
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E5E7EB',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#94A3B8',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1E2875',
    },
  },

  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },

  tableHeadCell: {
    fontWeight: 600,
    fontSize: '14px',
    color: '#475569',
    bgcolor: '#F5F5F7',
    py: 1.5,
    px: 2,
    borderBottom: '1px solid #E5E7EB',
  },

  tableBodyCell: {
    fontSize: '14px',
    color: '#1F2937',
    py: 2,
    px: 2,
    borderBottom: '1px solid #E5E7EB',
  },

  fileLink: {
    color: '#10B981', // Verde éxito
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  floatingHelpButton: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    bgcolor: '#1E2875',
    color: '#ffffff',
    width: 50,
    height: 50,
    boxShadow: '0 4px 12px rgba(30, 40, 117, 0.2)',
    zIndex: 1000,
    '&:hover': {
      bgcolor: '#141b4f',
    },
  },

  // Estilos del diálogo de creación de plantilla personalizada
  createDialogPaper: {
    borderRadius: 4,
    p: { xs: 3, md: 4 },
    bgcolor: '#FFFFFF',
    color: '#1F2937',
    maxWidth: '700px',
    width: '100%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  createDialogTitle: {
    fontWeight: 700,
    fontSize: '24px',
    color: '#1E2875',
    p: 0,
    mb: 0.5,
    fontFamily: "'Inter', sans-serif",
  },
  createDialogSubtitle: {
    color: '#6B7280',
    fontSize: '14px',
    mb: 3,
  },
  inputLabelCustom: {
    fontWeight: 600,
    fontSize: '14px',
    color: '#1E2875',
    mb: 1,
    display: 'block',
  },
  dialogInput: {
    bgcolor: '#FFFFFF',
    borderRadius: 2,
    '& .MuiOutlinedInput-input': {
      color: '#1F2937',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E5E7EB',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#94A3B8',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1E2875',
    },
  },
  dialogSelect: {
    bgcolor: '#FFFFFF',
    color: '#1F2937',
    borderRadius: 2,
    '& .MuiSelect-icon': {
      color: '#1F2937',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E5E7EB',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#94A3B8',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#1E2875',
    },
  },
  addColumnLink: {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
    color: '#0F4AFF',
    p: 0,
    minWidth: 'auto',
    '&:hover': {
      color: '#0c3bc6',
      bgcolor: 'transparent',
      textDecoration: 'underline',
    },
  },
  dialogCaptionText: {
    fontSize: '11px',
    color: '#94A3B8',
    mt: 0.5,
  },
  dialogDropZone: (isDragActive) => ({
    border: '2px dashed #CBD5E1',
    borderColor: isDragActive ? '#0F4AFF' : '#CBD5E1',
    borderRadius: 3,
    bgcolor: isDragActive ? 'rgba(15, 74, 255, 0.02)' : '#F8FAFC',
    p: 3,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    mt: 1,
    '&:hover': {
      borderColor: '#0F4AFF',
      bgcolor: 'rgba(15, 74, 255, 0.01)',
    },
  }),
  dialogDropZoneTextPrimary: {
    fontWeight: 600,
    fontSize: '13px',
    color: '#1E2875',
  },
  dialogDropZoneTextSecondary: {
    fontSize: '11px',
    color: '#94A3B8',
  },
  dialogCancelBtn: {
    textTransform: 'none',
    fontWeight: 600,
    color: '#6B7280',
    fontSize: '14px',
    mr: 2,
    '&:hover': {
      bgcolor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  dialogSubmitBtn: (isActive) => ({
    bgcolor: isActive ? '#1E2875' : '#E2E8F0',
    color: isActive ? '#ffffff' : '#94A3B8',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    px: 4,
    py: 1,
    borderRadius: 2,
    '&.Mui-disabled': {
      bgcolor: '#E2E8F0',
      color: '#94A3B8',
    },
    '&:hover': {
      bgcolor: '#141b4f',
    },
  }),

  // =========================================================================
  // ESTILOS DEL CENTRO DE AYUDA (FAQ)
  // =========================================================================
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
    bgcolor: '#F0FDF4', // Fondo verde menta muy claro
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
