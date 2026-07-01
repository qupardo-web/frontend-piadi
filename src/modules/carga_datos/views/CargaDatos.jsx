import React from 'react';
import { useCargaDatos, getTemplateColor } from './CargaDatos.hooks';
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
  Grid,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  UploadFile as CargaIcon,
  Shield as AuditoriaIcon,
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

export const CargaDatos = () => {
  const {
    navigate,
    user,
    logout,
    mobileOpen,
    uploads,
    openUploadDialog,
    setOpenUploadDialog,
    selectedTemplate,
    selectedFile,
    setSelectedFile,
    isDragActive,
    currentPage,
    setCurrentPage,
    openHelpDialog,
    setOpenHelpDialog,
    uploading,
    uploadError,
    uploadErrorDetails,
    uploadSuccess,
    successSummary,
    filteredTemplates,
    faqData,
    activeMenu,
    handleDrawerToggle,
    handleTemplateSelect,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDownloadTemplate,
    handleDrop,
    handleCloseDialog,
    handleUploadSubmit,
  } = useCargaDatos();

  // Paginación lógica simple de cargas (5 por página)
  const itemsPerPage = 5;
  const totalPages = Math.ceil(uploads.length / itemsPerPage) || 1;
  const paginatedUploads = uploads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeTemplateObj = filteredTemplates.find(t => t.id === selectedTemplate);

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
                  handleDrawerToggle(); // Cierra el drawer móvil si se hace click
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
          keepMounted: true, // Optimiza el rendimiento de apertura en móviles.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, border: 'none' },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* =========================================================================
          SECCIÓN 2: ÁREA DE CONTENIDO PRINCIPAL (DERECHA / ABAJO)
          ========================================================================= */}
      <Box sx={styles.contentArea}>
        
        {/* Fila superior: Cabecera con Sesión Activa */}
        <Box sx={styles.headerRow}>
          <Box>
            <Typography variant="h5" sx={styles.panelTitle}>
              Carga de datos
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
              Sube y actualiza los indicadores institucionales mediante archivos de plantilla.
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
        {user?.role !== 'Analista de Calidad' && user?.role !== 'Vicerrectoria de Calidad' && (
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
                      No se registran cargas en el historial local de auditoría.
                    </TableCell>
                  </TableRow>
                )}
                {paginatedUploads.map((row, index) => (
                  <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={styles.tableBodyCell}>{row.fecha}</TableCell>
                    <TableCell sx={styles.tableBodyCell}>{row.usuario}</TableCell>
                    <TableCell sx={styles.tableBodyCell}>{row.plantilla}</TableCell>
                    <TableCell sx={styles.tableBodyCell}>{row.archivo}</TableCell>
                    <TableCell sx={styles.tableBodyCell}>
                      <Box sx={styles.statusBadgeSuccess}>
                        <CheckCircleIcon sx={{ fontSize: 14 }} />
                        Carga exitosa
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Versión responsiva apilada (tarjetas) para dispositivos móviles */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
            {uploads.length === 0 ? (
              <Typography sx={{ textAlign: 'center', color: '#94A3B8', py: 4, fontSize: '14px' }}>
                No se registran cargas en el historial local de auditoría.
              </Typography>
            ) : (
              paginatedUploads.map((row, idx) => (
                <Box key={idx} sx={styles.mobileCardContainer}>
                  <Box sx={styles.mobileCardHeader}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalendarIcon sx={{ fontSize: 18, color: '#64748b' }} />
                      <Typography sx={styles.mobileCardTitle}>{row.fecha}</Typography>
                    </Box>
                    <Box sx={styles.statusBadgeSuccess}>
                      <CheckCircleIcon sx={{ fontSize: 13 }} />
                      Carga exitosa
                    </Box>
                  </Box>
                  <Box sx={styles.mobileCardBody}>
                    <Box sx={styles.mobileCardRow}>
                      <PersonIcon />
                      <Typography sx={styles.mobileCardLabel}>Usuario:</Typography>
                      <Typography sx={styles.mobileCardValue}>{row.usuario}</Typography>
                    </Box>
                    <Box sx={styles.mobileCardRow}>
                      <DescriptionIcon />
                      <Typography sx={styles.mobileCardLabel}>Plantilla:</Typography>
                      <Typography sx={styles.mobileCardValue}>{row.plantilla}</Typography>
                    </Box>
                    <Box sx={styles.mobileCardRow}>
                      <UploadIcon />
                      <Typography sx={styles.mobileCardLabel}>Archivo:</Typography>
                      <Typography sx={styles.mobileCardValue}>{row.archivo}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* Controles de Paginación */}
          <Box sx={styles.paginationRow}>
            <Typography sx={styles.paginationText}>
              Página {currentPage} de {totalPages} ({uploads.length} cargas en total)
            </Typography>
            <Box sx={styles.paginationButtons}>
              <IconButton 
                size="small" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                sx={styles.paginationIconButton}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton 
                size="small"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                sx={styles.paginationIconButton}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>
        </Card>
      </Box>

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

      {/* =========================================================================
          DIÁLOGO MODAL: SELECCIÓN E IMPORTACIÓN DE PLANTILLA DE DATOS
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

        <DialogContent sx={styles.dialogContent}>
          {uploadSuccess ? (
            /* Pantalla de Confirmación de Carga Exitosa */
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
            /* Flujo Estándar de Carga */
            <>
              {/* 1. Selecciona una plantilla */}
              <Typography sx={styles.sectionSubtitleDialog}>1. Selecciona una plantilla</Typography>
              
              <Box sx={styles.templatesGrid}>
                {filteredTemplates.map((template) => {
                  const isSelected = selectedTemplate === template.id;
                  const tmplColor = getTemplateColor(template.role?.name);

                  return (
                    <Box
                      key={template.id}
                      onClick={() => !uploading && handleTemplateSelect(template.id)}
                      sx={[styles.templateCard(isSelected), uploading && { pointerEvents: 'none', opacity: 0.6 }]}
                    >
                      <Box sx={styles.templateCardIcon(tmplColor)}>
                        <DescriptionIcon fontSize="medium" />
                      </Box>
                      <Box sx={{ flexGrow: 1, pr: 4 }}>
                        <Typography sx={styles.templateCardTitle}>
                          {template.name}
                        </Typography>
                        <Typography sx={styles.templateCardDesc}>
                          {template.description}
                        </Typography>
                        <Box sx={styles.templateBadge(tmplColor)}>
                          {template.role?.name || 'General'}
                        </Box>
                      </Box>
                      <IconButton
                        onClick={(e) => handleDownloadTemplate(e, template.id)}
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

              {/* 2. Carga tu archivo */}
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

              {/* Indicador de Progreso en Carga */}
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

              {/* Alertas de error en caso de fallo estructural o celdas vacías */}
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
                    <Box component="ul" sx={{ pl: 2.5, m: 0, color: '#991B1B', fontSize: '13px' }}>
                      {uploadErrorDetails.map((detail, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>
                          <strong>Hoja:</strong> {detail.sheet || 'General'} | 
                          <strong> Celda:</strong> {detail.row ? `Fila ${detail.row}` : ''}{detail.column ? `, Columna ${detail.column}` : ''} | 
                          <strong> Fallo:</strong> {detail.message}
                        </li>
                      ))}
                    </Box>
                  )}
                </Alert>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={styles.dialogActions}>
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
                disabled={!selectedTemplate || !selectedFile || uploading}
                sx={styles.dialogSubmitButton(selectedTemplate && selectedFile && !uploading)}
              >
                Cargar datos
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
