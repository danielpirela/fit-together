import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth-store'
import { Button } from '../../components/Button'
import { TextInput } from '../../components/TextInput'
import { useToast } from '../../components/Toast'

export function SignUpPage() {
  const navigate = useNavigate()
  const { signUp, isLoading, error, clearError } = useAuthStore()
  const { showToast } = useToast()

  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')
    clearError()

    if (!displayName) {
      setValidationError('Name is required')
      return
    }
    if (!email) {
      setValidationError('Email is required')
      return
    }
    if (!password) {
      setValidationError('Password is required')
      return
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }

    try {
      await signUp(email, password, displayName)
      showToast('Account created!', 'success')
      navigate('/')
    } catch (err) {
      showToast((err as Error).message || 'Sign up failed', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">💪</span>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Create Account</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">Start your journey together</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="Name"
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name"
                autoComplete="name"
              />

              <TextInput
                label="Email"
                type="email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                autoComplete="email"
              />

              <TextInput
                label="Password"
                type="password"
                value={password}
                onChangeText={setPassword}
                placeholder="Min 6 characters"
                autoComplete="new-password"
              />

              <TextInput
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                autoComplete="new-password"
              />

              {(error || validationError) && (
                <p className="text-sm text-[var(--color-red-completion)]">{error || validationError}</p>
              )}

              <Button
                type="submit"
                title="Create Account"
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
              />
            </form>
          </div>

          {/* Sign In Link */}
          <p className="text-center mt-6 text-[var(--color-text-secondary)]">
            Already have an account?{' '}
            <Link to="/login" className="text-[var(--color-green-primary)] font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
