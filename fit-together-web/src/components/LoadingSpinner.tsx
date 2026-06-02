import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function LoadingSpinner({ size = 'medium', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  }

  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-2 border-gray-200 border-t-[var(--color-green-primary)]',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg-primary)]">
      <LoadingSpinner size="large" />
    </div>
  )
}
