import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { getDashboardSummary, getDepartmentFilters, getMetas } from '../../../services/piadiApi';

// Mapeo de colores específicos por departamento.
export const DEPARTMENT_COLORS = {
  educacion_continua: '#46D19F',
  vinculacion_medio: '#E27800',
};

export const useLandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [activeMenu, setActiveMenu] = useState('Inicio');
  
  // Estado para controlar la apertura del menú lateral en móviles
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false); // Estado para abrir el Centro de Ayuda
  const [departments, setDepartments] = useState([]);
  const [prevYearDepartments, setPrevYearDepartments] = useState([]);
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [deptYearsMap, setDeptYearsMap] = useState({
    educacion_continua: [],
    vinculacion_medio: []
  });
  const [allMetas, setAllMetas] = useState([]);

  // 1. Initial fetch: Load departments, filters and metas on mount
  useEffect(() => {
    getDashboardSummary()
      .then(res => {
        if (res?.success && res.data) {
          const filtered = (res.data.departments ?? []).filter(d => 
            d.departmentId === 'educacion_continua' || d.departmentId === 'vinculacion_medio' ||
            d.key === 'educacion_continua' || d.key === 'vinculacion_medio'
          );
          setDepartments(filtered);
        }
      })
      .catch(() => {});

    Promise.all([
      getDepartmentFilters('educacion_continua').catch(() => null),
      getDepartmentFilters('vinculacion_medio').catch(() => null)
    ])
      .then(([resEc, resVcm]) => {
        const ecYears = resEc?.success ? (resEc.data?.filters?.years ?? []) : [];
        const vcmYears = resVcm?.success ? (resVcm.data?.filters?.years ?? []) : [];
        setDeptYearsMap({
          educacion_continua: ecYears.map(Number),
          vinculacion_medio: vcmYears.map(Number)
        });
      })
      .catch(() => {});

    getMetas()
      .then(res => {
        if (res?.success && Array.isArray(res.data)) {
          const mapped = res.data.map(m => {
            let estado = 'progreso';
            if (m.status === 'cumplida') estado = 'completada';
            else if (m.status === 'en_riesgo' || m.status === 'no_cumplida') estado = 'atencion';

            const actual = m.metrics?.[0]?.currentValue !== undefined ? Number(m.metrics[0].currentValue) : 0;
            const objetivo = Number(m.valorMeta || m.metrics?.[0]?.targetValue || 0);

            return {
              id: m.id,
              name: m.nombre || 'Meta',
              estado: estado,
              pct: Number(m.totalProgress || 0),
              prioridad: m.prioridad || 'media',
              actual: actual,
              objetivo: objetivo,
              inicio: m.fechaInicio || m.inicio || '',
              limite: m.fechaLimite || m.limite || '',
              departmentId: m.departmentId
            };
          });
          setAllMetas(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const currentDeptId = departments[activeTab]?.departmentId;

  // 2. Compute activeYear based on current department's available years
  useEffect(() => {
    if (!currentDeptId) return;
    const availableYears = deptYearsMap[currentDeptId] || [];
    const latestYear = availableYears.length > 0 ? Math.max(...availableYears) : new Date().getFullYear();
    setActiveYear(latestYear);
  }, [currentDeptId, deptYearsMap]);

  // 3. Fetch summaries whenever activeYear changes
  useEffect(() => {
    if (!activeYear) return;
    Promise.all([
      getDashboardSummary({ year: activeYear }).catch(() => null),
      getDashboardSummary({ year: activeYear - 1 }).catch(() => null)
    ])
      .then(([resActive, resPrev]) => {
        if (resActive?.success && resActive.data) {
          const filteredActive = (resActive.data.departments ?? []).filter(d => 
            d.departmentId === 'educacion_continua' || d.departmentId === 'vinculacion_medio' ||
            d.key === 'educacion_continua' || d.key === 'vinculacion_medio'
          );
          setDepartments(filteredActive);
        }
        if (resPrev?.success && resPrev.data) {
          const filteredPrev = (resPrev.data.departments ?? []).filter(d => 
            d.departmentId === 'educacion_continua' || d.departmentId === 'vinculacion_medio' ||
            d.key === 'educacion_continua' || d.key === 'vinculacion_medio'
          );
          setPrevYearDepartments(filteredPrev);
        }
      })
      .catch(() => {});
  }, [activeYear]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const currentDepartment = departments[activeTab];

  const currentData = useMemo(() => {
    const prevDepartment = prevYearDepartments.find(d => d.departmentId === currentDepartment?.departmentId);

    const kpiFilterConfig = {
      educacion_continua: [
        { key: 'oferta_programada', label: 'Oferta programada', targetHash: 'oferta-programada' },
        { key: 'cursos_dictados', label: 'Cursos dictados', targetHash: 'cursos-dictados' },
        { key: 'matricula_por_programa', label: 'Matrícula total', targetHash: 'matricula-por-programa' },
        { key: 'ingresos_generados', label: 'Ingresos netos', targetHash: 'ingresos-generados' }
      ],
      vinculacion_medio: [
        { key: 'convenios_activos', label: 'Total de convenios vigentes', targetHash: 'convenios_vigentes' },
        { key: 'total_convenios', label: 'Nuevos convenios firmados', targetHash: 'nuevos_convenios' },
        { key: 'participaciones', label: 'Total de participantes VcM', targetHash: 'total_participantes' }
      ]
    };

    const currentDeptKpis = kpiFilterConfig[currentDepartment?.departmentId] || [];

    const mappedKpis = currentDeptKpis.map((kpiConfig, index) => {
      const cardActiveYear = (currentDepartment?.cards ?? []).find(c => c.indicatorKey === kpiConfig.key);
      const cardPrevYear = (prevDepartment?.cards ?? []).find(c => c.indicatorKey === kpiConfig.key);

      const valActiveYear = cardActiveYear?.value;
      const valPrevYear = cardPrevYear?.value;

      let trend = '';
      let trendDesc = '';

      if (cardActiveYear?.hasData) {
        if (cardPrevYear?.hasData && valPrevYear && valPrevYear !== 0) {
          const diff = ((valActiveYear - valPrevYear) / valPrevYear) * 100;
          trend = `${diff >= 0 ? '+' : ''}${Math.round(diff)}%`;
          const prevValFmt = cardPrevYear.formattedValue ?? cardPrevYear.value;
          const prevYearLabel = activeYear - 1;
          trendDesc = `vs año anterior (${prevYearLabel}): ${prevValFmt}`;
        } else {
          trendDesc = 'Sin datos del año anterior';
        }
      } else {
        if (cardPrevYear?.hasData) {
          trendDesc = `Año anterior: ${cardPrevYear.formattedValue ?? cardPrevYear.value}`;
        } else {
          trendDesc = cardActiveYear?.unit || '';
        }
      }

      return {
        title: kpiConfig.label,
        value: cardActiveYear?.hasData
          ? (cardActiveYear.formattedValue ?? cardActiveYear.value)
          : 'No hay datos cargados',
        trend: trend,
        trendDesc: trendDesc,
        isBlue: index % 3 === 0,
        targetHash: kpiConfig.targetHash,
      };
    });

    const filteredMetas = allMetas.filter(m => m.departmentId === currentDepartment?.departmentId && m.prioridad === 'alta');

    return {
      year: activeYear,
      departmentId: currentDepartment?.departmentId,
      departmentName: currentDepartment?.name || 'departamento seleccionado',
      kpis: mappedKpis,
      metas: filteredMetas,
      hasData: (currentDepartment?.cards ?? []).some(c => c.hasData),
    };
  }, [currentDepartment, prevYearDepartments, activeYear, allMetas]);
  
  // Obtiene el color de fondo personalizado para este departamento
  const deptColor = DEPARTMENT_COLORS[currentData.departmentId] || '#1E2875';

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
    departments,
    currentData,
    deptColor,
    isLight,
    customTextColor,
    faqData,
    handleTabChange,
    handleDrawerToggle,
  };
};
