import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, easeOutQuart } from '@/presentation/motion/gsap';
import { useReducedMotion } from '@/presentation/motion/useReducedMotion';
import { Button } from '@/presentation/components/ui/Button';
import { TextInput } from '@/presentation/components/ui/TextInput';
import { useToast } from '@/presentation/components/ui/Toast';
import { PartnerRipple } from '@/presentation/motion/PartnerRipple';

/* ── Mock data (auth bypass) ── */
const MOCK_COUPLE = { id: 'mock-1', name: 'The Johnsons', code: 'JHN-42-XY' };
const MOCK_INVITATIONS = [
  { id: '1', email: 'maria@example.com', status: 'pending', sentAt: '2h ago' },
];

export function InvitePartnerPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const reducedMotion = useReducedMotion();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);
  const inviteListRef = useRef<HTMLDivElement>(null);

  /* Entrance animation */
  useLayoutEffect(() => {
    if (reducedMotion || !pageRef.current) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.3, delay: 0.1, ease: easeOutQuart }
        );
      }

      if (fieldsRef.current) {
        gsap.fromTo(
          fieldsRef.current.children,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, delay: 0.15, ease: easeOutQuart }
        );
      }

      if (inviteListRef.current) {
        gsap.fromTo(
          inviteListRef.current.children,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.2, stagger: 0.06, delay: 0.3, ease: easeOutQuart }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!email.includes('@')) {
      setError('Invalid email');
      return;
    }

    // Mock success — fire ripple + toast + show sent state
    showToast('Invitation sent!', 'success');
    setShowRipple(true);
    setSent(true);
  };

  if (sent) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: 'var(--color-surface-primary)' }}
      >
        <div className="max-w-sm text-center">
          <span className="text-6xl mb-4 block">🎉</span>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
            Invitation Sent!
          </h1>
          <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
            Once they accept, you'll be able to track habits together!
          </p>
          <Button title="Back to Home" onClick={() => navigate('/')} variant="primary" fullWidth />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ background: 'var(--color-surface-primary)' }}
    >
      <div className="max-w-md mx-auto px-4 pt-12 pb-6">
        {/* Heading */}
        <h1
          ref={headingRef}
          className="text-3xl font-bold mb-2"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Invite Your Partner
        </h1>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Enter your partner's email to send them an invitation.
        </p>

        {/* Form */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: 'var(--color-surface-secondary)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div ref={fieldsRef}>
              <TextInput
                label="Partner's Email"
                type="email"
                value={email}
                onChangeText={setEmail}
                placeholder="partner@example.com"
                autoComplete="email"
              />
              {error && (
                <p className="text-sm mt-1" style={{ color: 'var(--color-feedback-error)' }}>
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              title="Send Invitation"
              variant="primary"
              size="large"
              fullWidth
            />
          </form>
        </div>

        {/* Pending invitations */}
        {MOCK_INVITATIONS.length > 0 && (
          <div ref={inviteListRef}>
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-muted)' }}>
              Pending Invitations
            </p>
            <div className="space-y-2">
              {MOCK_INVITATIONS.map((inv) => (
                <div
                  key={inv.id}
                  className="rounded-xl px-4 py-3 flex items-center justify-between"
                  style={{ background: 'var(--color-surface-secondary)' }}
                >
                  <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                    {inv.email}
                  </span>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: 'var(--color-accent-primary)20',
                      color: 'var(--color-accent-primary)',
                    }}
                  >
                    {inv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Partner ripple animation */}
      <PartnerRipple
        trigger={showRipple}
        color="#A855F7"
        onComplete={() => setShowRipple(false)}
      />
    </div>
  );
}