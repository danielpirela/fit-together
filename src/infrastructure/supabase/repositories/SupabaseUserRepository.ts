import type { IUserRepository } from '../../../domain/repositories/IAuthRepository';
import type { User, CreateUserParams } from '../../../domain/entities';
import { getSupabaseClient } from '../SupabaseClient';

export class SupabaseUserRepository implements IUserRepository {
  async getById(id: string): Promise<User | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) return null;
    return this.mapToEntity(data);
  }

  async create(params: CreateUserParams): Promise<User> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: params.id,
        email: params.email,
        display_name: params.displayName,
      })
      .select()
      .single();
    if (error) throw error;
    return this.mapToEntity(data);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const supabase = getSupabaseClient();
    const updates: Record<string, unknown> = {};
    if (userData.displayName) updates.display_name = userData.displayName;
    if (userData.coupleId !== undefined) updates.couple_id = userData.coupleId;
    if (userData.role) updates.role = userData.role;

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this.mapToEntity(data);
  }

  private mapToEntity(data: Record<string, unknown>): User {
    return {
      id: data.id as string,
      email: data.email as string,
      displayName: data.display_name as string,
      coupleId: data.couple_id as string | null,
      role: data.role as 'partner_a' | 'partner_b' | null,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    };
  }
}

export const userRepository = new SupabaseUserRepository();
