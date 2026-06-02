# SDD Tasks: Together Habit Tracking

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~6,000–7,500 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | 5 phased PRs |
| Delivery strategy | auto-chain |
| Chain strategy | stacked-to-main |

Decision needed before apply: No  
Chained PRs recommended: Yes  
Chain strategy: stacked-to-main  
400-line budget risk: High  

---

## Phase 1: Foundation

### TASK-001: Update Database Types

**Description**: Create or update the shared database types file with all TypeScript interfaces matching the Supabase schema: User, Couple, Habit, Completion, Invitation, and API response wrappers.

**Files to modify**:
- `src/shared/types/database.ts` (create)

**Dependencies**: None

**Estimated lines**: ~150

---

### TASK-002: Create Supabase Client

**Description**: Initialize the Supabase client with proper configuration for auth, database, and realtime. Export typed client for use across the app.

**Files to modify**:
- `src/shared/lib/supabase.ts` (create)

**Dependencies**: None

**Estimated lines**: ~30

---

### TASK-003: Create Design Tokens

**Description**: Create theme constants for colors and spacing following Apple HIG design system.

**Files to modify**:
- `src/shared/constants/theme-colors.ts` (create)
- `src/shared/constants/theme-spacing.ts` (create)

**Dependencies**: None

**Estimated lines**: ~80

---

### TASK-004: Create Shared UI Components

**Description**: Build all reusable UI components from the spec: Button, TextInput, LoadingSpinner, EmptyState, FormField. Use kebab-case filenames.

**Files to create**:
- `src/shared/components/button.tsx`
- `src/shared/components/text-input.tsx`
- `src/shared/components/loading-spinner.tsx`
- `src/shared/components/empty-state.tsx`
- `src/shared/components/form-field.tsx`

**Dependencies**: TASK-003

**Estimated lines**: ~600

---

### TASK-005: Update AuthStore

**Description**: Ensure AuthStore has all required methods: initialize, signUp, signIn, signOut, resetPassword. Persist session with AsyncStorage.

**Files to modify**:
- `src/stores/auth-store.ts` (update)

**Dependencies**: TASK-001, TASK-002

**Estimated lines**: ~200

---

### TASK-006: Update CoupleStore

**Description**: Ensure CoupleStore has all required methods: createCouple, fetchCouple, invitePartner, acceptInvitation, declineInvitation, cancelInvitation, leaveCouple.

**Files to modify**:
- `src/stores/couple-store.ts` (update)

**Dependencies**: TASK-001, TASK-002

**Estimated lines**: ~200

---

### TASK-007: Update HabitsStore

**Description**: Ensure HabitsStore has all required methods: fetchHabits, createHabit, updateHabit, archiveHabit, restoreHabit, toggleCompletion, fetchGridData.

**Files to modify**:
- `src/stores/habits-store.ts` (update)

**Dependencies**: TASK-001, TASK-002

**Estimated lines**: ~250

---

## Phase 2: Auth Screens

### TASK-008: Create Auth Layout and Navigation

**Description**: Set up auth stack navigator with no header. Configure auth route group layout.

**Files to create**:
- `app/auth/_layout.tsx`

**Dependencies**: TASK-005

**Estimated lines**: ~40

---

### TASK-009: Create Login Screen

**Description**: Build login screen with email and password inputs. Handle validation, errors, and navigation to signup/reset password.

**Files to create**:
- `app/auth/login.tsx`

**Dependencies**: TASK-004, TASK-008

**Estimated lines**: ~120

---

### TASK-010: Create Sign Up Screen

**Description**: Build sign up screen with display name, email, password, and confirm password inputs. Handle validation matching spec requirements.

**Files to create**:
- `app/auth/sign-up.tsx`

**Dependencies**: TASK-004, TASK-008

**Estimated lines**: ~150

---

### TASK-011: Create Reset Password Screen

**Description**: Build reset password screen with email input. Show success state after sending.

**Files to create**:
- `app/auth/reset-password.tsx`

**Dependencies**: TASK-004, TASK-008

**Estimated lines**: ~100

---

### TASK-012: Create Auth Forms Feature Module

**Description**: Build auth form components for reuse: LoginForm, SignUpForm. Include form validation logic.

**Files to create**:
- `src/features/auth/components/login-form.tsx`
- `src/features/auth/components/sign-up-form.tsx`

**Dependencies**: TASK-004, TASK-009, TASK-010

**Estimated lines**: ~300

---

### TASK-013: Create useAuth Hook

**Description**: Create custom hook wrapping AuthStore for feature components to use.

**Files to create**:
- `src/features/auth/hooks/use-auth.ts`

**Dependencies**: TASK-005

**Estimated lines**: ~40

---

## Phase 3: Couple Management

### TASK-014: Create Couple Layout and Navigation

**Description**: Set up couple stack navigator for authenticated users without a couple.

**Files to create**:
- `app/couple/_layout.tsx`

