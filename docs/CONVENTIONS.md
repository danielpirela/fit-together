# Conventions — Together Habit Tracking

## Overview

This document defines the development conventions for the Together Habit Tracking project. These ensure consistency across the codebase and enable smooth collaboration.

## Architecture

### Clean Architecture

Follow strict layer separation:

```
src/core/         → Entities, repository interfaces, use cases (no framework deps)
src/features/     → Feature modules (auth, habits, couple, settings)
src/shared/      → UI components, hooks, utilities, types
```

**Rule:** Core layer must not import from Features or Shared. Shared can import from Core.

### Module Structure

Each feature follows this pattern:

```
features/<feature>/
├── entities/          # Feature-specific domain models
├── repositories/     # Feature repository interfaces
├── use-cases/        # Business logic
├── screens/          # Expo Router screens (or app/ folder)
├── components/       # Feature-specific UI components
├── hooks/            # Feature-specific hooks
└── store/            # Zustand store (if needed)
```

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `HabitCard.tsx` |
| Screens | PascalCase | `HomeScreen.tsx` |
| Hooks | camelCase with `use` prefix | `useHabitCompletion.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_HABITS_PER_DAY` |
| Types/Interfaces | PascalCase | `HabitCompletion` |
| CSS Classes | kebab-case (Tailwind) | `bg-primary-green` |

## TypeScript Standards

### Type Definitions

```typescript
// Prefer interfaces for object shapes
interface User {
  id: string;
  email: string;
  displayName: string;
}

// Use type for unions and computed types
type HabitStatus = 'active' | 'paused' | 'archived';

// Enums for fixed sets
enum CompletionStatus {
  Pending = 'pending',
  Completed = 'completed',
  Missed = 'missed'
}
```

### Null Handling

```typescript
// Prefer optional chaining and nullish coalescing
const displayName = user?.profile?.displayName ?? 'Anonymous';

// Use type guards for API responses
function isUser(data: unknown): data is User {
  return typeof data === 'object' && data !== null && 'id' in data;
}
```

## Styling (Tailwind CSS + NativeWind)

### Design Tokens

Define in `src/shared/constants/design.ts`:

```typescript
export const colors = {
  primary: {
    green: '#34C759',    // Partner / completion
    purple: '#AF52DE',    // User / accent
  },
  semantic: {
    red: '#FF3B30',       // Individual completion indicator
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
  },
  neutral: {
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    secondaryText: '#8E8E93',
  }
};
```

### Component Styling

```typescript
// Use utility classes, grouped logically
<View className="flex-1 bg-neutral-background p-4">
  <Text className="text-lg font-semibold text-neutral-text">
    {title}
  </Text>
</View>

// Avoid inline styles unless dynamic values required
const dynamicStyle = computedStyle({ opacity: animatedValue });
<Animated.View style={dynamicStyle} />
```

## Supabase Conventions

### Table Naming

- Tables: `snake_case` plural (e.g., `habits`, `completions`)
- Columns: `snake_case` (e.g., `couple_id`, `created_at`)
- Primary keys: `id` (UUID)
- Timestamps: `created_at`, `updated_at` (UTC)

### Row Level Security (RLS)

All tables must have RLS enabled with policies for:
- Users can only read/write their own data
- Couple members can read shared couple data

### Migration Files

```
supabase/migrations/
├── 001_initial_schema.sql
├── 002_add_couple_invitations.sql
└── 003_add_realtime.sql
```

## Git Workflow

### Branch Naming

```
feat/<ticket>/<short-description>
fix/<ticket>/<short-description>
chore/<ticket>/<short-description>
```

Example: `feat/HAB-42/add-habit-completion-animation`

### Commit Messages

Follow conventional commits:

```
feat(auth): add magic link authentication
fix(habits): resolve completion toggle race condition
chore(deps): update supabase-js to v2.45.0
docs(readme): add setup instructions
```

### Pull Requests

- Title: `[HAB-42] Add habit completion animation`
- Description: Summary, testing steps, screenshots
- Size: Keep under 400 lines for focused review

## Testing

### Unit Tests

```typescript
// src/core/entities/__tests__/Habit.test.ts
describe('Habit Entity', () => {
  it('should calculate completion rate correctly', () => {
    const habit = new Habit({ ... });
    expect(habit.completionRate).toBe(0.75);
  });
});
```

### Component Tests

```typescript
// src/shared/components/__tests__/Button.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

it('calls onPress when pressed', () => {
  const onPress = jest.fn();
  const { getByText } = render(<Button onPress={onPress}>Save</Button>);
  fireEvent.press(getByText('Save'));
  expect(onPress).toHaveBeenCalled();
});
```

### Test File Location

- Co-located with source: `Habit.tsx` → `Habit.test.tsx`
- Shared components: `src/shared/components/__tests__/`
- Use cases: `src/core/use-cases/__tests__/`

## Accessibility

- All interactive elements have `accessibilityLabel`
- Minimum touch target: 44x44 points
- Color contrast: WCAG AA compliant
- Support Dynamic Type scaling

## Error Handling

```typescript
// Consistent error handling pattern
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

async function fetchHabits(): Promise<Result<Habit[]>> {
  try {
    const { data, error } = await supabase.from('habits').select();
    if (error) return { ok: false, error };
    return { ok: true, value: data };
  } catch (e) {
    return { ok: false, error: new Error('Network error') };
  }
}
```

## Performance

- Use `FlatList` with proper `keyExtractor` for all lists
- Implement `getItemLayout` for fixed-height items
- Memoize expensive computations with `useMemo`
- Use `useCallback` for event handlers passed to children
- Lazy load screens with `expo-router` file-based routing

## File Organization

```
src/
├── core/
│   ├── entities/
│   │   ├── Habit.ts
│   │   ├── User.ts
│   │   └── Couple.ts
│   ├── repositories/
│   │   ├── IHabitRepository.ts
│   │   └── IUserRepository.ts
│   └── use-cases/
│       ├── CreateHabit.ts
│       ├── ToggleCompletion.ts
│       └── GetCoupleHabits.ts
├── features/
│   └── habits/
│       ├── screens/
│       │   └── HabitsScreen.tsx
│       ├── components/
│       │   ├── HabitCard.tsx
│       │   └── CompletionButton.tsx
│       └── hooks/
│           └── useHabits.ts
└── shared/
    ├── components/
    │   ├── Button.tsx
    │   ├── Card.tsx
    │   └── Input.tsx
    ├── hooks/
    │   ├── useAuth.ts
    │   └── useSupabase.ts
    ├── lib/
    │   └── supabase.ts
    ├── types/
    │   └── index.ts
    └── constants/
        └── design.ts
```

## Linting & Formatting

- Use ESLint with TypeScript support
- Prettier for code formatting
- Run both in pre-commit hook

```json
// .eslintrc.json
{
  "extends": ["@react-native", "prettier"],
  "rules": {
    "no-unused-vars": "error"
  }
}
```