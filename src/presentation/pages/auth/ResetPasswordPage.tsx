import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { TextInput } from '../../components/ui/TextInput';
import { useToast } from '../../components/ui/Toast';
import gsap from 'gsap';
import { useReducedMotion } from '../../motion/useReducedMotion';

export function ResetPasswordPage() {
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  const { showToast } = useToast();
  const reducedMotion = useReducedMotion();

  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Refs for animation
  const iconRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const footerRef = useRef<HTMLParagraphElement>(null);

  // Staggered entrance on mount
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      if (iconRef.current) {
        tl.fromTo(
          iconRef.current,
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
    if (!email) {
      setValidationError('Email is required');
      return;
    }

    try {
      await resetPassword(email);
      setSent(true);
      showToast('Check your email!', 'success');
    } catch (err) {
      showToast((err as Error).message || 'Failed to send reset email', 'error');
    }
  };

  if (sent) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ background: 'var(--color-surface-primary)' }}
      >
        <div className="flex-1 flex items-center justify-center p-4">
          <div
            className="w-full max-w-sm text-center"
            ref={iconRef}
          >
            <span className="text-6xl mb-4 block">📧</span>
            <h1
              ref={headingRef}
              className="text-2xl font-bold mb-2"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Check Your Email
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }} className="mb-6">
              We sent a password reset link to {email}
            </p>
            <Link to="/login">
              <Button title="Back to Login" variant="secondary" fullWidth />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--color-surface-primary)' }}
    >
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {/* Icon */}
          <div ref={iconRef} className="text-center mb-6">
            <span className="text-6xl mb-4 block">🔑</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1
              ref={headingRef}
              className="text-2xl font-bold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Reset Password
            </h1>
            <p style={{ color: 'var(--color-text-muted)' }} className="mt-1">
              Enter your email to receive a reset link
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
                title="Send Reset Link"
                variant="primary"
                size="large"
                fullWidth
                loading={isLoading}
              />
            </div>
          </form>

          {/* Back to login */}
          <p
            ref={footerRef}
            className="text-center mt-6"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Remember your password?{' '}
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
    </div>
  );
}