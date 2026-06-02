import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Client-side only Supabase instance
// We use a lazy getter to avoid SSR issues
let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient | null {
  // @ts-expect-error - We check runtime environment
  if (typeof globalThis.window === 'undefined') {
    return null
  }

  if (!_supabase) {
    // Dynamic require to avoid SSR issues
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AsyncStorage = require('@react-native-async-storage/async-storage').default

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not configured')
      return null
    }

    _supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  }

  return _supabase
}

// Export a proxy that lazily gets the client
export const supabase = {
  get client() {
    return getSupabase()
  },
}

// Type definitions for Supabase database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string
          couple_id: string | null
          role: 'partner_a' | 'partner_b' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          display_name: string
          couple_id?: string | null
          role?: 'partner_a' | 'partner_b' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string
          couple_id?: string | null
          role?: 'partner_a' | 'partner_b' | null
          created_at?: string
          updated_at?: string
        }
      }
      couples: {
        Row: {
          id: string
          name: string
          partner_a_id: string
          partner_b_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          partner_a_id: string
          partner_b_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          partner_a_id?: string
          partner_b_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          couple_id: string
          name: string
          description: string | null
          color: string
          icon: string
          frequency: 'daily' | 'weekly' | 'custom'
          target_days: string[]
          target_count: number
          created_by: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          name: string
          description?: string | null
          color?: string
          icon?: string
          frequency?: 'daily' | 'weekly' | 'custom'
          target_days?: string[]
          target_count?: number
          created_by: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          name?: string
          description?: string | null
          color?: string
          icon?: string
          frequency?: 'daily' | 'weekly' | 'custom'
          target_days?: string[]
          target_count?: number
          created_by?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          date: string
          completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          date: string
          completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          date?: string
          completed?: boolean
          completed_at?: string | null
        }
      }
      invitations: {
        Row: {
          id: string
          couple_id: string
          inviter_id: string
          invitee_email: string
          status: 'pending' | 'accepted' | 'declined' | 'expired'
          token: string
          expires_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          couple_id: string
          inviter_id: string
          invitee_email: string
          status?: 'pending' | 'accepted' | 'declined' | 'expired'
          token?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          couple_id?: string
          inviter_id?: string
          invitee_email?: string
          status?: 'pending' | 'accepted' | 'declined' | 'expired'
          token?: string
          expires_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
