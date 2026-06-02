# Together Habit Tracking — SDD Specification

## 1. Overview

This specification defines the complete implementation contract for the Together Habit Tracking app. Every requirement is written as verifiable behavior. No implementation details are prescribed—only the observable outcomes the system MUST produce.

---

## 2. Component Inventory

### 2.1 Button

**Description**: Primary interactive element for all user actions.

**Props**:
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string; // SF Symbol name or emoji
  fullWidth?: boolean;
}
```

**States**:
| State | Visual Treatment |
|-------|------------------|
| Default | Background: variant color; Text: white or variant color |
| Hover/Focus | Opacity: 0.8 (press feedback via opacity) |
| Pressed | Opacity: 0.6; Scale: 0.98 |
| Disabled | Opacity: 0.4; Interaction: none |
| Loading | Spinner replaces icon; Text preserved; Interaction: none |

**Variants**:
- `primary`: Green (#34C759) background, white text
- `secondary`: White background, gray border, dark text
- `destructive`: Red (#FF3B30) background, white text
- `ghost`: Transparent background, green text

**Size Specifications**:
- `small`: Height 32px, padding 12px horizontal, font 14px
- `medium`: Height 44px (minimum touch target), padding 16px horizontal, font 16px
- `large`: Height 52px, padding 20px horizontal, font 17px

---

### 2.2 TextInput

**Description**: Single-line text input for forms.

**Props**:
```typescript
interface TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helper?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  editable?: boolean;
  maxLength?: number;
}
```

**States**:
| State | Visual Treatment |
|-------|------------------|
| Default | Border: #E5E5EA; Background: white |
| Focused | Border: #34C759 (2px) |
| Error | Border: #FF3B30 (2px); Error message below in red |
| Disabled | Background: #F2F2F7; Text: #8E8E93 |
| Filled | Standard border; content visible |

**Dimensions**: Height 44px; border-radius 10px; padding 12px horizontal; font 16px.

---

### 2.3 HabitCard

**Description**: Displays a habit in the list with today's completion status.

**Props**:
```typescript
interface HabitCardProps {
  habit: Habit;
  todayCompletion?: Completion;
  partnerCompletion?: Completion;
  onToggle: () => void;
  onPress: () => void;
}
```

**States**:
| State | Visual Treatment |
|-------|------------------|
| Default (incomplete) | White background; icon in neutral gray; circle outline |
| Completed by me | White background; green (#34C759) checkmark; filled circle |
| Completed by both | White background; diagonal split circle (green/purple); checkmark |
| Completed by partner only | White background; purple (#AF52DE) circle; partner's checkmark |

**Layout**:
```
┌────────────────────────────────────────────┐
│ [Icon] Habit Name                    [○/✓] │
│        3/4 times this week                 │
└────────────────────────────────────────────┘
```
- Height: 72px
- Padding: 16px
- Border-radius: 12px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)

---

### 2.4 ActivityGrid

**Description**: 12-month calendar grid showing completion history.

**Props**:
```typescript
interface ActivityGridProps {
  habitId: string;
  completions: Record<string, { mine: boolean; partner: boolean }>;
  viewMode: 'couple' | 'personal';
}
```

**Color Logic**:
| Scenario | Color | Hex |
|----------|-------|-----|
| Both completed | Diagonal split (top-left green, bottom-right purple) | #34C759 / #AF52DE |
| Only I completed | Solid green | #34C759 |
| Only partner completed | Solid purple | #AF52DE |
| Neither completed | Light gray | #E5E5EA |
| Future dates | Disabled, very light gray | #F2F2F7 |
| Non-target day | Transparent (shows background) | - |

**Grid Structure**:
```
      Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
  M   [■]  [■]  [□]  [■]  ...
  T   [□]  [■]  [■]  [□]  ...
  W   [■]  [□]  [■]  [■]  ...
  T   [□]  [■]  [□]  [□]  ...
  F   [■]  [■]  [■]  [■]  ...
  S   [□]  [□]  [■]  [□]  ...
  S   [□]  [□]  [□]  [□]  ...
