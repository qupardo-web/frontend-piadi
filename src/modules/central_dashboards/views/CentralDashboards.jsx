import React from 'react';
import { useCentralDashboards } from './CentralDashboards.hooks';
import { styles } from './CentralDashboards.styles';
import { Header, Sidebar, CentroDeAyuda } from '../../../components';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  MenuBook as BookIcon,
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';

const getDepartmentMeta = (key) => {
  switch (key) {
    case 'admision':
      return { color: '#1E2875', icon: <PersonAddIcon /> };
    case 'relaciones_estudiantiles':
      return { color: '#51158C', icon: <GroupIcon /> };
    case 'desarrollo_curricular':
      return { color: '#175696', icon: <BookIcon /> };
    case 'innovacion':
      return { color: '#3EC9FF', icon: <LightbulbIcon /> };
    case 'educacion_continua':
      return { color: '#46D19F', icon: <SchoolIcon /> };
    case 'vinculacion_medio':
      return { color: '#E27800', icon: <FavoriteIcon /> };
    default:
      return { color: '#1E2875', icon: <DashboardIcon /> };
  }
};

export const CentralDashboards = () => {
  const {
    departments,
    loading,
    error,
    handleOpenDashboard,
  } = useCentralDashboards();

  return (
    <Box sx={styles.mainLayout}>
      {/* SIDEBAR TRANSVERSAL (Escritorio + Drawer + AppBar Móvil) */}
      <Sidebar />

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <Box component="main" sx={styles.contentArea}>
        
        {/* Cabecera del Panel Principal */}
        <Header
          title="Central de Dashboards"
          subtitle="Accede a los dashboards de las diferentes direcciones y áreas de la institución"
          icon={<DashboardIcon />}
          iconColor="#FFFFFF"
          breadcrumbs={[
            { label: 'Inicio', path: '/' },
            { label: 'Dashboards', path: null },
          ]}
        />

        {/* Grilla de Dashboards (3 Columnas en Desktop) */}
        <Grid container spacing={3}>
          {loading ? (
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#1E2875' }} />
            </Grid>
          ) : error ? (
            <Grid item xs={12} sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="error">Error al cargar departamentos: {error}</Typography>
            </Grid>
          ) : (
            departments.map((dept) => {
              const deptKey = dept.key || dept.departmentId;
              const meta = getDepartmentMeta(deptKey);
              return (
                <Grid item xs={12} sm={6} md={4} key={dept.id || deptKey}>
                  <Card 
                    sx={{ ...styles.dashboardCard, cursor: 'pointer' }}
                    onClick={() => handleOpenDashboard(deptKey)}
                  >
                    {/* Cabecera de Color con Icono */}
                    <Box sx={styles.cardHeaderColor(meta.color)}>
                      {meta.icon}
                    </Box>
                    {/* Cuerpo de la Tarjeta */}
                    <Box sx={styles.cardBody}>
                      <Typography variant="h6" sx={styles.cardTitle}>
                        {dept.name}
                      </Typography>
                      <Typography variant="body2" sx={styles.cardDesc}>
                        {dept.description}
                      </Typography>
                      {/* Footer de la tarjeta con botón de abrir */}
                      <Box sx={styles.cardFooter}>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button 
                          variant="contained" 
                          sx={styles.cardButton(meta.color)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDashboard(deptKey);
                          }}
                        >
                          Abrir &nbsp;➔
                        </Button>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>

      {/* Centro de Ayuda contextual unificado */}
      <CentroDeAyuda modulo="dashboard" />
    </Box>
  );
};
