/**
 * @file colors.ts
 * @description Tokens de diseño (colores, bordes y superficies) extraídos exactamente
 * del prototipo de Figma (`VISUALRAGTRAIE--copia-`), con soporte para Modo Claro y Modo Oscuro.
 */

export interface ThemePalette {
  isDark: boolean;
  background: string;
  cardBackground: string;
  surfaceSubtle: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  primaryTeal: string;
  primaryTealDark: string;
  primaryTealLight: string;
  primaryTealBorder: string;
  emeraldText: string;
  emeraldBg: string;
  emeraldBorder: string;
  dangerRed: string;
  dangerRedSoft: string;
  white: string;
}

/**
 * Paleta oficial del Modo Claro extraída de los frames de Figma.
 */
export const LIGHT_THEME: ThemePalette = {
  isDark: false,
  background: '#F8FAFC',
  cardBackground: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  primaryTeal: '#0D9488',
  primaryTealDark: '#0F766E',
  primaryTealLight: '#CCFBF1',
  primaryTealBorder: '#99F6E4',
  emeraldText: '#059669',
  emeraldBg: '#ECFDF5',
  emeraldBorder: '#A7F3D0',
  dangerRed: '#EF4444',
  dangerRedSoft: '#FEE2E2',
  white: '#FFFFFF',
};

/**
 * Paleta del Modo Oscuro activable desde el botón "Cambiar" en Perfil y Configuración (Pantallas 07 y 10).
 */
export const DARK_THEME: ThemePalette = {
  isDark: true,
  background: '#0F172A',
  cardBackground: '#1E293B',
  surfaceSubtle: '#334155',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  primaryTeal: '#0D9488',
  primaryTealDark: '#14B8A6',
  primaryTealLight: '#134E4A',
  primaryTealBorder: '#0F766E',
  emeraldText: '#34D399',
  emeraldBg: '#064E3B',
  emeraldBorder: '#059669',
  dangerRed: '#EF4444',
  dangerRedSoft: '#450A0A',
  white: '#FFFFFF',
};

/**
 * Obtiene la paleta de colores activa según el estado del modo oscuro.
 * @param {boolean} isDarkMode - Indica si el modo oscuro está activo.
 * @returns {ThemePalette} Paleta de colores correspondiente.
 */
export function getThemePalette(isDarkMode: boolean): ThemePalette {
  return isDarkMode ? DARK_THEME : LIGHT_THEME;
}
