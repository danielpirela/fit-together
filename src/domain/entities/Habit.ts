export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  coupleId: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  frequency: HabitFrequency;
  targetDays: string[];
  targetCount: number;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHabitParams {
  coupleId: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  frequency: HabitFrequency;
  targetDays: string[];
  targetCount: number;
  createdBy: string;
}

export interface Completion {
  id: string;
  habitId: string;
  userId: string;
  date: string;
  completed: boolean;
  completedAt: string | null;
}
