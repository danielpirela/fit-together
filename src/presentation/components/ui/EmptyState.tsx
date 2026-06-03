import { useLayoutEffect, useRef } from 'react';

import { easeOutQuart, gsap } from '../../motion/gsap';
import { useReducedMotion } from '../../motion/useReducedMotion';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: {
    title: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!containerRef.current || reducedMotion) return;

    const children = containerRef.current.children;
    gsap.fromTo(
      children,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.15,
        ease: easeOutQuart,
        stagger: 0.06,
      }
    );
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      {icon && <span className="text-5xl mb-4">{icon}</span>}
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{title}</h3>
      {description && <p className="text-[var(--color-text-muted)] mb-6 max-w-sm">{description}</p>}
      {action && <Button title={action.title} onClick={action.onClick} variant="primary" />}
    </div>
  );
}
