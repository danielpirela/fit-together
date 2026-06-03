# Design: Dark-Mode Redesign with Motion

## Status

**Decision record finalized.** All 5 open questions from the spec phase are resolved below.

---

## Open Questions — Resolved Decisions

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | Confetti persistence: localStorage vs Supabase metadata | **localStorage** | Client-only, snappy, no server round-trip. Celebration is per-device; cross-device sync not needed for v1. Key: `fit:celebrated:<habitId>` |
| 2 | Partner ripple color: purple-only vs accent-gradient | **purple-only** (`#A855F7`) | Simpler implementation. Works well on Obsidian Pulse dark backgrounds. Accent-gradient deferred to v2 |
| 3 | Day-picker fill: simple fill vs fill+slide | **simple fill** | Spec default. Reduced-motion users get instant toggle; no slide animation complexity |
| 4 | Toast stacking >3: stack vs replace | **stack** (max 3 visible) | More informative. Oldest toast removed at 3+. Consistent with GSAP motion language (stagger, 8px gap, 150ms transition) |
| 5 | PR #5 split (450 lines, over 400 budget) | **5a + 5b split confirmed** | See §Final PR Slicing |

---

## 1. Architecture Overview

### Directory Structure

```
src/
├── presentation/
│   ├── styles/
│   │   └── theme.css              ← NEW: all design tokens + Tailwind @theme
│   ├── motion/
│   │   ├── gsap.ts                ← NEW: easing curves, ScrollTrigger import
│   │   ├── useReducedMotion.ts    ← NEW: reduced-motion boolean hook
│   │   ├── ParticleBurst.tsx      ← NEW: 8-12 particle burst primitive
│   │   ├── StreakFire.tsx         ← NEW: flame SVG with GSAP flicker loop
│   │   ├── PageTransition.tsx     ← NEW: route-change fade wrapper
│   │   ├── StaggerContainer.tsx   ← NEW: staggered children wrapper
│   │   ├── Cascade.tsx            ← NEW: 60ms stagger entrance primitive
│   │   ├── PartnerRipple.tsx      ← NEW: purple ring animation
│   │   └── Confetti.tsx           ← NEW: 16-particle radial confetti
│   └── components/
│       ├── ui/
│       │   ├── Button.tsx         ← MODIFIED: motion prop, press animation, dark tokens
│       │   ├── TextInput.tsx      ← MODIFIED: remove colorScheme:'light', dark tokens
│       │   ├── Toast.tsx         ← MODIFIED: GSAP entrance, stack limit 3
│       │   ├── EmptyState.tsx    ← MODIFIED: entrance animation
│       │   └── LoadingSpinner.tsx ← MODIFIED: dark tokens, LoadingScreen overlay
│       └── layout/
│           └── TabLayout.tsx      ← MODIFIED: indicator GSAP slide, page transition wrapper
```

### Component Consumers of motion/

| Component | Primitives used | PR |
|-----------|-----------------|----|
| TabLayout | PageTransition wrapper, GSAP indicator slide | #3 |
| LoginPage, SignUpPage, ResetPasswordPage, InvitePage | StaggerContainer (form fields), Cascade | #3 |
| HomePage | StatsCounter (0→value 800ms), Cascade (cards), StreakFire | #4 |
| ProfilePage | StatsCounter, Cascade | #4 |
| HabitsPage | TabLayout tab indicator, Cascade (cards), ParticleBurst (check-in) | #4 |
| HabitDetailPage | ParticleBurst (check-in), StreakFire (streak≥3), weekly ring (SVG fill), PartnerRipple | #5a |
| AddHabitPage | Cascade (fields), ParticleBurst (create success), simple fill day-picker | #5a |
| CreateCouplePage, InvitePartnerPage | Cascade (fields), ParticleBurst (create success) | #5b |

### GSAP Plugin Registration (motion/gsap.ts)

```typescript
import gsap from 'gsap';
// ScrollTrigger imported in PR #1; registered but unused until v2 animations
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export { gsap };
```

`ScrollTrigger` is registered in PR #1 to avoid import churn in later PRs. No ScrollTrigger-driven animations are authored in this change. All GSAP usage in PRs #1–5 uses `gsap.matchMedia()` for reduced-motion gating.

