import type { IInvitationRepository } from '../../../domain/repositories/IInvitationRepository';
import type { Invitation, CreateInvitationParams } from '../../../domain/entities';
import { getSupabaseClient } from '../SupabaseClient';

export class SupabaseInvitationRepository implements IInvitationRepository {
  async getByToken(token: string): Promise<Invitation | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('token', token)
      .single();
    if (error) return null;
    return this.mapToEntity(data);
  }

  async getPendingByEmail(email: string): Promise<Invitation[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('invitations')
      .select('*')
      .eq('invitee_email', email)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(this.mapToEntity);
  }

  async create(params: CreateInvitationParams): Promise<Invitation> {
    const supabase = getSupabaseClient();
    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { data, error } = await supabase
      .from('invitations')
      .insert({
        couple_id: params.coupleId,
        inviter_id: params.inviterId,
        invitee_email: params.inviteeEmail,
        token,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
      })
      .select()
      .single();
    if (error) throw error;
    return this.mapToEntity(data);
  }

  async updateStatus(id: string, status: Invitation['status']): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('invitations').update({ status }).eq('id', id);
    if (error) throw error;
  }

  private mapToEntity(data: Record<string, unknown>): Invitation {
    return {
      id: data.id as string,
      coupleId: data.couple_id as string,
      inviterId: data.inviter_id as string,
      inviteeEmail: data.invitee_email as string,
      status: data.status as 'pending' | 'accepted' | 'declined' | 'expired',
      token: data.token as string,
      expiresAt: data.expires_at as string,
      createdAt: data.created_at as string,
      updatedAt: data.updated_at as string,
    };
  }
}

export const invitationRepository = new SupabaseInvitationRepository();