```

**Cell Size**: 12px × 12px; Gap: 3px; Each row is a day of week.

---

### 2.5 GridLegend

**Description**: Explains the color coding for the activity grid.

**Layout**:
```
┌─────────────────────────────────────┐
│  ■ Both   ■ You   ■ Partner   □ None│
│ (green)  (purple) (gray)            │
└─────────────────────────────────────┘
```

**Implementation**:
- Horizontal flex container
- Each item: 12px color swatch + label
- Font: 12px, color: #8E8E93

---

### 2.6 CompletionToggle

**Description**: Circular button to mark habit complete for today.

**Props**:
```typescript
interface CompletionToggleProps {
  completed: boolean;
  partnerCompleted: boolean;
  onToggle: () => void;
  disabled?: boolean;
}
```

**States**:
| State | Visual |
|-------|--------|
| Neither complete | Empty circle outline, gray |
| I completed | Green filled circle with white checkmark |
| Partner completed | Purple filled circle with white checkmark |
| Both completed | Diagonal split (green/purple) with checkmark |
| Disabled | Opacity 0.4 |

**Size**: 44px diameter (minimum touch target)

---

### 2.7 DaySelector

**Description**: Weekday selector for habit frequency.

**Props**:
```typescript
interface DaySelectorProps {
  selectedDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  onChange: (days: number[]) => void;
  disabled?: boolean;
}
```

**Layout**: 7 circular buttons in a row labeled S M T W T F S.

**States**:
| State | Visual |
|-------|--------|
| Unselected | Light gray background, dark text |
| Selected | Green (#34C759) background, white text |

**Size**: 40px diameter each; gap 8px

---

### 2.8 ColorPicker

**Description**: Select habit color from predefined options.

**Props**:
```typescript
interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}
```

**Options**: Green (#34C759), Purple (#AF52DE), Blue (#007AFF), Orange (#FF9500), Red (#FF3B30), Teal (#5AC8FA)

**Layout**: 6 circular swatches in a 3×2 grid or horizontal row.

**States**:
| State | Visual |
|-------|--------|
| Unselected | Circle with color, white border |
| Selected | Circle with color, white border, checkmark overlay, scale 1.1 |

**Size**: 44px diameter (minimum touch target)

---

### 2.9 IconPicker

**Description**: Select habit icon from emoji or SF Symbols.

**Props**:
```typescript
interface IconPickerProps {
  selectedIcon: string;
  onChange: (icon: string) => void;
}
```

**Default Options**: ✓, 💪, 🏃, 📚, 💧, 🧘, 😴, 🍎, 💊, 🎯

**Layout**: 10 circular buttons in a 5×2 grid.

**States**:
| State | Visual |
|-------|--------|
| Unselected | Light gray background, emoji centered |
| Selected | Green border (2px), emoji centered |

**Size**: 44px diameter (minimum touch target)

---

### 2.10 InvitationCard

**Description**: Displays pending invitation status.

**Props**:
```typescript
interface InvitationCardProps {
  invitation: Invitation;
  onResend?: () => void;
  onCopyLink?: () => void;
  onCancel?: () => void;
}
```

**Layout**:
```
┌────────────────────────────────────────────┐
│ To: partner@example.com                    │
│ Status: Pending                    [Copy]  │
│ Expires: Jan 15, 2025              [Cancel]│
└────────────────────────────────────────────┘
```

**Status Colors**: Pending (#FF9500), Accepted (#34C759), Declined (#FF3B30), Expired (#8E8E93)

---

### 2.11 PartnerBadge

**Description**: Shows partner information in profile.

**Props**:
```typescript
interface PartnerBadgeProps {
  partner: User;
  role: 'partner_a' | 'partner_b';
  onRemove?: () => void;
}
```

**Layout**:
```
┌────────────────────────────────────────────┐
│ [Avatar] Partner Name                      │
│          Partner A                         │
└────────────────────────────────────────────┘
```

**Avatar**: 48px circle with initials; background color based on role (green for A, purple for B).

---

### 2.12 LoadingSpinner

**Description**: Full-screen or inline loading indicator.

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}
```

**Visual**: Native ActivityIndicator; size small (20px) or large (36px); color white or #34C759.

---

### 2.13 EmptyState

**Description**: Shown when lists have no content.

**Props**:
```typescript
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: {
    title: string;
    onPress: () => void;
  };
}
```

**Layout**: Centered content; icon (64px) above title (20px bold) and description (16px gray).

---

### 2.14 FormField

**Description**: Wrapper combining label, input, error, and helper text.

**Props**:
```typescript
interface FormFieldProps {
  label: string;
  error?: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}
```

**Layout**: Label above input; error below input in red; helper below in gray.

---

## 3. Screen Specifications

### 3.1 Login Screen (`/auth/login`)

**Purpose**: Authenticate existing users.

**Layout**:
```
┌────────────────────────────────────────────┐
│                                            │
│              [App Logo]                    │
│         Together Habits                    │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Email                                 │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ Password                        [👁] │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [      Sign In       ]                    │
│                                            │
│  Forgot Password?                          │
│                                            │
│  Don't have an account? Sign Up            │
│                                            │
└────────────────────────────────────────────┘
```

**Navigation**:
- "Sign Up" → `/auth/signup`
- "Forgot Password?" → `/auth/reset-password`
- Success → `/` (tabs) if in couple, or `/couple/create` if not

**Data Requirements**:
- Email input (required, validated)
- Password input (required, min 8 chars)

**Error States**:
| Error | Display |
|-------|---------|
| Invalid email format | "Please enter a valid email address" |
| Wrong password | "Incorrect password. Please try again." |
| User not found | "No account found with this email" |
| Network error | "Unable to connect. Please check your internet connection." |
| Too many attempts | "Too many attempts. Please try again in X minutes." |

---

### 3.2 Sign Up Screen (`/auth/signup`)

**Purpose**: Register new user account.

