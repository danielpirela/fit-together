import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { type SpringPreset, springPresets } from '../utils/spring-presets'

interface UsePressAnimationOptions {
  scale?: number
  opacity?: number
  preset?: SpringPreset
}

export function usePressAnimation(options: UsePressAnimationOptions = {}) {
  const { scale = 0.97, opacity = 0.8, preset = 'snappy' } = options

  const isPressed = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    const scaleValue = isPressed.value === 1 ? scale : 1
    const opacityValue = isPressed.value === 1 ? opacity : 1

    return {
      transform: [{ scale: withSpring(scaleValue, springPresets[preset]) }],
      opacity: withSpring(opacityValue, springPresets[preset]),
    }
  })

  const handlePressIn = () => {
    isPressed.value = 1
  }

  const handlePressOut = () => {
    isPressed.value = 0
  }

  return {
    animatedStyle,
    isPressed,
    handlers: {
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
    },
  }
}

// Specialized button press animation
export function useButtonPress() {
  const scale = useSharedValue(1)
  const bgOpacity = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value, springPresets.snappy) }],
      opacity: bgOpacity.value,
    }
  })

  const onPressIn = () => {
    scale.value = 0.96
    bgOpacity.value = 0.9
  }

  const onPressOut = () => {
    scale.value = 1
    bgOpacity.value = 1
  }

  return { animatedStyle, onPressIn, onPressOut, scale }
}

// Hook for tap ripple effect (coordinates stored)
export function useRippleEffect() {
  const rippleScale = useSharedValue(0)
  const rippleOpacity = useSharedValue(0)
  const rippleX = useSharedValue(0)
  const rippleY = useSharedValue(0)

  const rippleStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: rippleScale.value }],
      opacity: rippleOpacity.value,
      left: rippleX.value,
      top: rippleY.value,
    }
  })

  const triggerRipple = (x: number, y: number) => {
    rippleX.value = x
    rippleY.value = y
    rippleScale.value = 0
    rippleOpacity.value = 0.3

    rippleScale.value = withSpring(2.5, { damping: 15, stiffness: 200 })
    rippleOpacity.value = withSpring(0, { damping: 20, stiffness: 100 })
  }

  return { rippleStyle, triggerRipple }
}
