import React from 'react';
import { Box, Typography } from '@mui/material';
import { ChevronDown } from 'lucide-react';

/**
 * DashboardMiniSection - Componente modular independiente para gráficos pequeños o en cuadrícula (2 columnas).
 * Sigue la misma identidad visual que DashboardSection:
 * - Cabecera sombreada suave (#F8FAFC) con borde inferior (#E2E8F0)
 * - Título en azul institucional (#1E2875) con icono temático
 * - Botones de acción independientes (ej. 'Ver detalles')
 * - Flecha animada de colapso/despliegue
 * - Placeholder estándar cuando no hay datos
 *
 * @param {Object} props
 * @param {string} [props.id] - ID opcional del contenedor.
 * @param {string|React.ReactNode} props.title - Título del gráfico.
 * @param {string|React.ReactNode} [props.subtitle] - Subtítulo descriptivo opcional.
 * @param {React.ReactNode} [props.icon] - Icono representativo del encabezado.
 * @param {string} [props.iconColor='#1E2875'] - Color de acento del icono.
 * @param {boolean} [props.isOpen=true] - Estado de apertura/colapso de la tarjeta.
 * @param {Function} [props.onToggle] - Función al hacer clic en la cabecera para abrir/cerrar.
 * @param {React.ReactNode} [props.actions] - Elementos o botones de acción en la cabecera (ej. 'Ver detalles').
 * @param {React.ReactNode} [props.headerContent] - Contenido secundario en el encabezado.
 * @param {boolean} [props.hasData=true] - Estado de datos. Si es false, muestra el placeholder estándar.
 * @param {number|string} [props.noDataHeight=220] - Altura del placeholder sin datos.
 * @param {string} [props.noDataMessage='Sin datos disponibles'] - Mensaje para estado sin datos.
 * @param {string|number} [props.minHeight] - Altura mínima del contenedor.
 * @param {string|number} [props.height='100%'] - Altura del contenedor.
 * @param {React.ReactNode} props.children - Componente del gráfico o contenido interior.
 * @param {Object} [props.wrapperStyle] - Estilos CSS inline adicionales para el cuerpo interior.
 * @param {Object} [props.sx] - Estilos SX adicionales para Material UI en la raíz.
 * @param {Object} [props.headerSx] - Estilos SX adicionales para la cabecera.
 * @param {Object} [props.bodySx] - Estilos SX adicionales para el cuerpo interior.
 */
export const DashboardMiniSection = ({
  id,
  title,
  subtitle,
  icon,
  iconColor = '#1E2875',
  isOpen = true,
  onToggle,
  actions,
  headerContent,
  hasData = true,
  noDataHeight = 220,
  noDataMessage = 'Sin datos disponibles',
  minHeight,
  height = '100%',
  children,
  wrapperStyle,
  sx,
  headerSx,
  bodySx,
}) => {
  return (
    <Box
      id={id}
      sx={{
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: isOpen ? minHeight : 'auto',
        height: isOpen ? (height || '100%') : 'auto',
        alignSelf: isOpen ? 'stretch' : 'start',
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          borderColor: '#CBD5E1',
        },
        ...sx,
      }}
    >
      {/* Cabecera Colapsable */}
      {(title || icon || actions || headerContent) && (
        <Box
          onClick={onToggle}
          sx={{
            bgcolor: '#F8FAFC',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: onToggle ? 'pointer' : 'default',
            p: '14px 18px',
            userSelect: 'none',
            transition: 'background-color 0.2s ease',
            borderBottom: isOpen ? '1px solid #E2E8F0' : 'none',
            '&:hover': {
              bgcolor: onToggle ? '#F1F5F9' : '#F8FAFC',
            },
            ...headerSx,
          }}
        >
          {/* Título e Icono */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
            {icon && (
              <Box
                sx={{
                  color: iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  '& svg': {
                    fontSize: '18px',
                    width: 18,
                    height: 18,
                  },
                }}
              >
                {icon}
              </Box>
            )}
            {title && (
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#1E2875',
                  lineHeight: 1.2,
                  m: 0,
                }}
              >
                {title}
              </Typography>
            )}
          </Box>

          {/* Acciones y Chevron */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {hasData && actions && (
              <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', alignItems: 'center' }}>
                {actions}
              </Box>
            )}
            {onToggle && (
              <Box
                sx={{
                  color: '#1E2875',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <ChevronDown size={16} />
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Contenido Secundario en Cabecera */}
      {isOpen && headerContent && (
        <Box sx={{ px: '18px', pt: '10px', pb: '4px', bgcolor: '#FFFFFF' }}>
          {headerContent}
        </Box>
      )}

      {/* Cuerpo del Gráfico / Pictograma */}
      {isOpen && (
        <Box
          sx={{
            flexGrow: 1,
            position: 'relative',
            minHeight: '260px',
            width: '100%',
            minWidth: 0,
            maxWidth: '100%',
            boxSizing: 'border-box',
            p: { xs: 1.5, sm: 2 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'stretch',
            '& .MuiResponsiveChart-container': {
              width: '100% !important',
              maxWidth: '100% !important',
            },
            '& svg': {
              width: '100%',
            },
            ...bodySx,
          }}
          style={hasData ? wrapperStyle : undefined}
        >
          {subtitle && (
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1E2875',
                mb: 1.5,
                width: '100%',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {subtitle}
            </Typography>
          )}

          {!hasData ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: noDataHeight,
                height: '100%',
                flexGrow: 1,
                color: '#64748b',
                fontSize: '13px',
                fontWeight: 500,
                border: '1px dashed #E2E8F0',
                borderRadius: '12px',
                bgcolor: '#F8FAFC',
                width: '100%',
                boxSizing: 'border-box',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {noDataMessage}
            </Box>
          ) : (
            children
          )}
        </Box>
      )}
    </Box>
  );
};

export default DashboardMiniSection;
