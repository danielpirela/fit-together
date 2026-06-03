import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, easeOutQuart } from '@/presentation/motion/gsap';
import { useReducedMotion } from '@/presentation/motion/useReducedMotion';
import { Button } from '@/presentation/components/ui/Button';
import { TextInput } from '@/presentation/components/ui/TextInput';
import { useToast } from '@/presentation/components/ui/Toast';

/* ── Mock data (auth bypass — no real couple) ── */
const MOCK_COUPLE = { id: 'mock-1', name: 'The Johnsons', code: 'JHN-42-XY' };

/* ── Inline motion primitives ── */

/** ParticleBurst — colored dots radial burst, fixed overlay */
function ParticleBurst({ color = '#A855F7' }: { color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [show, setShow] = useState(false);

  const fire = () => setShow(true);

  useLayoutEffect(() => {
    if (!show || !ref.current) return;

    if (reducedMotion) {
      const el = ref.current;
      gsap.set(el, { opacity: 0.9 });
      gsap.to(el, { opacity: 0, duration: 0.15, onComplete: () => setShow(false) });
      return;
    }

    const particles = ref.current.querySelectorAll<HTMLDivElement>('.burst-particle');
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: () => setShow(false) });
      particles.forEach((p, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const distance = 60 + Math.random() * 40;
        tl.set(p, { opacity: 1, scale: 1, x: 0, y: 0 }, 0);
        tl.to(
          p,
          {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: 0,
            scale: 0.3,
            duration: 0.5,
            ease: 'quart.out',
          },
          0
        );
      });
    }, ref);

    return () => ctx.revert();
  }, [show, reducedMotion]);

  return (
    <>
      {show && (
        <div
          ref={ref}
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="burst-particle absolute w-2.5 h-2.5 rounded-full"
              style={{ background: color }}
            />
          ))}
        </div>
      )}
      <span onClick={fire} className="hidden" data-fire-burst="true" />
    </>
  );
}

export function CreateCouplePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const reducedMotion = useReducedMotion();

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [burstKey, setBurstKey] = useState(0);

  const pageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fieldsRef = useRef<HTMLDivElement>(null);

  /* Entrance animation */
  useLayoutEffect(() => {
    if (reducedMotion || !pageRef.current) return;

    const ctx = gsap.context(() => {
      // Heading: fade + translateY 100ms delay
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.3, delay: 0.1, ease: easeOutQuart }
        );
      }

      // Field group: 60ms stagger from 150ms
      if (fieldsRef.current) {
        gsap.fromTo(
          fieldsRef.current.children,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, delay: 0.15, ease: easeOutQuart }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Couple name is required');
      return;
    }

    // Mock success — trigger ParticleBurst then navigate
    showToast('Couple created!', 'success');
    setBurstKey((k) => k + 1);

    // Navigate after brief delay so burst is visible
    setTimeout(() => navigate('/invite-partner'), 400);
  };

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
          Create Your Couple
        </h1>
        <p className="mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Give your couple a name to get started.
        </p>

        {/* Form */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'var(--color-surface-secondary)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div ref={fieldsRef}>
              <TextInput
                label="Couple Name"
                value={name}
                onChangeText={setName}
                placeholder="e.g., The Johnsons"
              />
              {error && (
                <p className="text-sm mt-1" style={{ color: 'var(--color-feedback-error)' }}>
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              title="Create Couple"
              variant="primary"
              size="large"
              fullWidth
            />
          </form>
        </div>

        {/* Mock couple code display */}
        <div
          className="mt-6 rounded-xl p-4 text-center"
          style={{
            background: 'var(--color-surface-secondary)',
          }}
        >
          <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
            Your couple code
          </p>
          <p
            className="text-lg font-mono font-bold"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            {MOCK_COUPLE.code}
          </p>
        </div>
      </div>

      {/* Particle burst overlay (key forces remount for repeat bursts) */}
      <ParticleBurst key={burstKey} />
    </div>
  );
}