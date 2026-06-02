import { useState, type InputHTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  error?: string
  helper?: string
  containerClassName?: string
}

export function TextInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helper,
  containerClassName,
  ...rest
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={clsx('mb-4', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ colorScheme: 'light' }}
        className={clsx(
          'w-full h-11 px-4 rounded-lg border bg-white text-base text-[var(--color-text-primary)]',
          'transition-all duration-150',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          !error && !isFocused && 'border-[var(--color-border-light)]',
          !error && isFocused && 'border-[var(--color-green-primary)] ring-2 ring-[var(--color-green-primary)]/20',
          error && 'border-[var(--color-red-completion)] ring-2 ring-[var(--color-red-completion)]/20',
          rest.disabled && 'bg-gray-50 cursor-not-allowed'
        )}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-[var(--color-red-completion)]">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1 text-sm text-[var(--color-gray-400)]">{helper}</p>
      )}
    </div>
  )
}
