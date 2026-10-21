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
    width: { xs: '100%', md: 'calc(100% - 260px)' },
  },

  // Fila superior de 3 Tarjetas KPI en Grid CSS
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
    gap: 2.5,
    width: '100%',
  },

  // Contenedor de Gráficos y Panel de Filtros en horizontal
  dashboardContentLayout: {
    display: 'flex',
    gap: 3,
    alignItems: 'flex-start',
    width: '100%',
  },

  chartsColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2.5,
    minWidth: 0,
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
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.6,
    background: 'none',
    border: 'none',
    p: '4px 8px',
    borderRadius: '6px',
    color: '#1a71f6',
    fontFamily: "'Inter', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'color 150ms ease-out, background-color 150ms ease-out',
    '&:hover': {
      color: '#1560d3',
      bgcolor: 'rgba(26, 113, 246, 0.08)',
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
    gap: 2,
    fontSize: '11px',
    color: '#64748B',
    mb: 1.5,
    fontFamily: "'Inter', sans-serif",
  },

  legendItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.8,
  },

  legendDot: (color) => ({
    width: 10,
    height: 10,
    borderRadius: '2px',
    bgcolor: color,
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

  // Filtros Acordeón
  filterAccordion: {
    border: 'none',
    boxShadow: 'none',
    '&:before': { display: 'none' },
    bgcolor: 'transparent',
    mb: 0.5,
  },

  filterAccordionSummary: {
    px: 0,
    minHeight: 38,
    '& .MuiAccordionSummary-content': {
      my: 0.8,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
  },

  filterAccordionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1E293B',
    fontFamily: "'Inter', sans-serif",
  },

  filterChipsWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.8,
    pb: 1.2,
  },

  filterChip: (isSelected) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.6,
    px: 1.2,
    py: 0.4,
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

  // Drawer de Detalle (PIADI-306)
  drawerPaper: {
    width: { xs: '100vw', sm: 390 },
    maxWidth: '100vw',
    bgcolor: '#FFFFFF',
    borderLeft: '1px solid #E2E8F0',
    boxShadow: '-12px 0 28px rgba(0,0,0,0.18)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    zIndex: 1400,
  },

  drawerHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    p: '18px 24px 14px',
    borderBottom: '1px solid #E2E8F0',
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
    gap: 2.2,
  },

  drawerDescLabel: {
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#94A3B8',
    mb: 0.6,
  },

  drawerDesc: {
    fontSize: '13px',
    lineHeight: 1.6,
    color: '#334155',
  },

  drawerMetricBox: {
    bgcolor: '#F8FAFC',
    borderRadius: '10px',
    p: '16px',
    border: '1px solid #E2E8F0',
  },

  drawerMetricLabel: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#64748B',
    display: 'block',
    mb: 0.5,
  },

  drawerMetricValue: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '24px',
    fontWeight: 700,
    color: '#1E2875',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
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
      mt: 1,
      px: 1.2,
      py: 0.4,
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 600,
      bgcolor,
      color,
    };
  },

  drawerTableWrap: {
    maxHeight: '230px',
    overflowY: 'auto',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    mt: 0.5,
  },

  drawerFooter: {
    p: '14px 24px',
    borderTop: '1px solid #E2E8F0',
    flexShrink: 0,
    fontSize: '12px',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 1,
    bgcolor: '#FFFFFF',
  },

  // Botón flotante de ayuda institucional
  floatingHelpButton: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    bgcolor: '#1E2875',
    color: '#ffffff',
    width: 48,
    height: 48,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    '&:hover': {
      bgcolor: '#161796',
    },
  },
};
