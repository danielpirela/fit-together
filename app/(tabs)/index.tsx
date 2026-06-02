// Home screen
// Shows today's habits with completion toggles and weekly progress

import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Button } from '@/shared/components/button'
import { CompletionToggle } from '@/shared/components/completion-toggle'
import { EmptyState } from '@/shared/components/empty-state'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import Colors from '@/shared/constants/theme-colors'
import { BorderRadius, Spacing } from '@/shared/constants/theme-spacing'
import { useAuthStore } from '@/stores/auth-store'
import { useCoupleStore } from '@/stores/couple-store'
import { useHabitsStore } from '@/stores/habits-store'

interface HabitItem {
  id: string
  name: string
  icon: string
  color: string
  target_days: number[]
  target_count: number
  completed_today: boolean
  partner_completed_today: boolean
  weekly_progress: { completed: number; target: number }
}

export default function HomeScreen() {
  const { user } = useAuthStore()
  const { couple } = useCoupleStore()
  const { habits, completions, fetchHabits, toggleCompletion, isLoading } = useHabitsStore()

  const [habitItems, setHabitItems] = useState<HabitItem[]>([])
  const [_showAddHabit, _setShowAddHabit] = useState(false)

  useEffect(() => {
    if (user?.id && couple?.id) {
      fetchHabits(couple.id)
    }
  }, [user?.id, couple?.id, fetchHabits])

  useEffect(() => {
    // Build habit items with completion status
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    const items: HabitItem[] = habits.map((habit) => {
      const habitCompletions = completions.get(habit.id) || []
      const myCompletion = habitCompletions.find(
        (c) => c.user_id === user?.id && c.date === todayStr,
      )
      // For partner completion, we need partner's user_id
      const partnerId =
        couple?.partner_a_id === user?.id ? couple?.partner_b_id : couple?.partner_a_id
      const partnerCompletion = partnerId
        ? habitCompletions.find((c) => c.user_id === partnerId && c.date === todayStr)
        : null

      // Calculate weekly progress (current week)
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekCompletions = habitCompletions.filter((c) => {
        const completionDate = new Date(c.date)
        return completionDate >= weekStart && completionDate <= today
      })
      const weekTarget = habit.target_count

      return {
        id: habit.id,
        name: habit.name,
        icon: habit.icon,
        color: habit.color,
        target_days: habit.target_days.map(Number),
        target_count: habit.target_count,
        completed_today: !!myCompletion,
        partner_completed_today: !!partnerCompletion,
        weekly_progress: {
          completed: weekCompletions.length,
          target: weekTarget,
        },
      }
    })

    setHabitItems(items)
  }, [habits, completions, user?.id, couple])

  const handleToggleCompletion = async (habitId: string) => {
    if (!user) return
    const today = new Date().toISOString().split('T')[0]
    await toggleCompletion(habitId, user.id, today)
  }

  const handleHabitPress = (habitId: string) => {
    router.push(`/habit/${habitId}`)
  }

  if (isLoading && habits.length === 0) {
    return <LoadingSpinner fullScreen />
  }

  if (!couple) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="Welcome!"
          description="Create or join a couple to start tracking habits together."
          icon="👋"
          action={{
            title: 'Get Started',
            onPress: () => router.push('/couple/create'),
          }}
        />
      </View>
    )
  }

  const renderHabitItem = ({ item }: { item: HabitItem }) => (
    <Pressable
      onPress={() => handleHabitPress(item.id)}
      style={({ pressed }) => [styles.habitCard, pressed && styles.habitCardPressed]}
    >
      <View style={styles.habitContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        <View style={styles.habitInfo}>
          <Text style={styles.habitName}>{item.name}</Text>
          <Text style={styles.weeklyProgress}>
            {item.weekly_progress.completed}/{item.weekly_progress.target} times this week
          </Text>
        </View>
        <CompletionToggle
          completed={item.completed_today}
          partnerCompleted={item.partner_completed_today}
          onToggle={() => handleToggleCompletion(item.id)}
        />
      </View>
    </Pressable>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {habitItems.length === 0 ? (
        <EmptyState
          title="No habits yet"
          description="Start building better habits together!"
          icon="📝"
          action={{
            title: 'Create First Habit',
            onPress: () => router.push('/modal/add-habit'),
          }}
        />
      ) : (
        <FlatList
          data={habitItems}
          renderItem={renderHabitItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.footer}>
        <Button
          title="Add Habit"
          onPress={() => router.push('/modal/add-habit')}
          size="large"
          fullWidth
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  date: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  habitCard: {
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  habitCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  habitContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  weeklyProgress: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.background.primary,
  },
})
