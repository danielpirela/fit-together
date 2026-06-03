import { clsx } from 'clsx';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { easeOutQuart, gsap } from '@/presentation/motion/gsap';
import { useReducedMotion } from '@/presentation/motion/useReducedMotion';

/* ── Mock data (auth bypass — no real user) ── */
const MOCK_USER = { name: 'Daniel', email: 'daniel@example.com' };
const MOCK_PARTNER = { name: 'Maria', streak: 6, lastCheckin: '2h ago', isOnline: true };

const MOCK_HABITS = [
  {
    id: '1',
    name: 'Morning Run',
    icon: '🏃',
    color: '#00D4AA',
    streak: 5,
    targetCount: 5,
    completedToday: 1,
    partnerActive: true,
    isActive: true,
  },
  {
    id: '2',
    name: 'Read 20 pages',
    icon: '📚',
    color: '#A855F7',
    streak: 12,
    targetCount: 6,
    completedToday: 0,
    partnerActive: false,
    isActive: true,
  },
  {
    id: '3',
    name: 'Drink 2L water',
    icon: '💧',
    color: '#3B82F6',
    streak: 2,
    targetCount: 7,
    completedToday: 1,
    partnerActive: true,
    isActive: true,
  },
  {
    id: '4',
    name: 'Meditate',
    icon: '🧘',
    color: '#F59E0B',
    streak: 0,
    targetCount: 7,
    completedToday: 0,
    partnerActive: false,
    isActive: true,
  },
];

/* ── Inline motion primitives ── */

/** StatsCounter — animates a number from 0 to `value` over 800ms */
function StatsCounter({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    let start = 0;
    const duration = 800;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 4; // easeOutQuart approx
      start = Math.round(eased * value);
      setDisplay(start);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, reducedMotion]);

  return <span className={className}>{display}</span>;
}

/** StreakFire — flame SVG with GSAP flicker loop */
function StreakFire({ days, className }: { days: number; className?: string }) {
  const flameRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();
  const isTier2 = days >= 7;

  useLayoutEffect(() => {
    if (!flameRef.current || reducedMotion || days < 3) return;
    const flame = flameRef.current;
    gsap.set(flame, { scale: isTier2 ? 1.3 : 1 });
    const loop = gsap.to(flame, {
      scale: isTier2 ? 1.4 : 1.06,
      opacity: 1,
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => {
      loop.kill();
    };
  }, [days, reducedMotion, isTier2]);

  if (days < 3) return null;

  return (
    <svg
      ref={flameRef}
      className={clsx('inline-block', className)}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      style={{ transformOrigin: 'bottom center', display: 'inline-block', verticalAlign: 'middle' }}
      role="img"
      aria-label={`${days} day streak`}
    >
      <title>{days} day streak</title>
      <path
        d="M12 2C12 2 7 8 7 13C7 16.866 9.239 20 12 20C14.761 20 17 16.866 17 13C17 8 12 2 12 2Z"
        fill="#FF6B35"
      />
      <path
        d="M12 7C12 7 10 10 10 12.5C10 14.433 10.895 16 12 16C13.105 16 14 14.433 14 12.5C14 10 12 7 12 7Z"
        fill="#FFD700"
      />
    </svg>
  );
}

/** PartnerDot — small purple glowing dot */
function PartnerDot({ isOnline }: { isOnline: boolean }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{
        background: '#A855F7',
        boxShadow: isOnline ? '0 0 6px 2px #A855F7' : 'none',
        opacity: isOnline ? 1 : 0.4,
      }}
    />
  );
}

