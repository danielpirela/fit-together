// Create couple form component
import { useCallback, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { Button } from '@/shared/components/button'
import { FormField } from '@/shared/components/form-field'
import { TextInput } from '@/shared/components/text-input'
import { useCouple } from '../hooks/use-couple'
import { useAuthStore } from '@/stores/auth-store'

interface CreateCoupleFormProps {
  onSuccess?: () => void
}

export function CreateCoupleForm({ onSuccess }: CreateCoupleFormProps) {
  const { createCouple, isLoading, error, clearError } = useCouple()
  const authStore = useAuthStore()
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<{ name?: string }>({})

  const validate = useCallback(() => {
    const newErrors: { name?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Couple name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Couple name must be at least 2 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [name])

  const handleSubmit = useCallback(async () => {
    clearError()
    if (!validate()) return

    if (!authStore.user) {
      Alert.alert('Error', 'You must be signed in to create a couple')
      return
    }

    try {
      await createCouple(name.trim(), authStore.user.id)
      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create couple'
      Alert.alert('Error', message)
    }
  }, [name, createCouple, authStore.user, validate, clearError, onSuccess])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your Couple</Text>
      <Text style={styles.subtitle}>
        Give your partnership a name. You can invite your partner after.
      </Text>

      <FormField label="Couple Name">
        <TextInput
          placeholder="e.g., The Smiths, Us Two"
          value={name}
          onChangeText={(text) => {
            setName(text)
            if (errors.name) setErrors({ name: undefined })
          }}
          error={errors.name}
          autoCapitalize="words"
        />
      </FormField>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title="Create Couple"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        fullWidth
        size="large"
      />
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
})