**Layout**:
```
┌────────────────────────────────────────────┐
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Display Name                         │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ Email                                 │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ Password                             │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ Confirm Password                      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [      Create Account      ]              │
│                                            │
│  Already have an account? Sign In          │
│                                            │
└────────────────────────────────────────────┘
```

**Validation**:
- Display name: required, 2-50 characters
- Email: required, valid format, unique
- Password: required, min 8 characters, 1 uppercase, 1 number
- Confirm password: must match

**Error States**:
| Error | Display |
|-------|---------|
| Email already exists | "An account with this email already exists" |
| Password too weak | "Password must be at least 8 characters with 1 uppercase and 1 number" |
| Passwords don't match | "Passwords do not match" |

**Success Flow**: Creates user → Auto-signs in → Redirects to `/couple/create`

---

### 3.3 Reset Password Screen (`/auth/reset-password`)

**Purpose**: Send password reset email.

**Layout**:
```
┌────────────────────────────────────────────┐
│                                            │
│  Reset Password                            │
│                                            │
│  Enter your email and we'll send you       │
│  instructions to reset your password.       │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Email                                 │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [     Send Reset Email     ]               │
│                                            │
│  Remember your password? Sign In           │
│                                            │
└────────────────────────────────────────────┘
```

**Success State**: Show "Check your email for reset instructions" with "Back to Sign In" link.

---

### 3.4 Create Couple Screen (`/couple/create`)

**Purpose**: Create new couple partnership.

**Layout**:
```
┌────────────────────────────────────────────┐
│  Create Your Couple                        │
│                                            │
│  Give your partnership a name              │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Couple Name (e.g., Smith Family)      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  You'll be Partner A. After creating,      │
│  invite your partner to join.              │
│                                            │
│  [      Create Couple      ]                │
│                                            │
└────────────────────────────────────────────┘
```

**Validation**:
- Couple name: required, 2-100 characters

**Success Flow**: Creates couple → Redirects to `/profile` with invitation panel visible.

---

### 3.5 Invite Partner Screen (`/couple/invite`)

**Purpose**: Invite partner via email link.

**Layout**:
```
┌────────────────────────────────────────────┐
│  Invite Your Partner                       │
│                                            │
│  Enter your partner's email to send        │
│  an invitation.                            │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Partner's Email                       │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [     Send Invitation     ]                │
│                                            │
│  ─────────── OR ───────────                │
│                                            │
│  Share Link Directly                       │
│  [      Copy Invitation Link    ]          │
│                                            │
└────────────────────────────────────────────┘
```

**Deep Link Format**: `togetherhabits://invite/{token}` or `https://togetherhabits.app/invite/{token}`

**Success States**:
- Email sent: "Invitation sent to partner@email.com"
- Link copied: "Link copied! Share it with your partner"

---

### 3.6 Accept Invitation Screen (`/invite/[token]`)

**Purpose**: View and accept/decline couple invitation.

**Layout**:
```
┌────────────────────────────────────────────┐
│                                            │
│  [Avatar]                                  │
│  [Partner Name] invited you to join        │
│  [Couple Name]                             │
│                                            │
│  You'll become Partner B in this couple.   │
│                                            │
│  [     Accept Invitation     ]              │
│  [     Decline     ]                        │
│                                            │
└────────────────────────────────────────────┘
```

**States**:
| Status | Display |
|--------|---------|
| Valid pending | Full screen with accept/decline |
| Already accepted | "This invitation has already been accepted" |
| Expired | "This invitation has expired" |
| Invalid | "Invalid invitation" |
| Already in couple | "You're already in a couple" |

**Success Flow (Accept)**: Updates invitation → Updates user role → Redirects to `/`

---

### 3.7 Home Screen (`/(tabs)`)

**Purpose**: Main screen showing today's habits and quick access to grid.

**Layout**:
```
┌────────────────────────────────────────────┐
│  Today                          June 2     │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ [✓] Morning Run        [split circle]│  │
│  │     3/4 times this week              │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ [📚] Read 30 min    [purple circle]   │  │
│  │     2/4 times this week              │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ [💧] Drink 8 glasses   [○ empty]     │  │
│  │     5/7 times this week              │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [      Add Habit     ]                    │
│                                            │
└────────────────────────────────────────────┘
```

**Data Requirements**:
- Today's date
- All active habits for the user's couple
- Today's completion status for each habit (mine and partner's)
- Weekly progress (completed/target count)

**Empty State**: "No habits yet. Start building better habits together!" with "Create First Habit" button.

---

### 3.8 Habit Detail Screen (`/habit/[id]`)

**Purpose**: Full habit details with 12-month activity grid.

**Layout**:
```
┌────────────────────────────────────────────┐
│ [Back]     Morning Run           [Edit]    │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │     [  12-Month Activity Grid  ]      │  │
│  │                                      │  │
│  │      Jan Feb Mar Apr May Jun ...     │  │
│  │  M   ■  □  ■  ■  □  ■  ...           │  │
│  │  T   □  ■  □  ■  ■  □  ...           │  │
│  │  W   ■  □  ■  □  ■  ■  ...           │  │
│  │  T   □  ■  □  ■  □  ■  ...           │  │
│  │  F   ■  □  ■  ■  ■  ■  ...           │  │
│  │  S   □  □  ■  □  □  □  ...           │  │
│  │  S   □  □  □  □  □  □  ...           │  │
│  │                                      │  │
│  │  ■ Both  ■ You  ■ Partner  □ None   │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [   My View   ] [  Couple View  ]         │
│                                            │
│  This Week: 3/4 completed                  │
│  This Month: 12/16 completed               │
│                                            │
└────────────────────────────────────────────┘
```

