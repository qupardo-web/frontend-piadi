import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { styles } from './RepositorioArchivos.styles';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
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
  MoreVert as MoreVertIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  FolderOpen as FolderIcon,
  ChevronRight as ChevronRightIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Datos estáticos de plantillas iniciales (6 oficiales)
const INITIAL_TEMPLATES = [
  { id: 1, title: 'Matrícula y Estudiantes', desc: 'Matrícula total, nuevos vs antiguos, distribución por sexo, edad y carrera', badge: 'Admisión', color: '#1E2875', type: 'Predefinida', uses: 45 },
  { id: 2, title: 'Caracterización Estudiante', desc: 'Nivel socioeconómico, situación familiar, procedencia geográfica, tipo de colegio', badge: 'Admisión', color: '#1E2875', type: 'Predefinida', uses: 32 },
  { id: 3, title: 'Rendimiento Académico', desc: 'Tasas de aprobación/reprobación, asignaturas críticas, prácticas, titulación', badge: 'Desarrollo Curricular', color: '#175696', type: 'Predefinida', uses: 67 },
  { id: 4, title: 'Educación Continua', desc: 'Cursos programados y dictados, matrícula, tasa de aprobación, ingresos', badge: 'Educación Continua', color: '#46D19F', type: 'Predefinida', uses: 28 },
  { id: 5, title: 'Vinculación con el Medio', desc: 'Convenios vigentes y nuevos, actividades VcM, participantes', badge: 'Vinculación con el Medio', color: '#E27800', type: 'Predefinida', uses: 19 },
  { id: 6, title: 'Innovación', desc: 'Proyectos en curso y finalizados, financiamiento externo, docentes involucrados', badge: 'Innovación', color: '#3EC9FF', type: 'Predefinida', uses: 15 },
];

// Datos estáticos de archivos históricos
const INITIAL_ARCHIVES = [
  { id: 1, name: 'Matriculas_2026_PrimerSemestre.xlsx', template: 'Matrícula y Estudiantes', date: '14-05-2026 22:00', user: 'Jane Doe', records: 3842 },
  { id: 2, name: 'Matriculas_2025_SegundoSemestre.xlsx', template: 'Matrícula y Estudiantes', date: '14-05-2026 21:45', user: 'Jane Doe', records: 3654 },
  { id: 3, name: 'Rendimiento_2026_Otoño.xlsx', template: 'Rendimiento Académico', date: '13-05-2026 15:30', user: 'John Smith', records: 1256 },
];

