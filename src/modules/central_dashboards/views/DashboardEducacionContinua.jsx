import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { styles } from './DashboardEducacionContinua.styles';
import { getDashboardSummary, getIndicatorSeries } from '../../../services/piadiApi';
import logoEcas from '../../../assets/logo_ECAS_white.svg';
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Avatar,
  IconButton,
  Divider,
  Drawer,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  Slider,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  OutlinedInput,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  TrackChanges as MetasIcon,
  UploadFile as CargaIcon,
  Shield as AuditoriaIcon,
  TableChart as TablaIcon,
  ExitToApp as LogoutIcon,
  MoreVert as MoreVertIcon,
  Menu as MenuIcon,
  ChevronRight as ChevronRightIcon,
  FilterAlt as FilterIcon,
  RestartAlt as ResetIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Wc as WcIcon,
  AccessTime as ClockIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon,
  Public as PublicIcon,
} from '@mui/icons-material';

// Lucide Icons from TallerDevops
import { 
  Calendar as CalendarLucide, Search, Filter, ChevronRight as ChevronRightLucide, 
  Users, Maximize2, X, Info, GraduationCap,
  BookOpen, CheckCircle, TrendingUp, Percent,
  Award, Layers, Briefcase, DollarSign, UserCheck,
  RefreshCw, ClipboardList
} from 'lucide-react';

// MUI X-Charts
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { RadarChart } from '@mui/x-charts/RadarChart';



const COHORTES_LIST = ['2023', '2024', '2025', '2026'];
const PERIODOS_LIST = ['2023-1', '2023-2', '2024-1', '2024-2', '2025-1', '2025-2', '2026-1', '2026-2'];
const SEXO_LIST = ['Femenino', 'Masculino', 'No binario', 'Prefiere no responder'];
const MESES_LIST = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const TIPOS_LIST = ['Curso', 'Diplomado', 'Seminario', 'Postítulo'];
const MODALIDADES_LIST = ['Presencial', 'Online', 'Semipresencial', 'Híbrida'];
const AREAS_LIST = ['Auditoría', 'Contabilidad', 'Finanzas', 'Tributación', 'Gestión', 'Tecnología'];

const dashboardLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1E2875',
    },
    secondary: {
      main: '#1DC2A0',
    },
    background: {
      default: '#F5F5F7',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
        },
      },
    },
  },
});