**View Mode Toggle**:
- `My View`: Shows only your completions (green/red/gray)
- `Couple View`: Shows both completions with diagonal split

**Data Requirements**:
- Habit details (name, color, icon, frequency)
- All completions for past 12 months
- Partner completions for same period

---

### 3.9 Add/Edit Habit Modal (`/modal/add-habit`)

**Purpose**: Create or edit a habit.

**Layout**:
```
┌────────────────────────────────────────────┐
│  [X]      Add Habit                        │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ Habit Name                            │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Target Days                               │
│  [S] [M] [T] [W] [T] [F] [S]             │
│                                            │
│  Weekly Goal                               │
│  ┌──────────────────────────────────────┐  │
│  │ 4 times per week                      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Color                                     │
│  [●] [●] [●] [●] [●] [●]                 │
│                                            │
│  Icon                                      │
│  [✓] [💪] [🏃] [📚] [💧]                │
│  [🧘] [😴] [🍎] [💊] [🎯]               │
│                                            │
│  [         Save Habit         ]            │
│                                            │
└────────────────────────────────────────────┘
```

**Validation**:
- Habit name: required, 1-100 characters
- Target days: at least 1 day required
- Weekly goal: 1 to selected days count

**Edit Mode Changes**:
- Title: "Edit Habit"
- "Save Habit" becomes "Update Habit"
- Add "Delete Habit" button (destructive, with confirmation)

---

### 3.10 Habits Management Screen (`/(tabs)/habits`)

**Purpose**: Manage all habits (active and archived).

**Layout**:
```
┌────────────────────────────────────────────┐
│  Habits                                    │
│                                            │
│  [ Active ] [ Archived ]                   │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ [✓] Morning Run           [→]         │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ [📚] Read 30 min           [→]         │  │
│  └──────────────────────────────────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │ [💧] Drink 8 glasses       [→]         │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [      Add Habit     ]                    │
│                                            │
└────────────────────────────────────────────┘
```

**Tab Behavior**:
- Active: Shows non-archived habits
- Archived: Shows archived (soft-deleted) habits

**Archived Item Actions**:
- Tap: Opens habit detail
- "Restore" button on each archived item

---

### 3.11 Profile Screen (`/(tabs)/profile`)

**Purpose**: User profile and couple management.

**Layout**:
```
┌────────────────────────────────────────────┐
│  Profile                                   │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ [Avatar]                             │  │
│  │ Your Name                            │  │
│  │ your@email.com                       │  │
│  │ Partner A in Smith Family            │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Partner                                   │
│  ┌──────────────────────────────────────┐  │
│  │ [Avatar] Partner Name                 │  │
│  │ Partner B                             │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Pending Invitations (1)                   │
│  ┌──────────────────────────────────────┐  │
│  │ To: partner@email.com                 │  │
│  │ Status: Pending              [Copy]   │  │
│  │                      [Cancel]         │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  [     Invite Partner     ]                 │
│                                            │
│  [     Leave Couple      ]                  │
│                                            │
│  [     Sign Out        ]                   │
│                                            │
└────────────────────────────────────────────┘
```

**Sections (shown conditionally)**:
- No couple: "Create Couple" button
- In couple without partner: Invitation panel + "Invite Partner"
- In couple with partner: Partner badge + "Leave Couple"

---

## 4. API Endpoints

### 4.1 Authentication

**Base URL**: Supabase Auth (managed)

#### POST /auth/signup

```typescript
// Request
interface SignUpRequest {
  email: string;
  password: string;
  options: {
    data: {
      display_name: string;
    };
  };
}

// Response 200
interface SignUpResponse {
  user: User;
  session: Session;
}

// Response 400
interface SignUpError {
  error: string;
  message: string;
}
```

#### POST /auth/login

```typescript
// Request
interface LoginRequest {
  email: string;
  password: string;
}

// Response 200
interface LoginResponse {
  user: User;
  session: Session;
}
```

#### POST /auth/logout

```typescript
// Response 200
interface LogoutResponse {
  success: true;
}
```

#### POST /auth/reset-password

```typescript
// Request
interface ResetPasswordRequest {
  email: string;
}

// Response 200
interface ResetPasswordResponse {
  success: true;
}
```

---

### 4.2 Users

#### GET /users/me

```typescript
// Response 200
interface GetCurrentUserResponse {
  id: string;
  email: string;
  display_name: string;
  couple_id: string | null;
  role: 'partner_a' | 'partner_b' | null;
  created_at: string;
  updated_at: string;
}
```

#### PATCH /users/me

