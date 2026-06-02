// Animated button with press feedback and haptic feedback

import { Pressable, StyleSheet, Text } from 'react-native'
import Animated from 'react-native-reanimated'
import { useButtonPress } from '../hooks/use-press'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

interface AnimatedButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  icon?: string
  fullWidth?: boolean
}

const variants = {
  primary: {
    bg: '#34C759',
    text: '#FFFFFF',
    border: 'transparent',
  },
  secondary: {
    bg: '#FFFFFF',
    text: '#000000',
    border: '#D1D1D6',
  },
  destructive: {
    bg: '#FF3B30',
    text: '#FFFFFF',
    border: 'transparent',
  },
  ghost: {
    bg: 'transparent',
    text: '#34C759',
    border: 'transparent',
  },
}

const sizes = {
  small: { height: 32, paddingH: 12, fontSize: 14 },
  medium: { height: 44, paddingH: 16, fontSize: 16 },
  large: { height: 52, paddingH: 20, fontSize: 17 },
}

export function AnimatedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
}: AnimatedButtonProps) {
  const { animatedStyle, onPressIn, onPressOut } = useButtonPress()
  const style = sizes[size]
  const colors = variants[variant]

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || loading}
      style={[
        animatedStyle,
        {
          height: style.height,
          paddingHorizontal: style.paddingH,
          backgroundColor: colors.bg,
          borderWidth: variant === 'secondary' ? 1 : 0,
          borderColor: colors.border,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          opacity: disabled ? 0.5 : 1,
        },
        fullWidth && { width: '100%' },
      ]}
    >
      {loading ? (
        <Animated.Text style={[styles.text, { fontSize: style.fontSize, color: colors.text }]}>
          ...
        </Animated.Text>
      ) : (
        <>
          {icon && (
            <Animated.Text
              style={[styles.text, styles.icon, { fontSize: style.fontSize, color: colors.text }]}
            >
              {icon}
            </Animated.Text>
          )}
          <Text style={[styles.text, { fontSize: style.fontSize, color: colors.text }]}>
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  )
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
})
