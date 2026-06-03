import { clsx } from 'clsx';
import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { easeOutQuart, gsap } from '../motion/gsap';
import { useReducedMotion } from '../motion/useReducedMotion';

/* ── Mock data (auth bypass — no real user) ── */
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
    streak: 8,
    targetCount: 7,
    completedToday: 0,
    partnerActive: true,
    isActive: true,
  },
];

/** StreakFire — flame SVG with GSAP flicker for streaks ≥3 */
function StreakFire({ days, className }: { days: number; className?: string }) {
  const flameRef = useRef<SVGSVGElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!flameRef.current || reducedMotion || days < 3) return;
    const flame = flameRef.current;
    gsap.set(flame, { scale: days >= 7 ? 1.3 : 1 });
    const loop = gsap.to(flame, {
      scale: days >= 7 ? 1.4 : 1.06,
      opacity: 1,
      duration: 1.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => {
      loop.kill();
    };
  }, [days, reducedMotion]);

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

/** PartnerDot — purple dot with glow */
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

/** WeeklyDots — 7 dots for the week, filled based on completion */
function WeeklyDots({ completed }: { completed: number; total: number }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div className="flex gap-1.5">
      {days.map((day, i) => (
        <span
          key={`dot-${day}`}
          className="w-2 h-2 rounded-full"
          style={{
            background:
              i < completed ? 'var(--color-accent-primary)' : 'var(--color-surface-elevated)',
            opacity: i < completed ? 1 : 0.4,
          }}
        />
      ))}
    </div>
  );
}

/* ── Page component ── */
type TabType = 'today' | 'week';

export function HabitsPage() {
  const reducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const activeHabits = MOCK_HABITS.filter((h) => h.isActive);
  const displayedHabits = activeTab === 'today' ? activeHabits : activeHabits;

  /* Tab indicator animation */
  useLayoutEffect(() => {
    if (reducedMotion || !tabIndicatorRef.current) return;
    const indicator = tabIndicatorRef.current;
    const tabs = indicator.parentElement?.querySelectorAll('[data-tab]');
    if (!tabs) return;
    const idx = activeTab === 'today' ? 0 : 1;
    const tab = tabs[idx] as HTMLElement;
    if (!tab) return;
    gsap.to(indicator, {
      x: tab.offsetLeft,
      width: tab.offsetWidth,
      duration: 0.25,
      ease: easeOutQuart,
    });
  }, [activeTab, reducedMotion]);

  /* Cards cascade on mount */
  useLayoutEffect(() => {
    if (reducedMotion || !cardsRef.current) return;
    const children = cardsRef.current.children;
    gsap.fromTo(
      children,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, ease: easeOutQuart }
    );
  }, [reducedMotion]);

  /* Heading entrance */
  useLayoutEffect(() => {
    if (reducedMotion || !headingRef.current) return;
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.3, ease: easeOutQuart }
    );
  }, [reducedMotion]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface-primary)' }}>
      <div className="max-w-lg mx-auto px-4 pt-6 pb-6">
        {/* Heading + Add */}
        <div ref={headingRef} className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            My Habits
          </h1>
          <Link to="/add-habit">
            <Button title="+ Add" variant="primary" size="small" />
          </Link>
        </div>

        {/* Tab bar with animated indicator */}
        <div
          className="relative flex rounded-xl p-1 mb-6"
          style={{ background: 'var(--color-surface-secondary)' }}
        >
          {/* Indicator pill */}
          <div
            ref={tabIndicatorRef}
            className="absolute top-1 bottom-1 rounded-lg"
            style={{
              background: 'var(--color-surface-elevated)',
              transition: reducedMotion ? 'none' : undefined,
              pointerEvents: 'none',
              width: '50%',
            }}
          />

          <button
            type="button"
            data-tab="0"
            onClick={() => setActiveTab('today')}
            className="flex-1 py-2 text-sm font-semibold rounded-lg z-10 relative transition-colors duration-150"
            style={{
              color:
                activeTab === 'today' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            }}
          >
            Today
          </button>
          <button
            type="button"
            data-tab="1"
            onClick={() => setActiveTab('week')}
            className="flex-1 py-2 text-sm font-semibold rounded-lg z-10 relative transition-colors duration-150"
            style={{
              color: activeTab === 'week' ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            }}
          >
            Week
          </button>
        </div>

        {/* Habits list */}
        {displayedHabits.length === 0 ? (
          <EmptyState
            title="No habits yet"
            description="Create your first habit to get started!"
            icon="📝"
            action={{
              title: 'Create Habit',
              onClick: () => {
                window.location.href = '/add-habit';
              },
            }}
          />
        ) : (
          <div ref={cardsRef} className="space-y-3">
            {displayedHabits.map((habit) => (
              <div
                key={habit.id}
                className="rounded-2xl p-4 cursor-pointer"
                style={{
                  background: 'var(--color-surface-secondary)',
                  border: '1px solid var(--color-border-subtle)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (reducedMotion) return;
                  gsap.to(e.currentTarget, {
                    y: -2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    duration: 0.15,
                  });
                }}
                onMouseLeave={(e) => {
                  if (reducedMotion) return;
                  gsap.to(e.currentTarget, { y: 0, boxShadow: 'none', duration: 0.15 });
                }}
                onMouseDown={(e) => {
                  if (reducedMotion) return;
                  gsap.to(e.currentTarget, { scale: 0.98, duration: 0.05 });
                }}
                onMouseUp={(e) => {
                  if (reducedMotion) return;
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.1, ease: 'back.out(2)' });
                }}
              >
                <div className="flex items-center gap-4">
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
                      {habit.streak >= 3 && <StreakFire days={habit.streak} />}
                      <PartnerDot isOnline={habit.partnerActive} />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <WeeklyDots completed={habit.completedToday} total={habit.targetCount} />
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {habit.completedToday}/{habit.targetCount} this week
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <span
                    className="text-2xl flex-shrink-0"
                    style={{ color: 'var(--color-text-disabled)' }}
                  >
                    ›
                  </span>
                </div>

                {/* Check-in button row */}
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95"
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
                    onClick={(e) => {
                      e.stopPropagation();
                      // Simulate check-in
                      gsap.fromTo(
                        e.currentTarget,
                        { scale: 0.9 },
                        { scale: 1, duration: 0.2, ease: 'back.out(2)' }
                      );
                    }}
                  >
                    {habit.completedToday > 0 ? '✓ Done' : '+ Check in'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
