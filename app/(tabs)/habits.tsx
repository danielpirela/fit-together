// Habits management screen
// Manage all habits with Active/Archived tabs

import { router } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import { Button } from '@/shared/components/button'
import { EmptyState } from '@/shared/components/empty-state'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import Colors from '@/shared/constants/theme-colors'
import { BorderRadius, Spacing } from '@/shared/constants/theme-spacing'
import { useAuthStore } from '@/stores/auth-store'
import { useCoupleStore } from '@/stores/couple-store'
import { useHabitsStore } from '@/stores/habits-store'

type TabType = 'active' | 'archived'

export default function HabitsScreen() {
  const { user } = useAuthStore()
  const { couple } = useCoupleStore()
  const { habits, fetchHabits, isLoading } = useHabitsStore()

  const [activeTab, setActiveTab] = useState<TabType>('active')

  useEffect(() => {
    if (user?.id && couple?.id) {
      fetchHabits(couple.id)
    }
  }, [user?.id, couple?.id, fetchHabits])

  const activeHabits = habits.filter((h) => h.is_active)
  const archivedHabits = habits.filter((h) => !h.is_active)
  const displayedHabits = activeTab === 'active' ? activeHabits : archivedHabits

  const renderHabitItem = ({ item }: { item: (typeof habits)[0] }) => (
    <Pressable
      onPress={() => router.push(`/habit/${item.id}`)}
      style={({ pressed }) => [styles.habitItem, pressed && styles.habitItemPressed]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <View style={styles.habitInfo}>
        <Text style={styles.habitName}>{item.name}</Text>
        <Text style={styles.habitDetails}>
          {item.target_count}x per week • {item.target_days.length} days
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  )

  if (isLoading && habits.length === 0) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => setActiveTab('active')}
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Active ({activeHabits.length})
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('archived')}
          style={[styles.tab, activeTab === 'archived' && styles.tabActive]}
        >
          <Text style={[styles.tabText, activeTab === 'archived' && styles.tabTextActive]}>
            Archived ({archivedHabits.length})
          </Text>
        </Pressable>
      </View>

      {/* Habit List */}
      {displayedHabits.length === 0 ? (
        <EmptyState
          title={activeTab === 'active' ? 'No active habits' : 'No archived habits'}
          description={
            activeTab === 'active'
              ? 'Create your first habit to get started!'
              : 'Archived habits will appear here'
          }
          icon={activeTab === 'active' ? '📝' : '📦'}
          action={
            activeTab === 'active'
              ? {
                  title: 'Create Habit',
                  onPress: () => router.push('/modal/add-habit'),
                }
              : undefined
          }
        />
      ) : (
        <FlatList
          data={displayedHabits}
          renderItem={renderHabitItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Button */}
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.gray[100],
  },
  tabActive: {
    backgroundColor: Colors.green.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  habitItemPressed: {
    opacity: 0.9,
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
  habitDetails: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: Colors.gray[300],
  },
  footer: {
    padding: Spacing.lg,
    backgroundColor: Colors.background.primary,
  },
})
