// Animated card with entrance and press effects

import { Pressable, StyleSheet, type ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { useEntryAnimation } from '../hooks/use-entry'
import { usePressAnimation } from '../hooks/use-press'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const AnimatedView = Animated.createAnimatedComponent(Animated.View)

interface AnimatedCardProps {
  children: React.ReactNode
  onPress?: () => void
  delay?: number
  style?: ViewStyle
}

export function AnimatedCard({ children, onPress, delay = 0, style }: AnimatedCardProps) {
  const { animatedStyle: entryStyle } = useEntryAnimation({ delay, initialY: 30 })
  const { animatedStyle: pressStyle, handlers } = usePressAnimation({ scale: 0.98 })

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlers.onPressIn}
        onPressOut={handlers.onPressOut}
        style={[entryStyle, pressStyle, styles.card, style]}
      >
        {children}
      </AnimatedPressable>
    )
  }

  return <AnimatedView style={[entryStyle, styles.card, style]}>{children}</AnimatedView>
}

// Loading skeleton component
export function SkeletonLoader({
  width,
  height,
  style,
}: {
  width: number
  height: number
  style?: ViewStyle
}) {
  const { animatedStyle } = useEntryAnimation({ initialOpacity: 0.3 })

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#E5E5EA',
          borderRadius: 8,
        },
        animatedStyle,
        style,
      ]}
    />
  )
}

// Empty state component with bob animation
export function AnimatedEmptyState({
  title,
  message,
  icon = '📋',
}: {
  title: string
  message: string
  icon?: string
}) {
  const { animatedStyle } = useEntryAnimation({ initialY: -10 })
  const bounceValue = useSharedValue(0)

  const bobStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: Math.sin(bounceValue.value) * 5 }],
    }
  })

  return (
    <AnimatedView style={[animatedStyle, styles.emptyContainer]}>
      <Animated.Text style={[styles.emptyIcon, bobStyle]}>{icon}</Animated.Text>
      <Animated.Text style={styles.emptyTitle}>{title}</Animated.Text>
      <Animated.Text style={styles.emptyMessage}>{message}</Animated.Text>
    </AnimatedView>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
})
