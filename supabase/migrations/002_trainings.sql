-- Migration: 002_trainings.sql
-- Description: Create trainings and training_participants tables with foreign keys, RLS, and indexes
-- Author: Claude
-- Date: 2026-02-13

-- =====================================================
-- TABLE: trainings
-- =====================================================

CREATE TABLE trainings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    training_type VARCHAR(50) NOT NULL CHECK (training_type IN ('ssm', 'psi', 'prim_ajutor', 'altele')),
    trainer_name VARCHAR(255),
    location VARCHAR(255),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours DECIMAL(4,2),
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for trainings
CREATE INDEX idx_trainings_organization_id ON trainings(organization_id);
CREATE INDEX idx_trainings_scheduled_date ON trainings(scheduled_date);
CREATE INDEX idx_trainings_status ON trainings(status);
CREATE INDEX idx_trainings_training_type ON trainings(training_type);
CREATE INDEX idx_trainings_created_by ON trainings(created_by);
CREATE INDEX idx_trainings_deleted_at ON trainings(deleted_at) WHERE deleted_at IS NULL;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_trainings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_trainings_updated_at
    BEFORE UPDATE ON trainings
    FOR EACH ROW
    EXECUTE FUNCTION update_trainings_updated_at();

-- =====================================================
-- TABLE: training_participants
-- =====================================================

CREATE TABLE training_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    training_id UUID NOT NULL REFERENCES trainings(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_status VARCHAR(50) NOT NULL DEFAULT 'registered' CHECK (attendance_status IN ('registered', 'present', 'absent', 'excused')),
    completion_status VARCHAR(50) DEFAULT 'pending' CHECK (completion_status IN ('pending', 'passed', 'failed')),
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_number VARCHAR(100),
    certificate_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(training_id, employee_id)
);

-- Indexes for training_participants
CREATE INDEX idx_training_participants_training_id ON training_participants(training_id);
CREATE INDEX idx_training_participants_employee_id ON training_participants(employee_id);
CREATE INDEX idx_training_participants_attendance_status ON training_participants(attendance_status);
CREATE INDEX idx_training_participants_completion_status ON training_participants(completion_status);
CREATE INDEX idx_training_participants_deleted_at ON training_participants(deleted_at) WHERE deleted_at IS NULL;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_training_participants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_training_participants_updated_at
    BEFORE UPDATE ON training_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_training_participants_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on trainings
ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view trainings from their organizations
CREATE POLICY "Users can view trainings from their organizations"
    ON trainings
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- Policy: Consultants and admins can insert trainings
CREATE POLICY "Consultants and admins can insert trainings"
    ON trainings
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
            AND deleted_at IS NULL
        )
    );

-- Policy: Consultants and admins can update trainings
CREATE POLICY "Consultants and admins can update trainings"
    ON trainings
    FOR UPDATE
    USING (
        organization_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
            AND deleted_at IS NULL
        )
    )
    WITH CHECK (
        organization_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
            AND deleted_at IS NULL
        )
    );

-- Policy: Consultants can soft delete trainings
CREATE POLICY "Consultants can soft delete trainings"
    ON trainings
    FOR UPDATE
    USING (
        organization_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role = 'consultant'
            AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- Enable RLS on training_participants
ALTER TABLE training_participants ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view participants from their organization's trainings
CREATE POLICY "Users can view participants from their organization trainings"
    ON training_participants
    FOR SELECT
    USING (
        training_id IN (
            SELECT id
            FROM trainings
            WHERE organization_id IN (
                SELECT organization_id
                FROM memberships
                WHERE user_id = auth.uid()
                AND deleted_at IS NULL
            )
            AND deleted_at IS NULL
        )
        AND deleted_at IS NULL
    );

-- Policy: Consultants and admins can insert participants
CREATE POLICY "Consultants and admins can insert participants"
    ON training_participants
    FOR INSERT
    WITH CHECK (
        training_id IN (
            SELECT t.id
            FROM trainings t
            JOIN memberships m ON m.organization_id = t.organization_id
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
            AND m.deleted_at IS NULL
            AND t.deleted_at IS NULL
        )
    );

-- Policy: Consultants and admins can update participants
CREATE POLICY "Consultants and admins can update participants"
    ON training_participants
    FOR UPDATE
    USING (
        training_id IN (
            SELECT t.id
            FROM trainings t
            JOIN memberships m ON m.organization_id = t.organization_id
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
            AND m.deleted_at IS NULL
            AND t.deleted_at IS NULL
        )
    )
    WITH CHECK (
        training_id IN (
            SELECT t.id
            FROM trainings t
            JOIN memberships m ON m.organization_id = t.organization_id
            WHERE m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
            AND m.deleted_at IS NULL
            AND t.deleted_at IS NULL
        )
    );

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE trainings IS 'Training sessions for SSM/PSI compliance';
COMMENT ON TABLE training_participants IS 'Employees participating in training sessions';

COMMENT ON COLUMN trainings.training_type IS 'Type: ssm, psi, prim_ajutor, altele';
COMMENT ON COLUMN trainings.status IS 'Status: scheduled, completed, cancelled';
COMMENT ON COLUMN trainings.duration_hours IS 'Training duration in hours';

COMMENT ON COLUMN training_participants.attendance_status IS 'Status: registered, present, absent, excused';
COMMENT ON COLUMN training_participants.completion_status IS 'Status: pending, passed, failed';
COMMENT ON COLUMN training_participants.certificate_issued IS 'Whether certificate was issued';
