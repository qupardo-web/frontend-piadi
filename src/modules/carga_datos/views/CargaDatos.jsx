import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { styles } from './CargaDatos.styles';
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
  FolderOpen as FolderIcon,
  Close as CloseIcon,
  Description as DescriptionIcon,
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

// Datos de prueba para simular la tabla de cargas recientes
const RECENT_UPLOADS = [
  { fecha: '14-05-2026 22:00', usuario: 'Jane Doe', plantilla: 'Matrícula y Estudiantes', archivo: 'Matriculas_2026_PrimerSemestre.xlsx' },
  { fecha: '14-05-2026 21:45', usuario: 'Jane Doe', plantilla: 'Matrícula y Estudiantes', archivo: 'Matriculas_2025_SegundoSemestre.xlsx' },
  { fecha: '14-05-2026 20:30', usuario: 'Jane Doe', plantilla: 'Matrícula y Estudiantes', archivo: 'Matriculas_2025_PrimerSemestre.xlsx' },
  { fecha: '14-05-2026 19:15', usuario: 'Jane Doe', plantilla: 'Matrícula y Estudiantes', archivo: 'Matriculas_2024_SegundoSemestre.xlsx' },
];

export const CargaDatos = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Estados para la carga de datos y diálogo
  const [uploads, setUploads] = useState(RECENT_UPLOADS);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

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

  const handleCloseDialog = () => {
    setOpenUploadDialog(false);
    setSelectedTemplate(null);
    setSelectedFile(null);
  };

  const handleUploadSubmit = () => {
    if (selectedTemplate && selectedFile) {
      const templateObj = TEMPLATES.find(t => t.id === selectedTemplate);
      const newUpload = {
        fecha: new Date().toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
        usuario: user?.username || 'Jane Doe',
        plantilla: templateObj?.title || 'Matrícula y Estudiantes',
        archivo: selectedFile.name,
      };
      setUploads([newUpload, ...uploads]);
      handleCloseDialog();
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
          <Box sx={styles.logoBadge}>P</Box>
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
            { text: 'Metas', icon: <MetasIcon />, path: '#' },
            { text: 'Carga de datos', icon: <CargaIcon />, path: '/carga-datos' },
            { text: 'Auditoría', icon: <AuditoriaIcon />, path: '#' },
            { text: 'Visualización de tablas', icon: <TablaIcon />, path: '#' },
          ].map((item) => {
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
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'JD'}
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
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={[styles.logoBadge, { width: 28, height: 28, fontSize: '1rem' }]}>P</Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
              PIADI ECAS
            </Typography>
          </Box>
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

          {/* Breadcrumbs de orientación */}
          <Box sx={styles.breadcrumbsContainer}>
            <Typography variant="caption" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/')}>
              Inicio
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '12px', opacity: 0.7 }} />
            <Typography variant="caption" sx={{ color: '#1E2875', fontWeight: 600 }}>
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
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          sx={styles.uploadButton}
          onClick={() => setOpenUploadDialog(true)}
        >
          Cargar datos
        </Button>

        {/* Sección: Cargas más Recientes */}
        <Card sx={styles.sectionCard}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            Cargas más recientes
          </Typography>
          
          <TableContainer sx={styles.tableContainer}>
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
        </Card>

        {/* Sección: Repositorio de Archivos */}
        <Card sx={styles.sectionCard}>
          <Typography variant="h6" sx={styles.sectionTitle}>
            Repositorio de archivos
          </Typography>
          <Typography sx={styles.sectionSubText}>
            Accede al repositorio completo de archivos cargados y descarga plantillas
          </Typography>

          {/* Botón Acceder dentro de la tarjeta, con el mismo estilo que Cargar datos */}
          <Button
            variant="contained"
            startIcon={<FolderIcon />}
            sx={styles.uploadButton}
            onClick={() => navigate('/repositorio')}
          >
            Acceder
          </Button>
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
            <Typography sx={styles.dialogTitle}>Cargar datos</Typography>
            <Typography sx={styles.dialogSubtitle}>
              Selecciona una plantilla y arrastra tu archivo Excel o haz clic para seleccionarlo
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: '#94a3b8', mt: -1 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflowY: 'visible' }}>
          {/* 1. Selecciona una plantilla */}
          <Typography sx={styles.sectionSubtitleDialog}>1. Selecciona una plantilla</Typography>
          
          <Box sx={styles.templatesGrid}>
            {TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;
              return (
                <Box
                  key={tmpl.id}
                  onClick={() => handleTemplateSelect(tmpl.id)}
                  sx={styles.templateCard(isSelected)}
                >
                  <Box sx={styles.templateCardIcon(tmpl.color)}>
                    <DescriptionIcon fontSize="medium" />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={styles.templateCardTitle}>
                      {tmpl.title}
                    </Typography>
                    <Typography sx={styles.templateCardDesc}>
                      {tmpl.desc}
                    </Typography>
                    <Box sx={styles.templateBadge(tmpl.color)}>
                      {tmpl.badge}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* 2. Carga tu archivo (Se activa al seleccionar una plantilla) */}
          {selectedTemplate && (
            <Box>
              <Typography sx={styles.sectionSubtitleDialog}>2. Carga tu archivo</Typography>
              
              <Box
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={styles.dropZone(isDragActive)}
                onClick={() => document.getElementById('dialog-file-input').click()}
              >
                <input
                  type="file"
                  id="dialog-file-input"
                  accept=".xlsx"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
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
          )}
        </DialogContent>

        <DialogActions sx={{ p: 0, mt: 3, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button onClick={handleCloseDialog} sx={styles.dialogCancelButton}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleUploadSubmit}
            sx={styles.dialogSubmitButton(selectedTemplate !== null && selectedFile !== null)}
            disabled={!selectedTemplate || !selectedFile}
          >
            Cargar datos
          </Button>
        </DialogActions>
      </Dialog>

      {/* Botón flotante de ayuda */}
      <IconButton sx={styles.floatingHelpButton}>
        <HelpIcon />
      </IconButton>
    </Box>
  );
};
