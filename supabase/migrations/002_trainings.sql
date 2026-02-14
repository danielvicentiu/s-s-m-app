-- Migration: Training management system
-- Description: Creates tables for trainings and training participants
-- Author: Claude
-- Date: 2026-02-14

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: trainings
-- Stores training sessions organized by companies
CREATE TABLE IF NOT EXISTS trainings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('ssm', 'psi', 'first_aid', 'other')),
    date DATE NOT NULL,
    duration_hours DECIMAL(4,2) NOT NULL CHECK (duration_hours > 0),
    trainer_name TEXT NOT NULL,
    topics TEXT[] NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Table: training_participants
-- Links employees to training sessions with their status and scores
CREATE TABLE IF NOT EXISTS training_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'attended', 'absent', 'excused')),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(training_id, employee_id)
);

-- Indexes for better query performance
CREATE INDEX idx_trainings_org_id ON trainings(org_id);
CREATE INDEX idx_trainings_date ON trainings(date);
CREATE INDEX idx_trainings_status ON trainings(status);
CREATE INDEX idx_trainings_type ON trainings(type);
CREATE INDEX idx_trainings_deleted_at ON trainings(deleted_at);

CREATE INDEX idx_training_participants_training_id ON training_participants(training_id);
CREATE INDEX idx_training_participants_employee_id ON training_participants(employee_id);
CREATE INDEX idx_training_participants_status ON training_participants(status);

-- Trigger: Update updated_at timestamp for trainings
CREATE OR REPLACE FUNCTION update_trainings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trainings_updated_at
    BEFORE UPDATE ON trainings
    FOR EACH ROW
    EXECUTE FUNCTION update_trainings_updated_at();

-- Trigger: Update updated_at timestamp for training_participants
CREATE OR REPLACE FUNCTION update_training_participants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER training_participants_updated_at
    BEFORE UPDATE ON training_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_training_participants_updated_at();

-- Enable Row Level Security
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trainings table

-- Policy: Users can view trainings from their organization (excluding soft-deleted)
CREATE POLICY "Users can view trainings from their organization"
    ON trainings
    FOR SELECT
    USING (
        deleted_at IS NULL
        AND org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
        )
    );

-- Policy: Consultants and admins can insert trainings
CREATE POLICY "Consultants and admins can insert trainings"
    ON trainings
    FOR INSERT
    WITH CHECK (
        org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
        )
    );

-- Policy: Consultants and admins can update trainings
CREATE POLICY "Consultants and admins can update trainings"
    ON trainings
    FOR UPDATE
    USING (
        deleted_at IS NULL
        AND org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
        )
    )
    WITH CHECK (
        org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
        )
    );

-- Policy: Consultants and admins can soft delete trainings
CREATE POLICY "Consultants and admins can delete trainings"
    ON trainings
    FOR UPDATE
    USING (
        org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
        )
    );

-- RLS Policies for training_participants table

-- Policy: Users can view participants from their organization's trainings
CREATE POLICY "Users can view training participants from their organization"
    ON training_participants
    FOR SELECT
    USING (
        training_id IN (
            SELECT id
            FROM trainings
            WHERE deleted_at IS NULL
            AND org_id IN (
                SELECT org_id
                FROM memberships
                WHERE user_id = auth.uid()
            )
        )
    );

-- Policy: Consultants and admins can insert participants
CREATE POLICY "Consultants and admins can insert training participants"
    ON training_participants
    FOR INSERT
    WITH CHECK (
        training_id IN (
            SELECT id
            FROM trainings
            WHERE deleted_at IS NULL
            AND org_id IN (
                SELECT org_id
                FROM memberships
                WHERE user_id = auth.uid()
                AND role IN ('consultant', 'firma_admin')
            )
        )
    );

-- Policy: Consultants and admins can update participants
CREATE POLICY "Consultants and admins can update training participants"
    ON training_participants
    FOR UPDATE
    USING (
        training_id IN (
            SELECT id
            FROM trainings
            WHERE deleted_at IS NULL
            AND org_id IN (
                SELECT org_id
                FROM memberships
                WHERE user_id = auth.uid()
                AND role IN ('consultant', 'firma_admin')
            )
        )
    )
    WITH CHECK (
        training_id IN (
            SELECT id
            FROM trainings
            WHERE deleted_at IS NULL
            AND org_id IN (
                SELECT org_id
                FROM memberships
                WHERE user_id = auth.uid()
                AND role IN ('consultant', 'firma_admin')
            )
        )
    );

-- Policy: Consultants and admins can delete participants
CREATE POLICY "Consultants and admins can delete training participants"
    ON training_participants
    FOR DELETE
    USING (
        training_id IN (
            SELECT id
            FROM trainings
            WHERE deleted_at IS NULL
            AND org_id IN (
                SELECT org_id
                FROM memberships
                WHERE user_id = auth.uid()
                AND role IN ('consultant', 'firma_admin')
            )
        )
    );

-- Comments for documentation
COMMENT ON TABLE trainings IS 'Stores training sessions for SSM, PSI, first aid and other workplace training';
COMMENT ON TABLE training_participants IS 'Links employees to training sessions with attendance status and scores';

COMMENT ON COLUMN trainings.type IS 'Training type: ssm (workplace safety), psi (fire safety), first_aid, other';
COMMENT ON COLUMN trainings.status IS 'Training status: planned, completed, cancelled';
COMMENT ON COLUMN trainings.duration_hours IS 'Duration in hours (can be decimal, e.g., 1.5)';
COMMENT ON COLUMN trainings.topics IS 'Array of training topics covered';
COMMENT ON COLUMN trainings.deleted_at IS 'Soft delete timestamp';

COMMENT ON COLUMN training_participants.status IS 'Participant status: registered, attended, absent, excused';
COMMENT ON COLUMN training_participants.score IS 'Test score (0-100), nullable if no test was given';
