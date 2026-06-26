import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { styles } from './CargaDatos.styles';
import logoEcas from '../../../assets/logo_ECAS_white.svg';
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  Divider,
  Drawer,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  TrackChanges as MetasIcon,
  UploadFile as CargaIcon,
  Shield as AuditoriaIcon,
  TableChart as TablaIcon,
  ExitToApp as LogoutIcon,
  CheckCircle as CheckCircleIcon,
  MoreVert as MoreVertIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  CloudUpload as UploadIcon,
  Info as InfoIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ExpandMore as ExpandMoreIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

// Plantillas de carga de datos oficiales
const TEMPLATES = [
  {
    id: 'matricula',
    title: 'Matrícula y Estudiantes',
    desc: 'Matrícula total, nuevos vs antiguos, distribución por sexo, edad y carrera',
    badge: 'Admisión',
    color: '#1E2875',
  },
  {
    id: 'caracterizacion',
    title: 'Caracterización Estudiante',
    desc: 'Nivel socioeconómico, situación familiar, procedencia geográfica, tipo de colegio',
    badge: 'Admisión',
    color: '#1E2875',
  },
  {
    id: 'rendimiento',
    title: 'Rendimiento Académico',
    desc: 'Tasas de aprobación/reprobación, asignaturas críticas, prácticas, titulación',
    badge: 'Desarrollo Curricular',
    color: '#175696',
  },
  {
    id: 'educacion_continua',
    title: 'Educación Continua',
    desc: 'Cursos programados y dictados, matrícula, tasa de aprobación, ingresos',
    badge: 'Educación Continua',
    color: '#46D19F',
  },
  {
    id: 'vinculacion',
    title: 'Vinculación con el Medio',
    desc: 'Convenios vigentes y nuevos, actividades VcM, participantes',
    badge: 'Vinculación con el Medio',
    color: '#E27800',
  },
  {
    id: 'innovacion',
    title: 'Innovación',
    desc: 'Proyectos en curso y finalizados, financiamiento externo, docentes involucrados',
    badge: 'Innovación',
    color: '#3EC9FF',
  },
];


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getTemplateColor = (roleName) => {
  if (!roleName) return '#1E2875';
  const name = roleName.toLowerCase();
  if (name.includes('admisión') || name.includes('adcision') || name.includes('resumen')) return '#1E2875';
  if (name.includes('estudiantiles')) return '#51158C';
  if (name.includes('curricular') || name.includes('desarrollo')) return '#175696';
  if (name.includes('innovación') || name.includes('innovacion')) return '#3EC9FF';
  if (name.includes('continua')) return '#46D19F';
  if (name.includes('vinculación') || name.includes('vinculacion') || name.includes('medio')) return '#E27800';
  return '#1E2875';
};

