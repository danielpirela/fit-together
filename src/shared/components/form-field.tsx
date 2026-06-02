// FormField wrapper component
// Combines label, input, error, and helper text

import type { ReactNode } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Colors from '@/shared/constants/theme-colors'
import { Spacing } from '@/shared/constants/theme-spacing'

interface FormFieldProps {
  label: string
  error?: string
  helper?: string
  required?: boolean
  children: ReactNode
}

export function FormField({ label, error, helper, required, children }: FormFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {children}
      {error && <Text style={styles.error}>{error}</Text>}
      {helper && !error && <Text style={styles.helper}>{helper}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  required: {
    color: Colors.red.completion,
  },
  error: {
    fontSize: 12,
    color: Colors.red.completion,
    marginTop: Spacing.xs,
  },
  helper: {
    fontSize: 12,
    color: Colors.gray[400],
    marginTop: Spacing.xs,
  },
})
