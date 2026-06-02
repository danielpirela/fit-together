// useAuth hook - wraps auth store with additional computed values
import { useCallback, useMemo } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function useAuth() {
  const store = useAuthStore()

  const isAuthenticated = useMemo(() => {
    return !!store.user && store.isInitialized
  }, [store.user, store.isInitialized])

  const initialize = useCallback(async () => {
    await store.initialize()
  }, [store])

  const signIn = useCallback(
    async (email: string, password: string) => {
      await store.signIn(email, password)
    },
    [store],
  )

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      await store.signUp(email, password, displayName)
    },
    [store],
  )

  const signOut = useCallback(async () => {
    await store.signOut()
  }, [store])

  const resetPassword = useCallback(
    async (email: string) => {
      await store.resetPassword(email)
    },
    [store],
  )

  const updateProfile = useCallback(
    async (displayName: string) => {
      await store.updateProfile(displayName)
    },
    [store],
  )

  const clearError = useCallback(() => {
    store.clearError()
  }, [store])

  return {
    // State
    user: store.user,
    isLoading: store.isLoading,
    isInitialized: store.isInitialized,
    error: store.error,

    // Computed
    isAuthenticated,

    // Actions
    initialize,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    clearError,
  }
}
