# Together Habit Tracking — SDD Design

## 1. Folder Structure

```
fit-together/
├── app/                          # expo-router screens (kebab-case)
│   ├── _layout.tsx               # Root layout
│   ├── index.tsx                # Redirect based on auth state
│   ├── auth/                    # Auth flow (public)
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   ├── sign-up.tsx
│   │   └── reset-password.tsx
│   ├── couple/                  # Couple setup (authenticated, no couple)
│   │   ├── _layout.tsx
│   │   ├── create.tsx
│   │   └── invite.tsx           # Deep link handler
│   ├── (tabs)/                  # Main app tabs
│   │   ├── _layout.tsx
│   │   ├── home.tsx            # Habit list + today's completions
│   │   ├── habits.tsx          # Manage habits
│   │   └── profile.tsx         # Profile + couple settings
│   ├── habit/
│   │   └── [id].tsx            # Habit detail + grid view
│   └── modal/
│       ├── add-habit.tsx
│       └── edit-habit.tsx
├── src/
│   ├── core/                    # Domain layer (framework-agnostic)
│   │   ├── entities/           # Business objects
│   │   │   ├── user.ts
│   │   │   ├── couple.ts
│   │   │   ├── habit.ts
│   │   │   ├── completion.ts
│   │   │   └── invitation.ts
│   │   ├── repositories/        # Repository interfaces
│   │   │   ├── i-auth-repository.ts
│   │   │   ├── i-couple-repository.ts
│   │   │   ├── i-habit-repository.ts
│   │   │   └── i-completion-repository.ts
│   │   └── use-cases/          # Business logic
│   │       ├── auth/
│   │       │   ├── sign-in.ts
│   │       │   ├── sign-up.ts
│   │       │   ├── sign-out.ts
│   │       │   └── reset-password.ts
│   │       ├── couple/
│   │       │   ├── create-couple.ts
│   │       │   ├── invite-partner.ts
│   │       │   └── accept-invitation.ts
│   │       └── habits/
│   │           ├── create-habit.ts
│   │           ├── toggle-completion.ts
│   │           └── get-shared-completions.ts
│   ├── features/                # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── login-form.tsx
│   │   │   │   └── sign-up-form.tsx
│   │   │   └── hooks/
│   │   │       └── use-auth.ts
│   │   ├── couple/
│   │   │   ├── components/
│   │   │   │   ├── create-couple-form.tsx
│   │   │   │   └── invite-partner-form.tsx
│   │   │   └── hooks/
│   │   │       └── use-couple.ts
│   │   └── habits/
│   │       ├── components/
│   │       │   ├── habit-list.tsx
│   │       │   ├── habit-card.tsx
│   │       │   ├── habit-form.tsx
│   │       │   └── completion-toggle.tsx
│   │       └── hooks/
│   │           └── use-habits.ts
│   ├── shared/
│   │   ├── components/         # Reusable UI (kebab-case)
│   │   │   ├── button.tsx
│   │   │   ├── text-input.tsx
│   │   │   ├── activity-grid.tsx
│   │   │   ├── grid-cell.tsx
│   │   │   ├── grid-legend.tsx
│   │   │   ├── day-selector.tsx
│   │   │   ├── color-picker.tsx
│   │   │   ├── icon-picker.tsx
│   │   │   ├── loading-spinner.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── partner-badge.tsx
│   │   │   └── form-field.tsx
│   │   ├── hooks/              # Shared hooks
│   │   │   ├── use-supabase.ts
│   │   │   └── use-grid-data.ts
│   │   ├── lib/               # Utilities
│   │   │   ├── supabase.ts
│   │   │   └── utils.ts
│   │   ├── types/             # Shared types
│   │   │   └── database.ts
│   │   └── constants/         # Design tokens (kebab-case)
│   │       ├── theme-colors.ts
│   │       └── theme-spacing.ts
│   └── stores/                 # Zustand stores
│       ├── auth-store.ts
│       ├── couple-store.ts
│       └── habits-store.ts
├── constants/
│   └── Colors.ts
├── components/                 # Legacy (from template)
│   └── ...
└── supabase/
    └── migrations/             # Database migrations
        └── 001_initial.sql
```

## 2. File Naming Convention

| Type | Convention | Example |
|------|-----------|---------|
| **Components** | kebab-case | `activity-grid.tsx`, `habit-card.tsx` |
| **Screens** | kebab-case | `login.tsx`, `create-couple.tsx` |
| **Hooks** | camelCase with `use` prefix | `use-auth.ts`, `use-habits.ts` |
| **Stores** | camelCase with `store` suffix | `auth-store.ts`, `habits-store.ts` |
| **Utils** | camelCase | `date-utils.ts`, `format-utils.ts` |
| **Constants** | kebab-case | `theme-colors.ts`, `api-config.ts` |
| **Types** | camelCase or match entity | `database.ts`, `user.ts` |
| **Entities** | camelCase | `user.ts`, `couple.ts` |

