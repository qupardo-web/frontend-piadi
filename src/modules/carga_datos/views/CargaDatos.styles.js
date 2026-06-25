// =========================================================================
// ARCHIVO DE ESTILOS: CargaDatos.styles.js
// =========================================================================
// Este archivo contiene los estilos de la vista Carga de Datos.
// Alineado con el UI_Kit.pdf de P.I.A.D.I. y el diseño responsivo de la Landing Page.

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

  // Breadcrumbs
  breadcrumbsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.8,
    color: '#6B7280',
    fontSize: '16px',
    fontWeight: 500,
  },

  // Alerta informativa del formato requerido
  formatAlert: {
    display: 'flex',
    gap: 1.5,
    p: 2,
    borderRadius: 3,
    bgcolor: '#e8f0fe', // Fondo azul claro suave
    borderLeft: '4px solid #0F4AFF', // Borde izquierdo azul acción grueso
  },

  alertTitle: {
    fontWeight: 700,
    fontSize: '14px',
    color: '#1E2875',
  },

  alertText: {
    fontSize: '14px',
    color: '#475569',
    mt: 0.5,
  },

  // Botón principal de carga
  uploadButton: {
    bgcolor: '#0F4AFF', // Azul acción
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    borderRadius: 2.5,
    px: 3,
    py: 1.2,
    alignSelf: 'flex-start', // No ocupa todo el ancho
    boxShadow: '0 4px 12px rgba(15, 74, 255, 0.2)',
    '&:hover': {
      bgcolor: '#0c3bc6',
    },
  },

  // Tarjeta de sección blanca (Cargas recientes y Repositorio)
  sectionCard: {
    bgcolor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 3,
    boxShadow: 'none',
    p: 3,
  },

  sectionTitle: {
    fontWeight: 600,
    fontSize: '24px',
    color: '#1E2875',
    mb: 2,
    fontFamily: "'Inter', sans-serif",
  },

  sectionSubText: {
    fontSize: '14px',
    color: '#6B7280',
    mb: 3,
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

  // Enlace del archivo cargado
  fileLink: {
    color: '#10B981', // Verde éxito
    textDecoration: 'none',
    fontWeight: 500,
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  // Badge de estado de carga exitosa
  statusBadgeSuccess: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
    color: '#10B981', // Verde éxito
    fontWeight: 600,
    fontSize: '14px',
  },

  // Botón para acceder al repositorio
  metaDetailButton: {
    bgcolor: '#0F4AFF', // Azul acción
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    px: 3,
    py: 1.2,
    borderRadius: 2,
    width: { xs: '100%', md: 'auto' }, // Ancho completo en móvil
    boxShadow: '0 4px 12px rgba(15, 74, 255, 0.2)',
    '&:hover': {
      bgcolor: '#0c3bc6',
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

  // =========================================================================
  // ESTILOS DIÁLOGO CARGAR DATOS
  // =========================================================================
  dialogPaper: {
    borderRadius: 4,
    p: { xs: 2, md: 3 },
    maxWidth: '850px',
    width: '100%',
    bgcolor: '#FFFFFF', // Forzar fondo blanco
    color: '#1F2937',   // Forzar texto oscuro
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  dialogTitle: {
    fontWeight: 700,
    fontSize: '28px',
    color: '#1E2875',
    p: 0,
    mb: 1,
    fontFamily: "'Inter', sans-serif",
  },
  dialogSubtitle: {
    color: '#6B7280',
    fontSize: '14px',
    mb: 4,
  },
  sectionSubtitleDialog: {
    fontWeight: 600,
    fontSize: '16px',
    color: '#1E2875',
    mb: 2.5,
    fontFamily: "'Inter', sans-serif",
  },
  templatesGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    gap: 2,
    mb: 4,
  },
  templateCard: (isSelected) => ({
    border: isSelected ? '2px solid #0F4AFF' : '1px solid #E5E7EB',
    borderRadius: 3,
    p: 2,
    cursor: 'pointer',
    bgcolor: isSelected ? 'rgba(15, 74, 255, 0.03)' : '#ffffff',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    gap: 1.5,
    alignItems: 'flex-start',
    '&:hover': {
      borderColor: isSelected ? '#0F4AFF' : '#94A3B8',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
    },
  }),
  templateCardIcon: (deptColor) => ({
    color: deptColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    mt: 0.5,
  }),
  templateCardTitle: {
    fontWeight: 600,
    fontSize: '15px',
    color: '#1E2875',
    mb: 0.5,
  },
  templateCardDesc: {
    fontSize: '12px',
    color: '#6B7280',
    lineHeight: 1.4,
    mb: 1.5,
  },
  templateBadge: (deptColor) => ({
    display: 'inline-block',
    bgcolor: deptColor,
    color: '#ffffff',
    px: 1.2,
    py: 0.3,
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }),
  dropZone: (isDragActive) => ({
    border: '2px dashed #CBD5E1',
    borderColor: isDragActive ? '#0F4AFF' : '#CBD5E1',
    borderRadius: 3,
    bgcolor: isDragActive ? 'rgba(15, 74, 255, 0.02)' : '#F8FAFC',
    p: 4,
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.5,
    mb: 4,
    '&:hover': {
      borderColor: '#0F4AFF',
      bgcolor: 'rgba(15, 74, 255, 0.01)',
    },
  }),
  dropZoneIcon: {
    fontSize: 48,
    color: '#94A3B8',
  },
  dropZoneTextPrimary: {
    fontWeight: 600,
    fontSize: '15px',
    color: '#0F4AFF',
  },
  dropZoneTextSecondary: {
    fontSize: '13px',
    color: '#6B7280',
  },
  dropZoneSelectButton: {
    bgcolor: '#0F4AFF',
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '13px',
    borderRadius: 2,
    px: 3,
    py: 0.8,
    '&:hover': {
      bgcolor: '#0c3bc6',
    },
  },
  dropZoneCaption: {
    fontSize: '11px',
    color: '#94A3B8',
  },
  dialogCancelButton: {
    textTransform: 'none',
    fontWeight: 600,
    color: '#6B7280',
    fontSize: '14px',
    mr: 2,
    '&:hover': {
      bgcolor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  dialogSubmitButton: (isActive) => ({
    bgcolor: isActive ? '#0F4AFF' : '#E2E8F0',
    color: isActive ? '#ffffff' : '#94A3B8',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    px: 4,
    py: 1,
    borderRadius: 2,
    boxShadow: isActive ? '0 4px 12px rgba(15, 74, 255, 0.2)' : 'none',
    pointerEvents: isActive ? 'auto' : 'none',
    '&.Mui-disabled': {
      bgcolor: '#E2E8F0',
      color: '#94A3B8',
    },
    '&:hover': {
      bgcolor: '#0c3bc6',
    },
  }),

  // Estilos responsivos móviles para la tabla de cargas recientes (diseño de tarjetas)
  mobileCardsContainer: {
    display: { xs: 'flex', md: 'none' },
    flexDirection: 'column',
    gap: 2.5,
    mt: 1,
  },

  mobileUploadCard: {
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
    flexDirection: 'column',
  },

  // Nombre de archivo con truncado de texto (...) si excede el ancho de la tarjeta
  mobileCardFilename: {
    color: '#10B981', // Verde éxito
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '14px',
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis', // Añade los puntos suspensivos
    whiteSpace: 'nowrap', // Mantiene el texto en una sola línea
    maxWidth: '100%',
    fontFamily: "'Inter', sans-serif",
    '&:hover': {
      textDecoration: 'underline',
    },
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

