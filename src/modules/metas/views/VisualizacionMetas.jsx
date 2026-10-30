import React from 'react';
import { useVisualizacionMetas } from './VisualizacionMetas.hooks';
import { styles } from './VisualizacionMetas.styles';
import { Header, Sidebar, CentroDeAyuda } from '../../../components';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  CheckCircle as CheckCircleIcon,
  WatchLater as WatchLaterIcon,
  Warning as WarningIcon,
  Adjust as TargetIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  RestartAlt as ResetIcon,
  Lock as LockIcon,
  Drafts as DraftsIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

export const VisualizacionMetas = () => {
  const {
    navigate,
    user,
    canCreateMeta,
    filtersVisible,
    handleToggleFilters,
    handleResetFilters,
    searchQuery,
    setSearchQuery,
    filtroDepartamento,
    setFiltroDepartamento,
    filtroEstado,
    setFiltroEstado,
    filtroDesde,
    setFiltroDesde,
    filtroHasta,
    setFiltroHasta,
    sortField,
    sortDir,
    sortMenuOpen,
    setSortMenuOpen,
    handleSortFieldChange,
    handleToggleSortDir,
    paginaActual,
    setPaginaActual,
    totalPages,
    paginatedMetas,
    totalMetas,
    totalMetasOriginal,
    pageSize,
    fmtFecha,
    diasHasta,
    loading,
    error,
    kpis,
    departmentsList,
    deleteDialogOpen,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleConfirmDelete,
    closeDialogOpen,
    handleOpenCloseDialog,
    handleCloseCloseDialog,
    handleConfirmClose,
    isClosingMeta,
  } = useVisualizacionMetas();

  // Sorting Helper Labels
  const sortLabels = {
    prioridad: 'Prioridad',
    fecha: 'Fecha límite',
    progreso: 'Progreso',
    nombre: 'Nombre',
  };

  return (
    <Box sx={styles.mainLayout}>
      {/* SIDEBAR TRANSVERSAL (Escritorio + Drawer + AppBar Móvil) */}
      <Sidebar />

      {/* Content Area */}
      <Box component="main" sx={styles.contentArea}>
        {/* Cabecera de la Página */}
        <Header
          title="Visualización de Metas"
          subtitle="Gestiona y da seguimiento a las metas institucionales por área"
          icon={<TargetIcon />}
          iconColor="#FFFFFF"
          breadcrumbs={[
            { label: 'Inicio', path: '/' },
            { label: 'Metas', path: null },
          ]}
          sx={{ mb: 4 }}
        />

        {/* KPIs globales (Solo Rectoría) */}
        {user?.role === 'Rector' && (
          <Box sx={styles.kpiRow}>
            {/* Card 1: Total metas */}
            <Box sx={styles.kpiCard}>
              <Box sx={styles.kpiHeader}>
                <Typography sx={styles.kpiLabel}>Total metas</Typography>
                <Box sx={styles.kpiIcon}>
                  <TargetIcon />
                </Box>
              </Box>
              <Typography sx={styles.kpiValue}>{kpis.total}</Typography>
            </Box>

            {/* Card 2: % Cumplimiento institucional */}
            <Box sx={styles.kpiCard}>
              <Box sx={styles.kpiHeader}>
                <Typography sx={styles.kpiLabel}>% Cumplimiento institucional</Typography>
                <Box sx={styles.kpiIcon}>
                  <CheckCircleIcon />
                </Box>
              </Box>
              <Typography sx={styles.kpiValue}>{kpis.cumplimiento}%</Typography>
            </Box>

            {/* Card 3: Metas en riesgo */}
            <Box sx={styles.kpiCard}>
              <Box sx={styles.kpiHeader}>
                <Typography sx={styles.kpiLabel}>Metas en riesgo</Typography>
                <Box sx={styles.kpiIcon}>
                  <WarningIcon />
                </Box>
              </Box>
              <Typography sx={styles.kpiValue}>{kpis.riesgo}</Typography>
            </Box>

            {/* Card 4: Borradores (si existen) */}
            {kpis.borradores > 0 && (
              <Box sx={styles.kpiCard}>
                <Box sx={styles.kpiHeader}>
                  <Typography sx={styles.kpiLabel}>Borradores</Typography>
                  <Box sx={{ ...styles.kpiIcon, bgcolor: 'rgba(245, 158, 11, 0.12)', color: '#d97706' }}>
                    <DraftsIcon />
                  </Box>
                </Box>
                <Typography sx={{ ...styles.kpiValue, color: '#d97706' }}>{kpis.borradores}</Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Toolbar */}
        <Box sx={styles.toolbar}>
          {/* Button "Crear meta" */}
          {canCreateMeta && (
            <Button 
              variant="contained" 
              sx={styles.createMetaBtn}
              onClick={() => navigate('/meta-form')}
            >
              <Box component="span" sx={{ display: 'flex', mr: 0.5, fontSize: '18px', fontWeight: 'bold' }}>+</Box>
              Crear meta
            </Button>
          )}

          {/* Sort Control */}
          <Box sx={styles.sortSelectWrap}>
            <Box 
              component="button" 
              onClick={() => setSortMenuOpen(!sortMenuOpen)}
              sx={styles.sortSelect}
              aria-haspopup="listbox"
              aria-expanded={sortMenuOpen}
            >
              <span style={{ fontWeight: 500 }}>Ordenar por: {sortLabels[sortField]}</span>
              <ExpandMoreIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
            </Box>

            <Box 
              component="button" 
              onClick={handleToggleSortDir}
              sx={styles.sortDirBtn}
              aria-label="Alternar dirección de ordenamiento"
            >
              {sortDir === 'asc' ? (
                <ArrowUpIcon sx={{ fontSize: 18 }} />
              ) : (
                <ArrowDownIcon sx={{ fontSize: 18 }} />
              )}
            </Box>

            {/* Sort Menu Dropdown */}
            {sortMenuOpen && (
              <Box sx={styles.sortMenu} role="listbox">
                {Object.entries(sortLabels).map(([key, label]) => (
                  <Box
                    component="button"
                    key={key}
                    onClick={() => handleSortFieldChange(key)}
                    sx={styles.sortMenuItem(sortField === key)}
                    role="option"
                    aria-selected={sortField === key}
                  >
                    {label}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Search Box */}
          <Box sx={styles.searchBox}>
            <SearchIcon sx={{ color: '#9ca3af', fontSize: 18 }} />
            <Box 
              component="input" 
              type="search"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={styles.searchInput}
              aria-label="Buscar metas"
            />
          </Box>
        </Box>

        {/* Filter Card */}
        <Box sx={styles.filterCard}>
          <Box sx={styles.filterHeader}>
            <Typography variant="h6" sx={styles.filterTitle}>
              <FilterIcon sx={{ fontSize: 18 }} />
              Filtrar por:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Box 
                component="button" 
                onClick={handleResetFilters}
                sx={{
                  bgcolor: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  '&:hover': { bgcolor: '#F1F5F9', color: '#1E2875' }
                }}
              >
                <ResetIcon sx={{ fontSize: 16 }} />
                Limpiar filtros
              </Box>
              <Box 
                component="button" 
                onClick={handleToggleFilters}
                sx={styles.filterToggleBtn}
              >
                {filtersVisible ? 'Ocultar filtros' : 'Mostrar filtros'}
                <ExpandMoreIcon sx={{ fontSize: 16, transform: filtersVisible ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }} />
              </Box>
            </Box>
          </Box>

          {filtersVisible && (
            <Box sx={styles.filterFieldsGrid}>
              {/* Departamento Select */}
              <Box sx={styles.filterField}>
                <Typography component="label" sx={styles.filterLabel} htmlFor="filtro-dept">
                  Departamento
                </Typography>
                <Select
                  id="filtro-dept"
                  value={filtroDepartamento}
                  onChange={(e) => setFiltroDepartamento(e.target.value)}
                  size="small"
                  displayEmpty
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 280,
                        backgroundColor: '#ffffff',
                      },
                      sx: {
                        bgcolor: '#ffffff !important',
                        backgroundColor: '#ffffff !important',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        border: '1px solid #E5E7EB',
                        mt: 0.5,
                        '& .MuiMenuItem-root': {
                          fontSize: '13.5px',
                          color: '#111827 !important',
                          fontWeight: 500,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          py: 1,
                          '&:hover': {
                            bgcolor: '#f3f4f6 !important',
                            color: '#111827 !important',
                          },
                          '&.Mui-selected': {
                            bgcolor: '#e5e7eb !important',
                            color: '#111827 !important',
                            fontWeight: 700,
                            '&:hover': {
                              bgcolor: '#d1d5db !important',
                            },
                          },
                        },
                      },
                    },
                    MenuListProps: {
                      sx: { py: 0.5, bgcolor: '#ffffff !important', backgroundColor: '#ffffff !important' },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                    slotProps: {
                      paper: {
                        sx: {
                          width: (theme) => 'var(--select-width, inherit)',
                        }
                      }
                    }
                  }}
                  sx={{
                    bgcolor: '#ffffff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#111827',
                    height: '38px',
                    border: '1px solid #D1D5DB',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover': {
                      borderColor: '#9CA3AF',
                    },
                    '&.Mui-focused': {
                      borderColor: '#1E2875',
                      boxShadow: '0 0 0 2px rgba(30, 40, 117, 0.15)',
                    },
                    '& .MuiSelect-select': {
                      py: '8px',
                      px: '12px',
                      color: '#111827 !important',
                      fontWeight: 500,
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#6B7280 !important',
                    },
                  }}
                >
                  <MenuItem value="todas" sx={{ color: '#111827 !important', bgcolor: '#ffffff' }}>
                    Todas
                  </MenuItem>
                  {departmentsList.map((dept) => (
                    <MenuItem key={dept.key} value={dept.key} sx={{ color: '#111827 !important', bgcolor: '#ffffff' }}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Estado Select */}
              <Box sx={styles.filterField}>
                <Typography component="label" sx={styles.filterLabel} htmlFor="filtro-estado">
                  Estado
                </Typography>
                <Select
                  id="filtro-estado"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  size="small"
                  displayEmpty
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 280,
                        backgroundColor: '#ffffff',
                      },
                      sx: {
                        bgcolor: '#ffffff !important',
                        backgroundColor: '#ffffff !important',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        border: '1px solid #E5E7EB',
                        mt: 0.5,
                        '& .MuiMenuItem-root': {
                          fontSize: '13.5px',
                          color: '#111827 !important',
                          fontWeight: 500,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          py: 1,
                          '&:hover': {
                            bgcolor: '#f3f4f6 !important',
                            color: '#111827 !important',
                          },
                          '&.Mui-selected': {
                            bgcolor: '#e5e7eb !important',
                            color: '#111827 !important',
                            fontWeight: 700,
                            '&:hover': {
                              bgcolor: '#d1d5db !important',
                            },
                          },
                        },
                      },
                    },
                    MenuListProps: {
                      sx: { py: 0.5, bgcolor: '#ffffff !important', backgroundColor: '#ffffff !important' },
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                    slotProps: {
                      paper: {
                        sx: {
                          width: (theme) => 'var(--select-width, inherit)',
                        }
                      }
                    }
                  }}
                  sx={{
                    bgcolor: '#ffffff',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#111827',
                    height: '38px',
                    border: '1px solid #D1D5DB',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover': {
                      borderColor: '#9CA3AF',
                    },
                    '&.Mui-focused': {
                      borderColor: '#1E2875',
                      boxShadow: '0 0 0 2px rgba(30, 40, 117, 0.15)',
                    },
                    '& .MuiSelect-select': {
                      py: '8px',
                      px: '12px',
                      color: '#111827 !important',
                      fontWeight: 500,
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#6B7280 !important',
                    },
                  }}
                >
                  <MenuItem value="todos" sx={{ color: '#111827 !important', bgcolor: '#ffffff' }}>
                    Todos los estados
                  </MenuItem>
                  <MenuItem value="activa" sx={{ color: '#111827 !important', bgcolor: '#ffffff' }}>
                    Activas
                  </MenuItem>
                  <MenuItem value="borrador" sx={{ color: '#111827 !important', bgcolor: '#ffffff' }}>
                    Borradores
                  </MenuItem>
                  <MenuItem value="cerrada" sx={{ color: '#111827 !important', bgcolor: '#ffffff' }}>
                    Cerradas
                  </MenuItem>
                  <MenuItem value="en-curso" sx={{ color: '#111827 !important', bgcolor: '#ffffff' }}>
                    En progreso
                  </MenuItem>
                  <MenuItem value="completada" sx={{ color: '#111827 !important', bgcolor: '#ffffff' }}>
                    Completada
                  </MenuItem>
                  <MenuItem value="alerta" sx={{ color: '#111827 !important', bgcolor: '#ffffff' }}>
                    Requiere atención
                  </MenuItem>
                </Select>
              </Box>

              {/* Fecha Inicio Input */}
              <Box sx={styles.filterField}>
                <Typography component="label" sx={styles.filterLabel} htmlFor="filtro-desde">
                  Fecha de inicio
                </Typography>
                <Box 
                  component="input" 
                  type="date"
                  id="filtro-desde"
                  value={filtroDesde}
                  onChange={(e) => setFiltroDesde(e.target.value)}
                  sx={styles.filterInput}
                />
              </Box>

              {/* Fecha Límite Input */}
              <Box sx={styles.filterField}>
                <Typography component="label" sx={styles.filterLabel} htmlFor="filtro-hasta">
                  Fecha límite
                </Typography>
                <Box 
                  component="input" 
                  type="date"
                  id="filtro-hasta"
                  value={filtroHasta}
                  onChange={(e) => setFiltroHasta(e.target.value)}
                  sx={styles.filterInput}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Metas List Grid */}
        <Box sx={styles.metasGrid}>
          {loading ? (
            /* Loading State */
            <Box sx={styles.emptyState}>
              <Typography variant="h6" sx={styles.emptyStateTitle}>
                Cargando metas...
              </Typography>
            </Box>
          ) : error ? (
            /* Error State */
            <Box sx={styles.emptyState}>
              <WarningIcon sx={{ fontSize: 48, color: '#ef4444' }} />
              <Typography variant="h6" sx={{ ...styles.emptyStateTitle, color: '#ef4444' }}>
                Error al cargar metas
              </Typography>
              <Typography variant="body2" sx={styles.emptyStateText}>
                {error}
              </Typography>
            </Box>
          ) : paginatedMetas.length === 0 ? (
            /* Empty State */
            <Box sx={styles.emptyState}>
              <TargetIcon sx={{ fontSize: 48, color: '#d1d5db' }} />
              <Typography variant="h6" sx={styles.emptyStateTitle}>
                No se encontraron metas
              </Typography>
              <Typography variant="body2" sx={styles.emptyStateText}>
                Intenta ajustar los filtros o crear una nueva meta
              </Typography>
            </Box>
          ) : (
            /* Meta Cards Map */
            paginatedMetas.map((meta) => {
              const dias = diasHasta(meta.fechaLimite);
              const vence = dias !== null && dias < 15 && meta.progreso < 80;
              
              // Estado labels & icons
              let estadoLabel = 'En progreso';
              let estadoIcon = <WatchLaterIcon sx={{ fontSize: 12 }} />;
              if (meta.estado === 'borrador') {
                estadoLabel = 'Borrador';
                estadoIcon = <DraftsIcon sx={{ fontSize: 12 }} />;
              } else if (meta.estado === 'cerrada') {
                estadoLabel = 'Cerrada';
                estadoIcon = <LockIcon sx={{ fontSize: 12 }} />;
              } else if (meta.estado === 'completada') {
                estadoLabel = 'Completada';
                estadoIcon = <CheckCircleIcon sx={{ fontSize: 12 }} />;
              } else if (meta.estado === 'alerta') {
                estadoLabel = 'Requiere atención';
                estadoIcon = <WarningIcon sx={{ fontSize: 12 }} />;
              }

              // Prioridad labels
              let prioLabel = 'Media';
              if (meta.prioridad === 'alta') prioLabel = 'Alta';
              else if (meta.prioridad === 'baja') prioLabel = 'Baja';

              return (
                <Box 
                  key={meta.id} 
                  sx={styles.metaCard(meta.estado)}
                >
                  <Box sx={styles.metaHeaderGrid}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={styles.metaCardTitle}>
                        {meta.nombre}
                      </Typography>
                      <Typography variant="body2" sx={styles.metaCardArea}>
                        {meta.area}
                      </Typography>
                    </Box>

                    <Box sx={styles.metaHeadRight}>
                      <Box sx={styles.metaBadgesContainer}>
                        <Box sx={styles.estadoBadge(meta.estado)}>
                          {estadoIcon}
                          {estadoLabel}
                        </Box>
                        <Box sx={styles.prioridadBadge(meta.prioridad)}>
                          <span className="dot"></span>
                          {prioLabel}
                        </Box>
                      </Box>

                      {/* Action buttons (CRUD / Lifecycle) */}
                      {(meta.permissions?.canEdit || meta.permissions?.canDelete || meta.isClosed) && (
                        <Box sx={styles.actionBtns}>
                          {meta.permissions?.canEdit && !meta.isClosed && (
                            <Tooltip title={meta.isDraft ? "Continuar edición del borrador" : "Editar meta"}>
                              <Button
                                sx={styles.iconActionBtn('edit')}
                                aria-label={meta.isDraft ? "Continuar edición" : "Editar meta"}
                                onClick={() => navigate(`/meta-form/${meta.id}`)}
                              >
                                <EditIcon sx={{ fontSize: 16 }} />
                              </Button>
                            </Tooltip>
                          )}
                          {meta.permissions?.canEdit && !meta.isDraft && !meta.isClosed && (
                            <Tooltip title="Cerrar meta (finalizar ciclo)">
                              <Button
                                sx={styles.iconActionBtn('close')}
                                aria-label="Cerrar meta"
                                onClick={() => handleOpenCloseDialog(meta.id)}
                              >
                                <LockIcon sx={{ fontSize: 16 }} />
                              </Button>
                            </Tooltip>
                          )}
                          {meta.permissions?.canDelete && !meta.isClosed && (
                            <Tooltip title="Eliminar meta">
                              <Button
                                sx={styles.iconActionBtn('delete')}
                                aria-label="Eliminar meta"
                                onClick={() => handleOpenDeleteDialog(meta.id)}
                              >
                                <DeleteIcon sx={{ fontSize: 16 }} />
                              </Button>
                            </Tooltip>
                          )}
                          {meta.isClosed && (
                            <Tooltip title="Ver detalle de meta cerrada (solo lectura)">
                              <Button
                                sx={styles.iconActionBtn('view')}
                                aria-label="Ver meta"
                                onClick={() => navigate(`/meta-form/${meta.id}`)}
                              >
                                <VisibilityIcon sx={{ fontSize: 16 }} />
                              </Button>
                            </Tooltip>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Progress Section */}
                  {meta.isDraft ? (
                    <Box sx={{
                      my: 2,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: '#fffbeb',
                      border: '1px dashed #fcd34d',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}>
                      <DraftsIcon sx={{ color: '#d97706', fontSize: 20, flexShrink: 0 }} />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#92400e', fontSize: '13px' }}>
                          Meta en modo Borrador
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#b45309', display: 'block', fontSize: '12px' }}>
                          Esta meta no calcula progreso ni es visible en dashboards institucionales hasta que sea publicada.
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={styles.metaProgress}>
                      <Box sx={styles.progressRow}>
                        <Typography variant="body2" sx={styles.progressLabel}>
                          {meta.comportamiento === 'debe-mantenerse-en-rango' ? (
                            <>
                              Progreso: <strong>{meta.actual}{meta.tipoValor === 'percentage' || meta.tipoValor === 'porcentaje' || meta.tipoValor === 'porcentual' ? '%' : ''}</strong> (Rango: {meta.lowerLimit} - {meta.upperLimit}{meta.tipoValor === 'percentage' || meta.tipoValor === 'porcentaje' || meta.tipoValor === 'porcentual' ? '%' : ''})
                            </>
                          ) : (
                            <>
                              Progreso: <strong>{meta.actual}{meta.tipoValor === 'percentage' || meta.tipoValor === 'porcentaje' || meta.tipoValor === 'porcentual' ? '%' : ''}</strong> / {meta.objetivo}{meta.tipoValor === 'percentage' || meta.tipoValor === 'porcentaje' || meta.tipoValor === 'porcentual' ? '%' : ''}
                            </>
                          )}
                        </Typography>
                        <Typography sx={styles.progressPct}>
                          {meta.progreso.toFixed(2)}%
                        </Typography>
                      </Box>
                      
                      <Box sx={styles.progressBarContainer}>
                        <Box sx={styles.progressBarFill(meta.estado, meta.progreso)} />
                      </Box>

                      {vence && (
                        <Box sx={styles.venceLine}>
                          <WatchLaterIcon sx={{ fontSize: 13 }} />
                          <span>Vence en {dias} día{dias === 1 ? '' : 's'}</span>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Footer Info Dates */}
                  <Box sx={styles.cardFoot}>
                    <Box sx={styles.dateItem}>
                      <CalendarIcon sx={{ fontSize: 14 }} />
                      <span>Fecha de inicio: {fmtFecha(meta.inicio)}</span>
                    </Box>
                    <Box sx={styles.dateItem}>
                      <CalendarIcon sx={{ fontSize: 14 }} />
                      <span>Fecha límite: {fmtFecha(meta.fechaLimite)}</span>
                    </Box>
                    {meta.isClosed && meta.closedAt && (
                      <Box sx={styles.dateItem}>
                        <LockIcon sx={{ fontSize: 14, color: '#64748b' }} />
                        <span>Cerrada el: {fmtFecha(meta.closedAt)}</span>
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })
          )}
        </Box>

        {/* Pagination Section */}
        {totalMetas > pageSize && (
          <Box sx={styles.paginationSection}>
            <Box component="ul" sx={styles.paginationList}>
              <li>
                <Button
                  onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                  disabled={paginaActual === 1}
                  sx={styles.paginationBtn(false)}
                  startIcon={<ChevronLeftIcon sx={{ fontSize: 16 }} />}
                >
                  Anterior
                </Button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <li key={pg}>
                  <Button
                    onClick={() => setPaginaActual(pg)}
                    sx={styles.paginationBtn(paginaActual === pg)}
                  >
                    {pg}
                  </Button>
                </li>
              ))}

              <li>
                <Button
                  onClick={() => setPaginaActual(prev => Math.min(totalPages, prev + 1))}
                  disabled={paginaActual === totalPages}
                  sx={styles.paginationBtn(false)}
                  endIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
                >
                  Siguiente
                </Button>
              </li>
            </Box>
          </Box>
        )}

        {/* Counters */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Typography variant="body2" sx={styles.metasCounter}>
            {totalMetas === 0 ? (
              `Mostrando 0 de ${totalMetasOriginal} metas`
            ) : (
              `Mostrando ${Math.min((paginaActual - 1) * pageSize + 1, totalMetas)}-${Math.min(paginaActual * pageSize, totalMetas)} de ${totalMetas} metas`
            )}
          </Typography>
        </Box>
      </Box>

      {/* Centro de Ayuda contextual unificado */}
      <CentroDeAyuda modulo="metas" />

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2, bgcolor: '#ffffff', color: '#111827', textAlign: 'center' } }}
      >
        <DialogTitle sx={{ m: 0, p: 1, display: 'flex', justifyContent: 'flex-end', pb: 0 }}>
          <IconButton onClick={handleCloseDeleteDialog} size="small" sx={{ color: '#6b7280' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3, pt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', mb: 1 }}>
            <WarningIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif" }}>
            ¿Eliminar esta meta?
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}>
            Esta acción es permanente y eliminará todas las métricas y ponderaciones asociadas.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2, width: '100%' }}>
            <Button
              onClick={handleCloseDeleteDialog}
              variant="outlined"
              fullWidth
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600,
                color: '#4b5563',
                borderColor: '#d1d5db',
                fontFamily: "'Inter', sans-serif",
                '&:hover': {
                  bgcolor: '#f3f4f6',
                  borderColor: '#9ca3af',
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#ef4444',
                color: '#ffffff',
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                '&:hover': {
                  bgcolor: '#dc2626',
                }
              }}
            >
              Eliminar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Close Meta Confirmation Dialog */}
      <Dialog 
        open={closeDialogOpen} 
        onClose={handleCloseCloseDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2, bgcolor: '#ffffff', color: '#111827', textAlign: 'center' } }}
      >
        <DialogTitle sx={{ m: 0, p: 1, display: 'flex', justifyContent: 'flex-end', pb: 0 }}>
          <IconButton onClick={handleCloseCloseDialog} size="small" sx={{ color: '#6b7280' }} disabled={isClosingMeta}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3, pt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', mb: 1 }}>
            <LockIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif" }}>
            ¿Cerrar esta meta?
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}>
            Al cerrar la meta se congelará un snapshot histórico de su estado actual. La meta pasará a modo solo lectura y no podrá volver a editarse ni eliminarse.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2, width: '100%' }}>
            <Button
              onClick={handleCloseCloseDialog}
              variant="outlined"
              fullWidth
              disabled={isClosingMeta}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600,
                color: '#4b5563',
                borderColor: '#d1d5db',
                fontFamily: "'Inter', sans-serif",
                '&:hover': {
                  bgcolor: '#f3f4f6',
                  borderColor: '#9ca3af',
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmClose}
              variant="contained"
              fullWidth
              disabled={isClosingMeta}
              sx={{
                bgcolor: '#475569',
                color: '#ffffff',
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                '&:hover': {
                  bgcolor: '#334155',
                }
              }}
            >
              {isClosingMeta ? 'Cerrando...' : 'Confirmar Cierre'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
