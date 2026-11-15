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

  surface: string;
  surfaceMuted: string;
  primary: string;
  primaryLight: string;
  emerald: string;
  emeraldLight: string;
  danger: string;
  dangerLight: string;
  dangerBorder: string;
}

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

  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',
  primary: '#0D9488',
  primaryLight: '#CCFBF1',
  emerald: '#059669',
  emeraldLight: '#ECFDF5',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  dangerBorder: '#FECACA',
};

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

  surface: '#1E293B',
  surfaceMuted: '#334155',
  primary: '#0D9488',
  primaryLight: '#134E4A',
  emerald: '#34D399',
  emeraldLight: '#064E3B',
  danger: '#EF4444',
  dangerLight: '#450A0A',
  dangerBorder: '#7F1D1D',
};

export function getThemePalette(isDarkMode: boolean): ThemePalette {
  return isDarkMode ? DARK_THEME : LIGHT_THEME;
}
