import type { Habit, CreateHabitParams, Completion } from '@/domain/entities';

export interface IHabitRepository {
  getByCoupleId(coupleId: string): Promise<Habit[]>;
  getById(id: string): Promise<Habit | null>;
  create(params: CreateHabitParams): Promise<Habit>;
  update(id: string, data: Partial<Habit>): Promise<Habit>;
  delete(id: string): Promise<void>;
}

export interface ICompletionRepository {
  getByHabitId(habitId: string): Promise<Completion[]>;
  toggle(habitId: string, userId: string, date: string): Promise<Completion | null>;
}
