import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { easeOutQuart, gsap } from '../../motion/gsap';
import { useReducedMotion } from '../../motion/useReducedMotion';

/* ── Mock data ── */
const MOCK_HABITS = [
  { id: '1', name: 'Morning Run', icon: '🏃', color: '#00D4AA', streak: 5, targetCount: 5, completionsThisWeek: 4 },
  { id: '2', name: 'Read 20 pages', icon: '📚', color: '#A855F7', streak: 12, targetCount: 6, completionsThisWeek: 6 },
  { id: '3', name: 'Drink 2L water', icon: '💧', color: '#3B82F6', streak: 2, targetCount: 7, completionsThisWeek: 3 },
  { id: '4', name: 'Meditate', icon: '🧘', color: '#F59E0B', streak: 0, targetCount: 7, completionsThisWeek: 1 },
];

/* ── ParticleBurst — fires colored dots from trigger element ── */
function ParticleBurst({ triggerRef }: { triggerRef: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const trigger = triggerRef.current;
    if (!el || !trigger) return;

    const parent = trigger.offsetParent as HTMLElement | null;
    if (!parent) return;

    const rect = trigger.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - parentRect.left;
    const cy = rect.top + rect.height / 2 - parentRect.top;

    const particles = el.querySelectorAll<HTMLDivElement>('.p');
    if (reducedMotion) {
      gsap.set(particles, { opacity: 0.4, scale: 1 });
      gsap.to(el, { opacity: 0, duration: 0.15, delay: 0.05, onComplete: () => gsap.set(el, { display: 'none' }) });
      return;
    }

    particles.forEach((p, i) => {
      const angle = (i / particles.length) * Math.PI * 2;
      const distance = 40 + Math.random() * 30;
      gsap.set(p, { x: cx, y: cy, opacity: 1, scale: 1 });
      gsap.to(p, {
        x: cx + Math.cos(angle) * distance,
        y: cy + Math.sin(angle) * distance,
        opacity: 0,
        scale: 0.3,
        duration: 0.5,
        ease: 'power2.out',
        delay: i * 0.015,
      });
    });
    gsap.to(el, { opacity: 0, duration: 0.55, onComplete: () => gsap.set(el, { display: 'none' }) });
  }, [reducedMotion, triggerRef]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ display: 'none' }}
      aria-hidden="true"
    >
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="p absolute w-2 h-2 rounded-full"
          style={{ background: ['#00D4AA', '#FFD700', '#FF6B35', '#A855F7', '#3B82F6'][i % 5] }}
        />
      ))}
    </div>
  );
}

/* ── StreakFire — flame SVG with GSAP flicker loop ── */
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
    return () => { loop.kill(); };
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
      <path d="M12 2C12 2 7 8 7 13C7 16.866 9.239 20 12 20C14.761 20 17 16.866 17 13C17 8 12 2 12 2Z" fill="#FF6B35" />
      <path d="M12 7C12 7 10 10 10 12.5C10 14.433 10.895 16 12 16C13.105 16 14 14.433 14 12.5C14 10 12 7 12 7Z" fill="#FFD700" />
    </svg>
  );
}

/* ── WeeklyRing — SVG circle with GSAP fill animation ── */
function WeeklyRing({ progress, onComplete }: { progress: number; onComplete?: () => void }) {
  const ringRef = useRef<SVGCircleElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const R = 44;
  const C = 2 * Math.PI * R;
  const fillOffset = C * (1 - Math.min(progress / 7, 1));

  useLayoutEffect(() => {
    if (reducedMotion) {
      if (ringRef.current) {
        gsap.set(ringRef.current, { attr: { 'stroke-dashoffset': fillOffset } });
      }
      return;
    }
    if (ringRef.current) {
      gsap.set(ringRef.current, { attr: { 'stroke-dashoffset': C } });
      gsap.to(ringRef.current, {
        attr: { 'stroke-dashoffset': fillOffset },
        duration: 0.8,
        ease: easeOutQuart,
        onComplete: () => {
          if (progress >= 7 && flashRef.current && !reducedMotion) {
            gsap.fromTo(flashRef.current, { opacity: 0 }, { opacity: 0.3, duration: 0.4, yoyo: true, repeat: 1, onComplete });
          } else {
            onComplete?.();
          }
        },
      });
    }
  }, [progress, reducedMotion, fillOffset, C, onComplete]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="112" height="112" viewBox="0 0 112 112" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="56" cy="56" r={R} fill="none" stroke="var(--color-surface-elevated)" strokeWidth="8" />
        <circle
          ref={ringRef}
          cx="56"
          cy="56"
          r={R}
          fill="none"
          stroke="var(--color-accent-primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
          style={{ transformOrigin: 'center' }}
        />
      </svg>
      <div
        ref={flashRef}
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, #FFD700 0%, transparent 70%)', opacity: 0 }}
        aria-hidden="true"
      />
    </div>
  );
}

