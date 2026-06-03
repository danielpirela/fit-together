import type { IAuthRepository, AuthUser } from '../../../domain/repositories/IAuthRepository';
import { getSupabaseClient } from '../SupabaseClient';

export class SupabaseAuthRepository implements IAuthRepository {
  async getSession(): Promise<{ user: AuthUser | null }> {
    const supabase = getSupabaseClient();
    const { data } = await supabase.auth.getSession();
    return {
      user: data.session?.user
        ? { id: data.session.user.id, email: data.session.user.email || '' }
        : null,
    };
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('Sign in failed');
    return { id: data.user.id, email: data.user.email || '' };
  }

  async signUp(email: string, password: string): Promise<AuthUser> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('Sign up failed');
    return { id: data.user.id, email: data.user.email || '' };
  }

  async signOut(): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async resetPassword(email: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }

  onAuthStateChange(callback: (user: AuthUser | null) => void): () => void {
    const supabase = getSupabaseClient();
    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      callback(session?.user ? { id: session.user.id, email: session.user.email || '' } : null);
    });
    return () => data.subscription.unsubscribe();
  }
}

export const authRepository = new SupabaseAuthRepository();
