// =========================================================================
// ARCHIVO DE ESTILOS: LandingPage.styles.js
// =========================================================================
// Actualizado siguiendo las directrices exactas del UI_Kit.pdf de P.I.A.D.I.

export const styles = {
  // Contenedor principal de la aplicación (flexbox horizontal)
  mainLayout: {
    display: 'flex',
    minHeight: '100vh',
    bgcolor: '#F5F5F7', // Fondo general gris claro
    fontFamily: "'Inter', sans-serif",
  },

  // -------------------------------------------------------------------------
  // ESTILOS DEL SIDEBAR LATERAL IZQUIERDO
  // -------------------------------------------------------------------------
  sidebar: {
    width: 260,
    bgcolor: '#1E2875', // Azul institucional oscuro
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRight: '1px solid #E5E7EB', // Borde suave
  },

  logoContainer: {
    p: 3, // Equivalente a 24px
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
    px: 2, // 16px
  },

  // Estilo dinámico para el botón de menú
  menuItem: (isSelected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    py: 1.2,
    px: 2,
    mb: 0.8,
    borderRadius: 2,
    cursor: 'pointer',
    bgcolor: isSelected ? '#1DC2A0' : 'transparent', // Turquesa activo para seleccionados
    color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      bgcolor: isSelected ? '#1DC2A0' : 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
    },
  }),

  bottomSection: {
    p: 2, // 16px
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
    bgcolor: '#1DC2A0', // Turquesa activo para consistencia
    fontSize: '0.9rem',
  },

  // -------------------------------------------------------------------------
  // ESTILOS DEL ÁREA DE CONTENIDO (DERECHA)
  // -------------------------------------------------------------------------
  contentArea: {
    flexGrow: 1,
    p: 4, // 32px
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    overflowY: 'auto',
  },

  welcomeText: {
    color: '#6B7280', // Texto secundario
    fontWeight: 600,
    fontSize: '14px', // Texto pequeño
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
    bgcolor: '#1E2875', // Azul institucional
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  panelTitle: {
    fontWeight: 700,
    fontSize: '36px', // Título de página según UI Kit
    color: '#1E2875',
    fontFamily: "'Inter', sans-serif",
  },

  tabsContainer: {
    borderBottom: 1,
    borderColor: '#E5E7EB', // Borde suave
  },

  tabsList: {
    '& .MuiTabs-indicator': {
      backgroundColor: '#1E2875', // Azul institucional
      height: 3,
      borderRadius: '3px 3px 0 0',
    },
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '14px', // Labels / Textos pequeños
      minWidth: 'auto',
      px: 2,
      color: '#6B7280', // Texto secundario
      '&.Mui-selected': {
        color: '#1E2875', // Azul institucional
      },
    },
  },

  // -------------------------------------------------------------------------
  // ESTILOS DE LAS TARJETAS KPI (MÉTRICAS)
  // -------------------------------------------------------------------------
  kpiCardBlue: {
    bgcolor: '#1E2875', // Azul institucional oscuro
    color: '#ffffff',
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(30, 40, 117, 0.05)',
    position: 'relative',
    overflow: 'hidden',
  },

  kpiCardWhite: {
    bgcolor: '#FFFFFF', // Superficie blanca
    color: '#1F2937', // Texto principal
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.015)',
    border: '1px solid #E5E7EB', // Borde suave
  },

  kpiValue: {
    fontWeight: 600,
    fontSize: '30px', // Encabezado principal
    mb: 1,
    fontFamily: "'Inter', sans-serif",
  },

  kpiTrendContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.5,
  },

  // -------------------------------------------------------------------------
  // ESTILOS DE LA SECCIÓN DE METAS
  // -------------------------------------------------------------------------
  metasSectionContainer: {
    mt: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },

  metasHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  metasTitle: {
    fontWeight: 600,
    fontSize: '24px', // Encabezado secundario según UI Kit
    color: '#1E2875',
    fontFamily: "'Inter', sans-serif",
  },

  metasButton: {
    bgcolor: '#0F4AFF', // Azul acción
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    borderRadius: 2,
    px: 3,
    py: 1,
    '&:hover': {
      bgcolor: '#0c3bc6',
    },
  },

  metaCard: {
    bgcolor: '#FFFFFF', // Superficie blanca
    border: '1px solid #E5E7EB', // Borde suave
    borderRadius: 3,
    boxShadow: 'none',
  },

  metaCardContent: {
    p: '24px !important', // Padding de 24px según composición
  },

  // Genera dinámicamente los estilos de los badges según el estado de la meta
  metaStatusBadge: (status) => {
    let bgcolor = '#e6f4ea'; // Completada (verde por defecto)
    let color = '#10B981'; // Éxito según UI Kit

    if (status === 'progreso') {
      bgcolor = '#e8f0fe'; // En progreso (azul)
      color = '#3B82F6'; // Progreso según UI Kit
    } else if (status === 'atencion') {
      bgcolor = '#fce8e6'; // Requiere atención (rojo)
      color = '#EF4444'; // Peligro según UI Kit
    }

    return {
      bgcolor,
      color,
      px: 1.5,
      py: 0.5,
      borderRadius: 1.5,
      fontSize: '12px', // Badges y Captions
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
    };
  },

  // Genera dinámicamente los estilos de la barra de progreso
  metaProgressBar: (status) => {
    let barColor = '#10B981'; // Éxito según UI Kit

    if (status === 'progreso') {
      barColor = '#3B82F6'; // Progreso según UI Kit
    } else if (status === 'atencion') {
      barColor = '#EF4444'; // Peligro según UI Kit
    }

    return {
      height: 8,
      borderRadius: 4,
      bgcolor: '#E5E7EB', // Borde/fondo suave
      '& .MuiLinearProgress-bar': {
        bgcolor: barColor,
        borderRadius: 4,
      },
    };
  },

  metaDetailButton: {
    bgcolor: '#0F4AFF', // Azul acción
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    px: 3,
    borderRadius: 2,
    '&:hover': {
      bgcolor: '#0c3bc6',
    },
  },

  // Botón flotante de ayuda contextual
  floatingHelpButton: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    bgcolor: '#1E2875', // Azul institucional
    color: '#ffffff',
    width: 50,
    height: 50,
    boxShadow: '0 4px 12px rgba(30, 40, 117, 0.2)',
    '&:hover': {
      bgcolor: '#141b4f',
    },
  },
};
