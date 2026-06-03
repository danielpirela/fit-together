import type { ICoupleRepository } from '@/domain/repositories/ICoupleRepository';
import type { Couple, CreateCoupleParams } from '@/domain/entities';
import { getSupabaseClient } from '@/infrastructure/supabase/SupabaseClient';

export class SupabaseCoupleRepository implements ICoupleRepository {
  async getByUserId(userId: string): Promise<Couple | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('couples')
      .select('*')
      .or(`partner_a_id.eq.${userId},partner_b_id.eq.${userId}`)
      .single();
    if (error && error.code !== 'PGRST116') return null;
    return data ? this.mapToEntity(data) : null;
  }

  async create(params: CreateCoupleParams): Promise<Couple> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('couples')
      .insert({ name: params.name, partner_a_id: params.partnerAId })
      .select()
      .single();
    if (error) throw error;
    return this.mapToEntity(data);
  }

  async update(id: string, coupleData: Partial<Couple>): Promise<Couple> {
    const supabase = getSupabaseClient();
    const updates: Record<string, unknown> = {};
    if (coupleData.name) updates.name = coupleData.name;
    if (coupleData.partnerBId !== undefined) updates.partner_b_id = coupleData.partnerBId;

    const { data, error } = await supabase
      .from('couples')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return this.mapToEntity(data);
  }

  private mapToEntity(data: Record<string, unknown>): Couple {
    return {
      id: data.id as string,
      name: data.name as string,
      partnerAId: data.partner_a_id as string,
      partnerBId: data.partner_b_id as string | null,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    };
  }
}

export const coupleRepository = new SupabaseCoupleRepository();
