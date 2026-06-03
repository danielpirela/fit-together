# Tasks: PR #4 — home-profile-habits

**Change**: dark-mode-redesign-with-motion
**PR**: #4 of 6 (`feature-branch-chain`)
**Branch**: `feat/dark-mode-redesign/pr-4-home-profile-habits`
**Base**: `feat/dark-mode-redesign/pr-3-layout-and-auth`
**Line budget**: ~380 lines | Risk: Medium

---

## Phase 1: HomePage

- [ ] 1.1 Update `src/presentation/pages/HomePage.tsx` — replace gray-50 placeholder with dark tokens; page bg `var(--color-surface-primary)`, cards `var(--color-surface-secondary)`, dividers `var(--color-border-subtle)` [spec:home-dashboard#requirement-1]
- [ ] 1.2 Implement stats counter animation — on mount, numeric stats (streak, weekly completions, active habits count) animate from 0 to value over 800ms, easeOutQuart; suppressed when `useReducedMotion()` is true (instant) [spec:home-dashboard#requirement-2]
- [ ] 1.3 Implement habit summary card cascade — on mount, cards animate in with 60ms stagger: fade + translateY 24px, 250ms per card; suppressed when `useReducedMotion()` is true [spec:home-dashboard#requirement-4]
- [ ] 1.4 Implement greeting header entrance — fade + translateY, 300ms, 100ms delay after data resolves [spec:home-dashboard#requirement-6]
- [ ] 1.5 Partner activity card uses `var(--color-surface-secondary)` bg; displays partner name, streak, last check-in [spec:home-dashboard#requirement-7]
- [ ] 1.6 Empty state (no habits) shows `EmptyState` with dark tokens and entrance animation [spec:home-dashboard#requirement-8]

## Phase 2: ProfilePage

- [ ] 2.1 Update `src/presentation/pages/ProfilePage.tsx` — replace gray-50 placeholder with dark tokens; page bg `var(--color-surface-primary)`, profile card `var(--color-surface-secondary)` [spec:user-profile#requirement-1]
- [ ] 2.2 Profile avatar has `var(--color-border-subtle)` border (2px); initials render on `var(--color-surface-secondary)` if no avatar [spec:user-profile#requirement-2]
- [ ] 2.3 Stats (streak, habits, partner) animate from 0 on mount — 800ms, easeOutQuart; suppressed when `useReducedMotion()` is true [spec:user-profile#requirement-3]
- [ ] 2.4 Settings rows use `var(--color-surface-secondary)` bg; toggle active state uses `var(--color-accent-primary)` [spec:user-profile#requirement-5]
- [ ] 2.5 Page heading "Profile" animates in — fade + translateY, 300ms, after data resolves [spec:user-profile#requirement-6]
- [ ] 2.6 Sign-out button implements Button press animation (`motion?: 'entrance' | 'press'`) [spec:user-profile#requirement-8]
- [ ] 2.7 Empty partner state shows `EmptyState` with dark tokens [spec:user-profile#requirement-9]

## Phase 3: HabitsPage

- [ ] 3.1 Update `src/presentation/pages/HabitsPage.tsx` — replace gray-50 placeholder with dark tokens; cards use `var(--color-surface-secondary)` bg [spec:habits-listing#requirement-5]
- [ ] 3.2 Tab indicator slides between Today/Week views — 250ms, easeOutQuart; suppressed when `useReducedMotion()` is true (snap) [spec:habits-listing#requirement-1]
- [ ] 3.3 Habit cards cascade on page mount — 60ms stagger, fade + translateY 24px, 250ms per card; suppressed when `useReducedMotion()` is true [spec:habits-listing#requirement-3]
- [ ] 3.4 Streak ≥3 days renders `StreakFire` on each habit card [spec:habits-listing#requirement-6]
- [ ] 3.5 Check-in button triggers `ParticleBurst` within 200ms of mutation success [spec:habits-listing#requirement-8]
- [ ] 3.6 Partner activity indicator — purple dot when partner logged same habit within 24h [spec:habits-listing#requirement-9]
- [ ] 3.7 Empty state for "no habits today" shows `EmptyState` with dark tokens and entrance animation [spec:habits-listing#requirement-7]

## Phase 4: Verification

- [ ] 4.1 Run `pnpm build` — must succeed
- [ ] 4.2 Run `pnpm lint` — must pass
- [ ] 4.3 Manual: visit HomePage — stats count up from 0, cards cascade in with stagger; reload with `prefers-reduced-motion: reduce` — instant render
- [ ] 4.4 Manual: visit ProfilePage — stats count up, heading fades in
- [ ] 4.5 Manual: visit HabitsPage — cards cascade in, tab indicator slides on tab switch

---

**Done when**: HomePage shows animated stats + cascade cards + dark theme; ProfilePage dark theme + animated stats; HabitsPage dark theme + cascade cards + tab indicator slide + ParticleBurst on check-in + StreakFire on streaks ≥3.

**Commit strategy**: 3 commits — (1) `feat: HomePage dark redesign — stats counter cascade greeting` (home self-contained), (2) `feat: ProfilePage dark redesign — stats avatar settings` (profile self-contained), (3) `feat: HabitsPage dark redesign — tab indicator cascade ParticleBurst StreakFire` (habits self-contained)