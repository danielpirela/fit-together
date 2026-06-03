import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { useToast } from '../../components/ui/Toast';
import gsap from 'gsap';
import { useReducedMotion } from '../../motion/useReducedMotion';

export function SignUpPage() {
  const navigate = useNavigate();
  const { signUp, isLoading, error, clearError } = useAuthStore();
  const { showToast } = useToast();
  const reducedMotion = useReducedMotion();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // Refs for animation
  const brandRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);

  // Staggered entrance on mount
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      if (brandRef.current) {
        tl.fromTo(
          brandRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'quart.out' }
        );
      }

      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'quart.out' },
          '-=0.1'
        );
      }

      if (formRef.current) {
        const fields = formRef.current.querySelectorAll<HTMLElement>('[data-field]');
        tl.fromTo(
          fields,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            stagger: 0.06,
            ease: 'quart.out',
          },
          '+=0.1'
        );
      }

      if (footerRef.current) {
        tl.fromTo(
          footerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2 },
          '-=0.05'
        );
      }
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    clearError();

    if (!displayName) {
      setValidationError('Name is required');
      return;
    }
    if (!email) {
      setValidationError('Email is required');
      return;
    }
    if (!password) {
      setValidationError('Password is required');
      return;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      await signUp(email, password, displayName);
      showToast('Account created!', 'success');
      navigate('/');
    } catch (err) {
      showToast((err as Error).message || 'Sign up failed', 'error');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--color-surface-primary)' }}
    >
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Brand mark */}
          <div ref={brandRef} className="text-center mb-6">
            <span
              className="text-6xl mb-4 block"
              style={{
                display: 'inline-block',
                animation: reducedMotion
                  ? 'none'
                  : 'brandPulse 2s ease-in-out infinite',
              }}
            >
              💪
            </span>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1
              ref={headingRef}
              className="text-2xl font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Create Account
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }} className="mt-1">
              Start your journey together
            </p>
          </div>

          {/* Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4"
            style={{
              background: 'var(--color-surface-secondary)',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <div data-field>
              <TextInput
                label="Name"
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>

            <div data-field>
              <TextInput
                label="Email"
                type="email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div data-field>
              <TextInput
                label="Password"
                type="password"
                value={password}
                onChangeText={setPassword}
                placeholder="Min 6 characters"
                autoComplete="new-password"
              />
            </div>

            <div data-field>
              <TextInput
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>

            {(error || validationError) && (
              <p
                className="text-sm"
                style={{ color: 'var(--color-feedback-error)' }}
              >
                {error || validationError}
              </p>
            )}

            <div data-field>
              <Button
                type="submit"
                title="Create Account"
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
              />
            </div>
          </form>

          {/* Sign in link */}
          <p
            ref={footerRef}
            className="text-center mt-6"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes brandPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}