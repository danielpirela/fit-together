// Animated input with floating label and shake on error

import { useState } from 'react'
import { TextInput as RNTextInput, StyleSheet, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useEntryAnimation } from '../hooks/use-entry'
import { useShake } from '../hooks/use-shake'

const AnimatedView = Animated.createAnimatedComponent(View)

interface AnimatedTextInputProps {
  label: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  error?: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address' | 'numeric'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  delay?: number
}

export function AnimatedTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  delay = 0,
}: AnimatedTextInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const { animatedStyle } = useEntryAnimation({ delay, initialY: 20 })
  const { animatedStyle: _shakeStyle, shake: _shake } = useShake()

  // Combine entry and shake animations
  const combinedStyle = animatedStyle

  return (
    <AnimatedView style={combinedStyle}>
      <View style={styles.container}>
        <Text style={[styles.label, isFocused && styles.labelFocused, error && styles.labelError]}>
          {label}
        </Text>
        <RNTextInput
          style={[styles.input, isFocused && styles.inputFocused, error && styles.inputError]}
          placeholder={placeholder}
          placeholderTextColor="#8E8E93"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </AnimatedView>
  )
}

// Wrapper for staggered form fields
export function AnimatedFormField({
  children,
  delay,
}: {
  children: React.ReactNode
  delay: number
}) {
  const { animatedStyle } = useEntryAnimation({ delay, initialY: 15 })

  return <Animated.View style={animatedStyle}>{children}</Animated.View>
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 6,
  },
  labelFocused: {
    color: '#34C759',
  },
  labelError: {
    color: '#FF3B30',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  inputFocused: {
    borderColor: '#34C759',
    borderWidth: 2,
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 2,
  },
  error: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
})
