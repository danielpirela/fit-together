# Habit Creation — Delta Specification (Dark Mode Redesign with Motion)

## Purpose

Redesign AddHabitPage to use the dark token system, animate form field entrances, and implement the dark-mode color fill for the day-picker (or fill + slide per the open question #6 decision).

## Requirements

### Requirement: AddHabitPage SHALL use dark surface tokens for all surfaces

The page background SHALL be `var(--color-surface-primary)`. Form field backgrounds SHALL be `var(--color-surface-secondary)`. Section dividers SHALL be `var(--color-border-subtle)`.

### Requirement: Form fields SHALL animate in with staggered entrance on page load

On AddHabitPage mount, form fields SHALL animate in with a 60ms stagger: fade + translateY from 16px below, 250ms per field, easeOutQuart.

### Requirement: Staggered entrance SHALL be suppressed for reduced-motion users

When `useReducedMotion()` is true, form fields SHALL render at their final position instantly.

### Requirement: Day-picker SHALL show selected days with `var(--color-accent-primary)` fill

When a day is selected in the day-picker, the day cell SHALL have `var(--color-accent-primary)` as its background. The open question #6 (fill + slide vs fill-only) SHALL be resolved in the design phase; this spec covers the default (fill-only).

### Requirement: Day-picker animation (default: fill-only) SHALL be instant for reduced-motion users

When `useReducedMotion()` is true, day selection SHALL update instantly without a slide animation.

### Requirement: Habit creation success SHALL trigger a ParticleBurst on the submit button

When `createHabit` mutation succeeds, a `ParticleBurst` SHALL fire on the submit button's DOM node within 200ms.

### Requirement: Form field labels SHALL use `var(--color-text-muted)` for their color

Field labels ("Habit name", "Reminder time", etc.) SHALL use `var(--color-text-muted)`.

### Requirement: Page heading "New Habit" SHALL animate in on mount

The page heading SHALL animate in with a fade + upward translate (300ms) after the form fields begin their entrance sequence.

### Requirement: Error state for empty habit name SHALL use `var(--color-feedback-error)`

Inline validation error SHALL use `var(--color-feedback-error)` and animate in with the same timing as the field.

## Scenarios

#### Scenario: AddHabitPage renders with animated form fields

- GIVEN AddHabitPage mounts
- WHEN it renders
- THEN the heading animates in at 100ms
- AND the first form field starts its entrance at 150ms
- AND subsequent fields enter 60ms apart

#### Scenario: User selects Monday/Wednesday/Friday in day-picker

- GIVEN the day-picker is visible
- WHEN the user taps Mon, Wed, Fri
- THEN each selected day fills with `var(--color-accent-primary)` instantly
- AND no slide animation plays (reduced-motion behavior, also default)

#### Scenario: Reduced-motion user creates a habit

- GIVEN `prefers-reduced-motion: reduce`
- WHEN AddHabitPage mounts
- THEN all form fields render instantly at their final positions
- AND habit creation shows ParticleBurst within 200ms of success

#### Scenario: Empty habit name validation error

- GIVEN the user leaves "Habit name" empty and submits
- WHEN validation fails
- THEN an error message appears below the field in `var(--color-feedback-error)`
- AND it animates in with the field's entrance timing

## Cross-References

- Consumes: `design-system-tokens` (all tokens)
- Consumes: `motion-system` (`useReducedMotion`, stagger timing)
- Consumes: `ui-components` (Button, TextInput)
- Consumes: `habit-celebrations` (ParticleBurst on success)
- See: `openspec/changes/dark-mode-redesign-with-motion/proposal.md`

## Out of Scope

- Day-picker fill + slide animation (open question #6 — deferred decision to design)
- Reminder notification settings UI
- Habit color customization
- Habit template selection