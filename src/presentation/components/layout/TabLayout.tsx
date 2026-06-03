import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import gsap from 'gsap';
import { useReducedMotion } from '@/presentation/motion/useReducedMotion';

const tabs = [
  { name: 'Home', path: '/', icon: '🏠' },
  { name: 'Habits', path: '/habits', icon: '✓' },
  { name: 'Profile', path: '/profile', icon: '👤' },
];

/**
 * PageTransition — wraps the outlet with fade-in/out on route changes.
 * Outgoing: 150ms fade-out. Incoming: 200ms fade-in (100ms delay).
 * Instant swap when reduced-motion is active.
 */
function PageTransition({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const outletRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!outletRef.current) return;
    if (reducedMotion) return;

    const el = outletRef.current;
    gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, delay: 0.1, ease: 'quart.out' }
    );
  }, [children, reducedMotion]);

  return (
    <div ref={outletRef} className="w-full">
      {children}
    </div>
  );
}

export function TabLayout() {
  const location = useLocation();
  const reducedMotion = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(() => {
    const found = tabs.find((t) => t.path === location.pathname);
    return found ? tabs.indexOf(found) : 0;
  });

  // Update active tab index on navigation
  useEffect(() => {
    const idx = tabs.findIndex((t) => t.path === location.pathname);
    if (idx !== -1) setActiveTab(idx);
  }, [location.pathname]);

  // Animate indicator on tab change
  useEffect(() => {
    if (!navRef.current || !indicatorRef.current || reducedMotion) return;

    const nav = navRef.current;
    const indicator = indicatorRef.current;
    const tabElements = nav.querySelectorAll<HTMLAnchorElement>('[data-tab]');

    if (!tabElements[activeTab]) return;

    const activeEl = tabElements[activeTab];
    const { offsetLeft, offsetWidth } = activeEl;

    gsap.to(indicator, {
      x: offsetLeft,
      width: offsetWidth,
      duration: 0.25,
      ease: 'quart.out',
    });
  }, [activeTab, reducedMotion]);

  // Initial indicator position setup
  useEffect(() => {
    if (!navRef.current || !indicatorRef.current) return;

    const nav = navRef.current;
    const tabElements = nav.querySelectorAll<HTMLAnchorElement>('[data-tab]');

    if (!tabElements[activeTab]) return;

    const activeEl = tabElements[activeTab];
    const { offsetLeft, offsetWidth } = activeEl;

    gsap.set(indicatorRef.current, {
      x: offsetLeft,
      width: offsetWidth,
    });
  }, [reducedMotion]);

  const activeTabData = tabs[activeTab];

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--color-surface-primary)' }}
    >
      {/* Header */}
      <header
        className="border-b"
        style={{ borderColor: 'var(--color-border-subtle)' }}
      >
        <div
          className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between"
          style={{ background: 'var(--color-surface-primary)' }}
        >
          <h1
            className="text-lg font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Fit Together
          </h1>
        </div>
      </header>

      {/* Page content with transition */}
      <main className="max-w-lg mx-auto pb-20">
        <PageTransition key={location.pathname}>
          <Outlet />
        </PageTransition>
      </main>

      {/* Tab bar */}
      <nav
        ref={navRef}
        className="fixed bottom-0 left-0 right-0 border-t"
        style={{
          background: 'var(--color-surface-primary)',
          borderColor: 'var(--color-border-subtle)',
        }}
      >
        <div className="max-w-lg mx-auto flex relative">
          {/* Animated indicator pill */}
          <div
            ref={indicatorRef}
            className="absolute top-0 h-full rounded-full"
            style={{
              background: 'var(--color-surface-elevated)',
              transition: reducedMotion ? 'none' : undefined,
              pointerEvents: 'none',
            }}
          />

          {tabs.map((tab, idx) => {
            const isActive = activeTabData.path === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                data-tab={idx}
                className={clsx(
                  'flex-1 flex flex-col items-center py-3 z-10 transition-colors duration-150'
                )}
                style={{
                  color: isActive
                    ? 'var(--color-accent-primary)'
                    : 'var(--color-text-muted)',
                }}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span
                  className="text-xs font-medium mt-1"
                  style={{
                    color: isActive
                      ? 'var(--color-accent-primary)'
                      : 'var(--color-text-muted)',
                  }}
                >
                  {tab.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}