```typescript
// Request
interface UpdateUserRequest {
  display_name?: string;
}

// Response 200
interface UpdateUserResponse {
  id: string;
  display_name: string;
  // ... other user fields
}
```

---

### 4.3 Couples

#### POST /couples

```typescript
// Request
interface CreateCoupleRequest {
  name: string;
}

// Response 201
interface CreateCoupleResponse {
  id: string;
  name: string;
  partner_a_id: string;
  partner_b_id: null;
  created_at: string;
  updated_at: string;
}
```

**Side Effects**:
- Updates caller's `users.couple_id`
- Sets caller's `users.role` to 'partner_a'

#### GET /couples/:id

```typescript
// Response 200
interface GetCoupleResponse {
  id: string;
  name: string;
  partner_a_id: string;
  partner_b_id: string | null;
  partner_a: User;
  partner_b: User | null;
  created_at: string;
  updated_at: string;
}
```

#### DELETE /couples/:id/leave

```typescript
// Response 200
interface LeaveCoupleResponse {
  success: true;
}
```

**Side Effects**:
- Sets user's `couple_id` to null
- Sets user's `role` to null
- Does NOT delete the couple (other partner remains)

---

### 4.4 Invitations

#### POST /invitations

```typescript
// Request
interface CreateInvitationRequest {
  couple_id: string;
  invitee_email: string;
}

// Response 201
interface CreateInvitationResponse {
  id: string;
  couple_id: string;
  inviter_id: string;
  invitee_email: string;
  status: 'pending';
  token: string; // 64-character hex string
  expires_at: string; // ISO 8601
  created_at: string;
}

// Full invitation link: `${APP_URL}/invite/${token}`
```

#### GET /invitations/:token

```typescript
// Response 200
interface GetInvitationResponse {
  id: string;
  couple_id: string;
  inviter: {
    id: string;
    display_name: string;
  };
  couple: {
    id: string;
    name: string;
  };
  invitee_email: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expires_at: string;
}

// Response 404
// Response 410 (Gone - expired)
```

#### POST /invitations/:token/accept

```typescript
// Response 200
interface AcceptInvitationResponse {
  success: true;
  couple: GetCoupleResponse;
}
```

**Side Effects**:
- Updates invitation status to 'accepted'
- Updates user's `couple_id`
- Sets user's `role` to 'partner_b'
- Updates couple's `partner_b_id`

#### POST /invitations/:token/decline

```typescript
// Response 200
interface DeclineInvitationResponse {
  success: true;
}
```

**Side Effects**:
- Updates invitation status to 'declined'

#### DELETE /invitations/:id

```typescript
// Response 200
interface CancelInvitationResponse {
  success: true;
}
```

**Authorization**: Only inviter can cancel.

#### GET /invitations (my pending)

```typescript
// Query params: ?status=pending&couple_id=xxx
// Response 200
interface GetMyInvitationsResponse {
  invitations: Array<{
    id: string;
    invitee_email: string;
    status: string;
    expires_at: string;
    created_at: string;
  }>;
}
```

---

### 4.5 Habits

#### POST /habits

```typescript
// Request
interface CreateHabitRequest {
  name: string;
  description?: string;
  color?: string; // hex, default '#34C759'
  icon?: string; // emoji, default '✓'
  frequency?: 'daily' | 'weekly' | 'custom';
  target_days?: number[]; // [0-6] for Sun-Sat
  target_count?: number; // default 4
}

// Response 201
interface CreateHabitResponse {
  id: string;
  couple_id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  frequency: string;
  target_days: number[];
  target_count: number;
  created_by: string;
  is_active: true;
  created_at: string;
  updated_at: string;
}
```

**Authorization**: User must be in a couple.

#### GET /habits

```typescript
// Query params: ?couple_id=xxx&is_active=true
// Response 200
interface GetHabitsResponse {
  habits: CreateHabitResponse[];
}
```

#### GET /habits/:id

```typescript
// Response 200
interface GetHabitResponse {
  id: string;
  couple_id: string;
  name: string;
  // ... all habit fields
}
```

#### PATCH /habits/:id

```typescript
// Request
interface UpdateHabitRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  frequency?: string;
  target_days?: number[];
  target_count?: number;
}

// Response 200
interface UpdateHabitResponse {
  // Updated habit object
}
```

#### DELETE /habits/:id

```typescript
// Response 200
interface ArchiveHabitResponse {
  success: true;
}
```

**Behavior**: Soft delete (sets `is_active = false`).

#### POST /habits/:id/restore

```typescript
// Response 200
interface RestoreHabitResponse {
  success: true;
}
```

---

### 4.6 Completions

#### POST /completions

```typescript
// Request
interface CreateCompletionRequest {
  habit_id: string;
  date: string; // YYYY-MM-DD
}

// Response 201
interface CreateCompletionResponse {
  id: string;
  habit_id: string;
  user_id: string;
  date: string;
  completed: true;
  completed_at: string;
}
```

**Behavior**: Upsert (creates or updates). Only one completion per (habit, user, date).

