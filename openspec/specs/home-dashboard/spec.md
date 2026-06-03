# Home Dashboard — Delta Specification (Dark Mode Redesign with Motion)

## Purpose

Transform HomePage from a gray-50 placeholder into a full dark-mode experience with animated stats counters, card cascade entrance, and the Obsidian Pulse visual system.

## Requirements

### Requirement: HomePage SHALL use dark surface tokens for all backgrounds

The page background SHALL be `var(--color-surface-primary)`. Card backgrounds SHALL be `var(--color-surface-secondary)`. Section dividers SHALL be `var(--color-border-subtle)`.

### Requirement: Stats counters SHALL animate from 0 to value on mount

On HomePage route enter, numeric stats (current streak, weekly completions count, active habits count) SHALL animate from 0 to their current value over 800ms with an ease-out curve.

### Requirement: Stats counter animation SHALL be instant for reduced-motion users

When `useReducedMotion()` is true, stats counters SHALL display their final values immediately with no counting animation.

### Requirement: Habit summary cards SHALL cascade on page mount

When HomePage mounts, habit summary cards SHALL animate in with a 60ms stagger delay between cards. Each card fades in and translates up 24px, 250ms duration per card.

### Requirement: Cascade animation SHALL be instant for reduced-motion users

When `useReducedMotion()` is true, habit cards SHALL render immediately at their final positions without stagger.

### Requirement: Greeting header SHALL animate in on mount

The greeting text ("Good morning, [Name]") SHALL animate in with a fade + slight upward translate (300ms) after the page data resolves.

### Requirement: Partner activity summary SHALL display in a card

When the authenticated user has a linked partner, a partner activity card SHALL display their name, current streak, and last check-in time. The card SHALL use `var(--color-surface-secondary)` background.

### Requirement: Empty state (no habits yet) SHALL show an animated EmptyState component

When the user has no habits, an EmptyState component SHALL render with its entrance animation and a CTA to create the first habit.

## Scenarios

#### Scenario: HomePage loads with 5 habits and stats

- GIVEN the user has 5 habits and a 4-day streak
- WHEN HomePage mounts
- THEN the greeting animates in at 100ms
- AND stats counters animate from 0 to their values over 800ms
- AND habit cards cascade in with 60ms stagger

#### Scenario: HomePage loads with reduced-motion preference

- GIVEN `prefers-reduced-motion: reduce`
- WHEN HomePage mounts
- THEN all content renders at final state instantly
- AND no GSAP animation plays

#### Scenario: First-time user sees empty state with CTA

- GIVEN the user has no habits
- WHEN HomePage renders
- THEN an EmptyState appears with the entrance animation
- AND a "Add your first habit" button is visible

#### Scenario: Partner activity card displays

- GIVEN the user is linked to "Maria"
- AND Maria has a 6-day streak
- WHEN HomePage renders
- THEN a Partner card shows "Maria · 🔥 6 days · Last: 2h ago"

## Cross-References

- Consumes: `design-system-tokens` (all tokens)
- Consumes: `motion-system` (`useReducedMotion`, stats counter, cascade)
- Consumes: `ui-components` (EmptyState, Card)
- Consumes: `habit-celebrations` (streak display)
- See: `openspec/changes/dark-mode-redesign-with-motion/proposal.md`

## Out of Scope

- HomePage widget customization (drag-and-drop layout)
- Historical chart/graph components (deferred)
- Push notification permission prompt
- Habit sharing controls