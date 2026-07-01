import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';

const DEFAULT_ROLE_FILTER = 'Todos';

const isEmptyValue = (value) =>
  value === null || value === undefined || value === '' || value === '-';

const toText = (value, fallback = '-') => {
  if (isEmptyValue(value)) return fallback;
  return String(value);
};

const formatDate = (iso) => {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '-';
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const parseDisplayDate = (value) => {
  if (!value || value === '-') return null;
  const [datePart, timePart = '00:00'] = String(value).split(' ');
  const [day, month, year] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  const parsed = new Date(year, month - 1, day, hour || 0, minute || 0);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// Intenta corregir nombres guardados con encoding incorrecto (Latin-1 como UTF-8).
const fixEncoding = (value) => {
  if (!value || typeof value !== 'string') return value;
  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
};

const parseJsonString = (value) => {
  if (!value || typeof value !== 'string') return null;
  const text = value.trim();
  if (!text.startsWith('{') && !text.startsWith('[')) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

const getParsedDetails = (item) => {
  const details = item?.detail?.detalles ?? item?.detail?.detalle ?? item?.detalles ?? item?.detalle;
  return parseJsonString(details);
};

const getRawAction = (item) =>
  item?.accion || item?.action || item?.detail?.accion || item?.detail?.action || '-';

const resolveUser = (item) => {
  const parsed = getParsedDetails(item);
  const value =
    item?.usuarioNombre ||
    item?.usuarioEmail ||
    item?.detail?.usuarioNombre ||
    item?.detail?.usuarioEmail ||
    parsed?.usuarioNombre ||
    parsed?.usuarioEmail ||
    parsed?.usuario;

  if (!isEmptyValue(value)) return String(value);

  const detailText = item?.detail?.detalles;
  if (typeof detailText === 'string') {
    const emailMatch = detailText.match(/[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) return emailMatch[0];
  }

  const id = item?.usuarioId ?? item?.detail?.usuarioId ?? parsed?.usuarioId;
  return id !== null && id !== undefined ? `#${id}` : '-';
};

const resolveRole = (item) => {
  const parsed = getParsedDetails(item);
  return toText(
    item?.rol ||
      item?.role ||
      item?.detail?.rol ||
      item?.detail?.role ||
      parsed?.rol ||
      parsed?.role
  );
};

const resolveAction = (item, type) => {
  const rawAction = getRawAction(item);
  const labels = {
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGIN_FAILED: 'Inicio de sesión fallido',
    LOGOUT_SUCCESS: 'Cierre de sesión',
    UPLOAD_TEMPLATE: 'Carga de plantilla',
  };
  if (rawAction === '-' && type === 'carga') return 'Carga de plantilla';
  return labels[rawAction] || toText(rawAction);
};

const resolveTemplate = (item) => {
  const parsed = getParsedDetails(item);
  const value = item?.detail?.plantilla || item?.plantilla || parsed?.plantilla || parsed?.template;
  if (isEmptyValue(value)) return '-';
  return /^\d+$/.test(String(value)) ? `Plantilla #${value}` : String(value);
};

const resolveFile = (item) => {
  const parsed = getParsedDetails(item);
  return toText(fixEncoding(item?.detail?.archivo || item?.archivo || parsed?.archivo || parsed?.file));
};

const resolveEntity = (item, fallback = 'Sistema') => {
  const parsed = getParsedDetails(item);
  return toText(item?.detail?.entidad || item?.entidad || parsed?.entidad || parsed?.entity, fallback);
};

const resolveRecords = (item) => {
  const parsed = getParsedDetails(item);
  const value =
    item?.detail?.registros ||
    item?.detail?.cantidad ||
    item?.registros ||
    parsed?.registros ||
    parsed?.cantidad ||
    1;
  return Number.isFinite(Number(value)) ? Number(value) : 1;
};

const cleanPlainDetail = (value) => {
  if (isEmptyValue(value)) return '';
  if (typeof value !== 'string') return '';
  const text = fixEncoding(value).trim();
  return parseJsonString(text) ? '' : text;
};

const resolveDetail = (item) => {
  const detail = item?.detail || {};
  const parsed = getParsedDetails(item);
  const plainDetail =
    cleanPlainDetail(detail.detalles) ||
    cleanPlainDetail(detail.detalle) ||
    cleanPlainDetail(item?.detalle) ||
    cleanPlainDetail(parsed?.detalle) ||
    cleanPlainDetail(parsed?.descripcion) ||
    cleanPlainDetail(parsed?.mensaje) ||
    cleanPlainDetail(parsed?.message);

  if (plainDetail) return plainDetail;

  const action = getRawAction(item);
  const usuario = resolveUser(item);
  const rol = resolveRole(item);
  const plantilla = resolveTemplate(item);
  const archivo = resolveFile(item);
  const entidad = resolveEntity(item, '-');

  if (action === 'LOGIN_SUCCESS') {
    if (usuario !== '-' && rol !== '-') return `Inicio de sesión exitoso de ${usuario} con rol ${rol}.`;
    if (usuario !== '-') return `Inicio de sesión exitoso de ${usuario}.`;
    return 'Inicio de sesión exitoso.';
  }

  if (action === 'LOGIN_FAILED') {
    if (usuario !== '-') return `Intento de inicio de sesión fallido para ${usuario}.`;
    return 'Intento de inicio de sesión fallido.';
  }

  if (action === 'LOGOUT_SUCCESS') {
    if (usuario !== '-' && rol !== '-') return `Cierre de sesión de ${usuario} con rol ${rol}.`;
    if (usuario !== '-') return `Cierre de sesión de ${usuario}.`;
    return 'Cierre de sesión.';
  }

  if (action === 'UPLOAD_TEMPLATE') {
    const parts = [];
    if (plantilla !== '-') parts.push(`plantilla ${plantilla}`);
    if (archivo !== '-') parts.push(`archivo ${archivo}`);
    if (entidad !== '-') parts.push(`entidad ${entidad}`);
    return parts.length ? `Carga de ${parts.join(', ')}.` : 'Carga de plantilla registrada.';
  }

  return (
    cleanPlainDetail(detail.descripcion) ||
    cleanPlainDetail(detail.mensaje) ||
    cleanPlainDetail(parsed?.error) ||
    ''
  );
};

const mapAuditLog = (item, type, index) => ({
  id: item?.id ?? `${type}-${item?.createdAt || index}`,
  fecha: formatDate(item?.createdAt),
  fechaRaw: item?.createdAt || null,
  usuario: resolveUser(item),
  rol: resolveRole(item),
  accion: resolveAction(item, type),
  entidad: resolveEntity(item, type === 'session' ? 'Sistema' : '-'),
  registros: resolveRecords(item),
  plantilla: type === 'carga' ? resolveTemplate(item) : '-',
  archivo: type === 'carga' ? resolveFile(item) : '-',
  detalle: resolveDetail(item),
});

const getSortValue = (log, key) => {
  if (key === 'fecha') {
    const rawDate = log.fechaRaw ? new Date(log.fechaRaw) : parseDisplayDate(log.fecha);
    return rawDate && !Number.isNaN(rawDate.getTime()) ? rawDate.getTime() : null;
  }
  if (key === 'entidadRegistros') return `${log.entidad || ''} ${log.registros || ''}`;
  return log[key];
};

const sortLogs = (logs, sortKey, sortDirection) => {
  if (!sortKey) return logs;

  return [...logs].sort((a, b) => {
    const aValue = getSortValue(a, sortKey);
    const bValue = getSortValue(b, sortKey);
    const aMissing = isEmptyValue(aValue);
    const bMissing = isEmptyValue(bValue);

    if (aMissing && bMissing) return 0;
    if (aMissing) return 1;
    if (bMissing) return -1;

    let result = 0;
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      result = aValue - bValue;
    } else {
      result = String(aValue).localeCompare(String(bValue), 'es', {
        sensitivity: 'base',
        numeric: true,
      });
    }

    return sortDirection === 'asc' ? result : -result;
  });
};

const escapeCsvValue = (value) => {
  const text = toText(value).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const escaped = text.replace(/"/g, '""');
  return /[";\n]/.test(escaped) ? `"${escaped}"` : escaped;
};

const buildCsv = (rows, columns) => {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(';');
  const body = rows.map((row) =>
    columns.map((column) => escapeCsvValue(column.value(row))).join(';')
  );
  return `\uFEFF${[header, ...body].join('\n')}`;
};

const downloadCsv = (filename, csv) => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const useAuditoria = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('carga');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterRole, setFilterRole] = useState(DEFAULT_ROLE_FILTER);
  const [filterDesde, setFilterDesde] = useState('');
  const [filterHasta, setFilterHasta] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [openHelpDialog, setOpenHelpDialog] = useState(false); // Estado para abrir el Centro de Ayuda
  const itemsPerPage = 3; // Paginación móvil

  const [realCargaLogs, setRealCargaLogs] = useState([]);
  const [realSessionLogs, setRealSessionLogs] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('auth_token');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchLogs = async (type, setter) => {
      try {
        const res = await fetch(`${API_URL}/api/audit-logs?type=${type}&limit=100`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) return;
        const json = await res.json();
        const items = json?.data?.items || [];
        setter(items.map((item, index) => mapAuditLog(item, type, index)));
      } catch {
        setter([]);
      }
    };

    fetchLogs('carga', setRealCargaLogs);
    fetchLogs('session', setRealSessionLogs);
  }, []);

  const roleOptions = useMemo(() => {
    // Fuente temporal: cuando exista la API de roles, reemplazar por la llamada real.
    const roles = [...realCargaLogs, ...realSessionLogs]
      .map((log) => log.rol)
      .filter((role) => !isEmptyValue(role));
    return [...new Set(roles)].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  }, [realCargaLogs, realSessionLogs]);

  useEffect(() => {
    if (filterRole !== DEFAULT_ROLE_FILTER && !roleOptions.includes(filterRole)) {
      setFilterRole(DEFAULT_ROLE_FILTER);
    }
  }, [filterRole, roleOptions]);

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
    setSortKey('');
    setSortDirection('asc');
    setCurrentPage(1); // Reiniciar paginación
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection((currentDirection) => (currentDirection === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(key);
    setSortDirection('asc');
  };

  const getActiveLogs = () => {
    switch (activeTab) {
      case 'carga': return realCargaLogs;
      case 'session': return realSessionLogs;
      default: return [];
    }
  };

  const logs = getActiveLogs();

  const filteredLogs = useMemo(() => logs.filter((log) => {
    const term = searchTerm.trim().toLowerCase();
    const searchableValues = [
      log.fecha,
      log.usuario,
      log.rol,
      log.accion,
      log.entidad,
      log.registros,
      log.plantilla,
      log.archivo,
      log.detalle,
    ];
    const matchesSearch = !term || searchableValues.some((value) =>
      toText(value, '').toLowerCase().includes(term)
    );

    const matchesRole = filterRole === DEFAULT_ROLE_FILTER || log.rol === filterRole;

    let matchesDesde = true;
    let matchesHasta = true;

    if (filterDesde || filterHasta) {
      const logDate = log.fechaRaw ? new Date(log.fechaRaw) : parseDisplayDate(log.fecha);

      if (!logDate || Number.isNaN(logDate.getTime())) {
        matchesDesde = false;
        matchesHasta = false;
      } else {
        if (filterDesde) {
          const desdeDate = new Date(`${filterDesde}T00:00:00`);
          matchesDesde = logDate >= desdeDate;
        }
        if (filterHasta) {
          const hastaDate = new Date(`${filterHasta}T23:59:59`);
          matchesHasta = logDate <= hastaDate;
        }
      }
    }

    return matchesSearch && matchesRole && matchesDesde && matchesHasta;
  }), [logs, searchTerm, filterRole, filterDesde, filterHasta]);

  const sortedLogs = useMemo(
    () => sortLogs(filteredLogs, sortKey, sortDirection),
    [filteredLogs, sortKey, sortDirection]
  );

  // Paginación móvil
  const totalPages = Math.ceil(sortedLogs.length / itemsPerPage);
  const paginatedLogs = sortedLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getVisibleRowsForActiveTab = () => sortedLogs;

  const handleExportCsv = () => {
    const rows = getVisibleRowsForActiveTab();
    if (!rows.length) {
      alert('No hay registros visibles para exportar.');
      return;
    }

    const columnsByTab = {
      carga: [
        { label: 'Fecha', value: (row) => row.fecha },
        { label: 'Usuario', value: (row) => row.usuario },
        { label: 'Rol', value: (row) => row.rol },
        { label: 'Acción', value: (row) => row.accion },
        { label: 'Plantilla', value: (row) => row.plantilla },
        { label: 'Archivo', value: (row) => row.archivo },
        { label: 'Detalle', value: (row) => row.detalle },
      ],
      session: [
        { label: 'Fecha', value: (row) => row.fecha },
        { label: 'Usuario', value: (row) => row.usuario },
        { label: 'Rol', value: (row) => row.rol },
        { label: 'Acción', value: (row) => row.accion },
        { label: 'Detalle', value: (row) => row.detalle },
      ],
    };

    const filename = activeTab === 'carga'
      ? 'auditoria-carga-datos.csv'
      : 'auditoria-inicios-sesion.csv';
    downloadCsv(filename, buildCsv(rows, columnsByTab[activeTab] || columnsByTab.carga));
  };

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
    sortKey,
    sortDirection,
    handleSort,
    currentPage,
    setCurrentPage,
    openHelpDialog,
    setOpenHelpDialog,
    itemsPerPage,
    faqData,
    activeMenu,
    handleDrawerToggle,
    handleTabChange,
    roleOptions,
    filteredLogs: sortedLogs,
    totalPages,
    paginatedLogs,
    canExportCsv: sortedLogs.length > 0,
    handleExportCsv,
  };
};
