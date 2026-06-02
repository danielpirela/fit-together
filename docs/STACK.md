# Tech Stack — Together Habit Tracking

## Framework & Language

| Component | Choice | Version |
|---|---|---|
| **Mobile Framework** | React Native (Expo managed) | Latest |
| **Language** | TypeScript | 5.x |
| **Package Manager** | npm | — |

## Core Libraries

| Library | Purpose | Notes |
|---|---|---|
| `expo` | Core framework | Expo SDK latest |
| `expo-router` | File-based navigation | Recommended by Expo |
| `@react-navigation/native` | Navigation (if not using expo-router) | — |
| `nativewind` | Tailwind CSS for React Native | v5 for Expo |
| `tailwindcss` | Styling | v4 |
| `react-native-css` | CSS support for Expo | Required for NativeWind |

## State Management

| Library | Purpose | Notes |
|---|---|---|
| `zustand` | Lightweight global state | For app-wide state |
| `@tanstack/react-query` | Server state / data fetching | Preferred over SWR |
| `jotai` | Atomic state (optional) | For complex local state |

## Backend (Supabase)

| Product | Usage |
|---|---|
| **Supabase Auth** | Email/password authentication, magic links |
| **Supabase Database** | PostgreSQL — users, couples, habits, completions tables |
| **Supabase Realtime** | Live sync of completion status between partners |

### Supabase Client

```typescript
// src/shared/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## Environment Variables

```bash
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Testing

| Tool | Purpose |
|---|---|
| `jest` | Unit testing |
| `@testing-library/react-native` | Component testing |
| `expo-crypto` | Testing crypto functions |

### Test Configuration

```json
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ]
};
```

## Development Environment

- **Editor:** VS Code with Expo extension
- **iOS Simulator:** Required for iOS development
- **EAS CLI:** For building production APKs/IPAs

## Project Structure (Target)

```
fit-together/
├── src/
│   ├── core/
│   │   ├── entities/           # Domain models (Habit, User, Couple)
│   │   ├── repositories/       # Repository interfaces
│   │   └── use-cases/          # Business logic
│   ├── features/
│   │   ├── auth/               # Login, register, magic link
│   │   ├── habits/             # Habit CRUD, completion tracking
│   │   ├── couple/             # Partner linking, invitations
│   │   └── settings/           # App settings
│   └── shared/
│       ├── components/         # Reusable UI (Button, Card, Input)
│       ├── hooks/              # Custom React hooks
│       ├── lib/                # Supabase client, utilities
│       ├── types/              # Shared TypeScript types
│       └── constants/          # Design tokens, config
├── docs/
│   └── STACK.md                # This file
├── supabase/
│   └── migrations/             # Database migrations
└── app/                        # Expo Router pages (if using)
```

## Key Dependencies (Target)

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "@supabase/supabase-js": "^2.45.0",
    "@tanstack/react-query": "^5.51.0",
    "zustand": "^4.5.0",
    "nativewind": "^4.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

## API Design (Supabase RPC)

### Habits

```sql
-- Get habits for a couple
create or replace function get_couple_habits(couple_id uuid)
returns setof habits as $$
  select * from habits where couple_id = $1 order by created_at;
$$ language sql security definer;

-- Toggle habit completion
create or replace function toggle_habit_completion(
  habit_id uuid,
  completion_date date
) returns completions as $$
  -- Insert or delete based on existence
$$;
```

## Realtime Subscriptions

```typescript
// Subscribe to partner's completions
supabase
  .channel('completions')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'completions',
    filter: `couple_id=eq.${coupleId}`
  }, handlePartnerCompletion)
  .subscribe();
```