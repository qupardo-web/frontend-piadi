import React from 'react';
import { Card, Box, Typography } from '@mui/material';

/**
 * KpiCard - Componente estándar de tarjeta KPI para los dashboards de PIADI.
 * Estandariza alturas mínimas (120px), bordes laterales (4px), escalas tipográficas y empty states.
 *
 * @param {Object} props
 * @param {string} props.label - Título de la métrica en mayúsculas (ej: 'PROYECTOS ACTIVOS').
 * @param {string|number} props.value - Valor principal del indicador.
 * @param {React.ReactNode} [props.icon] - Icono representativo de la tarjeta.
 * @param {string} [props.accentColor='#1DC2A0'] - Color de acento del borde izquierdo y del icono.
 * @param {boolean} [props.hasData=true] - Si es false, muestra el mensaje estándar de falta de datos.
 * @param {boolean} [props.loading=false] - Si es true, muestra un indicador de carga en el valor.
 * @param {string} [props.compareText] - Texto descriptivo del comparativo (ej: 'vs Año anterior (2024): 120').
 * @param {string|number} [props.evolution] - Valor porcentual o numérico del cambio (ej: '+12%').
 * @param {boolean} [props.isPositive] - Determina si la evolución se pinta verde o roja.
 * @param {string} [props.noDataText='No hay datos disponibles para desplegar'] - Mensaje para empty state.
 * @param {Function} [props.onClick] - Manejador de clic opcional (habilita hover interactivo).
 * @param {string} [props.id] - ID opcional del elemento.
 */
export const KpiCard = ({
  label,
  value,
  icon,
  accentColor = '#1DC2A0',
  hasData = true,
  loading = false,
  compareText,
  evolution,
  isPositive,
  noDataText = 'No hay datos disponibles para desplegar',
  onClick,
  id,
}) => {
  const isInteractive = Boolean(onClick);

  return (
    <Card
      id={id}
      onClick={onClick}
      sx={{
        p: 2.5,
        bgcolor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderLeft: `4px solid ${accentColor}`,
        borderRadius: '16px',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
        flexGrow: 1,
        boxSizing: 'border-box',
        cursor: isInteractive ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': isInteractive
          ? {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transform: 'translateY(-1px)',
            }
          : {
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            },
      }}
    >
      {/* Cabecera: Label, Valor e Icono */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#1E2875',
              mt: 0.5,
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.1,
            }}
          >
            {loading ? '...' : (hasData ? (value ?? '-') : '-')}
          </Typography>
        </Box>

        {icon && (
          <Box
            sx={{
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              '& svg': {
                fontSize: '24px',
                width: 24,
                height: 24,
              },
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      {/* Pie: Comparativa, Evolución o Mensaje de Sin Datos */}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 0.75 }}>
        {!hasData ? (
          <Typography
            variant="caption"
            sx={{
              fontSize: '12px',
              color: '#9E9E9E',
              fontFamily: "'Inter', sans-serif",
              fontWeight: 500,
            }}
          >
            {noDataText}
          </Typography>
        ) : (
          <>
            {compareText && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '12px',
                  color: '#475569',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                }}
              >
                {compareText}
              </Typography>
            )}

            {evolution != null && evolution !== '' && (
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 0.8,
                  py: 0.2,
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  bgcolor: isPositive ? '#DCFCE7' : '#FEE2E2',
                  color: isPositive ? '#15803D' : '#B91C1C',
                }}
              >
                {isPositive ? '↑' : '↓'} {evolution}
              </Box>
            )}
          </>
        )}
      </Box>
    </Card>
  );
};

export default KpiCard;
