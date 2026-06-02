import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth-store'
import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'
import { useToast } from '../../components/Toast'

export function ResetPasswordPage() {
  const { resetPassword, isLoading, error, clearError } = useAuthStore()
  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')
    clearError()

    if (!email) {
      setValidationError('Email is required')
      return
    }

    try {
      await resetPassword(email)
      setSent(true)
      showToast('Check your email!', 'success')
    } catch (err) {
      showToast((err as Error).message || 'Failed to send reset email', 'error')
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm text-center">
            <span className="text-6xl mb-4 block">📧</span>
            <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
            <p className="text-[var(--color-text-secondary)] mb-6">
              We sent a password reset link to {email}
            </p>
            <Link to="/login">
              <Button title="Back to Login" variant="secondary" fullWidth />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">🔑</span>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Reset Password</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">
              Enter your email to receive a reset link
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Email"
                type="email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                autoComplete="email"
              />

              {(error || validationError) && (
                <p className="text-sm text-[var(--color-red-completion)]">{error || validationError}</p>
              )}

              <Button
                type="submit"
                title="Send Reset Link"
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
              />
            </form>
          </div>

          <p className="text-center mt-6 text-[var(--color-text-secondary)]">
            Remember your password?{' '}
            <Link to="/login" className="text-[var(--color-green-primary)] font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
