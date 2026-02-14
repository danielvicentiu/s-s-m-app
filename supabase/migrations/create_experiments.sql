-- Migration: A/B Testing Infrastructure
-- Created: 2026-02-14
-- Description: Tables for experiments, user assignments, and conversion tracking

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Experiments table
-- Stores experiment configurations and status
CREATE TABLE IF NOT EXISTS experiments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    variants JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- variants format: [{"key": "control", "weight": 50}, {"key": "variant_a", "weight": 50}]
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    CONSTRAINT valid_variants CHECK (jsonb_typeof(variants) = 'array'),
    CONSTRAINT valid_dates CHECK (end_date IS NULL OR end_date > start_date)
);

-- Experiment assignments table
-- Tracks which variant each user was assigned to
CREATE TABLE IF NOT EXISTS experiment_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    variant TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Each user can only be assigned to one variant per experiment
    UNIQUE(experiment_id, user_id)
);

-- Experiment conversions table
-- Tracks conversion events for each user/variant combination
CREATE TABLE IF NOT EXISTS experiment_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    variant TEXT NOT NULL,
    event TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_experiments_status ON experiments(status);
CREATE INDEX IF NOT EXISTS idx_experiments_created_at ON experiments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experiment_assignments_experiment ON experiment_assignments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_experiment_assignments_user ON experiment_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_experiment_conversions_experiment ON experiment_conversions(experiment_id);
CREATE INDEX IF NOT EXISTS idx_experiment_conversions_user ON experiment_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_experiment_conversions_variant ON experiment_conversions(experiment_id, variant);
CREATE INDEX IF NOT EXISTS idx_experiment_conversions_event ON experiment_conversions(experiment_id, event);

-- Updated_at trigger for experiments
CREATE OR REPLACE FUNCTION update_experiments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_experiments_updated_at
    BEFORE UPDATE ON experiments
    FOR EACH ROW
    EXECUTE FUNCTION update_experiments_updated_at();

-- Row Level Security (RLS)
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_conversions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for experiments
-- Admins and consultants can view all experiments
CREATE POLICY "Authenticated users can view experiments"
    ON experiments FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can create/update experiments
CREATE POLICY "Admins can manage experiments"
    ON experiments FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM memberships m
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- RLS Policies for experiment_assignments
-- Users can view their own assignments
CREATE POLICY "Users can view own assignments"
    ON experiment_assignments FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Admins can view all assignments
CREATE POLICY "Admins can view all assignments"
    ON experiment_assignments FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM memberships m
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- System can insert assignments (handled by application logic)
CREATE POLICY "System can create assignments"
    ON experiment_assignments FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- RLS Policies for experiment_conversions
-- Users can view their own conversions
CREATE POLICY "Users can view own conversions"
    ON experiment_conversions FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Admins can view all conversions
CREATE POLICY "Admins can view all conversions"
    ON experiment_conversions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM memberships m
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- System can insert conversions
CREATE POLICY "System can create conversions"
    ON experiment_conversions FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Comments for documentation
COMMENT ON TABLE experiments IS 'Stores A/B test experiment configurations';
COMMENT ON TABLE experiment_assignments IS 'Tracks which variant each user is assigned to';
COMMENT ON TABLE experiment_conversions IS 'Records conversion events for experiment tracking';
COMMENT ON COLUMN experiments.variants IS 'JSONB array of variant objects with key and weight properties';
COMMENT ON COLUMN experiments.status IS 'Experiment status: active, paused, or completed';
