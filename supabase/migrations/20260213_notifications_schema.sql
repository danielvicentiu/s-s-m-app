-- ============================================================
-- S-S-M.RO — Notifications Table Schema
-- Ensures notifications table exists with read_at column
-- Data: 13 Februarie 2026
-- ============================================================

-- Create notifications table if not exists
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'email',
  status TEXT NOT NULL DEFAULT 'sent',
  recipient TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ,

  -- Index for common queries
  CONSTRAINT notifications_type_check CHECK (type IN (
    'daily_alert', 'fraud_alert', 'system_alert',
    'alert_mm_30d', 'alert_mm_15d', 'alert_mm_7d', 'alert_mm_expired',
    'alert_psi_30d', 'alert_psi_15d', 'alert_psi_expired',
    'report_monthly'
  )),
  CONSTRAINT notifications_channel_check CHECK (channel IN ('email', 'sms', 'whatsapp', 'push', 'calendar')),
  CONSTRAINT notifications_status_check CHECK (status IN ('sent', 'delivered', 'opened', 'actioned', 'ignored', 'failed'))
);

-- Add read_at column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'notifications'
    AND column_name = 'read_at'
  ) THEN
    ALTER TABLE public.notifications ADD COLUMN read_at TIMESTAMPTZ;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_org_id ON public.notifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_read_at ON public.notifications(read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_org_unread ON public.notifications(organization_id, created_at DESC) WHERE read_at IS NULL;

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view notifications for their organizations
DROP POLICY IF EXISTS "Users can view org notifications" ON public.notifications;
CREATE POLICY "Users can view org notifications" ON public.notifications
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.memberships
      WHERE user_id = auth.uid()
      AND is_active = true
    )
  );

-- RLS Policy: Users can update (mark as read) notifications for their organizations
DROP POLICY IF EXISTS "Users can update org notifications" ON public.notifications;
CREATE POLICY "Users can update org notifications" ON public.notifications
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.memberships
      WHERE user_id = auth.uid()
      AND is_active = true
    )
  );

-- RLS Policy: System can insert notifications (service role)
DROP POLICY IF EXISTS "Service role can insert notifications" ON public.notifications;
CREATE POLICY "Service role can insert notifications" ON public.notifications
  FOR INSERT
  WITH CHECK (true);

-- Comment
COMMENT ON TABLE public.notifications IS 'Notifications table for SSM/PSI alerts and system messages with read tracking';
COMMENT ON COLUMN public.notifications.read_at IS 'Timestamp when notification was marked as read by user';
