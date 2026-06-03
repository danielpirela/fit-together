# Couple Flow — Delta Specification (Dark Mode Redesign with Motion)

## Purpose

Redesign CreateCouplePage and InvitePartnerPage to use dark tokens, animate form fields with staggered entrance, and implement dark-mode styling for all couple management UI.

## Requirements

### Requirement: CreateCouplePage and InvitePartnerPage SHALL use dark surface tokens

Both pages SHALL use `var(--color-surface-primary)` for page background. Form fields SHALL use `var(--color-surface-secondary)` background. Text SHALL use `var(--color-text-primary)` and `var(--color-text-muted)` for secondary content.

### Requirement: Form fields SHALL animate in with staggered entrance

On each page mount, form fields SHALL animate in with 60ms stagger: fade + translateY from 16px below, 250ms per field, easeOutQuart.

### Requirement: Staggered entrance SHALL be suppressed for reduced-motion users

When `useReducedMotion()` is true, all form fields SHALL render at their final position instantly.

### Requirement: Page headings SHALL animate in on mount

Headings ("Create Couple", "Invite Your Partner") SHALL animate in with a fade + slight upward translate (300ms) after the page data resolves (100ms delay before heading starts).

### Requirement: Partner invite code display SHALL use monospace font styling

The generated couple code SHALL be displayed using `var(--color-text-primary)` on `var(--color-surface-secondary)` background with a monospace font family.

### Requirement: Success state for couple creation SHALL trigger ParticleBurst

When `createCouple` mutation succeeds, a `ParticleBurst` SHALL fire on the submit button's DOM node within 200ms.

### Requirement: Error messages SHALL use `var(--color-feedback-error)` for text color

Inline error messages SHALL use `var(--color-feedback-error)` and follow the same entrance animation as the field they relate to.

### Requirement: Link/copy actions for invite code SHALL use `var(--color-accent-primary)` for interactive text

"Copy link" or "Share code" actions SHALL use `var(--color-accent-primary)` as their text color.

## Scenarios

#### Scenario: CreateCouplePage renders with staggered fields

- GIVEN CreateCouplePage mounts
- WHEN it renders
- THEN the heading animates in at 100ms
- AND the partner name field starts its entrance at 150ms
- AND the submit button is the last to animate in

#### Scenario: InvitePartnerPage renders for existing couple

- GIVEN the user is already in a couple
- WHEN InvitePartnerPage mounts
- THEN the couple code is displayed in a styled box
- AND the heading animates in

#### Scenario: Reduced-motion user creates a couple

- GIVEN `prefers-reduced-motion: reduce`
- WHEN CreateCouplePage mounts
- THEN all form fields render at final position instantly
- AND no staggered animation plays

#### Scenario: Couple creation success fires ParticleBurst

- GIVEN the user submits the create couple form
- WHEN the mutation succeeds
- THEN a ParticleBurst fires on the submit button within 200ms

## Cross-References

- Consumes: `design-system-tokens` (all tokens)
- Consumes: `motion-system` (`useReducedMotion`, stagger timing)
- Consumes: `ui-components` (Button, TextInput)
- Consumes: `habit-celebrations` (ParticleBurst)
- See: `openspec/changes/dark-mode-redesign-with-motion/proposal.md`

## Out of Scope

- Real-time partner sync (v2 — Supabase Realtime)
- Couple dissolve/leave flow UI
- Partner profile editing
- Invitation expiration handling