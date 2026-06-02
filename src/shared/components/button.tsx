// Button component following Apple HIG
// 44pt minimum touch target, multiple variants

import type { ReactNode } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native'
import Colors from '@/shared/constants/theme-colors'
import { BorderRadius, Spacing, TouchTarget } from '@/shared/constants/theme-spacing'

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost'
export type ButtonSize = 'small' | 'medium' | 'large'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode
  fullWidth?: boolean
  style?: object
}

const VARIANT_STYLES: Record<ButtonVariant, { container: object; text: object }> = {
  primary: {
    container: { backgroundColor: Colors.green.primary },
    text: { color: '#FFFFFF' },
  },
  secondary: {
    container: {
      backgroundColor: Colors.background.surface,
      borderWidth: 1,
      borderColor: Colors.border.default,
    },
    text: { color: Colors.text.primary },
  },
  destructive: {
    container: { backgroundColor: Colors.red.completion },
    text: { color: '#FFFFFF' },
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: Colors.green.primary },
  },
}

const SIZE_STYLES: Record<ButtonSize, { height: number; paddingH: number; fontSize: number }> = {
  small: { height: TouchTarget.small, paddingH: Spacing.md, fontSize: 14 },
  medium: { height: TouchTarget.minimum, paddingH: Spacing.lg, fontSize: 16 },
  large: { height: TouchTarget.large, paddingH: Spacing.xl, fontSize: 17 },
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const variantStyles = VARIANT_STYLES[variant]
  const sizeStyles = SIZE_STYLES[size]

  const getContainerStyle = (pressed: boolean) => {
    const baseStyle = {
      ...styles.container,
      ...(variantStyles.container as object),
      height: sizeStyles.height,
      paddingHorizontal: sizeStyles.paddingH,
    }

    return [
      baseStyle,
      fullWidth && styles.fullWidth,
      disabled && styles.disabled,
      pressed && styles.pressed,
      style,
    ]
  }

  const textStyle = [
    styles.text,
    variantStyles.text,
    { fontSize: sizeStyles.fontSize },
    disabled && styles.disabledText,
  ]

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => getContainerStyle(pressed)}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            color={
              variant === 'secondary' || variant === 'ghost' ? Colors.green.primary : '#FFFFFF'
            }
            size="small"
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={textStyle}>{title}</Text>
          </>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.6,
    transform: [{ scale: 0.98 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  text: {
    fontWeight: '600',
  },
  disabledText: {
    opacity: 0.7,
  },
})
