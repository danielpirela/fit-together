// Profile screen
// User profile, partner info, and settings

import { router } from 'expo-router'
import { useEffect } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Button } from '@/shared/components/button'
import { LoadingSpinner } from '@/shared/components/loading-spinner'
import Colors from '@/shared/constants/theme-colors'
import { BorderRadius, Spacing } from '@/shared/constants/theme-spacing'
import { useAuthStore } from '@/stores/auth-store'
import { useCoupleStore } from '@/stores/couple-store'

export default function ProfileScreen() {
  const { user, signOut, isLoading: authLoading } = useAuthStore()
  const { couple, fetchCouple, leaveCouple, isLoading: coupleLoading } = useCoupleStore()

  useEffect(() => {
    if (user?.id) {
      fetchCouple(user.id)
    }
  }, [user?.id, fetchCouple])

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut()
          router.replace('/auth/login')
        },
      },
    ])
  }

  const handleLeaveCouple = () => {
    if (!user) return

    Alert.alert(
      'Leave Couple',
      'Are you sure you want to leave this couple? Your habits will remain but your partner will no longer see your progress.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              await leaveCouple(user.id)
            } catch (_err) {
              Alert.alert('Error', 'Failed to leave couple')
            }
          },
        },
      ],
    )
  }

  if (authLoading || coupleLoading) {
    return <LoadingSpinner fullScreen />
  }

  const getPartnerInfo = () => {
    if (!couple) return null
    const partnerId = couple.partner_a_id === user?.id ? couple.partner_b_id : couple.partner_a_id
    const isPartnerA = couple.partner_a_id === user?.id
    return {
      id: partnerId,
      role: isPartnerA ? 'Partner B' : 'Partner A',
    }
  }

  const partner = getPartnerInfo()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Info */}
      <View style={styles.section}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>
            {user?.display_name?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.display_name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        {couple && (
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {user?.role === 'partner_a' ? 'Partner A' : 'Partner B'} in {couple.name}
            </Text>
          </View>
        )}
      </View>

      {/* Partner Section */}
      {couple && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Partner</Text>
          <View style={styles.card}>
            {partner?.id ? (
              <View style={styles.partnerInfo}>
                <View style={styles.avatarSmall}>
                  <Text style={styles.avatarTextSmall}>?</Text>
                </View>
                <View style={styles.partnerDetails}>
                  <Text style={styles.partnerName}>Your Partner</Text>
                  <Text style={styles.partnerRole}>{partner.role}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.noPartner}>No partner yet</Text>
            )}
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.card}>
          {couple && !partner?.id && (
            <Button
              title="Invite Partner"
              onPress={() => router.push('/couple/invite')}
              variant="secondary"
              fullWidth
              style={styles.actionButton}
            />
          )}
          {couple && partner?.id && (
            <Button
              title="Leave Couple"
              onPress={handleLeaveCouple}
              variant="destructive"
              fullWidth
              style={styles.actionButton}
            />
          )}
          {!couple && (
            <Button
              title="Create Couple"
              onPress={() => router.push('/couple/create')}
              fullWidth
              style={styles.actionButton}
            />
          )}
        </View>
      </View>

      {/* Sign Out */}
      <View style={styles.section}>
        <Button title="Sign Out" onPress={handleSignOut} variant="ghost" fullWidth />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  content: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.green.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.purple.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextSmall: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  roleBadge: {
    alignSelf: 'center',
    backgroundColor: Colors.gray[50],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginTop: Spacing.md,
  },
  roleText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  card: {
    backgroundColor: Colors.background.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  partnerDetails: {
    marginLeft: Spacing.md,
  },
  partnerName: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  partnerRole: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  noPartner: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
  actionButton: {
    marginBottom: Spacing.sm,
  },
})
