-- Migration: Create push_subscriptions table for web push notifications
-- Description: Stores web push subscription endpoints and keys for browser notifications

-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    keys_p256dh TEXT NOT NULL,
    keys_auth TEXT NOT NULL,
    device_info JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);

-- Create index on is_active for filtering active subscriptions
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_is_active ON push_subscriptions(is_active);

-- Enable Row Level Security
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own push subscriptions
CREATE POLICY "Users can view own push subscriptions"
    ON push_subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own push subscriptions
CREATE POLICY "Users can insert own push subscriptions"
    ON push_subscriptions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own push subscriptions
CREATE POLICY "Users can update own push subscriptions"
    ON push_subscriptions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own push subscriptions
CREATE POLICY "Users can delete own push subscriptions"
    ON push_subscriptions
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_push_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_push_subscriptions_updated_at
    BEFORE UPDATE ON push_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_push_subscriptions_updated_at();

-- Add comment to table
COMMENT ON TABLE push_subscriptions IS 'Stores web push notification subscriptions for users';
COMMENT ON COLUMN push_subscriptions.endpoint IS 'Push service endpoint URL';
COMMENT ON COLUMN push_subscriptions.keys_p256dh IS 'P-256 ECDH public key for encryption';
COMMENT ON COLUMN push_subscriptions.keys_auth IS 'Authentication secret for push messages';
COMMENT ON COLUMN push_subscriptions.device_info IS 'Optional device/browser information (user agent, device name, etc.)';
COMMENT ON COLUMN push_subscriptions.is_active IS 'Whether this subscription is currently active';
