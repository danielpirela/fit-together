/**
 * MotionProvider — React context exposing motion utilities to the component tree.
 * Wraps the app to provide GSAP instance and reduced-motion preference.
 */

import {
  type ReactNode,
  type ReactElement,
  createContext,
  useContext,
} from 'react';
import { gsap } from './gsap';
import { useReducedMotion } from './useReducedMotion';

interface MotionValue {
  reducedMotion: boolean;
  gsap: typeof gsap;
  staggerDelay: (index: number) => number;
}

const MotionContext = createContext<MotionValue | null>(null);

interface MotionProviderProps {
  children: ReactNode;
}

export function MotionProvider({
  children,
}: MotionProviderProps): ReactElement {
  const reducedMotion = useReducedMotion();

  const value: MotionValue = {
    reducedMotion,
    gsap,
    /**
     * staggerDelay — returns the stagger offset in ms for a given index.
     * Defaults to 60ms per item. Returns 0 when reduced motion is active.
     */
    staggerDelay: (index: number): number => {
      if (reducedMotion) return 0;
      return index * 60;
    },
  };

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
}

/**
 * useMotion — access motion utilities from any component.
 * Must be used within a MotionProvider.
 */
export function useMotion(): MotionValue {
  const ctx = useContext(MotionContext);
  if (!ctx) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return ctx;
}
