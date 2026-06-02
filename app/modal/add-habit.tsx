// Add habit modal
// Create new habit with form fields

import { useRouter } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button } from '@/shared/components/button'
import { ColorPicker } from '@/shared/components/color-picker'
import { DaySelector } from '@/shared/components/day-selector'
import { FormField } from '@/shared/components/form-field'
import { IconPicker } from '@/shared/components/icon-picker'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import { TextInput } from '@/shared/components/text-input'
import Colors from '@/shared/constants/theme-colors'
import { Spacing } from '@/shared/constants/theme-spacing'
import { useAuthStore } from '@/stores/auth-store'
import { useCoupleStore } from '@/stores/couple-store'
import { useHabitsStore } from '@/stores/habits-store'

export default function AddHabitScreen() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { couple } = useCoupleStore()
  const { createHabit, isLoading } = useHabitsStore()

  const [name, setName] = useState('')
  const [targetDays, setTargetDays] = useState<number[]>([1, 3, 5]) // Mon, Wed, Fri
  const [targetCount, setTargetCount] = useState('4')
  const [selectedColor, setSelectedColor] = useState<string>(Colors.green.primary)
  const [selectedIcon, setSelectedIcon] = useState('✓')

  const [errors, setErrors] = useState<{ name?: string; targetDays?: string }>({})

  const validateForm = () => {
    const newErrors: { name?: string; targetDays?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Habit name is required'
    } else if (name.trim().length > 100) {
      newErrors.name = 'Habit name must be less than 100 characters'
    }

    if (targetDays.length === 0) {
      newErrors.targetDays = 'Select at least one target day'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm() || !couple || !user) return

    try {
      await createHabit({
        couple_id: couple.id,
        name: name.trim(),
        description: null,
        color: selectedColor,
        icon: selectedIcon,
        frequency: 'weekly',
        target_days: targetDays.map(String),
        target_count: parseInt(targetCount, 10) || 4,
        created_by: user.id,
        is_active: true,
      })
      router.back()
    } catch (_err) {
      // Error handling
    }
  }

  if (!couple || !user) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Add Habit</Text>
        <Button title="Cancel" variant="ghost" onPress={() => router.back()} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField label="Habit Name" error={errors.name} required>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g., Morning Run"
            error={errors.name}
          />
        </FormField>

        <FormField label="Target Days" error={errors.targetDays} required>
          <DaySelector selectedDays={targetDays} onChange={setTargetDays} />
        </FormField>

        <FormField label="Weekly Goal" helper="How many times per week?">
          <View style={styles.goalContainer}>
            <TextInput
              value={targetCount}
              onChangeText={setTargetCount}
              keyboardType="numeric"
              containerStyle={styles.goalInput}
              placeholder="4"
            />
            <Text style={styles.goalLabel}>times per week</Text>
          </View>
        </FormField>

        <FormField label="Color">
          <ColorPicker selectedColor={selectedColor} onChange={setSelectedColor} />
        </FormField>

        <FormField label="Icon">
          <IconPicker selectedIcon={selectedIcon} onChange={setSelectedIcon} />
        </FormField>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Save Habit"
          onPress={handleSubmit}
          loading={isLoading}
          fullWidth
          size="large"
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  content: {
    padding: Spacing.lg,
  },
  goalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  goalInput: {
    width: 60,
    textAlign: 'center',
  },
  goalLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[100],
    backgroundColor: Colors.background.surface,
  },
})
