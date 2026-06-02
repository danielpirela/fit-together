// Icon picker component
// Select habit icon from predefined emoji options

import { Pressable, StyleSheet, Text, View } from 'react-native'
import Colors, { HabitIcons } from '@/shared/constants/theme-colors'
import { BorderRadius, Spacing, TouchTarget } from '@/shared/constants/theme-spacing'

interface IconPickerProps {
  selectedIcon: string
  onChange: (icon: string) => void
  disabled?: boolean
}

export function IconPicker({ selectedIcon, onChange, disabled = false }: IconPickerProps) {
  return (
    <View style={styles.container}>
      {HabitIcons.map((icon) => (
        <Pressable
          key={icon}
          onPress={() => onChange(icon)}
          disabled={disabled}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
            disabled && styles.iconButtonDisabled,
            selectedIcon === icon && styles.iconButtonSelected,
          ]}
        >
          <Text style={styles.iconEmoji}>{icon}</Text>
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
    gap: Spacing.sm,
  },
  iconButton: {
    width: TouchTarget.minimum,
    height: TouchTarget.minimum,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonPressed: {
    opacity: 0.7,
  },
  iconButtonDisabled: {
    opacity: 0.4,
  },
  iconButtonSelected: {
    borderWidth: 2,
    borderColor: Colors.green.primary,
  },
  iconEmoji: {
    fontSize: 20,
  },
})
