# Layout Chrome — Delta Specification (Dark Mode Redesign with Motion)

## Purpose

Redesign the tab navigation shell (TabLayout, bottom tab bar) and the page transition wrapper to use the dark token system, animate the active indicator, and provide a consistent page-transition system.

## Requirements

### Requirement: TabLayout active indicator SHALL animate between tabs

The active tab indicator (underline or pill) SHALL use a GSAP timeline to slide from the previous tab's position to the new active tab's position. Duration: 250ms, easing: easeOutQuart.

### Requirement: Tab indicator animation SHALL be suppressed for reduced-motion users

When `useReducedMotion()` is true, the indicator SHALL snap instantly to the new position with no animation.

### Requirement: Page transition wrapper SHALL animate route changes

When the active route changes, the outgoing page SHALL fade out (150ms) while the incoming page fades in (200ms, delay 100ms). The transition runs on the router's navigation events.

### Requirement: TabLayout SHALL consume dark surface tokens

The tab bar background SHALL be `var(--color-surface-primary)`. Active tab icon/text SHALL be `var(--color-accent-primary)`. Inactive tab icon/text SHALL be `var(--color-text-muted)`.

### Requirement: Page transition animations SHALL be suppressed for reduced-motion users

When `useReducedMotion()` is true, pages SHALL swap instantly without fade animation.

### Requirement: TabLayout active indicator width transition SHALL be smooth

When tabs have varying label widths, the indicator pill SHALL animate its width change smoothly (200ms) alongside the position animation, not snap.

### Requirement: Tab bar SHALL maintain a 1px top border using `var(--color-border-subtle)`

The top border of the tab bar SHALL be `1px solid var(--color-border-subtle)` to visually separate the tab bar from the content area.

## Scenarios

#### Scenario: User taps a new tab — indicator slides

- GIVEN the active tab is "Home"
- WHEN the user taps "Habits"
- THEN the indicator pill slides from Home to Habits position over 250ms
- AND the tab icon/text color updates to accent-primary immediately

#### Scenario: Reduced-motion user navigates tabs

- GIVEN `prefers-reduced-motion: reduce`
- WHEN the user taps a new tab
- THEN the indicator snaps instantly to the new tab position
- AND the page content updates without fade animation

#### Scenario: Route change triggers page transition

- GIVEN the user is on the HomePage
- WHEN they navigate to HabitsPage
- THEN the HomePage fades out (150ms)
- AND HabitsPage fades in after a 100ms delay (200ms)
- AND the total perceived transition is under 500ms

## Cross-References

- Consumes: `design-system-tokens` (surface and text tokens)
- Consumes: `motion-system` (`useReducedMotion`, easing curves)
- Consumes: `ui-components` (Button, Toast)
- Consumed by: `home-dashboard` (Page wrapper)
- Consumed by: `habits-listing` (Page wrapper)
- See: `openspec/changes/dark-mode-redesign-with-motion/proposal.md`

## Out of Scope

- Nested navigation (sub-tab patterns)
- Tab badge animations
- Swipe gesture navigation between tabs
- Top header bar redesign (separate spec if needed)