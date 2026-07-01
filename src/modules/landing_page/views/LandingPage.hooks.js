import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { getDashboardSummary } from '../../../services/piadiApi';

const LANDING_YEAR = 2026;

// Mapeo de colores específicos por departamento.
export const DEPARTMENT_COLORS = {
  0: '#46D19F', // Educación Continua (Turquesa claro)
};

export const useLandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [activeMenu, setActiveMenu] = useState('Inicio');
  
  // Estado para controlar la apertura del menú lateral en móviles
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false); // Estado para abrir el Centro de Ayuda
  const [ecApiData, setEcApiData] = useState(null);

  useEffect(() => {
    getDashboardSummary({ department: 'educacion_continua', year: LANDING_YEAR })
      .then(res => {
        if (!res?.success || !res.data) return;
        // Formato real: data.departments[0].cards[{ indicatorKey, value, hasData }]
        const deptData = res.data?.departments?.find(d => d.departmentId === 'educacion_continua');
        const cards = deptData?.cards ?? [];
        if (!cards.some(c => c.hasData)) return;
        const map = {};
        cards.forEach(c => { map[c.indicatorKey] = c; });
        setEcApiData(map);
      })
      .catch(() => {});
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Solo Educación Continua — Resumen eliminado (sin endpoint real disponible)
  const currentData = (() => {
    const get = (key) => ecApiData?.[key]?.value;
    const oferta = get('oferta_programada');
    const dictados = get('cursos_dictados');
    const ejecucion = get('tasa_ejecucion');
    const matricula = get('matricula_por_programa');
    const aprobacion = get('tasa_aprobacion');
    const ingresos = get('ingresos_generados');
    return {
      year: LANDING_YEAR,
      kpis: [
        { title: 'Oferta programada', value: oferta != null ? String(oferta) : 'Sin datos', trend: '↑', trendDesc: `programas ${LANDING_YEAR}`, isBlue: true, targetHash: 'oferta-programada' },
        { title: 'Cursos dictados', value: dictados != null ? String(dictados) : 'Sin datos', trend: '↑', trendDesc: `ejecutados ${LANDING_YEAR}`, isBlue: false, targetHash: 'cursos-dictados' },
        { title: 'Tasa de ejecución', value: ejecucion != null ? `${ejecucion}%` : 'Sin datos', trend: '↑', trendDesc: 'cursos ejecutados', isBlue: false, targetHash: 'tasa-ejecucion' },
        { title: 'Matrícula total', value: matricula != null ? Number(matricula).toLocaleString('es-CL') : 'Sin datos', trend: '↑', trendDesc: `participantes ${LANDING_YEAR}`, isBlue: true, targetHash: 'matricula-por-programa' },
        { title: 'Tasa de aprobación', value: aprobacion != null ? `${aprobacion}%` : 'Sin datos', trend: '↑', trendDesc: 'aprobados del total', isBlue: false, targetHash: 'tasa-aprobacion' },
        { title: 'Ingresos netos', value: ingresos != null ? `$${Number(ingresos).toLocaleString('es-CL')}` : 'Sin datos', trend: '↑', trendDesc: 'CLP facturados', isBlue: false, targetHash: 'ingresos-generados' },
      ],
      goals: []
    };
  })();
  
  // Obtiene el color de fondo personalizado para este departamento
  const deptColor = DEPARTMENT_COLORS[activeTab] || '#1E2875';

  // Forzamos el color del texto a blanco para todas las tarjetas de color
  const isLight = false;
  const customTextColor = '#ffffff';

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

  return {
    navigate,
    user,
    logout,
    activeTab,
    setActiveTab,
    activeMenu,
    setActiveMenu,
    mobileOpen,
    setMobileOpen,
    openHelpDialog,
    setOpenHelpDialog,
    currentData,
    deptColor,
    isLight,
    customTextColor,
    faqData,
    handleTabChange,
    handleDrawerToggle,
  };
};
