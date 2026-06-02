// Habit list component with tabs and empty state
import { useCallback } from 'react'
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { HabitCard } from './habit-card'
import { EmptyState } from '@/shared/components/empty-state'
import { useHabits } from '../hooks/use-habits'
import Colors from '@/shared/constants/theme-colors'
import { Spacing } from '@/shared/constants/theme-spacing'

interface HabitListProps {
  coupleId?: string
  showArchived?: boolean
  onHabitPress?: (habitId: string) => void
}

export function HabitList({ coupleId, showArchived = false, onHabitPress }: HabitListProps) {
  const { habits, isLoading, fetchHabits } = useHabits()
  const habitsToShow = showArchived
    ? habits.filter((h) => !h.is_active)
    : habits.filter((h) => h.is_active)

  const handleRefresh = useCallback(async () => {
    if (coupleId) {
      await fetchHabits(coupleId)
    }
  }, [coupleId, fetchHabits])

  const renderItem = useCallback(
    ({ item }: { item: (typeof habitsToShow)[0] }) => (
      <HabitCard habit={item} onPress={() => onHabitPress?.(item.id)} />
    ),
    [onHabitPress],
  )

  const keyExtractor = useCallback((item: (typeof habitsToShow)[0]) => item.id, [])

  if (habitsToShow.length === 0 && !isLoading) {
    return (
      <EmptyState
        title={showArchived ? 'No Archived Habits' : 'No Habits Yet'}
        description={
          showArchived
            ? "You haven't archived any habits yet."
            : 'Start tracking a new habit to build healthy routines together!'
        }
        action={showArchived ? undefined : { title: 'Add Habit', onPress: () => {} }}
      />
    )
  }

  return (
    <FlatList
      data={habitsToShow}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={handleRefresh}
          tintColor={Colors.green.primary}
        />
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  separator: {
    height: Spacing.sm,
  },
})
