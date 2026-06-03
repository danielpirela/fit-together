import { useLayoutEffect, useRef, useState } from 'react';
import { Button } from '../components/ui/Button';
import { easeOutQuart, gsap } from '../motion/gsap';
import { useReducedMotion } from '../motion/useReducedMotion';

/* ── Mock data (auth bypass — no real user) ── */
const MOCK_USER = {
  name: 'Daniel',
  email: 'daniel@example.com',
  avatarInitials: 'D',
  totalHabits: 4,
  longestStreak: 12,
  completionRate: 78,
};
const MOCK_PARTNER = { name: 'Maria', streak: 6 };

/** AnimateCount — animates number from 0 to `value` over 800ms with easeOutQuart */
function AnimateCount({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const reducedMotion = useReducedMotion();
  const rafRef = useRef<number>(0);

  useLayoutEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    const start = performance.now();
    const duration = 800;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 4;
      setDisplay(Math.round(eased * value));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, reducedMotion]);

  return <span className={className}>{display}</span>;
}

/* ── Page component ── */
export function ProfilePage() {
  const reducedMotion = useReducedMotion();
  const headingRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  /* Entrance animations */
  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context();

    if (headingRef.current) {
      ctx.add(() => {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.3, delay: 0.1, ease: easeOutQuart }
        );
      });
    }

    if (avatarRef.current) {
      ctx.add(() => {
        gsap.fromTo(
          avatarRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.25, delay: 0.15, ease: easeOutQuart }
        );
      });
    }

    if (statsRef.current) {
      ctx.add(() => {
        gsap.fromTo(
          statsRef.current!.children,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, delay: 0.2, ease: easeOutQuart }
        );
      });
    }

    if (settingsRef.current) {
      ctx.add(() => {
        gsap.fromTo(
          settingsRef.current!.children,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.2, stagger: 0.05, delay: 0.3, ease: easeOutQuart }
        );
      });
    }

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface-primary)' }}>
      <div className="max-w-lg mx-auto px-4 pt-8 pb-6">
        {/* Heading */}
        <div ref={headingRef} className="mb-8">
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Profile
          </h1>
        </div>

        {/* Profile card */}
        <div
          ref={avatarRef}
          className="flex items-center gap-4 rounded-2xl p-5 mb-6"
          style={{
            background: 'var(--color-surface-secondary)',
            border: '2px solid var(--color-border-subtle)',
          }}
        >
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{
              background: 'var(--color-surface-elevated)',
              color: 'var(--color-accent-primary)',
              border: '2px solid var(--color-border-subtle)',
            }}
          >
            {MOCK_USER.avatarInitials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-xl font-bold truncate"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {MOCK_USER.name}
            </p>
            <p className="text-sm truncate" style={{ color: 'var(--color-text-muted)' }}>
              {MOCK_USER.email}
            </p>
          </div>
        </div>

        {/* Stats grid */}
        <div ref={statsRef} className="grid grid-cols-3 gap-3 mb-8">
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: 'var(--color-surface-secondary)' }}
          >
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              <AnimateCount value={MOCK_USER.totalHabits} />
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Habits
            </div>
          </div>

          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: 'var(--color-surface-secondary)' }}
          >
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              <AnimateCount value={MOCK_USER.longestStreak} />
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Best Streak
            </div>
          </div>

          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: 'var(--color-surface-secondary)' }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              <AnimateCount value={MOCK_USER.completionRate} />%
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Rate
            </div>
          </div>
        </div>

        {/* Settings list */}
        <div ref={settingsRef} className="space-y-3">
          <p
            className="text-sm font-semibold uppercase tracking-wide mb-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Settings
          </p>

          {/* Theme — locked to dark */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-4"
            style={{ background: 'var(--color-surface-secondary)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🌙</span>
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Theme
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Dark mode (locked for v1)
                </p>
              </div>
            </div>
            <div
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: 'var(--color-surface-elevated)',
                color: 'var(--color-text-muted)',
              }}
            >
              Dark
            </div>
          </div>

          {/* Notifications */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-4"
            style={{ background: 'var(--color-surface-secondary)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">🔔</span>
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Notifications
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Reminders & partner activity
                </p>
              </div>
            </div>
            <button
              type="button"
              className="w-12 h-7 rounded-full relative transition-colors duration-200"
              style={{ background: 'var(--color-accent-primary)' }}
              aria-label="Toggle notifications"
            >
              <span
                className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow"
                style={{ transition: 'transform 0.2s', transform: 'translateX(20px)' }}
              />
            </button>
          </div>

          {/* Partner */}
          <div
            className="flex items-center justify-between rounded-xl px-4 py-4"
            style={{ background: 'var(--color-surface-secondary)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">💑</span>
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  Partner
                </p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {MOCK_PARTNER.name} — {MOCK_PARTNER.streak} day streak
                </p>
              </div>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--color-accent-primary)' }}>
              Manage
            </span>
          </div>

          {/* Sign out */}
          <div className="pt-4">
            <Button title="Sign out" variant="destructive" fullWidth motion="press" />
          </div>
        </div>
      </div>
    </div>
  );
}