### useReducedMotion Hook Contract

```typescript
// src/presentation/motion/useReducedMotion.ts
export function useReducedMotion(): boolean {
  // Returns true when OS/browser prefers reduced motion
  // Stable across renders — no state, just sync check
}
```

- Hook is a simple `useSyncExternalStore`-free sync read of `window.matchMedia`
- All motion components call `useReducedMotion()` at render time
- All GSAP timelines wrap with `gsap.matchMedia()` gate
- Reduced-motion fallback: opacity-only ≤150ms or instant static render

### Tailwind v4 @theme Block Structure (theme.css)

```css
@theme {
  --color-bg-primary: var(--color-surface-primary);
  --color-bg-elevated: var(--color-surface-elevated);
  --color-text-primary: var(--color-text-primary);
  /* ... all tokens from §2 map here */
  --tw-duration-fast: var(--motion-duration-fast);
  --tw-duration-normal: var(--motion-duration-normal);
  --tw-duration-slow: var(--motion-duration-slow);
}
```

`src/index.css` imports only `@import "tailwindcss";`. The new `theme.css` is imported in `main.tsx` before `App` renders, so all tokens are available pre-paint.

---

## 2. Design Tokens

All tokens defined as CSS custom properties on `:root` in `src/presentation/styles/theme.css`. Tokens are semantic (purpose-based), not visual (color-based).

### Color Tokens

| Token | Hex (Obsidian Pulse) | Usage |
|-------|---------------------|-------|
| `--color-surface-primary` | `#0A0A0F` | Page background |
| `--color-surface-secondary` | `#161622` | Cards, inputs, elevated surfaces |
| `--color-surface-elevated` | `#1E1E2E` | Modals, tooltips, dropdowns |
| `--color-text-primary` | `#EDEDEF` | Body text |
| `--color-text-muted` | `#6B6B7B` | Secondary labels, placeholders |
| `--color-text-disabled` | `#3A3A4A` | Disabled states |
| `--color-accent-primary` | `#00D4AA` | CTAs, active states, progress fills |
| `--color-accent-secondary` | `#FF3366` | Error states, destructive |
| `--color-accent-tertiary` | `#A855F7` | Partner ripple, special highlights |
| `--color-accent-gradient` | `linear-gradient(135deg, #00D4AA 0%, #FF3366 100%)` | Premium accents |
| `--color-border-subtle` | `#272732` | Dividers, card borders |
| `--color-border-active` | `#00D4AA` | Focus rings |
| `--color-gold-flash` | `#FFD700` | 100% weekly ring flash |
| `--color-feedback-success` | `#00D4AA` | Success toasts |
| `--color-feedback-error` | `#FF3366` | Error messages |
| `--color-feedback-warning` | `#FFB800` | Warning states |

### Spacing Tokens (4px base unit)

| Token | Value |
|-------|-------|
| `--space-1` | `4px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |

### Motion Tokens

| Token | Value (full-motion) | Reduced-motion override |
|-------|---------------------|------------------------|
| `--motion-duration-instant` | `80ms` | `0ms` |
| `--motion-duration-fast` | `150ms` | `0ms` |
| `--motion-duration-normal` | `300ms` | `0ms` |
| `--motion-duration-slow` | `500ms` | `0ms` |
| `--motion-duration-cascade` | `250ms` | `0ms` |
| `--motion-ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | — |
| `--motion-ease-in-out-quart` | `cubic-bezier(0.76, 0, 0.24, 1)` | — |
| `--motion-stagger-delay` | `60ms` | `0ms` |

Reduced-motion override via single CSS block:
```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-duration-instant: 0ms;
    --motion-duration-fast: 0ms;
    --motion-duration-normal: 0ms;
    --motion-duration-slow: 0ms;
  }
}
```

### Easing Curves (gsap.ts exports)

```typescript
export const easeOutExpo = 'expo.out';
export const easeOutQuart = 'quart.out';
export const easeInOutQuart = 'quart.inOut';
export const easeOutBack = 'back.out(1.5)';
```

---

## 3. Motion Primitives API

