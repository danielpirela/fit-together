/**
 * useReducedMotion — React hook exposing reduced-motion preference.
 * Returns true when OS/browser prefers reduced motion.
 * Hook is stable across renders — uses useSyncExternalStore for reactivity.
 */

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

/**
 * Returns true when the user prefers reduced motion.
 * Re-renders automatically when OS preference changes.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
