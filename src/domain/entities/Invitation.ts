export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export interface Invitation {
  id: string;
  coupleId: string;
  inviterId: string;
  inviteeEmail: string;
  status: InvitationStatus;
  token: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvitationParams {
  coupleId: string;
  inviterId: string;
  inviteeEmail: string;
}
