import { clsx } from 'clsx';
import { type InputHTMLAttributes, useRef, useState } from 'react';

import { easeOutQuart, gsap } from '../../motion/gsap';
import { useReducedMotion } from '../../motion/useReducedMotion';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helper?: string;
  containerClassName?: string;
}

export function TextInput({
  label,
  value,
  onChangeText,
  error,
  helper,
  containerClassName,
  disabled,
  ...rest
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();

  const handleFocus = () => {
    setIsFocused(true);
    if (!reducedMotion && inputRef.current) {
      gsap.to(inputRef.current, { y: -2, duration: 0.15, ease: easeOutQuart });
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!reducedMotion && inputRef.current) {
      gsap.to(inputRef.current, { y: 0, duration: 0.15, ease: easeOutQuart });
    }
  };

  const labelId = label ? `label-${label?.toLowerCase().replace(/\s+/g, '-')}` : undefined;

  return (
    <div className={clsx('mb-4 relative', containerClassName)}>
      {label && (
        <label
          id={labelId}
          htmlFor={labelId}
          className={clsx(
            'block text-sm font-medium mb-1 transition-colors duration-150',
            isFocused ? 'text-[var(--color-accent-primary)]' : 'text-[var(--color-text-muted)]',
            error && 'text-[var(--color-accent-secondary)]'
          )}
        >
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        id={labelId}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className={clsx(
          'w-full h-11 px-4 rounded-lg border text-base text-[var(--color-text-primary)]',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          !error &&
            !isFocused &&
            'border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]',
          !error &&
            isFocused &&
            'border-[var(--color-accent-primary)] ring-2 ring-[var(--color-accent-primary)]/20 bg-[var(--color-surface-secondary)]',
          error &&
            'border-[var(--color-accent-secondary)] ring-2 ring-[var(--color-accent-secondary)]/20 bg-[var(--color-surface-secondary)]',
          disabled && 'opacity-50 cursor-not-allowed bg-[var(--color-surface-elevated)]'
        )}
        aria-describedby={error ? `${labelId}-error` : helper ? `${labelId}-helper` : undefined}
        aria-invalid={!!error}
        {...rest}
      />
      {error && (
        <p id={`${labelId}-error`} className="mt-1 text-sm text-[var(--color-accent-secondary)]">
          {error}
        </p>
      )}
      {helper && !error && (
        <p id={`${labelId}-helper`} className="mt-1 text-sm text-[var(--color-text-muted)]">
          {helper}
        </p>
      )}
    </div>
  );
}
