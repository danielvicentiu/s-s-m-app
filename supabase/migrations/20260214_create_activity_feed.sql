-- ══════════════════════════════════════════════════════════════════════════════
-- ACTIVITY FEED — Centralized activity tracking for s-s-m.ro
-- Created: 2026-02-14
-- Purpose: Simple, reusable activity logging for all user actions
-- ══════════════════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────────────────────────────────────
-- 1. CREATE ENUM FOR ACTION TYPES
-- ──────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE activity_action_type AS ENUM (
    'employee_added',
    'employee_updated',
    'employee_deleted',
    'training_completed',
    'training_scheduled',
    'training_cancelled',
    'document_generated',
    'document_uploaded',
    'document_deleted',
    'alert_created',
    'alert_resolved',
    'alert_dismissed',
    'medical_scheduled',
    'medical_completed',
    'medical_cancelled',
    'equipment_assigned',
    'equipment_unassigned',
    'equipment_inspection',
    'settings_changed',
    'login',
    'logout',
    'role_assigned',
    'role_removed',
    'organization_created',
    'organization_updated',
    'department_created',
    'location_created',
    'incident_reported',
    'audit_completed'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ──────────────────────────────────────────────────────────────────────────────
-- 2. CREATE ACTIVITY_FEED TABLE
-- ──────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type activity_action_type NOT NULL,
  entity_type TEXT, -- 'employee', 'training', 'document', 'alert', 'medical', 'equipment', etc.
  entity_id UUID, -- ID of the affected entity
  description TEXT NOT NULL, -- Human-readable description in Romanian
  metadata JSONB DEFAULT '{}', -- Additional context (old/new values, IP, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────────────────────────────────────
-- 3. CREATE INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ──────────────────────────────────────────────────────────────────────────────

-- Primary query pattern: get activities by org, sorted by date DESC
CREATE INDEX IF NOT EXISTS idx_activity_feed_org_created
  ON public.activity_feed(org_id, created_at DESC);

-- Query by user
CREATE INDEX IF NOT EXISTS idx_activity_feed_user
  ON public.activity_feed(user_id);

-- Query by action type
CREATE INDEX IF NOT EXISTS idx_activity_feed_action_type
  ON public.activity_feed(action_type);

-- Query by entity
CREATE INDEX IF NOT EXISTS idx_activity_feed_entity
  ON public.activity_feed(entity_type, entity_id);

-- Composite index for entity lookups within org
CREATE INDEX IF NOT EXISTS idx_activity_feed_org_entity
  ON public.activity_feed(org_id, entity_type, entity_id);

-- ──────────────────────────────────────────────────────────────────────────────
-- 4. ENABLE ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.activity_feed ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────────────────────
-- 5. CREATE RLS POLICIES
-- ──────────────────────────────────────────────────────────────────────────────

-- Policy: Users can view activities for their organization(s)
DROP POLICY IF EXISTS "Users can view org activities" ON public.activity_feed;
CREATE POLICY "Users can view org activities"
  ON public.activity_feed
  FOR SELECT
  USING (
    org_id IN (
      SELECT organization_id
      FROM public.memberships
      WHERE user_id = auth.uid()
      AND is_active = true
    )
  );

-- Policy: System can insert activities (via trigger or API)
DROP POLICY IF EXISTS "System can insert activities" ON public.activity_feed;
CREATE POLICY "System can insert activities"
  ON public.activity_feed
  FOR INSERT
  WITH CHECK (true);

-- Policy: No updates allowed (immutable audit log)
-- Intentionally no UPDATE policy - activity feed is immutable

-- Policy: Only super admins can delete activities (cleanup/maintenance)
DROP POLICY IF EXISTS "Only super admins can delete activities" ON public.activity_feed;
CREATE POLICY "Only super admins can delete activities"
  ON public.activity_feed
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE id = auth.uid()
      AND is_super_admin = true
    )
  );

-- ──────────────────────────────────────────────────────────────────────────────
-- 6. CREATE REUSABLE TRIGGER FUNCTION
-- ──────────────────────────────────────────────────────────────────────────────

