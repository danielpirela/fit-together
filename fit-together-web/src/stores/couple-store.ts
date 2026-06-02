import { create } from 'zustand'
import type { Couple, Invitation } from '../types/database'
import { supabase } from '../lib/supabase'

interface CoupleState {
  couple: Couple | null
  invitations: Invitation[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchCouple: (userId: string) => Promise<void>
  fetchInvitations: (userId: string) => Promise<void>
  createCouple: (name: string, partnerAId: string) => Promise<Couple>
  invitePartner: (coupleId: string, inviterId: string, inviteeEmail: string) => Promise<void>
  acceptInvitation: (token: string, userId: string) => Promise<void>
  declineInvitation: (token: string) => Promise<void>
  leaveCouple: (userId: string) => Promise<void>
  clearError: () => void
}

export const useCoupleStore = create<CoupleState>((set, get) => ({
  couple: null,
  invitations: [],
  isLoading: false,
  error: null,

  fetchCouple: async (userId: string) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from('couples')
        .select('*')
        .or(`partner_a_id.eq.${userId},partner_b_id.eq.${userId}`)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      set({ couple: data || null, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  fetchInvitations: async (userId: string) => {
    try {
      const { data: user } = await supabase.from('users').select('email').eq('id', userId).single()
      if (!user) return

      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('invitee_email', user.email)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (error) throw error
      set({ invitations: data || [] })
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  createCouple: async (name: string, partnerAId: string) => {
    try {
      set({ isLoading: true, error: null })

      const { data, error } = await supabase
        .from('couples')
        .insert({ name, partner_a_id: partnerAId })
        .select()
        .single()

      if (error) throw error

      set({ couple: data, isLoading: false })

      await supabase
        .from('users')
        .update({ couple_id: data.id, role: 'partner_a' })
        .eq('id', partnerAId)

      return data
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  invitePartner: async (coupleId: string, inviterId: string, inviteeEmail: string) => {
    try {
      set({ isLoading: true, error: null })

      const token = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      const { error } = await supabase.from('invitations').insert({
        couple_id: coupleId,
        inviter_id: inviterId,
        invitee_email: inviteeEmail,
        token,
        expires_at: expiresAt.toISOString(),
        status: 'pending',
      })

      if (error) throw error
      set({ isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  acceptInvitation: async (token: string, userId: string) => {
    try {
      set({ isLoading: true, error: null })

      const { data: invitation, error: findError } = await supabase
        .from('invitations')
        .select('*')
        .eq('token', token)
        .eq('status', 'pending')
        .single()

      if (findError) throw findError

      if (new Date(invitation.expires_at) < new Date()) {
        await supabase.from('invitations').update({ status: 'expired' }).eq('id', invitation.id)
        throw new Error('Invitation has expired')
      }

      const { error: updateError } = await supabase
        .from('couples')
        .update({ partner_b_id: userId })
        .eq('id', invitation.couple_id)

      if (updateError) throw updateError

      await supabase
        .from('users')
        .update({ couple_id: invitation.couple_id, role: 'partner_b' })
        .eq('id', userId)

      await supabase.from('invitations').update({ status: 'accepted' }).eq('id', invitation.id)

      const { data: couple } = await supabase
        .from('couples')
        .select('*')
        .eq('id', invitation.couple_id)
        .single()

      set({ couple, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  declineInvitation: async (token: string) => {
    try {
      set({ isLoading: true, error: null })

      const { error } = await supabase
        .from('invitations')
        .update({ status: 'declined' })
        .eq('token', token)

      if (error) throw error
      set({ isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  leaveCouple: async (userId: string) => {
    try {
      const { couple } = get()
      if (!couple) throw new Error('Not in a couple')

      set({ isLoading: true, error: null })

      const updates =
        couple.partner_a_id === userId ? { partner_a_id: null } : { partner_b_id: null }

      const { error: updateError } = await supabase
        .from('couples')
        .update(updates)
        .eq('id', couple.id)

      if (updateError) throw updateError

      await supabase.from('users').update({ couple_id: null, role: null }).eq('id', userId)

      set({ couple: null, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  clearError: () => set({ error: null }),
}))
