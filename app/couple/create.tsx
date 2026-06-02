// Create couple screen
// Create new couple partnership

import { useRouter } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button } from '@/shared/components/button'
import { FormField } from '@/shared/components/form-field'
import { TextInput } from '@/shared/components/text-input'
import Colors from '@/shared/constants/theme-colors'
import { Spacing } from '@/shared/constants/theme-spacing'
import { useAuthStore } from '@/stores/auth-store'
import { useCoupleStore } from '@/stores/couple-store'

export default function CreateCoupleScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { createCouple, isLoading, error, clearError } = useCoupleStore()

  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')

  const validateForm = () => {
    let valid = true
    setNameError('')

    if (!name.trim()) {
      setNameError('Couple name is required')
      valid = false
    } else if (name.trim().length < 2) {
      setNameError('Couple name must be at least 2 characters')
      valid = false
    } else if (name.trim().length > 100) {
      setNameError('Couple name must be less than 100 characters')
      valid = false
    }

    return valid
  }

  const handleSubmit = async () => {
    clearError()
    if (!validateForm()) return
    if (!user) return

    try {
      await createCouple(name.trim(), user.id)
      // After creating couple, navigate to profile to invite partner
      router.replace('/(tabs)/profile')
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
          <Text style={styles.title}>Create Your Couple</Text>
          <Text style={styles.subtitle}>Give your partnership a name</Text>
        </View>

        <View style={styles.form}>
          <FormField label="Couple Name" error={nameError || error || undefined} required>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g., Smith Family"
              autoCapitalize="words"
              error={nameError || error || undefined}
            />
          </FormField>

          <View style={styles.info}>
            <Text style={styles.infoText}>
              You'll be Partner A. After creating, you can invite your partner to join.
            </Text>
          </View>

          <Button
            title="Create Couple"
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
            size="large"
          />
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
  info: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
})
