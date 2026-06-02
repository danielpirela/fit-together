// Sign up form component with validation
import { useCallback, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Button } from '@/shared/components/button'
import { FormField } from '@/shared/components/form-field'
import { TextInput } from '@/shared/components/text-input'
import { useAuth } from '../hooks/use-auth'

interface SignUpFormProps {
  onSuccess?: () => void
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { signUp, isLoading, error, clearError } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{
    displayName?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})

  const validate = useCallback(() => {
    const newErrors: typeof errors = {}

    // Display name validation
    if (!displayName.trim()) {
      newErrors.displayName = 'Display name is required'
    } else if (displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters'
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [displayName, email, password, confirmPassword])

  const handleSubmit = useCallback(async () => {
    clearError()
    if (!validate()) return

    try {
      await signUp(email, password, displayName.trim())
      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create account'
      Alert.alert('Error', message)
    }
  }, [email, password, displayName, signUp, validate, clearError, onSuccess])

  const updateField = useCallback(
    (field: keyof typeof errors) => (value: string) => {
      switch (field) {
        case 'displayName':
          setDisplayName(value)
          break
        case 'email':
          setEmail(value)
          break
        case 'password':
          setPassword(value)
          break
        case 'confirmPassword':
          setConfirmPassword(value)
          break
      }
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    },
    [errors],
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Start tracking habits together with your partner</Text>

      <FormField label="Display Name">
        <TextInput
          placeholder="How should we call you?"
          value={displayName}
          onChangeText={updateField('displayName')}
          error={errors.displayName}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </FormField>

      <FormField label="Email">
        <TextInput
          placeholder="you@example.com"
          value={email}
          onChangeText={updateField('email')}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </FormField>

      <FormField label="Password">
        <TextInput
          placeholder="At least 8 characters"
          value={password}
          onChangeText={updateField('password')}
          error={errors.password}
          secureTextEntry
        />
      </FormField>

      <FormField label="Confirm Password">
        <TextInput
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={updateField('confirmPassword')}
          error={errors.confirmPassword}
          secureTextEntry
        />
      </FormField>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title="Create Account"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        fullWidth
        size="large"
      />

      <View style={styles.links}>
        <Pressable onPress={() => router.push('/auth/login')}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  error: {
    color: '#dc3545',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  links: {
    marginTop: 24,
    alignItems: 'center',
  },
  link: {
    color: '#007a5e',
    fontSize: 14,
    textAlign: 'center',
  },
})