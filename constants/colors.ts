// Color palette for CareRobo - inspired by the RoboCare reference website
// Primary: Deep navy blue + vibrant teal
// Accent: Medical green + emergency red

export const Colors = {
  // Primary Brand Colors
  primary: '#0A2463',        // Deep navy blue - primary brand
  primaryLight: '#1E4DB7',   // Lighter blue for gradients
  primaryDark: '#071A4A',    // Darker navy for depth

  // Accent Colors
  teal: '#00B4D8',           // Vibrant teal - secondary brand
  tealLight: '#90E0EF',      // Light teal for backgrounds
  tealDark: '#0077B6',       // Dark teal for contrast

  // Healthcare Greens (status/health)
  green: '#06D6A0',          // Success / healthy status
  greenDark: '#048A70',      // Darker green
  greenLight: '#CCFBEE',     // Very light green for badges

  // Warnings & Alerts
  orange: '#FB8500',         // Warning
  orangeLight: '#FFE4B5',    // Light orange

  // Emergency
  red: '#EF233C',            // Emergency/critical
  redLight: '#FFE0E5',       // Light red for badges
  
  // Neutrals
  white: '#FFFFFF',
  offWhite: '#F8FAFD',
  lightGray: '#F1F5F9',
  gray100: '#E8EEF7',
  gray200: '#CBD5E1',
  gray300: '#94A3B8',
  gray400: '#64748B',
  gray500: '#475569',
  gray600: '#334155',
  dark: '#0F172A',
  darkSecondary: '#1E293B',

  // Text Colors
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textWhite: '#FFFFFF',
  textWhiteMuted: 'rgba(255,255,255,0.75)',

  // Background Colors
  background: '#F0F4FF',
  backgroundCard: '#FFFFFF',
  backgroundDark: '#0A2463',

  // Status Colors
  statusOnline: '#06D6A0',
  statusOffline: '#94A3B8',
  statusWarning: '#FB8500',
  statusCritical: '#EF233C',

  // Gradients (used with LinearGradient)
  gradientPrimary: ['#0A2463', '#1E4DB7'],
  gradientTeal: ['#0077B6', '#00B4D8'],
  gradientHero: ['#0A2463', '#0077B6', '#00B4D8'],
  gradientCard: ['#FFFFFF', '#F8FAFD'],
  gradientGreen: ['#048A70', '#06D6A0'],
  gradientRed: ['#C1121F', '#EF233C'],
};

export default Colors;
