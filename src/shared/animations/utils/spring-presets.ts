// Spring animation presets for consistent, natural-feeling animations

export const springPresets = {
  // Gentle bounce - for subtle interactions
  gentle: {
    damping: 15,
    stiffness: 100,
    mass: 1,
  },

  // Bouncy - for celebration and emphasis
  bouncy: {
    damping: 10,
    stiffness: 150,
    mass: 0.8,
  },

  // Smooth - for general purpose transitions
  smooth: {
    damping: 20,
    stiffness: 90,
    mass: 1,
  },

  // Snappy - for quick, responsive feedback
  snappy: {
    damping: 12,
    stiffness: 180,
    mass: 0.9,
  },

  // Very bouncy - for playful elements
  playful: {
    damping: 8,
    stiffness: 200,
    mass: 0.7,
  },

  // Slow and smooth - for page transitions
  slow: {
    damping: 25,
    stiffness: 60,
    mass: 1.2,
  },
} as const

export type SpringPreset = keyof typeof springPresets

// Duration presets (approximate, actual depends on spring)
export const durationPresets = {
  micro: 150, // Micro-interactions (button press)
  short: 200, // Quick feedback
  normal: 300, // Standard transitions
  medium: 400, // Page elements
  long: 500, // Full transitions
  celebration: 1000, // Celebration animations
} as const

export type DurationPreset = keyof typeof durationPresets

// Easing functions for non-spring animations
export const easings = {
  // Apple standard curves
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],

  // Spring-like
  springIn: [0.175, 0.885, 0.32, 1.275],
  springOut: [0.68, -0.55, 0.265, 1.55],

  // Bounce
  bounceOut: [0.34, 1.56, 0.64, 1],

  // Linear for some cases
  linear: [0, 0, 1, 1],
} as const

export type Easing = keyof typeof easings
