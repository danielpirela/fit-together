// Day selector component
// Weekday selector for habit frequency

import { Pressable, StyleSheet, Text, View } from 'react-native'
import Colors from '@/shared/constants/theme-colors'
import { Spacing, TouchTarget } from '@/shared/constants/theme-spacing'

const DAYS = [
  { label: 'S', value: 0 },
  { label: 'M', value: 1 },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'T', value: 4 },
  { label: 'F', value: 5 },
  { label: 'S', value: 6 },
]

interface DaySelectorProps {
  selectedDays: number[]
  onChange: (days: number[]) => void
  disabled?: boolean
}

export function DaySelector({ selectedDays, onChange, disabled = false }: DaySelectorProps) {
  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day))
    } else {
      onChange([...selectedDays, day].sort())
    }
  }

  return (
    <View style={styles.container}>
      {DAYS.map((day) => {
        const isSelected = selectedDays.includes(day.value)
        return (
          <Pressable
            key={day.value}
            onPress={() => toggleDay(day.value)}
            disabled={disabled}
            style={({ pressed }) => [
              styles.dayButton,
              isSelected && styles.dayButtonSelected,
              pressed && styles.dayButtonPressed,
              disabled && styles.dayButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.dayText,
                isSelected && styles.dayTextSelected,
                disabled && styles.dayTextDisabled,
              ]}
            >
              {day.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  dayButton: {
    width: TouchTarget.minimum,
    height: TouchTarget.minimum,
    borderRadius: TouchTarget.minimum / 2,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: Colors.green.primary,
  },
  dayButtonPressed: {
    opacity: 0.7,
  },
  dayButtonDisabled: {
    opacity: 0.4,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  dayTextSelected: {
    color: '#FFFFFF',
  },
  dayTextDisabled: {
    color: Colors.gray[400],
  },
})
