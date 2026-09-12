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
              borderColor: '#CBD5E1',
              transform: 'translateY(-2px)',
            }
          : {
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            },
      }}
    >
      {/* 1. Header: Label + Icon */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            fontSize: '12px',
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            fontFamily: "'Inter', sans-serif",
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>

        {icon && (
          <Box
            sx={{
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': {
                fontSize: '20px',
              },
            }}
          >
            {icon}
          </Box>
        )}
      </Box>

      {/* 2. Body: Value or Empty/Loading state */}
      <Box sx={{ my: 'auto', py: 0.5 }}>
        {loading ? (
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: '28px',
              color: '#94A3B8',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            ...
          </Typography>
        ) : !hasData ? (
          <Typography
            variant="body2"
            sx={{
              color: '#94A3B8',
              fontSize: '13px',
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              py: 0.5,
            }}
          >
            {noDataText}
          </Typography>
        ) : (
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              fontSize: '30px',
              color: '#1E2875',
              fontFamily: "'Inter', sans-serif",
              lineHeight: 1.1,
              letterSpacing: '-0.5px',
            }}
          >
            {value}
          </Typography>
        )}
      </Box>

      {/* 3. Footer: Compare text and Evolution */}
      {hasData && (compareText || evolution) && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 1,
            pt: 0.5,
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {compareText && (
            <Typography
              variant="caption"
              sx={{
                color: '#64748B',
                fontSize: '12px',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 500,
              }}
            >
              {compareText}
            </Typography>
          )}

          {evolution && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: '12px',
                color: isPositive ? '#10B981' : '#EF4444',
                fontFamily: "'Inter', sans-serif",
                bgcolor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                px: 0.8,
                py: 0.2,
                borderRadius: '4px',
              }}
            >
              {evolution}
            </Typography>
          )}
        </Box>
      )}
    </Card>
  );
};

export default KpiCard;
