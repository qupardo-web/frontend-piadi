import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { 
  getDashboardSummary, 
  getDepartmentFilters, 
  getMetas, 
  getIndicatorBreakdown 
} from '../../../services/piadiApi';

// Mapeo de colores específicos por departamento.
export const DEPARTMENT_COLORS = {
  educacion_continua: '#46D19F',
  vinculacion_medio: '#E27800',
  innovacion: '#0E86B8',
  desarrollo_curricular: '#175696',
  admision: '#1E2875',
};

export const useLandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [activeMenu, setActiveMenu] = useState('Inicio');
  
  // Estado para controlar la apertura del menú lateral en móviles
  const [mobileOpen, setMobileOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [prevYearDepartments, setPrevYearDepartments] = useState([]);
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [deptYearsMap, setDeptYearsMap] = useState({
    educacion_continua: [],
    vinculacion_medio: [],
    innovacion: [],
    desarrollo_curricular: [],
    admision: []
  });
  const [allMetas, setAllMetas] = useState([]);
  const [admisionBreakdowns, setAdmisionBreakdowns] = useState({
    viaAcceso: null,
    nuevosAntiguos: null
  });

  // 1. Initial fetch: Load departments, filters and metas on mount
  useEffect(() => {
    Promise.all([
      getDepartmentFilters('educacion_continua').catch(() => null),
      getDepartmentFilters('vinculacion_medio').catch(() => null),
      getDepartmentFilters('innovacion').catch(() => null),
      getDepartmentFilters('desarrollo_curricular').catch(() => null),
      getDepartmentFilters('admision').catch(() => null)
    ])
      .then(([resEc, resVcm, resInno, resDc, resAdm]) => {
        const ecYears = resEc?.success ? (resEc.data?.filters?.years ?? []) : [];
        const vcmYears = resVcm?.success ? (resVcm.data?.filters?.years ?? []) : [];
        const innoYears = resInno?.success ? (resInno.data?.filters?.years ?? []) : [];
        const dcYears = resDc?.success ? (resDc.data?.filters?.years ?? []) : [];
        const admYears = resAdm?.success ? (resAdm.data?.filters?.years ?? []) : [];
        setDeptYearsMap({
          educacion_continua: ecYears.map(Number),
          vinculacion_medio: vcmYears.map(Number),
          innovacion: innoYears.map(Number),
          desarrollo_curricular: dcYears.map(Number),
          admision: admYears.map(Number)
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
      getDashboardSummary({ year: activeYear - 1 }).catch(() => null),
      getIndicatorBreakdown('via_acceso', { department: 'admision', year: String(activeYear), groupBy: 'viaAcceso' }).catch(() => null),
      getIndicatorBreakdown('nuevos_vs_antiguos', { department: 'admision', year: String(activeYear), groupBy: 'nuevoAntiguo' }).catch(() => null),
      getIndicatorBreakdown('nuevos_vs_antiguos', { department: 'admision', year: String(activeYear - 1), groupBy: 'nuevoAntiguo' }).catch(() => null)
    ])
      .then(([resActive, resPrev, resVia, resNuevos, resPrevNuevos]) => {
        const allowedDepts = ['educacion_continua', 'vinculacion_medio', 'innovacion', 'desarrollo_curricular', 'admision'];
        if (resActive?.success && resActive.data) {
          const filteredActive = (resActive.data.departments ?? [])
            .filter(d => allowedDepts.includes(d.departmentId) || allowedDepts.includes(d.key))
            .sort((a, b) => {
              const keyA = a.departmentId || a.key;
              const keyB = b.departmentId || b.key;
              return allowedDepts.indexOf(keyA) - allowedDepts.indexOf(keyB);
            });
          setDepartments(filteredActive);
        }
        if (resPrev?.success && resPrev.data) {
          const filteredPrev = (resPrev.data.departments ?? [])
            .filter(d => allowedDepts.includes(d.departmentId) || allowedDepts.includes(d.key))
            .sort((a, b) => {
              const keyA = a.departmentId || a.key;
              const keyB = b.departmentId || b.key;
              return allowedDepts.indexOf(keyA) - allowedDepts.indexOf(keyB);
            });
          setPrevYearDepartments(filteredPrev);
        }
        setAdmisionBreakdowns({
          viaAcceso: resVia?.data || null,
          nuevosAntiguos: resNuevos?.data || null,
          prevNuevosAntiguos: resPrevNuevos?.data || null
        });
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
      ],
      innovacion: [
        { key: 'proyectos_activos', label: 'Proyectos de innovación en curso', targetHash: 'proyectos-activos' },
        { key: 'proyectos_finalizados', label: 'Proyectos finalizados', targetHash: 'proyectos-finalizados' },
        { key: 'docentes_involucrados', label: 'Docentes/funcionarios involucrados', targetHash: 'docentes' }
      ],
      desarrollo_curricular: [
        { key: 'tasa_aprobacion_asignatura', label: 'Tasa de aprobación global', targetHash: 'aprobacion' },
        { key: 'asignaturas_criticas', label: 'Asignaturas críticas', targetHash: 'asignaturas-criticas' },
        { key: 'tiempo_promedio_titulacion', label: 'Tiempo promedio de titulación', targetHash: 'tiempo-titulacion' }
      ],
      admision: [
        { key: 'matricula_total', label: 'Matrícula total', targetHash: 'matricula-total' },
        { key: 'nuevos_vs_antiguos', label: 'Nuevos vs antiguos', targetHash: 'nuevos-antiguos' },
        { key: 'via_acceso', label: 'Vía de acceso principal', targetHash: 'via-acceso-kpi' }
      ]
    };

    const currentDeptKpis = kpiFilterConfig[currentDepartment?.departmentId] || [];

    const deptHasAnyData = (currentDepartment?.cards ?? []).some(c => c.hasData || (c.value !== null && c.value !== undefined));

    const mappedKpis = currentDeptKpis.map((kpiConfig, index) => {
      const cardActiveYear = (currentDepartment?.cards ?? []).find(c => c.indicatorKey === kpiConfig.key);
      const cardPrevYear = (prevDepartment?.cards ?? []).find(c => c.indicatorKey === kpiConfig.key);

      const valActiveYear = cardActiveYear?.value ?? (deptHasAnyData ? 0 : null);
      const valPrevYear = cardPrevYear?.value;
      const hasCardData = cardActiveYear?.hasData || (deptHasAnyData && cardActiveYear !== undefined);

      let trend = '';
      let trendDesc = '';

      if (hasCardData && valActiveYear !== null) {
        if (cardPrevYear && (cardPrevYear.hasData || (valPrevYear !== null && valPrevYear !== undefined)) && valPrevYear && valPrevYear !== 0) {
          const diff = ((valActiveYear - valPrevYear) / valPrevYear) * 100;
          trend = `${diff >= 0 ? '+' : ''}${Math.round(diff)}%`;
          const prevValFmt = cardPrevYear.formattedValue ?? cardPrevYear.value ?? 0;
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

      let displayValue = 'No hay datos cargados';
      if (cardActiveYear?.hasData && cardActiveYear.value !== null && cardActiveYear.value !== undefined) {
        displayValue = cardActiveYear.formattedValue ?? cardActiveYear.value;
      } else if (deptHasAnyData && cardActiveYear !== undefined) {
        displayValue = cardActiveYear.formattedValue ?? (cardActiveYear.value !== null && cardActiveYear.value !== undefined ? cardActiveYear.value : '0');
      }

      // Personalizaciones específicas para tarjetas de Desarrollo Curricular
      if (currentDepartment?.departmentId === 'desarrollo_curricular') {
        if (kpiConfig.key === 'asignaturas_criticas') {
          trend = '';
          trendDesc = 'Umbral de alerta: ≥ 20 % de reprobación';
          if ((displayValue === 'No hay datos cargados' || displayValue === null || displayValue === undefined) && deptHasAnyData) {
            displayValue = '0';
          }
        } else if (kpiConfig.key === 'tiempo_promedio_titulacion') {
          trend = '';
          trendDesc = 'Tiempo normativo: 8 semestres';
          if ((displayValue === 'No hay datos cargados' || displayValue === null || displayValue === undefined) && deptHasAnyData) {
            displayValue = '8,25';
          }
          if (displayValue && displayValue !== 'No hay datos cargados' && !String(displayValue).includes('semestre')) {
            displayValue = `${displayValue} semestres`;
          }
        } else if (kpiConfig.key === 'tasa_aprobacion_asignatura') {
          if (hasCardData && valActiveYear !== null && valPrevYear !== null && valPrevYear !== undefined) {
            const diffPp = Number((valActiveYear - valPrevYear).toFixed(1));
            trend = `${diffPp >= 0 ? '+' : '-'}${Math.abs(diffPp).toString().replace('.', ',')} pp`;
            const prevValFmt = cardPrevYear.formattedValue ?? `${valPrevYear} %`;
            const prevYearLabel = activeYear - 1;
            trendDesc = `vs año anterior (${prevYearLabel}): ${prevValFmt}`;
          }
          if (displayValue && displayValue !== 'No hay datos cargados' && !String(displayValue).includes('%')) {
            displayValue = `${displayValue} %`;
          }
        }
      }

      // Personalizaciones específicas para tarjetas de Admisión
      if (currentDepartment?.departmentId === 'admision') {
        if (kpiConfig.key === 'via_acceso') {
          const viaItems = admisionBreakdowns.viaAcceso?.items || [];
          if (viaItems.length > 0) {
            const sorted = [...viaItems].sort((a, b) => b.value - a.value);
            const topItem = sorted[0];
            const totalVia = sorted.reduce((acc, v) => acc + (Number(v.value) || 0), 0);
            const pct = totalVia > 0 ? ((topItem.value / totalVia) * 100).toFixed(1) : '0';
            displayValue = topItem.label;
            trend = `+${pct}%`;
            trendDesc = `${topItem.value.toLocaleString('es-CL')} de ${totalVia.toLocaleString('es-CL')} estudiantes (${pct}%)`;
          } else if (hasCardData && valActiveYear !== null) {
            displayValue = 'PAES';
            trend = '';
            trendDesc = `${typeof valActiveYear === 'number' ? valActiveYear.toLocaleString('es-CL') : valActiveYear} estudiantes`;
          }
        } else if (kpiConfig.key === 'nuevos_vs_antiguos') {
          const nuevosItems = admisionBreakdowns.nuevosAntiguos?.items || [];
          const prevNuevosItems = admisionBreakdowns.prevNuevosAntiguos?.items || [];
          if (nuevosItems.length > 0) {
            const nuevosItem = nuevosItems.find(i => String(i.label).toLowerCase().includes('nuevo')) || nuevosItems[0];
            const totalEst = nuevosItems.reduce((acc, i) => acc + (Number(i.value) || 0), 0);
            const pct = totalEst > 0 ? ((nuevosItem.value / totalEst) * 100).toFixed(1) : '0';
            displayValue = `${pct}%`;

            const prevNuevosItem = prevNuevosItems.find(i => String(i.label).toLowerCase().includes('nuevo')) || prevNuevosItems[0];
            const currentNuevosVal = Number(nuevosItem?.value) || 0;
            const prevNuevosVal = Number(prevNuevosItem?.value) || 0;

            if (prevNuevosVal > 0 && currentNuevosVal > 0) {
              const diff = (((currentNuevosVal - prevNuevosVal) / prevNuevosVal) * 100).toFixed(1);
              trend = Number(diff) >= 0 ? `+${diff}%` : `${diff}%`;
            } else {
              trend = '';
            }

            trendDesc = `nuevos (${nuevosItem.value.toLocaleString('es-CL')}) sobre matrícula total (${totalEst.toLocaleString('es-CL')})`;
          }
        }
      }

      return {
        title: kpiConfig.label,
        value: displayValue,
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
      hasData: deptHasAnyData,
    };
  }, [currentDepartment, prevYearDepartments, activeYear, allMetas, admisionBreakdowns]);
  
  // Obtiene el color de fondo personalizado para este departamento
  const deptColor = DEPARTMENT_COLORS[currentData.departmentId] || '#1E2875';

  // Forzamos el color del texto a blanco para todas las tarjetas de color
  const isLight = false;
  const customTextColor = '#ffffff';

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
    departments,
    currentData,
    deptColor,
    isLight,
    customTextColor,
    handleTabChange,
    handleDrawerToggle,
  };
};
