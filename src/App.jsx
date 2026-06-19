import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  AppBar, 
  Toolbar, 
  TextField, 
  Button, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  Chip, 
  CircularProgress, 
  Alert,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  ExitToApp as LogoutIcon, 
  Storage as DbIcon, 
  Dns as ServerIcon, 
  CheckCircleOutline,
  CloudDone
} from '@mui/icons-material';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { LoginPage, useAuth } from './modules/auth';
import { LandingPage } from './modules/landing_page';
import { CargaDatos, RepositorioArchivos } from './modules/carga_datos';
import { Auditoria } from './modules/auditoria';
import { CentralDashboards } from './modules/central_dashboards';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : `http://${window.location.hostname}:5000`);

// Custom Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#ffffff',
      paper: '#161c2d'
    },
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#3b82f6',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8'
    }
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h5: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 700
    },
    h6: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 600
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#161c2d',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16
        }
      }
    }
  }
});

function Dashboard() {
  const { user, logout } = useAuth();
  const [status, setStatus] = useState({ backend: 'checking', db: 'checking', details: null });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/status`);
      if (res.ok) {
        const data = await res.json();
        setStatus({
          backend: 'online',
          db: data.database,
          details: data
        });
      } else {
        setStatus({ backend: 'offline', db: 'offline', details: null });
      }
    } catch (err) {
      setStatus({ backend: 'offline', db: 'offline', details: null });
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/items`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
        setErrorMessage('');
      } else {
        setErrorMessage('Error al obtener elementos del servidor.');
      }
    } catch (err) {
      setErrorMessage('No se puede conectar con el servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    fetchItems();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      });
      
      if (res.ok) {
        const createdItem = await res.json();
        setItems([createdItem, ...items]);
        setNewItem({ name: '', description: '' });
        setErrorMessage('');
      } else {
        setErrorMessage('Fallo al crear elemento.');
      }
    } catch (err) {
      setErrorMessage('Error de red al intentar crear elemento.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/items/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setItems(items.filter(item => item.id !== id));
      } else {
        setErrorMessage('No se pudo eliminar el elemento.');
      }
    } catch (err) {
      setErrorMessage('Error de red al eliminar el elemento.');
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', pb: 6 }}>
      {/* Navbar navigation */}
      <AppBar position="static" sx={{ background: 'rgba(22, 28, 45, 0.7)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }} elevation={0}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CloudDone sx={{ color: 'primary.main', fontSize: 32 }} />
              <Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>
                  MUI Decoupled App
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sesión activa: {user?.username} ({user?.role})
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Chip 
                icon={<ServerIcon fontSize="small" />} 
                label={`API: ${status.backend}`} 
                color={status.backend === 'online' ? 'success' : 'error'} 
                variant="outlined"
                sx={{ borderRadius: '6px' }}
              />
              <Chip 
                icon={<DbIcon fontSize="small" />} 
                label={`DB: ${status.db === 'connected' ? 'online' : 'offline'}`} 
                color={status.db === 'connected' ? 'success' : 'error'} 
                variant="outlined"
                sx={{ borderRadius: '6px' }}
              />
              <IconButton color="inherit" onClick={logout} title="Cerrar Sesión">
                <LogoutIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Form and System specs */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Paper p={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AddIcon fontSize="small" color="primary" /> Agregar Registro
              </Typography>
              <form onSubmit={handleAddItem}>
                <TextField
                  fullWidth
                  label="Nombre"
                  variant="outlined"
                  margin="normal"
                  size="small"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  required
                />
                <TextField
                  fullWidth
                  label="Descripción"
                  variant="outlined"
                  margin="normal"
                  size="small"
                  multiline
                  rows={3}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
                <Button 
                  type="submit" 
                  fullWidth 
                  variant="contained" 
                  color="primary"
                  disabled={submitting || status.db !== 'connected'}
                  sx={{ mt: 2, textTransform: 'none', py: 1, borderRadius: 2 }}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Guardar en PostgreSQL'}
                </Button>
              </form>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DbIcon fontSize="small" color="secondary" /> Info del Sistema
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <Typography color="text.secondary">Backend URL</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{API_URL}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <Typography color="text.secondary">Database Status</Typography>
                  <Typography variant="body2" color={status.db === 'connected' ? 'success.main' : 'error.main'} fontWeight="bold">
                    {status.db === 'connected' ? 'Conectado' : 'Desconectado'}
                  </Typography>
                </Box>
                {status.details && (
                  <>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                      <Typography color="text.secondary">Uptime Backend</Typography>
                      <Typography variant="body2">{Math.round(status.details.uptime)}s</Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* List of items */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, minHeight: 450 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <DbIcon fontSize="small" color="primary" /> Datos en PostgreSQL
              </Typography>

              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
                  <CircularProgress />
                  <Typography color="text.secondary">Consultando base de datos...</Typography>
                </Box>
              ) : items.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2, textAlign: 'center' }}>
                  <CheckCircleOutline sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
                  <Typography color="text.secondary">No hay elementos registrados en la base de datos.</Typography>
                  <Typography variant="caption" color="text.secondary">Usa el formulario para agregar registros.</Typography>
                </Box>
              ) : (
                <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {items.map((item) => (
                    <Card key={item.id} variant="outlined" sx={{ borderRadius: 3, borderColor: 'rgba(255, 255, 255, 0.06)' }}>
                      <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                              {item.name}
                            </Typography>
                            {item.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                {item.description}
                              </Typography>
                            )}
                            <Typography variant="caption" color="text.muted" sx={{ display: 'block', mt: 1.5 }}>
                              ID: #{item.id} | Registrado: {new Date(item.createdAt || item.created_at).toLocaleString()}
                            </Typography>
                          </Box>
                          <IconButton 
                            onClick={() => handleDeleteItem(item.id)} 
                            color="error" 
                            size="small"
                            sx={{ border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '8px' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// =========================================================================
// COMPONENTE: RUTA PROTEGIDA (ProtectedRoute)
// =========================================================================
// Este componente valida si el usuario ha iniciado sesión.
// - Si la sesión se está cargando (loading), muestra un spinner de carga.
// - Si está autenticado, permite ver la vista hija (children).
// - Si NO está autenticado, lo redirige automáticamente a la pantalla de /login.
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0a0f1d' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// =========================================================================
// COMPONENTE: RUTA PÚBLICA (PublicRoute)
// =========================================================================
// Evita que un usuario que ya inició sesión vuelva a ver la pantalla de login.
// - Si ya está autenticado, lo redirige de inmediato a la raíz (/) del sitio.
// - Si NO está autenticado, le permite ingresar sus credenciales en la vista de Login.
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0a0f1d' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

// =========================================================================
// COMPONENTE PRINCIPAL: App
// =========================================================================
// Configura el tema, el proveedor de autenticación global y el enrutador de la aplicación.
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* 
              RUTA: /login
              Es pública, pero usa el wrapper PublicRoute para redirigir 
              a los usuarios autenticados automáticamente a la vista de inicio.
            */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />

            {/* 
              RUTA: /
              Es la ruta por defecto protegida. Muestra la nueva Landing Page/Dashboard
              siguiendo el diseño de referencia_landing_page.png.
            */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <LandingPage />
                </ProtectedRoute>
              } 
            />

            {/* 
              RUTA: /dashboard
              Muestra la Central de Dashboards con el diseño de Central_de_dashboards.png
            */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <CentralDashboards />
                </ProtectedRoute>
              } 
            />

            {/* 
              RUTA: /dashboard-crud
              Conserva la interfaz CRUD anterior de PostgreSQL y monitoreo técnico.
            */}
            <Route 
              path="/dashboard-crud" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* 
              RUTA: /carga-datos
              Ruta protegida para la vista de Carga de Datos según referencia_carga_datos.png.
            */}
            <Route 
              path="/carga-datos" 
              element={
                <ProtectedRoute>
                  <CargaDatos />
                </ProtectedRoute>
              } 
            />

            {/* 
              RUTA: /repositorio
              Ruta protegida para la vista del Repositorio de Archivos según vista_repositorio.png.
            */}
            <Route 
              path="/repositorio" 
              element={
                <ProtectedRoute>
                  <RepositorioArchivos />
                </ProtectedRoute>
              } 
            />

            {/* 
              RUTA: /auditoria
              Ruta protegida para la vista de Auditoría del Sistema según referencia_auditoria.png.
            */}
            <Route 
              path="/auditoria" 
              element={
                <ProtectedRoute>
                  <Auditoria />
                </ProtectedRoute>
              } 
            />

            {/* 
              REDIFRECCIÓN: *
              Cualquier ruta inválida o no registrada redirige al usuario automáticamente a la raíz (/).
            */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
