'use client';

import { createContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { UserRole } from '@/lib/rbac';

export interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  role: string | null;
  permissions: string[];
  orgId: string | null;
  roles: UserRole[];
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
