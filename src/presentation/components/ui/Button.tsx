import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-green-primary)] text-white hover:bg-[var(--color-green-dark)]',
  secondary:
    'bg-white border border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:bg-gray-50',
  destructive: 'bg-[var(--color-red-completion)] text-white hover:bg-[var(--color-red-dark)]',
  ghost: 'bg-transparent text-[var(--color-green-primary)] hover:bg-green-50',
};

const sizeStyles: Record<ButtonSize, string> = {
  small: 'h-8 px-3 text-sm',
  medium: 'h-11 px-4 text-base',
  large: 'h-[52px] px-6 text-lg',
};

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  icon,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
        'transition-all duration-150 active:scale-[0.98]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-green-primary)] focus-visible:ring-offset-2',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <span className="animate-spin">⏳</span>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children || title}
        </>
      )}
    </button>
  );
}
