import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';

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

export const useRepositorioArchivos = () => {
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
  const [openHelpDialog, setOpenHelpDialog] = useState(false); // Estado para abrir el Centro de Ayuda

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

  return {
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
    templates,
    archives,
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
    setExampleFile,
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
  };
};
