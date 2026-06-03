import { create } from 'zustand';
import type { Couple } from '@/domain/entities';
import {
  coupleRepository,
  invitationRepository,
  userRepository,
} from '@/infrastructure/supabase/repositories';
import {
  CreateCoupleUseCase,
  AcceptInvitationUseCase,
  InvitePartnerUseCase,
} from '@/application/use-cases/couple';

interface CoupleStore {
  couple: Couple | null;
  isLoading: boolean;
  error: string | null;
  fetchCouple: (userId: string) => Promise<void>;
  createCouple: (name: string, partnerAId: string) => Promise<void>;
  invitePartner: (coupleId: string, inviterId: string, inviteeEmail: string) => Promise<void>;
  acceptInvitation: (token: string, userId: string) => Promise<void>;
  clearError: () => void;
}

const createCoupleUseCase = new CreateCoupleUseCase(coupleRepository, userRepository);
const acceptInvitationUseCase = new AcceptInvitationUseCase(
  coupleRepository,
  userRepository,
  invitationRepository
);
const invitePartnerUseCase = new InvitePartnerUseCase(invitationRepository);

export const useCoupleStore = create<CoupleStore>((set) => ({
  couple: null,
  isLoading: false,
  error: null,

  fetchCouple: async (userId) => {
    try {
      set({ isLoading: true, error: null });
      const couple = await coupleRepository.getByUserId(userId);
      set({ couple, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createCouple: async (name, partnerAId) => {
    try {
      set({ isLoading: true, error: null });
      const couple = await createCoupleUseCase.execute(name, partnerAId);
      set({ couple, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  invitePartner: async (coupleId, inviterId, inviteeEmail) => {
    try {
      set({ isLoading: true, error: null });
      await invitePartnerUseCase.execute(coupleId, inviterId, inviteeEmail);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  acceptInvitation: async (token, userId) => {
    try {
      set({ isLoading: true, error: null });
      const couple = await acceptInvitationUseCase.execute(token, userId);
      set({ couple, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
