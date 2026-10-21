import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { API_URL } from '../../../services/piadiApi';

export const useCentralDashboards = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openHelpDialog, setOpenHelpDialog] = useState(false); // Estado para abrir el Centro de Ayuda

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const token = sessionStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/api/departments`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          const targetKeys = ['educacion_continua', 'vinculacion_medio', 'innovacion', 'admision', 'desarrollo_curricular'];
          const filtered = result.data.filter(d => 
            targetKeys.includes(d.departmentId) || targetKeys.includes(d.key)
          );
          // Si el backend aún no retorna desarrollo_curricular en la base de datos local, aseguramos su presencia
          const hasDC = filtered.some(d => d.key === 'desarrollo_curricular' || d.departmentId === 'desarrollo_curricular');
          if (!hasDC) {
            filtered.push({
              key: 'desarrollo_curricular',
              departmentId: 'desarrollo_curricular',
              name: 'Dirección de Desarrollo Curricular',
              description: 'Rendimiento académico, tasas de aprobación, asignaturas críticas, prácticas y titulación.',
            });
          }
          setDepartments(filtered);
        } else {
          throw new Error('No se pudieron obtener los departamentos del servidor');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError(err.message);
        // Fallback seguro de departamentos para modo offline
        setDepartments([
          { key: 'admision', name: 'Dirección de Admisión y Registro Académico', description: 'Monitoreo de matrículas, retención y caracterización estudiantil.' },
          { key: 'educacion_continua', name: 'Educación Continua', description: 'Capacitaciones, diplomados y cursos de formación continua.' },
          { key: 'vinculacion_medio', name: 'Dirección de Vinculación con el Medio', description: 'Convenios, actividades y participación con el entorno.' },
          { key: 'innovacion', name: 'Innovación e Investigación', description: 'Proyectos de innovación, financiamiento y desarrollo docente.' },
          { key: 'desarrollo_curricular', name: 'Dirección de Desarrollo Curricular', description: 'Rendimiento académico, tasas de aprobación, asignaturas críticas, prácticas y titulación.' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

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

  const activeMenu = 'Dashboards';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenDashboard = (id) => {
    if (id === 'educacion_continua') {
      navigate('/dashboard-educacion-continua');
    } else if (id === 'vinculacion_medio') {
      navigate('/dashboard-vcm');
    } else if (id === 'innovacion') {
      navigate('/dashboard-innovacion');
    } else if (id === 'admision') {
      navigate('/dashboard-admision');
    } else if (id === 'desarrollo_curricular') {
      navigate('/dashboard-desarrollo-curricular');
    } else {
      navigate('/dashboard-crud');
    }
  };

  return {
    navigate,
    user,
    logout,
    mobileOpen,
    openHelpDialog,
    setOpenHelpDialog,
    departments,
    loading,
    error,
    faqData,
    activeMenu,
    handleDrawerToggle,
    handleOpenDashboard,
  };
};
