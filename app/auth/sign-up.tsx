// Sign up screen
// Create new account with display name, email, and password

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

export default function SignUpScreen() {
  const router = useRouter()
  const { signUp, isLoading, error, clearError } = useAuthStore()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [errors, setErrors] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const validateForm = () => {
    let valid = true
    const newErrors = {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }

    if (!displayName.trim()) {
      newErrors.displayName = 'Display name is required'
      valid = false
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters'
      valid = false
    } else if (displayName.trim().length > 50) {
      newErrors.displayName = 'Display name must be less than 50 characters'
      valid = false
    }

    if (!email) {
      newErrors.email = 'Email is required'
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
      valid = false
    }

    if (!password) {
      newErrors.password = 'Password is required'
      valid = false
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
      valid = false
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least 1 uppercase letter'
      valid = false
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least 1 number'
      valid = false
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
      valid = false
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async () => {
    clearError()
    if (!validateForm()) return

    try {
      await signUp(email, password, displayName.trim())
      // After signup, navigate to create couple screen
      router.replace('/couple/create')
    } catch (_e) {
      // Error is handled by store
    }
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start tracking habits together</Text>
        </View>

        <View style={styles.form}>
          <FormField label="Display Name" error={errors.displayName || undefined} required>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="How should we call you?"
              autoCapitalize="words"
              error={errors.displayName || undefined}
            />
          </FormField>

          <FormField label="Email" error={errors.email || undefined} required>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email || undefined}
            />
          </FormField>

          <FormField
            label="Password"
            error={errors.password || undefined}
            helper="At least 8 characters with 1 uppercase and 1 number"
            required
          >
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              error={errors.password || undefined}
            />
          </FormField>

          <FormField
            label="Confirm Password"
            error={errors.confirmPassword || error || undefined}
            required
          >
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              error={errors.confirmPassword || error || undefined}
            />
          </FormField>

          <Button
            title="Create Account"
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
            size="large"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  linkInline: {
    padding: Spacing.xs,
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
})
