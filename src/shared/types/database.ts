// Database types matching Supabase schema
// These types are used across the application

export type Role = 'partner_a' | 'partner_b' | null

export interface User {
  id: string
  email: string
  display_name: string
  couple_id: string | null
  role: Role
  created_at: string
  updated_at: string
}

export interface Couple {
  id: string
  name: string
  partner_a_id: string | null
  partner_b_id: string | null
  created_at: string
  updated_at: string
  partner_a?: User
  partner_b?: User | null
}

export type Frequency = 'daily' | 'weekly' | 'custom'

export interface Habit {
  id: string
  couple_id: string
  name: string
  description: string | null
  color: string
  icon: string
  frequency: Frequency
  target_days: string[] // JSON array as string, e.g., "[1,3,5]" for Mon,Wed,Fri
  target_count: number
  created_by: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Completion {
  id: string
  habit_id: string
  user_id: string
  date: string // YYYY-MM-DD
  completed: boolean
  completed_at: string | null
}

export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired'

export interface Invitation {
  id: string
  couple_id: string
  inviter_id: string
  invitee_email: string
  status: InvitationStatus
  token: string
  expires_at: string
  created_at: string
  updated_at: string
  inviter?: User
  couple?: Couple
}

// Grid data types
export type CellStatus = 'both_completed' | 'only_partner_a' | 'only_partner_b' | 'none_completed'

export interface GridCell {
  date: string
  dayOfWeek: number // 0-6, 0=Sunday
  isTargetDay: boolean
  isFuture: boolean
  myCompletion: boolean
  partnerCompletion: boolean
  status: CellStatus
}

export interface SharedCompletion {
  date: string
  partnerACompleted: boolean
  partnerBCompleted: boolean
}

// Form DTOs
export interface SignUpForm {
  display_name: string
  email: string
  password: string
  confirm_password: string
}

export interface LoginForm {
  email: string
  password: string
}

export interface CreateCoupleForm {
  name: string
}

export interface InvitePartnerForm {
  email: string
}

export interface HabitForm {
  name: string
  description?: string
  color: string
  icon: string
  frequency: Frequency
  target_days: number[]
  target_count: number
}

// API response types
export interface ApiResponse<T> {
  data: T | null
  error: ApiError | null
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    per_page: number
    total: number
    total_pages: number
  }
}
