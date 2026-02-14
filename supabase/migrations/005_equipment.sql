-- Migration: Equipment Table
-- Description: Table for managing SSM/PSI equipment (EPI, tools, safety devices)
-- Date: 2026-02-14

-- Create equipment table
CREATE TABLE IF NOT EXISTS equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL, -- e.g., 'EPI', 'extinctor', 'hidrant', 'detector fum'
  serial_number VARCHAR(100),
  purchase_date DATE,
  expiry_date DATE,
  assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
  inspection_interval_months INTEGER DEFAULT 12,
  last_inspection_date DATE,
  next_inspection_date DATE, -- Calculated by trigger
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'maintenance', 'retired')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_equipment_org_id ON equipment(org_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_equipment_assigned_to ON equipment(assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_equipment_next_inspection ON equipment(next_inspection_date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(type) WHERE deleted_at IS NULL;

-- Enable Row Level Security
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view equipment from their organization
CREATE POLICY "Users can view equipment from their organization"
  ON equipment
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
        AND memberships.org_id = equipment.org_id
        AND memberships.deleted_at IS NULL
    )
  );

-- RLS Policy: Consultants and admins can insert equipment
CREATE POLICY "Consultants and admins can insert equipment"
  ON equipment
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
        AND memberships.org_id = equipment.org_id
        AND memberships.role IN ('consultant', 'firma_admin')
        AND memberships.deleted_at IS NULL
    )
  );

-- RLS Policy: Consultants and admins can update equipment
CREATE POLICY "Consultants and admins can update equipment"
  ON equipment
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
        AND memberships.org_id = equipment.org_id
        AND memberships.role IN ('consultant', 'firma_admin')
        AND memberships.deleted_at IS NULL
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
        AND memberships.org_id = equipment.org_id
        AND memberships.role IN ('consultant', 'firma_admin')
        AND memberships.deleted_at IS NULL
    )
  );

-- RLS Policy: Consultants and admins can delete equipment (soft delete)
CREATE POLICY "Consultants and admins can delete equipment"
  ON equipment
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memberships
      WHERE memberships.user_id = auth.uid()
        AND memberships.org_id = equipment.org_id
        AND memberships.role IN ('consultant', 'firma_admin')
        AND memberships.deleted_at IS NULL
    )
  );

-- Function to calculate next inspection date
CREATE OR REPLACE FUNCTION calculate_next_inspection_date()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate next inspection date based on last inspection date and interval
  IF NEW.last_inspection_date IS NOT NULL AND NEW.inspection_interval_months IS NOT NULL THEN
    NEW.next_inspection_date := NEW.last_inspection_date + (NEW.inspection_interval_months || ' months')::INTERVAL;
  ELSE
    NEW.next_inspection_date := NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate next inspection date
CREATE TRIGGER trigger_calculate_next_inspection
  BEFORE INSERT OR UPDATE OF last_inspection_date, inspection_interval_months
  ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION calculate_next_inspection_date();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_equipment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW
  EXECUTE FUNCTION update_equipment_updated_at();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON equipment TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Comment on table
COMMENT ON TABLE equipment IS 'Equipment management for SSM/PSI compliance (EPI, safety devices, tools)';
COMMENT ON COLUMN equipment.type IS 'Equipment type: EPI, extinctor, hidrant, detector fum, etc.';
COMMENT ON COLUMN equipment.status IS 'Equipment status: active, inactive, expired, maintenance, retired';
COMMENT ON COLUMN equipment.inspection_interval_months IS 'Number of months between required inspections';
COMMENT ON COLUMN equipment.next_inspection_date IS 'Auto-calculated based on last_inspection_date + inspection_interval_months';
