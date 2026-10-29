// =========================================================================
// ARCHIVO DE ESTILOS: DashboardDesarrolloCurricular.styles.js
// =========================================================================

export const styles = {
  // Contenedor principal con soporte para Sidebar fijo y scroll natural
  mainLayout: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    minHeight: '100vh',
    bgcolor: '#F8F8F8',
    fontFamily: "'Inter', sans-serif",
  },

  // Área de contenido a la derecha del Sidebar
  contentArea: {
    flexGrow: 1,
    p: { xs: 3, md: 4 },
    pt: { xs: 11, md: 4 }, // Compensación para AppBar móvil de 50px
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    minWidth: 0,
  },

  // Fila superior de 3 Tarjetas KPI en Grid CSS
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
    gap: 2.5,
    width: '100%',
  },

  // Estilos de Sección de Gráfico
  chartSubtitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 1.5,
  },

  chartSubtitle: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#475569',
    fontFamily: "'Inter', sans-serif",
  },

  detailButton: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#1E2875',
    textTransform: 'none',
    py: 0.25,
    px: 1,
    borderRadius: '6px',
    fontFamily: "'Inter', sans-serif",
    '&:hover': {
      bgcolor: 'rgba(30, 40, 117, 0.08)',
    },
  },

  // Contenedor de mini-tabla de prácticas
  miniTableWrap: {
    width: '100%',
    mt: 2,
    borderTop: '1px solid #E2E8F0',
    pt: 1.5,
  },

  miniTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12.5px',
    fontFamily: "'Inter', sans-serif",
    '& th': {
      textAlign: 'left',
      p: '6px 10px',
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: '#64748B',
      borderBottom: '1px solid #E2E8F0',
    },
    '& td': {
      p: '6px 10px',
      borderBottom: '1px solid #E2E8F0',
      color: '#1E293B',
      fontVariantNumeric: 'tabular-nums',
    },
    '& td:last-child': {
      textAlign: 'right',
      fontWeight: 500,
    },
    '& tr:last-child td': {
      borderBottom: 'none',
    },
  },

  legendRow: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 1.5,
    mb: 2,
    fontFamily: "'Inter', sans-serif",
  },

  legendItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1.2,
    fontSize: '13px',
    color: '#475569',
  },

  legendBadge: (color = '#DC2626', bg = '#FEF2F2', border = '#FECACA') => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1.2,
    px: 1.75,
    py: 0.75,
    borderRadius: '8px',
    bgcolor: bg,
    border: `1px solid ${border}`,
    fontSize: '13px',
    fontWeight: 500,
    color: '#1E293B',
    lineHeight: 1.2,
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  }),

  legendDot: (color) => ({
    width: 10,
    height: 10,
    borderRadius: '2px',
    bgcolor: color,
  }),

  legendDashedLine: (color) => ({
    width: 24,
    height: 0,
    borderTop: `2.5px dashed ${color}`,
    display: 'inline-block',
    flexShrink: 0,
  }),

  // Slider de Años en Filtros
  yearSliderStyle: {
    color: '#3EC9FF',
    '& .MuiSlider-thumb': {
      bgcolor: '#FFFFFF',
      border: '2px solid #3EC9FF',
      width: 16,
      height: 16,
      '&:hover, &.Mui-focusVisible': {
        boxShadow: '0 0 0 6px rgba(62, 201, 255, 0.16)',
      },
    },
    '& .MuiSlider-track': {
      bgcolor: '#3EC9FF',
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
  },

  // Filtros Acordeón (compactos y sin saltos excesivos de margen)
  filterAccordion: {
    border: 'none',
    boxShadow: 'none',
    bgcolor: 'transparent !important',
    m: '0 !important',
    mb: '4px !important',
    '&:before': { display: 'none' },
    '&.Mui-expanded': {
      m: '0 !important',
      mb: '6px !important',
    },
  },

  filterAccordionSummary: {
    p: 0,
    px: 0,
    minHeight: '34px !important',
    m: '0 !important',
    '& .MuiAccordionSummary-content': {
      my: '4px !important',
      m: '0 !important',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
    '&.Mui-expanded': {
      minHeight: '34px !important',
      m: '0 !important',
    },
    '& .MuiAccordionSummary-content.Mui-expanded': {
      m: '0 !important',
      my: '4px !important',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: '#64748B',
      p: 0,
    },
  },

  filterAccordionTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#475569',
    fontFamily: "'Inter', sans-serif",
    letterSpacing: '0.04em',
  },

  filterChipsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    pt: 0.5,
    pb: 0.75,
  },

  filterChip: (isSelected) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.5,
    px: '10px',
    py: '3px',
    fontSize: '11px',
    fontWeight: isSelected ? 600 : 500,
    color: isSelected ? '#FFFFFF' : '#475569',
    bgcolor: isSelected ? '#175696' : '#F1F5F9',
    border: `1px solid ${isSelected ? '#175696' : '#CBD5E1'}`,
    borderRadius: '14px',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'all 120ms ease-out',
    '&:hover': {
      bgcolor: isSelected ? '#124477' : '#E2E8F0',
      borderColor: isSelected ? '#124477' : '#94A3B8',
      color: isSelected ? '#FFFFFF' : '#1E293B',
    },
  }),

  // Drawer modal lateral de Detalle del indicador (PIADI-306)
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
    gap: 2.5,
  },

  drawerDescLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#64748B',
    mb: 0.5,
  },

  drawerDesc: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    color: '#334155',
    lineHeight: 1.5,
  },

  drawerMetricBox: {
    bgcolor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 0.5,
  },

  drawerMetricLabel: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#64748B',
  },

  drawerMetricValue: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '24px',
    fontWeight: 700,
    color: '#1E2875',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
    wordBreak: 'break-word',
  },

  drawerMetaBadge: (status) => {
    const isPos = status === true || status === 'positive';
    const isNeg = status === false || status === 'negative';
    let bgcolor = '#F1F5F9';
    let color = '#64748B';
    if (isPos) {
      bgcolor = '#ECFDF5';
      color = '#059669';
    } else if (isNeg) {
      bgcolor = '#FEF2F2';
      color = '#DC2626';
    }
    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.5,
      px: 1,
      py: 0.25,
      borderRadius: '6px',
      bgcolor,
      color,
      border: `1px solid ${isPos ? '#A7F3D0' : isNeg ? '#FECACA' : '#E2E8F0'}`,
    };
  },

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

  emptyChartBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    color: '#64748b',
    fontSize: '13px',
    fontWeight: 500,
    border: '1px dashed #E2E8F0',
    borderRadius: '12px',
    bgcolor: '#F8FAFC',
    width: '100%',
  },
};
