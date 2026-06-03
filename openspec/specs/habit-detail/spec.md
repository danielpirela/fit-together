# Habit Detail — Delta Specification (Dark Mode Redesign with Motion)

## Purpose

Redesign HabitDetailPage to use dark tokens, implement the weekly completion ring animation, render StreakFire for streaks ≥3, fire ParticleBurst on check-in, and show partner ripple on partner activity.

## Requirements

### Requirement: HabitDetailPage background SHALL be `var(--color-surface-primary)`

The page background SHALL use `var(--color-surface-primary)`. Card backgrounds SHALL be `var(--color-surface-secondary)`.

### Requirement: Weekly completion ring SHALL animate from 0% to current on mount

The weekly completion SVG ring SHALL animate from 0% arc fill to the current completion percentage on page mount. Duration: 800ms, easing: easeOutQuart. At 100% fill, a gold flash effect SHALL play once.

### Requirement: Weekly ring animation SHALL be instant for reduced-motion users

When `useReducedMotion()` is true, the ring SHALL display at its final fill percentage immediately with no animation or gold flash.

### Requirement: Check-in button SHALL fire ParticleBurst within 200ms of success

When `logHabitCompletion` mutation succeeds, a `ParticleBurst` SHALL fire on the check-in button's DOM node within 200ms. If `streakDays >= 3`, `StreakFire` SHALL also render.

### Requirement: `StreakFire` tier 1 (3–6 days) SHALL render for appropriate streaks

When the habit's streak is between 3 and 6 days, `StreakFire` SHALL render with the tier-1 flame (standard size, flicker animation).

### Requirement: `StreakFire` tier 2 (≥7 days) SHALL render for 7+ day streaks

When the habit's streak is ≥7 days, `StreakFire` SHALL render with the tier-2 flame (1.3× scale, glow filter, slow pulse).

### Requirement: Partner ripple animation SHALL fire within 7s of partner check-in

When the partner activity poll detects a partner completion within the last 5s window, a purple ring SHALL animate on the partner's avatar/avatar area over 700ms.

### Requirement: Partner ripple SHALL be suppressed for reduced-motion users

When `useReducedMotion()` is true, no ring animation plays. A text toast SHALL appear: "[Partner] logged [habit]".

### Requirement: Habit name and description text SHALL use `var(--color-text-primary)`

All primary text on HabitDetailPage SHALL use `var(--color-text-primary)` with ≥4.5:1 contrast on the surface background.

### Requirement: Stats section SHALL display streak count, weekly progress, best streak

The stats section SHALL show: current streak (days), weekly progress (X/7), best streak (days). Each stat SHALL use `var(--color-text-primary)` for values and `var(--color-text-muted)` for labels.

## Scenarios

#### Scenario: User views a habit with a 5-day streak

- GIVEN "Morning Run" has a 5-day streak
- WHEN HabitDetailPage for "Morning Run" mounts
- THEN `StreakFire` renders with the tier-1 flame
- AND the weekly ring shows X/7 completions with animation

#### Scenario: User checks in — particle burst fires

- GIVEN the user is on HabitDetailPage
- WHEN they tap the check-in button
- AND the mutation succeeds within 500ms
- THEN a ParticleBurst fires within 200ms of success
- AND the UI updates to reflect the completion

#### Scenario: Partner checks in — purple ripple

- GIVEN the user's partner "Maria" has just checked in to "Evening Walk"
- WHEN the 5s poll returns the update
- THEN a purple ring animates on the partner avatar area (700ms)
- AND a toast shows "Maria logged Evening Walk"

#### Scenario: Reduced-motion user sees static streak fire

- GIVEN `prefers-reduced-motion: reduce`
- AND "Morning Run" has a 4-day streak
- WHEN HabitDetailPage mounts
- THEN a static flame SVG renders with no animation
- AND the weekly ring shows final fill instantly

## Cross-References

- Consumes: `design-system-tokens` (all tokens)
- Consumes: `motion-system` (`ParticleBurst`, `StreakFire`, `useReducedMotion`)
- Consumes: `habit-celebrations` (celebration mechanics)
- Consumed by: `layout-chrome` (TabLayout)
- See: `openspec/changes/dark-mode-redesign-with-motion/proposal.md`

## Out of Scope

- Habit editing/deleting UI (deferred to separate spec)
- Historical completion calendar view
- Habit notes/journal entry
- Streak freeze