### `<PageTransition>` — Route-change fade wrapper

```typescript
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}
// Wraps <Outlet> in TabLayout
// Outgoing: opacity 1→0, 150ms
// Incoming: opacity 0→1, 200ms, delay 100ms
// Uses gsap.to() with useGSAP ref
// Reduced-motion: instant swap, no fade
// Depends on: gsap, useReducedMotion
```

### `<StaggerContainer>` — Staggered children entrance

```typescript
interface StaggerContainerProps {
  children: React.ReactNode[];
  staggerDelay?: number; // default 60ms
  duration?: number;      // default 250ms
  direction?: 'up' | 'down';
}
// Iterates children, applies gsap.from with stagger
// Wraps in div with ref for GSAP target
// Reduced-motion: all children render at final position instantly
// Depends on: gsap, useReducedMotion
```

### `<Cascade>` — Single-element cascade building block

```typescript
interface CascadeProps {
  delay: number;       // ms offset from container start
  duration?: number;   // default 250ms
  children: React.ReactNode;
}
// Renders a div with gsap.from applied on mount
// delay drives the stagger timing per element
// Reduced-motion: no animation, instant render
```

### `<ParticleBurst>` — Check-in reward burst (8-12 particles)

```typescript
interface ParticleBurstProps {
  triggerRef: React.RefObject<HTMLElement>;
  particleCount?: number; // default 10, range 8-12
  color?: string;          // default accent-primary
  onComplete?: () => void;
}
// Renders pool of 10 recycled divs (position: absolute, overflow visible)
// GSAP timeline: scale 0→1.5, opacity 1→0, translateX/Y radial outward, 400ms
// IntersectionObserver pauses timeline when trigger is off-screen
// Reduced-motion: opacity flash (0→0.6→0, 150ms) replaces particles
// Mounts to triggerRef's offsetParent, positioned at trigger center
```

### `<StreakFire>` — Flame SVG with streak-tier animation

```typescript
interface StreakFireProps {
  streakDays: number;
  className?: string;
}
// Tier 1 (3-6 days): standard flame SVG, infinite GSAP flicker (scale 1↔1.05, opacity 0.8↔1, 1.5s loop)
// Tier 2 (≥7 days): 1.3× scale, CSS drop-shadow glow with slow pulse (2s)
// Reduced-motion (any tier): static SVG flame, no animation, no glow
// Depends on: gsap, useReducedMotion
```

### `<PartnerRipple>` — Purple ring on partner activity

```typescript
interface PartnerRippleProps {
  partnerName: string;
  habitName?: string;
  onComplete?: () => void;
}
// Renders a purple (#A855F7) ring at partner avatar position
// GSAP: scale 0.5→1, opacity 0→0.8, 700ms, easeOutQuart
// Toast fires simultaneously: "[Partner] logged [habit]"
// Reduced-motion: no ring animation; toast only
// Triggered by: partner activity poll (5s interval)
```

### `<Confetti>` — First-ever check-in celebration

```typescript
interface ConfettiProps {
  triggerRef: React.RefObject<HTMLElement>;
  onComplete?: () => void;
}
// 16-particle radial burst, 700ms total
// Particles: various hues from accent palette
// localStorage key `fit:celebrated:<habitId>` checked before firing
// Reduced-motion: single opacity flash (150ms)
```

---

## 4. GSAP Setup

### motion/gsap.ts — Plugin registration

```typescript
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap };
// Exported as named export, consumers import from 'motion/gsap'
```

### Bundle Strategy

| Plugin | Import location | Load strategy |
|--------|----------------|---------------|
| GSAP core | `gsap` (npm) | Always in bundle. ~24KB gzip |
| ScrollTrigger | `gsap/ScrollTrigger` | Imported in `motion/gsap.ts` PR #1, registered, not used. ~6KB gzip. NOT code-split. Deferred animations in v2 only. |
| useGSAP hook | `@gsap/react` | Imported per-component where animation is needed. Falls back to `useLayoutEffect` + ref pattern if hook unavailable. |

**Decision: No ScrollTrigger code-splitting in this change.** ScrollTrigger is registered in PR #1 (dead code until v2). Lazy-loading it later would require re-importing and re-registering. Keeping it in the main bundle is simpler for v1.

