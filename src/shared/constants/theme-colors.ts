// Design tokens for colors following Apple HIG
// These constants are used across the application

export const Colors = {
  // Primary - Couple Colors
  green: {
    primary: '#34C759',
    light: '#A8E6CF',
    dark: '#248A3D',
  },
  purple: {
    primary: '#AF52DE',
    light: '#D4A5E8',
    dark: '#8A2BE2',
  },
  // Semantic
  red: {
    completion: '#FF3B30',
    light: '#FF6961',
    dark: '#CC2F26',
  },
  // iOS System Colors
  system: {
    blue: '#007AFF',
    green: '#34C759',
    indigo: '#5856D6',
    orange: '#FF9500',
    pink: '#FF2D55',
    purple: '#AF52DE',
    red: '#FF3B30',
    teal: '#5AC8FA',
    yellow: '#FFCC00',
  },
  // Neutral Scale
  gray: {
    50: '#F2F2F7',
    100: '#E5E5EA',
    200: '#D1D1D6',
    300: '#C7C7CC',
    400: '#8E8E93',
    500: '#636366',
    600: '#48484A',
    700: '#3A3A3C',
    800: '#2C2C2E',
    900: '#1C1C1E',
  },
  // Background
  background: {
    primary: '#F2F2F7',
    surface: '#FFFFFF',
    secondary: '#F2F2F7',
  },
  // Text
  text: {
    primary: '#000000',
    secondary: '#8E8E93',
    tertiary: '#C7C7CC',
  },
  // Border
  border: {
    default: '#D1D1D6',
    light: '#E5E5EA',
  },
} as const

export const GridColors = {
  both: { topLeft: '#34C759', bottomRight: '#AF52DE' },
  mineOnly: '#34C759',
  partnerOnly: '#AF52DE',
  none: '#E5E5EA',
  future: '#F2F2F7',
} as const

export const HabitColors = [
  { name: 'Green', value: '#34C759' },
  { name: 'Purple', value: '#AF52DE' },
  { name: 'Blue', value: '#007AFF' },
  { name: 'Orange', value: '#FF9500' },
  { name: 'Red', value: '#FF3B30' },
  { name: 'Teal', value: '#5AC8FA' },
] as const

export const HabitIcons = ['✓', '💪', '🏃', '📚', '💧', '🧘', '😴', '🍎', '💊', '🎯'] as const

export default Colors
