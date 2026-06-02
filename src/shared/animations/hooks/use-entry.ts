// Entry animation hooks for staggered list and page entrance

import { useEffect } from 'react'
import { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated'
import { type SpringPreset, springPresets } from '../utils/spring-presets'

interface UseEntryAnimationOptions {
  delay?: number
  preset?: SpringPreset
  initialY?: number
  initialOpacity?: number
}

export function useEntryAnimation(options: UseEntryAnimationOptions = {}) {
  const { delay = 0, preset = 'smooth', initialY = 30, initialOpacity = 0 } = options

  const progress = useSharedValue(initialOpacity)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        { translateY: (1 - progress.value) * initialY },
        { scale: 0.95 + progress.value * 0.05 },
      ],
    }
  })

  const start = () => {
    progress.value = withDelay(delay, withSpring(1, springPresets[preset]))
  }

  const startImmediate = () => {
    progress.value = withSpring(1, springPresets[preset])
  }

  return { animatedStyle, start, startImmediate, progress }
}

// Hook for single list item with auto-stagger index
export function useListItemAnimation(
  index: number,
  baseDelay: number = 50,
  options: UseEntryAnimationOptions = {},
) {
  const delay = (options.delay ?? 0) + index * baseDelay
  return useEntryAnimation({ ...options, delay })
}

// Hook for fade in on mount
export function useFadeIn(delay: number = 0) {
  const opacity = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value }
  })

  useEffect(() => {
    opacity.value = withDelay(delay, withSpring(1, { damping: 20, stiffness: 90 }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay, opacity])

  return { animatedStyle, opacity }
}

// Hook for slide in from direction
export function useSlideIn(direction: 'left' | 'right' | 'up' | 'down' = 'up', delay: number = 0) {
  const translations = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 30 },
    down: { x: 0, y: -30 },
  }

  const { x, y } = translations[direction]
  const progress = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      transform: [
        { translateX: (1 - progress.value) * x },
        { translateY: (1 - progress.value) * y },
      ],
    }
  })

  const start = () => {
    progress.value = withDelay(delay, withSpring(1, springPresets.smooth))
  }

  return { animatedStyle, start, progress }
}

// Factory function to create stagger animation state
// Call this outside of the component to get initial shared values
export function createStaggerAnimation(itemCount: number) {
  const progresses = Array.from({ length: itemCount }, () => useSharedValue(0))

  const startAll = (baseDelay: number = 50) => {
    progresses.forEach((progress, index) => {
      progress.value = withDelay(index * baseDelay, withSpring(1, springPresets.smooth))
    })
  }

  const resetAll = () => {
    progresses.forEach((progress) => {
      progress.value = 0
    })
  }

  return { progresses, startAll, resetAll }
}
