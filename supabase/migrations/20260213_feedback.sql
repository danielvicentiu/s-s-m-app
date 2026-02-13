-- Create feedback table for user feedback collection
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    category TEXT NOT NULL CHECK (category IN ('bug', 'feature_request', 'general')),
    comment TEXT,
    screenshot_url TEXT,
    user_agent TEXT,
    page_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own feedback
CREATE POLICY "Users can insert their own feedback"
    ON public.feedback
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own feedback
CREATE POLICY "Users can view their own feedback"
    ON public.feedback
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy: Organization admins can view all feedback from their organization
CREATE POLICY "Organization admins can view organization feedback"
    ON public.feedback
    FOR SELECT
    TO authenticated
    USING (
        organization_id IN (
            SELECT organization_id
            FROM public.memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
        )
    );

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_organization_id ON public.feedback(organization_id);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON public.feedback(created_at DESC);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_feedback_updated_at
    BEFORE UPDATE ON public.feedback
    FOR EACH ROW
    EXECUTE FUNCTION update_feedback_updated_at();

-- Add comment
COMMENT ON TABLE public.feedback IS 'User feedback collection for bugs, feature requests, and general comments';
