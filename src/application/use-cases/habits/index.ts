import type { Habit, CreateHabitParams, Completion } from '@/domain/entities';
import type { IHabitRepository, ICompletionRepository } from '@/domain/repositories';

export class GetHabitsUseCase {
  constructor(private habitRepo: IHabitRepository) {}

  async execute(coupleId: string): Promise<Habit[]> {
    return this.habitRepo.getByCoupleId(coupleId);
  }
}

export class CreateHabitUseCase {
  constructor(private habitRepo: IHabitRepository) {}

  async execute(params: CreateHabitParams): Promise<Habit> {
    return this.habitRepo.create(params);
  }
}

export class UpdateHabitUseCase {
  constructor(private habitRepo: IHabitRepository) {}

  async execute(id: string, data: Partial<Habit>): Promise<Habit> {
    return this.habitRepo.update(id, data);
  }
}

export class DeleteHabitUseCase {
  constructor(private habitRepo: IHabitRepository) {}

  async execute(id: string): Promise<void> {
    await this.habitRepo.delete(id);
  }
}

export class ToggleCompletionUseCase {
  constructor(private completionRepo: ICompletionRepository) {}

  async execute(habitId: string, userId: string, date: string): Promise<Completion | null> {
    return this.completionRepo.toggle(habitId, userId, date);
  }
}

export class GetCompletionsUseCase {
  constructor(private completionRepo: ICompletionRepository) {}

  async execute(habitId: string): Promise<Completion[]> {
    return this.completionRepo.getByHabitId(habitId);
  }
}
