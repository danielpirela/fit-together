// Common easing functions for animation utilities

import type { Easing } from './spring-presets'

export function getEasingFunction(easing: Easing): readonly [number, number, number, number] {
  switch (easing) {
    case 'easeInOut':
      return [0.4, 0, 0.2, 1]
    case 'easeOut':
      return [0, 0, 0.2, 1]
    case 'easeIn':
      return [0.4, 0, 1, 1]
    case 'springIn':
      return [0.175, 0.885, 0.32, 1.275]
    case 'springOut':
      return [0.68, -0.55, 0.265, 1.55]
    case 'bounceOut':
      return [0.34, 1.56, 0.64, 1]
    default:
      return [0, 0, 1, 1]
  }
}

// Stagger delay calculator for list items
export function getStaggerDelay(index: number, baseDelay: number = 50): number {
  return index * baseDelay
}

// Duration with minimum of 100ms
export function clampDuration(duration: number, min = 100, max = 2000): number {
  return Math.max(min, Math.min(max, duration))
}
