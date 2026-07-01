import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
  const [currentPage, setCurrentPage] = useState(1); // Página inicial 1 por defecto
  const [openHelpDialog, setOpenHelpDialog] = useState(false); // Estado para abrir el Centro de Ayuda
  const [templates, setTemplates] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadErrorDetails, setUploadErrorDetails] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [successSummary, setSuccessSummary] = useState(null);

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
    handleDrawerToggle,
    handleTemplateSelect,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDownloadTemplate,
    handleDrop,
    handleCloseDialog,
    handleUploadSubmit,
  };
};
