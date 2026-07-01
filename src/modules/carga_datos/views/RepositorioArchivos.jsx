import React from 'react';
import { useRepositorioArchivos } from './RepositorioArchivos.hooks';
import { styles } from './RepositorioArchivos.styles';
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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  UploadFile as CargaIcon,
  Shield as AuditoriaIcon,
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
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

export const RepositorioArchivos = () => {
  const {
    navigate,
    user,
    logout,
    mobileOpen,
    activeTab,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery,
    openHelpDialog,
    setOpenHelpDialog,
    faqData,
    openCreateDialog,
    setOpenCreateDialog,
    newTmplTitle,
    setNewTmplTitle,
    newTmplDesc,
    setNewTmplDesc,
    newTmplBadge,
    setNewTmplBadge,
    columns,
    exampleFile,
    isDragActiveExample,
    activeMenu,
    handleDrawerToggle,
    handleTabChange,
    handleDragOverExample,
    handleDragLeaveExample,
    handleDropExample,
    handleExampleFileChange,
    handleAddColumn,
    handleRemoveColumn,
    handleColumnChange,
    handleCloseCreateDialog,
    handleCreateTemplate,
    filteredTemplates,
    filteredArchives,
    handleDownload,
  } = useRepositorioArchivos();

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
                  handleDrawerToggle();
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
      
      {/* BARRA DE NAVEGACIÓN SUPERIOR PARA MÓVILES */}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, width: '100%' }}>
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
          </Box>

          {/* Breadcrumbs */}
          <Box sx={styles.breadcrumbsContainer}>
            <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/')}>
              Inicio
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7 }} />
            <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/carga-datos')}>
              Carga de datos
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7 }} />
            <Typography variant="body1" sx={{ color: '#1E2875', fontWeight: 600 }}>
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
