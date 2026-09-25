import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { getPlantillaById } from '../../../services/piadiApi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const VCM_ROLE = 'Vinculación Con El Medio';
const VCM_TEMPLATE_NAME = 'Vinculación Con El Medio';
const INTERNAL_ERROR_MESSAGE = 'Error interno, contacte al administrador';

const toPublicText = (value) => (
  typeof value === 'string' || typeof value === 'number' ? String(value) : ''
);

export const normalizeUploadErrorDetail = (detail = {}) => ({
  message: toPublicText(detail.message) || 'El registro contiene un dato inválido.',
  hoja: toPublicText(detail.hoja ?? detail.sheet) || 'General',
  fila: toPublicText(detail.fila ?? detail.row),
  columna: toPublicText(detail.columna ?? detail.column),
  celda: toPublicText(detail.celda ?? detail.cell),
  valor: toPublicText(detail.valor ?? detail.value),
  esperado: toPublicText(detail.esperado ?? detail.expected)
});

const normalizeName = (value) => String(value || '').trim().toLocaleLowerCase('es');

export const isVcmTemplate = (template) => (
  normalizeName(template?.name) === normalizeName(VCM_TEMPLATE_NAME)
);

export const isAdmisionTemplate = (template) => {
  const name = normalizeName(template?.name);
  const roleName = normalizeName(template?.role?.name);
  return name.includes('admisión') || name.includes('admision') || roleName === 'admisión' || roleName === 'admision';
};

export const canViewTemplate = (template, userRole) => {
  if (isVcmTemplate(template)) {
    return [VCM_ROLE, 'Rector'].includes(userRole);
  }

  if (['Rector', 'Administrador', 'Director de Administración'].includes(userRole)) {
    return true;
  }

  return template.role?.name === userRole;
};

