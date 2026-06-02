import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Web-specific storage adapter using localStorage
const localStorageAdapter = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(key)
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, value)
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },
}

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  }

  _supabase = createClient(supabaseUrl || 'http://localhost:54321', supabaseKey || 'placeholder', {
    auth: {
      storage: localStorageAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // Important for web OAuth flows
    },
  })

  return _supabase
}

// Singleton export
export const supabase = getSupabase()

export type { Database } from '../types/database'