### useGSAP usage pattern

Every animated component uses the `useGSAP` pattern:

```typescript
const buttonRef = useRef<HTMLButtonElement>(null);
useGSAP(() => {
  if (useReducedMotion()) return;
  gsap.fromTo(buttonRef.current,
    { opacity: 0, scale: 0.95 },
    { opacity: 1, scale: 1, duration: 0.2, ease: 'quart.out' }
  );
}, []);
```

GSAP timelines are created inside `useGSAP` to ensure React 19 concurrent rendering safety.

---

## 5. Theme Switching — No FOUC

### main.tsx change

```typescript
import './presentation/styles/theme.css'; // NEW: before App

document.documentElement.dataset.theme = 'dark';

createRoot(document.getElementById('root')!).render(...);
```

This runs synchronously before React paints, ensuring the dark theme is active from the first frame. No inline `<script>` tag needed — the dataset assignment in the module body of `main.tsx` achieves the same result as an inline script with zero flash.

### localStorage persistence

The theme is dark-only in this change. No localStorage persistence is needed for theme switching (no runtime toggle). If the user ever wants to revert to light, comment out the `dataset.theme` line.

---

## 6. Component Migration Map

| Component | Change | PR |
|-----------|--------|----|
| **theme.css** | New file: all CSS custom properties + Tailwind @theme | #1 |
| **motion/gsap.ts** | New: easing exports, ScrollTrigger import/registration | #1 |
| **motion/useReducedMotion.ts** | New: boolean hook | #1 |
| **main.tsx** | Add theme.css import + `dataset.theme='dark'` | #1 |
| **Button.tsx** | Add `motion` prop, GSAP press (scale 0.97), entrance animation, use tokens for colors | #2 |
| **TextInput.tsx** | Remove `style={{ colorScheme: 'light' }}`, use dark surface tokens | #2 |
| **Toast.tsx** | GSAP entrance, stack limit 3 (oldest removed), dark tokens | #2 |
| **EmptyState.tsx** | GSAP entrance animation (fade + translateY 150ms) | #2 |
| **LoadingSpinner.tsx** | Dark surface token colors; LoadingScreen opacity fade-out | #2 |
| **TabLayout.tsx** | GSAP indicator slide (250ms), page transition wrapper, dark tokens | #3 |
| **LoginPage.tsx** | StaggerContainer form fields, heading entrance, dark tokens | #3 |
| **SignUpPage.tsx** | StaggerContainer, dark tokens, remove TextInput light restriction | #3 |
| **ResetPasswordPage.tsx** | StaggerContainer, dark tokens | #3 |
| **InvitePage.tsx** | StaggerContainer, dark tokens | #3 |
| **HomePage.tsx** | StatsCounter 0→value (800ms), Cascade cards, greeting entrance | #4 |
| **ProfilePage.tsx** | StatsCounter, Cascade, dark tokens, heading entrance | #4 |
| **HabitsPage.tsx** | Tab indicator GSAP slide, Cascade cards, ParticleBurst on check-in, StreakFire on streak≥3, partner dot | #4 |
| **HabitDetailPage.tsx** | ParticleBurst on check-in, StreakFire (tier 1/2), weekly SVG ring (0→fill, 800ms, gold flash at 100%), PartnerRipple on poll | #5a |
| **AddHabitPage.tsx** | StaggerContainer fields, ParticleBurst on success, simple fill day-picker | #5a |
| **CreateCouplePage.tsx** | StaggerContainer fields, ParticleBurst on success, dark tokens | #5b |
| **InvitePartnerPage.tsx** | StaggerContainer fields, dark tokens | #5b |

---

## 7. Performance Budget

### Bundle Impact

| Asset | Size (gzip) | Impact |
|-------|------------|--------|
| GSAP core | ~24KB | Added in PR #1 (unavoidable — all motion depends on it) |
| ScrollTrigger | ~6KB | Added in PR #1, registered unused, deferred to v2 |
| @gsap/react (useGSAP) | ~2KB | Added per-component as needed |
| motion/ utilities | ~5KB | Added in PR #1, shared across all PRs |
| **Total motion overhead** | **~37KB gzip** | One-time cost for entire change |
| theme.css | ~3KB | New, no Tailwind purge impact (all tokens are CSS vars) |

