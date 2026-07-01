import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';

export const useAuditoria = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('carga');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterRole, setFilterRole] = useState('Todos');
  const [filterDesde, setFilterDesde] = useState('');
  const [filterHasta, setFilterHasta] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openHelpDialog, setOpenHelpDialog] = useState(false); // Estado para abrir el Centro de Ayuda
  const itemsPerPage = 3; // Paginación móvil

  const [realCargaLogs, setRealCargaLogs] = useState(null);
  const [realSessionLogs, setRealSessionLogs] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const formatDate = (iso) => {
      if (!iso) return '-';
      const d = new Date(iso);
      const pad = (n) => String(n).padStart(2, '0');
      return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    // Intenta corregir nombres de archivo guardados con encoding incorrecto (Latin-1 como UTF-8)
    const fixEncoding = (str) => {
      if (!str) return str;
      try { return decodeURIComponent(escape(str)); } catch (e) { return str; }
    };

    const fetchLogs = async (type, setter, mapFn) => {
      try {
        const res = await fetch(`${API_URL}/api/audit-logs?type=${type}&limit=100`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const json = await res.json();
        const items = json?.data?.items || [];
        setter(items.map(mapFn));
      } catch {
        // mantener mock data si el backend no responde
      }
    };

    const resolveUsuario = (item) => {
      if (item.usuarioNombre) return item.usuarioNombre;
      if (item.usuarioEmail) return item.usuarioEmail;
      const det = item.detail?.detalles;
      if (det && typeof det === 'string') {
        try {
          const parsed = JSON.parse(det);
          if (parsed?.usuario) return parsed.usuario;
        } catch (e) {
          // String plano: extraer email si está mencionado (p.ej. LOGIN_FAILED)
          const m = det.match(/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/);
          if (m) return m[0];
        }
      }
      if (item.detail?.usuarioId != null) return `#${item.detail.usuarioId}`;
      return '-';
    };

    const resolveDetalleSesion = (item) => {
      const accion = item.detail?.accion;
      const det = item.detail?.detalles;

      // Nuevo formato post-fix: string descriptivo directo (no JSON)
      if (det && typeof det === 'string' && !det.startsWith('{')) {
        return det;
      }

      const usuario = resolveUsuario(item);
      const rol = item.detail?.rol || null;

      if (accion === 'LOGIN_SUCCESS') {
        if (usuario !== '-' && rol) {
          return `Inicio de sesión exitoso de ${usuario} con rol ${rol}.`;
        }
        return 'Inicio de sesión exitoso.';
      }

      if (accion === 'LOGIN_FAILED') {
        if (usuario !== '-') {
          return `Intento de inicio de sesión fallido para ${usuario}.`;
        }
        return 'Intento de inicio de sesión fallido.';
      }

      if (accion === 'LOGOUT_SUCCESS') {
        const rol = item.detail?.rol || null;
        if (usuario !== '-' && rol) {
          return `Cierre de sesión de ${usuario} con rol ${rol}.`;
        }
        if (usuario !== '-') return `Cierre de sesión de ${usuario}.`;
        return 'Cierre de sesión.';
      }

      return det || '';
    };

    fetchLogs('carga', setRealCargaLogs, (item) => {
      const plantillaVal = item.detail?.plantilla;
      const plantillaDisplay = !plantillaVal
        ? '-'
        : /^\d+$/.test(String(plantillaVal))
          ? `Plantilla #${plantillaVal}`
          : plantillaVal;
      return {
        fecha: formatDate(item.createdAt),
        usuario: resolveUsuario(item),
        rol: item.detail?.rol || '-',
        accion: 'Carga',
        entidad: item.detail?.entidad || '-',
        registros: 1,
        plantilla: plantillaDisplay,
        archivo: fixEncoding(item.detail?.archivo) || '-'
      };
    });

    fetchLogs('session', setRealSessionLogs, (item) => ({
      fecha: formatDate(item.createdAt),
      usuario: resolveUsuario(item),
      rol: item.detail?.rol || '-',
      accion:
        item.detail?.accion === 'LOGIN_SUCCESS'
          ? 'Inicio sesión'
          : item.detail?.accion === 'LOGIN_FAILED'
            ? 'Inicio fallido'
            : item.detail?.accion === 'LOGOUT_SUCCESS'
              ? 'Cierre sesión'
              : (item.detail?.accion || '-'),
      entidad: item.detail?.entidad || 'Sistema',
      registros: 1,
      detalle: resolveDetalleSesion(item)
    }));
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

  const activeMenu = 'Auditoría';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setCurrentPage(1); // Reiniciar paginación
  };

  const getActiveLogs = () => {
    switch (activeTab) {
      case 'carga': return realCargaLogs ?? [];
      case 'session': return realSessionLogs ?? [];
      default: return [];
    }
  };

  const logs = getActiveLogs();

  // Filtrar logs según el buscador de texto y filtros avanzados (Rol, Desde, Hasta)
  const filteredLogs = logs.filter((log) => {
    // 1. Filtro de buscador de texto
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      log.usuario.toLowerCase().includes(term) ||
      log.rol.toLowerCase().includes(term) ||
      log.entidad.toLowerCase().includes(term) ||
      (log.plantilla && log.plantilla.toLowerCase().includes(term)) ||
      (log.archivo && log.archivo.toLowerCase().includes(term));

    // 2. Filtro de Rol
    const matchesRole = filterRole === 'Todos' || log.rol === filterRole;

    // 3. Filtro de fecha Desde y Hasta
    let matchesDesde = true;
    let matchesHasta = true;

    if (filterDesde || filterHasta) {
      const [day, month, year] = log.fecha.split(' ')[0].split('-');
      const logDate = new Date(year, month - 1, day);

      if (filterDesde) {
        // Se añade 'T00:00:00' para evitar inconsistencias de zona horaria local
        const desdeDate = new Date(filterDesde + 'T00:00:00');
        matchesDesde = logDate >= desdeDate;
      }
      if (filterHasta) {
        const hastaDate = new Date(filterHasta + 'T23:59:59');
        matchesHasta = logDate <= hastaDate;
      }
    }

    return matchesSearch && matchesRole && matchesDesde && matchesHasta;
  });

  // Paginación móvil
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    navigate,
    user,
    logout,
    mobileOpen,
    activeTab,
    searchTerm,
    setSearchTerm,
    showFilters,
    setShowFilters,
    filterRole,
    setFilterRole,
    filterDesde,
    setFilterDesde,
    filterHasta,
    setFilterHasta,
    currentPage,
    setCurrentPage,
    openHelpDialog,
    setOpenHelpDialog,
    itemsPerPage,
    faqData,
    activeMenu,
    handleDrawerToggle,
    handleTabChange,
    filteredLogs,
    totalPages,
    paginatedLogs,
  };
};
