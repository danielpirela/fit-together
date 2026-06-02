// Habit detail screen
// Shows habit details with 12-month activity grid

import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { ActivityGrid, type ViewMode } from '@/shared/components/activity-grid'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import Colors from '@/shared/constants/theme-colors'
import { BorderRadius, Spacing } from '@/shared/constants/theme-spacing'
import { useAuthStore } from '@/stores/auth-store'
import { useCoupleStore } from '@/stores/couple-store'
import { useHabitsStore } from '@/stores/habits-store'

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { user } = useAuthStore()
  const { couple } = useCoupleStore()
  const { habits, completions, fetchHabits, toggleCompletion, isLoading } = useHabitsStore()

  const [viewMode, setViewMode] = useState<ViewMode>('couple')

  useEffect(() => {
    if (couple?.id) {
      fetchHabits(couple.id)
    }
  }, [couple?.id, fetchHabits])

  const habit = habits.find((h) => h.id === id)
  const habitCompletions = completions.get(id || '') || []

  if (isLoading || !habit) {
    return <LoadingSpinner fullScreen />
  }

  // Build completion data for grid
  const completionData = habitCompletions.map((c) => {
    const partnerId =
      couple?.partner_a_id === user?.id ? couple?.partner_b_id : couple?.partner_a_id
    return {
      date: c.date,
      partnerACompleted: c.user_id === user?.id,
      partnerBCompleted: partnerId ? c.user_id === partnerId : false,
    }
  })

  // Calculate stats
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekCompletions = habitCompletions.filter((c) => {
    const date = new Date(c.date)
    return date >= weekStart && date <= today && c.user_id === user?.id
  })

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const monthCompletions = habitCompletions.filter((c) => {
    const date = new Date(c.date)
    return date >= monthStart && date <= today && c.user_id === user?.id
  })

  const targetDays = habit.target_days.map(Number)

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${habit.color}20` }]}>
          <Text style={styles.icon}>{habit.icon}</Text>
        </View>
        <Text style={styles.habitName}>{habit.name}</Text>
        <Pressable onPress={() => router.push(`/modal/edit-habit?id=${habit.id}`)}>
          <Text style={styles.editButton}>Edit</Text>
        </Pressable>
      </View>

      {/* Grid */}
      <View style={styles.gridContainer}>
        <ActivityGrid
          habitId={habit.id}
          completions={completionData}
          viewMode={viewMode}
          targetDays={targetDays}
          months={12}
        />
      </View>

      {/* View Mode Toggle */}
      <View style={styles.toggleContainer}>
        <Pressable
          onPress={() => setViewMode('personal')}
          style={[styles.toggleButton, viewMode === 'personal' && styles.toggleButtonActive]}
        >
          <Text style={[styles.toggleText, viewMode === 'personal' && styles.toggleTextActive]}>
            My View
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setViewMode('couple')}
          style={[styles.toggleButton, viewMode === 'couple' && styles.toggleButtonActive]}
        >
          <Text style={[styles.toggleText, viewMode === 'couple' && styles.toggleTextActive]}>
            Couple View
          </Text>
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{weekCompletions.length}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{monthCompletions.length}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{habit.target_count}</Text>
          <Text style={styles.statLabel}>Weekly Goal</Text>
        </View>
      </View>

      {/* Toggle Today */}
      <View style={styles.todaySection}>
        <Text style={styles.todayTitle}>Today</Text>
        <Pressable
          onPress={async () => {
            const today = new Date().toISOString().split('T')[0]
            await toggleCompletion(habit.id, user?.id || '', today)
          }}
          style={styles.todayToggle}
        >
          <Text style={styles.todayToggleText}>Mark as Complete</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
  },
  habitName: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginLeft: Spacing.md,
  },
  editButton: {
    fontSize: 16,
    color: Colors.green.primary,
    fontWeight: '600',
  },
  gridContainer: {
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.gray[100],
    borderRadius: BorderRadius.sm,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm - 2,
  },
  toggleButtonActive: {
    backgroundColor: Colors.background.surface,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  toggleTextActive: {
    color: Colors.text.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.green.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  todaySection: {
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  todayTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  todayToggle: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.green.primary,
    borderRadius: BorderRadius.sm,
  },
  todayToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})
