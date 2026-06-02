import { UserRole } from "./User";

// Habit frequency
export type HabitFrequency = "daily" | "weekly" | "custom";

// Days of week for weekly habits
export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

// Habit entity
export interface Habit {
  id: string;
  coupleId: string;
  name: string;
  description: string | null;
  color: string;
  icon: string;
  frequency: HabitFrequency;
  targetDays: DayOfWeek[]; // For weekly habits
  targetCount: number; // e.g., 4 times per week
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Create habit DTO
export interface CreateHabitDTO {
  coupleId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  frequency: HabitFrequency;
  targetDays?: DayOfWeek[];
  targetCount?: number;
  createdBy: string;
}

// Update habit DTO
export interface UpdateHabitDTO {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
  frequency?: HabitFrequency;
  targetDays?: DayOfWeek[];
  targetCount?: number;
  isActive?: boolean;
}

// Habit completion status for a user on a specific day
export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  completedAt: Date | null;
}

// Check if both users completed a habit on a given day
export interface SharedCompletion {
  date: string;
  partnerACompleted: boolean;
  partnerBCompleted: boolean;
}

// Cell status for the grid visualization
export type CellStatus = "both_completed" | "only_partner_a" | "only_partner_b" | "none_completed";

// Get cell status from completion data
export function getCellStatus(
  partnerACompleted: boolean,
  partnerBCompleted: boolean
): CellStatus {
  if (partnerACompleted && partnerBCompleted) return "both_completed";
  if (partnerACompleted) return "only_partner_a";
  if (partnerBCompleted) return "only_partner_b";
  return "none_completed";
}