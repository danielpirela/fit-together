// Spring animation hook with reusable presets

import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { type SpringPreset, springPresets } from '../utils/spring-presets'

interface UseSpringAnimationOptions {
  initialValue?: number
  preset?: SpringPreset
}

interface UseSpringAnimationReturn {
  value: ReturnType<typeof useSharedValue<number>>
  animatedStyle: ReturnType<typeof useAnimatedStyle>
  animateTo: (toValue: number) => void
  reset: () => void
}

export function useSpringAnimation(
  options: UseSpringAnimationOptions = {},
): UseSpringAnimationReturn {
  const { initialValue = 0, preset = 'smooth' } = options

  const value = useSharedValue(initialValue)
  const presetConfig = springPresets[preset]

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: value.value }],
      opacity: value.value > 0 ? 1 : 0,
    }
  })

  const animateTo = (toValue: number) => {
    value.value = withSpring(toValue, presetConfig)
  }

  const reset = () => {
    value.value = withSpring(initialValue, presetConfig)
  }

  return { value, animatedStyle, animateTo, reset }
}

// Specialized hook for press animations
export function usePressScale(options: { scale?: number; preset?: SpringPreset } = {}) {
  const { scale = 0.97, preset = 'snappy' } = options
  const isPressed = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    const scaleValue = isPressed.value === 1 ? scale : 1
    return {
      transform: [{ scale: withSpring(scaleValue, springPresets[preset]) }],
    }
  })

  const onPressIn = () => {
    isPressed.value = 1
  }

  const onPressOut = () => {
    isPressed.value = 0
  }

  return { animatedStyle, onPressIn, onPressOut, isPressed }
}

// Specialized hook for bounce animations
export function useBounceAnimation(options: { targetScale?: number; preset?: SpringPreset } = {}) {
  const { targetScale = 1.1, preset = 'bouncy' } = options
  const bounceValue = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(bounceValue.value, springPresets[preset]) }],
    }
  })

  const bounce = (toValue: number = targetScale) => {
    bounceValue.value = toValue
    setTimeout(() => {
      bounceValue.value = 1
    }, 150)
  }

  const reset = () => {
    bounceValue.value = 1
  }

  return { animatedStyle, bounce, reset, bounceValue }
}

// Specialized hook for entry animations (fade + translate)
export function useEntryAnimation(
  options: {
    initialY?: number
    initialOpacity?: number
    delay?: number
    preset?: SpringPreset
  } = {},
) {
  const { initialY = 20, delay = 0, preset = 'smooth' } = options

  const animatedValue = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedValue.value,
      transform: [
        { translateY: withSpring((1 - animatedValue.value) * initialY, springPresets[preset]) },
      ],
    }
  })

  const startAnimation = (customDelay?: number) => {
    const finalDelay = customDelay ?? delay
    if (finalDelay > 0) {
      setTimeout(() => {
        animatedValue.value = withSpring(1, springPresets[preset])
      }, finalDelay)
    } else {
      animatedValue.value = withSpring(1, springPresets[preset])
    }
  }

  const reset = () => {
    animatedValue.value = 0
  }

  return { animatedStyle, startAnimation, reset, animatedValue }
}
