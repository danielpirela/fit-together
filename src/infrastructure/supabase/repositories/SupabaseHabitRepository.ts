import type {
  IHabitRepository,
  ICompletionRepository,
} from '@/domain/repositories/IHabitRepository';
import type { Habit, CreateHabitParams, Completion } from '@/domain/entities';
import { getSupabaseClient } from '@/infrastructure/supabase/SupabaseClient';

export class SupabaseHabitRepository implements IHabitRepository {
  async getByCoupleId(coupleId: string): Promise<Habit[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('couple_id', coupleId)
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(this.mapToEntity);
  }

  async getById(id: string): Promise<Habit | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('habits').select('*').eq('id', id).single();
    if (error) return null;
    return this.mapToEntity(data);
  }

  async create(params: CreateHabitParams): Promise<Habit> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('habits')
      .insert({
        couple_id: params.coupleId,
        name: params.name,
        description: params.description,
        color: params.color,
        icon: params.icon,
        frequency: params.frequency,
        target_days: params.targetDays,
        target_count: params.targetCount,
        created_by: params.createdBy,
        is_active: true,
      })
      .select()
      .single();
    if (error) throw error;
    return this.mapToEntity(data);
  }

  async update(id: string, habitData: Partial<Habit>): Promise<Habit> {
    const supabase = getSupabaseClient();
    const updates: Record<string, unknown> = {};
    if (habitData.name) updates.name = habitData.name;
    if (habitData.description !== undefined) updates.description = habitData.description;
    if (habitData.color) updates.color = habitData.color;
    if (habitData.icon) updates.icon = habitData.icon;
    if (habitData.targetDays) updates.target_days = habitData.targetDays;
    if (habitData.targetCount) updates.target_count = habitData.targetCount;
    if (habitData.isActive !== undefined) updates.is_active = habitData.isActive;

    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this.mapToEntity(data);
  }

  async delete(id: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('habits').update({ is_active: false }).eq('id', id);
    if (error) throw error;
  }

  private mapToEntity(data: Record<string, unknown>): Habit {
    return {
      id: data.id as string,
      coupleId: data.couple_id as string,
      name: data.name as string,
      description: data.description as string | null,
      color: data.color as string,
      icon: data.icon as string,
      frequency: data.frequency as 'daily' | 'weekly' | 'custom',
      targetDays: data.target_days as string[],
      targetCount: data.target_count as number,
      createdBy: data.created_by as string,
      isActive: data.is_active as boolean,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    };
  }
}

export class SupabaseCompletionRepository implements ICompletionRepository {
  async getByHabitId(habitId: string): Promise<Completion[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('completions')
      .select('*')
      .eq('habit_id', habitId)
      .order('date', { ascending: false });
    if (error) throw error;
    return (data || []).map(this.mapToEntity);
  }

  async toggle(habitId: string, userId: string, date: string): Promise<Completion | null> {
    const supabase = getSupabaseClient();
    const { data: existing } = await supabase
      .from('completions')
      .select('*')
      .eq('habit_id', habitId)
      .eq('user_id', userId)
      .eq('date', date)
      .single();

    if (existing) {
      const { error } = await supabase.from('completions').delete().eq('id', existing.id);
      if (error) throw error;
      return null;
    }

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
      .single();
    if (error) throw error;
    return this.mapToEntity(data);
  }

  private mapToEntity(data: Record<string, unknown>): Completion {
    return {
      id: data.id as string,
      habitId: data.habit_id as string,
      userId: data.user_id as string,
      date: data.date as string,
      completed: data.completed as boolean,
      completedAt: data.completed_at as string | null,
    };
  }
}

export const habitRepository = new SupabaseHabitRepository();
export const completionRepository = new SupabaseCompletionRepository();
