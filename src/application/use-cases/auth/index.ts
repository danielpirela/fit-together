import type { User } from '../../../domain/entities';
import type { IAuthRepository, IUserRepository } from '../../../domain/repositories';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export class SignInUseCase {
  constructor(
    private authRepo: IAuthRepository,
    private userRepo: IUserRepository
  ) {}

  async execute(email: string, password: string): Promise<User> {
    const authUser = await this.authRepo.signIn(email, password);
    const user = await this.userRepo.getById(authUser.id);
    if (!user) throw new Error('User not found');
    return user;
  }
}

export class SignUpUseCase {
  constructor(
    private authRepo: IAuthRepository,
    private userRepo: IUserRepository
  ) {}

  async execute(email: string, password: string, displayName: string): Promise<User> {
    const authUser = await this.authRepo.signUp(email, password);
    const user = await this.userRepo.create({
      id: authUser.id,
      email,
      displayName,
    });
    return user;
  }
}

export class SignOutUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepo.signOut();
  }
}

export class ResetPasswordUseCase {
  constructor(private authRepo: IAuthRepository) {}

  async execute(email: string): Promise<void> {
    await this.authRepo.resetPassword(email);
  }
}

export class InitializeAuthUseCase {
  constructor(
    private authRepo: IAuthRepository,
    private userRepo: IUserRepository
  ) {}

  async execute(): Promise<User | null> {
    const { user: authUser } = await this.authRepo.getSession();
    if (!authUser) return null;
    return this.userRepo.getById(authUser.id);
  }
}
