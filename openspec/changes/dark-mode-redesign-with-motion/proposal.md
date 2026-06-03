# Proposal: Dark-Mode Redesign with Motion

## Intent

The user wants a "rompedora" dark-mode fit-together with abundant GSAP motion — a product so satisfying that opening it to log a habit feels like a reward. Today the app is inert: 13 routes exist, most are gray-50 placeholders; `src/index.css` is just `@import "tailwindcss"`, so every referenced `var(--color-*)` resolves to nothing; motion is two isolated GSAP staggers. This change delivers a dark theme, a real token system, a GSAP motion language, and habit-forming mechanics.

## Scope

**In**: dark theme (Obsidian Pulse), `theme.css` with broken CSS vars + Tailwind v4 `@theme`, GSAP motion system (`useReducedMotion`, easing/duration tokens, `ParticleBurst`, `StreakFire`), 7-component UI redesign, layout chrome, all 13 pages redesigned, habit-forming mechanics, `prefers-reduced-motion` from PR #1.
**Out**: real auth restoration, light mode, sound (Web Audio), haptics, push notifications, i18n, Supabase Realtime partner sync (v1 polls 5s).

## Approach

| Layer | Mechanism |
|-------|-----------|
| Tokens | CSS custom properties + Tailwind v4 `@theme` in `src/presentation/styles/theme.css` |
| Dark activation | `document.documentElement.dataset.theme = 'dark'` in `main.tsx` (no FOUC) |
| Motion | GSAP core + `ScrollTrigger` + `useGSAP` hook (refs, React 19 safe) |
| Reduced motion | `useReducedMotion()` + `gsap.matchMedia()`; opacity-only ≤150ms fallback |
| Particles | 8–12 DOM divs, GSAP timeline, recycled; `IntersectionObserver` pause off-screen |
| Celebration flags | `localStorage` key `fit:celebrated:<habitId>` |
| Partner activity | 5s polling against `Completions` (realtime in v2) |
| Component contract | `motion?: 'entrance' \| 'press' \| 'celebration'` keeps UI testable without runtime |

New: `src/presentation/styles/`, `src/presentation/motion/` (`gsap.ts`, `useReducedMotion.ts`, `ParticleBurst.tsx`, `StreakFire.tsx`).

## Capabilities

**New**: `design-system-tokens`, `motion-system`, `habit-celebrations`.
**Modified**: `ui-components`, `layout-chrome`, `auth-flow`, `home-dashboard`, `habits-listing`, `habit-detail`, `habit-creation`, `couple-flow`, `user-profile`.

## PR Slicing — Feature-Branch Chain (5 PRs)

Strategy: **feature-branch-chain** — first PR → `develop`, each next PR targets the previous PR's branch. Reviewers see ≤400 lines per slice. Total: 1800–2200 lines.

| # | PR | ~Lines | Scope | Deps |
|---|----|--------|-------|------|
| 1 | `design-system-foundation` | 220 | `theme.css`, Tailwind v4 wiring, `motion/` skeleton, `main.tsx` `data-theme="dark"`, no page changes | — |
| 2 | `ui-components-redesign` | 280 | Button, TextInput (remove `colorScheme: 'light'`), Toast, EmptyState, LoadingSpinner, LoadingScreen | #1 |
| 3 | `layout-and-auth` | 380 | TabLayout indicator + page-transition wrapper, LoginPage, SignUpPage, ResetPasswordPage, InvitePage | #2 |
| 4 | `home-profile-habits` | 380 | HomePage (placeholder→full), ProfilePage (placeholder→full), HabitsPage (tab indicator, card cascade, empty state) | #3 |
| 5 | `habit-detail-and-celebrations` | 450 ⚠️ | HabitDetailPage (particle burst, grid fill, streak fire, weekly ring, partner ripple), AddHabitPage, CreateCouplePage, InvitePartnerPage. **Split 5a/5b if >400** | #4 |

**Why 5 not 7**: small slices (couple pages, add-habit) share form-field animation primitives and merge cleanly; shorter chain, less coordination cost.
**Why feature-branch-chain not stacked-to-main**: independent review; rejection of a later PR does not block earlier work.

## Habit-Forming Mechanics

Goal: a logged habit produces a positive sensory hit **within 200ms**.

| Mechanic | Trigger | Visual | Reduced-motion fallback |
|----------|---------|--------|------------------------|
| Particle burst | Check-in tap | 10 GSAP particles radiate, 400ms | Opacity flash |
| Streak fire | ≥3 days | Flame + infinite flicker, 1.5s loop | Static flame |
| Streak tier | ≥7 days | Larger flame + glow | Static, no glow |
| Weekly ring | DetailPage | SVG fills, gold flash at 100% | Static fill |
| Partner ripple | Partner check-in (5s poll) | Purple ring + toast, 700ms | Toast text only |
| First-habit confetti | First-ever check-in | 16-particle radial, 700ms | Opacity flash |
| Stats counter | HomePage mount | 0 → value, 800ms | Instant |
| Card cascade | List mount | 60ms stagger, 250ms/card | Instant |

## Rollback Plan

| Slice | Action | Why safe |
|-------|--------|----------|
| PR #1 | `git revert` — remove `theme.css`, `motion/`, revert `data-theme` setter | New files + 1-line boot change only |
| PR #2 | `git revert` — restore component visuals | API unchanged |
| PR #3 | `git revert` — restore TabLayout stagger, auth pages | Auth falls back to placeholder behavior |
| PR #4 | `git revert` — restore HomePage/ProfilePage placeholders | Pre-state, already documented |
| PR #5 | `git revert` — disable particle/flame/ripple | Check-in mutation untouched (visual-only) |

**Whole-change**: revert PR #1; later reverts become no-ops.
**Dark-only disable** (keep motion): comment out `data-theme` setter in `main.tsx`.

## Success Criteria

- [ ] `pnpm build` clean; `pnpm lint` clean.
- [ ] Zero console errors on cold load of any route.
- [ ] No `var(--color-*)` reference undefined (grep matches only in `theme.css`).
- [ ] Tap-to-check-in: button press → particle first frame <200ms on Pixel 5.
- [ ] HomePage route enter → first card ≤400ms perceived.
- [ ] `prefers-reduced-motion: reduce` → transforms/particles off; opacity ≤150ms.
- [ ] WCAG 2.1 AA on dark (axe): text ≥4.5:1, large ≥3:1.
- [ ] Each PR diff ≤400 (PR #5 forecast 450 — split before merge if exceeded).
- [ ] Lighthouse PWA score unchanged or improved.
- [ ] Streak fire at day 3; partner ripple within 7s of partner check-in.

## Open Questions (deferred to apply)

1. First-habit confetti: `localStorage` (default) or Supabase user metadata?
2. Partner ripple color: always purple (default) or match habit color?
3. Streak freeze: out of scope; v2 backlog.
4. Toast stacking 3+: stack 8px/150ms (default) or replace?
5. ScrollTrigger imported in PR #1, unused until v2 — keep (default) or remove?
6. AddHabitPage day-picker: color fill only (default) or fill + slide?

## Review Workload Forecast

| Metric | Value |
|--------|-------|
| Estimated changed lines | 1800–2200 |
| Chained PRs recommended | **Yes** (5 chained) |
| 400-line budget risk | **High** (scope ≈ 5× budget) |
| Decision needed before apply | **No** — chain strategy, palette (Obsidian Pulse), library (GSAP) decided in proposal |
| Suggested first slice | PR #1 `design-system-foundation` (220 lines, isolated, reversible) |
| Risk mitigation | PR #1 is fully isolated; if any later PR exceeds 400, split before merge — no exception needed |
