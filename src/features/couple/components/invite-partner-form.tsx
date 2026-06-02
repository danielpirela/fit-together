// Invite partner form component
import { useCallback, useState } from 'react'
import { Alert, StyleSheet, Text, View, Share, TouchableOpacity } from 'react-native'
import { Button } from '@/shared/components/button'
import { FormField } from '@/shared/components/form-field'
import { TextInput } from '@/shared/components/text-input'
import { useCouple } from '../hooks/use-couple'
import { useAuthStore } from '@/stores/auth-store'
import Colors from '@/shared/constants/theme-colors'

interface InvitePartnerFormProps {
  onSuccess?: () => void
}

export function InvitePartnerForm({ onSuccess }: InvitePartnerFormProps) {
  const { invitePartner, isLoading, error, clearError } = useCouple()
  const authStore = useAuthStore()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [inviteLink, setInviteLink] = useState('')
  const [errors, setErrors] = useState<{ email?: string }>({})

  const validate = useCallback(() => {
    const newErrors: { email?: string } = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [email])

  const handleSubmit = useCallback(async () => {
    clearError()
    if (!validate()) return

    if (!authStore.user || !authStore.user.couple_id) {
      Alert.alert('Error', 'You must be part of a couple to invite a partner')
      return
    }

    try {
      await invitePartner(authStore.user.couple_id, authStore.user.id, email.trim())

      // Generate invite link (in real app, this would come from backend)
      const link = `fit-together://invite/${Date.now().toString(36)}`
      setInviteLink(link)
      setShowSuccess(true)
      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send invitation'
      Alert.alert('Error', message)
    }
  }, [email, invitePartner, authStore.user, validate, clearError, onSuccess])

  const handleCopyLink = useCallback(async () => {
    try {
      await Share.share({
        message: `Join me on Fit Together! Use this link: ${inviteLink}`,
        title: 'Invite Partner',
      })
    } catch {
      // Fallback: just copy to clipboard in real app
      Alert.alert('Link', inviteLink)
    }
  }, [inviteLink])

  if (showSuccess) {
    return (
      <View style={styles.container}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.title}>Invitation Sent!</Text>
        <Text style={styles.subtitle}>
          Your partner will receive an email at {email}. They can also use the link below:
        </Text>

        <TouchableOpacity style={styles.linkBox} onPress={handleCopyLink}>
          <Text style={styles.linkText} numberOfLines={1}>
            {inviteLink}
          </Text>
          <Text style={styles.copyText}>Tap to share</Text>
        </TouchableOpacity>

        <Button
          title="Done"
          onPress={() => {
            setShowSuccess(false)
            setEmail('')
          }}
          fullWidth
          size="large"
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invite Your Partner</Text>
      <Text style={styles.subtitle}>Enter your partner's email to send them an invitation.</Text>

      <FormField label="Partner's Email">
        <TextInput
          placeholder="partner@example.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text)
            if (errors.email) setErrors({ email: undefined })
          }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </FormField>

      <FormField label="Message (optional)">
        <TextInput
          placeholder="Add a personal note..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={3}
          containerStyle={styles.textArea}
        />
      </FormField>

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        title="Send Invitation"
        onPress={handleSubmit}
        loading={isLoading}
        disabled={isLoading}
        fullWidth
        size="large"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  error: {
    color: '#dc3545',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  successIcon: {
    fontSize: 48,
    color: Colors.green.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  linkBox: {
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  linkText: {
    fontSize: 14,
    color: Colors.green.primary,
    fontFamily: 'monospace',
  },
  copyText: {
    fontSize: 12,
    color: Colors.gray[500],
    marginTop: 8,
  },
  textArea: {
    height: 88,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
})
