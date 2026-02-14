-- Migration: Create prevention plans tables
-- Description: Tables for annual prevention plans linked to risk assessments
-- Date: 2026-02-14

-- =====================================================
-- Table: prevention_plans
-- Description: Annual prevention plans based on risk assessments
-- =====================================================
CREATE TABLE prevention_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    risk_assessment_id UUID REFERENCES risk_assessments(id) ON DELETE SET NULL,
    year INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT unique_org_year UNIQUE (org_id, year, deleted_at),
    CONSTRAINT valid_year CHECK (year >= 2020 AND year <= 2100),
    CONSTRAINT approved_requires_approver CHECK (
        (approved_at IS NULL AND approved_by IS NULL) OR
        (approved_at IS NOT NULL AND approved_by IS NOT NULL)
    )
);

-- Index for common queries
CREATE INDEX idx_prevention_plans_org_id ON prevention_plans(org_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_prevention_plans_year ON prevention_plans(year) WHERE deleted_at IS NULL;
CREATE INDEX idx_prevention_plans_status ON prevention_plans(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_prevention_plans_risk_assessment ON prevention_plans(risk_assessment_id) WHERE deleted_at IS NULL;

-- =====================================================
-- Table: prevention_plan_measures
-- Description: Individual measures/actions within a prevention plan
-- =====================================================
CREATE TABLE prevention_plan_measures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES prevention_plans(id) ON DELETE CASCADE,
    risk_item_id UUID REFERENCES risk_assessment_items(id) ON DELETE SET NULL,
    measure_type TEXT NOT NULL CHECK (measure_type IN ('technical', 'organizational', 'hygiene')),
    description TEXT NOT NULL,
    responsible TEXT NOT NULL,
    deadline DATE NOT NULL,
    resources TEXT,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT completed_requires_date CHECK (
        (status = 'completed' AND completed_at IS NOT NULL) OR
        (status != 'completed' AND completed_at IS NULL)
    ),
    CONSTRAINT valid_deadline CHECK (deadline >= DATE '2020-01-01')
);

-- Indexes for common queries
CREATE INDEX idx_prevention_plan_measures_plan_id ON prevention_plan_measures(plan_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_prevention_plan_measures_status ON prevention_plan_measures(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_prevention_plan_measures_deadline ON prevention_plan_measures(deadline) WHERE deleted_at IS NULL;
CREATE INDEX idx_prevention_plan_measures_risk_item ON prevention_plan_measures(risk_item_id) WHERE deleted_at IS NULL;

-- =====================================================
-- Triggers for updated_at
-- =====================================================
CREATE TRIGGER update_prevention_plans_updated_at
    BEFORE UPDATE ON prevention_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prevention_plan_measures_updated_at
    BEFORE UPDATE ON prevention_plan_measures
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS Policies for prevention_plans
-- =====================================================
ALTER TABLE prevention_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view prevention plans from their organization
CREATE POLICY "Users can view own org prevention plans"
    ON prevention_plans
    FOR SELECT
    USING (
        deleted_at IS NULL
        AND org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- Policy: Consultants and admins can insert prevention plans
CREATE POLICY "Consultants can insert prevention plans"
    ON prevention_plans
    FOR INSERT
    WITH CHECK (
        org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
            AND deleted_at IS NULL
        )
    );

-- Policy: Consultants and admins can update prevention plans
CREATE POLICY "Consultants can update prevention plans"
    ON prevention_plans
    FOR UPDATE
    USING (
        deleted_at IS NULL
        AND org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
            AND deleted_at IS NULL
        )
    )
    WITH CHECK (
        org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
            AND deleted_at IS NULL
        )
    );

-- Policy: Consultants and admins can soft delete prevention plans
CREATE POLICY "Consultants can delete prevention plans"
    ON prevention_plans
    FOR UPDATE
    USING (
        org_id IN (
            SELECT org_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
            AND deleted_at IS NULL
        )
    )
    WITH CHECK (deleted_at IS NOT NULL);

-- =====================================================
-- RLS Policies for prevention_plan_measures
-- =====================================================
ALTER TABLE prevention_plan_measures ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view measures from their organization's plans
CREATE POLICY "Users can view own org measures"
    ON prevention_plan_measures
    FOR SELECT
    USING (
        deleted_at IS NULL
        AND plan_id IN (
            SELECT id
            FROM prevention_plans
            WHERE org_id IN (
                SELECT org_id
                FROM memberships
                WHERE user_id = auth.uid()
                AND deleted_at IS NULL
            )
            AND deleted_at IS NULL
        )
    );

-- Policy: Consultants and admins can insert measures
CREATE POLICY "Consultants can insert measures"
    ON prevention_plan_measures
    FOR INSERT
    WITH CHECK (
        plan_id IN (
            SELECT id
            FROM prevention_plans
            WHERE org_id IN (
                SELECT org_id
                FROM memberships
                WHERE user_id = auth.uid()
                AND role IN ('consultant', 'firma_admin')
                AND deleted_at IS NULL
            )
            AND deleted_at IS NULL
        )
    );

-- Policy: Consultants and admins can update measures
CREATE POLICY "Consultants can update measures"
    ON prevention_plan_measures
    FOR UPDATE
    USING (
        deleted_at IS NULL
        AND plan_id IN (
            SELECT id
            FROM prevention_plans
            WHERE org_id IN (
                SELECT org_id
                FROM memberships
                WHERE user_id = auth.uid()
                AND role IN ('consultant', 'firma_admin')
                AND deleted_at IS NULL
            )
            AND deleted_at IS NULL
        )
    )
    WITH CHECK (
        plan_id IN (
            SELECT id
            FROM prevention_plans
            WHERE org_id IN (
                SELECT org_id
                FROM memberships
                WHERE user_id = auth.uid()
                AND role IN ('consultant', 'firma_admin')
                AND deleted_at IS NULL
            )
            AND deleted_at IS NULL
        )
    );

-- Policy: Consultants and admins can soft delete measures
CREATE POLICY "Consultants can delete measures"
    ON prevention_plan_measures
    FOR UPDATE
    USING (
        plan_id IN (
            SELECT id
            FROM prevention_plans
            WHERE org_id IN (
                SELECT org_id
                FROM memberships
                WHERE user_id = auth.uid()
                AND role IN ('consultant', 'firma_admin')
                AND deleted_at IS NULL
            )
            AND deleted_at IS NULL
        )
    )
    WITH CHECK (deleted_at IS NOT NULL);

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON TABLE prevention_plans IS 'Annual prevention and protection plans based on risk assessments';
COMMENT ON TABLE prevention_plan_measures IS 'Individual preventive and protective measures within a plan';

COMMENT ON COLUMN prevention_plans.status IS 'Plan status: draft (being edited), active (current year), archived (past year)';
COMMENT ON COLUMN prevention_plans.approved_by IS 'User who approved the plan (typically consultant or admin)';

COMMENT ON COLUMN prevention_plan_measures.measure_type IS 'Type: technical (equipment/systems), organizational (procedures), hygiene (health/safety)';
COMMENT ON COLUMN prevention_plan_measures.responsible IS 'Person/role responsible for implementing the measure';
COMMENT ON COLUMN prevention_plan_measures.resources IS 'Required resources (budget, equipment, personnel)';
COMMENT ON COLUMN prevention_plan_measures.status IS 'Implementation status: planned, in_progress, completed';