**Dependencies**: TASK-006

**Estimated lines**: ~40

---

### TASK-015: Create Create Couple Screen

**Description**: Build screen for creating a new couple partnership. Validate name input.

**Files to create**:
- `app/couple/create.tsx`

**Dependencies**: TASK-004, TASK-014

**Estimated lines**: ~100

---

### TASK-016: Create Invite Partner Screen

**Description**: Build screen for inviting partner via email. Include copy link functionality.

**Files to create**:
- `app/couple/invite.tsx`

**Dependencies**: TASK-004, TASK-014

**Estimated lines**: ~120

---

### TASK-017: Create Accept Invitation Screen

**Description**: Build screen for handling deep link invitation tokens. Show inviter info, accept/decline buttons.

**Files to create**:
- `app/invite/[token].tsx`

**Dependencies**: TASK-004, TASK-006

**Estimated lines**: ~150

---

### TASK-018: Create Couple Forms Feature Module

**Description**: Build couple form components: CreateCoupleForm, InvitePartnerForm.

**Files to create**:
- `src/features/couple/components/create-couple-form.tsx`
- `src/features/couple/components/invite-partner-form.tsx`
- `src/features/couple/components/invitation-card.tsx`
- `src/features/couple/components/partner-badge.tsx`

**Dependencies**: TASK-004, TASK-015, TASK-016

**Estimated lines**: ~400

---

### TASK-019: Create useCouple Hook

**Description**: Create custom hook wrapping CoupleStore for feature components to use.

**Files to create**:
- `src/features/couple/hooks/use-couple.ts`

**Dependencies**: TASK-006

**Estimated lines**: ~40

---

## Phase 4: Habits + Grid

### TASK-020: Create Grid Components

**Description**: Build activity grid components for 12-month visualization: ActivityGrid, GridCell, GridLegend.

**Files to create**:
- `src/shared/components/activity-grid.tsx`
- `src/shared/components/grid-cell.tsx`
- `src/shared/components/grid-legend.tsx`

**Dependencies**: TASK-004

**Estimated lines**: ~400

---

### TASK-021: Create Habit Form Components

**Description**: Build habit input components: DaySelector, ColorPicker, IconPicker.

**Files to create**:
- `src/shared/components/day-selector.tsx`
- `src/shared/components/color-picker.tsx`
- `src/shared/components/icon-picker.tsx`
- `src/shared/components/completion-toggle.tsx`

**Dependencies**: TASK-004

**Estimated lines**: ~450

---

### TASK-022: Create Habits Feature Components

**Description**: Build habit feature components: HabitList, HabitCard, HabitForm.

**Files to create**:
- `src/features/habits/components/habit-list.tsx`
- `src/features/habits/components/habit-card.tsx`
- `src/features/habits/components/habit-form.tsx`

**Dependencies**: TASK-020, TASK-021

**Estimated lines**: ~500

---

### TASK-023: Create useHabits Hook

**Description**: Create custom hook wrapping HabitsStore for feature components to use.

**Files to create**:
- `src/features/habits/hooks/use-habits.ts`

**Dependencies**: TASK-007

**Estimated lines**: ~50

---

### TASK-024: Create Tab Navigation Layout

**Description**: Set up main tab navigator with 3 tabs: Home, Habits, Profile.

**Files to create**:
- `app/(tabs)/_layout.tsx`

**Dependencies**: TASK-005, TASK-006

**Estimated lines**: ~60

---

### TASK-025: Create Home Screen

**Description**: Build main home screen showing today's habits with completion toggles and weekly progress.

**Files to create**:
- `app/(tabs)/index.tsx`

**Dependencies**: TASK-022, TASK-023, TASK-024

**Estimated lines**: ~200

---

### TASK-026: Create Habits Management Screen

**Description**: Build screen for managing all habits with Active/Archived tabs.

**Files to create**:
- `app/(tabs)/habits.tsx`

**Dependencies**: TASK-022, TASK-023, TASK-024

**Estimated lines**: ~180

---

### TASK-027: Create Profile Screen

**Description**: Build profile screen with user info, partner badge, pending invitations, and actions (invite, leave, sign out).

**Files to create**:
- `app/(tabs)/profile.tsx`

**Dependencies**: TASK-018, TASK-019, TASK-024

**Estimated lines**: ~250

---

### TASK-028: Create Habit Detail Screen

**Description**: Build screen showing habit details with 12-month activity grid and view mode toggle (My View / Couple View).

**Files to create**:
- `app/habit/[id].tsx`

**Dependencies**: TASK-020, TASK-023

**Estimated lines**: ~220

---

### TASK-029: Create Add Habit Modal

**Description**: Build modal screen for creating new habits with all form fields.

**Files to create**:
- `app/modal/add-habit.tsx`

**Dependencies**: TASK-021, TASK-022

**Estimated lines**: ~200

---

