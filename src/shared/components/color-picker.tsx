// Color picker component
// Select habit color from predefined options

import { Pressable, StyleSheet, Text, View } from 'react-native'
import { HabitColors } from '@/shared/constants/theme-colors'
import { Spacing, TouchTarget } from '@/shared/constants/theme-spacing'

interface ColorPickerProps {
  selectedColor: string
  onChange: (color: string) => void
  disabled?: boolean
}

export function ColorPicker({ selectedColor, onChange, disabled = false }: ColorPickerProps) {
  return (
    <View style={styles.container}>
      {HabitColors.map((color) => (
        <Pressable
          key={color.value}
          onPress={() => onChange(color.value)}
          disabled={disabled}
          style={({ pressed }) => [
            styles.colorButton,
            pressed && styles.colorButtonPressed,
            disabled && styles.colorButtonDisabled,
          ]}
        >
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: color.value },
              selectedColor === color.value && styles.colorSwatchSelected,
            ]}
          >
            {selectedColor === color.value && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: Spacing.md,
  },
  colorButton: {
    padding: 4,
  },
  colorButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  colorButtonDisabled: {
    opacity: 0.4,
  },
  colorSwatch: {
    width: TouchTarget.minimum,
    height: TouchTarget.minimum,
    borderRadius: TouchTarget.minimum / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSwatchSelected: {
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
})
