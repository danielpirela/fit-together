import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth-store'
import { useCoupleStore } from '../../stores/couple-store'
import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'
import { useToast } from '../../components/Toast'

export function InvitePartnerPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { couple, invitePartner, isLoading } = useCoupleStore()
  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [validationError, setValidationError] = useState('')
  const [inviteSent, setInviteSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (!email) {
      setValidationError('Email is required')
      return
    }
    if (!email.includes('@')) {
      setValidationError('Invalid email address')
      return
    }
    if (email === user?.email) {
      setValidationError('You cannot invite yourself')
      return
    }

    try {
      await invitePartner(couple!.id, user!.id, email)
      setInviteSent(true)
      showToast('Invitation sent!', 'success')
    } catch {
      showToast('Failed to send invitation', 'error')
    }
  }

  if (inviteSent) {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto text-center">
          <span className="text-6xl mb-4 block">🎉</span>
          <h1 className="text-2xl font-bold mb-2">Invitation Sent!</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            We've sent an invitation to <strong>{email}</strong>. Once they accept, you'll be able to track habits together!
          </p>
          <Button
            title="Back to Home"
            variant="primary"
            onClick={() => navigate('/')}
            fullWidth
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Invite Your Partner</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Enter your partner's email to send them an invitation to join {couple?.name}.
        </p>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="Partner's Email"
              type="email"
              value={email}
              onChangeText={setEmail}
              placeholder="partner@example.com"
              autoComplete="email"
            />

            {validationError && (
              <p className="text-sm text-[var(--color-red-completion)]">{validationError}</p>
            )}

            <Button
              type="submit"
              title="Send Invitation"
              variant="primary"
              size="large"
              fullWidth
              loading={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  )
}
