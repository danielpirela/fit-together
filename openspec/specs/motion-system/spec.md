# Motion System Specification

## Purpose

Provide the GSAP-based animation primitives, reduced-motion safety, and timing conventions so that UI motion serves the habit-forming goal without causing distraction or accessibility failures.

## Requirements

### Requirement: `useReducedMotion` hook SHALL expose a boolean consumer

`src/presentation/motion/useReducedMotion.ts` SHALL export a hook that returns `true` when `window.matchMedia('(prefers-reduced-motion: reduce)')` is true, `false` otherwise. The hook MUST be stable across renders.

### Requirement: GSAP `matchMedia` SHALL gate all animation timelines

Every GSAP animation component or hook that creates a timeline with duration >150ms SHALL wrap the animation in `gsap.matchMedia()` and provide an opacity-only or no-op fallback for reduced-motion users.

### Requirement: Duration tokens from CSS SHALL be consumed by motion primitives

Motion durations (e.g., `var(--motion-duration-fast)`) SHALL be used by GSAP tweens, not hard-coded numbers. This enables a single CSS override to affect all animation durations.

### Requirement: Easing tokens SHALL be defined and documented

`src/presentation/motion/gsap.ts` or a dedicated easing file SHALL export named easing curves (e.g., `easeOutExpo`, `easeInOutQuart`) that follow the product's motion personality: snappy entrances, smooth exits.

### Requirement: `ParticleBurst` component SHALL render 8–12 DOM elements

`src/presentation/motion/ParticleBurst.tsx` SHALL accept a `trigger` prop (ref or DOM node) and spawn 8–12 `<div>` elements positioned at the trigger's center. Each particle SHALL animate outward radially using a GSAP timeline, then recycle into the DOM pool.

### Requirement: `ParticleBurst` SHALL pause when off-screen via IntersectionObserver

When the parent element containing the burst trigger is scrolled out of the viewport, the particle timeline SHALL pause. On re-entry, it SHALL resume from the current playhead position.

### Requirement: `StreakFire` component SHALL animate a flame effect for streaks ≥3 days

`src/presentation/motion/StreakFire.tsx` SHALL accept a `streakDays` prop. When `streakDays >= 3`, it SHALL render a flame SVG and animate it with an infinite GSAP flicker loop (scale + opacity variation, 1.5s total cycle). For `streakDays >= 7`, the flame SHALL be larger and include a glow filter.

### Requirement: Reduced-motion `StreakFire` SHALL render a static flame

When `useReducedMotion()` returns `true`, `StreakFire` SHALL render a static SVG flame with no animation — no flicker loop, no glow pulse.

### Requirement: Animation component contract

All animated UI components MUST accept a `motion?: 'entrance' | 'press' | 'celebration'` prop. When `motion` is absent or undefined, the component renders without animation (enabling static testing).

### Requirement: `ScrollTrigger` SHALL be imported in PR #1 but not actively used

GSAP's `ScrollTrigger` plugin SHALL be imported and registered in the motion setup to avoid later import churn, but no ScrollTrigger-dependent animations SHALL be authored in this change.

## Scenarios

#### Scenario: Reduced-motion user visits HomePage

- GIVEN `prefers-reduced-motion: reduce` is set in the OS
- WHEN the HomePage loads with habit cards
- THEN cards render instantly with no entrance stagger animation
- AND no particle or flame animations fire

#### Scenario: `ParticleBurst` triggered on check-in

- GIVEN a user taps the check-in button on HabitDetailPage
- WHEN the mutation succeeds
- THEN 10 particles radiate from the button center within 100ms of the success response
- AND particles finish animating within 400ms total

#### Scenario: `ParticleBurst` offscreen pause

- GIVEN a `ParticleBurst` has fired
- WHEN the user scrolls the containing element out of view
- THEN the particle animation timeline pauses
- AND on scroll back into view, the animation resumes from paused playhead

#### Scenario: `StreakFire` tier 2 (7+ days)

- GIVEN a user has a 7-day streak
- WHEN `StreakFire` renders on the habit card
- THEN the flame is larger (1.3× scale)
- AND a CSS `filter: drop-shadow` glow animates (slow pulse, 2s)

## Cross-References

- Consumes: `design-system-tokens` (motion duration tokens)
- Consumed by: `habit-celebrations` (`ParticleBurst`, `StreakFire`)
- Consumed by: `ui-components` (entrance/press animations)
- See: `openspec/changes/dark-mode-redesign-with-motion/proposal.md`

## Out of Scope

- ScrollTrigger-driven animations (deferred to v2)
- Audio/haptic feedback
- Animation orchestration (timeline sequencing beyond single component)
- Spring physics (only GSAP easing curves)