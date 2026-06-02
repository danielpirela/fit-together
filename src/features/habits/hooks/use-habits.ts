// useHabits hook - wraps habits store with additional computed values
import { useCallback, useMemo } from 'react'
import { useHabitsStore } from '@/stores/habits-store'
import { useAuthStore } from '@/stores/auth-store'
import type { SharedCompletion } from '@/core/entities'

export function useHabits() {
  const store = useHabitsStore()
  const authStore = useAuthStore()

  const activeHabits = useMemo(() => {
    return store.habits.filter((h) => h.is_active)
  }, [store.habits])

  const archivedHabits = useMemo(() => {
    return store.habits.filter((h) => !h.is_active)
  }, [store.habits])

  const today = useMemo(() => {
    return new Date().toISOString().split('T')[0]
  }, [])

  const todayProgress = useMemo(() => {
    const active = activeHabits.length
    let completed = 0

    for (const habit of activeHabits) {
      const habitCompletions = store.completions.get(habit.id) || []
      const todayCompletion = habitCompletions.find((c) => c.date === today)
      if (todayCompletion) completed++
    }

    return {
      completed,
      total: active,
      percentage: active > 0 ? Math.round((completed / active) * 100) : 0,
    }
  }, [activeHabits, store.completions, today])

  const fetchHabits = useCallback(
    async (coupleId: string) => {
      await store.fetchHabits(coupleId)
    },
    [store],
  )

  const createHabit = useCallback(
    async (habit: Parameters<typeof store.createHabit>[0]) => {
      return await store.createHabit(habit)
    },
    [store],
  )

  const updateHabit = useCallback(
    async (id: string, updates: Parameters<typeof store.updateHabit>[1]) => {
      await store.updateHabit(id, updates)
    },
    [store],
  )

  const deleteHabit = useCallback(
    async (id: string) => {
      await store.deleteHabit(id)
    },
    [store],
  )

  const toggleCompletion = useCallback(
    async (habitId: string, date: string) => {
      if (!authStore.user) return
      await store.toggleCompletion(habitId, authStore.user.id, date)
    },
    [store, authStore.user],
  )

  const getSharedCompletions = useCallback(
    (
      habitId: string,
      partnerAId: string,
      partnerBId: string,
      months?: number,
    ): SharedCompletion[] => {
      return store.getSharedCompletions(habitId, partnerAId, partnerBId, months)
    },
    [store],
  )

  const getUserCompletions = useCallback(
    (habitId: string): ReturnType<typeof store.getUserCompletions> => {
      if (!authStore.user) return []
      return store.getUserCompletions(habitId, authStore.user.id)
    },
    [store, authStore.user],
  )

  return {
    // State
    habits: store.habits,
    completions: store.completions,
    isLoading: store.isLoading,
    error: store.error,

    // Computed
    activeHabits,
    archivedHabits,
    todayProgress,

    // Actions
    fetchHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    getSharedCompletions,
    getUserCompletions,
  }
}
