# SDD Proposal: Together Habit Tracking

## 1. Summary

A minimalist iOS habit tracking app for couples that helps partners build better habits together through shared accountability, beautiful Apple HIG-compliant UI, and real-time synchronization via Supabase.

## 2. Motivation

Building habits is hard alone. Couples who hold each other accountable are 30% more likely to succeed. This app transforms accountability into a visual, gamified experience where both partners can see their shared progress on a beautiful activity grid. The diagonal split visualization creates a sense of joint accomplishment while respecting individual privacy through separate views.

**Why couples care:**
- Visible proof of mutual commitment
- Gentle pressure without nagging
- Celebrating together when both succeed
- Understanding each other's patterns

## 3. Scope

### In Scope

**Authentication**
- Email/password sign up with display name
- Email/password sign in
- Password reset via email
- Session persistence with AsyncStorage

**Couple Management**
- Create new couple partnership
- Invite partner via email with unique token
- Accept invitation (uses token from deep link)
- Decline invitation
- View partner's display name and role
- Leave couple (soft delete, can rejoin)

**Habit Management**
- Create habit with name, color, icon, frequency
- Weekly habits with target days and count (e.g., "Exercise 4x/week")
- Mark habits as complete for the day
- Toggle completion on/off
- View own habits and partner's habits
- Soft delete habits (archive)

**Shared Activity Grid**
- 12-month view of completion history
- Diagonal split when both complete (green/purple)
- Solid color when only one completes (respects inverse logic)
- Gray for neither complete
- Day labels (M T W T F S S)
- Month labels
- Legend explaining color logic

**Individual View**
- Personal grid with red for completed days
- Gray for non-completed
- Shows own history only

**UI/UX**
- Apple HIG compliance
- SF Pro typography (system font)
- Minimalist design with ample white space
- 44pt minimum touch targets
- Background: #F2F2F7, Surface: #FFFFFF

### Out of Scope (Non-Goals)

- Social features beyond couple partnership
- Public profiles or leaderboards
- Notifications/reminders (future)
- Widgets for iOS home screen (future)
- Android-specific UI adaptations
- Web platform optimization
- Offline-first with conflict resolution
- Analytics or insights dashboard
- Multiple couple memberships per user

## 4. User Stories

### Authentication
```
AS A new user
I WANT TO create an account with email and password
SO THAT I can start tracking habits with my partner

ACCEPTANCE:
- [ ] Sign up with email, password, and display name
- [ ] Receive confirmation email (optional for MVP)
- [ ] Redirected to create/join couple screen
- [ ] Session persists across app restarts
```

```
AS A returning user
I WANT TO sign in with my credentials
SO THAT I can access my habit data

ACCEPTANCE:
- [ ] Sign in with email and password
- [ ] Redirected to main app if in couple
- [ ] Redirected to couple setup if not in couple
- [ ] Show error for invalid credentials
```

### Couple Management
```
AS A new user
I WANT TO create a couple partnership
SO THAT I can invite my partner

ACCEPTANCE:
- [ ] Enter couple name (e.g., "Smith Family")
- [ ] Become Partner A automatically
- [ ] Get invitation token to share
- [ ] See pending invitations status
```

```
AS A user with a couple
I WANT TO invite my partner via email
SO THAT they can join our tracking

ACCEPTANCE:
- [ ] Enter partner's email address
- [ ] Generate unique invitation link
- [ ] Copy link to share manually
- [ ] See invitation status (pending/accepted/declined)
```

```
AS A partner receiving invitation
I WANT TO accept and join the couple
SO THAT we can start tracking together

ACCEPTANCE:
- [ ] Open invitation link (deep link)
- [ ] See inviter's name and couple name
- [ ] Accept to become Partner B
- [ ] Redirected to main app
```

