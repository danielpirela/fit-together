// TextInput component following Apple HIG
// 44pt minimum height, multiple states

import { useState } from 'react'
import {
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  type StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native'
import Colors from '@/shared/constants/theme-colors'
import { BorderRadius, Spacing } from '@/shared/constants/theme-spacing'

interface TextInputProps extends Omit<RNTextInputProps, 'style'> {
  label?: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  error?: string
  helper?: string
  secureTextEntry?: boolean
  keyboardType?: 'default' | 'email-address' | 'numeric'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'
  autoCorrect?: boolean
  editable?: boolean
  maxLength?: number
  containerStyle?: StyleProp<ViewStyle>
}

export function TextInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helper,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
  editable = true,
  maxLength,
  containerStyle,
  ...rest
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const wrapperStyle = [
    styles.container,
    isFocused && styles.focused,
    error && styles.error,
    !editable && styles.disabled,
    containerStyle,
  ]

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={wrapperStyle}>
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray[400]}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          maxLength={maxLength}
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helper && !error && <Text style={styles.helperText}>{helper}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  container: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.background.surface,
    paddingHorizontal: Spacing.md,
  },
  focused: {
    borderColor: Colors.green.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: Colors.red.completion,
    borderWidth: 2,
  },
  disabled: {
    backgroundColor: Colors.gray[50],
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    padding: 0,
  },
  errorText: {
    fontSize: 12,
    color: Colors.red.completion,
    marginTop: Spacing.xs,
  },
  helperText: {
    fontSize: 12,
    color: Colors.gray[400],
    marginTop: Spacing.xs,
  },
})
