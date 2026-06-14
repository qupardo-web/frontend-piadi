// =========================================================================
// ARCHIVO DE ESTILOS: LandingPage.styles.js
// =========================================================================
// Actualizado para soportar un diseño totalmente responsivo (móvil y escritorio).

export const styles = {
  // Contenedor principal: Cambia a columna en móviles y fila en escritorios
  mainLayout: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    height: '100vh', // Mantiene el layout al tamaño exacto de la pantalla (viewport)
    maxHeight: '100vh', // Evita que crezca más allá de la pantalla
    overflow: 'hidden', // Oculta el scrollbar del body/sitio general
    bgcolor: '#F5F5F7',
    fontFamily: "'Inter', sans-serif",
  },

  // -------------------------------------------------------------------------
  // ESTILOS DEL SIDEBAR LATERAL (ESCRITORIO)
  // -------------------------------------------------------------------------
  sidebar: {
    width: 260,
    bgcolor: '#1E2875', // Azul institucional
    color: '#ffffff',
    display: { xs: 'none', md: 'flex' }, // Oculto en móviles, visible en escritorios (md y superior)
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRight: '1px solid #E5E7EB',
  },

  // Contenedor del menú dentro del Drawer de Móviles
  drawerContent: {
    width: 260,
    height: '100%',
    bgcolor: '#1E2875', // Azul institucional
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

  // -------------------------------------------------------------------------
  // ESTILOS DE LA BARRA SUPERIOR PARA MÓVILES (APPBAR)
  // -------------------------------------------------------------------------
  mobileAppBar: {
    display: { xs: 'flex', md: 'none' }, // Visible solo en móviles/tablets
    bgcolor: '#1E2875',
    borderBottom: '1px solid #E5E7EB',
    boxShadow: 'none',
    borderRadius: 0, // Evita heredar bordes redondeados del tema global de MUI
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
    p: { xs: 3, md: 4 }, // Padding reducido a 24px en móvil y 32px en escritorio
    pt: { xs: 11, md: 4 }, // Padding superior extra en móvil para no taparse por la barra fija
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    overflowY: 'auto',
  },

  welcomeText: {
    color: '#6B7280',
    fontWeight: 600,
    fontSize: '14px',
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
    flexShrink: 0, // Evita que se deforme/encoja en pantallas pequeñas
  },

  panelTitle: {
    fontWeight: 700,
    fontSize: { xs: '28px', md: '36px' }, // Título un poco más pequeño en móviles
    color: '#1E2875',
    fontFamily: "'Inter', sans-serif",
  },

  tabsContainer: {
    borderBottom: 1,
    borderColor: '#E5E7EB',
  },

  tabsList: {
    '& .MuiTabs-indicator': {
      backgroundColor: '#1E2875',
      height: 3,
      borderRadius: '3px 3px 0 0',
    },
    '& .MuiTab-root': {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '14px',
      minWidth: 'auto',
      px: 2,
      color: '#6B7280',
      '&.Mui-selected': {
        color: '#1E2875',
      },
    },
  },

  // -------------------------------------------------------------------------
  // ESTILOS DE LAS TARJETAS KPI (MÉTRICAS)
  // -------------------------------------------------------------------------
  kpiCardBlue: (customBgColor, customTextColor = '#ffffff') => ({
    bgcolor: customBgColor || '#1E2875',
    color: customTextColor,
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(30, 40, 117, 0.05)',
    position: 'relative',
    overflow: 'hidden',
  }),

  kpiCardWhite: {
    bgcolor: '#FFFFFF',
    color: '#1F2937',
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.015)',
    border: '1px solid #E5E7EB',
  },

  kpiValue: {
    fontWeight: 600,
    fontSize: '30px',
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
    flexDirection: { xs: 'column', sm: 'row' }, // Stack vertical en móviles pequeños
    alignItems: { xs: 'flex-start', sm: 'center' },
    justifyContent: 'space-between',
    gap: 2,
  },

  metasTitle: {
    fontWeight: 600,
    fontSize: '24px',
    color: '#1E2875',
    fontFamily: "'Inter', sans-serif",
  },

  metasButton: {
    bgcolor: '#0F4AFF',
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    borderRadius: 2,
    px: 3,
    py: 1,
    width: { xs: '100%', sm: 'auto' }, // Ancho completo en móvil
    '&:hover': {
      bgcolor: '#0c3bc6',
    },
  },

  metaCard: {
    bgcolor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: 3,
    boxShadow: 'none',
  },

  metaCardContent: {
    p: '24px !important',
  },

  metaStatusBadge: (status) => {
    let bgcolor = '#e6f4ea';
    let color = '#10B981';

    if (status === 'progreso') {
      bgcolor = '#e8f0fe';
      color = '#3B82F6';
    } else if (status === 'atencion') {
      bgcolor = '#fce8e6';
      color = '#EF4444';
    }

    return {
      bgcolor,
      color,
      px: 1.5,
      py: 0.5,
      borderRadius: 1.5,
      fontSize: '12px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
    };
  },

  metaProgressBar: (status) => {
    let barColor = '#10B981';

    if (status === 'progreso') {
      barColor = '#3B82F6';
    } else if (status === 'atencion') {
      barColor = '#EF4444';
    }

    return {
      height: 8,
      borderRadius: 4,
      bgcolor: '#E5E7EB',
      '& .MuiLinearProgress-bar': {
        bgcolor: barColor,
        borderRadius: 4,
      },
    };
  },

  metaDetailButton: {
    bgcolor: '#0F4AFF',
    color: '#ffffff',
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '14px',
    px: 3,
    borderRadius: 2,
    width: { xs: '100%', md: 'auto' }, // Ancho completo en móvil
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
};
