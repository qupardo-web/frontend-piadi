import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  FilterAlt as FilterIcon,
  RestartAlt as ResetIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

/**
 * DashboardPersistentFilterSidebar - Componente modular reutilizable para paneles laterales de filtros persistentes en PIADI (Propuesta A).
 * Soporta dos variantes de visualización:
 * 1. 'aside' (por defecto): Panel lateral sticky fijo a la derecha para pantallas de escritorio (md+).
 * 2. 'accordion': Acordeón colapsable para pantallas móviles (xs/sm) posicionado sobre el contenido principal.
 *
 * @param {Object} props
 * @param {string} [props.title='Filtros'] - Título del encabezado del panel de filtros.
 * @param {React.ReactNode} [props.icon] - Icono personalizado del panel.
 * @param {string} [props.iconColor='#1E2875'] - Color temático para el icono.
 * @param {'aside'|'accordion'} [props.variant='aside'] - Modo de renderizado ('aside' para desktop, 'accordion' para móvil).
 * @param {React.ReactNode} props.children - Controles de filtros (sliders, selectores, checkboxes, etc.).
 * @param {Function} [props.onReset] - Función ejecutada al presionar el botón de reiniciar/restablecer filtros.
 * @param {string} [props.resetLabel='Restablecer filtros'] - Texto del botón de reinicio.
 * @param {boolean} [props.hasData=true] - Si es false, muestra el banner de advertencia cuando no hay datos.
 * @param {string} [props.noDataMessage='No hay datos disponibles para los filtros.'] - Mensaje informativo del banner.
 * @param {number|string} [props.width=280] - Ancho del panel en píxeles para modo desktop.
 * @param {boolean} [props.defaultExpanded=true] - Estado de expansión inicial en modo 'accordion'.
 * @param {Object} [props.sx] - Estilos SX adicionales para el contenedor raíz.
 */
export const DashboardPersistentFilterSidebar = ({
  title = 'Filtros',
  icon,
  iconColor = '#1E2875',
  variant = 'aside',
  children,
  onReset,
  resetLabel = 'Restablecer filtros',
  hasData = true,
  noDataMessage = 'No hay datos disponibles para los filtros.',
  width = 280,
  defaultExpanded = true,
  sx,
}) => {
  const filterIconElement = icon || <FilterIcon sx={{ color: iconColor, fontSize: 20 }} />;

  // Renderizado del bloque interno común (Filtros + Alerta Sin Datos + Botón Reset)
  const renderFilterBody = () => (
    <>
      {children}

      {!hasData && (
        <Box
          sx={{
            mx: 0,
            my: 1,
            mt: 'auto',
            p: 2,
            bgcolor: '#FEF3C7',
            borderRadius: 2,
            border: '1px solid #F59E0B',
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

      {onReset && (
        <Box sx={{ pt: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ResetIcon />}
            onClick={onReset}
            sx={{
              borderColor: '#E2E8F0',
              color: '#475569',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '13px',
              py: 1,
              borderRadius: 2,
              fontFamily: "'Inter', sans-serif",
              '&:hover': {
                bgcolor: '#F8FAFC',
                borderColor: '#CBD5E1',
              },
            }}
          >
            {resetLabel}
          </Button>
        </Box>
      )}
    </>
  );

  // Variante: Acordeón para versión Móvil
  if (variant === 'accordion') {
    return (
      <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%', ...sx }}>
        <Accordion
          defaultExpanded={defaultExpanded}
          sx={{
            bgcolor: '#FFFFFF',
            borderRadius: '12px !important',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            '&:before': { display: 'none' },
            overflow: 'hidden',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: iconColor }} />}
            sx={{ px: 2.5, py: 1 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              {filterIconElement}
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#1E2875',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {title}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              px: 2.5,
              pt: 0,
              pb: 2.5,
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            {renderFilterBody()}
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  }

  // Variante: Sidebar Aside persistente para Escritorio (Desktop)
  return (
    <Box
      component="aside"
      sx={{
        width: { xs: '100%', md: width },
        bgcolor: '#FFFFFF',
        borderLeft: '1px solid #E5E7EB',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0,
        zIndex: 90,
        ...sx,
      }}
    >
      {/* Cabecera del Panel */}
      <Box
        sx={{
          p: '24px 20px 12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
        }}
      >
        {filterIconElement}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '18px',
            color: '#1E2875',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {title}
        </Typography>
      </Box>

      <Divider sx={{ my: 2, borderColor: '#E5E7EB' }} />

      {/* Contenido Scrollable de Filtros */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          px: 2.5,
          pb: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 3.5,
        }}
      >
        {renderFilterBody()}
      </Box>
    </Box>
  );
};

export default DashboardPersistentFilterSidebar;