### Habit Tracking
```
AS A user
I WANT TO create a weekly habit
SO THAT my partner and I can track it together

ACCEPTANCE:
- [ ] Enter habit name (e.g., "Exercise")
- [ ] Select target days (e.g., Mon, Wed, Fri, Sun)
- [ ] Set weekly goal count (e.g., "4 times per week")
- [ ] Choose color (green/purple/other)
- [ ] Choose icon (emoji or SF Symbol)
```

```
AS A user
I WANT TO mark today's habit complete
SO THAT my partner sees our progress

ACCEPTANCE:
- [ ] Tap on today's habit in the list
- [ ] Completion recorded with timestamp
- [ ] Grid updates in real-time
- [ ] Partner B's non-completion shown as solid color
```

```
AS A user
I WANT TO see our shared activity grid
SO THAT we can visualize our progress

ACCEPTANCE:
- [ ] View 12-month grid for selected habit
- [ ] See diagonal split for mutual completion
- [ ] See solid colors for single completion
- [ ] See gray for no completions
- [ ] Understand legend
```

### Individual View
```
AS A user
I WANT TO see my personal completion history
SO THAT I can track my own progress

ACCEPTANCE:
- [ ] View grid with red for my completions
- [ ] See gray for my non-completions
- [ ] This is private (partner doesn't see my grid)
```

## 5. Technical Considerations

### Expo Router Structure
```
app/
├── _layout.tsx                 # Root layout with providers
├── (tabs)/
│   ├── _layout.tsx             # Tab bar configuration
│   ├── index.tsx               # Home (habit list + grid)
│   ├── habits.tsx              # Manage habits
│   └── profile.tsx             # Profile + couple management
├── auth/
│   ├── _layout.tsx            # Auth layout
│   ├── login.tsx               # Sign in
│   ├── signup.tsx              # Sign up
│   └── reset-password.tsx      # Password reset
├── couple/
│   ├── create.tsx             # Create couple
│   └── invite.tsx              # Invite partner (deep link)
├── habit/
│   └── [id].tsx               # Habit detail + grid
└── modal/
    └── add-habit.tsx           # Add habit modal
```

### Supabase Schema (planned)
```sql
-- Users profile (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  couple_id UUID REFERENCES couples(id),
  role TEXT CHECK (role IN ('partner_a', 'partner_b')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Couple partnership
CREATE TABLE couples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  partner_a_id UUID REFERENCES users(id),
  partner_b_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habits
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#34C759',
  icon TEXT DEFAULT '✓',
  frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('daily', 'weekly', 'custom')),
  target_days TEXT[] DEFAULT '{}',
  target_count INT DEFAULT 4,
  created_by UUID REFERENCES users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Completions
CREATE TABLE completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES habits(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT true,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(habit_id, user_id, date)
);

-- Invitations
CREATE TABLE invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID REFERENCES couples(id) NOT NULL,
  inviter_id UUID REFERENCES users(id) NOT NULL,
  invitee_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### State Management
- Zustand for global state (auth, couple, habits)
- TanStack Query for server state
- React Query for caching and mutations

### Real-time Updates
- Supabase Realtime for completion sync
- Optimistic UI updates
- Conflict resolution: last write wins

### Design Tokens
```typescript
const Colors = {
  green: { primary: '#34C759', light: '#A8E6CF' },
  purple: { primary: '#AF52DE', light: '#D4A5E8' },
  red: { completion: '#FF3B30' },
  background: { primary: '#F2F2F7', surface: '#FFFFFF' },
};
```

## 6. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Deep link handling on iOS | High | Test with `expo-linking` and universal links |
| Real-time sync conflicts | Medium | Last-write-wins, show sync indicator |
| Supabase rate limits | Low | Implement request batching |
| Session expiration | Medium | Auto-refresh tokens, graceful re-auth |

## 7. Next Steps

1. **SDD Spec** → Detailed component specs, API endpoints, test scenarios
2. **SDD Design** → Component architecture, folder structure, data flow
3. **SDD Tasks** → Implementation tasks with estimates
4. **Implement** → Auth screens → Couple management → Habits → Grid