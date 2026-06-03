# Tasks: PR #5b — couple-partner-ripple

**Change**: dark-mode-redesign-with-motion
**PR**: #5b of 6 (`feature-branch-chain`)
**Branch**: `feat/dark-mode-redesign/pr-5b-couple-partner-ripple`
**Base**: `feat/dark-mode-redesign/pr-4-home-profile-habits`
**Line budget**: ~180 lines | Risk: Low

---

## Phase 1: PartnerRipple Motion Primitive

- [ ] 1.1 Create `src/presentation/motion/PartnerRipple.tsx` — accepts `partnerName`, `habitName?`, `onComplete?`; renders purple (#A855F7) ring at partner avatar position; GSAP: scale 0.5→1, opacity 0→0.8, 700ms, easeOutQuart; `useReducedMotion()` returns true → no ring animation (toast only); fires toast simultaneously "[Partner] logged [habit]" [spec:habit-detail#requirement-7]

## Phase 2: CreateCouplePage

- [ ] 2.1 Update `src/presentation/pages/CreateCouplePage.tsx` — replace all hard-coded colors with dark tokens; page bg `var(--color-surface-primary)`, form fields `var(--color-surface-secondary)` [spec:couple-flow#requirement-1]
- [ ] 2.2 Implement staggered form field entrance — heading at 100ms, first field at 150ms, subsequent fields 60ms apart, 250ms per field, easeOutQuart; suppressed when `useReducedMotion()` is true [spec:couple-flow#requirement-2]
- [ ] 2.3 Page heading "Create Couple" animates in — fade + translateY, 300ms, 100ms delay [spec:couple-flow#requirement-3]
- [ ] 2.4 Couple code display uses monospace font, `var(--color-text-primary)` on `var(--color-surface-secondary)` bg [spec:couple-flow#requirement-4]
- [ ] 2.5 `createCouple` success triggers `ParticleBurst` on submit button within 200ms [spec:couple-flow#requirement-5]

## Phase 3: InvitePartnerPage

- [ ] 3.1 Update `src/presentation/pages/InvitePartnerPage.tsx` — dark tokens, staggered form field entrance (same timing as CreateCouplePage), heading entrance animation [spec:couple-flow#requirement-1]

## Phase 4: InvitePage + PartnerRipple Integration

- [ ] 4.1 Update `InvitePage.tsx` — improve stagger entrance for consistency with other auth pages [spec:auth-flow#requirement-1]
- [ ] 4.2 Integrate `PartnerRipple` on HabitDetailPage (already in #5a scope) — on 5s partner activity poll detecting new completion, fire `PartnerRipple` + toast [spec:habit-detail#requirement-6]
- [ ] 4.3 Copy/share actions for invite code use `var(--color-accent-primary)` text color [spec:couple-flow#requirement-6]

## Phase 5: Verification

- [ ] 5.1 Run `pnpm build` — must succeed
- [ ] 5.2 Run `pnpm lint` — must pass
- [ ] 5.3 Manual: visit CreateCouplePage — fields stagger in; couple creation fires ParticleBurst
- [ ] 5.4 Manual: partner check-in → within 7s, purple ripple fires + toast appears
- [ ] 5.5 Manual: reload with `prefers-reduced-motion: reduce` — no ripple animation; toast text only

---

**Done when**: CreateCouplePage + InvitePartnerPage dark tokens + staggered entrance; PartnerRipple purple ring fires within 7s of partner check-in; toast fires simultaneously.

**Commit strategy**: Single commit `feat: couple pages dark + PartnerRipple purple ring animation` (couple pages + motion primitive together)