## 3. Component Architecture

### Shared Components (src/shared/components/)

```
button.tsx
├── Props: title, onPress, variant, size, disabled, loading
├── States: default, hover, pressed, disabled, loading
└── Variants: primary (green), secondary (white), destructive (red), ghost

text-input.tsx
├── Props: label, placeholder, value, onChangeText, error, secureTextEntry
├── States: default, focused, error, disabled, filled
└── Validation: inline error display

activity-grid.tsx
├── Props: completions[], months, cellSize, onDayPress
├── Renders: GridCell components in weekly layout
└── Legend: GridLegend at bottom

grid-cell.tsx
├── Props: status ('both' | 'mine-only' | 'partner-only' | 'neither'), size
├── Visual: Diagonal split or solid color based on status
└── Colors: Green (both/Mine), Purple (Partner), Gray (Neither)

grid-legend.tsx
├── Shows: 4 color examples with labels
└── Position: Below grid

day-selector.tsx
├── Props: selectedDays[], onChange
├── Displays: Mon-Sun checkboxes
└── Touch: 44px minimum height

color-picker.tsx
├── Props: selectedColor, onChange
├── Options: Green (#34C759), Purple (#AF52DE), Blue (#007AFF), Orange (#FF9500)
└── Display: Horizontal row of color circles

loading-spinner.tsx
├── Props: size, color
└── Uses: ActivityIndicator

empty-state.tsx
├── Props: title, message, actionLabel, onAction
└── Display: Icon + text + optional button
```

### Feature Components (src/features/*/components/)

```
habit-list.tsx
├── Props: habits[], onToggle, onPress
├── Renders: HabitCard list
└── Empty: EmptyState when no habits

habit-card.tsx
├── Props: habit, todayCompletion, partnerCompletion, onToggle, onPress
├── Shows: Icon, name, today's status (checkmarks)
└── Actions: Tap to toggle, long-press for detail

habit-form.tsx
├── Props: initialValues, onSubmit, onCancel
├── Fields: name, description, frequency, targetDays, color, icon
└── Validation: Required name, at least 1 target day

login-form.tsx
├── Props: onSuccess, onError
├── Fields: email, password
└── Actions: Submit, forgot password link

sign-up-form.tsx
├── Props: onSuccess, onError
├── Fields: displayName, email, password, confirmPassword
└── Validation: Email format, password match, min 8 chars

create-couple-form.tsx
├── Props: onSuccess, onError
├── Fields: coupleName
└── Action: Creates couple, becomes partner_a

invite-partner-form.tsx
├── Props: coupleId, onSuccess, onError
├── Fields: inviteeEmail
└── Action: Generates invitation token
```

## 4. Data Flow

### Auth Flow
```
┌─────────────────────────────────────────────────────────────┐
│                        App Launch                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthStore.initialize() → supabase.auth.getSession()        │
│  Check AsyncStorage for stored session                      │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐
    │  Has Session    │             │  No Session     │
    └────────┬────────┘             └────────┬────────┘
             │                               │
             ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐
    │ Fetch User      │             │ Show Auth       │
    │ from DB         │             │ (login/signup)  │
    └────────┬────────┘             └─────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌──────────┐   ┌──────────┐
│ Has      │   │ No       │
│ Couple?  │   │ Couple?  │
└────┬─────┘   └────┬─────┘
     │              │
     ▼              ▼
┌──────────┐   ┌──────────┐
│ Main App │   │ Couple   │
│ (Tabs)   │   │ Setup    │
└──────────┘   └──────────┘
```

### Habit Completion Flow
```
┌─────────────────────────────────────────────────────────────┐
│ User taps completion toggle                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  HabitsStore.toggleCompletion(habitId, userId, date)        │
│  - Optimistic update (immediate UI)                         │
│  - Supabase upsert (insert/delete completion)               │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐
    │  Success        │             │  Error          │
    └────────┬────────┘             └────────┬────────┘
             │                               │
             ▼                               ▼
    ┌─────────────────┐             ┌─────────────────┐
    │ Update Grid     │             │ Revert UI       │
    │ (both complete  │             │ Show error      │
    │ shows split)    │             │ toast           │
    └─────────────────┘             └─────────────────┘
```

### Real-time Sync Flow
```
┌─────────────────────────────────────────────────────────────┐
│  HabitsStore subscribes to Supabase Realtime                │
│  supabase.channel('completions').on('INSERT' | 'DELETE')   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  On change: Update local completions Map                    │
│  Trigger React re-render for Grid                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  ActivityGrid re-renders with updated cell colors           │
└─────────────────────────────────────────────────────────────┘
```

## 5. Navigation Structure

