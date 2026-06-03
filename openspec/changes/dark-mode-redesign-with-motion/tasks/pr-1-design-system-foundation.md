# Tasks: PR #1 — design-system-foundation

**Change**: dark-mode-redesign-with-motion
**PR**: #1 of 6 (`feature-branch-chain`)
**Branch**: `feat/dark-mode-redesign/pr-1-design-system-foundation`
**Base**: `develop`
**Line budget**: ~220 lines | Risk: Low

---

## Phase 1: Design Token Foundation

- [ ] 1.1 Create `src/presentation/styles/theme.css` — all CSS custom properties for Obsidian Pulse palette (color, spacing, motion tokens) [spec:design-system-tokens#requirement-1]
- [ ] 1.2 Add `prefers-reduced-motion` override block in `theme.css` — all `--motion-duration-*` tokens resolve to `0ms` [spec:motion-system#requirement-3]
- [ ] 1.3 Add Tailwind v4 `@theme` block in `theme.css` — map all CSS custom properties to `--tw-*` tokens [spec:design-system-tokens#requirement-2]

## Phase 2: GSAP Motion Skeleton

- [ ] 2.1 Create `src/presentation/motion/gsap.ts` — export `gsap` with `ScrollTrigger` imported and registered; export easing constants (`easeOutExpo`, `easeOutQuart`, `easeInOutQuart`, `easeOutBack`) [spec:motion-system#requirement-4]
- [ ] 2.2 Create `src/presentation/motion/useReducedMotion.ts` — export hook returning `window.matchMedia('(prefers-reduced-motion: reduce)').matches` (sync, no state) [spec:motion-system#requirement-1]

## Phase 3: Boot and No-FOUC

- [ ] 3.1 Import `theme.css` in `src/main.tsx` BEFORE `App` renders [spec:design-system-tokens#requirement-3]
- [ ] 3.2 Set `document.documentElement.dataset.theme = 'dark'` synchronously in `main.tsx` module body (before createRoot) — no inline script tag needed [spec:design-system-tokens#requirement-3]

## Phase 4: Verification

- [ ] 4.1 Run `pnpm build` — must succeed with no errors [spec:design-system-tokens#requirement-1]
- [ ] 4.2 Run `grep -r 'var(--color-' src/ | grep -v theme.css` — must return zero matches outside theme.css (no undefined tokens) [spec:design-system-tokens#requirement-1]
- [ ] 4.3 Manual: cold-load any route — confirm no white flash before dark background

---

**Done when**: `pnpm build` clean; no FOUC on cold load; all motion tokens defined with reduced-motion override active.

**Commit strategy**: Single commit `feat: design system foundation — theme tokens, GSAP skeleton, no-FOUC dark boot` (atomic, isolated, reversible via `git revert`)