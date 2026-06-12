// =========================================================================
// ARCHIVO DE ESTILOS: LandingPage.styles.js
// =========================================================================
// Este archivo contiene todos los estilos visuales del componente LandingPage.
// Usamos el sistema de estilos sx de Material UI, lo que nos permite mantener
// acceso a las propiedades del tema y mantener limpio el archivo JSX de la vista.

export const styles = {
  // Contenedor principal de la aplicación (flexbox horizontal)
  mainLayout: {
    display: 'flex',
    minHeight: '100vh',
    bgcolor: '#f4f6f9', // Fondo gris claro de fondo
  },

  // -------------------------------------------------------------------------
  // ESTILOS DEL SIDEBAR LATERAL IZQUIERDO
  // -------------------------------------------------------------------------
  sidebar: {
    width: 260,
    bgcolor: '#0d1b6b', // Azul marino profundo corporativo
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRight: '1px solid rgba(255, 255, 255, 0.08)',
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
    fontWeight: 800,
    letterSpacing: 0.5,
    lineHeight: 1.1,
  },

  logoSubtitle: {
    opacity: 0.7,
    fontWeight: 600,
    letterSpacing: 1,
  },

  divider: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    mb: 2,
  },

  menuContainer: {
    px: 2,
  },

  // Estilo dinámico para el botón de menú seleccionado/no seleccionado
  menuItem: (isSelected) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    py: 1.2,
    px: 2,
    mb: 0.8,
    borderRadius: 2,
    cursor: 'pointer',
    bgcolor: isSelected ? '#10b981' : 'transparent', // Verde esmeralda para el seleccionado
    color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      bgcolor: isSelected ? '#10b981' : 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
    },
  }),

  // Sección de perfil de usuario y cierre de sesión
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
    bgcolor: '#10b981',
    fontSize: '0.9rem',
  },

  // -------------------------------------------------------------------------
  // ESTILOS DEL ÁREA DE CONTENIDO (DERECHA)
  // -------------------------------------------------------------------------
  contentArea: {
    flexGrow: 1,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    overflowY: 'auto',
  },

  welcomeText: {
    color: '#64748b',
    fontWeight: 600,
  },

  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 1.5,
    mt: 1,
  },

  panelIconContainer: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    bgcolor: '#0d1b6b',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  panelTitle: {
    fontWeight: 800,
    color: '#0d1b6b',
    fontFamily: "'Outfit', sans-serif",
  },

  tabsContainer: {
    borderBottom: 1,
    borderColor: '#e2e8f0',
  },

  // Sobrescribe el diseño de las pestañas secundarias
  tabsList: {
    '& .MuiTabs-indicator': {
      backgroundColor: '#0d1b6b',
      height: 3,
      borderRadius: '3px 3px 0 0',
    },
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.9rem',
      minWidth: 'auto',
      px: 2,
      color: '#64748b',
      '&.Mui-selected': {
        color: '#0d1b6b',
      },
    },
  },

  // -------------------------------------------------------------------------
  // ESTILOS DE LAS TARJETAS KPI (MÉTRICAS)
  // -------------------------------------------------------------------------
  kpiCardBlue: {
    bgcolor: '#0d1b6b',
    color: '#ffffff',
    borderRadius: 4,
    boxShadow: '0 4px 20px rgba(13, 27, 107, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },

  kpiCardWhite: {
    bgcolor: '#ffffff',
    color: '#1e293b',
    borderRadius: 4,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
    border: '1px solid #e2e8f0',
  },

  kpiValue: {
    fontWeight: 800,
    mb: 1,
    fontFamily: "'Outfit', sans-serif",
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
    fontWeight: 700,
    color: '#0d1b6b',
    fontFamily: "'Outfit', sans-serif",
  },

  metasButton: {
    bgcolor: '#0d1b6b',
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 2,
    px: 2,
    py: 0.8,
    '&:hover': {
      bgcolor: '#07104a',
    },
  },

  metaCard: {
    bgcolor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: 4,
    boxShadow: 'none',
  },

  metaCardContent: {
    p: '24px !important',
  },

  // Genera dinámicamente los estilos de los badges según el estado de la meta
  metaStatusBadge: (status) => {
    let bgcolor = '#e6f4ea'; // Completada (verde por defecto)
    let color = '#137333';

    if (status === 'progreso') {
      bgcolor = '#e8f0fe'; // En progreso (azul)
      color = '#1a73e8';
    } else if (status === 'atencion') {
      bgcolor = '#fce8e6'; // Requiere atención (rojo)
      color = '#c5221f';
    }

    return {
      bgcolor,
      color,
      px: 1.5,
      py: 0.5,
      borderRadius: 1.5,
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
    };
  },

  // Genera dinámicamente los estilos de la barra de progreso
  metaProgressBar: (status) => {
    let barColor = '#10b981'; // Verde

    if (status === 'progreso') {
      barColor = '#3b82f6'; // Azul
    } else if (status === 'atencion') {
      barColor = '#ef4444'; // Rojo
    }

    return {
      height: 8,
      borderRadius: 4,
      bgcolor: '#e2e8f0',
      '& .MuiLinearProgress-bar': {
        bgcolor: barColor,
        borderRadius: 4,
      },
    };
  },

  metaDetailButton: {
    bgcolor: '#0d1b6b',
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: 600,
    px: 3,
    borderRadius: 2,
    '&:hover': {
      bgcolor: '#07104a',
    },
  },

  // Botón flotante de ayuda / ayuda rápido en la esquina
  floatingHelpButton: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    bgcolor: '#0d1b6b',
    color: '#ffffff',
    width: 50,
    height: 50,
    boxShadow: '0 4px 12px rgba(13, 27, 107, 0.3)',
    '&:hover': {
      bgcolor: '#07104a',
    },
  },
};