#### DELETE /completions

```typescript
// Request
interface DeleteCompletionRequest {
  habit_id: string;
  date: string; // YYYY-MM-DD
}

// Response 200
interface DeleteCompletionResponse {
  success: true;
}
```

**Behavior**: Removes today's completion (toggle off).

#### GET /completions

```typescript
// Query params: ?habit_id=xxx&user_id=xxx&from=YYYY-MM-DD&to=YYYY-MM-DD
// Response 200
interface GetCompletionsResponse {
  completions: Array<{
    id: string;
    habit_id: string;
    user_id: string;
    date: string;
    completed: true;
    completed_at: string;
  }>;
}
```

#### GET /completions/grid

```typescript
// Query params: ?habit_id=xxx&months=12
// Response 200
interface GetGridCompletionsResponse {
  habit_id: string;
  grid: Array<{
    date: string;
    mine: boolean;
    partner: boolean;
  }>;
}
```

**Returns**: Array of dates with both user's and partner's completion status for building the activity grid.

---

## 5. Data Models

### 5.1 Core Types

```typescript
interface User {
  id: string;
  email: string;
  display_name: string;
  couple_id: string | null;
  role: 'partner_a' | 'partner_b' | null;
  created_at: string;
  updated_at: string;
}

interface Couple {
  id: string;
  name: string;
  partner_a_id: string;
  partner_b_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Habit {
  id: string;
  couple_id: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  frequency: 'daily' | 'weekly' | 'custom';
  target_days: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  target_count: number;
  created_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Completion {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  completed_at: string;
}

interface Invitation {
  id: string;
  couple_id: string;
  inviter_id: string;
  invitee_email: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}
```

### 5.2 Form DTOs

```typescript
interface SignUpForm {
  display_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface LoginForm {
  email: string;
  password: string;
}

interface CreateCoupleForm {
  name: string;
}

interface InvitePartnerForm {
  email: string;
}

interface HabitForm {
  name: string;
  description?: string;
  color: string;
  icon: string;
  frequency: 'daily' | 'weekly' | 'custom';
  target_days: number[];
  target_count: number;
}
```

### 5.3 API Response Wrappers

```typescript
interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
```

### 5.4 Grid Data Types

```typescript
interface GridCell {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0-6
  month: number; // 1-12
  day: number; // 1-31
  isTargetDay: boolean;
  isFuture: boolean;
  myCompletion: boolean;
  partnerCompletion: boolean;
  cellState: 'both' | 'mine-only' | 'partner-only' | 'none' | 'future' | 'non-target';
}

interface GridData {
  habitId: string;
  startDate: string;
  endDate: string;
  cells: GridCell[];
}
```

---

## 6. State Management

### 6.1 AuthStore (Zustand)

```typescript
interface AuthState {
  // State
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}
```

**Persistence**: Session stored in AsyncStorage, restored on app launch.

**Side Effects**:
- `signUp` → Creates user record → Sets couple_id=null, role=null
- `signIn` → Fetches user with couple data
- `signOut` → Clears session → Navigates to `/auth/login`

---

### 6.2 CoupleStore (Zustand)

```typescript
interface CoupleState {
  // State
  couple: Couple | null;
  partner: User | null;
  invitations: Invitation[];
  isLoading: boolean;
  error: string | null;

  // Computed
  isInCouple: boolean;
  hasPartner: boolean;
  pendingInvitations: Invitation[];

  // Actions
  createCouple: (name: string) => Promise<void>;
  fetchCouple: () => Promise<void>;
  fetchInvitations: () => Promise<void>;
  invitePartner: (email: string) => Promise<void>;
  acceptInvitation: (token: string) => Promise<void>;
  declineInvitation: (token: string) => Promise<void>;
  cancelInvitation: (id: string) => Promise<void>;
  leaveCouple: () => Promise<void>;
  clearError: () => void;
}
```

**Side Effects**:
- `createCouple` → Updates auth store user
- `acceptInvitation` → Updates auth store user, fetches new couple
- `leaveCouple` → Updates auth store user, clears couple state

---

### 6.3 HabitsStore (Zustand)

```typescript
interface HabitsState {
  // State
  habits: Habit[];
  completions: Record<string, Completion[]>; // keyed by habit_id
  gridData: Record<string, GridCell[]>; // keyed by habit_id
  isLoading: boolean;
  error: string | null;

  // Computed
  activeHabits: Habit[];
  archivedHabits: Habit[];

  // Actions
  fetchHabits: () => Promise<void>;
  createHabit: (data: HabitForm) => Promise<Habit>;
  updateHabit: (id: string, data: Partial<HabitForm>) => Promise<void>;
  archiveHabit: (id: string) => Promise<void>;
  restoreHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string, date: string) => Promise<void>;
  fetchGridData: (habitId: string, months?: number) => Promise<void>;
  getTodayProgress: (habitId: string) => { completed: number; target: number };
  clearError: () => void;
}
```

**Persistence**: Habits cached locally, refreshed on app focus.