**No lazy-splitting of GSAP** — the library is too small to benefit from dynamic imports and SplitMyCode would complicate the pattern. The 37KB one-time cost is acceptable for a motion-first redesign.

### Runtime Performance Targets

| Target | Metric | Strategy |
|--------|--------|----------|
| Mid-range Android (Pixel 5 class) | Sustained 60fps during particle animations | 8-12 particles max, CSS transform-only (translate, scale, opacity), will-change hints on particle pool |
| Tap-to-first-particle | <200ms from mutation success | ParticleBurst mounts on success callback; no animation prep needed |
| Page load (HomePage) | First card visible ≤400ms perceived | Cascade animation starts at 0ms; reduced-motion users see instant render |
| Off-screen animation pause | Particle timelines pause when trigger scrolls off-screen | IntersectionObserver on particle container; no CPU usage off-screen |
| Scroll jank | None | ScrollTrigger registered but not used in PRs #1-5; no scroll-driven animations |

### Animation Performance Rules

- All GSAP animations use only `transform` and `opacity` — never `width`, `height`, `top`, `left`
- `will-change: transform` applied to particle pool container
- `gsap.killTweensOf()` called on unmount for all animated components to prevent memory leaks
- No animation runs during React Concurrent ModeSuspense boundaries — use `useIsMounted()` guard

---

## 8. Accessibility Stance

### prefers-reduced-motion Implementation

1. **CSS level**: `--motion-duration-*` tokens all resolve to `0ms` via `@media (prefers-reduced-motion: reduce)` block in `theme.css`. This handles all CSS transitions/animations automatically.

2. **GSAP level**: Every `useGSAP` block wraps with:
   ```typescript
   const reducedMotion = useReducedMotion();
   useGSAP(() => {
     if (reducedMotion) return; // no animation created
     // ... GSAP timeline
   }, [dependency]);
   ```
   Additionally, `gsap.matchMedia()` is used for timeline-level gating in complex components.

3. **Component level**: All motion primitives accept `motion` prop. When absent, component renders static (no animation). This enables testing without runtime.

4. **No exceptions**: Even "subtle" animations (e.g., toast stacking, tab indicator) are disabled for reduced-motion users. The rule is: if the animation duration >150ms and is a transform/opacity, it must be gated.

### Focus Management

- Page transitions do not move keyboard focus — the outgoing page simply fades, focus remains in place
- TabLayout indicator animation does not affect focus order
- No focus traps introduced by the motion system
- `aria-live="polite"` on stats counters that animate (screen readers hear the final value)

### Screen Reader Announcements

| Event | Mechanism | Timing |
|-------|-----------|--------|
| Streak milestone (3, 7, 30 days) | `aria-live` region + visible toast | On habit detail mount |
| Partner check-in toast | Toast with `role="status"` | On 5s poll response |
| Confetti fired (first check-in) | `aria-live` polite announcement | Within 200ms of success |
| Stats counter (0→value) | Screen reader does not announce — visual only | On page mount |

### Keyboard Navigation — Day-Picker

- Arrow keys move between days
- Space/Enter toggles selection
- Tab moves into/out of day-picker
- Focus ring visible (`--color-border-active`, 2px outline)
- No keyboard trap in the component

---

## 9. Test Strategy

### Recommended: Vitest

**Recommendation: vitest** — the project has no test runner configured (`strict_tdd: false`, no jest/vitest/playwright found in codebase). Adding vitest now for this change establishes testing infrastructure that future changes can build on.

**Rationale over alternatives:**
- Playwright: overkill for component-level testing; better for E2E
- Jest: pre-installed in many templates but slower, less modern
- Vitest: native ESM, faster, Vite-based, similar DX to app's dev experience

### What We Test

