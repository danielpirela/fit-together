# Tasks: PR #5a — habit-detail-celebrations

**Change**: dark-mode-redesign-with-motion
**PR**: #5a of 6 (`feature-branch-chain`)
**Branch**: `feat/dark-mode-redesign/pr-5a-habit-detail-celebrations`
**Base**: `feat/dark-mode-redesign/pr-4-home-profile-habits`
**Line budget**: ~220 lines | Risk: Low

---

## Phase 1: HabitDetailPage

- [ ] 1.1 Update `src/presentation/pages/HabitDetailPage.tsx` — replace all hard-coded colors with dark tokens; page bg `var(--color-surface-primary)`, cards `var(--color-surface-secondary)`, text `var(--color-text-primary)` [spec:habit-detail#requirement-1]
- [ ] 1.2 Implement weekly completion SVG ring animation — on mount, ring animates from 0% to current fill over 800ms, easeOutQuart; at 100% fill, gold flash effect plays once (scale pulse + opacity); suppressed when `useReducedMotion()` is true (instant, no flash) [spec:habit-detail#requirement-2]
- [ ] 1.3 Implement `ParticleBurst` on check-in button — within 200ms of `logHabitCompletion` success callback; `ParticleBurst` mounts to button's offsetParent; suppressed when `useReducedMotion()` is true (opacity flash 150ms instead) [spec:habit-detail#requirement-3]
- [ ] 1.4 Implement `StreakFire` tiers — streak 3–6 days: tier-1 flame (standard size, GSAP flicker loop 1.5s); streak ≥7 days: tier-2 flame (1.3× scale, drop-shadow glow with slow pulse 2s); suppressed when `useReducedMotion()` is true (static SVG, no animation) [spec:habit-detail#requirement-5]
- [ ] 1.5 Stats section uses `var(--color-text-primary)` for values, `var(--color-text-muted)` for labels; displays current streak, weekly progress (X/7), best streak [spec:habit-detail#requirement-9]

## Phase 2: AddHabitPage

- [ ] 2.1 Update `src/presentation/pages/AddHabitPage.tsx` — replace all hard-coded colors with dark tokens; page bg `var(--color-surface-primary)`, form fields `var(--color-surface-secondary)` [spec:habit-creation#requirement-1]
- [ ] 2.2 Implement staggered form field entrance — heading at 100ms, first field at 150ms, subsequent fields 60ms apart, 250ms per field, easeOutQuart; suppressed when `useReducedMotion()` is true [spec:habit-creation#requirement-2]
- [ ] 2.3 Day-picker uses `var(--color-accent-primary)` fill for selected days (fill-only default, no slide); instant for reduced-motion users [spec:habit-creation#requirement-4]
- [ ] 2.4 `createHabit` success triggers `ParticleBurst` on submit button within 200ms [spec:habit-creation#requirement-5]
- [ ] 2.5 Field labels use `var(--color-text-muted)`; page heading "New Habit" animates in — fade + translateY, 300ms [spec:habit-creation#requirement-6]
- [ ] 2.6 Empty habit name validation error uses `var(--color-feedback-error)` with entrance timing [spec:habit-creation#requirement-7]

## Phase 3: Verification

- [ ] 3.1 Run `pnpm build` — must succeed
- [ ] 3.2 Run `pnpm lint` — must pass
- [ ] 3.3 Manual: visit HabitDetailPage for habit with 5-day streak — weekly ring animates from 0%, StreakFire tier-1 visible
- [ ] 3.4 Manual: check in — ParticleBurst fires within 200ms
- [ ] 3.5 Manual: visit AddHabitPage — form fields stagger in; submit fires ParticleBurst
- [ ] 3.6 Manual: reload with `prefers-reduced-motion: reduce` — all animations instant; streak shows static flame

---

**Done when**: HabitDetailPage shows weekly ring animation + StreakFire tier 1/2 + ParticleBurst on check-in; AddHabitPage shows staggered form fields + ParticleBurst on success + dark day-picker fill.

**Commit strategy**: Single commit `feat: HabitDetailPage celebrations + AddHabitPage staggered forms` ( tightly coupled through ParticleBurst and cascade patterns, easier to review as one)