/* ── Page component ── */
export function HomePage() {
  const reducedMotion = useReducedMotion();
  const greetingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const totalStreak = MOCK_HABITS.reduce((sum, h) => (h.streak > 0 ? sum + h.streak : sum), 0) || 4;
  const completedToday = MOCK_HABITS.filter((h) => h.completedToday > 0).length;
  const weeklyCount = MOCK_HABITS.length;

  /* Entrance animations */
  useLayoutEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context();

    // Greeting
    if (greetingRef.current) {
      ctx.add(() => {
        gsap.fromTo(
          greetingRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.3, delay: 0.1, ease: easeOutQuart }
        );
      });
    }

    // Stats
    if (statsRef.current) {
      ctx.add(() => {
        gsap.fromTo(
          statsRef.current!.children,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, ease: easeOutQuart }
        );
      });
    }

    // Cards cascade
    if (cardsRef.current) {
      ctx.add(() => {
        gsap.fromTo(
          cardsRef.current!.children,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, ease: easeOutQuart }
        );
      });
    }

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: 'var(--color-surface-primary)' }}
    >
      {/* Ambient background blob */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #00D4AA 0%, transparent 70%)',
          animation: 'blob-drift 8s ease-in-out infinite',
        }}
      />

      <div className="relative max-w-lg mx-auto px-4 pt-8 pb-6">
        {/* Greeting */}
        <div ref={greetingRef} className="mb-8">
          <h1 className="text-3xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Hey {MOCK_USER.name} 👋
          </h1>
          <p style={{ color: 'var(--color-text-muted)' }}>
            {completedToday > 0
              ? `You've crushed ${completedToday} habit${completedToday > 1 ? 's' : ''} today`
              : 'Start your day strong — check in a habit'}
          </p>
        </div>

        {/* Stats row */}
        <div ref={statsRef} className="grid grid-cols-3 gap-3 mb-8">
          {/* Streak */}
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: 'var(--color-surface-secondary)' }}
          >
            <div
              className="text-2xl font-bold mb-1"
              style={{ color: 'var(--color-accent-primary)' }}
            >
              <StatsCounter value={totalStreak} />
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Day Streak
            </div>
          </div>

          {/* Today's */}
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: 'var(--color-surface-secondary)' }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              <StatsCounter value={completedToday} />/{MOCK_HABITS.length}
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Today
            </div>
          </div>

          {/* Habits */}
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: 'var(--color-surface-secondary)' }}
          >
            <div className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              <StatsCounter value={weeklyCount} />
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Habits
            </div>
          </div>
        </div>

        {/* Today's habits heading */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Today's Habits
          </h2>
          <Link
            to="/habits"
            className="text-sm font-medium"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            See all
          </Link>
        </div>

        {/* Habit cards */}
        {MOCK_HABITS.length === 0 ? (
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: 'var(--color-surface-secondary)' }}
          >
            <p className="text-4xl mb-4">🌱</p>
            <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Plant your first habit
            </p>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
              Start building streaks with your partner
            </p>
            <Link
              to="/add-habit"
              className="inline-block px-6 py-3 rounded-xl font-semibold text-sm"
              style={{
                background: 'var(--color-accent-primary)',
                color: 'var(--color-surface-primary)',
              }}
            >
              Add first habit
            </Link>
          </div>
        ) : (
          <div ref={cardsRef} className="space-y-3">
            {MOCK_HABITS.map((habit) => (
              <div
                key={habit.id}
                className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                style={{
                  background: 'var(--color-surface-secondary)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${habit.color}20` }}
                >
                  <span className="text-2xl">{habit.icon}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className="font-semibold truncate"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {habit.name}
                    </p>
                    {habit.streak > 0 && <StreakFire days={habit.streak} />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {habit.completedToday > 0 ? '✓ Done' : 'Not yet'}
                    </span>
                    <PartnerDot isOnline={habit.partnerActive} />
                    {habit.partnerActive && (
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        Maria checked in
                      </span>
                    )}
                  </div>
                </div>

                {/* Check-in */}
                <button
                  type="button"
                  className={clsx(
                    'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all'
                  )}
                  style={{
                    background:
                      habit.completedToday > 0
                        ? 'var(--color-surface-elevated)'
                        : 'var(--color-accent-primary)',
                    color:
                      habit.completedToday > 0
                        ? 'var(--color-text-muted)'
                        : 'var(--color-surface-primary)',
                  }}
                >
                  {habit.completedToday > 0 ? '✓' : '+'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Partner card */}
        <div
          className="mt-6 rounded-2xl p-4 flex items-center gap-4"
          style={{
            background: 'var(--color-surface-secondary)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ background: 'var(--color-accent-tertiary)', color: 'white' }}
          >
            M
          </div>
          <div className="flex-1">
            <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {MOCK_PARTNER.name}
            </p>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                🔥 {MOCK_PARTNER.streak} day streak
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Last: {MOCK_PARTNER.lastCheckin}
              </span>
            </div>
          </div>
          <PartnerDot isOnline={MOCK_PARTNER.isOnline} />
        </div>
      </div>

      <style>{`
        @keyframes blob-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -10px) scale(1.05); }
          66% { transform: translate(-10px, 15px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
