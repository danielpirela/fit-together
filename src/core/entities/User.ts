// User entity
export interface User {
  id: string;
  email: string;
  displayName: string;
  coupleId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// User role in couple
export type UserRole = "partner_a" | "partner_b";

// Create user DTO
export interface CreateUserDTO {
  email: string;
  displayName: string;
}

// Update user DTO
export interface UpdateUserDTO {
  displayName?: string;
  coupleId?: string | null;
}

// User with computed properties
export interface UserWithRole extends User {
  role: UserRole;
}
