import React from 'react';
import { Box, Typography } from '@mui/material';
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Header - Componente estándar de cabecera transversal para las vistas y dashboards de PIADI.
 * Estandariza tipografías, espaciados (gap: 2.5), migas de pan (Breadcrumbs) e icono institucional.
 *
 * @param {Object} props
 * @param {string} props.title - Título principal del Dashboard o vista.
 * @param {string} [props.subtitle] - Descripción o subtítulo de la vista.
 * @param {React.ReactNode} [props.icon] - Icono representativo del departamento o área.
 * @param {string} [props.iconColor='#1DC2A0'] - Color de acento para el icono.
 * @param {'square'|'circle'} [props.iconShape='square'] - Forma del contenedor del icono ('square' con 12px de radio o 'circle' con 50%).
 * @param {boolean} [props.loading=false] - Estado de carga opcional.
 * @param {Array<{label: string, path?: string}>|false|null} [props.breadcrumbs] - Lista personalizada de breadcrumbs. Si es false/null, no se renderizan breadcrumbs.
 * @param {React.ReactNode|string} [props.topContent] - Contenido superior personalizado (ej. saludo de bienvenida en LandingPage) en lugar de breadcrumbs.
 * @param {React.ReactNode} [props.rightAction] - Elemento o botón opcional a la derecha de la cabecera.
 */
export const Header = ({
  title,
  subtitle,
  icon,
  iconColor = '#1DC2A0',
  iconShape = 'square',
  loading = false,
  breadcrumbs,
  topContent,
  rightAction,
  sx,
}) => {
  const navigate = useNavigate();

  const defaultBreadcrumbs = [
    { label: 'Inicio', path: '/' },
    { label: 'Central de Dashboards', path: '/dashboard' },
    { label: title, path: null },
  ];

  const showBreadcrumbs = !topContent && breadcrumbs !== false && breadcrumbs !== null;
  const breadcrumbsList = Array.isArray(breadcrumbs) ? breadcrumbs : defaultBreadcrumbs;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, width: '100%', ...sx }}>
      {/* 1. Contenido superior: Saludo / TopContent o Miga de pan (Breadcrumbs) */}
      {topContent && (
        <Box>
          {typeof topContent === 'string' ? (
            <Typography
              variant="body1"
              sx={{
                color: '#6B7280',
                fontWeight: 500,
                fontSize: '16px',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {topContent}
            </Typography>
          ) : (
            topContent
          )}
        </Box>
      )}

      {showBreadcrumbs && (
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
      )}

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
                width: iconShape === 'circle' ? 44 : 48,
                height: iconShape === 'circle' ? 44 : 48,
                borderRadius: iconShape === 'circle' ? '50%' : '12px',
                bgcolor: '#1E2875',
                color: iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                '& svg': {
                  fontSize: iconShape === 'circle' ? '24px' : '28px',
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

export const DashboardHeader = Header;
export default Header;
