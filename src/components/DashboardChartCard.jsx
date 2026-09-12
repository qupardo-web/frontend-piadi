import React from 'react';
import { Box, Typography } from '@mui/material';

/**
 * DashboardChartCard - Componente modular reutilizable para tarjetas de gráficos y pictogramas en cuadrícula (diseño Educación Continua).
 *
 * @param {Object} props
 * @param {string} [props.id] - ID opcional del contenedor.
 * @param {string|React.ReactNode} props.title - Título del gráfico.
 * @param {React.ReactNode} [props.icon] - Icono temático del encabezado.
 * @param {string} [props.iconColor='#1E2875'] - Color del icono del encabezado.
 * @param {React.ReactNode} [props.actions] - Elementos de control en el encabezado (ej. botones de toggle).
 * @param {React.ReactNode} [props.headerContent] - Contenido adicional del encabezado debajo del título.
 * @param {boolean} [props.fullWidth=false] - Si es true, ocupa el ancho completo de la cuadrícula (gridColumn: '1 / -1').
 * @param {string|number} [props.minHeight='380px'] - Altura mínima de la tarjeta.
 * @param {string|number} [props.height='auto'] - Altura de la tarjeta.
 * @param {boolean} [props.hasData=true] - Estado de datos. Si es false, muestra mensaje de sin datos.
 * @param {string} [props.noDataMessage='Sin datos disponibles'] - Mensaje para estado sin datos.
 * @param {React.ReactNode} props.children - Componente del gráfico o contenido interior.
 * @param {Object} [props.cardStyle] - Estilos CSS en línea adicionales para la tarjeta.
 * @param {Object} [props.wrapperStyle] - Estilos CSS en línea adicionales para el wrapper interior del gráfico.
 * @param {Object} [props.sx] - Estilos SX adicionales para Material UI.
 */
export const DashboardChartCard = ({
  id,
  title,
  icon,
  iconColor = '#1E2875',
  actions,
  headerContent,
  fullWidth = false,
  minHeight = '380px',
  height = 'auto',
  hasData = true,
  noDataMessage = 'Sin datos disponibles',
  children,
  cardStyle,
  wrapperStyle,
  sx,
}) => {
  return (
    <Box
      id={id}
      className="chart-card"
      sx={{
        bgcolor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        p: { xs: '16px 14px', sm: '20px' },
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: minHeight,
        height: height,
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        transition: 'transform 0.15s, box-shadow 0.15s',
        gridColumn: fullWidth ? '1 / -1' : undefined,
        '&:hover': {
          boxShadow: '0 4px 12px rgba(30, 40, 117, 0.05)',
        },
        ...sx,
      }}
      style={cardStyle}
    >
      {/* Encabezado */}
      {(title || icon || actions || headerContent) && (
        <Box
          className="chart-header"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            flexWrap: 'wrap',
            gap: '10px',
            width: '100%',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {icon && (
                <Box component="span" sx={{ color: iconColor, display: 'inline-flex', alignItems: 'center' }}>
                  {icon}
                </Box>
              )}
              {title && (
                <Typography
                  component="h2"
                  className="chart-title"
                  sx={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#1E2875',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {title}
                </Typography>
              )}
            </Box>
            {headerContent}
          </Box>

          {actions && (
            <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              {actions}
            </Box>
          )}
        </Box>
      )}

      {/* Contenedor del Gráfico */}
      <Box
        className="chart-wrapper"
        sx={{
          flexGrow: 1,
          position: 'relative',
          minHeight: '280px',
          width: '100%',
          minWidth: 0,
          maxWidth: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '& .MuiResponsiveChart-container': {
            width: '100% !important',
            maxWidth: '100% !important',
          },
        }}
        style={wrapperStyle}
      >
        {!hasData ? (
          <Box
            sx={{
              color: '#64748b',
              fontSize: '13px',
              p: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
            }}
          >
            {noDataMessage}
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
};

export default DashboardChartCard;
