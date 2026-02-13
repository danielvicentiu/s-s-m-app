-- Migration 007: Notifications System
-- Created: 2026-02-13
-- Description: Adds notifications table and notification_preferences table with RLS policies

-- ============================================================================
-- TABLE: notifications
-- ============================================================================
-- Stores all user notifications (alerts, reminders, system messages)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,

    -- Notification content
    type VARCHAR(50) NOT NULL, -- 'alert', 'reminder', 'system', 'training', 'medical', 'equipment', 'document'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,

    -- Linking to related entities (optional)
    related_entity_type VARCHAR(50), -- 'training', 'medical_record', 'equipment', 'document', 'penalty', etc.
    related_entity_id UUID,

    -- Status
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,

    -- Priority
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'

    -- Delivery channels
    sent_email BOOLEAN DEFAULT false,
    sent_push BOOLEAN DEFAULT false,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Soft delete
    deleted_at TIMESTAMPTZ,

    -- Indexes
    CONSTRAINT notifications_type_check CHECK (type IN ('alert', 'reminder', 'system', 'training', 'medical', 'equipment', 'document', 'penalty', 'other')),
    CONSTRAINT notifications_priority_check CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_organization_id ON public.notifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_related_entity ON public.notifications(related_entity_type, related_entity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_deleted_at ON public.notifications(deleted_at) WHERE deleted_at IS NOT NULL;

-- Updated_at trigger
CREATE OR REPLACE TRIGGER notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- TABLE: notification_preferences
-- ============================================================================
-- Stores user preferences for receiving notifications
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Email preferences
    email_enabled BOOLEAN NOT NULL DEFAULT true,
    email_alerts BOOLEAN NOT NULL DEFAULT true,
    email_reminders BOOLEAN NOT NULL DEFAULT true,
    email_system BOOLEAN NOT NULL DEFAULT true,
    email_digest BOOLEAN NOT NULL DEFAULT false, -- Daily/weekly digest
    email_digest_frequency VARCHAR(20) DEFAULT 'daily', -- 'daily', 'weekly'

    -- Push notification preferences
    push_enabled BOOLEAN NOT NULL DEFAULT true,
    push_alerts BOOLEAN NOT NULL DEFAULT true,
    push_reminders BOOLEAN NOT NULL DEFAULT true,
    push_system BOOLEAN NOT NULL DEFAULT false,

    -- In-app notification preferences
    in_app_enabled BOOLEAN NOT NULL DEFAULT true,

    -- Quiet hours
    quiet_hours_enabled BOOLEAN DEFAULT false,
    quiet_hours_start TIME, -- e.g., '22:00:00'
    quiet_hours_end TIME,   -- e.g., '08:00:00'

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    UNIQUE(user_id),
    CONSTRAINT notification_preferences_digest_check CHECK (email_digest_frequency IN ('daily', 'weekly', 'monthly'))
);

-- Index for user lookup
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON public.notification_preferences(user_id);

-- Updated_at trigger
CREATE OR REPLACE TRIGGER notification_preferences_updated_at
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- RLS POLICIES: notifications
-- ============================================================================

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
    ON public.notifications
    FOR SELECT
    USING (
        auth.uid() = user_id
        AND deleted_at IS NULL
    );

-- Policy: Users can insert their own notifications (for system-generated notifications)
CREATE POLICY "Users can insert their own notifications"
    ON public.notifications
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
    );

-- Policy: Users can update their own notifications (mark as read, etc.)
CREATE POLICY "Users can update their own notifications"
    ON public.notifications
    FOR UPDATE
    USING (
        auth.uid() = user_id
        AND deleted_at IS NULL
    )
    WITH CHECK (
        auth.uid() = user_id
    );

-- Policy: Users can soft delete their own notifications
CREATE POLICY "Users can soft delete their own notifications"
    ON public.notifications
    FOR UPDATE
    USING (
        auth.uid() = user_id
        AND deleted_at IS NULL
    )
    WITH CHECK (
        auth.uid() = user_id
        AND deleted_at IS NOT NULL
    );

-- ============================================================================
-- RLS POLICIES: notification_preferences
-- ============================================================================

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own preferences
CREATE POLICY "Users can view their own notification preferences"
    ON public.notification_preferences
    FOR SELECT
    USING (
        auth.uid() = user_id
    );

-- Policy: Users can insert their own preferences
CREATE POLICY "Users can insert their own notification preferences"
    ON public.notification_preferences
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
    );

-- Policy: Users can update their own preferences
CREATE POLICY "Users can update their own notification preferences"
    ON public.notification_preferences
    FOR UPDATE
    USING (
        auth.uid() = user_id
    )
    WITH CHECK (
        auth.uid() = user_id
    );

-- Policy: Users can delete their own preferences
CREATE POLICY "Users can delete their own notification preferences"
    ON public.notification_preferences
    FOR DELETE
    USING (
        auth.uid() = user_id
    );

-- ============================================================================
-- FUNCTIONS: Helper functions for notifications
-- ============================================================================

-- Function: Create default notification preferences for new users
CREATE OR REPLACE FUNCTION public.create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notification_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Auto-create notification preferences when user is created
CREATE OR REPLACE TRIGGER on_auth_user_created_notification_preferences
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_default_notification_preferences();

-- Function: Mark notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.notifications
    SET is_read = true,
        read_at = now(),
        updated_at = now()
    WHERE id = notification_id
      AND user_id = auth.uid()
      AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Mark all notifications as read for current user
CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS VOID AS $$
BEGIN
    UPDATE public.notifications
    SET is_read = true,
        read_at = now(),
        updated_at = now()
    WHERE user_id = auth.uid()
      AND is_read = false
      AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get unread notification count for current user
CREATE OR REPLACE FUNCTION public.get_unread_notification_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM public.notifications
        WHERE user_id = auth.uid()
          AND is_read = false
          AND deleted_at IS NULL
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.notifications IS 'Stores all user notifications with RLS per user';
COMMENT ON TABLE public.notification_preferences IS 'Stores user notification delivery preferences with RLS per user';
COMMENT ON COLUMN public.notifications.type IS 'Type of notification: alert, reminder, system, training, medical, equipment, document, penalty, other';
COMMENT ON COLUMN public.notifications.priority IS 'Priority level: low, normal, high, urgent';
COMMENT ON COLUMN public.notifications.related_entity_type IS 'Type of related entity (optional): training, medical_record, equipment, document, penalty, etc.';
COMMENT ON COLUMN public.notifications.related_entity_id IS 'UUID of related entity (optional)';
COMMENT ON FUNCTION public.mark_notification_read IS 'Mark a single notification as read for the current user';
COMMENT ON FUNCTION public.mark_all_notifications_read IS 'Mark all unread notifications as read for the current user';
COMMENT ON FUNCTION public.get_unread_notification_count IS 'Get count of unread notifications for the current user';
