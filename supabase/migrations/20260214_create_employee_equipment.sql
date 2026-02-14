-- Migration: Create employee_equipment junction table
-- Description: Links employees to EIP catalog equipment with assignment tracking
-- Date: 2026-02-14

-- Create enum for equipment condition
CREATE TYPE equipment_condition AS ENUM ('good', 'fair', 'poor');

-- Create employee_equipment junction table
CREATE TABLE IF NOT EXISTS employee_equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    equipment_type_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    assigned_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    return_date TIMESTAMP WITH TIME ZONE,
    condition_on_assign equipment_condition NOT NULL DEFAULT 'good',
    condition_on_return equipment_condition,
    assigned_by UUID NOT NULL REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT valid_return_date CHECK (return_date IS NULL OR return_date >= assigned_date),
    CONSTRAINT return_condition_required CHECK (
        (return_date IS NULL AND condition_on_return IS NULL) OR
        (return_date IS NOT NULL AND condition_on_return IS NOT NULL)
    )
);

-- Create indexes for performance
CREATE INDEX idx_employee_equipment_employee ON employee_equipment(employee_id);
CREATE INDEX idx_employee_equipment_type ON employee_equipment(equipment_type_id);
CREATE INDEX idx_employee_equipment_assigned_by ON employee_equipment(assigned_by);
CREATE INDEX idx_employee_equipment_dates ON employee_equipment(assigned_date, return_date);

-- Enable RLS
ALTER TABLE employee_equipment ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Access through employee's organization
-- Policy: Users can view equipment assignments for employees in their organization
CREATE POLICY "Users can view employee equipment in their org"
    ON employee_equipment
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM employees e
            JOIN memberships m ON e.organization_id = m.organization_id
            WHERE e.id = employee_equipment.employee_id
            AND m.user_id = auth.uid()
        )
    );

-- Policy: Consultants and admins can assign equipment
CREATE POLICY "Consultants and admins can assign equipment"
    ON employee_equipment
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM employees e
            JOIN memberships m ON e.organization_id = m.organization_id
            WHERE e.id = employee_equipment.employee_id
            AND m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- Policy: Consultants and admins can update equipment assignments
CREATE POLICY "Consultants and admins can update employee equipment"
    ON employee_equipment
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM employees e
            JOIN memberships m ON e.organization_id = m.organization_id
            WHERE e.id = employee_equipment.employee_id
            AND m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM employees e
            JOIN memberships m ON e.organization_id = m.organization_id
            WHERE e.id = employee_equipment.employee_id
            AND m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- Policy: Consultants and admins can delete equipment assignments
CREATE POLICY "Consultants and admins can delete employee equipment"
    ON employee_equipment
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM employees e
            JOIN memberships m ON e.organization_id = m.organization_id
            WHERE e.id = employee_equipment.employee_id
            AND m.user_id = auth.uid()
            AND m.role IN ('consultant', 'firma_admin')
        )
    );

-- Trigger for updated_at
CREATE TRIGGER update_employee_equipment_updated_at
    BEFORE UPDATE ON employee_equipment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE employee_equipment IS 'Junction table linking employees to EIP catalog equipment with assignment tracking';
COMMENT ON COLUMN employee_equipment.employee_id IS 'Reference to the employee receiving equipment';
COMMENT ON COLUMN employee_equipment.equipment_type_id IS 'Reference to equipment type from EIP catalog';
COMMENT ON COLUMN employee_equipment.quantity IS 'Number of items assigned';
COMMENT ON COLUMN employee_equipment.assigned_date IS 'Date when equipment was assigned';
COMMENT ON COLUMN employee_equipment.return_date IS 'Date when equipment was returned (NULL if still assigned)';
COMMENT ON COLUMN employee_equipment.condition_on_assign IS 'Equipment condition at assignment';
COMMENT ON COLUMN employee_equipment.condition_on_return IS 'Equipment condition at return (required when returned)';
COMMENT ON COLUMN employee_equipment.assigned_by IS 'User who assigned the equipment';
COMMENT ON COLUMN employee_equipment.notes IS 'Additional notes about the assignment';