export const CargaDatos = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Estados para la carga de datos y diálogo
  const [uploads, setUploads] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Página inicial 1 por defecto
  const [openHelpDialog, setOpenHelpDialog] = useState(false); // Estado para abrir el Centro de Ayuda
  const [templates, setTemplates] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadErrorDetails, setUploadErrorDetails] = useState([]);





  // Carga de plantillas dinámicas desde el backend
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch(`${API_URL}/api/plantillas`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setTemplates(data);
            return;
          }
        }
      } catch (err) {
        console.warn('Error fetching plantillas from backend, using fallbacks:', err);
      }
      
      // Fallbacks estáticos si el backend está desconectado
      const fallbackTemplates = [
        {
          id: 1,
          name: 'Matrícula y Estudiantes',
          description: 'Matrícula total, nuevos vs antiguos, distribución por sexo, edad y carrera',
          role: { name: 'Admisión' }
        },
        {
          id: 2,
          name: 'Caracterización Estudiante',
          description: 'Nivel socioeconómico, situación familiar, procedencia geográfica, tipo de colegio',
          role: { name: 'Admisión' }
        },
        {
          id: 3,
          name: 'Rendimiento Académico',
          description: 'Tasas de aprobación/reprobación, asignaturas críticas, prácticas, titulación',
          role: { name: 'Desarrollo Curricular' }
        },
        {
          id: 4,
          name: 'Educación Continua',
          description: 'Cursos programados y dictados, matrícula, tasa de aprobación, ingresos',
          role: { name: 'Educación Continua' }
        },
        {
          id: 5,
          name: 'Vinculación con el Medio',
          description: 'Convenios vigentes y nuevos, actividades VcM, participantes',
          role: { name: 'Vinculación con el Medio' }
        },
        {
          id: 6,
          name: 'Innovación',
          description: 'Proyectos en curso y finalizados, financiamiento externo, docentes involucrados',
          role: { name: 'Innovación' }
        }
      ];
      setTemplates(fallbackTemplates);
    };

    fetchTemplates();
  }, []);

  // Carga el historial real de cargas desde auditoría (re-ejecuta cuando templates carga)
  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    if (!token) return;
    const formatDate = (iso) => {
      if (!iso) return '-';
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    fetch(`${API_URL}/api/audit-logs?type=carga&limit=10`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(json => {
        const items = json?.data?.items ?? [];
        if (!items.length) return;
        setUploads(items.map(item => {
          const plantillaId = item.detail?.plantilla;
          const tmpl = templates.find(t => String(t.id) === String(plantillaId));
          return {
            fecha: formatDate(item.createdAt),
            usuario: item.usuarioNombre || item.usuarioEmail || (item.detail?.usuarioId != null ? `#${item.detail.usuarioId}` : '-'),
            plantilla: tmpl?.name || item.detail?.entidad || plantillaId || '-',
            archivo: item.detail?.archivo || '-',
          };
        }));
      })
      .catch(() => {});
  }, [templates]);

  // Filtrado de plantillas por rol (Rector y administradores ven todas)
  const filteredTemplates = templates.filter((tmpl) => {
    if (
      user?.role === 'Rector' || 
      user?.role === 'Administrador' || 
      user?.role === 'Director de Administración'
    ) {
      return true;
    }
    return tmpl.role?.name === user?.role;
  });

  // Datos de las Preguntas Frecuentes (FAQ) del Centro de Ayuda
  const faqData = [
    {
      q: '¿Qué son las metas y cómo se usan?',
      a: 'Las metas son objetivos específicos que puedes rastrear a lo largo del tiempo. Cada meta tiene un progreso medido en porcentaje, fechas de inicio y término, y un estado (Completada, En curso, o Superada). Las barras de progreso muestran visualmente qué tan cerca estás de cumplir cada meta.'
    },
    {
      q: '¿Cómo interpreto los indicadores?',
      a: 'Los indicadores muestran métricas clave como "Total de cursos dictados" o "Tasa de ejecución". El número principal es el valor actual, y la flecha con porcentaje indica el cambio comparado con el periodo anterior. Una flecha verde hacia arriba significa mejora.'
    },
    {
      q: '¿Cómo navego entre secciones?',
      a: 'Usa el menú lateral izquierdo para moverte entre Inicio, Dashboards, Metas, y otras secciones. La sección activa se muestra con fondo verde azulado y una barra blanca en el borde izquierdo.'
    },
    {
      q: '¿Qué significan los colores en las metas?',
      a: 'Verde indica meta completada (100% o más), amarillo indica meta en progreso (menos de 100%), y rojo indica que se ha superado el límite de una meta negativa (como "tasa de abandono debajo del 30%").'
    },
    {
      q: '¿Cómo puedo ver más detalles?',
      a: 'Haz clic en el botón "Detalles" junto a cada meta, o en "Ingresar a Dashboard" para ver análisis más profundos con gráficos interactivos.'
    },
    {
      q: '¿Cómo funcionan las métricas?',
      isRich: true
    }
  ];

  // Mapeamos el menú activo a "Carga de datos"
  const activeMenu = 'Carga de datos';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDownloadTemplate = async (e, templateId) => {
    e.stopPropagation(); // Evita que se seleccione la tarjeta
    try {
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/api/plantillas/${templateId}/descargar`, {
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('No se pudo descargar la plantilla desde el servidor');
      }

      // Obtener el nombre del archivo de la cabecera Content-Disposition
      let filename = 'plantilla.xlsx';
      const disposition = response.headers.get('content-disposition');
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) { 
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar la plantilla:', err);
      alert(err.message || 'Error al descargar la plantilla.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx')) {
        setSelectedFile(file);
      } else {
        alert('Por favor, selecciona un archivo con extensión .xlsx (Excel).');
      }
    }
  };

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [successSummary, setSuccessSummary] = useState(null);

  const handleCloseDialog = () => {
    setOpenUploadDialog(false);
    setSelectedTemplate(null);
    setSelectedFile(null);
    setUploadError('');
    setUploadErrorDetails([]);
    setUploading(false);
    setUploadSuccess(false);
    setSuccessSummary(null);
  };

  const handleUploadSubmit = async () => {
    if (selectedTemplate && selectedFile) {
      setUploading(true);
      setUploadError('');
      setUploadErrorDetails([]);
      setUploadSuccess(false);
      setSuccessSummary(null);

      const formData = new FormData();
      formData.append('archivo', selectedFile);

      try {
        const token = sessionStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/api/plantillas/${selectedTemplate}/cargar`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: formData
        });

        const data = await response.json();

        if (response.ok) {
          const templateObj = templates.find(t => t.id === selectedTemplate);
          const newUpload = {
            fecha: new Date().toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
            usuario: user?.username || 'Jane Doe',
            plantilla: templateObj?.name || 'Matrícula y Estudiantes',
            archivo: selectedFile.name,
          };
          setUploads([newUpload, ...uploads]);
          setCurrentPage(1); // Restablecer a la página 1 para que el usuario visualice su carga
          
          setSuccessSummary(data.resumen || null);
          setUploadSuccess(true);
        } else {
          // Si el servidor retorna errores de validación estructurados
          setUploadError(data.message || data.error || 'Error en la estructura del archivo.');
          if (data.errores) {
            setUploadErrorDetails(data.errores);
          }
        }
      } catch (err) {
        console.error('Error al subir archivo:', err);
        setUploadError('No se pudo establecer comunicación con el servidor.');
      } finally {
        setUploading(false);
      }
    }
  };

  // =========================================================================
  // SUB-COMPONENTE: CONTENIDO DEL SIDEBAR (REUTILIZABLE)
  // =========================================================================
  const sidebarContent = (
    <Box sx={styles.drawerContent}>
      <Box>
        {/* Logo y Cabecera del Sidebar */}
        <Box sx={styles.logoContainer}>
          <Box 
            component="img" 
            src={logoEcas} 
            alt="Logo ECAS" 
            sx={{ width: 32, height: 32, objectFit: 'contain' }} 
          />
          <Box>
            <Typography variant="subtitle1" sx={styles.logoTitle}>
              PIADI
            </Typography>
            <Typography variant="caption" sx={styles.logoSubtitle}>
              ECAS
            </Typography>
          </Box>
        </Box>

        <Divider sx={styles.divider} />

        {/* Menú de Navegación */}
        <Box sx={styles.menuContainer}>
          {[
            { text: 'Inicio', icon: <HomeIcon />, path: '/' },
            { text: 'Dashboards', icon: <DashboardIcon />, path: '/dashboard' },
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
          }).map((item) => {
            const isSelected = activeMenu === item.text;
            return (
              <Box
                key={item.text}
                onClick={() => {
                  setMobileOpen(false);
                  if (item.path !== '#') {
                    navigate(item.path);
                  }
                }}
                sx={styles.menuItem(isSelected)}
              >
                {item.icon}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: isSelected ? 600 : 500, 
                    noWrap: true,
                    color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'
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
      <Box sx={styles.bottomSection}>
        {/* Botón Cerrar Sesión */}
        <Box onClick={logout} sx={styles.logoutButton}>
          <LogoutIcon />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Cerrar Sesión
          </Typography>
        </Box>

        {/* Tarjeta de Usuario */}
        <Box sx={styles.userCard}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Avatar sx={styles.userAvatar}>
              {user?.username ? user.username.split(/[. @]/).filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('') : 'JD'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
                {user?.username || 'John Doe'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
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
    <Box sx={styles.mainLayout}>
      
      {/* =========================================================================
          BARRA DE NAVEGACIÓN SUPERIOR PARA MÓVILES (APPBAR)
          ========================================================================= */}
      <AppBar position="fixed" sx={styles.mobileAppBar}>
        <Toolbar sx={styles.mobileToolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ p: 0, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <MenuIcon sx={{ fontSize: 36 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* =========================================================================
          SECCIÓN 1A: SIDEBAR PERSISTENTE (ESCRITORIO)
          ========================================================================= */}
      <Box sx={styles.sidebar}>
        {sidebarContent}
      </Box>

      {/* =========================================================================
          SECCIÓN 1B: SIDEBAR TEMPORAL / DESPLEGABLE (MÓVILES Y TABLETS)
          ========================================================================= */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, border: 'none' },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* =========================================================================
          SECCIÓN 2: ÁREA DE CONTENIDO PRINCIPAL (DERECHA)
          ========================================================================= */}
      <Box sx={styles.contentArea}>
        
        {/* Cabecera de la Página */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, width: '100%' }}>
            <Box sx={styles.panelHeader}>
              <Box sx={styles.panelIconContainer}>
                <UploadIcon />
              </Box>
              <Box>
                <Typography variant="h5" sx={styles.panelTitle}>
                  Carga de Datos
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Sube archivos Excel con datos institucionales según las plantillas predefinidas
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Breadcrumbs de orientación */}
          <Box sx={styles.breadcrumbsContainer}>
            <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/')}>
              Inicio
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7 }} />
            <Typography variant="body1" sx={{ color: '#1E2875', fontWeight: 600 }}>
              Carga de datos
            </Typography>
          </Box>
        </Box>

        {/* Alerta de Formato Requerido */}
        <Box sx={styles.formatAlert}>
          <Box sx={{ display: 'flex', color: '#0F4AFF', mt: 0.2 }}>
            <InfoIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography sx={styles.alertTitle}>Formato de archivo requerido</Typography>
            <Typography sx={styles.alertText}>
              Los archivos deben estar en formato .xlsx (Excel). Cada plantilla tiene una estructura de columnas específica que debe respetarse.
            </Typography>
          </Box>
        </Box>

        {/* Botón Acción: Cargar Datos */}
        {/* ==========================================
            [BOTÓN ACCIÓN PRINCIPAL: CARGAR DATOS]
            Abre el diálogo modal de selección de plantilla e importación de archivos.
            ========================================== */}
        {user?.role !== 'Analista de Calidad' && (
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            sx={styles.uploadButton}
            onClick={() => setOpenUploadDialog(true)}
          >
            Cargar datos
          </Button>
        )}

        {/* Sección: Cargas más Recientes */}
        <Card sx={styles.sectionCard}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            Cargas más recientes
          </Typography>
          
          <TableContainer sx={{ ...styles.tableContainer, display: { xs: 'none', md: 'block' } }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeadCell}>Fecha y hora</TableCell>
                  <TableCell sx={styles.tableHeadCell}>Usuario</TableCell>
                  <TableCell sx={styles.tableHeadCell}>Plantilla</TableCell>
                  <TableCell sx={styles.tableHeadCell}>Archivo de origen</TableCell>
                  <TableCell sx={styles.tableHeadCell}>Estado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {uploads.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', color: '#94A3B8', py: 4, fontSize: '14px' }}>
                      No hay cargas registradas.
                    </TableCell>
                  </TableRow>
                )}
                {uploads.map((upload, index) => (
                  <TableRow key={index}>
                    <TableCell sx={styles.tableBodyCell}>{upload.fecha}</TableCell>
                    <TableCell sx={styles.tableBodyCell}>{upload.usuario}</TableCell>
                    <TableCell sx={styles.tableBodyCell}>{upload.plantilla}</TableCell>
                    <TableCell sx={styles.tableBodyCell}>
                      <a href="#" sx={styles.fileLink} style={{ color: '#10B981', fontWeight: 500, textDecoration: 'none' }}>
                        {upload.archivo}
                      </a>
                    </TableCell>
                    <TableCell sx={styles.tableBodyCell}>
                      <Box sx={styles.statusBadgeSuccess}>
                        <CheckCircleIcon sx={{ fontSize: 16 }} />
                        <Typography variant="body2" sx={{ fontSize: '14px', fontWeight: 600 }}>
                          Exitoso
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Vista móvil: Diseño de Tarjetas Responsivo */}
          <Box sx={styles.mobileCardsContainer}>
            {uploads.slice((currentPage - 1) * 3, currentPage * 3).map((upload, index) => (
              <Box key={index} sx={styles.mobileUploadCard}>
                <Box sx={styles.mobileCardHeader}>
                  {/* Nombre de archivo estilizado con clase de truncado (textOverflow: ellipsis) */}
                  <Box component="a" href="#" sx={styles.mobileCardFilename}>
                    {upload.archivo}
                  </Box>
                </Box>
                <Box sx={styles.mobileMetadataRow}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={styles.metadataItem}>
                      <PersonIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                      <Typography variant="body2" sx={{ fontSize: '12px', color: '#475569' }}>
                        {upload.usuario}
                      </Typography>
                    </Box>
                    <Box sx={styles.metadataItem}>
                      <CalendarIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                      <Typography variant="body2" sx={{ fontSize: '12px', color: '#475569' }}>
                        {upload.fecha}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={styles.templatePill}>
                    <DescriptionIcon sx={{ fontSize: 12, color: '#ffffff' }} />
                    <Typography variant="caption" sx={{ fontSize: '11px', fontWeight: 600, color: '#ffffff' }}>
                      {upload.plantilla}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}

            {/* Paginación móvil */}
            <Box sx={styles.paginationContainer}>
              <IconButton 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                sx={styles.paginationArrow}
                size="small"
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              
              <Typography sx={styles.paginationDot}>...</Typography>
              
              {[1, 2, 3].map((pageNum) => (
                <Typography
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  sx={styles.paginationPage(currentPage === pageNum)}
                >
                  {pageNum}
                </Typography>
              ))}
              
              <Typography sx={styles.paginationDot}>...</Typography>
              
              <IconButton 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, 3))}
                disabled={currentPage === 3}
                sx={styles.paginationArrow}
                size="small"
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Card>


      </Box>

      {/* =========================================================================
          DIÁLOGO MODAL: CARGAR DATOS (POPUP)
          ========================================================================= */}
      <Dialog
        open={openUploadDialog}
        onClose={handleCloseDialog}
        PaperProps={{ sx: styles.dialogPaper }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ p: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography sx={styles.dialogTitle}>
              {uploadSuccess ? 'Carga exitosa' : 'Cargar datos'}
            </Typography>
            <Typography sx={styles.dialogSubtitle}>
              {uploadSuccess 
                ? 'El archivo Excel se ha validado e importado correctamente en la base de datos'
                : 'Selecciona una plantilla y arrastra tu archivo Excel o haz clic para seleccionarlo'
              }
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: '#94a3b8', mt: -1 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflowY: 'visible' }}>
          {uploadSuccess ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, px: 2, textAlign: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 64, color: '#10B981', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E2875', mb: 1, fontFamily: "'Inter', sans-serif" }}>
                ¡Datos importados con éxito!
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', mb: 4, maxWidth: '450px', fontFamily: "'Inter', sans-serif" }}>
                El archivo <strong>{selectedFile?.name}</strong> fue verificado y cargado sin errores en el sistema.
              </Typography>

              {successSummary && (
                <Box sx={{ width: '100%', maxWidth: '500px', bgcolor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', p: 3, textAlign: 'left', mb: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#334155', mb: 2, textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>
                    Resumen de registros procesados:
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: '12px 24px' }}>
                    {Object.entries(successSummary).map(([tabla, cantidad]) => (
                      <React.Fragment key={tabla}>
                        <Typography sx={{ fontSize: '14px', color: '#475569', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                          {tabla}
                        </Typography>
                        <Typography sx={{ fontSize: '14px', color: '#10B981', fontWeight: 700, textAlign: 'right', fontFamily: "'Inter', sans-serif" }}>
                          +{cantidad} filas
                        </Typography>
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <>


              {/* 1. Selecciona una plantilla */}
              <Typography sx={styles.sectionSubtitleDialog}>1. Selecciona una plantilla</Typography>
              
              <Box sx={styles.templatesGrid}>
                {filteredTemplates.map((tmpl) => {
                  const isSelected = selectedTemplate === tmpl.id;
                  const tmplColor = getTemplateColor(tmpl.role?.name);

                  return (
                    <Box
                      key={tmpl.id}
                      onClick={() => !uploading && handleTemplateSelect(tmpl.id)}
                      sx={[styles.templateCard(isSelected), uploading && { pointerEvents: 'none', opacity: 0.6 }]}
                    >
                      <Box sx={styles.templateCardIcon(tmplColor)}>
                        <DescriptionIcon fontSize="medium" />
                      </Box>
                      <Box sx={{ flexGrow: 1, pr: 4 }}>
                        <Typography sx={styles.templateCardTitle}>
                          {tmpl.name}
                        </Typography>
                        <Typography sx={styles.templateCardDesc}>
                          {tmpl.description}
                        </Typography>
                        <Box sx={styles.templateBadge(tmplColor)}>
                          {tmpl.role?.name || 'General'}
                        </Box>
                      </Box>
                      <IconButton
                        onClick={(e) => handleDownloadTemplate(e, tmpl.id)}
                        disabled={uploading}
                        sx={{
                          position: 'absolute',
                          bottom: 12,
                          right: 12,
                          color: tmplColor,
                          padding: '6px',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                        title="Descargar plantilla"
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>



              {/* 2. Carga tu archivo (Habilitado solo al seleccionar una plantilla de la sección anterior) */}
              <Box sx={{ 
                opacity: (selectedTemplate && !uploading) ? 1 : 0.4, 
                pointerEvents: (selectedTemplate && !uploading) ? 'auto' : 'none',
                transition: 'all 0.3s ease-in-out',
                mt: 3 
              }}>
                <Typography sx={styles.sectionSubtitleDialog}>2. Carga tu archivo</Typography>
                
                <Box
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  sx={styles.dropZone(isDragActive && selectedTemplate)}
                  onClick={() => selectedTemplate && !uploading && document.getElementById('dialog-file-input').click()}
                >
                  <input
                    type="file"
                    id="dialog-file-input"
                    accept=".xlsx"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    disabled={!selectedTemplate || uploading}
                  />
                  
                  <UploadIcon sx={[styles.dropZoneIcon, selectedFile && { color: '#10B981' }]} />
                  
                  {selectedFile ? (
                    <Box>
                      <Typography sx={styles.dropZoneTextPrimary} style={{ color: '#10B981' }}>
                        Archivo seleccionado: {selectedFile.name}
                      </Typography>
                      <Typography sx={styles.dropZoneTextSecondary}>
                        Tamaño: {(selectedFile.size / 1024).toFixed(1)} KB (Listo para cargar)
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Typography sx={styles.dropZoneTextPrimary}>
                        Arrastra tu archivo aquí
                      </Typography>
                      <Typography sx={styles.dropZoneTextSecondary}>
                        o haz clic para seleccionarlo
                      </Typography>
                      
                      <Button
                        variant="contained"
                        sx={styles.dropZoneSelectButton}
                        component="span"
                        disabled={!selectedTemplate || uploading}
                      >
                        Seleccionar archivo
                      </Button>
                      
                      <Typography sx={styles.dropZoneCaption}>
                        Formato aceptado: .xlsx (Excel)
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>

              {/* Barra de progreso de validación */}
              {uploading && (
                <Box sx={{ width: '100%', mt: 3 }}>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1E2875', mb: 1, fontFamily: "'Inter', sans-serif" }}>
                    Validando estructura del archivo Excel...
                  </Typography>
                  <LinearProgress sx={{ 
                    height: 8, 
                    borderRadius: 4, 
                    bgcolor: '#E5E7EB',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#1DC2A0'
                    }
                  }} />
                </Box>
              )}

              {/* Mensaje de error general y detalles de validación en la parte inferior */}
              {uploadError && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 3, 
                    fontFamily: "'Inter', sans-serif",
                    borderRadius: '8px',
                    border: '1px solid #FCA5A5',
                    bgcolor: '#FEF2F2',
                    '& .MuiAlert-message': { width: '100%' }
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '15px', color: '#991B1B', mb: uploadErrorDetails.length > 0 ? 1 : 0 }}>
                    {uploadError}
                  </Typography>
                  
                  {uploadErrorDetails.length > 0 && (
                    <Box sx={{ mt: 1, pl: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {uploadErrorDetails.map((err, idx) => (
                        <Typography key={idx} variant="body2" sx={{ color: '#7F1D1D', fontSize: '13px', display: 'list-item', listStyleType: 'disc' }}>
                          <strong>Hoja:</strong> {err.hoja || 'N/A'} — <strong>Campo:</strong> {err.campo || 'N/A'}: {err.mensaje}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Alert>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 0, mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          {uploadSuccess ? (
            <Button
              variant="contained"
              onClick={handleCloseDialog}
              sx={styles.dialogSubmitButton(true)}
            >
              Entendido
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseDialog} sx={styles.dialogCancelButton} disabled={uploading}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleUploadSubmit}
                sx={styles.dialogSubmitButton(selectedTemplate !== null && selectedFile !== null && !uploading)}
                disabled={!selectedTemplate || !selectedFile || uploading}
              >
                {uploading ? 'Validando...' : 'Cargar datos'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Botón flotante de ayuda */}
      <IconButton sx={styles.floatingHelpButton} onClick={() => setOpenHelpDialog(true)}>
        <HelpIcon />
      </IconButton>

      {/* =========================================================================
          DIÁLOGO: CENTRO DE AYUDA (FAQ)
          ========================================================================= */}
      <Dialog
        open={openHelpDialog}
        onClose={() => setOpenHelpDialog(false)}
        PaperProps={{ sx: styles.helpDialogPaper }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ p: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box>
            <Typography sx={styles.helpDialogTitle}>Centro de Ayuda</Typography>
            <Typography sx={styles.helpDialogSubtitle}>
              Encuentra respuestas a preguntas frecuentes sobre PIADI ECAS
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenHelpDialog(false)} sx={{ color: '#94A3B8', mt: -1 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflowY: 'auto', maxHeight: '60vh' }}>
          {faqData.map((faq, idx) => (
            <Accordion key={idx} disableGutters elevation={0} sx={styles.helpAccordion}>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#6B7280' }} />}>
                <Typography sx={styles.helpAccordionQuestion}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {faq.isRich ? (
                  <Box sx={{ color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E2875', mb: 0.5, fontFamily: "'Inter', sans-serif" }}>
                      Aporte porcentual a la meta
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      El aporte porcentual define cuánto peso tiene cada métrica dentro del cumplimiento total de la meta. La suma de los aportes de todas las métricas asociadas debe ser exactamente <strong>100%</strong>.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      Por ejemplo, si una meta tiene dos métricas:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2.5, mb: 1.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      <li><strong>Total de matriculados</strong> con un aporte del <strong>70%</strong></li>
                      <li><strong>Tasa de retención</strong> con un aporte del <strong>30%</strong></li>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 2, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      El progreso final de la meta será la suma ponderada: si la primera métrica se cumplió al 100% y la segunda al 50%, el avance total será <strong>(100% × 0.7) + (50% × 0.3) = 85%</strong>.
                    </Typography>

                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E2875', mb: 0.5, fontFamily: "'Inter', sans-serif" }}>
                      Valor esperado y comportamiento esperado
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      El <strong>valor esperado</strong> es el umbral que determina si la métrica se cumple o no. Puede expresarse de dos formas:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2.5, mb: 1.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      <li><strong>Numérico (#)</strong>: un conteo absoluto, por ejemplo "200 matriculados".</li>
                      <li><strong>Porcentual (%)</strong>: una proporción, por ejemplo "30% de tasa de abandono".</li>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      El <strong>comportamiento esperado</strong> indica la dirección en que debe moverse el valor real respecto al umbral:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2.5, color: '#475569', fontFamily: "'Inter', sans-serif" }}>
                      <li style={{ marginBottom: '8px' }}><strong>Debe superar</strong>: el valor real debe ser mayor o igual al valor esperado para considerar la métrica cumplida. Se usa en indicadores de crecimiento (ej. cantidad de matriculados, cursos ejecutados).</li>
                      <li><strong>No debe superar</strong>: el valor real debe ser menor o igual al valor esperado para considerar la métrica cumplida. Se usa en indicadores que deben mantenerse bajos (ej. tasa de deserción, número de abandonos).</li>
                    </Box>
                  </Box>
                ) : (
                  <Typography sx={styles.helpAccordionAnswer}>{faq.a}</Typography>
                )}
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Tip de ayuda inferior */}
          <Box sx={styles.helpTipContainer}>
            <Typography variant="body2" sx={styles.helpTipText}>
              💡 <strong>Tip:</strong> Puedes acceder a esta ayuda en cualquier momento haciendo clic en el botón "?" en la esquina inferior derecha.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
