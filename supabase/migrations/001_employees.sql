-- Migration: 001_employees.sql
-- Description: Create employees table with RLS policies and indexes
-- Created: 2026-02-13

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    cnp VARCHAR(13) UNIQUE,
    email TEXT,
    phone TEXT,
    job_title TEXT,
    department TEXT,
    hire_date DATE,
    contract_type TEXT CHECK (contract_type IN ('permanent', 'temporary', 'internship', 'part_time')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX idx_employees_org_id ON employees(org_id);
CREATE INDEX idx_employees_cnp ON employees(cnp) WHERE cnp IS NOT NULL;
CREATE INDEX idx_employees_email ON employees(email) WHERE email IS NOT NULL;
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_created_at ON employees(created_at DESC);
CREATE INDEX idx_employees_deleted_at ON employees(deleted_at) WHERE deleted_at IS NULL;

-- Create composite index for common queries
CREATE INDEX idx_employees_org_status ON employees(org_id, status) WHERE deleted_at IS NULL;

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view employees from their organization
CREATE POLICY "Users can view employees from their organization"
    ON employees
    FOR SELECT
    USING (
        org_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- RLS Policy: Consultants and admins can insert employees
CREATE POLICY "Consultants and admins can insert employees"
    ON employees
    FOR INSERT
    WITH CHECK (
        org_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
            AND deleted_at IS NULL
        )
    );

-- RLS Policy: Consultants and admins can update employees
CREATE POLICY "Consultants and admins can update employees"
    ON employees
    FOR UPDATE
    USING (
        org_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
            AND deleted_at IS NULL
        )
    )
    WITH CHECK (
        org_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role IN ('consultant', 'firma_admin')
            AND deleted_at IS NULL
        )
    );

-- RLS Policy: Consultants can soft delete employees (set deleted_at)
CREATE POLICY "Consultants can delete employees"
    ON employees
    FOR UPDATE
    USING (
        org_id IN (
            SELECT organization_id
            FROM memberships
            WHERE user_id = auth.uid()
            AND role = 'consultant'
            AND deleted_at IS NULL
        )
    );

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_employees_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_employees_updated_at();

-- Add comment to table
COMMENT ON TABLE employees IS 'Employees table for SSM/PSI compliance platform - stores employee information per organization';
COMMENT ON COLUMN employees.cnp IS 'Romanian personal identification number (Cod Numeric Personal)';
COMMENT ON COLUMN employees.contract_type IS 'Type of employment contract: permanent, temporary, internship, part_time';
COMMENT ON COLUMN employees.status IS 'Employee status: active, inactive, terminated';
COMMENT ON COLUMN employees.deleted_at IS 'Soft delete timestamp - NULL means active record';
