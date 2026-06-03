import type { User, CreateUserParams } from '@/domain/entities';

export interface AuthUser {
  id: string;
  email: string;
}

export interface IAuthRepository {
  getSession(): Promise<{ user: AuthUser | null }>;
  signIn(email: string, password: string): Promise<AuthUser>;
  signUp(email: string, password: string): Promise<AuthUser>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void;
}

export interface IUserRepository {
  getById(id: string): Promise<User | null>;
  create(params: CreateUserParams): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
}
