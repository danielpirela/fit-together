// Habit card component
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { CompletionToggle } from '@/shared/components/completion-toggle'
import Colors from '@/shared/constants/theme-colors'
import { BorderRadius, Spacing } from '@/shared/constants/theme-spacing'
import type { Database } from '@/lib/supabase'

type HabitRow = Database['public']['Tables']['habits']['Row']

interface HabitCardProps {
  habit: HabitRow
  onPress?: () => void
  onToggleCompletion?: (completed: boolean) => void
  isCompletedToday?: boolean
}

export function HabitCard({
  habit,
  onPress,
  onToggleCompletion,
  isCompletedToday = false,
}: HabitCardProps) {
  const handleToggle = () => {
    onToggleCompletion?.(!isCompletedToday)
  }

  // Get streak (simplified - would use store data in real app)
  const streak: number = 0

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.leftContent}>
        <View style={[styles.colorIndicator, { backgroundColor: habit.color }]} />
        <View style={styles.info}>
          <View style={styles.header}>
            <Text style={styles.icon}>{habit.icon}</Text>
            <Text style={styles.name} numberOfLines={1}>
              {habit.name}
            </Text>
          </View>
          {streak > 0 && (
            <Text style={styles.streak}>
              🔥 {streak} day{streak === 1 ? '' : 's'} streak
            </Text>
          )}
        </View>
      </View>

      <CompletionToggle
        completed={isCompletedToday}
        partnerCompleted={false}
        onToggle={handleToggle}
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  streak: {
    fontSize: 13,
    color: Colors.gray[500],
    marginTop: 4,
  },
})
