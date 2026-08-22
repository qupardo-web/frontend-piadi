// =========================================================================
// ARCHIVO DE ESTILOS: MetaForm.styles.js
// =========================================================================

export const styles = {
  mainLayout: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    minHeight: '100vh',
    bgcolor: '#F8F8F8',
    fontFamily: "'Inter', sans-serif",
  },

  // Sidebar
  sidebar: {
    width: 260,
    bgcolor: '#1E2875',
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
    position: 'relative',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      bgcolor: isSelected ? '#1DC2A0' : 'rgba(255, 255, 255, 0.05)',
      color: '#ffffff',
    },
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
    bgcolor: '#1DC2A0',
    fontSize: '0.9rem',
  },

  // Mobile Appbar
  mobileAppBar: {
    display: { xs: 'flex', md: 'none' },
    bgcolor: '#1E2875',
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
    pt: { xs: 11, md: 4 },
    overflowX: 'hidden',
  },

  // Page Header
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    mb: 4,
    mt: 1,
    width: '100%',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  headerIconText: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  },

  headerIcon: {
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

  modoSwitch: {
    display: 'inline-flex',
    bgcolor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    p: '3px',
    flexShrink: 0,
  },

  modoSwitchBtn: (isActive) => ({
    border: 'none',
    bgcolor: isActive ? '#0F4AFF' : 'transparent',
    borderRadius: '6px',
    py: 0.8,
    px: 2,
    fontFamily: "'Inter', sans-serif",
    fontSize: '12.5px',
    fontWeight: 500,
    color: isActive ? '#ffffff' : '#666666',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textTransform: 'none',
    '&:hover': {
      bgcolor: isActive ? '#0c3bc6' : 'rgba(0,0,0,0.04)',
    },
  }),

  // Forms and Sections
  formCard: {
    maxWidth: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },

  saveAlert: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.5,
    bgcolor: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    borderRadius: '10px',
    p: 2,
    fontSize: '14px',
    fontWeight: 500,
  },

  formSection: {
    bgcolor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 3,
    p: 3,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },

  sectionTitle: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '16px',
    fontWeight: 700,
    color: '#111827',
    mb: 2.5,
  },

  grid2: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    gap: 2.5,
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },

  fieldLabel: {
    fontSize: '13px',
    color: '#475569',
    fontWeight: 600,
  },

  required: {
    color: '#dc2626',
  },

  input: (isInvalid) => ({
    width: '100%',
    padding: '10px 12px',
    paddingRight: '34px',
    border: '1px solid',
    borderColor: isInvalid ? '#dc2626' : '#d1d5db',
    borderRadius: 2,
    fontSize: '14px',
    color: '#111827',
    bgcolor: '#ffffff',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.15s ease',
    '&:focus': {
      borderColor: isInvalid ? '#dc2626' : '#0F4AFF',
      boxShadow: isInvalid ? '0 0 0 2px rgba(220, 38, 38, 0.2)' : '0 0 0 2px rgba(15, 74, 255, 0.25)',
    },
    // Ocultar las flechas (spinners) por defecto de los navegadores para inputs numéricos
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      WebkitAppearance: 'none',
      margin: 0,
    },
    '&[type=number]': {
      MozAppearance: 'textfield',
    },
  }),

  select: (isInvalid) => ({
    width: '100%',
    padding: '10px 12px',
    border: '1px solid',
    borderColor: isInvalid ? '#dc2626' : '#d1d5db',
    borderRadius: 2,
    fontSize: '14px',
    color: '#111827',
    bgcolor: '#ffffff',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.15s ease',
    '&:focus': {
      borderColor: isInvalid ? '#dc2626' : '#0F4AFF',
      boxShadow: isInvalid ? '0 0 0 2px rgba(220, 38, 38, 0.2)' : '0 0 0 2px rgba(15, 74, 255, 0.25)',
    },
  }),

  fieldError: {
    fontSize: '12px',
    color: '#dc2626',
    mt: 0.5,
  },

  // Segmented Prioridad Options
  prioridadSegmented: {
    display: 'flex',
    gap: 1.5,
    flexWrap: 'wrap',
  },

  prioridadChip: (type, isActive) => {
    let activeBorder = '#d1d5db';
    let activeBg = '#ffffff';
    let activeColor = '#475569';
    let dotColor = '#9ca3af';

    if (type === 'alta') {
      dotColor = '#ef4444';
      if (isActive) {
        activeBorder = '#ef4444';
        activeColor = '#b91c1c';
        activeBg = '#fef2f2';
      }
    } else if (type === 'media') {
      dotColor = '#f59e0b';
      if (isActive) {
        activeBorder = '#f59e0b';
        activeColor = '#b45309';
        activeBg = '#fffbeb';
      }
    } else if (type === 'baja') {
      dotColor = '#22c55e';
      if (isActive) {
        activeBorder = '#22c55e';
        activeColor = '#15803d';
        activeBg = '#f0fdf4';
      }
    }

    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 1,
      py: 1,
      px: 2.5,
      borderRadius: 2,
      border: '1.5px solid',
      borderColor: activeBorder,
      bgcolor: activeBg,
      fontFamily: "'Inter', sans-serif",
      fontSize: '13px',
      fontWeight: 500,
      color: activeColor,
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      textTransform: 'none',
      '& .dot': {
        width: 10,
        height: 10,
        borderRadius: '50%',
        bgcolor: dotColor,
      },
    };
  },

  // Metrics Section Header
  metricasHead: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 2,
    flexWrap: 'wrap',
    mb: 2.5,
  },

  aporteBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    minWidth: 260,
  },

  aporteBarWrap: {
    flex: 1,
    minWidth: 160,
  },

  aporteBar: {
    height: 8,
    bgcolor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
  },

  aporteBarFill: (pct) => ({
    height: '100%',
    width: `${pct}%`,
    bgcolor: pct > 100 ? '#dc2626' : pct === 100 ? '#22c55e' : '#0F4AFF',
    borderRadius: 999,
    transition: 'all 0.25s ease',
  }),

  aporteText: {
    fontSize: '12.5px',
    color: '#475569',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },

  btnAnadirMetrica: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    bgcolor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: 2,
    color: '#0F4AFF',
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    fontWeight: 600,
    px: 2,
    py: 1,
    cursor: 'pointer',
    textTransform: 'none',
    transition: 'all 0.15s ease',
    '&:hover': {
      bgcolor: '#eff6ff',
      borderColor: '#0F4AFF',
    },
    '&:disabled': {
      opacity: 0.45,
      cursor: 'not-allowed',
      bgcolor: '#ffffff',
      borderColor: '#d1d5db',
    },
  },

  metricasWarn: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    bgcolor: '#fffbeb',
    border: '1px solid #fde68a',
    color: '#b45309',
    borderRadius: 2,
    p: 1.5,
    fontSize: '13px',
    fontWeight: 500,
    mb: 2,
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    border: '1.5px dashed #d1d5db',
    borderRadius: 3,
    p: 4,
    color: '#9ca3af',
    textAlign: 'center',
  },

  // Table
  tableContainer: {
    border: '1px solid #e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
  },

  th: {
    fontWeight: 600,
    fontSize: '11px',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    bgcolor: '#f9fafb',
    py: 1.5,
    px: 2,
    textAlign: 'left',
  },

  td: {
    fontSize: '13px',
    color: '#111827',
    py: 1.5,
    px: 2,
  },

  badge: (type) => {
    let bg = '#dbeafe';
    let color = '#1d4ed8';
    if (type === 'sup' || type === 'ok') {
      bg = '#dcfce7';
      color = '#15803d';
    } else if (type === 'nosup' || type === 'excede') {
      bg = '#fee2e2';
      color = '#b91c1c';
    } else if (type === 'incompleta') {
      bg = '#e0f2fe';
      color = '#0369a1';
    }
    return {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '999px',
      px: 1.5,
      py: 0.3,
      fontSize: '11.5px',
      fontWeight: 600,
      bgcolor: bg,
      color: color,
    };
  },

  actionBtns: {
    display: 'flex',
    gap: 1,
    justifyContent: 'flex-end',
  },

  // Form actions row
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 2,
    mt: 2,
    flexWrap: 'wrap',
  },

  btnCancelar: {
    display: 'inline-flex',
    alignItems: 'center',
    bgcolor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: 2.5,
    color: '#475569',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    px: 2.5,
    py: 1.2,
    textTransform: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover': {
      bgcolor: '#f9fafb',
      color: '#1E2875',
    },
  },

  btnPreview: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    bgcolor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: 2.5,
    color: '#475569',
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: 500,
    px: 2.5,
    py: 1.2,
    textTransform: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    '&:hover': {
      bgcolor: '#f9fafb',
      color: '#1E2875',
    },
  },

  btnGuardar: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1,
    bgcolor: '#0F4AFF',
    color: '#ffffff',
    borderRadius: 2.5,
    fontFamily: "'Inter', sans-serif",
    fontSize: '14px',
    fontWeight: 600,
    px: 3,
    py: 1.2,
    textTransform: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(15, 74, 255, 0.2)',
    transition: 'all 0.15s ease',
    '&:hover': {
      bgcolor: '#0c3bc6',
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  },

  // Modal Autocomplete
  combobox: {
    position: 'relative',
  },

  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    border: '1px solid #d1d5db',
    borderRadius: 2,
    px: 1.5,
    height: 42,
    bgcolor: '#ffffff',
    transition: 'all 0.15s ease',
    '&:focus-within': {
      borderColor: '#0F4AFF',
      boxShadow: '0 0 0 2px rgba(15, 74, 255, 0.25)',
    },
  },

  dropdownList: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 'calc(100% + 6px)',
    bgcolor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 2,
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    maxHeight: 240,
    overflowY: 'auto',
    zIndex: 20,
  },

  dropdownItem: (isSelected) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    p: 1.5,
    cursor: 'pointer',
    fontSize: '13.5px',
    color: '#111827',
    bgcolor: isSelected ? '#eff6ff' : 'transparent',
    fontWeight: isSelected ? 600 : 400,
    '&:hover': {
      bgcolor: '#eff6ff',
    },
  }),

  dropdownCount: {
    p: 1.5,
    fontSize: '11.5px',
    color: '#9ca3af',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    bgcolor: '#ffffff',
  },

  // Modal fields
  inputWithIcon: {
    position: 'relative',
    width: '100%',
  },

  inputSuffix: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    fontSize: '14px',
    pointerEvents: 'none',
  },

  compToggle: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
    gap: 2,
  },

  compBtn: (isActive, type) => {
    let activeBorder = '#d1d5db';
    let activeBg = '#ffffff';
    let activeColor = '#475569';
    if (isActive) {
      if (type === 'debe-superar' || type === true) {
        activeBorder = '#22c55e';
        activeBg = '#f0fdf4';
        activeColor = '#15803d';
      } else if (type === 'no-debe-superar' || type === false) {
        activeBorder = '#ef4444';
        activeBg = '#fef2f2';
        activeColor = '#b91c1c';
      } else if (type === 'debe-mantenerse-en-rango') {
        activeBorder = '#3b82f6';
        activeBg = '#eff6ff';
        activeColor = '#1d4ed8';
      }
    }
    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1,
      p: 1.5,
      borderRadius: 2,
      border: '2px solid',
      borderColor: activeBorder,
      bgcolor: activeBg,
      color: activeColor,
      fontFamily: "'Inter', sans-serif",
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      textTransform: 'none',
    };
  },

  valorTipo: {
    display: 'inline-flex',
    bgcolor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    p: '2px',
  },

  valorTipoBtn: (isActive) => ({
    border: 'none',
    bgcolor: isActive ? '#1E2875' : 'transparent',
    borderRadius: '6px',
    py: 0.6,
    px: 1.8,
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    fontWeight: 500,
    color: isActive ? '#ffffff' : '#666666',
    cursor: 'pointer',
    textTransform: 'none',
  }),

  // Summary
  prevSummary: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },

  prevGrid: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
    gap: 2,
  },

  prevLabel: {
    fontSize: '11px',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#9ca3af',
    fontWeight: 600,
  },

  prevVal: {
    fontSize: '14px',
    color: '#111827',
    fontWeight: 600,
    mt: 0.2,
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
};
