import React, { useState } from 'react';
import {
  Box,
  Typography,
  Divider,
  Avatar,
  IconButton,
  AppBar,
  Toolbar,
  Drawer,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  TrackChanges as TargetIcon,
  UploadFile as CargaIcon,
  Shield as AuditoriaIcon,
  ExitToApp as LogoutIcon,
  MoreVert as MoreVertIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoEcas from '../assets/logo_ECAS_white.svg';

export const Sidebar = ({ activeMenu, mobileRightAction }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const currentActive =
    activeMenu ||
    (() => {
      const path = location.pathname;
      if (path === '/') return 'Inicio';
      if (path.startsWith('/dashboard')) return 'Dashboards';
      if (path.startsWith('/metas')) return 'Metas';
      if (path.startsWith('/carga-datos') || path.startsWith('/repositorio')) return 'Carga de datos';
      if (path.startsWith('/auditoria')) return 'Auditoría';
      return '';
    })();

  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboards', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Metas', icon: <TargetIcon />, path: '/metas' },
    { text: 'Carga de datos', icon: <CargaIcon />, path: '/carga-datos' },
    { text: 'Auditoría', icon: <AuditoriaIcon />, path: '/auditoria' },
  ].filter((item) => {
    if (item.text === 'Auditoría') {
      return (
        user?.role === 'Rector' ||
        user?.role === 'Administrador' ||
        user?.role === 'Director de Administración' ||
        user?.role === 'Analista de Calidad' ||
        user?.role === 'Vicerrectoria de Calidad'
      );
    }
    return true;
  });

  const getInitials = (username) => {
    if (!username) return 'JD';
    return username
      .split(/[. @]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');
  };

  const sidebarContent = (
    <Box
      sx={{
        width: 260,
        height: '100%',
        bgcolor: '#1E2875',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Box>
        {/* Logo y Cabecera del Sidebar */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            component="img"
            src={logoEcas}
            alt="Logo ECAS"
            sx={{ width: 32, height: 32, objectFit: 'contain' }}
          />
          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, fontSize: '20px', letterSpacing: 0.5, lineHeight: 1.1 }}
            >
              PIADI
            </Typography>
            <Typography
              variant="caption"
              sx={{ opacity: 0.7, fontWeight: 600, fontSize: '12px', letterSpacing: 1 }}
            >
              ECAS
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', mb: 2 }} />

        {/* Menú de Navegación */}
        <Box sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isSelected = currentActive === item.text;
            return (
              <Box
                key={item.text}
                onClick={() => {
                  if (mobileOpen) setMobileOpen(false);
                  if (item.path && item.path !== '#') {
                    navigate(item.path);
                  }
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1.2,
                  px: 2,
                  mb: 0.8,
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: isSelected ? '#1DC2A0' : 'transparent',
                  color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: isSelected ? '#1DC2A0' : 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                  },
                }}
              >
                {item.icon}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isSelected ? 600 : 500,
                    noWrap: true,
                    color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Sección inferior del Sidebar */}
      <Box sx={{ p: 2 }}>
        <Box
          onClick={logout}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            py: 1.2,
            px: 2,
            mb: 2,
            borderRadius: 2,
            cursor: 'pointer',
            color: 'rgba(255, 255, 255, 0.7)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
            },
          }}
        >
          <LogoutIcon />
          <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
            Cerrar Sesión
          </Typography>
        </Box>

        <Box
          sx={{
            p: 1.5,
            borderRadius: 3,
            bgcolor: 'rgba(255, 255, 255, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: '#1DC2A0',
                fontSize: '0.9rem',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
              }}
            >
              {getInitials(user?.username)}
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: '#ffffff',
                  lineHeight: 1.2,
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {user?.username || 'Usuario'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Ver perfil
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* 1. AppBar Móvil */}
      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'flex', md: 'none' },
          bgcolor: '#1E2875',
          borderBottom: '1px solid #E5E7EB',
          boxShadow: 'none',
          borderRadius: 0,
          height: '50px',
          zIndex: 1100,
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            px: 1.5,
            height: '100%',
            minHeight: '50px',
            '@media (min-width: 0px)': {
              minHeight: '50px',
            },
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ p: 0, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <MenuIcon sx={{ fontSize: 36 }} />
          </IconButton>
          {mobileRightAction && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {mobileRightAction}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* 2. Sidebar Persistente (Escritorio) */}
      <Box
        sx={{
          width: 260,
          bgcolor: '#1E2875',
          color: '#ffffff',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderRight: '1px solid #E5E7EB',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 100,
        }}
      >
        {sidebarContent}
      </Box>

      {/* 3. Drawer Temporal (Móviles) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 260,
            border: 'none',
            borderRadius: '0 16px 16px 0',
            overflow: 'hidden',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