export const getTemplateColor = (roleName) => {
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

export const useCargaDatos = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Estados para la carga de datos y diálogo
  const [uploads, setUploads] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openHelpDialog, setOpenHelpDialog] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadErrorDetails, setUploadErrorDetails] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [successSummary, setSuccessSummary] = useState(null);
  const [templateRequirements, setTemplateRequirements] = useState({});

  // Estado para la selección de hojas opcionales de Admisión
  const [admisionSheets, setAdmisionSheets] = useState({
    matricula: true,
    caracterizacion: true
  });

  // Detectar variantes de Admisión en la lista de plantillas cargadas
  const admisionTemplates = templates.filter(t => isAdmisionTemplate(t));
  const admisionCombinada = admisionTemplates.find(t => t.variante === 'combinada' || t.name.toLowerCase().includes('completa')) || admisionTemplates[0];
  const admisionMatricula = admisionTemplates.find(t => t.variante === 'matricula' || t.name.toLowerCase().includes('matrícula') || t.name.toLowerCase().includes('matricula'));
  const admisionCaracterizacion = admisionTemplates.find(t => t.variante === 'caracterizacion' || t.name.toLowerCase().includes('caracterización') || t.name.toLowerCase().includes('caracterizacion'));

  // Carga dinámica de requisitos (hojas y campos) de la plantilla seleccionada desde el backend
  useEffect(() => {
    if (!selectedTemplate) return;
    
    // Determinar ID para buscar requisitos (si es Admisión, siempre cargar requisitos completos de la combinada)
    const currentObj = templates.find(t => t.id === selectedTemplate);
    const isAdm = isAdmisionTemplate(currentObj);
    const targetReqId = isAdm ? (admisionCombinada?.id || selectedTemplate) : selectedTemplate;

    if (templateRequirements[targetReqId]) return;

    getPlantillaById(targetReqId)
      .then(data => {
        if (data && Array.isArray(data.hojas)) {
          setTemplateRequirements(prev => ({
            ...prev,
            [targetReqId]: data
          }));
        }
      })
      .catch(err => {
        console.warn(`No se pudo cargar requisitos para plantilla ${targetReqId}:`, err);
      });
  }, [selectedTemplate, templateRequirements, admisionCombinada, templates]);

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
          id: 4,
          name: 'Admisión',
          description: 'Plantilla para carga completa de estudiantes, matrículas y caracterización de admisión',
          role: { name: 'Admisión' },
          variante: 'combinada'
        },
        {
          id: 3,
          name: 'Innovación',
          description: 'Plantilla para carga de proyectos, financiamiento y secciones de innovación',
          role: { name: 'Innovación' }
        },
        {
          id: 1,
          name: 'Educación Continua',
          description: 'Plantilla para carga de programas de educación continua',
          role: { name: 'Educación Continua' }
        },
        {
          id: 2,
          name: 'Vinculación Con El Medio',
          description: 'Plantilla para carga de convenios, actividades y articulaciones de VCM',
          role: { name: 'Vinculación Con El Medio' }
        }
      ];
      setTemplates(fallbackTemplates);
    };

    fetchTemplates();
  }, []);

  // Carga el historial real de cargas desde auditoría
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

  // Agrupar plantillas para mostrar 1 tarjeta estándar por departamento (Admisión unificada)
  const uniqueDepartmentTemplates = [];
  let admisionAdded = false;

  for (const t of templates) {
    if (isAdmisionTemplate(t)) {
      if (!admisionAdded) {
        admisionAdded = true;
        uniqueDepartmentTemplates.push({
          ...(admisionCombinada || t),
          id: admisionCombinada?.id || t.id,
          name: 'Admisión',
          description: 'Plantilla para carga de matrícula de pregrado y caracterización socioeconómica estudiantil',
          role: { name: 'Admisión' }
        });
      }
    } else {
      uniqueDepartmentTemplates.push(t);
    }
  }

  const filteredTemplates = uniqueDepartmentTemplates.filter((template) => canViewTemplate(template, user?.role));

  // Función para alternar la inclusión de una hoja en Admisión
  const toggleAdmisionSheet = (sheetKey) => {
    setAdmisionSheets(prev => {
      const nextState = { ...prev, [sheetKey]: !prev[sheetKey] };
      // No permitir desmarcar ambas hojas (al menos una debe quedar activa)
      if (!nextState.matricula && !nextState.caracterizacion) {
        return prev;
      }
      return nextState;
    });
  };

  // Determinar el ID efectivo de la plantilla a cargar/descargar según las hojas elegidas
  const getEffectiveTemplateId = () => {
    if (!selectedTemplate) return null;
    const currentObj = templates.find(t => t.id === selectedTemplate);
    if (isAdmisionTemplate(currentObj)) {
      if (admisionSheets.matricula && admisionSheets.caracterizacion) {
        return admisionCombinada?.id || selectedTemplate;
      }
      if (admisionSheets.matricula && !admisionSheets.caracterizacion) {
        return admisionMatricula?.id || admisionCombinada?.id || selectedTemplate;
      }
      if (!admisionSheets.matricula && admisionSheets.caracterizacion) {
        return admisionCaracterizacion?.id || admisionCombinada?.id || selectedTemplate;
      }
    }
    return selectedTemplate;
  };

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

  const activeMenu = 'Carga de datos';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    setSelectedFile(null);
    setUploadError('');
    setUploadErrorDetails([]);
    setAdmisionSheets({ matricula: true, caracterizacion: true });
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
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      const targetId = (selectedTemplate && (templateId === selectedTemplate || templateId === admisionCombinada?.id))
        ? getEffectiveTemplateId()
        : templateId;

      const token = sessionStorage.getItem('auth_token');
      const response = await fetch(`${API_URL}/api/plantillas/${targetId}/descargar`, {
        method: 'GET',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('No se pudo descargar la plantilla desde el servidor');
      }

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

  const handleCloseDialog = () => {
    setOpenUploadDialog(false);
    setSelectedTemplate(null);
    setSelectedFile(null);
    setUploadError('');
    setUploadErrorDetails([]);
    setUploading(false);
    setUploadSuccess(false);
    setSuccessSummary(null);
    setAdmisionSheets({ matricula: true, caracterizacion: true });
  };

  const handleUploadSubmit = async () => {
    if (selectedTemplate && selectedFile) {
      setUploading(true);
      setUploadError('');
      setUploadErrorDetails([]);
      setUploadSuccess(false);
      setSuccessSummary(null);

      const effectiveId = getEffectiveTemplateId();
      const formData = new FormData();
      formData.append('archivo', selectedFile);

      try {
        const token = sessionStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/api/plantillas/${effectiveId}/cargar`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: formData
        });

        let data = {};
        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (response.ok) {
          const templateObj = uniqueDepartmentTemplates.find(t => t.id === selectedTemplate) || templates.find(t => t.id === selectedTemplate);
          const newUpload = {
            fecha: new Date().toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ''),
            usuario: user?.username || user?.name || 'Usuario',
            plantilla: templateObj?.name || 'Admisión',
            archivo: selectedFile.name,
          };
          setUploads([newUpload, ...uploads]);
          setCurrentPage(1);
          
          setSuccessSummary(data.resumen || null);
          setUploadSuccess(true);
        } else {
          if (response.status === 403) {
            setUploadError('No tienes permiso para cargar datos en este departamento');
            return;
          }

          if (response.status >= 500) {
            setUploadError(INTERNAL_ERROR_MESSAGE);
            return;
          }

          setUploadError(
            typeof data.error === 'string'
              ? data.error
              : 'Error en la estructura del archivo.'
          );
          if (Array.isArray(data.errores)) {
            setUploadErrorDetails(data.errores.map(normalizeUploadErrorDetail));
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

  const handleRetryUpload = () => {
    setSelectedFile(null);
    setUploadError('');
    setUploadErrorDetails([]);
    setUploading(false);
  };

  const getSelectedTemplateMetadata = () => {
    if (!selectedTemplate) return null;

    const currentObj = templates.find(t => t.id === selectedTemplate);
    const isAdm = isAdmisionTemplate(currentObj);
    const targetReqId = isAdm ? (admisionCombinada?.id || selectedTemplate) : selectedTemplate;

    const req = templateRequirements[targetReqId];
    if (req && Array.isArray(req.hojas) && req.hojas.length > 0) {
      const hojas = req.hojas.map(h => {
        const nombreLower = h.nombre.toLowerCase();
        const isMatricula = nombreLower.includes('pregrado') || nombreLower.includes('matrícula') || nombreLower.includes('matricula');
        const sheetKey = isMatricula ? 'matricula' : 'caracterizacion';
        return {
          nombre: h.nombre,
          key: sheetKey,
          isAdmision: isAdm,
          isOptional: isAdm,
          enabled: isAdm ? admisionSheets[sheetKey] : true,
          columnas: Array.isArray(h.campos) ? h.campos.map(c => c.columna) : (h.columnas || []),
          descripcion: isMatricula 
            ? 'Registro académico, asignaturas, secciones y datos del estudiante' 
            : 'Perfil socioeconómico, procedencia escolar y asignación de beneficios'
        };
      });

      return {
        isAdmision: isAdm,
        hojas
      };
    }

    return null;
  };

  return {
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
    templates,
    uploading,
    uploadError,
    uploadErrorDetails,
    uploadSuccess,
    successSummary,
    filteredTemplates,
    faqData,
    activeMenu,
    admisionSheets,
    toggleAdmisionSheet,
    handleDrawerToggle,
    handleTemplateSelect,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDownloadTemplate,
    handleDrop,
    handleCloseDialog,
    handleUploadSubmit,
    handleRetryUpload,
    selectedTemplateMetadata: getSelectedTemplateMetadata(),
  };
};
