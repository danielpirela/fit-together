import { clsx } from 'clsx';
import { useLayoutEffect, useRef } from 'react';

import { gsap } from '../../motion/gsap';
import { useReducedMotion } from '../../motion/useReducedMotion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeClasses = {
  small: 'w-5 h-5',
  medium: 'w-8 h-8',
  large: 'w-12 h-12',
};

const dotSizeClasses = {
  small: 'w-1 h-1',
  medium: 'w-1.5 h-1.5',
  large: 'w-2 h-2',
};

export function LoadingSpinner({ size = 'medium', className }: LoadingSpinnerProps) {
  const spinnerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!spinnerRef.current || reducedMotion) return;
    gsap.to(spinnerRef.current, {
      rotation: 360,
      duration: 0.8,
      ease: 'none',
      repeat: -1,
    });
    return () => {
      gsap.killTweensOf(spinnerRef.current);
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    // Reduced motion: static pulsing dot
    return (
      <div
        className={clsx('flex items-center justify-center', sizeClasses[size], className)}
        role="status"
        aria-label="Loading"
      >
        <span
          className={clsx(
            'rounded-full bg-[var(--color-accent-primary)] animate-pulse',
            dotSizeClasses[size]
          )}
        />
      </div>
    );
  }

  return (
    <div
      ref={spinnerRef}
      className={clsx(
        'rounded-full border-2 border-[var(--color-surface-secondary)] border-t-[var(--color-accent-primary)]',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingScreen() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!overlayRef.current || reducedMotion) return;
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: 'power2.out' }
    );
  }, [reducedMotion]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[var(--z-overlay)] flex items-center justify-center bg-[var(--color-surface-primary)]"
    >
      <LoadingSpinner size="large" />
    </div>
  );
}
