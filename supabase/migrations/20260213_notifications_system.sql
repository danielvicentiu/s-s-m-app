-- Migration: Sistem notificări utilizatori
-- Created: 2026-02-13
-- Descriere: Tabele pentru notificări in-app și preferințe notificări

-- ============================================================
-- 1. CREATE TABLE notifications
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('system', 'alert', 'reminder', 'approval', 'message', 'update')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index-uri pentru query-uri rapide
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_org_id ON notifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- ============================================================
-- 2. CREATE TABLE notification_preferences
-- ============================================================

CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_enabled BOOLEAN NOT NULL DEFAULT true,
  push_enabled BOOLEAN NOT NULL DEFAULT true,
  sms_enabled BOOLEAN NOT NULL DEFAULT false,
  whatsapp_enabled BOOLEAN NOT NULL DEFAULT false,
  alert_enabled BOOLEAN NOT NULL DEFAULT true,
  reminder_enabled BOOLEAN NOT NULL DEFAULT true,
  system_enabled BOOLEAN NOT NULL DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT notification_preferences_user_unique UNIQUE (user_id)
);

-- Index pentru căutări rapide
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);

-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Activează RLS pe ambele tabele
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- RLS Policies pentru NOTIFICATIONS
-- ─────────────────────────────────────────────────────────────

-- Policy: User poate citi propriile notificări
CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: System poate insera notificări (orice user autentificat poate crea)
-- În practică, doar backend/cron va crea notificări
CREATE POLICY "Authenticated users can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy: User poate actualiza propriile notificări (ex: mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: User poate șterge propriile notificări
CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────
-- RLS Policies pentru NOTIFICATION_PREFERENCES
-- ─────────────────────────────────────────────────────────────

-- Policy: User poate citi propriile preferințe
CREATE POLICY "Users can read own preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: User poate insera propriile preferințe
CREATE POLICY "Users can insert own preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: User poate actualiza propriile preferințe
CREATE POLICY "Users can update own preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: User poate șterge propriile preferințe
CREATE POLICY "Users can delete own preferences"
  ON notification_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 4. TRIGGER pentru updated_at pe notification_preferences
-- ============================================================

-- Function pentru auto-update updated_at
CREATE OR REPLACE FUNCTION update_notification_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trigger_notification_preferences_updated_at ON notification_preferences;
CREATE TRIGGER trigger_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_notification_preferences_updated_at();

-- ============================================================
-- 5. COMENTARII
-- ============================================================

COMMENT ON TABLE notifications IS 'Notificări in-app pentru utilizatori (alerte, reminders, system messages)';
COMMENT ON COLUMN notifications.type IS 'Tipul notificării: system, alert, reminder, approval, message, update';
COMMENT ON COLUMN notifications.priority IS 'Prioritate: low, medium, high, critical';
COMMENT ON COLUMN notifications.link IS 'Link opțional către pagina relevantă (ex: /dashboard/medical/123)';
COMMENT ON COLUMN notifications.metadata IS 'Date adiționale JSON (ex: entity_id, entity_type, etc.)';

COMMENT ON TABLE notification_preferences IS 'Preferințe notificări per utilizator (canale activare, quiet hours)';
COMMENT ON COLUMN notification_preferences.quiet_hours_start IS 'Ora de start pentru quiet hours (ex: 22:00)';
COMMENT ON COLUMN notification_preferences.quiet_hours_end IS 'Ora de final pentru quiet hours (ex: 08:00)';
