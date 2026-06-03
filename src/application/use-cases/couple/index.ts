import type { Couple } from '@/domain/entities';
import type { ICoupleRepository, IUserRepository } from '@/domain/repositories';

export class CreateCoupleUseCase {
  constructor(
    private coupleRepo: ICoupleRepository,
    private userRepo: IUserRepository
  ) {}

  async execute(name: string, partnerAId: string): Promise<Couple> {
    const couple = await this.coupleRepo.create({ name, partnerAId });
    await this.userRepo.update(partnerAId, { coupleId: couple.id, role: 'partner_a' });
    return couple;
  }
}

export class AcceptInvitationUseCase {
  constructor(
    private coupleRepo: ICoupleRepository,
    private userRepo: IUserRepository,
    private invitationRepo: import('../../../domain/repositories').IInvitationRepository
  ) {}

  async execute(token: string, userId: string): Promise<Couple> {
    const invitation = await this.invitationRepo.getByToken(token);
    if (!invitation) throw new Error('Invitation not found');
    if (invitation.status !== 'pending') throw new Error('Invitation already processed');
    if (new Date(invitation.expiresAt) < new Date()) {
      await this.invitationRepo.updateStatus(invitation.id, 'expired');
      throw new Error('Invitation has expired');
    }

    const couple = await this.coupleRepo.update(invitation.coupleId, { partnerBId: userId });
    await this.userRepo.update(userId, { coupleId: couple.id, role: 'partner_b' });
    await this.invitationRepo.updateStatus(invitation.id, 'accepted');

    return couple;
  }
}

export class InvitePartnerUseCase {
  constructor(
    private invitationRepo: import('../../../domain/repositories').IInvitationRepository
  ) {}

  async execute(coupleId: string, inviterId: string, inviteeEmail: string): Promise<void> {
    await this.invitationRepo.create({ coupleId, inviterId, inviteeEmail });
  }
}
