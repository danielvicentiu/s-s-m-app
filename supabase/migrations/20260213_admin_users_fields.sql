-- Migration: Add is_super_admin and is_blocked fields to profiles table
-- Date: 2026-02-13
-- Purpose: Support admin users page functionality

-- Add is_super_admin column (defaults to false)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- Add is_blocked column (defaults to false)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE NOT NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_super_admin ON profiles(is_super_admin) WHERE is_super_admin = TRUE;
CREATE INDEX IF NOT EXISTS idx_profiles_is_blocked ON profiles(is_blocked) WHERE is_blocked = TRUE;

-- Comment pentru documentare
COMMENT ON COLUMN profiles.is_super_admin IS 'Indicates if user has super admin privileges (platform-wide access)';
COMMENT ON COLUMN profiles.is_blocked IS 'Indicates if user is blocked from accessing the platform';

-- Optional: Add RLS policy to check is_blocked in auth flow
-- This would prevent blocked users from accessing any data
CREATE OR REPLACE FUNCTION public.is_blocked()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_blocked = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if current user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_super_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
