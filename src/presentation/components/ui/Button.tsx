import { clsx } from 'clsx';
import { type ButtonHTMLAttributes, type ReactNode, useLayoutEffect, useRef } from 'react';

import { easeOutQuart, gsap } from '@/presentation/motion/gsap';
import { useReducedMotion } from '@/presentation/motion/useReducedMotion';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  motion?: 'entrance' | 'press' | 'celebration';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-accent-primary)] text-[var(--color-surface-primary)] hover:opacity-90 active:opacity-80',
  secondary:
    'bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-elevated)]',
  destructive: 'bg-[var(--color-accent-secondary)] text-white hover:opacity-90 active:opacity-80',
  ghost:
    'bg-transparent text-[var(--color-accent-primary)] hover:bg-[var(--color-surface-secondary)]',
};

const sizeStyles: Record<ButtonSize, string> = {
  small: 'h-8 px-3 text-sm',
  medium: 'h-11 px-4 text-base',
  large: 'h-[52px] px-6 text-lg',
};

function LoadingDots({ size }: { size: ButtonSize }) {
  const dotSize = size === 'small' ? 'w-1.5 h-1.5' : size === 'large' ? 'w-2.5 h-2.5' : 'w-2 h-2';
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={clsx('rounded-full bg-current animate-bounce', dotSize)}
          style={{ animationDelay: `${i * 120}ms` }}
        />
      ))}
    </span>
  );
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = false,
  motion,
  children,
  className,
  disabled,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd,
  ...props
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  // Entrance animation
  useLayoutEffect(() => {
    if (!motion || reducedMotion || !buttonRef.current) return;
    if (motion === 'entrance' || motion === 'celebration') {
      gsap.fromTo(
        buttonRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.2, ease: easeOutQuart }
      );
    }
  }, [motion, reducedMotion]);

  // Press micro-animation
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion || !buttonRef.current) {
      onMouseDown?.(e);
      return;
    }
    gsap.to(buttonRef.current, { scale: 0.97, duration: 0.05, ease: 'power2.out' });
    onMouseDown?.(e);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!reducedMotion && buttonRef.current) {
      gsap.to(buttonRef.current, { scale: 1, duration: 0.1, ease: 'power2.out' });
    }
    onMouseUp?.(e);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (reducedMotion || !buttonRef.current) {
      onTouchStart?.(e);
      return;
    }
    gsap.to(buttonRef.current, { scale: 0.97, duration: 0.05, ease: 'power2.out' });
    onTouchStart?.(e);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (!reducedMotion && buttonRef.current) {
      gsap.to(buttonRef.current, { scale: 1, duration: 0.1, ease: 'power2.out' });
    }
    onTouchEnd?.(e);
  };

  return (
    <button
      ref={buttonRef}
      {...props}
      disabled={disabled || loading}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
        'transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-[var(--color-surface-primary)]',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <LoadingDots size={size} />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children || title}
        </>
      )}
    </button>
  );
}
