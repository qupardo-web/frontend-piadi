import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Drawer,
  Divider,
} from '@mui/material';
import {
  FilterAlt as FilterIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';

/**
 * DashboardFilterSidebar - Componente modular reutilizable para paneles laterales de filtros colapsables en PIADI.
 * Soporta modo Desktop (aside fijo sticky con colapso animado) y modo Móvil (Drawer temporal derecho).
 *
 * @param {Object} props
 * @param {string} [props.title='Filtros'] - Título del encabezado del panel de filtros.
 * @param {React.ReactNode} [props.icon] - Icono representativo del panel (por defecto FilterAlt).
 * @param {string} [props.iconColor='#E27800'] - Color temático del departamento para el icono y bordes hover.
 * @param {boolean} [props.collapsed=false] - Estado de colapso en versión escritorio.
 * @param {Function} props.onToggleCollapse - Función para alternar el estado de colapso en escritorio.
 * @param {boolean} [props.mobileOpen=false] - Estado de apertura del Drawer en versión móvil.
 * @param {Function} props.onCloseMobile - Función para cerrar el Drawer en versión móvil.
 * @param {React.ReactNode} props.children - Elementos de control de filtros (sliders, acordeones, chips, switches).
 * @param {Function} [props.onReset] - Función ejecutada al presionar el botón de reiniciar/restablecer filtros.
 * @param {string} [props.resetLabel='Restablecer filtros'] - Texto del botón de reinicio.
 * @param {boolean} [props.hasData=true] - Si es false, muestra el banner informativo de sin datos para los filtros.
 * @param {string} [props.noDataMessage='No hay datos disponibles para los filtros.'] - Mensaje del banner cuando hasData es false.
 * @param {number|string} [props.width=290] - Ancho del panel expandido en px.
 * @param {Object} [props.sx] - Estilos SX adicionales para el contenedor Desktop.
 */
export const DashboardFilterSidebar = ({
  title = 'Filtros',
  icon,
  iconColor = '#E27800',
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile,
  children,
  onReset,
  resetLabel = 'Restablecer filtros',
  hasData = true,
  noDataMessage = 'No hay datos disponibles para los filtros.',
  width = 290,
  sx,
}) => {
  const filterIconElement = icon || <FilterIcon sx={{ color: iconColor, fontSize: 18 }} />;

  // Renderizado del contenido interno compartido (scroll + footer reset)
  const renderInnerContent = (isMobile = false) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0, bgcolor: '#FFFFFF' }}>
      {/* Encabezado en Móvil */}
      {isMobile && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: '16px 20px',
              bgcolor: '#F8FAFC',
              height: '56px',
              boxSizing: 'border-box',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {filterIconElement}
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  color: '#1E2875',
                  fontSize: '15px',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {title}
              </Typography>
            </Box>
            <IconButton
              onClick={onCloseMobile}
              size="small"
              sx={{
                ml: 'auto',
                color: '#1E2875',
                bgcolor: 'rgba(30, 40, 117, 0.05)',
                '&:hover': { bgcolor: 'rgba(30, 40, 117, 0.1)' },
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
          <Divider />
        </>
      )}

      {/* Contenido Scrollable de Filtros */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: isMobile ? '16px 20px' : '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'rgba(0,0,0,0.1)',
            borderRadius: '4px',
          },
        }}
      >
        {children}

        {/* Mensaje de Sin Datos / Empty State si aplica (ubicado abajo) */}
        {!hasData && (
          <Box
            sx={{
              p: 2,
              bgcolor: '#FEF3C7',
              borderRadius: '8px',
              border: '1px solid #F59E0B',
              mt: 'auto',
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: '13px',
                color: '#92400E',
                textAlign: 'center',
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {noDataMessage}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Botón de Restablecer Filtros (Footer) */}
      {onReset && (
        <Box
          sx={{
            p: '16px 18px',
            borderTop: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            flexShrink: 0,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<ResetIcon sx={{ fontSize: 18 }} />}
            onClick={onReset}
            sx={{
              borderColor: '#E2E8F0',
              color: '#475569',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13px',
              py: 1,
              borderRadius: '8px',
              fontFamily: "'Inter', sans-serif",
              '&:hover': {
                bgcolor: '#F8FAFC',
                borderColor: '#CBD5E1',
                color: '#1E2875',
              },
            }}
          >
            {resetLabel}
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* 1. VERSIÓN DESKTOP */}
      {collapsed ? (
        /* Estado Colapsado: Botón horizontal flotante elegante */
        <Box
          component="button"
          type="button"
          onClick={onToggleCollapse}
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            alignItems: 'center',
            gap: 1.2,
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            px: 2,
            py: 1.1,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            position: 'sticky',
            top: 24,
            mr: { xs: 0, md: 3 },
            mt: { xs: 0, md: 3 },
            alignSelf: 'flex-start',
            flexShrink: 0,
            userSelect: 'none',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 10,
            '&:hover': {
              bgcolor: '#F8FAFC',
              borderColor: iconColor,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transform: 'translateY(-1px)',
              '& .reopen-arrow': {
                transform: 'rotate(180deg) translateX(2px)',
                color: '#1E2875',
              },
            },
            ...sx,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor,
            }}
          >
            {filterIconElement}
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '13.5px',
              color: '#1E2875',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {title}
          </Typography>
          <ChevronRightIcon
            className="reopen-arrow"
            sx={{
              fontSize: 18,
              color: '#64748B',
              transform: 'rotate(180deg)',
              transition: 'transform 0.2s ease, color 0.2s ease',
            }}
          />
        </Box>
      ) : (
        /* Estado Expandido: Panel lateral Sticky */
        <Box
          component="aside"
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            width: width,
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            position: 'sticky',
            top: 24,
            mr: { xs: 0, md: 3 },
            mt: { xs: 0, md: 3 },
            height: 'calc(100vh - 48px)',
            flexShrink: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            zIndex: 10,
            ...sx,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: width }}>
            {/* Cabecera Desktop */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: '16px 18px',
                bgcolor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                height: '56px',
                boxSizing: 'border-box',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                {filterIconElement}
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    color: '#1E2875',
                    fontSize: '15px',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {title}
                </Typography>
              </Box>

              <IconButton
                onClick={onToggleCollapse}
                size="small"
                title="Colapsar filtros"
                sx={{
                  color: '#64748B',
                  bgcolor: 'transparent',
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(30, 40, 117, 0.08)',
                    color: '#1E2875',
                  },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>

            {/* Contenido Desktop */}
            {renderInnerContent(false)}
          </Box>
        </Box>
      )}

      {/* 2. VERSIÓN MÓVIL (DRAWER TEMPORAL DERECHO) */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={onCloseMobile}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: { xs: '88vw', sm: 340 },
            boxSizing: 'border-box',
            borderTopLeftRadius: 16,
            borderBottomLeftRadius: 16,
            boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
          },
        }}
      >
        {renderInnerContent(true)}
      </Drawer>
    </>
  );
};

export default DashboardFilterSidebar;
