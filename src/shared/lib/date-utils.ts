// Date utility functions for the activity grid and progress calculations

/**
 * Format a date as a string
 */
export function formatDate(date: Date | string, format: string = 'MMM d, yyyy'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  const tokens: Record<string, string | number> = {
    yyyy: d.getFullYear(),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    MMM: d.toLocaleString('en-US', { month: 'short' }),
    MMMM: d.toLocaleString('en-US', { month: 'long' }),
    dd: String(d.getDate()).padStart(2, '0'),
    d: d.getDate(),
    HH: String(d.getHours()).padStart(2, '0'),
    hh: String(d.getHours() % 12 || 12).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
    a: d.getHours() < 12 ? 'AM' : 'PM',
  }

  return format.replace(/yyyy|MM+|dd|d|HH|hh|mm|ss|a|MMMM/g, (match) => String(tokens[match]))
}

/**
 * Format a date as relative time (today, yesterday, X days ago)
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffTime = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months > 1 ? 's' : ''} ago`
  }
  const years = Math.floor(diffDays / 365)
  return `${years} year${years > 1 ? 's' : ''} ago`
}

/**
 * Format time as HH:MM AM/PM
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

// ============================================
// GRID CELL CALCULATIONS
// ============================================

/**
 * Calculate the date for a specific grid cell position
 */
export function getGridCellDate(row: number, col: number, startDate: Date): Date {
  const date = new Date(startDate)
  date.setDate(date.getDate() + row * 7 + col)
  return date
}

/**
 * Get ISO week number for a date
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

/**
 * Get the first day of the month
 */
export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * Get the last day of the month
 */
export function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/**
 * Get number of weeks in a month
 */
export function getWeeksInMonth(date: Date): number {
  const firstDay = getMonthStart(date)
  const lastDay = getMonthEnd(date)
  const startWeek = getWeekNumber(firstDay)
  const endWeek = getWeekNumber(lastDay)
  return endWeek - startWeek + (firstDay.getFullYear() !== lastDay.getFullYear() ? 52 : 0)
}

// ============================================
// PROGRESS CALCULATIONS
// ============================================

export interface WeekProgress {
  start: Date
  end: Date
  completed: number
  total: number
  percentage: number
}

export interface MonthProgress {
  start: Date
  end: Date
  completed: number
  total: number
  percentage: number
}

/**
 * Get progress for the current week
 */
export function getWeekProgress(date: Date = new Date()): WeekProgress {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Monday start

  const start = new Date(date)
  start.setDate(diff)
  startOfDay(start)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  endOfDay(end)

  return {
    start,
    end,
    completed: 0, // Would be calculated with actual completions
    total: 7,
    percentage: 0,
  }
}

/**
 * Get progress for the current month
 */
export function getMonthProgress(date: Date = new Date()): MonthProgress {
  const start = getMonthStart(date)
  const end = getMonthEnd(date)
  const today = startOfDay(date)

  const totalDays = end.getDate()
  const daysPassed = today.getDate()
  const currentDayOfMonth = today <= end ? daysPassed : totalDays

  return {
    start,
    end,
    completed: 0, // Would be calculated with actual completions
    total: totalDays,
    percentage: Math.round((currentDayOfMonth / totalDays) * 100),
  }
}

/**
 * Calculate streak from completion dates
 */
export function getStreak(completions: { date: string }[], targetDays?: string[]): number {
  if (completions.length === 0) return 0

  const sortedDates = completions
    .map((c) => c.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = formatDate(today, 'yyyy-MM-dd')

  let streak = 0
  let checkDate = new Date(today)

  // Check if today or yesterday was completed (allow checking yesterday if today not yet)
  const todayCompleted = sortedDates.includes(todayStr)
  if (!todayCompleted) {
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = formatDate(yesterday, 'yyyy-MM-dd')
    if (!sortedDates.includes(yesterdayStr)) {
      return 0 // No streak if neither today nor yesterday completed
    }
    checkDate = yesterday
  }

  // Count consecutive days
  while (true) {
    const dateStr = formatDate(checkDate, 'yyyy-MM-dd')
    if (sortedDates.includes(dateStr)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

/**
 * Calculate completion rate for a period
 */
export function getCompletionRate(completions: { date: string }[], days: number): number {
  if (days === 0) return 0
  const uniqueDates = new Set(completions.map((c) => c.date))
  return Math.round((uniqueDates.size / days) * 100)
}

// ============================================
// DATE MANIPULATION
// ============================================

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Add weeks to a date
 */
export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7)
}

/**
 * Add months to a date
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

/**
 * Get start of day (midnight)
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get end of day (23:59:59.999)
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

/**
 * Check if date is weekend
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

// ============================================
// GRID HELPERS
// ============================================

/**
 * Get all dates in a range
 */
export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = []
  const current = new Date(startDate)

  while (current <= endDate) {
    dates.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return dates
}

/**
 * Get last 12 months for grid header
 */
export function getLast12Months(): { month: Date; label: string }[] {
  const months: { month: Date; label: string }[] = []
  const now = new Date()

  for (let i = 11; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      month,
      label: month.toLocaleString('en-US', { month: 'short' }),
    })
  }

  return months
}

/**
 * Get day of week name (full)
 */
export function getDayOfWeekName(date: Date): string {
  return date.toLocaleString('en-US', { weekday: 'long' })
}

/**
 * Get short day name
 */
export function getShortDayName(date: Date): string {
  return date.toLocaleString('en-US', { weekday: 'short' })
}

// ============================================
// CONSTANTS
// ============================================

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const
export const FULL_DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export const SHORT_MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const
