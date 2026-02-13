import { createSupabaseBrowser } from '@/lib/supabase/client';
import type { AuthError, Session, User } from '@supabase/supabase-js';

/**
 * Authentication service for managing user authentication with Supabase Auth
 */
export class AuthService {
  /**
   * Sign in a user with email and password
   * @param email User email address
   * @param password User password
   * @returns Session data or error
   */
  async signIn(email: string, password: string): Promise<{ data: Session | null; error: AuthError | null }> {
    try {
      const supabase = createSupabaseBrowser();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { data: null, error };
      }

      return { data: data.session, error: null };
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      return { data: null, error: err as AuthError };
    }
  }

  /**
   * Sign up a new user with email and password
   * @param email User email address
   * @param password User password
   * @param metadata Additional user metadata (e.g., firstName, lastName)
   * @returns User data or error
   */
  async signUp(
    email: string,
    password: string,
    metadata?: Record<string, any>
  ): Promise<{ data: User | null; error: AuthError | null }> {
    try {
      const supabase = createSupabaseBrowser();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata || {},
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        return { data: null, error };
      }

      return { data: data.user, error: null };
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      return { data: null, error: err as AuthError };
    }
  }

  /**
   * Sign out the current user
   * @returns Error if any
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Sign out error:', error);
        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected error during sign out:', err);
      return { error: err as AuthError };
    }
  }

  /**
   * Send a password reset email to the user
   * @param email User email address
   * @returns Error if any
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error('Unexpected error during password reset:', err);
      return { error: err as AuthError };
    }
  }

  /**
   * Update the current user's password
   * @param newPassword New password
   * @returns User data or error
   */
  async updatePassword(newPassword: string): Promise<{ data: User | null; error: AuthError | null }> {
    try {
      const supabase = createSupabaseBrowser();
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error('Password update error:', error);
        return { data: null, error };
      }

      return { data: data.user, error: null };
    } catch (err) {
      console.error('Unexpected error during password update:', err);
      return { data: null, error: err as AuthError };
    }
  }

  /**
   * Get the current session
   * @returns Session data or null
   */
  async getSession(): Promise<{ data: Session | null; error: AuthError | null }> {
    try {
      const supabase = createSupabaseBrowser();
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Get session error:', error);
        return { data: null, error };
      }

      return { data: data.session, error: null };
    } catch (err) {
      console.error('Unexpected error getting session:', err);
      return { data: null, error: err as AuthError };
    }
  }

  /**
   * Get the current user
   * @returns User data or null
   */
  async getUser(): Promise<{ data: User | null; error: AuthError | null }> {
    try {
      const supabase = createSupabaseBrowser();
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Get user error:', error);
        return { data: null, error };
      }

      return { data: data.user, error: null };
    } catch (err) {
      console.error('Unexpected error getting user:', err);
      return { data: null, error: err as AuthError };
    }
  }

  /**
   * Refresh the current session
   * @returns Refreshed session data or error
   */
  async refreshSession(): Promise<{ data: Session | null; error: AuthError | null }> {
    try {
      const supabase = createSupabaseBrowser();
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        console.error('Refresh session error:', error);
        return { data: null, error };
      }

      return { data: data.session, error: null };
    } catch (err) {
      console.error('Unexpected error refreshing session:', err);
      return { data: null, error: err as AuthError };
    }
  }
}

// Export a singleton instance
export const authService = new AuthService();
