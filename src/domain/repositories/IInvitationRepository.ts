import type { Invitation, CreateInvitationParams } from '@/domain/entities';

export interface IInvitationRepository {
  getByToken(token: string): Promise<Invitation | null>;
  getPendingByEmail(email: string): Promise<Invitation[]>;
  create(params: CreateInvitationParams): Promise<Invitation>;
  updateStatus(id: string, status: Invitation['status']): Promise<void>;
}
