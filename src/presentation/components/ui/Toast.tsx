import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { clsx } from 'clsx';
import { easeOutQuart, gsap } from '../../motion/gsap';
import { useReducedMotion } from '../../motion/useReducedMotion';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const MAX_TOASTS = 3;

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const reducedMotion = useReducedMotion();
  const toastRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const gsapTimers = useRef<Map<string, gsap.core.Tween>>(new Map());

  const dismissToast = useCallback(
    (id: string) => {
      const el = toastRefs.current.get(id);
      if (el && !reducedMotion) {
        gsap.to(el, {
          opacity: 0,
          y: 10,
          duration: 0.2,
          ease: easeOutQuart,
          onComplete: () => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
            toastRefs.current.delete(id);
            gsapTimers.current.delete(id);
          },
        });
      } else {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        toastRefs.current.delete(id);
        gsapTimers.current.delete(id);
      }
    },
    [reducedMotion]
  );

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'info') => {
      const id = Math.random().toString(36).substring(7);

      setToasts((prev) => {
        // Enforce stack limit: remove oldest if at max
        const next = [...prev];
        if (next.length >= MAX_TOASTS) {
          const oldest = next.shift();
          if (oldest) {
            dismissToast(oldest.id);
          }
        }
        return [...next, { id, message, type, timestamp: Date.now() }];
      });

      // Auto-dismiss after 3 seconds
      if (!reducedMotion) {
        const timer = gsap.to(
          {},
          {
            duration: 3,
            onComplete: () => dismissToast(id),
          }
        );
        gsapTimers.current.set(id, timer);
      } else {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
          toastRefs.current.delete(id);
        }, 3000);
      }
    },
    [dismissToast, reducedMotion]
  );

  // Entrance animation when a toast is added
  useEffect(() => {
    for (const toast of toasts) {
      const el = toastRefs.current.get(toast.id);
      if (el && !reducedMotion) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: easeOutQuart }
        );
      } else if (el) {
        gsap.set(el, { opacity: 1, y: 0, scale: 1 });
      }
    }
  }, [toasts, reducedMotion]);

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-[var(--color-surface-elevated)] border-l-4 border-[var(--color-feedback-success)] text-[var(--color-text-primary)]';
      case 'error':
        return 'bg-[var(--color-surface-elevated)] border-l-4 border-[var(--color-feedback-error)] text-[var(--color-text-primary)]';
      case 'info':
        return 'bg-[var(--color-surface-elevated)] border-l-4 border-[var(--color-accent-tertiary)] text-[var(--color-text-primary)]';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-4 z-[var(--z-toast)] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            ref={(el) => {
              if (el) toastRefs.current.set(toast.id, el);
            }}
            className={clsx(
              'px-4 py-3 rounded-xl shadow-lg font-medium min-w-[280px] max-w-sm',
              getToastStyles(toast.type)
            )}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
