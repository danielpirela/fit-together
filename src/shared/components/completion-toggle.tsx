// Completion toggle component
// Circular button to mark habit complete for today

import { Pressable, StyleSheet, Text, View } from 'react-native'
import Colors from '@/shared/constants/theme-colors'
import { TouchTarget } from '@/shared/constants/theme-spacing'

interface CompletionToggleProps {
  completed: boolean
  partnerCompleted: boolean
  onToggle: () => void
  disabled?: boolean
}

export function CompletionToggle({
  completed,
  partnerCompleted,
  onToggle,
  disabled = false,
}: CompletionToggleProps) {
  const bothComplete = completed && partnerCompleted
  const onlyMeComplete = completed && !partnerCompleted
  const onlyPartnerComplete = !completed && partnerCompleted

  const getBackgroundColor = () => {
    if (bothComplete) return Colors.gray[200]
    if (onlyMeComplete) return Colors.green.primary
    if (onlyPartnerComplete) return Colors.purple.primary
    return 'transparent'
  }

  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.outerCircle}>
        <View style={styles.innerCircle}>
          <View
            style={[
              styles.checkContainer,
              { backgroundColor: getBackgroundColor() },
              !completed && !partnerCompleted && styles.emptyCircle,
            ]}
          >
            {(completed || bothComplete) && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: TouchTarget.minimum,
    height: TouchTarget.minimum,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
  outerCircle: {
    width: TouchTarget.minimum - 8,
    height: TouchTarget.minimum - 8,
    borderRadius: (TouchTarget.minimum - 8) / 2,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkContainer: {
    width: TouchTarget.minimum - 16,
    height: TouchTarget.minimum - 16,
    borderRadius: (TouchTarget.minimum - 16) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCircle: {
    borderWidth: 2,
    borderColor: Colors.gray[300],
    backgroundColor: 'transparent',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
})
