/**
 * theme.js
 * ──────────────────────────────────────────────────────────────
 * Design tokens converted from CSS variables.
 * All visual properties from the Bhakti Steps design spec.
 * ──────────────────────────────────────────────────────────────
 */

// ── Shared semantic colors (same in both modes) ────────
const statusColors = {
  success: '#7A9E7E',
  warning: '#C49A3C',
  error: '#8B1A2B',
  info: '#5B7FA5',
};

// ── Light palette (Autumn Sunset) ──────────────────────
export const lightColors = {
  primary: '#000000',
  primaryPressed: '#8C2F39',
  background: '#FED0BB',
  surface: '#FFFFFF',
  text: {
    primary: '#461220',
    secondary: '#7A4A55',
  },
  border: '#E8A89E',
  status: statusColors,
  accent: { peach: '#FCB9B2' },
  mood: {
    struggling: statusColors.error,
    steady: '#7A4A55',
    inspired: statusColors.warning,
    blissful: statusColors.success,
  },
};

// ── Dark palette (Red Sunburst) ────────────────────────
export const darkColors = {
  primary: '#CE4257',
  primaryPressed: '#FF7F51',
  background: '#4F000B',
  surface: '#720026',
  text: {
    primary: '#FED0BB',
    secondary: '#C4868E',
  },
  border: '#8A1A35',
  status: statusColors,
  accent: { peach: '#6B1025' },
  mood: {
    struggling: statusColors.error,
    steady: '#C4868E',
    inspired: statusColors.warning,
    blissful: statusColors.success,
  },
};

// Backwards-compat: static StyleSheet.create() usage
export const colors = lightColors;

// Spacing scale (§4.2)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

// Border radii (§4.5)
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
  circle: 50, // percentage
};

// Typography scale (§4.3)
export const typography = {
  display: {
    fontFamily: 'SourceSerif4-SemiBold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
  },
  title: {
    fontFamily: 'SourceSerif4-SemiBold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
  },
  subtitle: {
    fontFamily: 'SourceSerif4-Medium',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body: {
    fontFamily: 'DMSans-Regular',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  bodyBold: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  caption: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.2,
  },
  overline: {
    fontFamily: 'DMSans-Medium',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1.0,
  },
  button: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  metric: {
    fontFamily: 'SourceSerif4-SemiBold',
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: 0,
  },
  greeting: {
    fontFamily: 'SourceSerif4-SemiBold',
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0,
  },
};

// Elevation shadows (§4.4)
export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  low: {
    shadowColor: '#461220',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#461220',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  high: {
    shadowColor: '#461220',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
};

// Animation durations (§7)
export const animations = {
  tabSwitch: 200,
  tabDotAppear: 150,
  toggleSwitch: 150,
  stepperValue: 200,
  bottomSheetAppear: 300,
  bottomSheetDismiss: 200,
  scrimFade: 200,
  cardPress: 100,
  moodChip: 100,
  bannerCollapse: 200,
  postSubmission: 300,
  sparklineDraw: 600,
  toastAppear: 300,
  toastDismiss: 200,
  toastAutoDismiss: 4000,
  skeletonPulse: 1200,
  notificationBadge: 300,
};

// Export combined theme
export const theme = {
  colors,
  spacing,
  radius,
  typography,
  elevation,
  animations,
};

export default theme;