**Side Effects**:
- `toggleCompletion` → Optimistic update → Supabase upsert/delete → Revert on error

---

## 7. Test Scenarios

### 7.1 Authentication Flow

#### Scenario: New user successfully creates account

```
GIVEN I am on the sign up screen
WHEN I enter "Jane Doe" as display name
AND I enter "jane@example.com" as email
AND I enter "Password123" as password
AND I enter "Password123" as confirm password
AND I tap "Create Account"
THEN I am authenticated as "jane@example.com"
AND my session is persisted
AND I am redirected to the create couple screen
AND my display name is "Jane Doe"
AND my couple_id is null
AND my role is null
```

#### Scenario: User signs in with valid credentials

```
GIVEN I am on the login screen
AND I have a registered account
WHEN I enter my email
AND I enter my password
AND I tap "Sign In"
THEN I am authenticated
AND my session is persisted
IF my couple_id is not null
THEN I am redirected to the home screen
ELSE I am redirected to the create couple screen
```

#### Scenario: User fails to sign in with wrong password

```
GIVEN I am on the login screen
AND I have a registered account
WHEN I enter my email
AND I enter "wrongpassword" as password
AND I tap "Sign In"
THEN I see error "Incorrect password. Please try again."
AND I remain on the login screen
AND my session is not created
```

#### Scenario: Session persists across app restart

```
GIVEN I have successfully signed in
AND I have closed the app
WHEN I reopen the app
THEN I am automatically signed in
AND my user data is available
AND I am on the appropriate screen (home if in couple, else create couple)
```

---

### 7.2 Couple Creation Flow

#### Scenario: User creates a couple partnership

```
GIVEN I am authenticated
AND I am not in a couple
WHEN I enter "Smith Family" as couple name
AND I tap "Create Couple"
THEN a couple record is created with name "Smith Family"
AND my user record has couple_id set to the new couple's id
AND my role is set to "partner_a"
AND I am redirected to the profile screen
AND I see "Smith Family" in my profile
```

#### Scenario: User invites partner via email

```
GIVEN I am authenticated
AND I am in a couple
AND I do not have a partner
WHEN I enter "partner@example.com" as partner email
AND I tap "Send Invitation"
THEN an invitation record is created
AND an email is sent to "partner@example.com"
AND the invitation status is "pending"
AND I see a success message
```

#### Scenario: Partner accepts invitation

```
GIVEN my partner sent me an invitation
AND I am authenticated
AND I am not in a couple
WHEN I open the invitation link
THEN I see "Partner Name" invited me to join "Couple Name"
AND I see "You'll become Partner B"
WHEN I tap "Accept Invitation"
THEN my user record has couple_id set to the couple's id
AND my role is set to "partner_b"
AND the couple's partner_b_id is set to my user id
AND I am redirected to the home screen
```

#### Scenario: User leaves couple

```
GIVEN I am authenticated
AND I am in a couple with a partner
WHEN I tap "Leave Couple"
AND I confirm the action
THEN my user record has couple_id set to null
AND my role is set to null
AND the couple record remains (for other partner)
AND I am redirected to the create couple screen
```

---

### 7.3 Habit Management Flow

#### Scenario: User creates a weekly habit

```
GIVEN I am authenticated
AND I am in a couple
WHEN I tap "Add Habit"
AND I enter "Morning Run" as habit name
AND I select days Monday, Wednesday, Friday, Saturday (1, 3, 5, 6)
AND I enter "4" as weekly goal
AND I select green color
AND I select "🏃" as icon
AND I tap "Save Habit"
THEN a habit record is created
AND the habit is associated with my couple
AND I am redirected to the habit list
AND I see "Morning Run" in the list
```

#### Scenario: User toggles habit completion

```
GIVEN I have a habit "Morning Run" for today
AND today is a target day (Monday)
AND I have not completed the habit today
WHEN I tap the completion circle on "Morning Run"
THEN a completion record is created for today
AND my user id is associated with the completion
AND the completion circle shows green (mine only)
AND the grid updates to show my completion
IF my partner has not completed today
THEN the circle shows solid green
IF my partner has completed today
THEN the circle shows diagonal split (green/purple)
```

#### Scenario: User toggles off habit completion

```
GIVEN I have a habit "Morning Run"
AND I have completed the habit today
WHEN I tap the completion circle on "Morning Run"
THEN the completion record for today is removed
AND the completion circle returns to empty state
AND the grid updates to remove my completion
```

#### Scenario: User archives a habit

```
GIVEN I am on the habits management screen
AND I have an active habit "Old Habit"
WHEN I tap the habit "Old Habit"
AND I tap "Delete Habit"
AND I confirm the action
THEN the habit's is_active is set to false
AND the habit moves to the "Archived" tab
AND the habit no longer appears in the home list
```

---

### 7.4 Grid Visualization

#### Scenario: Grid shows correct color for both completed

```
GIVEN I am on the habit detail screen for "Morning Run"
AND I view the couple grid
WHEN I look at today's cell
AND I have completed the habit today
AND my partner has completed the habit today
THEN the cell shows diagonal split
AND top-left half is green (#34C759)
AND bottom-right half is purple (#AF52DE)
```

