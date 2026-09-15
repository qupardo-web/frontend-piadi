import React from 'react';
import { Box, Typography } from '@mui/material';
import { ChevronDown } from 'lucide-react';

/**
 * DashboardSection - Componente reutilizable para secciones colapsables de dashboards en PIADI.
 * Basado en el estándar visual de cabeceras sombreadas (#F8FAFC), bordes suaves (#E2E8F0),
 * títulos en azul institucional (#1E2875), icono de acento temático y flecha de colapso animada.
 *
 * @param {Object} props
 * @param {string|React.ReactNode} props.title - Título principal de la sección.
 * @param {string|React.ReactNode} [props.subtitle] - Subtítulo descriptivo interno (ej: 'Distribución por año').
 * @param {React.ReactNode} [props.icon] - Icono representativo de la sección.
 * @param {string} [props.iconColor='#1E2875'] - Color de acento del icono.
 * @param {boolean} [props.isOpen=true] - Estado de apertura/colapso de la sección.
 * @param {Function} props.onToggle - Manejador de evento al hacer clic en la cabecera para abrir/cerrar.
 * @param {React.ReactNode} props.children - Contenido interno de la sección (gráficos, tablas, filtros).
 * @param {boolean} [props.hasData=true] - Si es false, despliega el placeholder estándar de sin datos.
 * @param {number} [props.noDataHeight=240] - Altura en px del placeholder cuando no hay datos.
 * @param {React.ReactNode} [props.rightAction] - Elemento o botón opcional a la derecha de la cabecera.
 * @param {Object} [props.sx] - Estilos SX adicionales para el contenedor raíz.
 * @param {Object} [props.headerSx] - Estilos SX adicionales para la cabecera.
 * @param {Object} [props.bodySx] - Estilos SX adicionales para el cuerpo de la sección.
 */
export const DashboardSection = ({
  title,
  subtitle,
  icon,
  iconColor = '#1E2875',
  isOpen = true,
  onToggle,
  children,
  hasData = true,
  noDataHeight = 240,
  rightAction,
  sx,
  headerSx,
  bodySx,
}) => {
  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        mt: '12px',
        mb: '12px',
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
      <Box
        onClick={onToggle}
        sx={{
          bgcolor: '#F8FAFC',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          p: '16px 20px',
          userSelect: 'none',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            bgcolor: '#F1F5F9',
          },
          ...headerSx,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          {icon && (
            <Box
              sx={{
                color: iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                '& svg': {
                  fontSize: '20px',
                  width: 20,
                  height: 20,
                },
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '18px',
              fontWeight: 600,
              color: '#1E2875',
              lineHeight: 1.2,
              m: 0,
            }}
          >
            {title}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {rightAction && (
            <Box onClick={(e) => e.stopPropagation()}>{rightAction}</Box>
          )}
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
            <ChevronDown size={18} />
          </Box>
        </Box>
      </Box>

      {/* Cuerpo de la Sección */}
      {isOpen && (
        <Box
          sx={{
            p: { xs: 2, sm: 2.5, md: 3 },
            borderTop: '1px solid #E2E8F0',
            ...bodySx,
          }}
        >
          {subtitle && (
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: '15px',
                fontWeight: 700,
                color: '#1E2875',
                mb: 1.5,
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
                height: noDataHeight,
                color: '#64748b',
                fontSize: '13px',
                fontWeight: 500,
                border: '1px dashed #E2E8F0',
                borderRadius: '12px',
                bgcolor: '#F8FAFC',
                width: '100%',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Sin datos disponibles
            </Box>
          ) : (
            children
          )}
        </Box>
      )}
    </Box>
  );
};

export default DashboardSection;
