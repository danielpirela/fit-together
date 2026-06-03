import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/presentation/contexts/AuthContext';
import { Button } from '@/presentation/components/ui/Button';
import gsap from 'gsap';
import { useReducedMotion } from '@/presentation/motion/useReducedMotion';

export function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  // Refs for animation
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

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

      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'quart.out' },
          '-=0.15'
        );
      }

      if (actionsRef.current) {
        tl.fromTo(
          actionsRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'quart.out' },
          '+=0.1'
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleAccept = () => {
    // In a real app this would call an API. In bypass mode, navigate to create couple.
    navigate('/create-couple');
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-surface-primary)' }}
    >
      <div className="w-full max-w-sm text-center">
        {/* Icon */}
        <div ref={iconRef} className="mb-6">
          <span className="text-6xl block">🤝</span>
        </div>

        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-2xl font-bold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          You've Been Invited!
        </h1>

        {/* Description */}
        <p
          ref={descRef}
          className="mb-8"
          style={{ color: 'var(--color-text-muted)' }}
        >
          You've been invited to join your partner on Fit Together.
          {!user
            ? ' Create an account to accept your invitation.'
            : ' Accept the invitation to get started.'}
        </p>

        {/* Token info */}
        <p
          className="text-xs mb-8 px-4 py-2 rounded-lg inline-block"
          style={{
            background: 'var(--color-surface-secondary)',
            color: 'var(--color-text-muted)',
          }}
        >
          Invitation: {token}
        </p>

        {/* Actions */}
        <div ref={actionsRef} className="space-y-3">
          {user ? (
            <Button
              title="Accept Invitation"
              variant="primary"
              size="large"
              fullWidth
              onClick={handleAccept}
            />
          ) : (
            <Button
              title="Sign Up to Accept"
              variant="primary"
              size="large"
              fullWidth
              onClick={() => navigate('/sign-up')}
            />
          )}

          {!user && (
            <Button
              title="Sign In"
              variant="secondary"
              size="large"
              fullWidth
              onClick={() => navigate('/login')}
            />
          )}
        </div>
      </div>
    </div>
  );
}