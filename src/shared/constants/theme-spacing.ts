// Spacing constants following 4pt grid system
// These tokens maintain consistent spacing across the app

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const

export const TouchTarget = {
  minimum: 44,
  small: 32,
  medium: 40,
  large: 52,
} as const

export const GridLayout = {
  cellSize: 12,
  cellGap: 3,
  legendHeight: 24,
} as const

export default { Spacing, BorderRadius, TouchTarget, GridLayout }
