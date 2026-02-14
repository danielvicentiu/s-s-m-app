-- Migration: Create employees table with RLS
-- Created: 2026-02-14
-- Description: Employees table for SSM/PSI compliance tracking

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    cnp TEXT,
    birth_date DATE,
    position TEXT,
    department TEXT,
    hire_date DATE,
    contract_type TEXT,
    is_active BOOLEAN DEFAULT true,
    risk_category TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create index on org_id for performance
CREATE INDEX IF NOT EXISTS idx_employees_org_id ON employees(org_id);

-- Create index on is_active for filtering active employees
CREATE INDEX IF NOT EXISTS idx_employees_is_active ON employees(is_active);

-- RLS Policy: SELECT - users can view employees from their organization
CREATE POLICY "Users can view employees from their organization"
    ON employees
    FOR SELECT
    USING (
        org_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
        )
    );

-- RLS Policy: INSERT - users can create employees in their organization
CREATE POLICY "Users can create employees in their organization"
    ON employees
    FOR INSERT
    WITH CHECK (
        org_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
        )
    );

-- RLS Policy: UPDATE - users can update employees in their organization
CREATE POLICY "Users can update employees in their organization"
    ON employees
    FOR UPDATE
    USING (
        org_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
        )
    )
    WITH CHECK (
        org_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
        )
    );

-- RLS Policy: DELETE - users can delete employees in their organization
CREATE POLICY "Users can delete employees in their organization"
    ON employees
    FOR DELETE
    USING (
        org_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
        )
    );

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_employees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_employees_updated_at();

-- Add comments for documentation
COMMENT ON TABLE employees IS 'Employees table for tracking company personnel for SSM/PSI compliance';
COMMENT ON COLUMN employees.org_id IS 'Reference to the organization this employee belongs to';
COMMENT ON COLUMN employees.cnp IS 'Romanian personal identification number (Cod Numeric Personal)';
COMMENT ON COLUMN employees.risk_category IS 'SSM risk category classification';
COMMENT ON COLUMN employees.is_active IS 'Whether the employee is currently active in the organization';
