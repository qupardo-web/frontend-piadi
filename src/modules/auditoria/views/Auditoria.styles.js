// =========================================================================
// ARCHIVO DE ESTILOS: Auditoria.styles.js
// =========================================================================
// Este archivo contiene los estilos del módulo Auditoría del Sistema.
// Alineado con el UI_Kit.pdf de P.I.A.D.I. y el diseño responsivo del frontend.

export const styles = {
  // Contenedor principal (responsivo)
  mainLayout: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    minHeight: '100vh',
    bgcolor: '#F5F5F7', // Fondo general gris claro
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
    flexShrink: 0,
  },

  panelTitle: {
    fontWeight: 700,
    fontSize: { xs: '28px', md: '36px' },
    color: '#1E2875',
    fontFamily: "'Inter', sans-serif",
  },

  // Breadcrumbs
  breadcrumbsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.8,
    color: '#6B7280',
    fontSize: '16px',
    fontWeight: 500,
  },

  // Tarjeta contenedora de la barra de búsquedas y filtros desplegables
  filterCard: {
    bgcolor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 3,
    boxShadow: 'none',
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 2.5,
  },

  filterRow: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 3,
    alignItems: 'center',
    width: '100%',
  },

  filterInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.8,
    flexGrow: 1,
    width: { xs: '100%', md: 'auto' },
  },

  filterLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#475569',
  },

  filterSelect: {
    borderRadius: '8px',
    bgcolor: '#ffffff',
    height: '40px',
    color: '#1F2937', // Fuerza el texto a ser gris oscuro (legible sobre fondo blanco)
    '& .MuiSelect-icon': {
      color: '#475569', // Color de flecha desplegable gris oscuro
    },
    '& fieldset': {
      borderColor: '#E5E7EB',
    },
    '&:hover fieldset': {
      borderColor: '#CBD5E1',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0F4AFF',
    },
  },

  filterDateInput: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      bgcolor: '#ffffff',
      height: '40px',
      color: '#1F2937', // Fuerza texto a ser gris oscuro
      '& fieldset': {
        borderColor: '#E5E7EB',
      },
      '&:hover fieldset': {
        borderColor: '#CBD5E1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#0F4AFF',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: '#1F2937', // Fuerza el valor de la fecha a ser gris oscuro
      '&::placeholder': {
        color: '#94A3B8',
        opacity: 1,
      },
    },
  },

  // Barra de búsquedas y botones
  actionsBar: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  searchField: {
    flexGrow: 1,
    width: { xs: '100%', sm: 'auto' },
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      bgcolor: '#ffffff',
      color: '#1F2937', // Fuerza el texto ingresado a ser gris oscuro
      '& fieldset': {
        borderColor: '#E5E7EB',
      },
      '&:hover fieldset': {
        borderColor: '#CBD5E1',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#0F4AFF',
      },
    },
    '& .MuiOutlinedInput-input': {
      color: '#1F2937', // Fuerza el color del texto escrito
      '&::placeholder': {
        color: '#64748B', // Placeholder en un gris más visible
        opacity: 0.8,
      },
    },
  },

  filterButton: {
    bgcolor: '#ffffff',
    color: '#475569',
    border: '1px solid #E5E7EB',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    borderRadius: 2,
    px: 2.5,
    py: 1,
    height: '40px',
    width: { xs: '100%', sm: 'auto' },
    '&:hover': {
      bgcolor: '#F8FAFC',
      borderColor: '#CBD5E1',
    },
  },

  exportButton: {
    bgcolor: '#0F4AFF', // Azul acción
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    borderRadius: 2,
    px: 2.5,
    py: 1,
    height: '40px',
    width: { xs: '100%', sm: 'auto' },
    '&:hover': {
      bgcolor: '#0c3bc6',
    },
  },

  // Contenedor principal de pestañas
  sectionCard: {
    bgcolor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 3,
    boxShadow: 'none',
    p: 3,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },

  tabsContainer: {
    borderBottom: '1px solid #E5E7EB',
    mb: 1,
  },

  tabsList: {
    '& .MuiTabs-indicator': {
      backgroundColor: '#0F4AFF', // Color azul acción para el indicador
      height: 3,
      borderRadius: '3px 3px 0 0',
    },
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '15px',
      minWidth: 'auto',
      px: { xs: 1.5, sm: 3 },
      color: '#6B7280',
      '&.Mui-selected': {
        color: '#0F4AFF',
      },
    },
  },

  // Tabla
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },

  tableHeadCell: {
    fontWeight: 600,
    fontSize: '14px',
    color: '#475569',
    bgcolor: '#F8FAFC',
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

  // Badges de estado en base a la pestaña
  badgeCarga: {
    display: 'inline-flex',
    alignItems: 'center',
    bgcolor: '#E6F4EA', // Verde claro
    color: '#10B981', // Verde éxito
    px: 1.5,
    py: 0.5,
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },

  badgeMetas: {
    display: 'inline-flex',
    alignItems: 'center',
    bgcolor: '#F3E8FF', // Púrpura claro
    color: '#9333EA', // Púrpura metas
    px: 1.5,
    py: 0.5,
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },

  badgeLogin: {
    display: 'inline-flex',
    alignItems: 'center',
    bgcolor: '#EFF6FF', // Azul claro
    color: '#3B82F6', // Azul login
    px: 1.5,
    py: 0.5,
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },

  badgeInicioSesion: {
    display: 'inline-flex',
    alignItems: 'center',
    bgcolor: '#E0F2FE', // Azul cielo claro
    color: '#0284C7', // Azul cielo
    px: 1.5,
    py: 0.5,
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700,
  },

  badgeCierreSesion: {
    display: 'inline-flex',
    alignItems: 'center',
    bgcolor: '#F1F5F9', // Gris claro
    color: '#64748B', // Gris oscuro
    px: 1.5,
    py: 0.5,
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700,
  },

  badgeCreacion: {
    display: 'inline-flex',
    alignItems: 'center',
    bgcolor: '#F3E8FF', // Púrpura claro
    color: '#9333EA', // Púrpura
    px: 1.5,
    py: 0.5,
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700,
  },

  badgeEdicion: {
    display: 'inline-flex',
    alignItems: 'center',
    bgcolor: '#EFF6FF', // Azul claro
    color: '#3B82F6', // Azul
    px: 1.5,
    py: 0.5,
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700,
  },

  badgeEliminacion: {
    display: 'inline-flex',
    alignItems: 'center',
    bgcolor: '#FEE2E2', // Rojo claro
    color: '#EF4444', // Rojo
    px: 1.5,
    py: 0.5,
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 700,
  },

  entidadBold: {
    fontWeight: 600,
    fontSize: '14px',
    color: '#1F2937',
  },

  entidadSub: {
    fontSize: '12px',
    color: '#6B7280',
    mt: 0.3,
  },

  // Enlace de archivo de origen
  fileLink: {
    color: '#10B981', // Verde éxito
    textDecoration: 'none',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.8,
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  // Contenedor responsivo móvil del enlace de archivo
  mobileFileLink: {
    color: '#10B981', // Verde éxito
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    maxWidth: '100%',
    fontFamily: "'Inter', sans-serif",
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  // Texto truncado (...) del archivo para prevenir desbordes en móviles
  mobileFileLinkText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis', // Puntos suspensivos
    whiteSpace: 'nowrap', // Una sola línea
    display: 'block',
    maxWidth: 'calc(100% - 24px)', // Resta espacio aproximado del icono
    ml: 1,
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

  // -------------------------------------------------------------------------
  // DISEÑO MÓVIL CARD-BASED (RESPONSIVE)
  // -------------------------------------------------------------------------
  mobileCardsContainer: {
    display: { xs: 'flex', md: 'none' },
    flexDirection: 'column',
    gap: 2.5,
    mt: 1,
  },

  mobileAuditCard: {
    bgcolor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 3,
    p: 2.5,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    boxShadow: 'none',
  },

  mobileCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 1.5,
  },

  mobileMetadataRow: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'flex-start', sm: 'center' },
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 2,
    mt: 0.5,
  },

  metadataItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    color: '#475569',
    fontSize: '13px',
  },

  templatePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.8,
    bgcolor: '#1E2875', // Azul institucional
    color: '#ffffff',
    px: 1.5,
    py: 0.5,
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    alignSelf: { xs: 'flex-start', sm: 'auto' },
  },

  paginationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.5,
    border: '1px solid #E5E7EB',
    borderRadius: 3,
    p: 1.5,
    mt: 2,
  },

  paginationArrow: {
    color: '#475569',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      color: '#1E2875',
    },
    '&.Mui-disabled': {
      color: '#CBD5E1',
      cursor: 'default',
    },
  },

  paginationDot: {
    color: '#94A3B8',
    fontSize: '14px',
    userSelect: 'none',
  },

  paginationPage: (isActive) => ({
    color: isActive ? '#1F2937' : '#94A3B8',
    fontWeight: isActive ? 700 : 500,
    fontSize: '14px',
    cursor: 'pointer',
    userSelect: 'none',
    px: 1,
    '&:hover': {
      color: '#1E2875',
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
