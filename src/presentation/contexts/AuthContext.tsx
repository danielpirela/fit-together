import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '../../domain/entities';
import { authRepository, userRepository } from '../../infrastructure/supabase/repositories';
import {
  SignInUseCase,
  SignUpUseCase,
  SignOutUseCase,
  ResetPasswordUseCase,
  InitializeAuthUseCase,
} from '../../application/use-cases/auth';

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
        try {
          set({ isLoading: true });
          const user = await initializeAuthUseCase.execute();
          set({ user, isInitialized: true, isLoading: false });

          authRepository.onAuthStateChange(async (authUser) => {
            if (authUser) {
              const userProfile = await userRepository.getById(authUser.id);
              set({ user: userProfile });
            } else {
              set({ user: null });
            }
          });
        } catch (error) {
          set({ error: (error as Error).message, isInitialized: true, isLoading: false });
        }
      },

      signIn: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const user = await signInUseCase.execute(email, password);
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      signUp: async (email, password, displayName) => {
        try {
          set({ isLoading: true, error: null });
          const user = await signUpUseCase.execute(email, password, displayName);
          set({ user, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
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
