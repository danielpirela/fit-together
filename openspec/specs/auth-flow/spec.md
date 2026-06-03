# Auth Flow — Delta Specification (Dark Mode Redesign with Motion)

## Purpose

Redesign LoginPage, SignUpPage, ResetPasswordPage, and InvitePage to consume the dark token system, remove the TextInput `colorScheme: 'light'` restriction, and provide GSAP entrance animations for form fields.

## Requirements

### Requirement: All auth pages SHALL use dark surface tokens for backgrounds and inputs

Each auth page background SHALL be `var(--color-surface-primary)`. Form field backgrounds SHALL be `var(--color-surface-secondary)`. Text SHALL be `var(--color-text-primary)`.

### Requirement: Auth form fields SHALL animate in with staggered entrance

On auth page mount, form fields SHALL animate in with a 60ms stagger: each field fades in and translates up 16px from below its final position, 250ms duration, easeOutQuart.

### Requirement: Staggered entrance SHALL be suppressed for reduced-motion users

When `useReducedMotion()` is true, all form fields SHALL render at their final position instantly.

### Requirement: Auth page headings SHALL animate in on mount

Page headings ("Sign In", "Create Account", etc.) SHALL animate in with a fade + slight upward translate (300ms) on page mount, after the form fields begin their entrance sequence (100ms delay).

### Requirement: Form submit button SHALL follow Button press animation spec

The submit button on each auth page SHALL implement the `motion?: 'entrance' | 'press'` contract from `ui-components`.

### Requirement: Auth error states SHALL use `var(--color-feedback-error)` for text color

Inline error messages below form fields SHALL use `var(--color-feedback-error)` and follow the same entrance animation as the field they relate to.

### Requirement: TextInput in auth pages SHALL NOT restrict to light colorScheme

TextInput components in auth pages MUST NOT pass `colorScheme: 'light'`. They SHALL render with dark surface backgrounds regardless of OS theme setting.

## Scenarios

#### Scenario: LoginPage renders in dark mode

- GIVEN the app is in dark mode
- WHEN LoginPage mounts
- THEN the page background is `var(--color-surface-primary)`
- AND email/password inputs have `var(--color-surface-secondary)` backgrounds
- AND placeholder text is `var(--color-text-muted)`

#### Scenario: SignUpPage form field entrance animation

- GIVEN SignUpPage mounts
- WHEN the page renders
- THEN the heading fades in after a 100ms delay
- AND the first form field starts its entrance animation at 150ms
- AND each subsequent field enters 60ms after the previous

#### Scenario: Reduced-motion user sees instant auth form

- GIVEN `prefers-reduced-motion: reduce`
- WHEN LoginPage mounts
- THEN all form fields render at their final position immediately
- AND no stagger animation plays

#### Scenario: Auth form submission error

- GIVEN the user submits an invalid email on SignUpPage
- WHEN the server returns a validation error
- THEN the error message appears below the email field with `var(--color-feedback-error)`
- AND it animates in with the same entrance timing as the field

## Cross-References

- Consumes: `design-system-tokens` (all tokens)
- Consumes: `motion-system` (`useReducedMotion`, stagger timing)
- Consumes: `ui-components` (Button, TextInput, Toast)
- See: `openspec/changes/dark-mode-redesign-with-motion/proposal.md`

## Out of Scope

- Auth validation logic (handled by Supabase client-side + server rules)
- Password strength meter component (deferred)
- Social auth buttons (Google, Apple — deferred)
- Session expiration UX
- Real auth restoration (out of scope for this change per proposal)