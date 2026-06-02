import { create } from 'zustand'
import type { Habit, Completion } from '../types/database'
import { supabase } from '../lib/supabase'

interface SharedCompletion {
  date: string
  partnerACompleted: boolean
  partnerBCompleted: boolean
}

interface HabitsState {
  habits: Habit[]
  completions: Map<string, Completion[]> // habitId -> completions
  isLoading: boolean
  error: string | null

  // Actions
  fetchHabits: (coupleId: string) => Promise<void>
  createHabit: (habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => Promise<Habit>
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>

  // Completions
  toggleCompletion: (habitId: string, userId: string, date: string) => Promise<void>
  getSharedCompletions: (
    habitId: string,
    partnerAId: string,
    partnerBId: string,
    months?: number
  ) => SharedCompletion[]
  getUserCompletions: (habitId: string, userId: string) => Completion[]
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  completions: new Map(),
  isLoading: false,
  error: null,

  fetchHabits: async (coupleId: string) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('couple_id', coupleId)
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      if (error) throw error

      set({ habits: data || [], isLoading: false })

      // Fetch completions for each habit
      const completionsMap = new Map<string, Completion[]>()
      for (const habit of data || []) {
        const { data: habitCompletions } = await supabase
          .from('completions')
          .select('*')
          .eq('habit_id', habit.id)
          .order('date', { ascending: false })

        completionsMap.set(habit.id, habitCompletions || [])
      }

      set({ completions: completionsMap })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  createHabit: async (habitData) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase.from('habits').insert(habitData).select().single()

      if (error) throw error

      set((state) => ({
        habits: [...state.habits, data],
        isLoading: false,
      }))

      return data
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  updateHabit: async (id: string, updates: Partial<Habit>) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? data : h)),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  deleteHabit: async (id: string) => {
    try {
      set({ isLoading: true, error: null })

      const { error } = await supabase.from('habits').update({ is_active: false }).eq('id', id)

      if (error) throw error

      set((state) => ({
        habits: state.habits.filter((h) => h.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  toggleCompletion: async (habitId: string, userId: string, date: string) => {
    try {
      const { completions } = get()
      const habitCompletions = completions.get(habitId) || []
      const existing = habitCompletions.find((c) => c.user_id === userId && c.date === date)

      if (existing) {
        await supabase.from('completions').delete().eq('id', existing.id)

        const updatedCompletions = habitCompletions.filter((c) => c.id !== existing.id)
        set((state) => ({
          completions: new Map(state.completions).set(habitId, updatedCompletions),
        }))
      } else {
        const { data, error } = await supabase
          .from('completions')
          .insert({
            habit_id: habitId,
            user_id: userId,
            date,
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (error) throw error

        const updatedCompletions = [...habitCompletions, data]
        set((state) => ({
          completions: new Map(state.completions).set(habitId, updatedCompletions),
        }))
      }
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },

  getSharedCompletions: (habitId: string, partnerAId: string, partnerBId: string, months = 12) => {
    const { completions } = get()
    const habitCompletions = completions.get(habitId) || []

    const now = new Date()
    const startDate = new Date(now)
    startDate.setMonth(startDate.getMonth() - months)

    const result: SharedCompletion[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0]

      const partnerACompletion = habitCompletions.find(
        (c) => c.user_id === partnerAId && c.date === dateStr
      )
      const partnerBCompletion = habitCompletions.find(
        (c) => c.user_id === partnerBId && c.date === dateStr
      )

      result.push({
        date: dateStr,
        partnerACompleted: !!partnerACompletion,
        partnerBCompleted: !!partnerBCompletion,
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return result
  },

  getUserCompletions: (habitId: string, userId: string) => {
    const { completions } = get()
    const habitCompletions = completions.get(habitId) || []
    return habitCompletions.filter((c) => c.user_id === userId)
  },
}))