### TASK-030: Create Edit Habit Modal

**Description**: Build modal screen for editing existing habits. Pre-populate form with current values. Add delete option.

**Files to create**:
- `app/modal/edit-habit.tsx`

**Dependencies**: TASK-021, TASK-022

**Estimated lines**: ~220

---

### TASK-031: Create Root Layout

**Description**: Set up root layout with providers (auth, query). Handle auth state redirects.

**Files to create**:
- `app/_layout.tsx`

**Dependencies**: TASK-005

**Estimated lines**: ~80

---

## Phase 5: Polish

### TASK-032: Add Real-time Subscriptions

**Description**: Add Supabase Realtime subscriptions to HabitsStore for completions and couples channels. Update UI on changes.

**Files to modify**:
- `src/stores/habits-store.ts`
- `src/stores/couple-store.ts`

**Dependencies**: TASK-007, TASK-006

**Estimated lines**: ~150

---

### TASK-033: Add Loading States

**Description**: Add LoadingSpinner to all screens during async operations. Use skeleton states where appropriate.

**Files to modify**: Multiple screen files

**Dependencies**: TASK-004, TASK-025, TASK-026, TASK-027, TASK-028

**Estimated lines**: ~200

---

### TASK-034: Add Error Handling

**Description**: Add comprehensive error handling and toast notifications for all API operations.

**Files to modify**: Multiple screen and store files

**Dependencies**: All previous tasks

**Estimated lines**: ~150

---

### TASK-035: Add Empty States

**Description**: Add EmptyState components to all lists with appropriate messaging and action buttons.

**Files to modify**: Multiple screen files

**Dependencies**: TASK-004

**Estimated lines**: ~120

---

### TASK-036: Add Deep Link Configuration

**Description**: Configure expo-linking for invitation deep links. Handle URL parsing and navigation.

**Files to modify**:
- `app/_layout.tsx` (update)
- `app.json` (update)

**Dependencies**: TASK-017

**Estimated lines**: ~60

---

### TASK-037: Create Supabase Migrations

**Description**: Create SQL migrations for all database tables: users, couples, habits, completions, invitations.

**Files to create**:
- `supabase/migrations/001_initial.sql`

**Dependencies**: None

**Estimated lines**: ~180

---

### TASK-038: Create Date Utilities

**Description**: Create utility functions for date formatting, grid cell calculation, and week/month progress.

**Files to create**:
- `src/shared/lib/date-utils.ts`

**Dependencies**: None

**Estimated lines**: ~100

---

### TASK-039: Final Integration and Testing

**Description**: Wire up all stores, screens, and components. Test auth flow, couple creation, habit tracking, and grid visualization end-to-end.

**Files to modify**: Multiple

**Dependencies**: All previous tasks

**Estimated lines**: ~100

---

## Task Summary

| Phase | Tasks | Estimated Lines |
|-------|-------|-----------------|
| Phase 1: Foundation | TASK-001 to TASK-007 | ~1,600 |
| Phase 2: Auth Screens | TASK-008 to TASK-013 | ~790 |
| Phase 3: Couple Management | TASK-014 to TASK-019 | ~900 |
| Phase 4: Habits + Grid | TASK-020 to TASK-031 | ~2,580 |
| Phase 5: Polish | TASK-032 to TASK-039 | ~960 |
| **Total** | **39 tasks** | **~6,830 lines** |

---

## PR Chain Strategy

Given the high line count (~6,800 estimated), recommend 5 stacked PRs:

1. **PR 1: Foundation** (TASK-001 to TASK-007) - ~1,600 lines
   - Core types, supabase client, stores, shared components
   - Low risk, establishes base

2. **PR 2: Auth Flow** (TASK-008 to TASK-013) - ~790 lines
   - Login, sign up, reset password screens
   - Depends on PR 1

3. **PR 3: Couple Management** (TASK-014 to TASK-019) - ~900 lines
   - Create couple, invite partner, accept invitation
   - Depends on PR 2

4. **PR 4: Habits + Grid** (TASK-020 to TASK-031) - ~2,580 lines
   - All habit screens and components
   - Largest PR, core feature
   - Depends on PR 3

5. **PR 5: Polish** (TASK-032 to TASK-039) - ~960 lines
   - Real-time, loading, errors, empty states, migrations
   - Depends on PR 4

---

## Implementation Notes

- **File naming**: All new files use kebab-case (e.g., `habit-card.tsx`, `sign-up.tsx`)
- **Component naming**: Use PascalCase for React components
- **Store naming**: Use camelCase with `-store.ts` suffix (e.g., `auth-store.ts`)
- **Hook naming**: Use camelCase with `use` prefix (e.g., `use-auth.ts`)
- **Dependencies**: Complete prerequisite tasks before dependent tasks
- **Real-time**: Implement optimistic UI updates with rollback on error
- **Grid**: Use diagonal split CSS/canvas for "both complete" state