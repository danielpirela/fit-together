import { create } from 'zustand';
import type { Habit, CreateHabitParams, Completion } from '@/domain/entities';
import { habitRepository, completionRepository } from '@/infrastructure/supabase/repositories';
import {
  GetHabitsUseCase,
  CreateHabitUseCase,
  UpdateHabitUseCase,
  DeleteHabitUseCase,
  ToggleCompletionUseCase,
  GetCompletionsUseCase,
} from '@/application/use-cases/habits';

interface HabitsStore {
  habits: Habit[];
  completions: Map<string, Completion[]>;
  isLoading: boolean;
  error: string | null;
  fetchHabits: (coupleId: string) => Promise<void>;
  createHabit: (params: CreateHabitParams) => Promise<Habit>;
  updateHabit: (id: string, data: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string, userId: string, date: string) => Promise<void>;
  getCompletions: (habitId: string) => Promise<Completion[]>;
  clearError: () => void;
}

const getHabitsUseCase = new GetHabitsUseCase(habitRepository);
const createHabitUseCase = new CreateHabitUseCase(habitRepository);
const updateHabitUseCase = new UpdateHabitUseCase(habitRepository);
const deleteHabitUseCase = new DeleteHabitUseCase(habitRepository);
const toggleCompletionUseCase = new ToggleCompletionUseCase(completionRepository);
const getCompletionsUseCase = new GetCompletionsUseCase(completionRepository);

export const useHabitsStore = create<HabitsStore>((set, get) => ({
  habits: [],
  completions: new Map(),
  isLoading: false,
  error: null,

  fetchHabits: async (coupleId) => {
    try {
      set({ isLoading: true, error: null });
      const habits = await getHabitsUseCase.execute(coupleId);

      const completionsMap = new Map<string, Completion[]>();
      for (const habit of habits) {
        const completions = await getCompletionsUseCase.execute(habit.id);
        completionsMap.set(habit.id, completions);
      }

      set({ habits, completions: completionsMap, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createHabit: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const habit = await createHabitUseCase.execute(params);
      set((state) => ({
        habits: [...state.habits, habit],
        completions: new Map(state.completions).set(habit.id, []),
        isLoading: false,
      }));
      return habit;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateHabit: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const habit = await updateHabitUseCase.execute(id, data);
      set((state) => ({
        habits: state.habits.map((h) => (h.id === id ? habit : h)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteHabit: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await deleteHabitUseCase.execute(id);
      set((state) => ({
        habits: state.habits.filter((h) => h.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  toggleCompletion: async (habitId, userId, date) => {
    try {
      const { completions } = get();
      const habitCompletions = completions.get(habitId) || [];
      const existing = habitCompletions.find((c) => c.userId === userId && c.date === date);

      const result = await toggleCompletionUseCase.execute(habitId, userId, date);

      const updatedCompletions = result
        ? [...habitCompletions.filter((c) => c.id !== result.id), result]
        : habitCompletions.filter((c) => !(c.userId === userId && c.date === date));

      set((state) => ({
        completions: new Map(state.completions).set(habitId, updatedCompletions),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  getCompletions: async (habitId) => {
    return getCompletionsUseCase.execute(habitId);
  },

  clearError: () => set({ error: null }),
}));