export const DashboardEducacionContinua = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // ESTADOS DE FILTROS PERSISTENTES (SIDEBAR DERECHO)
  const [cohorteDesde, setCohorteDesde] = useState('2023');
  const [cohorteHasta, setCohorteHasta] = useState('2026');
  const [periodoDesde, setPeriodoDesde] = useState('2023-1');
  const [periodoHasta, setPeriodoHasta] = useState('2026-2');
  const [rangoEdad, setRangoEdad] = useState([18, 65]);
  const [sexoSeleccionado, setSexoSeleccionado] = useState([]);
  const [mesInicioSeleccionado, setMesInicioSeleccionado] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState([]);
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState([]);
  const [areaSeleccionada, setAreaSeleccionada] = useState([]);

  // ESTADOS DE CONTROL DE VISTA DE GRÁFICOS
  const [ofertaViewMode, setOfertaViewMode] = useState('area'); // 'area', 'tipo', 'modalidad'
  const [ingresosViewMode, setIngresosViewMode] = useState('area'); // 'area', 'tipo', 'modalidad'
  const [matriculaViewMode, setMatriculaViewMode] = useState('area'); // 'area', 'modalidad', 'tipo'
  const [selectedYearMatricula, setSelectedYearMatricula] = useState('Todos');
  const [perfilViewMode, setPerfilViewMode] = useState('region'); // 'region', 'sector', 'escolaridad', 'edad', 'genero', 'tipo'

  // MODALES DE DETALLE
  const [activeModal, setActiveModal] = useState(null);

  // DATOS REALES DESDE API
  const [apiSummary, setApiSummary] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiOfertaSeries, setApiOfertaSeries] = useState(null);
  const [apiDictadosSeries, setApiDictadosSeries] = useState(null);
  const [apiEjecucionSeries, setApiEjecucionSeries] = useState(null);

  const apiParams = useMemo(() => {
    const params = { department: 'educacion_continua' };
    const desde = parseInt(cohorteDesde);
    const hasta = parseInt(cohorteHasta);
    if (desde === hasta) {
      params.year = cohorteDesde;
    } else {
      params.fromYear = cohorteDesde;
      params.toYear = cohorteHasta;
    }
    if (areaSeleccionada.length > 0) params.area = areaSeleccionada.join(',');
    if (tipoSeleccionado.length > 0) params.tipo = tipoSeleccionado.join(',');
    if (modalidadSeleccionada.length > 0) params.modalidad = modalidadSeleccionada.join(',');
    if (sexoSeleccionado.length > 0) params.sexo = sexoSeleccionado.join(',');
    if (mesInicioSeleccionado.length > 0) params.startMonth = mesInicioSeleccionado.join(',');
    return params;
  }, [cohorteDesde, cohorteHasta, areaSeleccionada, tipoSeleccionado, modalidadSeleccionada, sexoSeleccionado, mesInicioSeleccionado]);

  useEffect(() => {
    setApiLoading(true);
    const seriesParams = { department: 'educacion_continua', fromYear: cohorteDesde, toYear: cohorteHasta };
    Promise.all([
      getDashboardSummary(apiParams).catch(() => null),
      getIndicatorSeries('oferta_programada', seriesParams).catch(() => null),
      getIndicatorSeries('cursos_dictados', seriesParams).catch(() => null),
      getIndicatorSeries('tasa_ejecucion', seriesParams).catch(() => null),
    ]).then(([summary, oferta, dictados, ejecucion]) => {
      if (summary?.success && summary.data) {
        // Formato real: data.departments[0].cards[{ indicatorKey, value, hasData }]
        const deptData = summary.data?.departments?.find(d => d.departmentId === 'educacion_continua');
        const cards = deptData?.cards ?? [];
        if (cards.some(c => c.hasData)) {
          const map = {};
          cards.forEach(c => { map[c.indicatorKey] = c; });
          setApiSummary(map);
        }
      }
      // Serie usa data.points (no data.series)
      if (oferta?.success) setApiOfertaSeries(oferta.data?.points?.length > 0 ? oferta.data.points : null);
      if (dictados?.success) setApiDictadosSeries(dictados.data?.points?.length > 0 ? dictados.data.points : null);
      if (ejecucion?.success) setApiEjecucionSeries(ejecucion.data?.points?.length > 0 ? ejecucion.data.points : null);
    }).finally(() => setApiLoading(false));
  }, [apiParams, cohorteDesde, cohorteHasta]);

  const activeMenu = 'Dashboards';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleResetFilters = () => {
    setCohorteDesde('2023');
    setCohorteHasta('2026');
    setPeriodoDesde('2023-1');
    setPeriodoHasta('2026-2');
    setRangoEdad([18, 65]);
    setSexoSeleccionado([]);
    setMesInicioSeleccionado([]);
    setTipoSeleccionado([]);
    setModalidadSeleccionada([]);
    setAreaSeleccionada([]);
  };

  // --- LÓGICA DE DATOS REALES (sin multiplicadores mock) ---

  // Datos nominales — sin endpoint real, retornan vacíos
  const filteredNominalGroup1 = useMemo(() => [], []);
  const filteredNominalGroup2 = useMemo(() => [], []);
  const filteredCohorteData = useMemo(() => [], []);
  const filteredRetencionData = useMemo(() => [], []);

  // Oferta programada — usa datos reales de API, filtrada por año seleccionado
  const filteredProgramasData = useMemo(() => {
    if (!apiOfertaSeries?.length) return [];
    return apiOfertaSeries
      .filter(s => {
        const yr = parseInt(s.year ?? s.period ?? 0);
        return yr >= parseInt(cohorteDesde) && yr <= parseInt(cohorteHasta);
      })
      .map(s => ({
        cohorte: String(s.year ?? s.period ?? s.label ?? ''),
        total: s.value ?? 0,
      }));
  }, [apiOfertaSeries, cohorteDesde, cohorteHasta]);

  // Serie de oferta programada — total real de API (sin desglose por área/tipo/modalidad)
  const ofertaChartSeries = useMemo(() => {
    if (!filteredProgramasData.length) return [];
    return [{
      data: filteredProgramasData.map(d => d.total),
      label: 'Total programado',
      color: '#1E2875',
    }];
  }, [filteredProgramasData]);

  // dictadosSummaryData eliminado — se usan datos reales de effectiveDictadosSeries
  const dictadosSummaryData = useMemo(() => [], []);

  // Series efectivas: usa datos reales si la API los entrega con el formato esperado,
  // de lo contrario mantiene el cálculo mock existente.
  // Series efectivas: usa datos reales si la API los entrega (data.points), de lo contrario fallback mock.
  // Formato real de points: [{ year, period, value, label }]
  const effectiveDictadosSeries = useMemo(() => {
    if (apiOfertaSeries?.length > 0 && apiDictadosSeries?.length > 0) {
      const getKey = s => String(s.year ?? s.period ?? s.label ?? '');
      const years = [...new Set(apiOfertaSeries.map(getKey))];
      return years.map(yr => {
        const plan = apiOfertaSeries.find(s => getKey(s) === yr);
        const dict = apiDictadosSeries.find(s => getKey(s) === yr);
        const planVal = plan?.value ?? 0;
        const dictVal = dict?.value ?? 0;
        return {
          cohorte: yr,
          planificados: planVal,
          dictados: dictVal,
          tasa: planVal > 0 ? parseFloat(((dictVal / planVal) * 100).toFixed(1)) : 0,
        };
      });
    }
    return null;
  }, [apiOfertaSeries, apiDictadosSeries]);

  const effectiveEjecucionSeries = useMemo(() => {
    if (apiEjecucionSeries?.length > 0) {
      return apiEjecucionSeries.map(s => ({
        cohorte: String(s.year ?? s.period ?? s.label ?? ''),
        tasa: s.value ?? 0,
      }));
    }
    return null;
  }, [apiEjecucionSeries]);

  // KPIs desde API real — sin cálculo desde datos mock
  const kpiStats = useMemo(() => ({
    totalMatriculas: apiSummary?.matricula_por_programa?.value ?? 0,
    avgRetencion: 0,
    avgTasaEjecucion: apiSummary?.tasa_ejecucion?.value ?? 0,
  }), [apiSummary]);

  // Deduplicated base: Participantes Únicos (Group 2)
  const uniqueParticipantsData = useMemo(() => {
    const map = new Map();
    filteredNominalGroup2.forEach(reg => {
      if (!map.has(reg.rut)) {
        map.set(reg.rut, {
          rut: reg.rut,
          nombre: reg.nombre,
          edad: reg.edad,
          region: reg.region,
          sector: reg.sector,
          genero: reg.genero,
          programas: [reg.programa]
        });
      } else {
        const existing = map.get(reg.rut);
        if (!existing.programas.includes(reg.programa)) {
          existing.programas.push(reg.programa);
        }
      }
    });
    return Array.from(map.values());
  }, [filteredNominalGroup2]);

  const uniqueParticipantsAgeDist = useMemo(() => {
    if (!uniqueParticipantsData.length) return [];
    const dist = { '18-25': 0, '26-35': 0, '36-50': 0, 'Más de 50': 0 };
    uniqueParticipantsData.forEach(p => {
      if (p.edad <= 25) dist['18-25']++;
      else if (p.edad <= 35) dist['26-35']++;
      else if (p.edad <= 50) dist['36-50']++;
      else dist['Más de 50']++;
    });
    return Object.keys(dist).map(key => ({ range: key, count: dist[key] }));
  }, [uniqueParticipantsData]);

  const recurrenceFreqDist = useMemo(() => {
    if (!uniqueParticipantsData.length) return [];
    const dist = { '1 Prog': 0, '2 Prog': 0, '3 o más': 0 };
    uniqueParticipantsData.forEach(p => {
      const count = p.programas.length;
      if (count === 1) dist['1 Prog']++;
      else if (count === 2) dist['2 Prog']++;
      else dist['3 o más']++;
    });
    return Object.keys(dist).map(key => ({ category: key, count: dist[key] }));
  }, [uniqueParticipantsData]);

  // Recurrencia Formativa Calculations
  const recurrenciaStats = useMemo(() => {
    const unicos = uniqueParticipantsData.length;
    const recurrentesList = uniqueParticipantsData.filter(p => p.programas.length > 1);
    const totalRecurrentes = recurrentesList.length;
    const tasa = unicos > 0 ? parseFloat(((totalRecurrentes / unicos) * 100).toFixed(1)) : 0;

    return {
      totalUnicos: unicos,
      totalRecurrentes,
      tasaRecurrencia: tasa,
      recurrentesList
    };
  }, [uniqueParticipantsData]);

  // Radar Chart — sin datos reales por área/tipo, retorna vacío
  const radarSeries = useMemo(() => [], [selectedYearMatricula, matriculaViewMode, cohorteDesde, cohorteHasta]);

  const radarMetrics = useMemo(() => {
    if (matriculaViewMode === 'area') {
      return ['Auditoría', 'Contabilidad', 'Finanzas', 'Tecnología', 'Gestión', 'Tributación', 'Otras'];
    } else if (matriculaViewMode === 'modalidad') {
      return ['Online', 'Presencial', 'Híbrido'];
    } else {
      return ['Curso', 'Diplomado', 'Seminario'];
    }
  }, [matriculaViewMode]);

  const radarMax = useMemo(() => {
    let highest = 0;
    radarSeries.forEach(s => {
      s.data.forEach(val => {
        if (val > highest) highest = val;
      });
    });
    return Math.max(100, Math.round(highest * 1.1));
  }, [radarSeries]);

  // Tasa de aprobación — requiere datos nominales reales (sin endpoint aún)
  const aprobacionProgramasData = useMemo(() => {
    if (!filteredNominalGroup2.length) return [];
    const baseRates = {
      'Auditoría': 92.4,
      'Contabilidad': 89.5,
      'Finanzas': 91.2,
      'Tecnología': 94.8,
      'Gestión': 88.7,
      'Tributación': 90.6
    };

    let list = Object.keys(baseRates).map(area => {
      const areaRegs = filteredNominalGroup2.filter(r => r.area.startsWith(area));
      const total = areaRegs.length;
      const aprobados = areaRegs.filter(r => r.aprobacion === 'Aprobado').length;
      
      const rate = total > 0 
        ? parseFloat(((aprobados / total) * 100).toFixed(1)) 
        : baseRates[area];
      
      const promedio = baseRates[area];
      const scaledMatriculas = Math.round(total * (kpiStats.totalMatriculas / Math.max(1, filteredNominalGroup2.length)));

      return {
        area,
        tasa: rate,
        promedioHistorico: promedio,
        matriculas: scaledMatriculas || Math.round(kpiStats.totalMatriculas * 0.15),
        aprobados: Math.round((scaledMatriculas * rate) / 100)
      };
    });

    if (areaSeleccionada.length > 0) {
      list = list.filter(d => areaSeleccionada.includes(d.area));
    }

    return list;
  }, [filteredNominalGroup2, kpiStats.totalMatriculas, areaSeleccionada]);

  // Ingresos generados grouped dynamically by Area, Tipo or Modalidad
  const ingresosGeneradosData = useMemo(() => {
    const totalCLPBase = filteredNominalGroup1.reduce((acc, curr) => acc + curr.monto, 0);
    const totalCLPEst = totalCLPBase * (kpiStats.totalMatriculas / Math.max(1, filteredNominalGroup1.length)) * 12;

    const dist = {};
    filteredNominalGroup1.forEach(item => {
      let key = 'Otros';
      if (ingresosViewMode === 'area') {
        key = item.area;
      } else if (ingresosViewMode === 'tipo') {
        key = item.programa.includes('Diplomado') ? 'Diplomado' : 'Curso';
      } else if (ingresosViewMode === 'modalidad') {
        if (item.programa.includes('IA') || item.programa.includes('Finanzas') || item.programa.includes('Auditoría')) {
          key = 'Online';
        } else if (item.programa.includes('NIIF') || item.programa.includes('Fullstack') || item.programa.includes('Tributaria')) {
          key = 'Híbrida';
        } else {
          key = 'Presencial';
        }
      }
      dist[key] = (dist[key] || 0) + item.monto;
    });

    const keys = Object.keys(dist);
    if (keys.length === 0) return [];

    const totalBaseDist = Object.values(dist).reduce((a, b) => a + b, 0);

    return keys.map(key => {
      const share = totalBaseDist > 0 ? (dist[key] / totalBaseDist) : 0;
      const ingresosCLP = Math.round(totalCLPEst * share);
      const ingresosM = parseFloat((ingresosCLP / 1000000).toFixed(1));

      const pricing = PROGRAM_PRICING[key] || { neto: 1200000, valorLista: 1500000, descuento: 0.20 };
      const count = Math.max(1, Math.round(ingresosCLP / pricing.neto));

      return {
        area: key, 
        matriculas: count,
        valorLista: pricing.valorLista,
        descuento: pricing.descuento,
        netoUnitario: pricing.neto,
        ingresosCLP,
        ingresosM
      };
    });
  }, [filteredNominalGroup1, ingresosViewMode, kpiStats.totalMatriculas]);

  const totalRevenueCLP = useMemo(() => {
    return ingresosGeneradosData.reduce((acc, curr) => acc + curr.ingresosCLP, 0);
  }, [ingresosGeneradosData]);

  // Perfil del participante — sin datos reales por dimensión (sin endpoint), retorna null
  const perfilParticipantesData = null;


  const activePeriodosText = useMemo(() => {
    let text = `Años: ${cohorteDesde} a ${cohorteHasta} | Semestre: ${periodoDesde} a ${periodoHasta}`;

    const filtersActive = [];
    if (areaSeleccionada.length > 0) filtersActive.push(`Áreas: ${areaSeleccionada.join(', ')}`);
    if (modalidadSeleccionada.length > 0) filtersActive.push(`Modalidades: ${modalidadSeleccionada.join(', ')}`);
    if (tipoSeleccionado.length > 0) filtersActive.push(`Tipos: ${tipoSeleccionado.join(', ')}`);
    if (mesInicioSeleccionado.length > 0) filtersActive.push(`Meses: ${mesInicioSeleccionado.join(', ')}`);

    if (filtersActive.length > 0) {
      text += ` | Filtros Activos (${filtersActive.join('; ')})`;
    }

    return text;
  }, [cohorteDesde, cohorteHasta, periodoDesde, periodoHasta, areaSeleccionada, modalidadSeleccionada, tipoSeleccionado, mesInicioSeleccionado]);

  // NAV NAVEGACIÓN IZQUIERDA
  const sidebarContent = (
    <Box sx={styles.drawerContent}>
      <Box>
        {/* Logo y Cabecera del Sidebar */}
        <Box sx={styles.logoContainer}>
          <Box 
            component="img" 
            src={logoEcas} 
            alt="Logo ECAS" 
            sx={{ width: 32, height: 32, objectFit: 'contain' }} 
          />
          <Box>
            <Typography variant="subtitle1" sx={styles.logoTitle}>
              PIADI
            </Typography>
            <Typography variant="caption" sx={styles.logoSubtitle}>
              ECAS
            </Typography>
          </Box>
        </Box>

        <Divider sx={styles.divider} />

        {/* Menú de Navegación */}
        <Box sx={styles.menuContainer}>
          {[
            { text: 'Inicio', icon: <HomeIcon />, path: '/' },
            { text: 'Dashboards', icon: <DashboardIcon />, path: '/dashboard' },
            { text: 'Metas', icon: <MetasIcon />, path: '#' },
            { text: 'Carga de datos', icon: <CargaIcon />, path: '/carga-datos' },
            { text: 'Auditoría', icon: <AuditoriaIcon />, path: '/auditoria' },
            { text: 'Visualización de tablas', icon: <TablaIcon />, path: '#' },
          ].filter((item) => {
            if (item.text === 'Auditoría' || item.text === 'Visualización de tablas') {
              return (
                user?.role === 'Rector' || 
                user?.role === 'Administrador' || 
                user?.role === 'Director de Administración' ||
                user?.role === 'Analista de Calidad'
              );
            }
            return true;
          }).map((item) => {
            const isSelected = activeMenu === item.text;
            return (
              <Box
                key={item.text}
                onClick={() => {
                  setMobileOpen(false);
                  if (item.path !== '#') {
                    navigate(item.path);
                  }
                }}
                sx={styles.menuItem(isSelected)}
              >
                {item.icon}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: isSelected ? 600 : 500, 
                    noWrap: true,
                    color: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Sección inferior del Sidebar */}
      <Box sx={styles.bottomSection}>
        <Box onClick={logout} sx={styles.logoutButton}>
          <LogoutIcon />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Cerrar Sesión
          </Typography>
        </Box>

        <Box sx={styles.userCard}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            <Avatar sx={styles.userAvatar}>
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'JD'}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>
                {user?.username || 'John Doe'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Ver perfil
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.6)' }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={dashboardLightTheme}>
      <Box sx={styles.mainLayout}>
      
      {/* SCOPED STYLE BLOCK TO AVOID GLOBAL COLLISION */}
      <style dangerouslySetInnerHTML={{__html: `
        .taller-devops-dashboard {
          font-family: 'Inter', sans-serif;
          color: #1e293b;
        }

        /* Chart SVG text visibility */
        .taller-devops-dashboard svg text,
        .taller-devops-dashboard svg text tspan,
        .taller-devops-dashboard svg tspan {
          fill: #1e293b !important;
          opacity: 1 !important;
          fill-opacity: 1 !important;
        }
        .taller-devops-dashboard .MuiChartsAxis-label,
        .taller-devops-dashboard .MuiChartsAxis-tickLabel,
        .taller-devops-dashboard .MuiChartsLegend-root text,
        .taller-devops-dashboard .MuiChartsLegend-root text tspan,
        .taller-devops-dashboard .MuiChartsLegend-root tspan {
          fill: #1E2875 !important;
          font-weight: 600 !important;
          opacity: 1 !important;
          fill-opacity: 1 !important;
        }
        
        /* Top summary cards */
        .taller-devops-dashboard .kpi-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 24px;
        }
        @media (max-width: 768px) {
          .taller-devops-dashboard .kpi-container {
            grid-template-columns: 1fr;
          }
        }
        .taller-devops-dashboard .kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #1E2875;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .taller-devops-dashboard .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .taller-devops-dashboard .kpi-value {
          font-size: 26px;
          font-weight: 700;
          color: #1e1b4b;
          margin-bottom: 6px;
        }
        .taller-devops-dashboard .kpi-trend {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
        }

        /* Subheader banner */
        .taller-devops-dashboard .info-banner {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 12px 18px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .taller-devops-dashboard .info-banner-label {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #1E2875;
        }
        .taller-devops-dashboard .info-banner-value {
          font-size: 13px;
          color: #334155;
          font-weight: 500;
        }

        /* Charts grid */
        .taller-devops-dashboard .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }
        @media (max-width: 1024px) {
          .taller-devops-dashboard .charts-grid {
            grid-template-columns: 1fr;
          }
        }
        .taller-devops-dashboard .chart-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          display: flex;
          flex-direction: column;
          height: 380px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .taller-devops-dashboard .chart-card:hover {
          box-shadow: 0 4px 12px rgba(30, 40, 117, 0.05);
        }
        .taller-devops-dashboard .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .taller-devops-dashboard .chart-title {
          font-size: 15px;
          font-weight: 700;
          color: #1E2875;
          font-family: 'Inter', sans-serif;
        }
        .taller-devops-dashboard .chart-wrapper {
          flex-grow: 1;
          position: relative;
          min-height: 0;
        }

        /* Toggle Buttons */
        .taller-devops-dashboard .card-toggle-group {
          display: flex;
          background-color: #f1f5f9;
          border-radius: 8px;
          padding: 3px;
        }
        .taller-devops-dashboard .btn-toggle {
          background: transparent;
          border: none;
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          color: #475569;
          transition: background-color 0.1s, color 0.1s;
        }
        .taller-devops-dashboard .btn-toggle.active {
          background-color: #ffffff;
          color: #1E2875;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .taller-devops-dashboard .btn-details {
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 4px 8px;
          cursor: pointer;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
        }
        .taller-devops-dashboard .btn-details:hover {
          background-color: #f8fafc;
          color: #1E2875;
        }

        /* Modals and overlay */
        .taller-devops-dashboard .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }
        .taller-devops-dashboard .modal-content {
          background: #ffffff;
          border-radius: 16px;
          max-width: 650px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          padding: 24px;
          position: relative;
          box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        }
        .taller-devops-dashboard .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          cursor: pointer;
          color: #94a3b8;
        }
        
        /* Modal Table styling */
        .taller-devops-dashboard .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
          font-size: 13px;
        }
        .taller-devops-dashboard .details-table th,
        .taller-devops-dashboard .details-table td {
          border-bottom: 1px solid #f1f5f9;
          padding: 10px 12px;
          text-align: left;
        }
        .taller-devops-dashboard .details-table th {
          background-color: #f8fafc;
          font-weight: 700;
          color: #1E2875;
        }
      `}} />

      {/* BARRA DE NAVEGACIÓN SUPERIOR MÓVIL (APPBAR) */}
      <AppBar position="fixed" sx={styles.mobileAppBar}>
        <Toolbar sx={styles.mobileToolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ p: 0, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <MenuIcon sx={{ fontSize: 36 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR LATERAL (ESCRITORIO) */}
      <Box component="nav" sx={styles.sidebar}>
        {sidebarContent}
      </Box>

      {/* SIDEBAR DESPLEGABLE (MÓVIL) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, border: 'none' },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* ÁREA DE CONTENIDO CENTRAL */}
      <Box component="main" sx={styles.contentArea} className="taller-devops-dashboard">
        
        {/* Cabecera del Panel Principal */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, width: '100%' }}>
            <Box sx={styles.panelHeader}>
              <Box sx={styles.panelIconContainer}>
                <SchoolIcon />
              </Box>
              <Box>
                <Typography variant="h5" sx={styles.panelTitle}>
                  Dashboard de Educación Continua
                </Typography>
                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                  Visualización de estadísticas y métricas del departamento de Educación Continua
                </Typography>
              </Box>
            </Box>
            {user && (
              <Box sx={styles.sessionCard}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#1DC2A0' }} />
                <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                  Sesión activa: <span style={{ fontWeight: 700 }}>{user.username}</span> ({user.role})
                </Typography>
              </Box>
            )}
          </Box>

          {/* Breadcrumbs */}
          <Box sx={styles.breadcrumbsContainer}>
            <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/')}>
              Inicio
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7 }} />
            <Typography variant="body1" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate('/dashboard')}>
              Central de Dashboards
            </Typography>
            <ChevronRightIcon sx={{ fontSize: '16px', opacity: 0.7 }} />
            <Typography variant="body1" sx={{ color: '#1E2875', fontWeight: 600 }}>
              Dashboard de Educación Continua
            </Typography>
          </Box>
        </Box>

        {/* Top Summary Cards (KPIs Bar) */}
        <div className="kpi-container">
          <div className="kpi-card" style={{ borderLeft: '4px solid #1E2875' }}>
            <div className="kpi-header">
              <span>Matrículas Totales</span>
              <Users size={16} />
            </div>
            <div className="kpi-value">
              {apiSummary?.matricula_por_programa?.value != null
                ? Number(apiSummary.matricula_por_programa.value).toLocaleString('es-CL')
                : apiLoading ? '...' : '—'}
            </div>
            <div className="kpi-trend">
              <span>{apiSummary?.matricula_por_programa?.hasData ? 'Datos reales API' : 'Sin datos disponibles'}</span>
            </div>
          </div>

          <div className="kpi-card" style={{ borderLeft: '4px solid #10B981' }}>
            <div className="kpi-header" style={{ color: '#047857' }}>
              <span>Ingresos Generados (Neto)</span>
              <DollarSign size={16} style={{ color: '#10B981' }} />
            </div>
            <div className="kpi-value" style={{ color: '#047857' }}>
              {apiSummary?.ingresos_generados?.value != null
                ? `$${Number(apiSummary.ingresos_generados.value).toLocaleString('es-CL')}`
                : apiLoading ? '...' : '—'}
            </div>
            <div className="kpi-trend" style={{ color: '#047857' }}>
              <span>{apiSummary?.ingresos_generados?.hasData ? 'Valores facturados netos reales' : 'Sin datos disponibles'}</span>
            </div>
          </div>

          <div className="kpi-card" style={{ borderLeft: '4px solid #F59E0B' }}>
            <div className="kpi-header" style={{ color: '#b45309' }}>
              <span>Tasa de Ejecución</span>
              <RefreshCw size={16} style={{ color: '#F59E0B' }} />
            </div>
            <div className="kpi-value" style={{ color: '#b45309' }}>
              {apiSummary?.tasa_ejecucion?.value != null
                ? `${apiSummary.tasa_ejecucion.value}%`
                : apiLoading ? '...' : '—'}
            </div>
            <div className="kpi-trend" style={{ color: '#b45309' }}>
              <span>{apiSummary?.tasa_ejecucion?.hasData ? 'Datos reales API' : 'Sin datos disponibles'}</span>
            </div>
          </div>
        </div>

        {/* Subheader Period Banner */}
        <div className="info-banner">
          <Info size={16} style={{ color: '#1E2875' }} />
          <div>
            <span className="info-banner-label">Período Visualizado: </span>
            <span className="info-banner-value">{activePeriodosText}</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">

          {/* Card 9: Oferta de cursos programada */}
          <div className="chart-card" style={{ gridColumn: '1 / -1', height: '390px' }}>
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} style={{ color: '#1E2875' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>Oferta programada</h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="card-toggle-group">
                  <button className={`btn-toggle ${ofertaViewMode === 'area' ? 'active' : ''}`} onClick={() => setOfertaViewMode('area')}>Área</button>
                  <button className={`btn-toggle ${ofertaViewMode === 'tipo' ? 'active' : ''}`} onClick={() => setOfertaViewMode('tipo')}>Tipo</button>
                  <button className={`btn-toggle ${ofertaViewMode === 'modalidad' ? 'active' : ''}`} onClick={() => setOfertaViewMode('modalidad')}>Modalidad</button>
                </div>
                <button className="btn-details">
                  <Maximize2 size={12} />
                </button>
              </div>
            </div>
            
            <div className="chart-wrapper">
              {filteredProgramasData.length > 0 ? (
                <BarChart
                  xAxis={[{
                    scaleType: 'band',
                    data: filteredProgramasData.map(d => d.cohorte),
                    label: 'Año'
                  }]}
                  series={ofertaChartSeries}
                  margin={{ top: 15, right: 15, bottom: 60, left: 40 }}
                  slotProps={{
                    legend: {
                      direction: 'row',
                      position: { vertical: 'bottom', horizontal: 'middle' },
                      labelStyle: { fontSize: '11px', fill: '#1e293b' }
                    }
                  }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          {/* Card 3: Cursos efectivamente dictados */}
          <div className="chart-card">
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} style={{ color: '#10B981' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>Cursos efectivamente dictados</h2>
              </div>
              <button className="btn-details">
                <Maximize2 size={12} />
                <span>Detalles</span>
              </button>
            </div>
            
            <div className="chart-wrapper">
              {effectiveDictadosSeries ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: effectiveDictadosSeries.map(d => d.cohorte), label: 'Año' }]}
                  series={[
                    { data: effectiveDictadosSeries.map(d => d.planificados), label: 'Programados', color: '#cbd5e1' },
                    { data: effectiveDictadosSeries.map(d => d.dictados), label: 'Dictados', color: '#10B981' }
                  ]}
                  margin={{ top: 15, right: 15, bottom: 40, left: 40 }}
                  slotProps={{
                    legend: {
                      direction: 'row',
                      position: { vertical: 'bottom', horizontal: 'middle' },
                      labelStyle: { fontSize: '10px', fill: '#1e293b' }
                    }
                  }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          {/* Card 4: Tasa de ejecución (%) */}
          <div className="chart-card">
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Percent size={16} style={{ color: '#1E2875' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>Tasa de ejecución (%)</h2>
              </div>
              <button className="btn-details">
                <Maximize2 size={12} />
                <span>Detalles</span>
              </button>
            </div>
            
            <div className="chart-wrapper">
              {effectiveEjecucionSeries ? (
                <LineChart
                  xAxis={[{ scaleType: 'point', data: effectiveEjecucionSeries.map(d => d.cohorte), label: 'Año' }]}
                  series={[{
                    data: effectiveEjecucionSeries.map(d => d.tasa),
                    color: '#1E2875',
                    label: 'Tasa Ejecución %',
                    valueFormatter: (value) => `${value}%`
                  }]}
                  margin={{ top: 15, right: 15, bottom: 40, left: 45 }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          {/* Card 7: Ingresos Generados */}
          <div className="chart-card" style={{ gridColumn: '1 / -1', height: '390px' }}>
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={16} style={{ color: '#10B981' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>
                  Ingresos por {ingresosViewMode === 'area' ? 'área' : (ingresosViewMode === 'tipo' ? 'tipo de programa' : 'modalidad')} ($M CLP)
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="card-toggle-group">
                  <button className={`btn-toggle ${ingresosViewMode === 'area' ? 'active' : ''}`} onClick={() => setIngresosViewMode('area')}>Área</button>
                  <button className={`btn-toggle ${ingresosViewMode === 'tipo' ? 'active' : ''}`} onClick={() => setIngresosViewMode('tipo')}>Tipo</button>
                  <button className={`btn-toggle ${ingresosViewMode === 'modalidad' ? 'active' : ''}`} onClick={() => setIngresosViewMode('modalidad')}>Modalidad</button>
                </div>
                <button className="btn-details">
                  <Maximize2 size={12} />
                </button>
              </div>
            </div>

            <div className="chart-wrapper">
              {ingresosGeneradosData.length > 0 ? (
                <BarChart
                  xAxis={[{ 
                    scaleType: 'band', 
                    data: ingresosGeneradosData.map(d => d.area)
                  }]}
                  series={[{ 
                    data: ingresosGeneradosData.map(d => d.ingresosM),
                    color: '#10B981',
                    label: 'Millones CLP'
                  }]}
                  margin={{ top: 15, right: 15, bottom: 50, left: 50 }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>No hay datos coincidentes con los filtros</div>
              )}
            </div>
          </div>

          {/* Card 5: Matrícula por programa (Radar Chart) */}
          <div className="chart-card" style={{ gridColumn: '1 / -1', height: '520px' }}>
            <div className="chart-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2 className="chart-title" style={{ margin: 0 }}>Matrícula por programa</h2>
                </div>
                
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <div className="card-toggle-group">
                    <button className={`btn-toggle ${matriculaViewMode === 'area' ? 'active' : ''}`} onClick={() => setMatriculaViewMode('area')}>Área</button>
                    <button className={`btn-toggle ${matriculaViewMode === 'modalidad' ? 'active' : ''}`} onClick={() => setMatriculaViewMode('modalidad')}>Modalidad</button>
                    <button className={`btn-toggle ${matriculaViewMode === 'tipo' ? 'active' : ''}`} onClick={() => setMatriculaViewMode('tipo')}>Tipo Programa</button>
                  </div>

                  <div className="card-toggle-group">
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', alignSelf: 'center', paddingLeft: '8px', paddingRight: '4px' }}>
                      Año:
                    </span>
                    <button className={`btn-toggle ${selectedYearMatricula === 'Todos' ? 'active' : ''}`} onClick={() => setSelectedYearMatricula('Todos')}>Todos</button>
                    {['2023', '2024', '2025', '2026'].map(yr => {
                      const y = parseInt(yr);
                      if (y < parseInt(cohorteDesde) || y > parseInt(cohorteHasta)) return null;
                      return (
                        <button 
                          key={yr}
                          className={`btn-toggle ${selectedYearMatricula === yr ? 'active' : ''}`}
                          onClick={() => setSelectedYearMatricula(yr)}
                        >
                          {yr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <button className="btn-details">
                <Maximize2 size={12} />
                <span>Detalles</span>
              </button>
            </div>

            <div className="chart-wrapper" style={{ height: '390px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {radarSeries.length > 0 ? (
                <RadarChart
                  height={370}
                  series={radarSeries}
                  radar={{
                    max: radarMax,
                    metrics: radarMetrics
                  }}
                  slotProps={{
                    legend: {
                      direction: 'row',
                      position: { vertical: 'bottom', horizontal: 'middle' },
                      labelStyle: { fontSize: '11px', fill: '#1e293b' }
                    }
                  }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          {/* Card 6: Tasa de aprobación por programa */}
          <div className="chart-card">
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award size={16} style={{ color: '#a855f7' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>Tasa de aprobación</h2>
              </div>
              <button className="btn-details">
                <Maximize2 size={12} />
                <span>Detalles</span>
              </button>
            </div>

            <div className="chart-wrapper">
              {aprobacionProgramasData.length > 0 ? (
                <BarChart
                  layout="horizontal"
                  yAxis={[{ 
                    scaleType: 'band', 
                    data: aprobacionProgramasData.map(d => d.area)
                  }]}
                  series={[
                    { data: aprobacionProgramasData.map(d => d.tasa), label: 'Tasa %', color: '#a855f7', layout: 'horizontal' },
                    { data: aprobacionProgramasData.map(d => d.promedioHistorico), label: 'Histórico %', color: '#94a3b8', layout: 'horizontal' }
                  ]}
                  margin={{ top: 10, right: 15, bottom: 40, left: 100 }}
                  slotProps={{
                    legend: {
                      direction: 'row',
                      position: { vertical: 'bottom', horizontal: 'middle' },
                      labelStyle: { fontSize: '10px', fill: '#1e293b' }
                    }
                  }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>No hay datos coincidentes</div>
              )}
            </div>
          </div>

          {/* Card 8: Perfil del participante */}
          <div className="chart-card">
            <div className="chart-header">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={16} style={{ color: '#F59E0B' }} />
                  <h2 className="chart-title" style={{ margin: 0 }}>Perfil del participante</h2>
                </div>
                <div className="card-toggle-group" style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '380px', marginTop: '4px' }}>
                  <button className={`btn-toggle ${perfilViewMode === 'region' ? 'active' : ''}`} onClick={() => setPerfilViewMode('region')}>Región</button>
                  <button className={`btn-toggle ${perfilViewMode === 'sector' ? 'active' : ''}`} onClick={() => setPerfilViewMode('sector')}>Sector</button>
                  <button className={`btn-toggle ${perfilViewMode === 'escolaridad' ? 'active' : ''}`} onClick={() => setPerfilViewMode('escolaridad')}>Escolaridad</button>
                  <button className={`btn-toggle ${perfilViewMode === 'edad' ? 'active' : ''}`} onClick={() => setPerfilViewMode('edad')}>Edad</button>
                  <button className={`btn-toggle ${perfilViewMode === 'genero' ? 'active' : ''}`} onClick={() => setPerfilViewMode('genero')}>Género</button>
                  <button className={`btn-toggle ${perfilViewMode === 'tipo' ? 'active' : ''}`} onClick={() => setPerfilViewMode('tipo')}>Tipo</button>
                </div>
              </div>
              <button className="btn-details" style={{ alignSelf: 'flex-start' }}>
                <Maximize2 size={12} />
                <span>Detalles</span>
              </button>
            </div>

            <div className="chart-wrapper" style={{ marginTop: '8px' }}>
              {perfilParticipantesData ? (
                <PieChart
                  series={[
                    {
                      data: perfilParticipantesData[perfilViewMode],
                      innerRadius: 20,
                      outerRadius: 85,
                      paddingAngle: 3,
                      cornerRadius: 4,
                    },
                  ]}
                  height={220}
                  slotProps={{
                    legend: {
                      direction: 'column',
                      position: { vertical: 'middle', horizontal: 'right' },
                      labelStyle: { fontSize: '10px', fill: '#1e293b' }
                    }
                  }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          {/* Histograms for Unique and Recurrent Participants */}
          <div className="chart-card">
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} style={{ color: '#8b5cf6' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>Histograma: Participantes Únicos</h2>
              </div>
            </div>
            <div className="chart-wrapper">
              {uniqueParticipantsAgeDist.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: uniqueParticipantsAgeDist.map(d => d.range), label: 'Rango de Edad' }]}
                  series={[{ data: uniqueParticipantsAgeDist.map(d => d.count), color: '#8b5cf6', label: 'Cantidad Personas' }]}
                  margin={{ top: 20, right: 15, bottom: 40, left: 35 }}
                  slotProps={{ legend: { hidden: true } }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={16} style={{ color: '#ec4899' }} />
                <h2 className="chart-title" style={{ margin: 0 }}>Histograma: Frecuencia de Matrículas</h2>
              </div>
            </div>
            <div className="chart-wrapper">
              {recurrenceFreqDist.length > 0 ? (
                <BarChart
                  xAxis={[{ scaleType: 'band', data: recurrenceFreqDist.map(d => d.category), label: 'Programas cursados por persona' }]}
                  series={[{ data: recurrenceFreqDist.map(d => d.count), color: '#ec4899', label: 'Cantidad Personas' }]}
                  margin={{ top: 20, right: 15, bottom: 40, left: 35 }}
                  slotProps={{ legend: { hidden: true } }}
                />
              ) : (
                <div style={{ color: '#64748b', fontSize: '13px', padding: '20px' }}>Sin datos disponibles</div>
              )}
            </div>
          </div>

        </div>

      </Box>

      {/* SECCIÓN DE FILTROS PERSISTENTES (DERECHA) */}
      <Box component="aside" sx={styles.filtersSidebar}>
        {/* Cabecera Filtros */}
        <Box sx={styles.filtersHeader}>
          <FilterIcon sx={{ color: '#1E2875', fontSize: 20 }} />
          <Typography sx={styles.filtersTitle}>Filtros</Typography>
        </Box>

        <Divider sx={{ my: 2, borderColor: '#E5E7EB' }} />

        {/* Contenido Scrollable de Filtros */}
        <Box sx={styles.filtersScrollContent}>
          
          {/* Selector de Año (Slider) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Año
              </Typography>
            </Box>
            <Box sx={{ px: 1, mt: 0.5 }}>
              <Slider
                value={[parseInt(cohorteDesde), parseInt(cohorteHasta)]}
                onChange={(e, newValue) => {
                  setCohorteDesde(newValue[0].toString());
                  setCohorteHasta(newValue[1].toString());
                }}
                valueLabelDisplay="auto"
                min={2023}
                max={2026}
                step={1}
                marks={[
                  { value: 2023, label: '2023' },
                  { value: 2024, label: '2024' },
                  { value: 2025, label: '2025' },
                  { value: 2026, label: '2026' }
                ]}
                sx={styles.ageSliderStyle}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Typography sx={styles.ageRangeLabels}>
                  <span>{cohorteDesde}</span> — <span>{cohorteHasta}</span>
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Selector de Período Académico */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Período académico
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="periodo-desde-label" sx={styles.selectLabelStyle}>Desde</InputLabel>
                <Select
                  labelId="periodo-desde-label"
                  value={periodoDesde}
                  label="Desde"
                  onChange={(e) => setPeriodoDesde(e.target.value)}
                  sx={styles.selectInputStyle}
                >
                  {PERIODOS_LIST.map((per) => {
                    const isDisabled = PERIODOS_LIST.indexOf(per) > PERIODOS_LIST.indexOf(periodoHasta);
                    return (
                      <MenuItem key={per} value={per} disabled={isDisabled}>
                        {per}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Typography sx={{ color: '#94A3B8' }}>—</Typography>
              <FormControl fullWidth size="small">
                <InputLabel id="periodo-hasta-label" sx={styles.selectLabelStyle}>Hasta</InputLabel>
                <Select
                  labelId="periodo-hasta-label"
                  value={periodoHasta}
                  label="Hasta"
                  onChange={(e) => setPeriodoHasta(e.target.value)}
                  sx={styles.selectInputStyle}
                >
                  {PERIODOS_LIST.map((per) => {
                    const isDisabled = PERIODOS_LIST.indexOf(per) < PERIODOS_LIST.indexOf(periodoDesde);
                    return (
                      <MenuItem key={per} value={per} disabled={isDisabled}>
                        {per}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Rango de Edad (Slider) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Rango de edad
              </Typography>
            </Box>
            <Box sx={{ px: 1, mt: 0.5 }}>
              <Slider
                value={rangoEdad}
                onChange={(e, newValue) => setRangoEdad(newValue)}
                valueLabelDisplay="auto"
                min={18}
                max={65}
                sx={styles.ageSliderStyle}
              />
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Typography sx={styles.ageRangeLabels}>
                  <span>{rangoEdad[0]}</span> — <span>{rangoEdad[1]}</span> años
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Sexo (Selector Múltiple) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WcIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Sexo
              </Typography>
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel id="sexo-select-label" sx={styles.selectLabelStyle}>Seleccionar</InputLabel>
              <Select
                labelId="sexo-select-label"
                multiple
                value={sexoSeleccionado}
                onChange={(e) => setSexoSeleccionado(e.target.value)}
                input={<OutlinedInput label="Seleccionar" />}
                renderValue={(selected) => selected.join(', ')}
                sx={styles.selectInputStyle}
              >
                {SEXO_LIST.map((name) => (
                  <MenuItem key={name} value={name} sx={styles.menuItemCheckStyle}>
                    <Checkbox checked={sexoSeleccionado.indexOf(name) > -1} sx={styles.checkboxStyle} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Mes de inicio (Selector Múltiple) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Mes de inicio
              </Typography>
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel id="mes-select-label" sx={styles.selectLabelStyle}>Seleccionar</InputLabel>
              <Select
                labelId="mes-select-label"
                multiple
                value={mesInicioSeleccionado}
                onChange={(e) => setMesInicioSeleccionado(e.target.value)}
                input={<OutlinedInput label="Seleccionar" />}
                renderValue={(selected) => selected.join(', ')}
                sx={styles.selectInputStyle}
              >
                {MESES_LIST.map((name) => (
                  <MenuItem key={name} value={name} sx={styles.menuItemCheckStyle}>
                    <Checkbox checked={mesInicioSeleccionado.indexOf(name) > -1} sx={styles.checkboxStyle} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Tipo de programa (Selector Múltiple) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Tipo de programa
              </Typography>
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel id="tipo-select-label" sx={styles.selectLabelStyle}>Seleccionar</InputLabel>
              <Select
                labelId="tipo-select-label"
                multiple
                value={tipoSeleccionado}
                onChange={(e) => setTipoSeleccionado(e.target.value)}
                input={<OutlinedInput label="Seleccionar" />}
                renderValue={(selected) => selected.join(', ')}
                sx={styles.selectInputStyle}
              >
                {TIPOS_LIST.map((name) => (
                  <MenuItem key={name} value={name} sx={styles.menuItemCheckStyle}>
                    <Checkbox checked={tipoSeleccionado.indexOf(name) > -1} sx={styles.checkboxStyle} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Modalidad (Selector Múltiple) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PublicIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Modalidad
              </Typography>
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel id="modalidad-select-label" sx={styles.selectLabelStyle}>Seleccionar</InputLabel>
              <Select
                labelId="modalidad-select-label"
                multiple
                value={modalidadSeleccionada}
                onChange={(e) => setModalidadSeleccionada(e.target.value)}
                input={<OutlinedInput label="Seleccionar" />}
                renderValue={(selected) => selected.join(', ')}
                sx={styles.selectInputStyle}
              >
                {MODALIDADES_LIST.map((name) => (
                  <MenuItem key={name} value={name} sx={styles.menuItemCheckStyle}>
                    <Checkbox checked={modalidadSeleccionada.indexOf(name) > -1} sx={styles.checkboxStyle} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Área (Selector Múltiple) */}
          <Box sx={styles.filterSection}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CategoryIcon sx={{ fontSize: 18, color: '#1E2875' }} />
              <Typography sx={styles.filterSectionTitle}>
                Área de programa
              </Typography>
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel id="area-select-label" sx={styles.selectLabelStyle}>Seleccionar</InputLabel>
              <Select
                labelId="area-select-label"
                multiple
                value={areaSeleccionada}
                onChange={(e) => setAreaSeleccionada(e.target.value)}
                input={<OutlinedInput label="Seleccionar" />}
                renderValue={(selected) => selected.join(', ')}
                sx={styles.selectInputStyle}
              >
                {AREAS_LIST.map((name) => (
                  <MenuItem key={name} value={name} sx={styles.menuItemCheckStyle}>
                    <Checkbox checked={areaSeleccionada.indexOf(name) > -1} sx={styles.checkboxStyle} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Botón de Limpiar Filtros */}
        <Box sx={styles.filtersFooter}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<ResetIcon />}
            onClick={handleResetFilters}
            sx={styles.resetFiltersButton}
          >
            Restablecer filtros
          </Button>
        </Box>
      </Box>

      {/* DETAILS MODALS OVERLAY */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)}>
              <X size={20} />
            </button>

            {activeModal === 'programas' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E2875', marginBottom: '12px' }}>Detalles: Oferta Programada</h3>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Año Cohorte</th>
                      <th>Área / Programa</th>
                      <th>Cursos Planificados</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProgramasData.length > 0 ? filteredProgramasData.map(row => (
                      <tr key={row.cohorte}>
                        <td style={{ fontWeight: 600 }}>{row.cohorte}</td>
                        <td>Todas las áreas activas</td>
                        <td>{row.total.toLocaleString()}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={3} style={{ color: '#64748b', padding: '12px' }}>Sin datos disponibles</td></tr>
                    )}
                  </tbody>
                </table>
              </>
            )}

            {activeModal === 'dictados' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E2875', marginBottom: '12px' }}>Detalles: Cursos Efectivamente Dictados</h3>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Año</th>
                      <th>Planificados</th>
                      <th>Efectivamente Dictados</th>
                      <th>Tasa de Ejecución</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dictadosSummaryData.map(row => (
                      <tr key={row.cohorte}>
                        <td style={{ fontWeight: 600 }}>{row.cohorte}</td>
                        <td>{row.planificados}</td>
                        <td>{row.dictados}</td>
                        <td style={{ fontWeight: 700, color: '#10B981' }}>{row.tasa}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeModal === 'tasa' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E2875', marginBottom: '12px' }}>Detalles: Tasa de Ejecución (%)</h3>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Año</th>
                      <th>Tasa de Ejecución</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dictadosSummaryData.map(row => (
                      <tr key={row.cohorte}>
                        <td style={{ fontWeight: 600 }}>{row.cohorte}</td>
                        <td style={{ fontWeight: 700, color: '#1E2875' }}>{row.tasa}%</td>
                        <td>{row.tasa >= 80 ? 'Excelente (>=80%)' : 'En revisión'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeModal === 'ingresos' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E2875', marginBottom: '12px' }}>Detalles: Ingresos Generados</h3>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Categoría</th>
                      <th>Estimación Matrículas</th>
                      <th>Ingresos ($M CLP)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingresosGeneradosData.map(row => (
                      <tr key={row.area}>
                        <td style={{ fontWeight: 600 }}>{row.area}</td>
                        <td>{row.matriculas}</td>
                        <td style={{ fontWeight: 700, color: '#10B981' }}>${row.ingresosM}M CLP</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeModal === 'matriculaPrograma' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E2875', marginBottom: '12px' }}>Detalles: Matrículas por Programa</h3>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Métrica / Dimensión</th>
                      {radarSeries.map(s => <th key={s.label}>{s.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {radarMetrics.map((metric, idx) => (
                      <tr key={metric}>
                        <td style={{ fontWeight: 600 }}>{metric}</td>
                        {radarSeries.map(s => <td key={s.label}>{s.data[idx] || 0}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {activeModal === 'aprobacion' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E2875', marginBottom: '12px' }}>Detalles: Tasa de Aprobación</h3>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Programa / Área</th>
                      <th>Tasa Aprobación</th>
                      <th>Promedio Histórico</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aprobacionProgramasData.length > 0 ? aprobacionProgramasData.map(row => (
                      <tr key={row.area}>
                        <td style={{ fontWeight: 600 }}>{row.area}</td>
                        <td style={{ fontWeight: 700, color: '#a855f7' }}>{row.tasa}%</td>
                        <td>{row.promedioHistorico}%</td>
                      </tr>
                    )) : (
                      <tr><td colSpan={3} style={{ color: '#64748b', padding: '12px' }}>Sin datos disponibles</td></tr>
                    )}
                  </tbody>
                </table>
              </>
            )}

            {activeModal === 'perfil' && (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1E2875', marginBottom: '12px' }}>Detalles: Perfil del Participante</h3>
                <table className="details-table">
                  <thead>
                    <tr>
                      <th>Segmento / Categoría</th>
                      <th>Porcentaje Estimado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perfilParticipantesData ? perfilParticipantesData[perfilViewMode].map(row => {
                      const total = perfilParticipantesData[perfilViewMode].reduce((acc, curr) => acc + curr.value, 0);
                      const pct = total > 0 ? ((row.value / total) * 100).toFixed(1) : 0;
                      return (
                        <tr key={row.label}>
                          <td style={{ fontWeight: 600 }}>{row.label}</td>
                          <td>{pct}% ({row.value.toLocaleString()} alumnos)</td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={2} style={{ color: '#64748b', padding: '12px' }}>Sin datos disponibles</td></tr>
                    )}
                  </tbody>
                </table>
              </>
            )}

          </div>
        </div>
      )}

      </Box>
    </ThemeProvider>
  );
};
