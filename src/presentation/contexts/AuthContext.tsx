import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/domain/entities';
import { authRepository, userRepository } from '@/infrastructure/supabase/repositories';
import {
  SignInUseCase,
  SignUpUseCase,
  SignOutUseCase,
  ResetPasswordUseCase,
  InitializeAuthUseCase,
} from '@/application/use-cases/auth';

// TEMPORARY: Auth bypass for local dev + redesign work.
// TODO: restore real Supabase auth when the trigger migration is in place
// (see supabase/migrations/) and email verification is handled.
const MOCK_USER: User = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'dev@fit-together.local',
  displayName: 'Dev User',
  coupleId: null,
  role: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const signInUseCase = new SignInUseCase(authRepository, userRepository);
const signUpUseCase = new SignUpUseCase(authRepository, userRepository);
const signOutUseCase = new SignOutUseCase(authRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(authRepository);
const initializeAuthUseCase = new InitializeAuthUseCase(authRepository, userRepository);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      initialize: async () => {
        // BYPASS: skip Supabase session check, set mock user directly.
        set({ user: MOCK_USER, isInitialized: true, isLoading: false });
      },

      signIn: async (_email, _password) => {
        // BYPASS: ignore credentials, just sign in as mock user.
        set({ user: MOCK_USER, isLoading: false, error: null });
      },

      signUp: async (_email, _password, _displayName) => {
        // BYPASS: ignore form, just sign in as mock user.
        set({ user: MOCK_USER, isLoading: false, error: null });
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          await signOutUseCase.execute();
          set({ user: null, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      resetPassword: async (email) => {
        try {
          set({ isLoading: true, error: null });
          await resetPasswordUseCase.execute(email);
          set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);
