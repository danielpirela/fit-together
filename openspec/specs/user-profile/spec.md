# User Profile — Delta Specification (Dark Mode Redesign with Motion)

## Purpose

Transform ProfilePage from a gray-50 placeholder into a full dark-mode experience with animated profile display, stats, and dark-themed settings controls.

## Requirements

### Requirement: ProfilePage SHALL use dark surface tokens for all surfaces

The page background SHALL be `var(--color-surface-primary)`. Profile card backgrounds SHALL be `var(--color-surface-secondary)`. Dividers SHALL be `var(--color-border-subtle)`.

### Requirement: Profile avatar SHALL render with `var(--color-surface-secondary)` fallback border

The avatar image container SHALL have a `var(--color-border-subtle)` border (2px) to ensure visibility against dark backgrounds. If no avatar is set, the initials SHALL render on `var(--color-surface-secondary)`.

### Requirement: Profile stats (streak, habits, partner) SHALL animate from 0 on mount

On ProfilePage mount, numeric stats SHALL animate from 0 to their current values over 800ms with an ease-out curve.

### Requirement: Stats animation SHALL be instant for reduced-motion users

When `useReducedMotion()` is true, stats SHALL display their final values immediately.

### Requirement: Settings list items SHALL use `var(--color-surface-secondary)` background

Each settings row (notifications, theme, account) SHALL have `var(--color-surface-secondary)` as its background with `var(--color-text-primary)` labels.

### Requirement: Settings toggle switches SHALL use accent color for active state

When a toggle is in the active (on) state, it SHALL use `var(--color-accent-primary)` as its track color.

### Requirement: Page heading "Profile" SHALL animate in on mount

The page heading SHALL animate in with a fade + slight upward translate (300ms) after the page data resolves.

### Requirement: Sign-out button SHALL implement Button press animation

The sign-out button SHALL implement the `motion?: 'entrance' | 'press'` contract from `ui-components`.

### Requirement: Empty states (no partner linked) SHALL show EmptyState with dark theme

When no partner is linked, the partner section SHALL show an EmptyState component styled with dark tokens.

## Scenarios

#### Scenario: ProfilePage loads with full profile data

- GIVEN the user has a profile photo, 8 habits, and a linked partner
- WHEN ProfilePage mounts
- THEN the heading animates in at 100ms
- AND stats animate from 0 to their values over 800ms
- AND the partner section shows the linked partner's name and streak

#### Scenario: Reduced-motion user views ProfilePage

- GIVEN `prefers-reduced-motion: reduce`
- WHEN ProfilePage renders
- THEN all stats display their final values instantly
- AND no animation plays

#### Scenario: Settings row tap on/off

- GIVEN the notifications toggle is currently OFF
- WHEN the user taps it
- THEN it animates to the ON state (accent-primary track)
- AND the setting change is persisted

## Cross-References

- Consumes: `design-system-tokens` (all tokens)
- Consumes: `motion-system` (`useReducedMotion`, stats counter)
- Consumes: `ui-components` (Button, EmptyState, Toggle)
- See: `openspec/changes/dark-mode-redesign-with-motion/proposal.md`

## Out of Scope

- Profile photo upload UI (deferred)
- Account deletion flow
- Notification preference granularity (on/off only — no per-habit)
- Language/i18n settings