import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
          setDepartments(result.data);
        } else {
          throw new Error('No se pudieron obtener los departamentos del servidor');
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError(err.message);
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
