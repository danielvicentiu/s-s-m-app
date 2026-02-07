-- Migration: Add cor_code column to employees table
-- Created: 2026-02-07
-- Description: Adds cor_code (Clasificarea Ocupațiilor din România) field to employees table

-- Add cor_code column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'employees'
        AND column_name = 'cor_code'
    ) THEN
        ALTER TABLE employees ADD COLUMN cor_code TEXT;
        COMMENT ON COLUMN employees.cor_code IS 'Cod COR (Clasificarea Ocupațiilor din România)';
    END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_employees_cor_code ON employees(cor_code);
