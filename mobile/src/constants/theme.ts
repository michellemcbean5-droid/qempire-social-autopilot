import { MD3DarkTheme, MD3Theme } from 'react-native-paper';

export const colors = {
  // Q-Empire Brand Palette - BRIGHT & VIBRANT
  deepObsidian: '#0A0A1A',
  royalBlue: '#4169E1',
  electricPurple: '#BF00FF',
  neonAqua: '#00FFFF',
  warmGold: '#D4AF37',
  midnightNavy: '#0D0D2B',
  softWhite: '#F0F0FF',

  // NEW BRIGHT COLORS
  electricYellow: '#FFE600',
  hotPink: '#FF1493',
  electricBlue: '#00D4FF',
  neonGreen: '#39FF14',
  coral: '#FF6B6B',
  lavender: '#E6E6FA',

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Tier Colors
  tierFree: '#6B7280',
  tierBasic: '#3B82F6',
  tierPro: '#8B5CF6',
  tierElite: '#D4AF37',
};

export const theme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.electricBlue,
    onPrimary: colors.deepObsidian,
    primaryContainer: '#1a1a3e',
    onPrimaryContainer: colors.softWhite,
    secondary: colors.hotPink,
    onSecondary: colors.softWhite,
    secondaryContainer: '#2a0a3e',
    onSecondaryContainer: colors.softWhite,
    tertiary: colors.electricYellow,
    onTertiary: colors.deepObsidian,
    tertiaryContainer: '#2a2a0a',
    onTertiaryContainer: colors.electricYellow,
    background: colors.deepObsidian,
    onBackground: colors.softWhite,
    surface: colors.midnightNavy,
    onSurface: colors.softWhite,
    surfaceVariant: '#1a1a3e',
    onSurfaceVariant: '#A0A0C0',
    outline: '#2a2a4e',
    outlineVariant: '#1a1a3e',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: colors.softWhite,
    inverseOnSurface: colors.deepObsidian,
    inversePrimary: colors.electricBlue,
    elevation: {
      level0: 'transparent',
      level1: '#12122e',
      level2: '#1a1a3e',
      level3: '#22224e',
      level4: '#2a2a5e',
      level5: '#32326e',
    },
    surfaceDisabled: '#1a1a3e',
    onSurfaceDisabled: '#6B7280',
    backdrop: 'rgba(10, 10, 26, 0.8)',
    error: colors.error,
    onError: colors.softWhite,
    errorContainer: '#3a0a0a',
    onErrorContainer: '#FCA5A5',
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    // Custom colors
    text: colors.softWhite,
    textSecondary: '#A0A0C0',
    textMuted: '#6B7280',
    border: '#2a2a4e',
    card: '#12122e',
    cardHighlight: '#1a1a3e',
    accent: colors.warmGold,
    gradientStart: colors.electricBlue,
    gradientEnd: colors.electricPurple,
  },
  fonts: {
    ...MD3DarkTheme.fonts,
  },
};

export type AppTheme = typeof theme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  glow: {
    shadowColor: colors.electricBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  pinkGlow: {
    shadowColor: colors.hotPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  yellowGlow: {
    shadowColor: colors.electricYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
};

export const animations = {
  // Timing
  fast: 200,
  normal: 300,
  slow: 500,

  // Spring configs
  bouncy: {
    damping: 10,
    stiffness: 100,
  },
  gentle: {
    damping: 20,
    stiffness: 100,
  },
  wobbly: {
    damping: 8,
    stiffness: 200,
  },

  // Scale values
  pressScale: 0.96,
  hoverScale: 1.02,

  // Opacity values
  disabled: 0.5,
  pressed: 0.8,
};
