'use client';

import { useContext } from 'react';
import { AuthContext, AuthContextValue } from '@/lib/contexts/AuthContext';

/**
 * Hook pentru consumarea AuthProvider context-ului
 *
 * Returnează:
 * - user: User Supabase sau null
 * - session: Session Supabase sau null
 * - loading: boolean - true în timpul încărcării inițiale
 * - isAuthenticated: boolean - true dacă există user autentificat
 * - role: string | null - cheia primului rol activ
 * - permissions: string[] - lista de permisiuni în format "resource:action"
 * - orgId: string | null - ID-ul organizației principale
 * - roles: UserRole[] - toate rolurile active ale userului
 *
 * @throws Error dacă este folosit în afara AuthProvider-ului
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Wrap your component tree with <AuthProvider> to use this hook.'
    );
  }

  return context;
}
