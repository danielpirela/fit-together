# Testing Setup — Together Habit Tracking

## Overview

Testing strategy for the Together Habit Tracking app, covering unit tests, component tests, and integration tests with Supabase mocking.

## Testing Stack

| Tool | Purpose |
|---|---|
| `jest` | Test runner and assertion library |
| `jest-expo` | Jest preset for Expo projects |
| `@testing-library/react-native` | Component testing |
| `@testing-library/jest-native` | Jest matchers for RN |
| `nock` or `msw` | HTTP mocking for API tests |
| `expo-crypto` | For testing crypto-dependent code |

## Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|zustand|@tanstack/react-query)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts'
  ]
};
```

```javascript
// jest.setup.js
import '@testing-library/jest-native/extend-expect';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
          data: [],
        })),
      })),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    channel: jest.fn(() => ({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn(),
    })),
  })),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  Stack: {
    Screen: () => null,
  },
}));
```

## Test Categories

### 1. Unit Tests — Core Entities

Test domain logic without framework dependencies.

```typescript
// src/core/entities/__tests__/Habit.test.ts
describe('Habit Entity', () => {
  describe('completionRate', () => {
    it('calculates rate for 3 completions in 4 days', () => {
      const habit = createHabitWithCompletions(3, 4);
      expect(habit.completionRate).toBe(0.75);
    });

    it('returns 0 for no completions', () => {
      const habit = new Habit({ completions: [] });
      expect(habit.completionRate).toBe(0);
    });
  });

  describe('isCompletedOn', () => {
    it('returns true when date has completion', () => {
      const completion = new Date('2026-06-01');
      const habit = createHabitWithCompletion(completion);
      expect(habit.isCompletedOn(completion)).toBe(true);
    });

    it('returns false for date without completion', () => {
      const habit = new Habit({ completions: [] });
      const date = new Date('2026-06-01');
      expect(habit.isCompletedOn(date)).toBe(false);
    });
  });
});
```

### 2. Use Case Tests

```typescript
// src/core/use-cases/__tests__/ToggleCompletion.test.ts
describe('ToggleCompletion Use Case', () => {
  it('adds completion when none exists', async () => {
    const repo = mock<IHabitRepository>();
    repo.getById.mockResolvedValue(createHabit());
    repo.toggleCompletion.mockResolvedValue(mockCompletion);

    const useCase = new ToggleCompletion(repo);
    const result = await useCase.execute({ habitId: '123', date: new Date() });

    expect(result.ok).toBe(true);
    expect(result.value).toEqual(mockCompletion);
  });
});
```

### 3. Component Tests

```typescript
// src/shared/components/__tests__/Button.test.tsx
describe('Button Component', () => {
  it('renders with label', () => {
    render(<Button>Save Habit</Button>);
    expect(screen.getByText('Save Habit')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Press Me</Button>);
    fireEvent.press(screen.getByText('Press Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Saving...</Button>);
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
  });

  it('is disabled when loading', () => {
    const onPress = jest.fn();
    render(<Button loading onPress={onPress}>Save</Button>);
    fireEvent.press(screen.getByText('Save'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

### 4. Hook Tests

```typescript
// src/features/habits/hooks/__tests__/useHabits.test.ts
describe('useHabits Hook', () => {
  it('fetches habits on mount', async () => {
    const { result } = renderHook(() => useHabits());
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.habits).toHaveLength(3);
  });

  it('toggles completion', async () => {
    const { result } = renderHook(() => useHabits());
    
    await waitFor(() => !result.current.isLoading);
    
    await act(async () => {
      await result.current.toggleCompletion('habit-1', new Date());
    });
    
    expect(mockSupabase.from).toHaveBeenCalledWith('completions');
  });
});
```

### 5. Integration Tests (with Supabase mocking)

```typescript
// src/features/auth/__tests__/AuthScreen.test.tsx
describe('Auth Screen Integration', () => {
  it('logs in successfully with valid credentials', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: mockUser },
      error: null,
    });

    render(<AuthScreen />);
    
    fireEvent.changeText(screen.getByLabelText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'password123');
    fireEvent.press(screen.getByText('Sign In'));
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/home');
    });
  });

  it('shows error on invalid credentials', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null },
      error: { message: 'Invalid login credentials' },
    });

    render(<AuthScreen />);
    
    // ... trigger login ...
    
    await waitFor(() => {
      expect(screen.getByText('Invalid login credentials')).toBeTruthy();
    });
  });
});
```

## Running Tests

```bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Specific file
npm test -- src/core/entities/Habit.test.ts

# Specific pattern
npm test -- --testNamePattern="completion"
```

## Coverage Targets

| Type | Target |
|---|---|
| Entities | 100% |
| Use Cases | 100% |
| Shared Components | 80% |
| Feature Components | 70% |
| Hooks | 80% |

## CI Configuration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info
```

## Mock Patterns

### Supabase Mock

```typescript
// __mocks__/@supabase/supabase-js.ts
const mockSupabaseClient = {
  auth: {
    getSession: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: [],
        error: null,
      })),
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
  })),
  channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  })),
};

export const createClient = jest.fn(() => mockSupabaseClient);
export { mockSupabaseClient };
```

### Real-time Mock

```typescript
it('subscribes to partner completions', () => {
  const channel = mockSupabase.channel('completions');
  
  render(<CompletionsFeed />);
  
  expect(mockSupabase.channel).toHaveBeenCalledWith('completions');
  expect(channel.on).toHaveBeenCalledWith(
    'postgres_changes',
    expect.objectContaining({ table: 'completions' }),
    expect.any(Function)
  );
});
```

## Test Data Factories

```typescript
// tests/factories.ts
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 'user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    coupleId: 'couple-123',
    ...overrides,
  };
}

export function createMockHabit(overrides?: Partial<Habit>): Habit {
  return {
    id: 'habit-456',
    title: 'Morning Run',
    coupleId: 'couple-123',
    schedule: 'daily',
    createdAt: new Date(),
    ...overrides,
  };
}

export function createMockCompletion(overrides?: Partial<Completion>): Completion {
  return {
    id: 'completion-789',
    habitId: 'habit-456',
    userId: 'user-123',
    completedAt: new Date(),
    ...overrides,
  };
}
```

## Debugging Tests

```bash
# Run with verbose output
npm test -- --verbose

# Inspect coverage
open coverage/lcov-report/index.html

# Debug specific test
npm test -- --inspect-brk --testNamePattern="habit"
```