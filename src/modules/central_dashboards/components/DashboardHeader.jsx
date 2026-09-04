import React from 'react';
import { Box, Typography } from '@mui/material';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * DashboardHeader - Componente estándar de cabecera para los dashboards de PIADI.
 * Estandariza tipografías, espaciados (gap: 2.5), migas de pan (Breadcrumbs) e icono institucional.
 *
 * @param {Object} props
 * @param {string} props.title - Título principal del Dashboard.
 * @param {string} props.subtitle - Descripción o subtítulo del Dashboard.
 * @param {React.ReactNode} props.icon - Icono representativo del departamento o área.
 * @param {string} [props.iconColor='#1DC2A0'] - Color de acento institucional para el icono y la barra de carga.
 * @param {boolean} [props.loading=false] - Indica si los datos están cargando para mostrar la barra de progreso.
 * @param {Array<{label: string, path?: string}>} [props.breadcrumbs] - Lista personalizada de breadcrumbs.
 * @param {React.ReactNode} [props.rightAction] - Elemento o botón opcional a la derecha de la cabecera.
 */
export const DashboardHeader = ({
  title,
  subtitle,
  icon,
  iconColor = '#1DC2A0',
  loading = false,
  breadcrumbs,
  rightAction,
}) => {
  const navigate = useNavigate();

  const defaultBreadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Central de Dashboards', path: '/dashboard' },
    { label: title, path: null },
  ];

  const breadcrumbsList = breadcrumbs || defaultBreadcrumbs;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%' }}>
      {/* 1. Miga de pan (Breadcrumbs) */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.8,
          color: '#6B7280',
          fontSize: '16px',
          fontWeight: 500,
          flexWrap: 'wrap',
        }}
      >
        {breadcrumbsList.map((item, index) => {
          const isLast = index === breadcrumbsList.length - 1;
          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7, color: '#6B7280' }} />
              )}
              <Typography
                variant="body1"
                onClick={() => item.path && navigate(item.path)}
                sx={{
                  fontSize: '16px',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: isLast ? 600 : 500,
                  color: isLast ? '#1E2875' : '#6B7280',
                  cursor: item.path ? 'pointer' : 'default',
                  '&:hover': item.path ? { textDecoration: 'underline' } : undefined,
                }}
              >
                {item.label}
              </Typography>
            </React.Fragment>
          );
        })}
      </Box>

      {/* 2. Título, Subtítulo, Icono y Acciones */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
          width: '100%',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: '#1E2875',
                color: iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                '& svg': {
                  fontSize: '28px',
                },
              }}
            >
              {icon}
            </Box>
          )}
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '28px', md: '36px' },
                color: '#1E2875',
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  color: '#6B7280',
                  fontSize: '14px',
                  fontFamily: "'Inter', sans-serif",
                  mt: 0.5,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        {rightAction && <Box sx={{ display: 'flex', alignItems: 'center' }}>{rightAction}</Box>}
      </Box>
    </Box>
  );
};

export default DashboardHeader;
