import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth-store'
import { useCoupleStore } from '../stores/couple-store'
import { supabase } from '../lib/supabase'
import { Button } from '../components/Button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { useToast } from '../components/Toast'

type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'loading' | 'error'

export function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { acceptInvitation, declineInvitation, isLoading: coupleLoading } = useCoupleStore()
  const { showToast } = useToast()

  const [status, setStatus] = useState<InvitationStatus>('loading')
  const [coupleName, setCoupleName] = useState('')
  const [inviterName, setInviterName] = useState('')

  useEffect(() => {
    const checkInvitation = async () => {
      if (!token) {
        setStatus('error')
        return
      }

      try {
        const { data: invitation, error } = await supabase
          .from('invitations')
          .select('*, inviter:users!invitations_inviter_id_fkey(display_name)')
          .eq('token', token)
          .single()

        if (error || !invitation) {
          setStatus('error')
          return
        }

        if (invitation.status !== 'pending') {
          setStatus(invitation.status)
          return
        }

        if (new Date(invitation.expires_at) < new Date()) {
          setStatus('expired')
          return
        }

        // Get couple name
        const { data: couple } = await supabase
          .from('couples')
          .select('name')
          .eq('id', invitation.couple_id)
          .single()

        setCoupleName(couple?.name || 'Your partner')
        setInviterName((invitation as { inviter?: { display_name: string } }).inviter?.display_name || 'Your partner')
        setStatus('pending')
      } catch {
        setStatus('error')
      }
    }

    checkInvitation()
  }, [token])

  const handleAccept = async () => {
    if (!user) {
      showToast('Please sign in first', 'info')
      navigate('/login')
      return
    }

    try {
      await acceptInvitation(token!, user.id)
      setStatus('accepted')
      showToast('Welcome to the couple!', 'success')
    } catch (err) {
      showToast((err as Error).message || 'Failed to accept invitation', 'error')
    }
  }

  const handleDecline = async () => {
    try {
      await declineInvitation(token!)
      setStatus('declined')
      showToast('Invitation declined', 'info')
    } catch {
      showToast('Failed to decline invitation', 'error')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <span className="text-6xl mb-4 block">❌</span>
          <h1 className="text-2xl font-bold mb-2">Invalid Invitation</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            This invitation link is invalid or has been removed.
          </p>
          <Button title="Go to Home" onClick={() => navigate('/')} variant="primary" fullWidth />
        </div>
      </div>
    )
  }

  if (status === 'expired') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <span className="text-6xl mb-4 block">⏰</span>
          <h1 className="text-2xl font-bold mb-2">Invitation Expired</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            This invitation has expired. Ask your partner to send a new one.
          </p>
          <Button title="Go to Home" onClick={() => navigate('/')} variant="primary" fullWidth />
        </div>
      </div>
    )
  }

  if (status === 'accepted') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <span className="text-6xl mb-4 block">🎉</span>
          <h1 className="text-2xl font-bold mb-2">Welcome!</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            You've joined {coupleName}! Start tracking habits together.
          </p>
          <Button title="Start Tracking" onClick={() => navigate('/')} variant="primary" fullWidth />
        </div>
      </div>
    )
  }

  if (status === 'declined') {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <span className="text-6xl mb-4 block">👋</span>
          <h1 className="text-2xl font-bold mb-2">Invitation Declined</h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            You can close this page.
          </p>
          <Button title="Go to Home" onClick={() => navigate('/')} variant="secondary" fullWidth />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <span className="text-6xl mb-4 block">💑</span>
        <h1 className="text-2xl font-bold mb-2">You're Invited!</h1>
        <p className="text-[var(--color-text-secondary)] mb-2">
          {inviterName} invited you to join
        </p>
        <p className="text-xl font-semibold mb-6">{coupleName}</p>

        <div className="space-y-3">
          <Button
            title="Accept Invitation"
            onClick={handleAccept}
            variant="primary"
            size="large"
            fullWidth
            loading={coupleLoading}
          />
          <Button
            title="Decline"
            onClick={handleDecline}
            variant="ghost"
            fullWidth
          />
        </div>

        {!user && (
          <p className="text-sm text-[var(--color-text-secondary)] mt-4">
            Sign in or create an account to accept the invitation.
          </p>
        )}
      </div>
    </div>
  )
}
