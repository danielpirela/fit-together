// useCouple hook - wraps couple store with additional computed values
import { useCallback, useMemo } from 'react'
import { useCoupleStore } from '@/stores/couple-store'
import { useAuthStore } from '@/stores/auth-store'

export function useCouple() {
  const store = useCoupleStore()
  const authStore = useAuthStore()

  const hasCouple = useMemo(() => {
    return !!store.couple
  }, [store.couple])

  const partnerName = useMemo(() => {
    if (!store.couple || !authStore.user) return null

    const isPartnerA = store.couple.partner_a_id === authStore.user.id
    // In a real app, you'd fetch the partner's name from the users table
    return isPartnerA ? 'Partner B' : 'Partner A'
  }, [store.couple, authStore.user])

  const isPendingInvitation = useMemo(() => {
    // Check if there's a pending invitation for the user
    return false // TODO: implement based on invitations store
  }, [])

  const fetchCouple = useCallback(
    async (userId: string) => {
      await store.fetchCouple(userId)
    },
    [store],
  )

  const createCouple = useCallback(
    async (name: string, partnerAId: string) => {
      return await store.createCouple(name, partnerAId)
    },
    [store],
  )

  const invitePartner = useCallback(
    async (coupleId: string, inviterId: string, inviteeEmail: string) => {
      await store.invitePartner(coupleId, inviterId, inviteeEmail)
    },
    [store],
  )

  const acceptInvitation = useCallback(
    async (token: string, userId: string) => {
      await store.acceptInvitation(token, userId)
    },
    [store],
  )

  const declineInvitation = useCallback(
    async (token: string) => {
      await store.declineInvitation(token)
    },
    [store],
  )

  const leaveCouple = useCallback(
    async (userId: string) => {
      await store.leaveCouple(userId)
    },
    [store],
  )

  const clearError = useCallback(() => {
    store.clearError()
  }, [store])

  return {
    // State
    couple: store.couple,
    isLoading: store.isLoading,
    error: store.error,

    // Computed
    hasCouple,
    partnerName,
    isPendingInvitation,

    // Actions
    fetchCouple,
    createCouple,
    invitePartner,
    acceptInvitation,
    declineInvitation,
    leaveCouple,
    clearError,
  }
}
