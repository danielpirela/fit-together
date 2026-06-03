# UI Components — Delta Specification (Dark Mode Redesign with Motion)

## Purpose

Redesign Button, TextInput, Toast, EmptyState, LoadingSpinner, and LoadingScreen components to consume the Obsidian Pulse dark palette tokens, implement GSAP press/entrance animations, and remove the `colorScheme: 'light'` restriction from TextInput.

## Requirements

### Requirement: All UI components SHALL use CSS custom properties for colors

Every color value used in component styles MUST resolve from a CSS custom property (e.g., `var(--color-surface-primary)`), not a hard-coded hex value.

### Requirement: Button SHALL implement press and entrance animations

Button SHALL accept `motion?: 'entrance' | 'press' | 'celebration'`. Entrance: fade + scale from 0.95 to 1.0 over 200ms with easeOutQuart. Press: scale to 0.97 on mousedown/touchstart within 50ms, return on release.

### Requirement: Button press animation SHALL be suppressed for reduced-motion users

When `useReducedMotion()` is true, the press scale animation SHALL NOT fire. The button responds to clicks without animation.

### Requirement: TextInput SHALL remove `colorScheme: 'light'` restriction

TextInput MUST NOT pass `colorScheme: 'light'` to its underlying element. The component SHALL rely on the dark background tokens for styling, independent of OS light/dark mode.

### Requirement: Toast component SHALL animate in from bottom-right

Toast SHALL animate in with a translateY + opacity GSAP timeline (300ms, easeOutQuart). Multiple toasts SHALL stack vertically with 8px gaps.

### Requirement: Toast SHALL have a max stack limit of 3

When >3 toasts are active, the oldest toast SHALL be removed before the new one enters.

### Requirement: EmptyState SHALL implement an entrance animation

EmptyState SHALL animate in with a fade + slight upward translate (150ms) on mount, triggered when the associated data list is empty and `useReducedMotion()` is false.

### Requirement: LoadingSpinner SHALL use the dark surface token

LoadingSpinner's track and fill colors SHALL use `var(--color-surface-secondary)` and `var(--color-accent-primary)` respectively.

### Requirement: LoadingScreen SHALL render a full-viewport overlay

LoadingScreen SHALL render a `position: fixed` overlay with `var(--color-surface-primary)` background and center-aligned LoadingSpinner. It SHALL animate out with an opacity fade (200ms) when the loading state resolves.

### Requirement: All animated components SHALL accept a motion prop

When `motion` prop is absent, the component renders in its static (non-animated) state. This allows static testing of visual output without runtime animation.

## Scenarios

#### Scenario: Button rendered in dark mode

- GIVEN a Button rendered on a dark background
- WHEN it mounts
- THEN its background color is `var(--color-surface-primary)`
- AND text color is `var(--color-text-primary)` with ≥4.5:1 contrast
- AND border uses `var(--color-border-subtle)`

#### Scenario: Button press animation on click

- GIVEN a Button with default motion settings
- WHEN the user presses (mousedown) the button
- THEN the button scales to 0.97 within 50ms
- AND on mouseup, it returns to scale 1.0 within 100ms

#### Scenario: TextInput in dark mode with OS in light mode

- GIVEN TextInput rendered
- AND the OS is in light mode
- WHEN the user focuses the input
- THEN the input background remains `var(--color-surface-secondary)` (dark)
- AND no OS light-mode override changes the appearance

#### Scenario: Reduced-motion user sees static toast

- GIVEN `prefers-reduced-motion: reduce`
- WHEN a toast is triggered
- THEN it appears instantly without animation at its final position
- AND 300ms later it remains visible until dismissed

## Cross-References

- Consumes: `design-system-tokens` (all color tokens)
- Consumes: `motion-system` (`useReducedMotion`, easing curves)
- Consumed by: `layout-chrome` (TabLayout uses Button, Toast for notifications)
- Consumed by: `auth-flow` (LoginPage, SignUpPage use TextInput, Button)
- See: `openspec/changes/dark-mode-redesign-with-motion/proposal.md`

## Out of Scope

- Component variant system (Button variants: primary/secondary/ghost — deferred to v2)
- Icon components (separate spec)
- Form validation animations
- Skeleton loading states