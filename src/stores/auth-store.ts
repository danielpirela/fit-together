import type { User as SupabaseUser } from '@supabase/supabase-js'
import { create } from 'zustand'
import { type Database, supabase } from '@/lib/supabase'

type User = Database['public']['Tables']['users']['Row']

interface AuthState {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null

  // Actions
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (displayName: string) => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    try {
      set({ isLoading: true, error: null })

      // Get current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) throw sessionError

      if (session?.user) {
        // Fetch user profile from database
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) throw profileError

        set({ user: userProfile, isInitialized: true, isLoading: false })
      } else {
        set({ user: null, isInitialized: true, isLoading: false })
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(
        async (event: string, session: { user: SupabaseUser } | null) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const { data: userProfile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            set({ user: userProfile })
          } else if (event === 'SIGNED_OUT') {
            set({ user: null })
          }
        },
      )
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false, isInitialized: true })
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Fetch user profile
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      set({ user: userProfile, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  signUp: async (email: string, password: string, displayName: string) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Create user profile
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            display_name: displayName,
          })
          .select()
          .single()

        if (profileError) throw profileError

        set({ user: userProfile, isLoading: false })
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null })

      const { error } = await supabase.auth.signOut()

      if (error) throw error

      set({ user: null, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  resetPassword: async (email: string) => {
    try {
      set({ isLoading: true, error: null })

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'fit-together://reset-password',
      })

      if (error) throw error

      set({ isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  updateProfile: async (displayName: string) => {
    try {
      const { user } = get()
      if (!user) throw new Error('Not authenticated')

      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from('users')
        .update({ display_name: displayName })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error

      set({ user: data, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
