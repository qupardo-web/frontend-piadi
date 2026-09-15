import React from 'react';
import { useMetaEditForm } from './MetaEditForm.hooks';
import { styles } from './MetaForm.styles';
import { Header, Sidebar } from '../../../components';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Adjust as TargetIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as PreviewIcon,
  Save as SaveIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  SwapHoriz as RangeIcon,
} from '@mui/icons-material';

export const MetaEditForm = () => {
  const {
    navigate,
    user,
    modo,
    nombre,
    setNombre,
    departamento,
    setDepartamento,
    comportamiento,
    setComportamiento,
    inicio,
    setInicio,
    limite,
    setLimite,
    prioridad,
    setPrioridad,
    creadaPor,
    metricas,
    errors,
    showSaveAlert,
    setShowSaveAlert,
    metricModalOpen,
    setMetricModalOpen,
    previewModalOpen,
    setPreviewModalOpen,
    editMetricIndex,
    metricSearch,
    setMetricSearch,
    metricNombre,
    setMetricNombre,
    metricDropdownOpen,
    setMetricDropdownOpen,
    metricAporte,
    setMetricAporte,
    metricComportamiento,
    setMetricComportamiento,
    metricValorTipo,
    setMetricValorTipo,
    metricValor,
    setMetricValor,
    metricLowerLimit,
    setMetricLowerLimit,
    metricUpperLimit,
    setMetricUpperLimit,
    metricModalError,
    totalAporte,
    filteredMetricsPool,
    handleOpenAddMetric,
    handleOpenEditMetric,
    handleSaveMetric,
    handleDeleteMetric,
    handleSaveMeta,
    handleOpenPreview,
    departmentsList,
    kpisList,
    showSuccessAlert,
    setShowSuccessAlert,
    successMsg,
    successDesc,
  } = useMetaEditForm();

  // Ref and click outside listener to close autocomplete dropdown
  const comboboxRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
        setMetricDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setMetricDropdownOpen]);

  return (
    <Box sx={styles.mainLayout}>
      {/* SIDEBAR TRANSVERSAL (Escritorio + Drawer + AppBar Móvil) */}
      <Sidebar />

      {/* Main Content Area */}
      <Box component="main" sx={styles.contentArea}>
        {/* Cabecera de la Página */}
        <Header
          title="Editar Meta"
          subtitle="Modifica los parámetros y métricas de la meta seleccionada"
          icon={<TargetIcon />}
          iconColor="#FFFFFF"
          breadcrumbs={[
            { label: 'Inicio', path: '/' },
            { label: 'Metas', path: '/metas' },
            { label: 'Editar Meta', path: null },
          ]}
          sx={{ mb: 4 }}
        />

        {/* Form Container */}
        <Box sx={styles.formCard}>
          {/* General Save Failure Alert */}
          {showSaveAlert && (
            <Box sx={styles.saveAlert}>
              <WarningIcon sx={{ fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                No se pudo guardar la meta. Revisa los campos obligatorios marcados y asegura que las métricas sumen 100%.
              </Typography>
            </Box>
          )}

          {/* Section 1: Detalle de Meta */}
          <Box sx={styles.formSection}>
            <Typography variant="h6" sx={styles.sectionTitle}>
              Detalle de Meta
            </Typography>

            <Box sx={styles.grid2}>
              {/* Meta Name */}
              <Box sx={{ ...styles.field, gridColumn: '1 / -1' }}>
                <Typography component="label" htmlFor="campo-nombre" sx={styles.fieldLabel}>
                  Nombre de la meta <span style={styles.required}>*</span>
                </Typography>
                <Box 
                  component="input" 
                  type="text" 
                  id="campo-nombre" 
                  placeholder="Mas de 3 nuevos convenios..."
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  sx={styles.input(errors.nombre)}
                />
                {errors.nombre && <Typography sx={styles.fieldError}>El nombre es obligatorio</Typography>}
              </Box>

              {/* Department */}
              <Box sx={styles.field}>
                <Typography component="label" htmlFor="campo-departamento" sx={styles.fieldLabel}>
                  Departamento / Dirección <span style={styles.required}>*</span>
                </Typography>
                <Select
                  id="campo-departamento"
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
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
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        border: '1.5px solid #000000',
                        mt: 0.5,
                        '& .MuiMenuItem-root': {
                          fontSize: '13.5px',
                          color: '#000000 !important',
                          fontWeight: 500,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          py: 1,
                          '&:hover': {
                            bgcolor: '#f3f4f6 !important',
                            color: '#000000 !important',
                          },
                          '&.Mui-selected': {
                            bgcolor: '#e5e7eb !important',
                            color: '#000000 !important',
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
                    color: '#000000',
                    height: '42px',
                    border: errors.departamento ? '1px solid #dc2626' : '1px solid #000000',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover': {
                      borderColor: errors.departamento ? '#dc2626' : '#000000',
                    },
                    '&.Mui-focused': {
                      boxShadow: errors.departamento ? '0 0 0 2px rgba(220, 38, 38, 0.2)' : '0 0 0 2px rgba(0, 0, 0, 0.2)',
                    },
                    '& .MuiSelect-select': {
                      py: '10px',
                      px: '12px',
                      color: '#000000 !important',
                      fontWeight: 500,
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#000000 !important',
                    },
                  }}
                >
                  <MenuItem value="" sx={{ color: '#000000 !important', bgcolor: '#ffffff', fontWeight: 500 }}>
                    Selecciona una dirección
                  </MenuItem>
                  {departmentsList.map((dept) => (
                    <MenuItem key={dept.key} value={dept.key} sx={{ color: '#000000 !important', bgcolor: '#ffffff' }}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.departamento && <Typography sx={styles.fieldError}>Selecciona un departamento</Typography>}
              </Box>

              {/* Comportamiento esperado */}
              <Box sx={styles.field}>
                <Typography component="label" htmlFor="campo-comportamiento" sx={styles.fieldLabel}>
                  Comportamiento Esperado <span style={styles.required}>*</span>
                </Typography>
                <Select
                  id="campo-comportamiento"
                  value={comportamiento}
                  onChange={(e) => setComportamiento(e.target.value)}
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
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        border: '1.5px solid #000000',
                        mt: 0.5,
                        '& .MuiMenuItem-root': {
                          fontSize: '13.5px',
                          color: '#000000 !important',
                          fontWeight: 500,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          py: 1,
                          '&:hover': {
                            bgcolor: '#f3f4f6 !important',
                            color: '#000000 !important',
                          },
                          '&.Mui-selected': {
                            bgcolor: '#e5e7eb !important',
                            color: '#000000 !important',
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
                    color: '#000000',
                    height: '42px',
                    border: '1px solid #000000',
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    },
                    '&:hover': {
                      borderColor: '#000000',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.2)',
                    },
                    '& .MuiSelect-select': {
                      py: '10px',
                      px: '12px',
                      color: '#000000 !important',
                      fontWeight: 500,
                    },
                    '& .MuiSvgIcon-root': {
                      color: '#000000 !important',
                    },
                  }}
                >
                  <MenuItem value="no-debe-superar" sx={{ color: '#000000 !important', bgcolor: '#ffffff' }}>
                    No debe superar
                  </MenuItem>
                  <MenuItem value="debe-alcanzar-o-superar" sx={{ color: '#000000 !important', bgcolor: '#ffffff' }}>
                    Debe alcanzar o superar
                  </MenuItem>
                  <MenuItem value="debe-mantenerse-en-rango" sx={{ color: '#000000 !important', bgcolor: '#ffffff' }}>
                    Debe mantenerse en el rango
                  </MenuItem>
                </Select>
              </Box>

              {/* Fecha Inicio */}
              <Box sx={styles.field}>
                <Typography component="label" htmlFor="campo-inicio" sx={styles.fieldLabel}>
                  Fecha de inicio <span style={styles.required}>*</span>
                </Typography>
                <Box 
                  component="input" 
                  type="date" 
                  id="campo-inicio"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  sx={{ ...styles.input(errors.inicio), paddingRight: '12px' }}
                />
                {errors.inicio && <Typography sx={styles.fieldError}>Selecciona la fecha de inicio</Typography>}
              </Box>

              {/* Fecha Límite */}
              <Box sx={styles.field}>
                <Typography component="label" htmlFor="campo-limite" sx={styles.fieldLabel}>
                  Fecha límite <span style={styles.required}>*</span>
                </Typography>
                <Box 
                  component="input" 
                  type="date" 
                  id="campo-limite"
                  value={limite}
                  onChange={(e) => setLimite(e.target.value)}
                  min={inicio || undefined}
                  sx={{ ...styles.input(errors.limite), paddingRight: '12px' }}
                />
                {errors.limite && (
                  <Typography sx={styles.fieldError}>
                    {!limite ? 'Selecciona la fecha límite' : 'La fecha límite no puede ser anterior a la de inicio'}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Prioridad segmented options */}
            <Box sx={{ ...styles.field, mt: 3.5 }}>
              <Typography component="label" sx={styles.fieldLabel}>
                Prioridad <span style={styles.required}>*</span>
              </Typography>
              <Box sx={styles.prioridadSegmented} role="group" aria-label="Prioridad">
                {['alta', 'media', 'baja'].map((prio) => (
                  <Box
                    component="button"
                    type="button"
                    key={prio}
                    onClick={() => setPrioridad(prio)}
                    sx={styles.prioridadChip(prio, prioridad === prio)}
                  >
                    <span className="dot" />
                    {prio === 'alta' ? 'Alta' : prio === 'media' ? 'Media' : 'Baja'}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Section 2: Métricas asociadas */}
          {departamento && (
            <Box sx={styles.formSection}>
              <Box sx={styles.metricasHead}>
                <Typography variant="h6" sx={{ ...styles.sectionTitle, mb: 0 }}>
                  Métricas asociadas
                </Typography>

                {/* Progress Weight Tracker */}
                <Box sx={styles.aporteBlock}>
                  <Box sx={styles.aporteBarWrap}>
                    <Box sx={styles.aporteBar}>
                      <Box sx={styles.aporteBarFill(totalAporte)} />
                    </Box>
                  </Box>
                  <Typography sx={styles.aporteText}>
                    {totalAporte}% asignado
                  </Typography>
                </Box>

                {/* Add Metric Trigger Button */}
                <Box
                  component="button"
                  type="button"
                  onClick={handleOpenAddMetric}
                  sx={styles.btnAnadirMetrica}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                  Añadir métrica
                </Box>
              </Box>

              {/* Metrics Warning */}
              {metricas.length === 0 && (
                <Box sx={styles.metricasWarn}>
                  <InfoIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Agrega al menos una métrica y asegura que sumen 100% (Actual: {totalAporte}%)
                  </Typography>
                </Box>
              )}

              {/* Render metrics table if metricas count > 0 */}
              {metricas.length > 0 ? (
                <Box sx={styles.tableContainer}>
                  <Box component="table" sx={{ width: '100%', minWidth: 580, borderCollapse: 'collapse' }}>
                    <Box component="thead">
                      <Box component="tr">
                        <Box component="th" sx={{ ...styles.th, whiteSpace: 'nowrap' }}>Nombre métrica</Box>
                        <Box component="th" sx={{ ...styles.th, whiteSpace: 'nowrap' }}>Aporte a meta</Box>
                        <Box component="th" sx={{ ...styles.th, whiteSpace: 'nowrap' }}>Comportamiento</Box>
                        <Box component="th" sx={{ ...styles.th, whiteSpace: 'nowrap' }}>Valor esperado</Box>
                        <Box component="th" sx={{ ...styles.th, textAlign: 'right', whiteSpace: 'nowrap' }}>Acciones</Box>
                      </Box>
                    </Box>
                    <Box component="tbody">
                      {metricas.map((m, index) => (
                        <Box component="tr" key={m.id} sx={{ borderBottom: '1px solid #e5e7eb', '&:last-child': { borderBottom: 'none' } }}>
                          <Box component="td" sx={{ ...styles.td, fontWeight: 500 }}>
                            {kpisList.find(k => k.key === m.key)?.name || m.nombre || m.key}
                          </Box>
                          <Box component="td" sx={styles.td}>
                            <Box sx={styles.badge('aporte')}>{m.aporte}%</Box>
                          </Box>
                          <Box component="td" sx={styles.td}>
                            {m.comportamiento === 'debe-superar' ? (
                              <Box sx={styles.badge('sup')}>Debe superar</Box>
                            ) : m.comportamiento === 'debe-mantenerse-en-rango' ? (
                              <Box sx={styles.badge('rango')}>En Rango</Box>
                            ) : (
                              <Box sx={styles.badge('nosup')}>No debe superar</Box>
                            )}
                          </Box>
                          <Box component="td" sx={styles.td}>
                            {m.comportamiento === 'debe-mantenerse-en-rango' ? (
                              `${m.lowerLimit} - ${m.upperLimit}${m.tipoValor === 'porcentual' || m.tipoValor === 'porcentaje' ? '%' : ''}`
                            ) : (
                              `${m.valor}${m.tipoValor === 'porcentual' || m.tipoValor === 'porcentaje' ? '%' : ''}`
                            )}
                          </Box>
                          <Box component="td" sx={{ ...styles.td, textAlign: 'right' }}>
                            <Box sx={styles.actionBtns}>
                              <IconButton 
                                onClick={() => handleOpenEditMetric(index)}
                                sx={{ color: '#0F4AFF', '&:hover': { bgcolor: '#eff6ff' } }}
                                size="small"
                              >
                                <EditIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton 
                                onClick={() => handleDeleteMetric(index)}
                                sx={{ color: '#EF4444', '&:hover': { bgcolor: '#fef2f2' } }}
                                size="small"
                              >
                                <DeleteIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              ) : (
                /* Empty Table State */
                <Box sx={styles.emptyState}>
                  <TargetIcon sx={{ fontSize: 32 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    No hay métricas asociadas
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {/* Section 3: Auditoría */}
          {creadaPor && (
            <Box sx={styles.formSection}>
              <Typography variant="h6" sx={styles.sectionTitle}>
                Auditoría
              </Typography>
              <Box sx={styles.grid2}>
                <Box sx={styles.field}>
                  <Typography component="label" htmlFor="campo-creada" sx={styles.fieldLabel}>
                    Creada por
                  </Typography>
                  <Box 
                    component="input" 
                    type="text" 
                    id="campo-creada"
                    value={creadaPor}
                    readOnly
                    sx={{ ...styles.input(false), bgcolor: '#f9fafb', color: '#64748b', cursor: 'not-allowed' }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* Form Action Buttons */}
          <Box sx={styles.formActions}>
            <Box 
              component="button" 
              onClick={() => navigate('/metas')}
              sx={styles.btnCancelar}
            >
              Cancelar
            </Box>
            <Box 
              component="button" 
              onClick={handleOpenPreview}
              sx={styles.btnPreview}
            >
              <PreviewIcon sx={{ fontSize: 16 }} />
              Vista previa
            </Box>
            <Box 
              component="button" 
              onClick={handleSaveMeta}
              sx={styles.btnGuardar}
            >
              <SaveIcon sx={{ fontSize: 16 }} />
              Guardar meta
            </Box>
          </Box>
        </Box>
      </Box>

      {/* =========================================================================
          MODAL: AÑADIR / EDITAR MÉTRICA
          ========================================================================= */}
      <Dialog 
        open={metricModalOpen} 
        onClose={() => setMetricModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: '#ffffff', color: '#111827', border: '1px solid #e5e7eb' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, py: 2 }}>
          {editMetricIndex !== null ? 'Editar métrica' : 'Añadir métrica'}
          <IconButton onClick={() => setMetricModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pb: 3 }}>
          {/* Autocomplete Metric Search */}
          <Box ref={comboboxRef} sx={styles.combobox}>
            <Typography component="label" sx={styles.fieldLabel}>
              Nombre de la métrica <span style={styles.required}>*</span>
            </Typography>
            <Box sx={styles.searchWrap}>
              <SearchIcon sx={{ color: '#9ca3af' }} />
              <Box 
                component="input"
                type="text"
                placeholder="Buscar métrica..."
                value={metricSearch}
                onFocus={() => setMetricDropdownOpen(true)}
                onChange={(e) => {
                  setMetricSearch(e.target.value);
                  setMetricDropdownOpen(true);
                }}
                sx={{ border: 'none', outline: 'none', flex: 1, fontSize: '14px', bgcolor: 'transparent' }}
              />
            </Box>

            {/* Dropdown Options */}
            {metricDropdownOpen && (
              <Box sx={styles.dropdownList}>
                <Typography sx={styles.dropdownCount}>
                  {filteredMetricsPool.length} métricas disponibles
                </Typography>
                {filteredMetricsPool.map((item) => (
                  <Box
                    key={item}
                    onClick={() => {
                      setMetricNombre(item);
                      setMetricSearch(item);
                      setMetricDropdownOpen(false);
                    }}
                    sx={styles.dropdownItem(metricNombre === item)}
                  >
                    {item}
                    {metricNombre === item && <CheckIcon sx={{ fontSize: 16, color: '#0F4AFF' }} />}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Metric Aporte */}
          <Box sx={styles.field}>
            <Typography component="label" htmlFor="metric-aporte-input" sx={styles.fieldLabel}>
              Aporte porcentual a la meta <span style={styles.required}>*</span>
            </Typography>
            <Box sx={styles.inputWithIcon}>
              <Box 
                component="input"
                type="number"
                id="metric-aporte-input"
                min="1"
                max="100"
                placeholder="Máx. 100%"
                value={metricAporte}
                onChange={(e) => setMetricAporte(e.target.value)}
                sx={styles.input(false)}
              />
              <span style={styles.inputSuffix}>%</span>
            </Box>
          </Box>

          {/* Comportamiento esperado toggle */}
          <Box sx={styles.field}>
            <Typography component="label" sx={styles.fieldLabel}>
              Comportamiento esperado <span style={styles.required}>*</span>
            </Typography>
            <Box sx={styles.compToggle} role="group" aria-label="Comportamiento">
              <Box
                component="button"
                type="button"
                onClick={() => setMetricComportamiento('debe-superar')}
                sx={styles.compBtn(metricComportamiento === 'debe-superar', 'debe-superar')}
              >
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                Debe superar
              </Box>
              <Box
                component="button"
                type="button"
                onClick={() => setMetricComportamiento('no-debe-superar')}
                sx={styles.compBtn(metricComportamiento === 'no-debe-superar', 'no-debe-superar')}
              >
                <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5 }} />
                No debe superar
              </Box>
              <Box
                component="button"
                type="button"
                onClick={() => setMetricComportamiento('debe-mantenerse-en-rango')}
                sx={styles.compBtn(metricComportamiento === 'debe-mantenerse-en-rango', 'debe-mantenerse-en-rango')}
              >
                <RangeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                En Rango
              </Box>
            </Box>
          </Box>

          {/* Expected Value or Limits Rango */}
          {metricComportamiento !== 'debe-mantenerse-en-rango' ? (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography component="label" sx={styles.fieldLabel}>
                  Tipo de valor <span style={styles.required}>*</span>
                </Typography>
                <Box sx={{ ...styles.valorTipo, display: 'flex', mt: 0.5, width: { xs: '100%', sm: 'fit-content' } }} role="group" aria-label="Tipo de valor">
                  <Box 
                    component="button"
                    type="button"
                    onClick={() => setMetricValorTipo('numerico')}
                    sx={{ ...styles.valorTipoBtn(metricValorTipo === 'numerico'), flex: { xs: 1, sm: 'none' }, textAlign: 'center' }}
                  >
                    Numérico
                  </Box>
                  <Box 
                    component="button"
                    type="button"
                    onClick={() => setMetricValorTipo('porcentaje')}
                    sx={{ ...styles.valorTipoBtn(metricValorTipo === 'porcentaje'), flex: { xs: 1, sm: 'none' }, textAlign: 'center' }}
                  >
                    Porcentaje
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Typography component="label" htmlFor="metric-valor-input" sx={styles.fieldLabel}>
                  Valor esperado <span style={styles.required}>*</span>
                </Typography>
                <Box sx={{ ...styles.inputWithIcon, mt: 0.5 }}>
                  <Box 
                    component="input"
                    type="number"
                    id="metric-valor-input"
                    placeholder="Ej: 100"
                    value={metricValor}
                    onChange={(e) => setMetricValor(e.target.value)}
                    sx={styles.input(false)}
                  />
                  <span style={styles.inputSuffix}>{metricValorTipo === 'porcentaje' ? '%' : '#'}</span>
                </Box>
              </Box>
            </Box>
          ) : (
            /* New Range Design */
            <>
              {/* Tipo de valor toggle */}
              <Box sx={styles.field}>
                <Typography component="label" sx={styles.fieldLabel}>
                  Tipo de valor <span style={styles.required}>*</span>
                </Typography>
                <Box sx={{ ...styles.valorTipo, display: 'inline-flex', mt: 0.5 }} role="group" aria-label="Tipo de valor">
                  <Box 
                    component="button"
                    type="button"
                    onClick={() => setMetricValorTipo('numerico')}
                    sx={styles.valorTipoBtn(metricValorTipo === 'numerico')}
                  >
                    Numérico
                  </Box>
                  <Box 
                    component="button"
                    type="button"
                    onClick={() => setMetricValorTipo('porcentaje')}
                    sx={styles.valorTipoBtn(metricValorTipo === 'porcentaje')}
                  >
                    Porcentaje
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Box sx={{ ...styles.field, flex: 1 }}>
                  <Typography component="label" htmlFor="metric-lower-input" sx={styles.fieldLabel}>
                    Límite inferior <span style={styles.required}>*</span>
                  </Typography>
                  <Box sx={{ ...styles.inputWithIcon, width: '100%' }}>
                    <Box 
                      component="input"
                      type="number"
                      id="metric-lower-input"
                      placeholder="Mínimo"
                      value={metricLowerLimit}
                      onChange={(e) => setMetricLowerLimit(e.target.value)}
                      sx={styles.input(false)}
                    />
                    <span style={styles.inputSuffix}>{metricValorTipo === 'porcentaje' ? '%' : '#'}</span>
                  </Box>
                </Box>
                <Box sx={{ ...styles.field, flex: 1 }}>
                  <Typography component="label" htmlFor="metric-upper-input" sx={styles.fieldLabel}>
                    Límite superior <span style={styles.required}>*</span>
                  </Typography>
                  <Box sx={{ ...styles.inputWithIcon, width: '100%' }}>
                    <Box 
                      component="input"
                      type="number"
                      id="metric-upper-input"
                      placeholder="Máximo"
                      value={metricUpperLimit}
                      onChange={(e) => setMetricUpperLimit(e.target.value)}
                      sx={styles.input(false)}
                    />
                    <span style={styles.inputSuffix}>{metricValorTipo === 'porcentaje' ? '%' : '#'}</span>
                  </Box>
                </Box>
              </Box>
            </>
          )}

          {metricModalError && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', color: '#ef4444', mt: 1 }}>
              <WarningIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 600 }}>{metricModalError}</Typography>
            </Box>
          )}

          <Box sx={{ 
            display: 'flex', 
            justifyContent: { xs: 'center', sm: 'flex-end' }, 
            alignItems: 'center',
            gap: 1.5, 
            mt: 2,
            width: '100%',
            flexWrap: 'wrap',
          }}>
            <Box
              component="button"
              type="button"
              onClick={() => setMetricModalOpen(false)}
              sx={{
                ...styles.btnCancelar,
                flex: { xs: '1 1 120px', sm: 'none' },
                justifyContent: 'center',
              }}
            >
              <CloseIcon sx={{ fontSize: 16, mr: 0.5 }} />
              Cancelar
            </Box>
            <Box
              component="button"
              type="button"
              onClick={handleSaveMetric}
              sx={{
                ...styles.btnGuardar,
                flex: { xs: '1 1 140px', sm: 'none' },
                justifyContent: 'center',
              }}
            >
              <AddIcon sx={{ fontSize: 16, mr: 0.5 }} />
              {editMetricIndex !== null ? 'Guardar métrica' : 'Añadir métrica'}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* =========================================================================
          MODAL: VISTA PREVIA DE META
          ========================================================================= */}
      {/* Dialog Vista Previa */}
      <Dialog 
        open={previewModalOpen} 
        onClose={() => setPreviewModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 2, bgcolor: '#ffffff', color: '#111827', border: '1px solid #e5e7eb' } }}
      >
        <DialogTitle sx={{ fontWeight: 700, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Resumen de la meta
          <IconButton onClick={() => setPreviewModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 3 }}>
          <Box sx={styles.prevSummary}>
            <Box sx={styles.prevGrid}>
              <Box>
                <Typography sx={styles.prevLabel}>Nombre de la meta</Typography>
                <Typography sx={styles.prevVal}>{nombre}</Typography>
              </Box>
              <Box>
                <Typography sx={styles.prevLabel}>Dirección / Depto</Typography>
                <Typography sx={styles.prevVal}>
                  {departmentsList.find(d => d.key === departamento)?.name || departamento}
                </Typography>
              </Box>
              <Box>
                <Typography sx={styles.prevLabel}>Comportamiento esperado</Typography>
                <Typography sx={styles.prevVal}>
                  {comportamiento === 'no-debe-superar' ? 'No debe superar' : comportamiento === 'debe-alcanzar-o-superar' ? 'Debe alcanzar o superar' : comportamiento === 'debe-mantenerse-en-rango' ? 'Debe mantenerse en rango' : 'Debe reducirse'}
                </Typography>
              </Box>
              <Box>
                <Typography sx={styles.prevLabel}>Prioridad</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Box sx={styles.prioridadBadge(prioridad, true)}>
                    <span className="dot" />
                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{prioridad}</span>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Typography sx={styles.prevLabel}>Fecha Inicio</Typography>
                <Typography sx={styles.prevVal}>{inicio}</Typography>
              </Box>
              <Box>
                <Typography sx={styles.prevLabel}>Fecha Límite</Typography>
                <Typography sx={styles.prevVal}>{limite}</Typography>
              </Box>
            </Box>

            <Divider />

            <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>
              Métricas Asociadas
            </Typography>

            <Box sx={styles.tableContainer}>
              <Box component="table" sx={{ width: '100%', minWidth: 500, borderCollapse: 'collapse' }}>
                <Box component="thead">
                  <Box component="tr">
                    <Box component="th" sx={{ ...styles.th, whiteSpace: 'nowrap' }}>Nombre métrica</Box>
                    <Box component="th" sx={{ ...styles.th, whiteSpace: 'nowrap' }}>Aporte</Box>
                    <Box component="th" sx={{ ...styles.th, whiteSpace: 'nowrap' }}>Comportamiento</Box>
                    <Box component="th" sx={{ ...styles.th, whiteSpace: 'nowrap' }}>Esperado</Box>
                    <Box component="th" sx={{ ...styles.th, whiteSpace: 'nowrap' }}>Estado</Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {metricas.map((m) => {
                    const total = totalAporte;
                    const estado = total === 100 ? 'ok' : total < 100 ? 'incompleta' : 'excede';
                    const estadoLabel = total === 100 ? '100%' : total < 100 ? '<100% incompleta' : '>100% excede';
                    
                    return (
                      <Box component="tr" key={m.id} sx={{ borderBottom: '1px solid #e5e7eb', '&:last-child': { borderBottom: 'none' } }}>
                        <Box component="td" sx={styles.td}>
                          {kpisList.find(k => k.key === m.key)?.name || m.nombre || m.key}
                        </Box>
                        <Box component="td" sx={styles.td}>{m.aporte}%</Box>
                        <Box component="td" sx={styles.td}>
                          {m.comportamiento === 'debe-superar' ? 'Debe superar' : m.comportamiento === 'debe-mantenerse-en-rango' ? 'En Rango' : 'No debe superar'}
                        </Box>
                        <Box component="td" sx={styles.td}>
                          {m.comportamiento === 'debe-mantenerse-en-rango' ? (
                            `${m.lowerLimit} - ${m.upperLimit}${m.tipoValor === 'porcentaje' || m.tipoValor === 'porcentual' ? '%' : ''}`
                          ) : (
                            `${m.valor}${m.tipoValor === 'porcentaje' || m.tipoValor === 'porcentual' ? '%' : ''}`
                          )}
                        </Box>
                        <Box component="td" sx={styles.td}>
                          <Box sx={styles.badge(estado)}>{estadoLabel}</Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 1 }}>
            <Box
              component="button"
              type="button"
              onClick={() => setPreviewModalOpen(false)}
              sx={styles.btnCancelar}
            >
              Volver a editar
            </Box>
            <Box
              component="button"
              type="button"
              onClick={() => {
                setPreviewModalOpen(false);
                handleSaveMeta();
              }}
              sx={styles.btnGuardar}
            >
              Confirmar y guardar
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Floating Success Alert Dialog */}
      <Dialog 
        open={showSuccessAlert} 
        onClose={() => { setShowSuccessAlert(false); navigate('/metas'); }}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 2, bgcolor: '#ffffff', color: '#111827', textAlign: 'center' } }}
      >
        <DialogTitle sx={{ m: 0, p: 1, display: 'flex', justifyContent: 'flex-end', pb: 0 }}>
          <IconButton onClick={() => { setShowSuccessAlert(false); navigate('/metas'); }} size="small" sx={{ color: '#6b7280' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3, pt: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22c55e', mb: 1 }}>
            <CheckIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', fontFamily: "'Inter', sans-serif" }}>
            {successMsg}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}>
            {successDesc || 'La meta se ha editado correctamente.'}
          </Typography>
          <Button
            onClick={() => { setShowSuccessAlert(false); navigate('/metas'); }}
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: '#1DC2A0',
              color: '#ffffff',
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 600,
              px: 4,
              py: 1,
              fontFamily: "'Inter', sans-serif",
              '&:hover': {
                bgcolor: '#179e82',
              }
            }}
          >
            Entendido
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
