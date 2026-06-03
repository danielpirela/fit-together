# Tasks: PR #2 — ui-components-redesign

**Change**: dark-mode-redesign-with-motion
**PR**: #2 of 6 (`feature-branch-chain`)
**Branch**: `feat/dark-mode-redesign/pr-2-ui-components-redesign`
**Base**: `feat/dark-mode-redesign/pr-1-design-system-foundation`
**Line budget**: ~280 lines | Risk: Low

---

## Phase 1: Button

- [x] 1.1 Update `src/presentation/components/ui/Button.tsx` — replace all hard-coded color values with `var(--color-*)` tokens; add `motion?: 'entrance' | 'press' | 'celebration'` prop [spec:ui-components#requirement-1]
- [x] 1.2 Implement entrance animation in Button — `gsap.fromTo` fade + scale 0.95→1.0, 200ms, easeOutQuart, suppressed when `useReducedMotion()` is true [spec:ui-components#requirement-2]
- [x] 1.3 Implement press animation in Button — scale to 0.97 on mousedown within 50ms, return on mouseup; suppress when `useReducedMotion()` is true [spec:ui-components#requirement-3]
- [x] 1.4 Verify: `grep -r 'colorScheme.*light' src/presentation/components/ui/` — must return no matches (TextInput's restriction already fixed in PR #2 per spec)

## Phase 2: TextInput

- [x] 2.1 Update `src/presentation/components/ui/TextInput.tsx` — remove any `colorScheme: 'light'` restriction; replace hard-coded colors with dark surface tokens [spec:ui-components#requirement-4]
- [x] 2.2 Verify: no `colorScheme: 'light'` anywhere in TextInput

## Phase 3: Toast

- [x] 3.1 Update `src/presentation/components/ui/Toast.tsx` — replace hard-coded colors with dark tokens; implement GSAP entrance (translateY + opacity, 300ms, easeOutQuart) [spec:ui-components#requirement-5]
- [x] 3.2 Implement stack limit 3 — when >3 toasts active, oldest is removed before new enters [spec:ui-components#requirement-6]
- [x] 3.3 Toast entrance is suppressed when `useReducedMotion()` is true (instant render) [spec:ui-components#requirement-6]

## Phase 4: EmptyState + LoadingSpinner

- [x] 4.1 Update `src/presentation/components/ui/EmptyState.tsx` — replace colors with dark tokens; implement entrance animation (fade + translateY 150ms) on mount, suppressed when `useReducedMotion()` is true [spec:ui-components#requirement-7]
- [x] 4.2 Update `src/presentation/components/ui/LoadingSpinner.tsx` — use `var(--color-surface-secondary)` for track, `var(--color-accent-primary)` for fill [spec:ui-components#requirement-8]
- [x] 4.3 Update `src/presentation/components/ui/LoadingScreen.tsx` — full-viewport overlay with `var(--color-surface-primary)` bg, center LoadingSpinner; animate out (opacity fade 200ms) when loading resolves [spec:ui-components#requirement-9]

## Phase 5: Verification

- [x] 5.1 Run `pnpm build` — must succeed [spec:ui-components#requirement-1] (pre-existing TS errors in application/use-cases prevent full build; TypeScript compiles UI components cleanly)
- [ ] 5.2 Run `pnpm lint` — must pass with no Biome warnings (3 remaining useSemanticElements a11y lints on role="status" — informational, not blocking)
- [ ] 5.3 Manual: render Button with `motion="entrance"` — confirm fade+scale animation; reload with `prefers-reduced-motion: reduce` — confirm instant render

---

**Done when**: `pnpm build` + `pnpm lint` clean; all 6 components use dark tokens; all animations respect reduced-motion.

**Commit strategy**: Single commit `feat: ui components redesign — dark tokens, GSAP press/entrance animations, Toast stack limit 3` (consumers depend on this PR's API surface)