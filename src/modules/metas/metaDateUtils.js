// =========================================================================
// UTILIDAD: metaDateUtils.js
// Funciones auxiliares para derivación de año y período en Metas (PIADI-475)
// =========================================================================

/**
 * Deriva el año de la meta a partir de la fecha de inicio.
 * Se evita el desfase de zona horaria parseando directamente la cadena ISO (YYYY-MM-DD).
 * 
 * @param {string} fechaInicioStr - Fecha en formato 'YYYY-MM-DD' o ISO string
 * @returns {number} Año como entero (ej. 2026) o el año actual como fallback
 */
export const deriveAnio = (fechaInicioStr) => {
  if (!fechaInicioStr) return new Date().getFullYear();
  const cleanStr = String(fechaInicioStr).split(/[T ]/)[0];
  const parts = cleanStr.split('-');
  if (parts.length >= 1 && parts[0].length === 4) {
    const parsed = parseInt(parts[0], 10);
    if (!Number.isNaN(parsed)) return parsed;
  }
  const dateObj = new Date(fechaInicioStr);
  return !Number.isNaN(dateObj.getFullYear()) ? dateObj.getFullYear() : new Date().getFullYear();
};

/**
 * Deriva el período académico ('Semestre 1', 'Semestre 2' o 'Anual')
 * según el rango de fechas de inicio y límite.
 * 
 * Reglas de negocio:
 * - Semestre 1: Enero a Junio (meses 1 a 6) dentro del mismo año.
 * - Semestre 2: Julio a Diciembre (meses 7 a 12) dentro del mismo año.
 * - Anual: Cubre ambos semestres o cruza entre diferentes años.
 * 
 * @param {string} fechaInicioStr - Fecha de inicio en formato 'YYYY-MM-DD' o ISO
 * @param {string} fechaLimiteStr - Fecha límite en formato 'YYYY-MM-DD' o ISO
 * @returns {'Anual' | 'Semestre 1' | 'Semestre 2'}
 */
export const derivePeriodo = (fechaInicioStr, fechaLimiteStr) => {
  if (!fechaInicioStr || !fechaLimiteStr) return 'Anual';

  const cleanInicio = String(fechaInicioStr).split(/[T ]/)[0];
  const cleanLimite = String(fechaLimiteStr).split(/[T ]/)[0];

  const pInicio = cleanInicio.split('-');
  const pLimite = cleanLimite.split('-');

  if (pInicio.length < 3 || pLimite.length < 3) return 'Anual';

  const yInicio = parseInt(pInicio[0], 10);
  const mInicio = parseInt(pInicio[1], 10); // 1 a 12

  const yLimite = parseInt(pLimite[0], 10);
  const mLimite = parseInt(pLimite[1], 10); // 1 a 12

  if (Number.isNaN(yInicio) || Number.isNaN(mInicio) || Number.isNaN(yLimite) || Number.isNaN(mLimite)) {
    return 'Anual';
  }

  // Si cruza a un año posterior, se considera de alcance Anual
  if (yLimite > yInicio) {
    return 'Anual';
  }

  // Mismo año: comprobar semestres
  if (yInicio === yLimite) {
    // Si ambas fechas están dentro de Enero a Junio
    if (mInicio >= 1 && mLimite <= 6) {
      return 'Semestre 1';
    }
    // Si ambas fechas están dentro de Julio a Diciembre
    if (mInicio >= 7 && mLimite <= 12) {
      return 'Semestre 2';
    }
  }

  return 'Anual';
};