| Layer | What | Approach |
|-------|------|----------|
| **Token resolution** | CSS vars resolve correctly; no undefined references | Vitest unit test: parse `theme.css`, assert all referenced vars are defined |
| **useReducedMotion** | Returns correct boolean; updates on OS preference change | Vitest: mock `window.matchMedia`, assert hook value |
| **ParticleBurst** | Renders 10 divs; fires on callback; pauses off-screen | Vitest: render with mocked trigger ref, assert DOM count, fire callback, assert GSAP `onComplete` called |
| **StreakFire** | Tier 1 renders standard flame; Tier 2 renders large + glow; reduced-motion is static | Vitest: render with streakDays props, assert SVG structure and class presence |
| **Button press animation** | Scale 0.97 on mousedown when motion enabled; no-op when disabled | Vitest: simulate mousedown, assert scale via GSAP `getComputedStyle` or ref-based check |
| **Toast stack limit** | >3 toasts removes oldest first | Vitest: fire 4 toasts, assert only 3 in DOM |
| **WCAG contrast** | All text on dark backgrounds ≥4.5:1 (≥3:1 for large) | axe-core in CI via `vitest-axe` integration on component snapshot tests |

### What We Don't Test

- **Pixel-perfect animation output**: Animation screenshots are brittle and add CI complexity. Instead, test `onComplete` callbacks and DOM state transitions.
- **Animation timing values**: Duration is tested via token resolution, not via real-time measurement.
- **Visual regression of dark palette**: Manual design review in PR #2 covers this. axe-core handles contrast; manual review handles aesthetic cohesion.
- **GSAP internal behavior**: Trust GSAP's own test suite. Test our usage patterns (context, cleanup, `onComplete`).

### Test File Location

```
src/
├── presentation/
│   ├── motion/
│   │   ├── __tests__/
│   │   │   ├── useReducedMotion.test.ts
│   │   │   ├── ParticleBurst.test.tsx
│   │   │   ├── StreakFire.test.tsx
│   │   │   └── PageTransition.test.tsx
│   │   ├── gsap.ts
│   │   └── ...
│   └── components/
│       └── ui/
│           └── __tests__/
│               ├── Button.test.tsx
│               └── Toast.test.tsx
```

### CI Integration

```yaml
# vitest.config.ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  plugins: [],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    reporters: ['default', 'json'],
  },
});
```

`axe-core` runs as a plugin in component tests via `axe.configure()` and is checked on every render test for UI components.

---

## 10. Final PR Slicing

### Resolved: PR #5 Split

PR #5 forecast was 450 lines (exceeds 400 budget by 50). Proposed split:

| New PR | Name | ~Lines | Scope |
|--------|------|--------|-------|
| #5a | `habit-detail-celebrations` | ~220 | HabitDetailPage (particle burst, StreakFire, weekly ring, gold flash) + AddHabitPage (cascade, ParticleBurst on create, day-picker fill) |
| #5b | `couple-partner-ripple` | ~180 | CreateCouplePage (cascade, ParticleBurst), InvitePartnerPage (cascade), PartnerRipple component (purple ring, toast on poll), InvitePage stagger |

This gives 6 PRs total (not 5). The chain becomes: #1 → #2 → #3 → #4 → #5a → #5b

### Final PR Plan

| # | Name | ~Lines | Files touched | Dependencies | Enables |
|---|------|--------|---------------|--------------|---------|
| **#1** | `design-system-foundation` | 220 | `theme.css` (new), `motion/gsap.ts` (new), `motion/useReducedMotion.ts` (new), `main.tsx` (modified) | — | All subsequent PRs — no component can use dark tokens without this |
| **#2** | `ui-components-redesign` | 280 | `Button.tsx`, `TextInput.tsx`, `Toast.tsx`, `EmptyState.tsx`, `LoadingSpinner.tsx` | #1 | Auth pages and layout chrome — they consume these components |
| **#3** | `layout-and-auth` | 380 | `TabLayout.tsx` (indicator slide + PageTransition wrapper), `LoginPage.tsx`, `SignUpPage.tsx`, `ResetPasswordPage.tsx`, `InvitePage.tsx` | #2 | Home, profile, habits pages — they need layout chrome and auth forms |
| **#4** | `home-profile-habits` | 380 | `HomePage.tsx` (stats counter, cascade, greeting), `ProfilePage.tsx` (stats, cascade), `HabitsPage.tsx` (tab indicator, cascade, ParticleBurst, StreakFire, partner dot) | #3 | Habit detail and couple pages — they build on habits listing and cascade patterns |
| **#5a** | `habit-detail-celebrations` | 220 | `HabitDetailPage.tsx` (particle burst, StreakFire tier 1/2, weekly SVG ring 0→fill, gold flash at 100%), `AddHabitPage.tsx` (stagger fields, ParticleBurst on create, simple fill day-picker) | #4 | Independent — no PR #5b dependency. Can be reviewed and merged first. |
| **#5b** | `couple-partner-ripple` | 180 | `CreateCouplePage.tsx` (stagger, ParticleBurst), `InvitePartnerPage.tsx` (stagger), `PartnerRipple.tsx` (new motion primitive), `InvitePage.tsx` (stagger improvements), `motion/PartnerRipple.tsx` (new) | #4 | Independent — can run in parallel with #5a. Shares cascade pattern only. |