### Auth Flow (public)
```
app/auth/
├── _layout.tsx        # Stack navigator, no header
├── login.tsx          # Email + password form
├── sign-up.tsx        # Display name + email + password
└── reset-password.tsx # Email input → send reset link
```

### Couple Setup (authenticated, no couple)
```
app/couple/
├── _layout.tsx        # Stack navigator
├── create.tsx         # Create couple form
└── invite.tsx         # Deep link: /couple/invite?token=xxx
```

### Main App (authenticated, has couple)
```
app/(tabs)/
├── _layout.tsx        # Tab navigator with 3 tabs
├── home.tsx           # Habit list + today's completions
├── habits.tsx         # Manage (create, edit, delete)
└── profile.tsx        # User profile + couple settings

app/habit/
└── [id].tsx           # Habit detail + 12-month grid
```

### Modals
```
app/modal/
├── add-habit.tsx      # Create new habit
└── edit-habit.tsx     # Edit existing habit
```

## 6. Zustand Stores

### auth-store.ts
```typescript
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  initialize(): Promise<void>;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string, displayName: string): Promise<void>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  updateProfile(displayName: string): Promise<void>;
}
```

### couple-store.ts
```typescript
interface CoupleState {
  couple: Couple | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCouple(userId: string): Promise<void>;
  createCouple(name: string, partnerAId: string): Promise<Couple>;
  invitePartner(coupleId: string, inviterId: string, email: string): Promise<void>;
  acceptInvitation(token: string, userId: string): Promise<void>;
  declineInvitation(token: string): Promise<void>;
  leaveCouple(userId: string): Promise<void>;
}
```

### habits-store.ts
```typescript
interface HabitsState {
  habits: Habit[];
  completions: Map<string, Completion[]>; // habitId → completions
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchHabits(coupleId: string): Promise<void>;
  createHabit(habit: CreateHabitDTO): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<void>;
  deleteHabit(id: string): Promise<void>;
  toggleCompletion(habitId: string, userId: string, date: string): Promise<void>;
  getSharedCompletions(habitId: string, partnerAId: string, partnerBId: string): SharedCompletion[];
  getUserCompletions(habitId: string, userId: string): Completion[];
}
```

## 7. Implementation Priority

### Phase 1: Foundation
| Task | Files | Dependencies |
|------|-------|--------------|
| Update database types | `src/shared/types/database.ts` | - |
| Rename stores to kebab | `src/stores/*-store.ts` | - |
| Create supabase client | `src/shared/lib/supabase.ts` | - |

### Phase 2: Auth
| Task | Files | Dependencies |
|------|-------|--------------|
| Create auth screens | `app/auth/*.tsx` | AuthStore |
| Create auth forms | `src/features/auth/components/*.tsx` | AuthStore, Button, TextInput |
| Add auth hooks | `src/features/auth/hooks/use-auth.ts` | AuthStore |

### Phase 3: Couple
| Task | Files | Dependencies |
|------|-------|--------------|
| Create couple screens | `app/couple/*.tsx` | CoupleStore |
| Create couple forms | `src/features/couple/components/*.tsx` | CoupleStore |
| Handle deep link | `app/couple/invite.tsx` | CoupleStore |

### Phase 4: Habits
| Task | Files | Dependencies |
|------|-------|--------------|
| Create habit screens | `app/(tabs)/habits.tsx`, `app/habit/[id].tsx` | HabitsStore |
| Create habit components | `src/features/habits/components/*.tsx` | HabitsStore |
| Create grid components | `src/shared/components/activity-grid.tsx`, etc. | HabitsStore |

### Phase 5: Polish
| Task | Files | Dependencies |
|------|-------|--------------|
| Real-time subscriptions | `src/stores/*-store.ts` | Supabase Realtime |
| Error handling | All screens | - |
| Loading states | All screens | LoadingSpinner |
| Empty states | All lists | EmptyState |

## 8. Grid Color Logic Reference

| Status | Visual | Colors | When |
|--------|--------|--------|-------|
| `both` | Diagonal split | Green top-left, Purple bottom-right | Both partners completed |
| `mine-only` | Solid | Green (#34C759) | Only current user completed |
| `partner-only` | Solid | Purple (#AF52DE) | Only partner completed |
| `neither` | Solid | Gray (#E5E5EA) | Neither completed |
| `future` | Solid | Light Gray (#F2F2F7) | Future dates (disabled) |
| `non-target` | Transparent | Background only | Not a target day |

## 9. API Integration Points

### Supabase Tables
- `users` - Profile data linked to auth.users
- `couples` - Partnership between two users
- `habits` - Habit definitions per couple
- `completions` - Daily completion records
- `invitations` - Invite tokens and status

### Realtime Channels
- `completions` - INSERT, DELETE triggers grid update
- `couples` - UPDATE for partner joining

### Row Level Security
- Users can only read/write their own data
- Couple members can read all couple data
- Invitations can be accepted by matching email