// Invite partner screen
// Invite partner via email or copy link

import { useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { Button } from '@/shared/components/button'
import { FormField } from '@/shared/components/form-field'
import { TextInput } from '@/shared/components/text-input'
import Colors from '@/shared/constants/theme-colors'
import { Spacing } from '@/shared/constants/theme-spacing'
import { useAuthStore } from '@/stores/auth-store'
import { useCoupleStore } from '@/stores/couple-store'

export default function InvitePartnerScreen() {
  const { user } = useAuthStore()
  const { couple, invitePartner, isLoading, error, clearError } = useCoupleStore()

  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [invitationSent, setInvitationSent] = useState(false)

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required')
      return false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address')
      return false
    }
    setEmailError('')
    return true
  }

  const handleSendInvitation = async () => {
    clearError()
    if (!validateEmail()) return
    if (!couple || !user) return

    try {
      await invitePartner(couple.id, user.id, email)
      setInvitationSent(true)
      setEmail('')
    } catch (_e) {
      // Error is handled by store
    }
  }

  const handleCopyLink = async () => {
    // Generate a placeholder link - in production this would be a real invitation link
    const inviteLink = `https://togetherhabits.app/invite/${couple?.id}`
    await Clipboard.setStringAsync(inviteLink)
    Alert.alert('Link Copied', 'Share this link with your partner')
  }

  if (invitationSent) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✉️</Text>
            <Text style={styles.successTitle}>Invitation Sent</Text>
            <Text style={styles.successText}>We've sent an invitation to {email}</Text>
            <Pressable onPress={() => setInvitationSent(false)} style={styles.linkButton}>
              <Text style={styles.linkTextBold}>Send Another Invitation</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Invite Your Partner</Text>
          <Text style={styles.subtitle}>Enter your partner's email to send an invitation</Text>
        </View>

        <View style={styles.form}>
          <FormField label="Partner's Email" error={emailError || error || undefined}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="partner@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={emailError || error || undefined}
            />
          </FormField>

          <Button
            title="Send Invitation"
            onPress={handleSendInvitation}
            loading={isLoading}
            fullWidth
            size="large"
          />
        </View>

        <View style={styles.divider}>
          <Text style={styles.dividerText}>OR</Text>
        </View>

        <View style={styles.shareSection}>
          <Text style={styles.shareTitle}>Share Link Directly</Text>
          <Button
            title="Copy Invitation Link"
            onPress={handleCopyLink}
            variant="secondary"
            fullWidth
            size="large"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['2xl'],
    paddingBottom: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerText: {
    flex: 1,
    textAlign: 'center',
    color: Colors.gray[400],
    fontSize: 14,
  },
  shareSection: {
    marginBottom: Spacing.lg,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  successText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  linkButton: {
    marginTop: Spacing.lg,
    padding: Spacing.sm,
  },
  linkTextBold: {
    fontSize: 16,
    color: Colors.green.primary,
    fontWeight: '600',
  },
})
