import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { useToast } from '../../components/ui/Toast';
import gsap from 'gsap';
import { useReducedMotion } from '../../motion/useReducedMotion';

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isLoading, error, clearError } = useAuthStore();
  const { showToast } = useToast();
  const reducedMotion = useReducedMotion();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // Refs for animation targets
  const brandRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);

  // Staggered entrance animation on mount
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Brand mark pulse entrance
      if (brandRef.current) {
        tl.fromTo(
          brandRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'quart.out' }
        );
      }

      // Heading entrance
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'quart.out' },
          '-=0.1'
        );
      }

      // Form fields stagger
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

      // Footer link
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
              Fit Together
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }} className="mt-1">
              Track habits with your partner
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
                placeholder="••••••••"
                autoComplete="current-password"
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
                title="Sign In"
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
              />
            </div>
          </form>

          {/* Links */}
          <div className="mt-4 text-center">
            <Link
              to="/reset-password"
              className="text-sm font-medium"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign up link */}
          <p
            ref={footerRef}
            className="text-center mt-6"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Don't have an account?{' '}
            <Link
              to="/sign-up"
              className="font-semibold"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              Sign up
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