// Habit form component for creating/editing habits
import { useCallback, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button } from '@/shared/components/button'
import { FormField } from '@/shared/components/form-field'
import { TextInput } from '@/shared/components/text-input'
import { ColorPicker } from '@/shared/components/color-picker'
import { IconPicker } from '@/shared/components/icon-picker'
import { DaySelector } from '@/shared/components/day-selector'
import { useHabits } from '../hooks/use-habits'
import Colors from '@/shared/constants/theme-colors'
import { Spacing } from '@/shared/constants/theme-spacing'
import type { Database } from '@/lib/supabase'

type HabitRow = Database['public']['Tables']['habits']['Row']

type FrequencyType = 'daily' | 'weekly' | 'custom'

// Helper to convert number array to string array for target_days
const DAY_NUMBERS_TO_STRINGS: Record<number, string> = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thu',
  5: 'fri',
  6: 'sat',
}

// Default all days as strings
const DEFAULT_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']

interface HabitFormProps {
  habit?: HabitRow // If provided, we're editing
  coupleId: string
  onSuccess?: () => void
  onCancel?: () => void
}

const DEFAULT_COLOR = Colors.green.primary
const DEFAULT_ICON = '✓'

export function HabitForm({ habit, coupleId, onSuccess, onCancel }: HabitFormProps) {
  const { createHabit, updateHabit, deleteHabit } = useHabits()
  const storeIsLoading = false // Could get from store

  // Convert frequency string to FrequencyType
  const frequencyFromHabit = habit?.frequency as FrequencyType | undefined

  const [name, setName] = useState(habit?.name || '')
  const [icon, setIcon] = useState(habit?.icon || DEFAULT_ICON)
  const [color, setColor] = useState(habit?.color || DEFAULT_COLOR)
  const [frequency, setFrequency] = useState<FrequencyType>(frequencyFromHabit || 'daily')

  // Convert stored string days to numbers for DaySelector
  const initialDays = habit?.target_days
    ? habit.target_days.map((d, i) => {
        // If it's a number, use it directly; if string, convert
        if (typeof d === 'number') return d
        const dayIndex = DEFAULT_DAYS.indexOf(d)
        return dayIndex >= 0 ? dayIndex : i
      })
    : [0, 1, 2, 3, 4, 5, 6]

  const [selectedDays, setSelectedDays] = useState<number[]>(initialDays)
  const [errors, setErrors] = useState<{ name?: string }>({})

  const isEditing = !!habit

  const validate = useCallback(() => {
    const newErrors: { name?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Habit name is required'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Habit name must be at least 2 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [name])

  const handleSubmit = useCallback(async () => {
    if (!validate()) return

    try {
      // Convert selected days to strings
      const targetDays =
        frequency === 'custom'
          ? selectedDays.map((d) => DAY_NUMBERS_TO_STRINGS[d] || DEFAULT_DAYS[d])
          : DEFAULT_DAYS

      const habitData = {
        couple_id: coupleId,
        name: name.trim(),
        icon,
        color,
        frequency,
        target_days: targetDays,
        target_count: 1,
        created_by: '', // Would get from auth
        description: null,
        is_active: true,
      }

      if (isEditing && habit) {
        await updateHabit(habit.id, habitData)
      } else {
        await createHabit(habitData)
      }

      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save habit'
      Alert.alert('Error', message)
    }
  }, [
    name,
    icon,
    color,
    frequency,
    selectedDays,
    coupleId,
    isEditing,
    habit,
    createHabit,
    updateHabit,
    validate,
    onSuccess,
  ])

  const handleDelete = useCallback(() => {
    if (!habit) return

    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteHabit(habit.id)
            onSuccess?.()
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to delete habit'
            Alert.alert('Error', message)
          }
        },
      },
    ])
  }, [habit, deleteHabit, onSuccess])

  const handleCancel = useCallback(() => {
    onCancel?.()
  }, [onCancel])

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>{isEditing ? 'Edit Habit' : 'New Habit'}</Text>

      <FormField label="Habit Name">
        <TextInput
          placeholder="e.g., Exercise, Read, Meditate"
          value={name}
          onChangeText={(text) => {
            setName(text)
            if (errors.name) setErrors({ name: undefined })
          }}
          error={errors.name}
          autoCapitalize="sentences"
        />
      </FormField>

      <FormField label="Icon">
        <IconPicker selectedIcon={icon} onChange={setIcon} />
      </FormField>

      <FormField label="Color">
        <ColorPicker selectedColor={color} onChange={setColor} />
      </FormField>

      <FormField label="Frequency">
        <View style={styles.frequencyButtons}>
          {(['daily', 'weekly', 'custom'] as FrequencyType[]).map((f) => (
            <Button
              key={f}
              title={f.charAt(0).toUpperCase() + f.slice(1)}
              variant={frequency === f ? 'primary' : 'secondary'}
              size="small"
              onPress={() => setFrequency(f)}
              style={styles.frequencyButton}
            />
          ))}
        </View>
      </FormField>

      {frequency === 'custom' && (
        <FormField label="Days">
          <DaySelector selectedDays={selectedDays} onChange={setSelectedDays} />
        </FormField>
      )}

      <View style={styles.actions}>
        <Button
          title={isEditing ? 'Save Changes' : 'Create Habit'}
          onPress={handleSubmit}
          loading={storeIsLoading}
          disabled={storeIsLoading}
          fullWidth
          size="large"
        />

        <Button
          title="Cancel"
          variant="ghost"
          onPress={handleCancel}
          disabled={storeIsLoading}
          fullWidth
        />

        {isEditing && (
          <Button
            title="Delete Habit"
            variant="destructive"
            onPress={handleDelete}
            loading={storeIsLoading}
            fullWidth
          />
        )}
      </View>
    </ScrollView>
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
    marginBottom: 24,
  },
  frequencyButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  frequencyButton: {
    flex: 1,
  },
  actions: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
})
