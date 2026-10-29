import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Help as HelpIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';
import { getHelpEntries } from '../services/piadiApi';

/**
 * Mapeo automático de ruta a identificador de módulo técnico del backend.
 */
function inferModuleFromPath(pathname = '') {
  if (pathname.startsWith('/dashboard-admision')) return 'admision';
  if (pathname.startsWith('/dashboard-desarrollo-curricular')) return 'desarrollo_curricular';
  if (pathname.startsWith('/dashboard-educacion-continua')) return 'educacion_continua';
  if (pathname.startsWith('/dashboard-innovacion')) return 'innovacion';
  if (pathname.startsWith('/dashboard-vcm')) return 'vinculacion_medio';
  if (pathname.startsWith('/metas') || pathname.startsWith('/meta-form')) return 'metas';
  if (pathname.startsWith('/carga-datos')) return 'carga_datos';
  if (pathname.startsWith('/repositorio')) return 'repositorio';
  if (pathname.startsWith('/reportes') || pathname.startsWith('/historial-reportes')) return 'reportes';
  if (pathname.startsWith('/auditoria')) return 'auditoria';
  return 'dashboard';
}

const styles = {
  floatingHelpButton: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    bgcolor: '#1E2875',
    color: '#ffffff',
    width: 50,
    height: 50,
    boxShadow: '0 4px 12px rgba(30, 40, 117, 0.2)',
    zIndex: 1000,
    '&:hover': {
      bgcolor: '#141b4f',
    },
  },
  helpDialogPaper: {
    borderRadius: 4,
    p: 3,
    maxWidth: '650px',
    bgcolor: '#FFFFFF',
    color: '#1F2937',
  },
  helpDialogTitle: {
    fontWeight: 700,
    fontSize: '24px',
    color: '#1E2875',
    fontFamily: "'Inter', sans-serif",
  },
  helpDialogSubtitle: {
    color: '#6B7280',
    fontSize: '14px',
    mb: 2,
  },
  helpAccordion: {
    bgcolor: '#ffffff',
    borderBottom: '1px solid #E5E7EB',
    '&:before': {
      display: 'none',
    },
    '& .MuiAccordionSummary-root': {
      px: 1,
      py: 1,
      minHeight: 'auto',
      '&.Mui-expanded': {
        minHeight: 'auto',
      },
    },
    '& .MuiAccordionSummary-content': {
      margin: '8px 0',
      '&.Mui-expanded': {
        margin: '8px 0',
      },
    },
    '& .MuiAccordionDetails-root': {
      px: 1,
      pb: 2.5,
    },
  },
  helpAccordionQuestion: {
    fontWeight: 600,
    fontSize: '15px',
    color: '#1F2937',
    fontFamily: "'Inter', sans-serif",
  },
  helpAccordionAnswer: {
    color: '#475569',
    fontSize: '14px',
    lineHeight: 1.6,
    fontFamily: "'Inter', sans-serif",
    whiteSpace: 'pre-line',
  },
  helpTipContainer: {
    border: '1px solid #1DC2A0',
    bgcolor: '#F0FDF4', // Fondo verde menta suave
    p: 2,
    borderRadius: 3,
    mt: 3,
  },
  helpTipText: {
    color: '#1F2937',
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
  },
};

/**
 * Componente transversal unificado del Centro de Ayuda contextual.
 * Reemplaza los modales duplicados y consulta dinámicamente GET /api/help?modulo=<modulo>.
 */
export const CentroDeAyuda = ({ modulo: propModulo, sxButton = {} }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Resuelve el módulo prioritariamente por prop o inferido de la ruta
  const resolvedModulo = propModulo || inferModuleFromPath(location.pathname);

  useEffect(() => {
    let isMounted = true;

    if (open) {
      setLoading(true);
      setError(null);

      getHelpEntries(resolvedModulo)
        .then((res) => {
          if (!isMounted) return;
          const items = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
          setEntries(items);
        })
        .catch((err) => {
          if (!isMounted) return;
          console.error('[CentroDeAyuda] Error al cargar entradas de ayuda:', err);
          setError(err.message || 'No fue posible cargar las respuestas de ayuda.');
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [open, resolvedModulo]);

  return (
    <>
      {/* Botón flotante '?' */}
      <IconButton
        sx={{ ...styles.floatingHelpButton, ...sxButton }}
        onClick={() => setOpen(true)}
        aria-label="Abrir centro de ayuda"
        title="Centro de ayuda"
      >
        <HelpIcon />
      </IconButton>

      {/* Diálogo emergente modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
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
          <IconButton onClick={() => setOpen(false)} sx={{ color: '#94A3B8', mt: -1 }} aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0, overflowY: 'auto', maxHeight: '60vh' }}>
          {/* Estado: Cargando */}
          {loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 6, gap: 1.5 }}>
              <CircularProgress size={36} sx={{ color: '#1E2875' }} />
              <Typography variant="body2" sx={{ color: '#6B7280', fontFamily: "'Inter', sans-serif" }}>
                Cargando preguntas de ayuda...
              </Typography>
            </Box>
          )}

          {/* Estado: Error */}
          {!loading && error && (
            <Alert severity="warning" sx={{ my: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Estado: Vacío */}
          {!loading && !error && entries.length === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 5, gap: 1 }}>
              <HelpOutlineIcon sx={{ fontSize: 44, color: '#9CA3AF' }} />
              <Typography variant="body2" sx={{ color: '#6B7280', fontFamily: "'Inter', sans-serif", textAlign: 'center' }}>
                No hay preguntas frecuentes disponibles para este módulo.
              </Typography>
            </Box>
          )}

          {/* Estado: Éxito con preguntas */}
          {!loading && !error && entries.length > 0 && (
            entries.map((item, idx) => (
              <Accordion key={item.id || idx} disableGutters elevation={0} sx={styles.helpAccordion}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#6B7280' }} />}>
                  <Typography sx={styles.helpAccordionQuestion}>{item.pregunta}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={styles.helpAccordionAnswer}>{item.respuesta}</Typography>
                </AccordionDetails>
              </Accordion>
            ))
          )}

          {/* Tip de ayuda inferior institucional (fijo) */}
          <Box sx={styles.helpTipContainer}>
            <Typography variant="body2" sx={styles.helpTipText}>
              💡 <strong>Tip:</strong> Puedes acceder a esta ayuda en cualquier momento haciendo clic en el botón "?" en la esquina inferior derecha.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

CentroDeAyuda.propTypes = {
  modulo: PropTypes.string,
  sxButton: PropTypes.object,
};

export default CentroDeAyuda;
