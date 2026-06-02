// Login form component with validation
import { useCallback, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { router } from 'expo-router'
import { Button } from '@/shared/components/button'
import { FormField } from '@/shared/components/form-field'
import { TextInput } from '@/shared/components/text-input'
import { useAuth } from '../hooks/use-auth'

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { signIn, isLoading, error, clearError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = useCallback(() => {
    const newErrors: { email?: string; password?: string } = {}

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [email, password])

  const handleSubmit = useCallback(async () => {
    clearError()
    if (!validate()) return

    try {
      await signIn(email, password)
      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in'
      Alert.alert('Error', message)
    }
  }, [email, password, signIn, validate, clearError, onSuccess])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to continue tracking with your partner</Text>

      <FormField label="Email">
        <TextInput
          placeholder="you@example.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text)
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
          }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </FormField>

      <FormField label="Password">
        <TextInput
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => {
            setPassword(text)
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
          }}
          error={errors.password}
          secureTextEntry
        />
      </FormField>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title="Sign In"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        fullWidth
        size="large"
      />

      <View style={styles.links}>
        <Pressable onPress={() => router.push('/auth/sign-up')}>
          <Text style={styles.link}>Don't have an account? Sign Up</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/auth/reset-password')}>
          <Text style={styles.link}>Forgot your password?</Text>
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
    gap: 12,
  },
  link: {
    color: '#007a5e',
    fontSize: 14,
    textAlign: 'center',
  },
})