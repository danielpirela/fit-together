// Accept invitation screen
// Deep link handler for invitation tokens

import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native'
import { supabase } from '@/lib/supabase'
import { Button } from '@/shared/components/button'
import Colors from '@/shared/constants/theme-colors'
import { Spacing } from '@/shared/constants/theme-spacing'
import { useAuthStore } from '@/stores/auth-store'
import { useCoupleStore } from '@/stores/couple-store'

interface InvitationDetails {
  id: string
  couple_id: string
  inviter_name: string
  couple_name: string
  status: 'pending' | 'accepted' | 'declined' | 'expired'
  expires_at: string
}

export default function AcceptInvitationScreen() {
  const { token } = useLocalSearchParams<{ token: string }>()
  const router = useRouter()
  const { user } = useAuthStore()
  const { acceptInvitation, declineInvitation, isLoading } = useCoupleStore()

  const [invitation, setInvitation] = useState<InvitationDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [invitationError, setInvitationError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) {
      setInvitationError('Invalid invitation link')
      setLoading(false)
    } else {
      const loadInvitation = async () => {
        try {
          const { data, error: fetchError } = await supabase
            .from('invitations')
            .select('*, couple:couples(name), inviter:users(display_name)')
            .eq('token', token as string)
            .single()

          if (fetchError) {
            if (fetchError.code === 'PGRST116') {
              setInvitationError('This invitation is no longer valid')
            } else {
              setInvitationError('Failed to load invitation')
            }
            setLoading(false)
            return
          }

          if (!data) {
            setInvitationError('Invitation not found')
            setLoading(false)
            return
          }

          // Check if expired
          if (new Date(data.expires_at) < new Date()) {
            setInvitationError('This invitation has expired')
            setLoading(false)
            return
          }

          // Check if already in a couple
          if (user?.couple_id) {
            setInvitationError("You're already in a couple")
            setLoading(false)
            return
          }

          setInvitation({
            id: data.id,
            couple_id: data.couple_id,
            inviter_name:
              (data.inviter as { display_name?: string })?.display_name || 'Your partner',
            couple_name: (data.couple as { name?: string })?.name || 'Your couple',
            status: data.status,
            expires_at: data.expires_at,
          })
          setLoading(false)
        } catch {
          setInvitationError('Failed to load invitation')
          setLoading(false)
        }
      }
      loadInvitation()
    }
  }, [token, user?.couple_id])

  const handleAccept = async () => {
    if (!user || !token) return

    try {
      await acceptInvitation(token, user.id)
      router.replace('/(tabs)/index')
    } catch {
      Alert.alert('Error', 'Failed to accept invitation. Please try again.')
    }
  }

  const handleDecline = async () => {
    if (!token) return

    Alert.alert('Decline Invitation', 'Are you sure you want to decline this invitation?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Decline',
        style: 'destructive',
        onPress: async () => {
          try {
            await declineInvitation(token)
            router.replace('/auth/login')
          } catch {
            Alert.alert('Error', 'Failed to decline invitation')
          }
        },
      },
    ])
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.green.primary} />
      </View>
    )
  }

  if (invitationError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Invalid Invitation</Text>
          <Text style={styles.errorText}>{invitationError}</Text>
          <Button title="Go to Sign In" onPress={() => router.replace('/auth/login')} />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{invitation?.inviter_name.charAt(0).toUpperCase()}</Text>
        </View>

        <Text style={styles.title}>{invitation?.inviter_name} invited you to join</Text>
        <Text style={styles.coupleName}>{invitation?.couple_name}</Text>

        <View style={styles.info}>
          <Text style={styles.infoText}>You'll become Partner B in this couple.</Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Accept Invitation"
            onPress={handleAccept}
            loading={isLoading}
            fullWidth
            size="large"
          />
          <Button title="Decline" onPress={handleDecline} variant="ghost" fullWidth />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.green.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  coupleName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.green.primary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  info: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    width: '100%',
    gap: Spacing.md,
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
})