#### Scenario: Grid shows correct color for mine only

```
GIVEN I am on the habit detail screen for "Morning Run"
AND I view the couple grid
WHEN I look at today's cell
AND I have completed the habit today
AND my partner has NOT completed the habit today
THEN the cell shows solid green (#34C759)
```

#### Scenario: Grid shows correct color for partner only

```
GIVEN I am on the habit detail screen for "Morning Run"
AND I view the couple grid
WHEN I look at today's cell
AND I have NOT completed the habit today
AND my partner has completed the habit today
THEN the cell shows solid purple (#AF52DE)
```

#### Scenario: Grid shows correct color for neither completed

```
GIVEN I am on the habit detail screen for "Morning Run"
AND I view the couple grid
WHEN I look at today's cell
AND I have NOT completed the habit today
AND my partner has NOT completed the habit today
THEN the cell shows light gray (#E5E5EA)
```

#### Scenario: Personal view shows only my completions

```
GIVEN I am on the habit detail screen for "Morning Run"
AND I tap "My View"
WHEN I look at today's cell
AND I have completed the habit today
THEN the cell shows green (#34C759)
WHEN I look at a cell where partner completed but I didn't
THEN the cell shows gray (#E5E5EA)
AND the partner's completion is not visible
```

#### Scenario: Grid excludes non-target days

```
GIVEN I have a habit "Morning Run" targeting Mon, Wed, Fri
WHEN I look at Tuesday's cells in the grid
THEN the cells are transparent (show background)
AND they are not colored
AND they are not included in completion counts
```

#### Scenario: Grid excludes future dates

```
GIVEN I am on the habit detail screen
WHEN I look at cells for future dates
THEN the cells show very light gray (#F2F2F7)
AND they are not interactive
AND the diagonal split is not shown
```

---

### 7.5 Real-time Sync

#### Scenario: Partner's completion appears in real-time

```
GIVEN I am viewing my habit list
AND my partner completes "Morning Run" on their device
WHEN the completion is saved to Supabase
THEN within 5 seconds, my device receives the update
AND the completion circle updates to show partner's completion
AND the grid updates to show purple/green split
```

#### Scenario: Conflict resolution on simultaneous toggle

```
GIVEN my partner and I both have the app open
AND neither of us has completed "Morning Run" today
WHEN my partner taps completion
AND within 1 second, I also tap completion
THEN both completions are recorded
AND the cell shows diagonal split
AND no data is lost
```

---

## 8. Error Handling

### 8.1 Network Errors

All network errors show a toast/banner:
```
"Unable to connect. Please check your internet connection."
```

Retry button available where applicable.

### 8.2 Authentication Errors

| Error | Display |
|-------|---------|
| Invalid credentials | "Incorrect email or password" |
| Email not found | "No account found with this email" |
| Email already exists | "An account with this email already exists" |
| Weak password | "Password must be at least 8 characters with 1 uppercase and 1 number" |
| Session expired | "Your session has expired. Please sign in again." |

### 8.3 Validation Errors

Inline validation errors appear below the relevant field:
```
"Display name is required"
"Email must be a valid email address"
"Weekly goal must be between 1 and selected days"
```

### 8.4 Empty States

| Screen | Empty State Title | Empty State Description |
|--------|-------------------|------------------------|
| Home | "No habits yet" | "Start building better habits together!" |
| Habits (Active) | "No active habits" | "Create a habit to get started" |
| Habits (Archived) | "No archived habits" | "Archived habits will appear here" |
| Pending Invitations | "No pending invitations" | "Invite your partner to get started" |

---

## 9. Navigation Flow

### 9.1 Unauthenticated Flow

```
/auth/login
    ├── /auth/signup
    ├── /auth/reset-password
    └── (deep link: /invite/[token]) → /invite/[token]
```

### 9.2 Authenticated, No Couple Flow

```
/couple/create
    ├── /profile
    └── /invite/[token] (from deep link)
```

### 9.3 Authenticated, In Couple Flow

```
/ (Home - tabs)
├── /(tabs)/habits
├── /(tabs)/profile
├── /habit/[id]
├── /modal/add-habit
└── /invite/[token] (from deep link)
```

---

## 10. Acceptance Criteria

The implementation is complete when:

1. **Authentication**: Users can sign up, sign in, sign out, and reset password with persistent sessions.
2. **Couple Management**: Users can create couples, invite partners, accept/decline invitations, and leave couples.
3. **Habit Management**: Users can create, edit, archive, and restore habits with all specified properties.
4. **Completion Toggle**: Users can mark habits complete/incomplete for any date with real-time sync.
5. **Grid Visualization**: The activity grid correctly displays diagonal split, solid colors, and gray for all scenarios.
6. **View Modes**: Personal and couple views show correct data with appropriate privacy.
7. **Error Handling**: All error states are handled gracefully with appropriate user feedback.
8. **UI Compliance**: All components meet Apple HIG standards (44pt touch targets, SF Pro font, specified colors).
