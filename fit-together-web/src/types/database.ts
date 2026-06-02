// Type definitions for Supabase database
// Copied from original project

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

export type User = Database['public']['Tables']['users']['Row']
export type Couple = Database['public']['Tables']['couples']['Row']
export type Habit = Database['public']['Tables']['habits']['Row']
export type Completion = Database['public']['Tables']['completions']['Row']
export type Invitation = Database['public']['Tables']['invitations']['Row']
