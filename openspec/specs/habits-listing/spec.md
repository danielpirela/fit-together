# Habits Listing — Delta Specification (Dark Mode Redesign with Motion)

## Purpose

Redesign HabitsPage to use the dark token system, animate the tab indicator slide, provide a card cascade entrance on mount, and implement a dark-mode empty state.

## Requirements

### Requirement: HabitsPage tab indicator SHALL slide between Today/Week views

The tab indicator (underline pill) SHALL animate from the current tab position to the selected tab position over 250ms with easeOutQuart when the user taps a different tab.

### Requirement: Tab indicator slide SHALL be instant for reduced-motion users

When `useReducedMotion()` is true, the indicator SHALL snap to the new position without animation.

### Requirement: Habit cards SHALL cascade on page mount

When HabitsPage mounts, each visible habit card SHALL animate in with a 60ms stagger: fade + translateY from 24px below to final position, 250ms per card.

### Requirement: Card cascade SHALL be instant for reduced-motion users

When `useReducedMotion()` is true, habit cards SHALL render immediately at final position.

### Requirement: Habit card background SHALL be `var(--color-surface-secondary)`

Each habit card SHALL have `var(--color-surface-secondary)` as its background color. Card text SHALL use `var(--color-text-primary)` and secondary labels `var(--color-text-muted)`.

### Requirement: Streak display on habit cards SHALL use `StreakFire` for streaks ≥3

Each habit card SHALL show `StreakFire` (from `motion-system`) when the habit's current streak is ≥3 days.

### Requirement: Empty state for "no habits today" SHALL show an EmptyState component

When the Today view has no habits logged, an EmptyState SHALL render with the dark theme and an entrance animation.

### Requirement: Check-in button on habit card SHALL trigger ParticleBurst on success

When the user taps the check-in button on a habit card and the mutation succeeds, a `ParticleBurst` SHALL fire within 200ms.

### Requirement: Habit cards showing partner activity SHALL display a purple partner indicator

When the partner has logged the same habit recently (within 24h), the habit card SHALL show a small purple dot or ring indicating partner activity.

## Scenarios

#### Scenario: User switches from Today to Week tab

- GIVEN the active tab is "Today"
- WHEN the user taps "Week"
- THEN the indicator pill slides from Today to Week position over 250ms
- AND the content fades to the Week view

#### Scenario: HabitsPage loads with 8 habits — cascade animation

- GIVEN the user has 8 habits configured
- WHEN HabitsPage mounts
- THEN the first card begins its entrance at 0ms
- AND each subsequent card enters 60ms after the previous
- AND all cards are visible by 540ms (0 + 7×60 + 250)

#### Scenario: Reduced-motion user browses habits

- GIVEN `prefers-reduced-motion: reduce`
- WHEN HabitsPage renders
- THEN all habit cards appear at their final positions instantly
- AND the tab indicator snaps immediately on tab switch

#### Scenario: Empty state when no habits are due today

- GIVEN the user has habits configured but none are scheduled for today
- WHEN the Today tab is active
- THEN EmptyState renders with "Nothing due today — enjoy your rest!"
- AND an entrance animation plays

## Cross-References

- Consumes: `design-system-tokens` (surface, text tokens)
- Consumes: `motion-system` (`useReducedMotion`, stagger timing)
- Consumes: `habit-celebrations` (ParticleBurst on check-in)
- Consumed by: `layout-chrome` (TabLayout)
- See: `openspec/changes/dark-mode-redesign-with-motion/proposal.md`

## Out of Scope

- Drag-to-reorder habits (deferred)
- Habit filtering/sorting UI
- Archive/completed habits view
- Habit sharing toggle per habit