-- This function can be called from triggers on any table or directly from app code
CREATE OR REPLACE FUNCTION public.log_activity(
  p_org_id UUID,
  p_user_id UUID,
  p_action_type activity_action_type,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT '',
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO public.activity_feed (
    org_id,
    user_id,
    action_type,
    entity_type,
    entity_id,
    description,
    metadata,
    created_at
  ) VALUES (
    p_org_id,
    p_user_id,
    p_action_type,
    p_entity_type,
    p_entity_id,
    p_description,
    p_metadata,
    NOW()
  ) RETURNING id INTO v_activity_id;

  RETURN v_activity_id;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the main transaction
    RAISE WARNING 'Failed to log activity: %', SQLERRM;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ──────────────────────────────────────────────────────────────────────────────
-- 7. GRANT PERMISSIONS
-- ──────────────────────────────────────────────────────────────────────────────

-- Grant execute on log_activity to authenticated users
GRANT EXECUTE ON FUNCTION public.log_activity TO authenticated;

-- Grant select to authenticated users (enforced by RLS)
GRANT SELECT ON public.activity_feed TO authenticated;

-- Grant insert to authenticated users (enforced by RLS)
GRANT INSERT ON public.activity_feed TO authenticated;

-- ──────────────────────────────────────────────────────────────────────────────
-- 8. ADD HELPFUL COMMENTS
-- ──────────────────────────────────────────────────────────────────────────────

COMMENT ON TABLE public.activity_feed IS
  'Centralized activity tracking for all user actions. Immutable audit log.';

COMMENT ON COLUMN public.activity_feed.org_id IS
  'Organization where the activity occurred';

COMMENT ON COLUMN public.activity_feed.user_id IS
  'User who performed the action';

COMMENT ON COLUMN public.activity_feed.action_type IS
  'Type of action performed (enum)';

COMMENT ON COLUMN public.activity_feed.entity_type IS
  'Type of entity affected (employee, training, document, etc.)';

COMMENT ON COLUMN public.activity_feed.entity_id IS
  'UUID of the affected entity';

COMMENT ON COLUMN public.activity_feed.description IS
  'Human-readable description in Romanian for UI display';

COMMENT ON COLUMN public.activity_feed.metadata IS
  'Additional context: old/new values, IP address, browser info, etc.';

COMMENT ON FUNCTION public.log_activity IS
  'Reusable function to log activities. Can be called from triggers or application code. Returns activity ID or NULL on error (non-blocking).';

-- ──────────────────────────────────────────────────────────────────────────────
-- 9. EXAMPLE TRIGGER USAGE
-- ──────────────────────────────────────────────────────────────────────────────

-- Example: Auto-log when employee is added
--
-- CREATE OR REPLACE FUNCTION trigger_log_employee_added()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   PERFORM public.log_activity(
--     NEW.organization_id,
--     auth.uid(),
--     'employee_added'::activity_action_type,
--     'employee',
--     NEW.id,
--     format('A fost adăugat angajatul %s %s', NEW.first_name, NEW.last_name),
--     jsonb_build_object(
--       'employee_name', NEW.first_name || ' ' || NEW.last_name,
--       'cnp', NEW.cnp,
--       'job_title', NEW.job_title
--     )
--   );
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;
--
-- CREATE TRIGGER employee_added_activity
--   AFTER INSERT ON public.employees
--   FOR EACH ROW
--   EXECUTE FUNCTION trigger_log_employee_added();

-- ──────────────────────────────────────────────────────────────────────────────
-- 10. EXAMPLE APPLICATION CODE USAGE
-- ──────────────────────────────────────────────────────────────────────────────

-- From TypeScript/JavaScript:
--
-- // Log activity from API route or server action
-- const { data, error } = await supabase.rpc('log_activity', {
--   p_org_id: orgId,
--   p_user_id: userId,
--   p_action_type: 'document_generated',
--   p_entity_type: 'document',
--   p_entity_id: documentId,
--   p_description: 'A fost generat Registrul de Instruiri SSM pentru ianuarie 2026',
--   p_metadata: {
--     document_type: 'training_register',
--     format: 'pdf',
--     period: '2026-01',
--     employee_count: 25
--   }
-- });
--
-- // Fetch recent activities
-- const { data: activities } = await supabase
--   .from('activity_feed')
--   .select('*')
--   .eq('org_id', orgId)
--   .order('created_at', { ascending: false })
--   .limit(50);

-- ══════════════════════════════════════════════════════════════════════════════
-- END OF MIGRATION
-- ══════════════════════════════════════════════════════════════════════════════
