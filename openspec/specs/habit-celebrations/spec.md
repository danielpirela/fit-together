# Habit Celebrations Specification

## Purpose

Deliver the sensory reward hit within 200ms of a habit check-in through coordinated particle bursts, streak fires, and partner ripple animations — making the act of logging a habit feel like a reward.

## Requirements

### Requirement: Check-in mutation success SHALL trigger particle burst within 200ms

When the `logHabitCompletion` mutation succeeds, the system SHALL fire a `ParticleBurst` on the check-in button's DOM node within 200ms of the success callback, measured from success to first particle frame.

### Requirement: First-ever check-in per user SHALL trigger confetti animation

When a user checks in to any habit for the first time ever, the system SHALL fire a 16-particle radial confetti burst (larger, 700ms) instead of the standard burst.

### Requirement: Confetti trigger state SHALL be stored in localStorage

The `localStorage` key `fit:celebrated:<habitId>` SHALL record whether confetti has fired for a given habit. The system SHALL NOT fire confetti for a habit that has this key set.

### Requirement: Streak ≥3 days SHALL render `StreakFire`

When a habit's current streak count is ≥3 days, the habit card detail view SHALL render the `StreakFire` component with the appropriate tier.

### Requirement: Partner check-in SHALL trigger a purple ripple and toast notification

When the partner activity poll detects a new completion by the partner within the last 5s window, the system SHALL render a purple ring animation on the partner's avatar area (700ms) and show a toast: "[Partner] logged [habit]".

### Requirement: Partner ripple SHALL be suppressed for reduced-motion users

When `useReducedMotion()` is true, partner check-in SHALL show only the text toast with no ring animation.

### Requirement: Weekly completion ring SHALL animate on HabitDetailPage mount

The weekly completion ring (SVG arc) SHALL animate from 0% to its current fill value on HabitDetailPage mount, with a gold flash effect when the fill reaches 100%.

### Requirement: Stats counter on HomePage SHALL animate from 0 to value on mount

On HomePage route enter, numeric stats (current streak, weekly completions, etc.) SHALL animate from 0 to their value using GSAP over 800ms with an ease-out curve.

### Requirement: Habit card list SHALL cascade on mount with 60ms stagger

When `HabitsPage` mounts, each habit card SHALL animate in with a 60ms stagger delay between cards, 250ms duration per card, using an entrance animation (fade + translateY).

### Requirement: Reduced-motion SHALL collapse all cascade animations to instant

When `useReducedMotion()` is true, the habit card cascade and stats counter animations SHALL render instantly at their final values with no stagger.

## Scenarios

#### Scenario: User checks in a habit with a 5-day streak

- GIVEN the user has a 5-day streak on "Morning Run"
- WHEN they tap the check-in button
- THEN the mutation succeeds within 500ms
- AND a ParticleBurst fires within 200ms of success
- AND `StreakFire` renders with the tier-1 (3–6 day) flame animation

#### Scenario: First-ever check-in fires confetti

- GIVEN the user has never checked in to any habit before
- WHEN they check in to "Morning Run" for the first time
- THEN a 16-particle confetti burst fires (700ms, radial)
- AND `fit:celebrated:<habitId>` is set in localStorage
- AND subsequent check-ins on the same habit do NOT trigger confetti

#### Scenario: Partner checks in — reduced-motion user

- GIVEN a user with `prefers-reduced-motion: reduce`
- AND their partner has just checked in to "Evening Walk"
- WHEN the 5s poll returns the partner's new completion
- THEN a toast shows "Maria logged Evening Walk" with no ring animation

#### Scenario: Weekly ring reaches 100% on HabitDetailPage

- GIVEN a user has completed all 7 habits for the current week
- WHEN the HabitDetailPage mounts
- THEN the weekly ring SVG animates from 0% to 100%
- AND a gold flash effect plays at 100% fill

## Cross-References

- Consumes: `motion-system` (`ParticleBurst`, `StreakFire`, `useReducedMotion`)
- Consumes: `habit-detail` (weekly ring, streak display)
- Consumes: `habits-listing` (card cascade)
- Consumes: `home-dashboard` (stats counter animation)
- See: `openspec/changes/dark-mode-redesign-with-motion/proposal.md`

## Out of Scope

- Confetti storage: Supabase user metadata (deferred — localStorage is default per proposal open question #1)
- Streak freeze feature
- Push notification celebrations
- Partner ripple color matching habit color (deferred to v2)