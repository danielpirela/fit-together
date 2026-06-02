// Shake animation hook for error feedback

import { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated'

interface UseShakeOptions {
  intensity?: number
}

export function useShake(options: UseShakeOptions = {}) {
  const { intensity = 10 } = options
  const translateX = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    }
  })

  const shake = () => {
    translateX.value = withSequence(
      withTiming(-intensity, { duration: 50 }),
      withTiming(intensity, { duration: 50 }),
      withTiming(-intensity * 0.5, { duration: 50 }),
      withTiming(intensity * 0.5, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    )
  }

  const reset = () => {
    translateX.value = 0
  }

  return { animatedStyle, shake, reset, translateX }
}

// Rotation shake variant
export function useRotationShake(options: { intensity?: number } = {}) {
  const { intensity = 3 } = options
  const rotation = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    }
  })

  const shake = () => {
    rotation.value = withSequence(
      withTiming(-intensity, { duration: 50 }),
      withTiming(intensity, { duration: 50 }),
      withTiming(-intensity * 0.5, { duration: 50 }),
      withTiming(intensity * 0.5, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    )
  }

  return { animatedStyle, shake, rotation }
}
