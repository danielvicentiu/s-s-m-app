-- Migration: Notification Orchestrator Support Tables
-- Description: Tables for deduplication, batch queuing, and in-app notifications
-- Date: 2026-02-13
-- Author: Claude (Notification Orchestrator)

-- ============================================================
-- 1. NOTIFICATION DEDUPLICATION TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS notification_deduplication (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dedup_key TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for cleanup and lookups
CREATE INDEX idx_notif_dedup_key ON notification_deduplication(dedup_key);
CREATE INDEX idx_notif_dedup_expires ON notification_deduplication(expires_at);

-- RLS: Service role only
ALTER TABLE notification_deduplication ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage deduplication"
  ON notification_deduplication
  FOR ALL
  TO service_role
  USING (true);

-- Auto-cleanup expired entries (cron job will handle this)
COMMENT ON TABLE notification_deduplication IS 'Deduplication tracking for notifications within configurable time windows';

-- ============================================================
-- 2. NOTIFICATION BATCH QUEUE TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS notification_batch_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  channels TEXT[] NOT NULL,
  digest_mode TEXT NOT NULL CHECK (digest_mode IN ('hourly', 'daily')),
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX idx_notif_batch_user ON notification_batch_queue(user_id);
CREATE INDEX idx_notif_batch_org ON notification_batch_queue(organization_id);
CREATE INDEX idx_notif_batch_digest_mode ON notification_batch_queue(digest_mode, processed);
CREATE INDEX idx_notif_batch_created ON notification_batch_queue(created_at DESC);

-- RLS
ALTER TABLE notification_batch_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own batch queue"
  ON notification_batch_queue
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage batch queue"
  ON notification_batch_queue
  FOR ALL
  TO service_role
  USING (true);

COMMENT ON TABLE notification_batch_queue IS 'Queue for batched notifications (digest mode)';

-- ============================================================
-- 3. NOTIFICATION QUEUE (for scheduled/delayed notifications)
-- ============================================================

CREATE TABLE IF NOT EXISTS notification_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  channels TEXT[] NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notif_queue_scheduled ON notification_queue(scheduled_for, processed);
CREATE INDEX idx_notif_queue_org ON notification_queue(organization_id);
CREATE INDEX idx_notif_queue_user ON notification_queue(user_id);

-- RLS
ALTER TABLE notification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own queued notifications"
  ON notification_queue
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can manage notification queue"
  ON notification_queue
  FOR ALL
  TO service_role
  USING (true);

COMMENT ON TABLE notification_queue IS 'Queue for scheduled/delayed notifications (quiet hours, etc.)';

-- ============================================================
-- 4. IN-APP NOTIFICATIONS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS in_app_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  action_url TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  is_archived BOOLEAN NOT NULL DEFAULT FALSE,
  archived_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_in_app_notif_user ON in_app_notifications(user_id, is_read, is_archived);
CREATE INDEX idx_in_app_notif_org ON in_app_notifications(organization_id);
CREATE INDEX idx_in_app_notif_created ON in_app_notifications(created_at DESC);
CREATE INDEX idx_in_app_notif_expires ON in_app_notifications(expires_at) WHERE expires_at IS NOT NULL;

-- RLS
ALTER TABLE in_app_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own in-app notifications"
  ON in_app_notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own in-app notifications"
  ON in_app_notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can insert in-app notifications"
  ON in_app_notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Consultants can insert in-app notifications"
  ON in_app_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
      AND memberships.role = 'consultant'
      AND memberships.organization_id = in_app_notifications.organization_id
    )
  );

COMMENT ON TABLE in_app_notifications IS 'In-app push notifications visible in dashboard';

-- ============================================================
-- 5. EXTEND notification_log TABLE (if needed)
-- ============================================================

-- Add user_id column to existing notification_log if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'notification_log' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE notification_log ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    CREATE INDEX idx_notification_log_user ON notification_log(user_id);
  END IF;
END $$;

-- ============================================================
-- 6. FUNCTIONS FOR CLEANUP
-- ============================================================

-- Function to cleanup expired deduplication entries
CREATE OR REPLACE FUNCTION cleanup_expired_deduplication()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notification_deduplication
  WHERE expires_at < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_expired_deduplication() IS 'Cleanup expired deduplication entries (call from cron)';

-- Function to cleanup old processed batch queue entries (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_batch_queue()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notification_batch_queue
  WHERE processed = TRUE
  AND processed_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_batch_queue() IS 'Cleanup old processed batch queue entries (call from cron)';

-- Function to cleanup old processed queue entries (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_notification_queue()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM notification_queue
  WHERE processed = TRUE
  AND processed_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_notification_queue() IS 'Cleanup old processed notification queue entries (call from cron)';

-- Function to cleanup old read in-app notifications (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_in_app_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM in_app_notifications
  WHERE is_read = TRUE
  AND read_at < NOW() - INTERVAL '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_old_in_app_notifications() IS 'Cleanup old read in-app notifications (call from cron)';

-- Function to cleanup expired in-app notifications
CREATE OR REPLACE FUNCTION cleanup_expired_in_app_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM in_app_notifications
  WHERE expires_at IS NOT NULL
  AND expires_at < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION cleanup_expired_in_app_notifications() IS 'Cleanup expired in-app notifications (call from cron)';

-- ============================================================
-- 7. SUMMARY
-- ============================================================

-- Tables created:
-- - notification_deduplication: Prevent duplicate notifications within time window
-- - notification_batch_queue: Store notifications for digest mode (hourly/daily)
-- - notification_queue: Store scheduled/delayed notifications (quiet hours)
-- - in_app_notifications: In-app push notifications visible in dashboard

-- Functions created:
-- - cleanup_expired_deduplication()
-- - cleanup_old_batch_queue()
-- - cleanup_old_notification_queue()
-- - cleanup_old_in_app_notifications()
-- - cleanup_expired_in_app_notifications()

-- All tables have RLS enabled with appropriate policies
-- All tables have indexes for efficient queries
-- All cleanup functions return count of deleted rows
