// Edit habit modal
// Edit or delete existing habit

import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Button } from '@/shared/components/button'
import { ColorPicker } from '@/shared/components/color-picker'
import { DaySelector } from '@/shared/components/day-selector'
import { FormField } from '@/shared/components/form-field'
import { IconPicker } from '@/shared/components/icon-picker'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import { TextInput } from '@/shared/components/text-input'
import Colors from '@/shared/constants/theme-colors'
import { Spacing } from '@/shared/constants/theme-spacing'
import { useHabitsStore } from '@/stores/habits-store'

export default function EditHabitScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { habits, updateHabit, deleteHabit, isLoading } = useHabitsStore()

  const habit = habits.find((h) => h.id === id)

  const [name, setName] = useState('')
  const [targetDays, setTargetDays] = useState<number[]>([])
  const [targetCount, setTargetCount] = useState('')
  const [selectedColor, setSelectedColor] = useState<string>(Colors.green.primary)
  const [selectedIcon, setSelectedIcon] = useState('✓')

  const [errors, setErrors] = useState<{ name?: string; targetDays?: string }>({})

  useEffect(() => {
    if (habit) {
      setName(habit.name)
      setTargetDays(habit.target_days.map(Number))
      setTargetCount(String(habit.target_count))
      setSelectedColor(habit.color)
      setSelectedIcon(habit.icon)
    }
  }, [habit])

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

  const handleUpdate = async () => {
    if (!validateForm() || !id) return

    try {
      await updateHabit(id, {
        name: name.trim(),
        color: selectedColor,
        icon: selectedIcon,
        target_days: targetDays.map(String),
        target_count: parseInt(targetCount, 10) || 4,
      })
      router.back()
    } catch {
      // Error handling
    }
  }

  const handleDelete = () => {
    if (!id) return

    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHabit(id)
              router.back()
            } catch {
              Alert.alert('Error', 'Failed to delete habit')
            }
          },
        },
      ],
    )
  }

  if (!habit) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Edit Habit</Text>
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
            <View style={styles.goalInputWrapper}>
              <TextInput
                value={targetCount}
                onChangeText={setTargetCount}
                keyboardType="numeric"
                placeholder="4"
              />
            </View>
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
          title="Update Habit"
          onPress={handleUpdate}
          loading={isLoading}
          fullWidth
          size="large"
        />
        <Button title="Delete Habit" onPress={handleDelete} variant="destructive" fullWidth />
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
  goalInputWrapper: {
    width: 60,
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
    gap: Spacing.sm,
  },
})
