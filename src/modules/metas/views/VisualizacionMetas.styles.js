// =========================================================================
// ARCHIVO DE ESTILOS: VisualizacionMetas.styles.js
// =========================================================================

export const styles = {
  mainLayout: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    minHeight: '100vh',
    bgcolor: '#F8F8F8', // Fondo general de metas
    fontFamily: "'Inter', sans-serif",
  },

  // Sidebar
  sidebar: {
    width: 260,
    bgcolor: '#1E2875', // Azul institucional oficial
    color: '#ffffff',
    display: { xs: 'none', md: 'flex' },
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRight: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    height: '100vh',
  },

  drawerContent: {
    width: 260,
    height: '100%',
    bgcolor: '#1E2875', // Azul institucional oficial
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
    bgcolor: isSelected ? '#1DC2A0' : 'transparent', // Turquesa activo oficial
    color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
    position: 'relative',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      bgcolor: isSelected ? '#1DC2A0' : 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
    },
    // Barra blanca a la izquierda para el item activo
    ...(isSelected ? {
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 4,
        height: 40,
        bgcolor: '#ffffff',
        borderRadius: '0 4px 4px 0',
      }
    } : {}),
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
    bgcolor: '#1DC2A0', // Turquesa activo oficial
    fontSize: '0.9rem',
  },

  // Mobile Appbar
  mobileAppBar: {
    display: { xs: 'flex', md: 'none' },
    bgcolor: '#1E2875', // Azul institucional oficial
    borderBottom: '1px solid #E5E7EB',
    boxShadow: 'none',
    borderRadius: 0,
    height: '50px',
  },

  mobileToolbar: {
    minHeight: '50px !important',
    px: 1.5,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Content Area
  contentArea: {
    flexGrow: 1,
    p: { xs: 3, md: 6 },
    pt: { xs: 11, md: 4 }, // Padding superior extra en móvil por la AppBar fija
    overflowX: 'hidden',
  },

  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 4,
    mt: 1,
  },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    bgcolor: '#1E2875', // Azul institucional
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.8,
    color: '#6B7280',
    fontSize: '16px',
    fontWeight: 500,
    mb: 1.5,
  },

  breadcrumbLink: {
    color: '#6B7280',
    textDecoration: 'none',
    fontSize: '16px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  breadcrumbCurrent: {
    color: '#1E2875',
    fontSize: '16px',
    fontWeight: 600,
  },

  pageTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: { xs: '28px', md: '36px' },
    fontWeight: 700,
    color: '#1E2875',
  },

  pageSubtitle: {
    fontSize: '14px',
    color: '#6B7280',
    mt: 0.5,
  },

  // Toolbar (crear, buscar, ordenar)
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    mt: 0.5,
    flexWrap: 'wrap',
  },

  createMetaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    height: 44,
    px: 2.5,
    bgcolor: '#1a71f6',
    color: '#ffffff',
    borderRadius: 3,
    textTransform: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 600,
    boxShadow: '0 4px 10px rgba(26, 113, 246, 0.25)',
    '&:hover': {
      bgcolor: '#1560d3',
    },
  },

  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    bgcolor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: 2,
    px: 1.5,
    height: 44,
    flex: '1 1 280px',
    maxWidth: 320,
    '&:focus-within': {
      borderColor: '#1a71f6',
      boxShadow: '0 0 0 2px rgba(26, 113, 246, 0.25)',
    },
  },

  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '14px',
    fontFamily: 'inherit',
    '&::placeholder': {
      color: '#9ca3af',
    },
  },

  sortSelectWrap: {
    position: 'relative',
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 1,
  },

  sortSelect: {
    height: 44,
    px: 1.5,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    border: '1px solid #d1d5db',
    borderRadius: 2,
    bgcolor: '#ffffff',
    fontFamily: 'inherit',
    fontSize: '14px',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#9ca3af',
    },
  },

  sortDirBtn: {
    bgcolor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#666666',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
    p: 0.5,
    '&:hover': {
      color: '#161796',
    },
  },

  sortMenu: {
    position: 'absolute',
    top: 'calc(100% + 6px)',
    left: 0,
    minWidth: '100%',
    width: 'max-content',
    bgcolor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 2,
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    zIndex: 30,
    p: 0.5,
  },

  sortMenuItem: (isSelected) => ({
    display: 'block',
    width: '100%',
    textAlign: 'left',
    px: 1.5,
    py: 1,
    border: 'none',
    bgcolor: isSelected ? '#f5f9ff' : 'transparent',
    color: isSelected ? '#1a71f6' : '#111827',
    fontWeight: isSelected ? 600 : 400,
    cursor: 'pointer',
    borderRadius: 1,
    fontSize: '13.5px',
    '&:hover': {
      bgcolor: '#eff6ff',
    },
  }),

  // Filtros
  filterCard: {
    bgcolor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 3,
    p: 3,
    mt: 2,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },

  filterHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
  },

  filterTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '16px',
    fontWeight: 600,
    color: '#161796',
  },

  filterToggleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    bgcolor: '#ffffff',
    border: '1px solid #1a71f6',
    borderRadius: 2,
    color: '#1a71f6',
    fontSize: '13px',
    fontWeight: 500,
    px: 1.5,
    py: 0.8,
    textTransform: 'none',
    '&:hover': {
      bgcolor: '#eff6ff',
    },
  },

  filterFieldsGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
    gap: 2,
  },

  filterField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.8,
  },

  filterLabel: {
    fontSize: '13px',
    color: '#666666',
    fontWeight: 500,
  },

  filterInput: {
    padding: '9px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 2,
    fontSize: '14px',
    color: '#111827',
    bgcolor: '#ffffff',
    outline: 'none',
    '&:focus': {
      borderColor: '#1a71f6',
      boxShadow: '0 0 0 2px rgba(26, 113, 246, 0.25)',
    },
  },

  // Grid de Metas
  metasGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    mt: 2.5,
  },

  metaCard: (estado) => {
    let borderLeftColor = '#3b82f6'; // en-curso default
    if (estado === 'completada') borderLeftColor = '#059669';
    if (estado === 'alerta') borderLeftColor = '#dc2626';

    return {
      position: 'relative',
      bgcolor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: 3,
      p: 3,
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      '&:hover': {
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.04)',
      },
      // Borde de estado izquierdo
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: 4,
        bgcolor: borderLeftColor,
        borderRadius: '12px 0 0 12px',
      },
    };
  },

  metaHeaderGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 2,
    flexWrap: { xs: 'wrap', sm: 'nowrap' },
  },

  metaHeadRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 1,
  },

  metaCardTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '18px',
    fontWeight: 700,
    color: '#161796',
    lineHeight: 1.3,
  },

  metaCardArea: {
    fontSize: '13px',
    color: '#666666',
    mt: 0.2,
  },

  metaBadgesContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.8,
    justifyContent: { xs: 'flex-start', sm: 'flex-end' },
    mb: 1,
  },

  estadoBadge: (estado) => {
    let badgeStyles = {
      bgcolor: '#dbeafe',
      color: '#1d4ed8',
      border: '1px solid #bfdbfe',
    };
    if (estado === 'completada') {
      badgeStyles = {
        bgcolor: '#ecfdf5',
        color: '#047857',
        border: '1px solid #a7f3d0',
      };
    } else if (estado === 'alerta') {
      badgeStyles = {
        bgcolor: '#fee2e2',
        color: '#b91c1c',
        border: '1px solid #fecaca',
      };
    }
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.5,
      fontSize: '12px',
      fontWeight: 600,
      borderRadius: '999px',
      px: 1.2,
      py: 0.4,
      ...badgeStyles,
    };
  },

  prioridadBadge: (prioridad) => {
    let prioStyles = {
      bgcolor: '#fffbeb',
      color: '#b45309',
      dotColor: '#f59e0b',
    };
    if (prioridad === 'alta') {
      prioStyles = {
        bgcolor: '#fef2f2',
        color: '#b91c1c',
        dotColor: '#ef4444',
      };
    } else if (prioridad === 'baja') {
      prioStyles = {
        bgcolor: '#f0fdf4',
        color: '#15803d',
        dotColor: '#22c55e',
      };
    }
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.6,
      borderRadius: '999px',
      px: 1.2,
      py: 0.4,
      fontSize: '12px',
      fontWeight: 600,
      bgcolor: prioStyles.bgcolor,
      color: prioStyles.color,
      '& .dot': {
        width: 8,
        height: 8,
        borderRadius: '50%',
        bgcolor: prioStyles.dotColor,
      },
    };
  },

  actionBtns: {
    display: 'flex',
    gap: 0.8,
  },

  iconActionBtn: (type) => ({
    width: 30,
    height: 30,
    borderRadius: 2,
    border: '1px solid transparent',
    color: '#9ca3af',
    p: 0,
    minWidth: 'auto',
    '&:hover': {
      bgcolor: type === 'edit' ? '#eff6ff' : '#fef2f2',
      color: type === 'edit' ? '#1a71f6' : '#dc2626',
      borderColor: type === 'edit' ? '#bfdbfe' : '#fecaca',
    },
  }),

  // Progreso
  metaProgress: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0.8,
    my: 2,
  },

  progressRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },

  progressLabel: {
    fontSize: '13px',
    color: '#666666',
  },

  progressPct: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '14px',
    fontWeight: 700,
    color: '#161796',
  },

  progressBarContainer: {
    height: 8,
    bgcolor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
  },

  progressBarFill: (estado, progreso) => {
    let color = '#3b82f6';
    if (estado === 'completada') color = '#059669';
    if (estado === 'alerta') color = '#dc2626';

    const widthVal = Math.min(progreso, 100);
    return {
      height: '100%',
      borderRadius: 999,
      width: `${widthVal}%`,
      bgcolor: color,
    };
  },

  venceLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.6,
    fontSize: '12px',
    fontWeight: 500,
    color: '#dc2626',
    mt: 0.5,
  },

  // Footer Card
  cardFoot: {
    display: 'flex',
    alignItems: 'center',
    gap: 2.5,
    fontSize: '12px',
    color: '#666666',
    borderTop: '1px solid #e5e7eb',
    pt: 1.5,
    flexWrap: 'wrap',
  },

  dateItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.8,
  },

  // Estado vacío
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    py: 7,
    px: 3,
    gap: 1,
  },

  emptyStateTitle: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: '16px',
    fontWeight: 600,
    color: '#666666',
    mt: 1,
  },

  emptyStateText: {
    fontSize: '14px',
    color: '#9ca3af',
  },

  // Paginación
  paginationSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1.5,
    mt: 4,
  },

  paginationList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    flexWrap: 'wrap',
    listStyle: 'none',
    p: 0,
    m: 0,
  },

  paginationBtn: (isCurrent) => ({
    minWidth: 40,
    height: 40,
    px: 1.8,
    border: '1px solid #e5e7eb',
    borderRadius: 2,
    bgcolor: isCurrent ? '#161796' : '#ffffff',
    color: isCurrent ? '#ffffff' : '#595959',
    fontWeight: isCurrent ? 600 : 500,
    textTransform: 'none',
    fontSize: '13px',
    '&:hover': {
      bgcolor: isCurrent ? '#161796' : '#f3f4f6',
      color: isCurrent ? '#ffffff' : '#161796',
    },
    '&:disabled': {
      color: '#d1d5db',
      bgcolor: '#ffffff',
    },
  }),

  paginationEllipsis: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 32,
    color: '#9ca3af',
  },

  metasCounter: {
    fontSize: '13px',
    color: '#666666',
  },
};
