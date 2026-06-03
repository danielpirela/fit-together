# Design System Tokens Specification

## Purpose

Establish the CSS custom property and Tailwind v4 `@theme` token system that makes the Obsidian Pulse dark palette available to every component, eliminating the current state where all `var(--color-*)` references resolve to nothing.

## Requirements

### Requirement: CSS custom properties SHALL be defined in `src/presentation/styles/theme.css`

The file SHALL define all color, spacing, and motion tokens as CSS custom properties on the `:root` selector. Each token MUST use the format `--color-<category>-<name>` or `--space-<name>`.

### Requirement: Tailwind v4 `@theme` SHALL consume CSS custom properties

The `theme.css` file SHALL include a Tailwind v4 `@theme` block that maps CSS custom properties to Tailwind tokens using the format `--tw-<token>: var(--<custom-property>)`.

### Requirement: Dark mode activation SHALL NOT cause FOUC

`main.tsx` SHALL set `document.documentElement.dataset.theme = 'dark'` before first paint. No inline script or class-flip mechanism that causes a white flash.

### Requirement: All color tokens SHALL meet WCAG 2.1 AA contrast on dark backgrounds

Text color tokens MUST achieve ≥4.5:1 contrast ratio; large text (≥18pt or ≥14pt bold) MUST achieve ≥3:1. Interactive element focus rings MUST be visible against adjacent surfaces.

### Requirement: Token naming SHALL follow semantic naming, not visual description

Token names SHALL reflect their purpose (e.g., `--color-surface-primary`) not their current value (e.g., `--color-dark-gray-900`). Alias tokens for equivalent values are allowed.

### Requirement: Spacing tokens SHALL use a 4px base unit

All spacing tokens SHALL be multiples of 4px (e.g., `--space-1: 4px`, `--space-2: 8px`, `--space-4: 16px`, `--space-6: 24px`, `--space-8: 32px`).

### Requirement: Reduced-motion tokens SHALL be defined

`--motion-duration-instant`, `--motion-duration-fast`, `--motion-duration-normal`, `--motion-duration-slow` tokens SHALL be defined to enable `prefers-reduced-motion` overrides via a single CSS change.

## Scenarios

#### Scenario: Cold load in dark mode

- GIVEN the user navigates to any route for the first time
- WHEN the page loads
- THEN no white/light flash appears before the dark background renders
- AND all color values resolve from CSS custom properties, not Tailwind defaults

#### Scenario: Button rendered with primary surface token

- GIVEN a Button component is mounted
- WHEN it renders
- THEN its background color resolves to `var(--color-surface-primary)`
- AND the token maps to a value with ≥4.5:1 contrast against `--color-text-primary`

#### Scenario: Design token queried for reduced-motion duration

- GIVEN a developer needs the standard animation duration
- WHEN they reference `var(--motion-duration-normal)`
- THEN they receive a value (e.g., 300ms) that can be overridden in a single `prefers-reduced-motion` query

## Cross-References

- Related to: `motion-system` (motion tokens defined here consumed there)
- Related to: `ui-components` (consumes all color tokens)
- See: `openspec/changes/dark-mode-redesign-with-motion/proposal.md`

## Out of Scope

- Light theme token definitions
- Typography tokens (font families, sizes — handled by Tailwind config)
- Border radius tokens (handled by Tailwind config)
- Runtime theme switching (dark-only in this change)