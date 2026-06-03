import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { clsx } from 'clsx';
import gsap from 'gsap';

const tabs = [
  { name: 'Home', path: '/', icon: '🏠' },
  { name: 'Habits', path: '/habits', icon: '✓' },
  { name: 'Profile', path: '/profile', icon: '👤' },
];

export function TabLayout() {
  const location = useLocation();

  useEffect(() => {
    gsap.from('.tab-item', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <header className="bg-white border-b border-[var(--color-border-light)]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Fit Together</h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-border-light)]">
        <div className="max-w-lg mx-auto flex">
          {tabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={clsx(
                  'tab-item flex-1 flex flex-col items-center py-3 transition-colors',
                  isActive ? 'text-[var(--color-green-primary)]' : 'text-[var(--color-gray-400)]'
                )}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className="text-xs font-medium mt-1">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
