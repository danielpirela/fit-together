# Tasks: PR #3 — layout-and-auth

**Change**: dark-mode-redesign-with-motion
**PR**: #3 of 6 (`feature-branch-chain`)
**Branch**: `feat/dark-mode-redesign/pr-3-layout-and-auth`
**Base**: `feat/dark-mode-redesign/pr-2-ui-components-redesign`
**Line budget**: ~380 lines | Risk: Medium

---

## Phase 1: TabLayout Indicator + PageTransition

- [ ] 1.1 Update `src/presentation/components/layout/TabLayout.tsx` — replace hard-coded colors with dark surface tokens; update tab bar bg to `var(--color-surface-primary)`, active icon/text to `var(--color-accent-primary)`, inactive to `var(--color-text-muted)` [spec:layout-chrome#requirement-4]
- [ ] 1.2 Implement GSAP indicator slide — active tab indicator animates from previous to new position: 250ms, easeOutQuart, width change animates smoothly (200ms) [spec:layout-chrome#requirement-1]
- [ ] 1.3 Indicator animation suppressed when `useReducedMotion()` is true — snap instantly [spec:layout-chrome#requirement-2]
- [ ] 1.4 Add `PageTransition` wrapper around `<Outlet>` — outgoing page fades (150ms), incoming fades in (200ms, delay 100ms), suppressed when `useReducedMotion()` is true [spec:layout-chrome#requirement-3]
- [ ] 1.5 Add 1px top border `var(--color-border-subtle)` to tab bar [spec:layout-chrome#requirement-7]

## Phase 2: LoginPage

- [ ] 2.1 Update `src/presentation/pages/LoginPage.tsx` — replace all hard-coded colors with dark tokens; page bg `var(--color-surface-primary)`, form fields `var(--color-surface-secondary)` [spec:auth-flow#requirement-1]
- [ ] 2.2 Implement staggered form field entrance — heading fades in at 100ms, first field at 150ms, subsequent fields 60ms apart, 250ms duration, easeOutQuart [spec:auth-flow#requirement-2]
- [ ] 2.3 Stagger suppressed when `useReducedMotion()` is true — all fields render at final position instantly [spec:auth-flow#requirement-3]
- [ ] 2.4 Verify: no `colorScheme: 'light'` in LoginPage form fields

## Phase 3: SignUpPage

- [ ] 3.1 Update `src/presentation/pages/SignUpPage.tsx` — dark tokens, stagger entrance same timing as LoginPage [spec:auth-flow#requirement-1]
- [ ] 3.2 Verify: no `colorScheme: 'light'` in SignUpPage form fields

## Phase 4: ResetPasswordPage + InvitePage

- [ ] 4.1 Update `src/presentation/pages/ResetPasswordPage.tsx` — dark tokens, stagger entrance [spec:auth-flow#requirement-1]
- [ ] 4.2 Update `src/presentation/pages/InvitePage.tsx` — dark tokens, stagger entrance [spec:auth-flow#requirement-1]

## Phase 5: Verification

- [ ] 5.1 Run `pnpm build` — must succeed
- [ ] 5.2 Run `pnpm lint` — must pass
- [ ] 5.3 Manual: navigate between tabs — indicator slides smoothly; reload with `prefers-reduced-motion: reduce` — indicator snaps instantly
- [ ] 5.4 Manual: visit LoginPage — form fields animate in with stagger; reload with `prefers-reduced-motion: reduce` — fields appear instantly

---

**Done when**: TabLayout indicator slides between tabs with GSAP; page transitions fade; auth pages use dark tokens with staggered entrance; all reduced-motion suppressed correctly.

**Commit strategy**: 2 commits — (1) `feat: TabLayout indicator slide + PageTransition wrapper` (layout chrome self-contained), (2) `feat: auth pages dark redesign — Login, SignUp, ResetPassword, Invite stagger entrances` (auth pages as a logical group)