export const RepositorioArchivos = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 = Plantillas, 1 = Archivos históricos

  // Filtros
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [typeFilter, setTypeFilter] = useState('Todas las plantillas');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados dinámicos
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [archives, setArchives] = useState(INITIAL_ARCHIVES);

  // Estado para creación de plantilla personalizada
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newTmplTitle, setNewTmplTitle] = useState('');
  const [newTmplDesc, setNewTmplDesc] = useState('');
  const [newTmplBadge, setNewTmplBadge] = useState('Admisión');
  const [columns, setColumns] = useState(['']); // Array de columnas dinámicas
  const [exampleFile, setExampleFile] = useState(null);
  const [isDragActiveExample, setIsDragActiveExample] = useState(false);

  const activeMenu = 'Carga de datos';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handlers para arrastrar archivo de ejemplo
  const handleDragOverExample = (e) => {
    e.preventDefault();
    setIsDragActiveExample(true);
  };

  const handleDragLeaveExample = () => {
    setIsDragActiveExample(false);
  };

  const handleDropExample = (e) => {
    e.preventDefault();
    setIsDragActiveExample(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx')) {
        setExampleFile(file);
      } else {
        alert('Por favor, selecciona un archivo con extensión .xlsx (Excel).');
      }
    }
  };

  const handleExampleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setExampleFile(e.target.files[0]);
    }
  };

  const handleAddColumn = () => {
    setColumns([...columns, '']);
  };

  const handleRemoveColumn = (idx) => {
    const newCols = columns.filter((_, i) => i !== idx);
    setColumns(newCols);
  };

  const handleColumnChange = (idx, value) => {
    const newCols = [...columns];
    newCols[idx] = value;
    setColumns(newCols);
  };

  // Cerrar y limpiar diálogo
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setNewTmplTitle('');
    setNewTmplDesc('');
    setNewTmplBadge('Admisión');
    setColumns(['']);
    setExampleFile(null);
  };

  // Agregar plantilla personalizada interactiva
  const handleCreateTemplate = () => {
    if (newTmplTitle.trim() && newTmplDesc.trim()) {
      const colorMap = {
        'Admisión': '#1E2875',
        'Desarrollo Curricular': '#175696',
        'Educación Continua': '#46D19F',
        'Vinculación con el Medio': '#E27800',
        'Innovación': '#3EC9FF',
      };
      
      const newTemplate = {
        id: Date.now(),
        title: newTmplTitle,
        desc: newTmplDesc,
        badge: newTmplBadge,
        color: colorMap[newTmplBadge] || '#1E2875',
        type: 'Personalizada',
        uses: 0,
      };

      setTemplates([...templates, newTemplate]);
      handleCloseCreateDialog();
    }
  };

  // Filtrado de plantillas
  const filteredTemplates = templates.filter((tmpl) => {
    const matchesCategory = categoryFilter === 'Todas' || tmpl.badge === categoryFilter;
    const matchesType =
      typeFilter === 'Todas las plantillas' ||
      (typeFilter === 'Predefinidas' && tmpl.type === 'Predefinida') ||
      (typeFilter === 'Personalizadas' && tmpl.type === 'Personalizada');
    return matchesCategory && matchesType;
  });

  // Filtrado de archivos históricos
  const filteredArchives = archives.filter((archive) => {
    return (
      archive.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      archive.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
      archive.user.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Simulación de descarga de archivo Excel
  const handleDownload = (filename) => {
    alert(`Iniciando la descarga de: ${filename}`);
  };

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
      
      {/* BARRA DE NAVEGACIÓN SUPERIOR PARA MÓVILES */}
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

      {/* SIDEBAR PERSISTENTE (ESCRITORIO) */}
      <Box sx={styles.sidebar}>
        {sidebarContent}
      </Box>

      {/* SIDEBAR TEMPORAL / DESPLEGABLE (MÓVILES) */}
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

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <Box sx={styles.contentArea}>
        
        {/* Cabecera de la Página */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={styles.panelHeader}>
            <Box sx={styles.panelIconContainer}>
              <FolderIcon />
            </Box>
            <Box>
              <Typography variant="h5" sx={styles.panelTitle}>
                Repositorio de Archivos
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                Gestiona plantillas predefinidas y personalizadas, descarga archivos históricos
              </Typography>
            </Box>
          </Box>

          {/* Breadcrumbs */}
          <Box sx={styles.breadcrumbsContainer}>
            <Typography variant="caption" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/')}>
              Inicio
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '12px', opacity: 0.7 }} />
            <Typography variant="caption" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/carga-datos')}>
              Carga de datos
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '12px', opacity: 0.7 }} />
            <Typography variant="caption" sx={{ color: '#1E2875', fontWeight: 600 }}>
              Repositorio
            </Typography>
          </Box>
        </Box>

        {/* Pestañas de Navegación del Repositorio */}
        <Box sx={styles.tabsContainer}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Plantillas" sx={styles.tabItem} />
            <Tab label="Archivos históricos" sx={styles.tabItem} />
          </Tabs>
        </Box>

        {/* =========================================================================
            PESTAÑA 1: PLANTILLAS
            ========================================================================= */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            
            {/* Filtros y Acción */}
            <Box sx={styles.filterSection}>
              <Box sx={styles.selectGroup}>
                <FormControl size="small">
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    sx={styles.selectInput}
                  >
                    <MenuItem value="Todas">Todas</MenuItem>
                    <MenuItem value="Admisión">Admisión</MenuItem>
                    <MenuItem value="Desarrollo Curricular">Desarrollo Curricular</MenuItem>
                    <MenuItem value="Educación Continua">Educación Continua</MenuItem>
                    <MenuItem value="Vinculación con el Medio">Vinculación con el Medio</MenuItem>
                    <MenuItem value="Innovación">Innovación</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <Select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    sx={styles.selectInput}
                  >
                    <MenuItem value="Todas las plantillas">Todas las plantillas</MenuItem>
                    <MenuItem value="Predefinidas">Predefinidas</MenuItem>
                    <MenuItem value="Personalizadas">Personalizadas</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={styles.actionButton}
                onClick={() => setOpenCreateDialog(true)}
              >
                Crear plantilla personalizada
              </Button>
            </Box>

            {/* Grilla de Tarjetas */}
            <Box sx={styles.templatesGrid}>
              {filteredTemplates.map((tmpl) => (
                <Card key={tmpl.id} sx={styles.templateCard}>
                  <Box sx={styles.templateCardHeader}>
                    <Box sx={styles.templateCardIcon(tmpl.color)}>
                      <DescriptionIcon fontSize="medium" />
                    </Box>
                    <Box>
                      <Typography sx={styles.templateCardTitle}>
                        {tmpl.title}
                      </Typography>
                      <Typography sx={styles.templateCardDesc}>
                        {tmpl.desc}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={styles.templateCardFooter}>
                    <Box sx={styles.badgeRow}>
                      <Box sx={styles.templateBadge(tmpl.color)}>
                        {tmpl.badge}
                      </Box>
                      <Typography sx={styles.predefinedLabel}>
                        {tmpl.type}
                      </Typography>
                    </Box>
                    
                    <Box sx={styles.actionRow}>
                      <Typography sx={styles.usesText}>
                        {tmpl.uses} usos
                      </Typography>
                      <Button
                        startIcon={<DownloadIcon />}
                        sx={styles.downloadButton}
                        onClick={() => handleDownload(`${tmpl.title.replace(/ /g, '_')}_Plantilla.xlsx`)}
                      >
                        Descargar
                      </Button>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* =========================================================================
            PESTAÑA 2: ARCHIVOS HISTÓRICOS
            ========================================================================= */}
        {activeTab === 1 && (
          <Card sx={{ bgcolor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 3, boxShadow: 'none', p: 3 }}>
            
            {/* Cabecera del Listado con Input de Búsqueda */}
            <Box sx={styles.searchContainer}>
              <Typography sx={styles.historicalTitle}>
                Archivos cargados ({filteredArchives.length})
              </Typography>
              
              <TextField
                placeholder="Buscar archivos..."
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={styles.searchInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ color: '#94A3B8' }}>
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Tabla de Archivos Históricos */}
            <TableContainer sx={styles.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={styles.tableHeadCell}>Nombre del archivo</TableCell>
                    <TableCell sx={styles.tableHeadCell}>Plantilla</TableCell>
                    <TableCell sx={styles.tableHeadCell}>Fecha de carga</TableCell>
                    <TableCell sx={styles.tableHeadCell}>Usuario</TableCell>
                    <TableCell sx={styles.tableHeadCell}>Registros</TableCell>
                    <TableCell sx={styles.tableHeadCell}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredArchives.map((archive) => (
                    <TableRow key={archive.id}>
                      <TableCell sx={styles.tableBodyCell}>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownload(archive.name);
                          }}
                          style={{ color: '#10B981', fontWeight: 500, textDecoration: 'none' }}
                          sx={styles.fileLink}
                        >
                          {archive.name}
                        </a>
                      </TableCell>
                      <TableCell sx={styles.tableBodyCell}>{archive.template}</TableCell>
                      <TableCell sx={styles.tableBodyCell}>{archive.date}</TableCell>
                      <TableCell sx={styles.tableBodyCell}>{archive.user}</TableCell>
                      <TableCell sx={styles.tableBodyCell}>{archive.records}</TableCell>
                      <TableCell sx={styles.tableBodyCell}>
                        <Button
                          startIcon={<DownloadIcon />}
                          sx={styles.downloadButton}
                          onClick={() => handleDownload(archive.name)}
                        >
                          Descargar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredArchives.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#94A3B8' }}>
                        No se encontraron archivos cargados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}

      </Box>

      {/* =========================================================================
          DIÁLOGO: CREAR PLANTILLA PERSONALIZADA
          ========================================================================= */}
      <Dialog
        open={openCreateDialog}
        onClose={handleCloseCreateDialog}
        PaperProps={{ sx: styles.createDialogPaper }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ p: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
          <Box>
            <Typography sx={styles.createDialogTitle}>Crear plantilla personalizada</Typography>
            <Typography sx={styles.createDialogSubtitle}>
              Define la estructura de tu plantilla personalizada
            </Typography>
          </Box>
          <IconButton onClick={handleCloseCreateDialog} sx={{ color: '#94A3B8', mt: -1 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 2.5, overflowY: 'visible' }}>
          {/* Nombre de la plantilla */}
          <Box>
            <Typography sx={styles.inputLabelCustom}>Nombre de la plantilla *</Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Ej: Encuesta de satisfacción docente"
              value={newTmplTitle}
              onChange={(e) => setNewTmplTitle(e.target.value)}
              sx={styles.dialogInput}
            />
          </Box>

          {/* Descripción */}
          <Box>
            <Typography sx={styles.inputLabelCustom}>Descripción *</Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Describe qué tipo de datos incluye esta plantilla"
              value={newTmplDesc}
              onChange={(e) => setNewTmplDesc(e.target.value)}
              sx={styles.dialogInput}
            />
          </Box>

          {/* Área institucional */}
          <Box>
            <Typography sx={styles.inputLabelCustom}>Área institucional *</Typography>
            <FormControl fullWidth size="small">
              <Select
                value={newTmplBadge}
                onChange={(e) => setNewTmplBadge(e.target.value)}
                sx={styles.dialogSelect}
              >
                <MenuItem value="Admisión">Admisión</MenuItem>
                <MenuItem value="Desarrollo Curricular">Desarrollo Curricular</MenuItem>
                <MenuItem value="Educación Continua">Educación Continua</MenuItem>
                <MenuItem value="Vinculación con el Medio">Vinculación con el Medio</MenuItem>
                <MenuItem value="Innovación">Innovación</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Columnas del archivo Excel */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={styles.inputLabelCustom} style={{ mb: 0 }}>
                Columnas del archivo Excel *
              </Typography>
              <Button
                startIcon={<AddIcon fontSize="small" />}
                sx={styles.addColumnLink}
                onClick={handleAddColumn}
              >
                Agregar columna
              </Button>
            </Box>

            {columns.map((col, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder={`Nombre de columna ${idx + 1} (ej: RUT, Nombre completo, Carrera)`}
                  value={col}
                  onChange={(e) => handleColumnChange(idx, e.target.value)}
                  sx={styles.dialogInput}
                />
                {columns.length > 1 && (
                  <IconButton onClick={() => handleRemoveColumn(idx)} sx={{ color: '#EF4444', p: 0.5 }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
            <Typography sx={styles.dialogCaptionText}>
              Define las columnas que debe contener el archivo Excel para esta plantilla
            </Typography>
          </Box>

          {/* Subir plantilla de ejemplo */}
          <Box>
            <Typography sx={styles.inputLabelCustom} style={{ mb: 0 }}>
              Subir plantilla de ejemplo (opcional)
            </Typography>
            
            <Box
              onDragOver={handleDragOverExample}
              onDragLeave={handleDragLeaveExample}
              onDrop={handleDropExample}
              sx={styles.dialogDropZone(isDragActiveExample)}
              onClick={() => document.getElementById('example-file-input').click()}
            >
              <input
                type="file"
                id="example-file-input"
                accept=".xlsx"
                style={{ display: 'none' }}
                onChange={handleExampleFileChange}
              />
              
              <DownloadIcon sx={{ fontSize: 36, color: '#94A3B8', transform: 'rotate(180deg)' }} />
              
              {exampleFile ? (
                <Box>
                  <Typography sx={styles.dialogDropZoneTextPrimary} style={{ color: '#10B981' }}>
                    Archivo cargado: {exampleFile.name}
                  </Typography>
                  <Typography sx={styles.dialogDropZoneTextSecondary}>
                    {(exampleFile.size / 1024).toFixed(1)} KB (Listo para asociar)
                  </Typography>
                </Box>
              ) : (
                <>
                  <Typography sx={styles.dialogDropZoneTextPrimary}>
                    Arrastra un archivo Excel o haz clic para seleccionar
                  </Typography>
                  <Typography sx={styles.dialogDropZoneTextSecondary}>
                    Este archivo servirá como plantilla descargable para los usuarios
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 0, mt: 4, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button onClick={handleCloseCreateDialog} sx={styles.dialogCancelBtn}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateTemplate}
            sx={styles.dialogSubmitBtn(
              newTmplTitle.trim() !== '' &&
              newTmplDesc.trim() !== '' &&
              columns.some(c => c.trim() !== '')
            )}
            disabled={
              !newTmplTitle.trim() ||
              !newTmplDesc.trim() ||
              !columns.some(c => c.trim() !== '')
            }
          >
            Crear plantilla
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
