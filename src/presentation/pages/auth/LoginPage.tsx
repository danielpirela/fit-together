import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { useToast } from '../../components/ui/Toast';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isLoading, error, clearError } = useAuthStore();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!email) {
      setValidationError('Email is required');
      return;
    }
    if (!password) {
      setValidationError('Password is required');
      return;
    }

    try {
      await signIn(email, password);
      showToast('Welcome back!', 'success');
      navigate('/');
    } catch (err) {
      showToast((err as Error).message || 'Login failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-6xl mb-4 block">💪</span>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Fit Together</h1>
            <p className="text-[var(--color-text-secondary)] mt-1">
              Track habits with your partner
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

              <TextInput
                label="Password"
                type="password"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                autoComplete="current-password"
              />

              {(error || validationError) && (
                <p className="text-sm text-[var(--color-red-completion)]">
                  {error || validationError}
                </p>
              )}

              <Button
                type="submit"
                title="Sign In"
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
              />
            </form>

            <div className="mt-4 text-center">
              <Link
                to="/reset-password"
                className="text-sm text-[var(--color-green-primary)] font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <p className="text-center mt-6 text-[var(--color-text-secondary)]">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-[var(--color-green-primary)] font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