/* ── Page ── */
export function HabitDetailPage() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);
  const checkInRef = useRef<HTMLButtonElement>(null);
  const [completedToday, setCompletedToday] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [habit, setHabit] = useState<typeof MOCK_HABITS[0] | null>(null);

  const toggleRef = useRef<() => void>(() => {});
  toggleRef.current = () => {
    if (!habit) return;
    const newVal = !completedToday;
    setCompletedToday(newVal);
    if (newVal) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 600);
    }
  };

  useLayoutEffect(() => {
    const id = window.location.pathname.split('/habit/')[1]?.split('?')[0];
    const found = MOCK_HABITS.find((h) => h.id === id);
    if (found) {
      setHabit(found);
      setCompletedToday(found.completionsThisWeek >= 7);
    }
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion || !contentRef.current) return;
    const ctx = gsap.context();
    ctx.add(() => {
      gsap.fromTo(
        contentRef.current!.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.08, ease: easeOutQuart }
      );
    });
    return () => ctx.revert();
  }, [reducedMotion, habit]);

  const progress = habit?.completionsThisWeek ?? 0;

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--color-surface-primary)' }}>
      {showBurst && <ParticleBurst triggerRef={checkInRef} />}

      <div ref={contentRef} className="relative max-w-lg mx-auto px-4 pt-4 pb-8 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate('/habits')}
            className="text-2xl"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Go back"
          >
            ‹
          </button>
          {habit && (
            <>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${habit.color}20` }}
              >
                <span className="text-3xl">{habit.icon}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  {habit.name}
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {habit.targetCount}x per week
                </p>
              </div>
            </>
          )}
        </div>

        {/* Stats card */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'var(--color-surface-secondary)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
                This Week
              </p>
              <div className="flex items-center gap-3">
                <WeeklyRing progress={progress} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                      {progress}
                    </span>
                    <StreakFire days={habit?.streak ?? 0} className="!w-5 !h-5" />
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    / 7 days
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>Best streak</p>
              <p className="text-lg font-bold" style={{ color: 'var(--color-accent-primary)' }}>
                {habit?.streak ?? 0}d
              </p>
            </div>
          </div>
        </div>

        {/* Check-in button */}
        <div
          className="rounded-2xl p-6 flex items-center justify-between"
          style={{ background: 'var(--color-surface-secondary)' }}
        >
          <div>
            <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {completedToday ? "You're done!" : 'Not yet checked in'}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {completedToday ? 'Great job today' : 'Tap to log today'}
            </p>
          </div>
          <button
            ref={checkInRef}
            type="button"
            onClick={() => toggleRef.current()}
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all active:scale-95"
            style={{
              background: completedToday ? 'var(--color-green-primary)' : 'var(--color-surface-elevated)',
              color: completedToday ? 'var(--color-surface-primary)' : 'var(--color-text-muted)',
              border: '1px solid var(--color-border-subtle)',
            }}
            aria-label={completedToday ? 'Unmark today' : 'Mark complete'}
          >
            {completedToday ? '✓' : '○'}
          </button>
        </div>

        {/* Recent completions grid — last 30 days */}
        <div
          className="rounded-2xl p-6"
          style={{ background: 'var(--color-surface-secondary)' }}
        >
          <p className="font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Last 30 Days
          </p>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 30 }).map((_, i) => {
              const dayOffset = 29 - i;
              const date = new Date();
              date.setDate(date.getDate() - dayOffset);
              const isCompleted = habit ? (i < (habit.completionsThisWeek ?? 0) && dayOffset < 7) : false;
              return (
                <div
                  key={i}
                  className="aspect-square rounded-sm"
                  style={{
                    background: isCompleted ? habit?.color ?? 'var(--color-accent-primary)' : 'var(--color-surface-elevated)',
                  }}
                  aria-label={`Day ${i + 1}: ${isCompleted ? 'completed' : 'missed'}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}