**Total: 1,660 lines across 6 PRs** (down from 1,800–2,200 / 5 PRs estimate in proposal).

---

## 11. Migration Order (Chain)

```
PR #1 (design-system-foundation)
  └── PR #2 (ui-components-redesign)
        └── PR #3 (layout-and-auth)
              └── PR #4 (home-profile-habits)
                    ├── PR #5a (habit-detail-celebrations)  ← parallel with #5b
                    └── PR #5b (couple-partner-ripple)
```

**Chain strategy**: `feature-branch-chain` — first PR targets `develop`, each subsequent PR targets the previous PR's branch. Reviewers see ≤400 lines per slice.

**Rollback**: Each PR is independently revertable. PR #1 revert removes all new files + 1-line boot change. Later reverts are visual-only (check-in mutation untouched in all PRs).

---

## 12. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **GSAP bundle bloat on low-end devices** | Medium | High | 37KB gzip one-time cost; ScrollTrigger registered unused but not lazy-loaded (v2 fix). Mid-range Android 60fps target via particle count cap (8-12), transform-only animations |
| **FOUC on cold load** | Low | High | `dataset.theme='dark'` runs synchronously in `main.tsx` module body before React paint. No inline script needed. |
| **prefers-reduced-motion non-compliance** | Medium | High | All GSAP timelines gated via `useReducedMotion()` + `gsap.matchMedia()`. CSS token override at 0ms handles all CSS transitions. Zero exceptions for >150ms transforms. |
| **Mid-range Android frame drops during ParticleBurst** | Medium | Medium | IntersectionObserver pauses timeline when trigger off-screen. Particle pool (not DOM creation per burst). will-change hints on container. |
| **PR #5a/#5b review coordination overhead** | Low | Low | Both depend on #4. They can be reviewed in parallel. Independent scopes with no shared file conflicts. |
| **TextInput `colorScheme` residual** | Low | Medium | Full grep pass in PR #2 to ensure no `colorScheme: 'light'` anywhere in codebase. |
| **Token reference gaps (undefined vars)** | Medium | High | `theme.css` defines all tokens. Success criteria includes `grep 'var(--color-)' | grep -v theme.css` must return zero matches. |
| **ScrollTrigger import unused until v2** | Low | Low | Documented in spec. Accepted tradeoff. Removes import churn in later PRs. |
| **WCAG 2.1 AA contrast failures in dark palette** | Low | High | All Obsidian Pulse tokens engineered for ≥4.5:1 on dark. axe-core in CI on PR #2 component tests. Gold (#FFD700) used only for flash effects (decorative). |
| **Toast stack animation performance** | Low | Medium | Stack limit 3. 8px gap, 150ms transition. Reduced-motion users see instant toasts. |

---

## Summary

This design resolves all 5 open questions, defines a complete token system for the Obsidian Pulse dark palette, specifies the motion primitives API and their reduced-motion fallbacks, plans a 6-PR chain with ≤400 lines per slice, and establishes a risk register with concrete mitigations. The change is scoped to dark-only (no runtime toggle), GSAP core (ScrollTrigger registered but unused), and localStorage for confetti persistence. Auth stays bypassed. Vitest is recommended as the test runner.