// Reset password screen
// Send password reset email

import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Button } from '@/shared/components/button'
import { FormField } from '@/shared/components/form-field'
import { TextInput } from '@/shared/components/text-input'
import Colors from '@/shared/constants/theme-colors'
import { Spacing } from '@/shared/constants/theme-spacing'
import { useAuthStore } from '@/stores/auth-store'

export default function ResetPasswordScreen() {
  const router = useRouter()
  const { resetPassword, isLoading, error, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [success, setSuccess] = useState(false)

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required')
      return false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  const handleSubmit = async () => {
    clearError()
    if (!validateEmail()) return

    try {
      await resetPassword(email)
      setSuccess(true)
    } catch (_e) {
      // Error is handled by store
    }
  }

  if (success) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>📧</Text>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successText}>
              We've sent password reset instructions to {email}
            </Text>
            <Pressable onPress={() => router.push('/auth/login')} style={styles.linkButton}>
              <Text style={styles.linkTextBold}>Back to Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you instructions to reset your password.
          </Text>
        </View>

        <View style={styles.form}>
          <FormField label="Email" error={emailError || error || undefined}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={emailError || error || undefined}
            />
          </FormField>

          <Button
            title="Send Reset Email"
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
            size="large"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password?</Text>
          <Pressable onPress={() => router.push('/auth/login')} style={styles.linkInline}>
            <Text style={styles.linkTextBold}>Sign In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  linkInline: {
    padding: Spacing.xs,
  },
  linkButton: {
    marginTop: Spacing.lg,
    padding: Spacing.sm,
  },
  linkTextBold: {
    fontSize: 14,
    color: Colors.green.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: Spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  successText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
})
