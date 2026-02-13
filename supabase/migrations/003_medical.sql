-- Migration: Medical Exams Table
-- Description: Creates medical_exams table for tracking employee medical examinations
-- Author: Claude
-- Date: 2026-02-13

-- Create enum for exam results
CREATE TYPE medical_exam_result AS ENUM (
  'apt',           -- Apt (fit for work)
  'apt_restrictii', -- Apt cu restrictii (fit with restrictions)
  'inapt_temporar', -- Inapt temporar (temporarily unfit)
  'inapt_permanent' -- Inapt permanent (permanently unfit)
);

-- Create medical_exams table
CREATE TABLE IF NOT EXISTS medical_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Exam details
  exam_type VARCHAR(100) NOT NULL, -- Tipul examenului (angajare, periodic, reluare, control)
  exam_date DATE NOT NULL,
  expiry_date DATE, -- Data expirării (pentru examene periodice)
  result medical_exam_result NOT NULL,

  -- Medical provider info
  medical_provider VARCHAR(255), -- Furnizorul serviciilor medicale
  doctor_name VARCHAR(255), -- Numele medicului

  -- Restrictions and observations
  restrictions TEXT, -- Restrictii medicale (daca apt_restrictii)
  observations TEXT, -- Observatii generale

  -- Document reference
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL, -- Link to scanned certificate

  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMPTZ -- Soft delete
);

-- Create indexes for performance
CREATE INDEX idx_medical_exams_employee ON medical_exams(employee_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_medical_exams_organization ON medical_exams(organization_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_medical_exams_exam_date ON medical_exams(exam_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_medical_exams_expiry_date ON medical_exams(expiry_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_medical_exams_result ON medical_exams(result) WHERE deleted_at IS NULL;
CREATE INDEX idx_medical_exams_deleted_at ON medical_exams(deleted_at);

-- Create updated_at trigger
CREATE TRIGGER set_medical_exams_updated_at
  BEFORE UPDATE ON medical_exams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE medical_exams ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view medical exams for their organization
CREATE POLICY "Users can view medical exams in their organization"
  ON medical_exams
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND deleted_at IS NULL
    )
  );

-- RLS Policy: Consultants and admins can insert medical exams
CREATE POLICY "Consultants and admins can create medical exams"
  ON medical_exams
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

-- RLS Policy: Consultants and admins can update medical exams
CREATE POLICY "Consultants and admins can update medical exams"
  ON medical_exams
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

-- RLS Policy: Only consultants can delete (soft delete) medical exams
CREATE POLICY "Consultants can delete medical exams"
  ON medical_exams
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
  )
  WITH CHECK (
    deleted_at IS NOT NULL
  );

-- Add comment to table
COMMENT ON TABLE medical_exams IS 'Stores medical examination records for employees';
COMMENT ON COLUMN medical_exams.exam_type IS 'Type of exam: angajare (hiring), periodic, reluare (return to work), control (follow-up)';
COMMENT ON COLUMN medical_exams.result IS 'Medical fitness result: apt, apt_restrictii, inapt_temporar, inapt_permanent';
COMMENT ON COLUMN medical_exams.restrictions IS 'Medical restrictions when result is apt_restrictii';
COMMENT ON COLUMN medical_exams.expiry_date IS 'Expiration date for periodic exams';
