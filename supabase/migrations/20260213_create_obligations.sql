-- Migration: Create obligations table
-- Description: Stores legal obligations extracted from legislation with deadlines and penalties
-- Date: 2026-02-13

-- Create obligations table
CREATE TABLE IF NOT EXISTS obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legislation_id UUID NOT NULL REFERENCES legislations(id) ON DELETE CASCADE,
    article TEXT NOT NULL,
    obligation_text TEXT NOT NULL,
    category TEXT,
    deadline_type TEXT CHECK (deadline_type IN ('one_time', 'recurring')),
    frequency TEXT,
    penalty_min DECIMAL(10, 2),
    penalty_max DECIMAL(10, 2),
    penalty_currency TEXT DEFAULT 'RON',
    applicable_industries JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on legislation_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_obligations_legislation_id ON obligations(legislation_id);

-- Create index on deadline_type for filtering
CREATE INDEX IF NOT EXISTS idx_obligations_deadline_type ON obligations(deadline_type);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_obligations_category ON obligations(category);

-- Add RLS (Row Level Security)
ALTER TABLE obligations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view obligations for their organization's legislations
CREATE POLICY "Users can view obligations for their organization"
    ON obligations
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM legislations l
            INNER JOIN memberships m ON m.organization_id = l.organization_id
            WHERE l.id = obligations.legislation_id
            AND m.user_id = auth.uid()
        )
    );

-- Policy: Consultants and admins can insert obligations
CREATE POLICY "Consultants and admins can insert obligations"
    ON obligations
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM legislations l
            INNER JOIN memberships m ON m.organization_id = l.organization_id
            WHERE l.id = obligations.legislation_id
            AND m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- Policy: Consultants and admins can update obligations
CREATE POLICY "Consultants and admins can update obligations"
    ON obligations
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM legislations l
            INNER JOIN memberships m ON m.organization_id = l.organization_id
            WHERE l.id = obligations.legislation_id
            AND m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- Policy: Consultants and admins can delete obligations
CREATE POLICY "Consultants and admins can delete obligations"
    ON obligations
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM legislations l
            INNER JOIN memberships m ON m.organization_id = l.organization_id
            WHERE l.id = obligations.legislation_id
            AND m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_obligations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_obligations_updated_at
    BEFORE UPDATE ON obligations
    FOR EACH ROW
    EXECUTE FUNCTION update_obligations_updated_at();

-- Add comments for documentation
COMMENT ON TABLE obligations IS 'Legal obligations extracted from legislation with deadlines and penalties';
COMMENT ON COLUMN obligations.legislation_id IS 'Reference to the source legislation';
COMMENT ON COLUMN obligations.article IS 'Article or section reference from legislation';
COMMENT ON COLUMN obligations.obligation_text IS 'Full text of the obligation';
COMMENT ON COLUMN obligations.category IS 'Category of obligation (e.g., training, documentation, inspection)';
COMMENT ON COLUMN obligations.deadline_type IS 'Type of deadline: one_time or recurring';
COMMENT ON COLUMN obligations.frequency IS 'Frequency for recurring obligations (e.g., annual, monthly)';
COMMENT ON COLUMN obligations.penalty_min IS 'Minimum penalty amount';
COMMENT ON COLUMN obligations.penalty_max IS 'Maximum penalty amount';
COMMENT ON COLUMN obligations.penalty_currency IS 'Currency code for penalties (default: RON)';
COMMENT ON COLUMN obligations.applicable_industries IS 'JSON array of industry codes this obligation applies to';
