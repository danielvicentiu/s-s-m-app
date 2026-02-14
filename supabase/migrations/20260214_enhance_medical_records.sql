-- ================================================================
-- ENHANCE MEDICAL_EXAMS TABLE
-- Date: 2026-02-14
-- Purpose: Add comprehensive fields for medical examination tracking
--          and auto-calculation of next exam dates
-- ================================================================

-- Add new columns to medical_exams table
ALTER TABLE medical_exams
  -- Clinic information (if not already exists)
  ADD COLUMN IF NOT EXISTS clinic_name TEXT,

  -- Enhanced exam type (keeping examination_type for backwards compatibility)
  ADD COLUMN IF NOT EXISTS exam_type TEXT CHECK (
    exam_type IN (
      'periodic',           -- Control medical periodic
      'angajare',          -- Control la angajare
      'reluare',           -- Control la reluare activitate
      'la_cerere',         -- Control la cerere
      'supraveghere',      -- Control special de supraveghere
      'post_accident',     -- Control post-accident
      'reevaluare'         -- Reevaluare capacitate muncă
    )
  ),

  -- Medical restrictions (if not already exists)
  ADD COLUMN IF NOT EXISTS restrictions TEXT,

  -- Fitness certificate file URL
  ADD COLUMN IF NOT EXISTS fitness_file_url TEXT,

  -- Cost tracking
  ADD COLUMN IF NOT EXISTS cost DECIMAL(10, 2) DEFAULT 0.00,

  -- Auto-calculated next exam date
  ADD COLUMN IF NOT EXISTS next_exam_date DATE,

  -- Doctor specialization
  ADD COLUMN IF NOT EXISTS doctor_specialization TEXT,

  -- Risk level for frequency calculation
  ADD COLUMN IF NOT EXISTS risk_level TEXT CHECK (
    risk_level IN ('scazut', 'mediu', 'ridicat', 'critic')
  ) DEFAULT 'scazut';

-- Create index for performance on next_exam_date queries
CREATE INDEX IF NOT EXISTS idx_medical_exams_next_exam_date
  ON medical_exams(next_exam_date)
  WHERE next_exam_date IS NOT NULL;

-- Create index for organization queries
CREATE INDEX IF NOT EXISTS idx_medical_exams_org_exam_date
  ON medical_exams(organization_id, examination_date DESC);

-- ================================================================
-- FUNCTION: Auto-calculate next exam date based on risk level
-- and exam type frequency per Romanian legislation
-- ================================================================

CREATE OR REPLACE FUNCTION auto_calc_next_exam()
RETURNS TRIGGER AS $$
DECLARE
  interval_months INTEGER;
  base_date DATE;
BEGIN
  -- Use examination_date as base for calculation
  base_date := NEW.examination_date;

  -- Default interval based on exam type and risk level
  -- Romanian SSM legislation: Ordin 1193/2006

  IF NEW.exam_type = 'angajare' THEN
    -- Next exam is periodic, calculate based on risk
    interval_months := CASE
      WHEN NEW.risk_level = 'critic' THEN 6     -- Every 6 months
      WHEN NEW.risk_level = 'ridicat' THEN 12   -- Every year
      WHEN NEW.risk_level = 'mediu' THEN 24     -- Every 2 years
      ELSE 36                                    -- Every 3 years (scazut)
    END;

  ELSIF NEW.exam_type = 'periodic' THEN
    -- Standard periodic intervals based on risk
    interval_months := CASE
      WHEN NEW.risk_level = 'critic' THEN 6     -- Every 6 months
      WHEN NEW.risk_level = 'ridicat' THEN 12   -- Every year
      WHEN NEW.risk_level = 'mediu' THEN 24     -- Every 2 years
      ELSE 36                                    -- Every 3 years
    END;

  ELSIF NEW.exam_type = 'reluare' THEN
    -- After reluare, next is periodic
    interval_months := CASE
      WHEN NEW.risk_level = 'critic' THEN 6
      WHEN NEW.risk_level = 'ridicat' THEN 12
      WHEN NEW.risk_level = 'mediu' THEN 24
      ELSE 36
    END;

  ELSIF NEW.exam_type = 'supraveghere' THEN
    -- Special surveillance - shorter intervals
    interval_months := CASE
      WHEN NEW.risk_level = 'critic' THEN 3     -- Every 3 months
      WHEN NEW.risk_level = 'ridicat' THEN 6    -- Every 6 months
      ELSE 12                                    -- Every year
    END;

  ELSIF NEW.exam_type = 'post_accident' THEN
    -- After accident, follow-up in 30 days
    interval_months := 1;

  ELSIF NEW.exam_type = 'reevaluare' THEN
    -- Reevaluation - depends on result
    IF NEW.result IN ('inapt_temporar', 'apt_conditionat') THEN
      interval_months := 3;  -- Check again in 3 months
    ELSE
      interval_months := 12; -- Regular follow-up
    END IF;

  ELSE
    -- Default for 'la_cerere' or unknown
    interval_months := CASE
      WHEN NEW.risk_level = 'critic' THEN 6
      WHEN NEW.risk_level = 'ridicat' THEN 12
      WHEN NEW.risk_level = 'mediu' THEN 24
      ELSE 36
    END;
  END IF;

  -- Calculate next exam date
  NEW.next_exam_date := base_date + (interval_months || ' months')::INTERVAL;

  -- If result is 'inapt' (permanently unfit), no next exam needed
  IF NEW.result = 'inapt' THEN
    NEW.next_exam_date := NULL;
  END IF;

  -- If result is 'inapt_temporar', use shorter interval (max 6 months)
  IF NEW.result = 'inapt_temporar' AND interval_months > 6 THEN
    NEW.next_exam_date := base_date + INTERVAL '6 months';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================================================
-- TRIGGER: Auto-calculate next_exam_date on INSERT and UPDATE
-- ================================================================

DROP TRIGGER IF EXISTS trigger_auto_calc_next_exam ON medical_exams;

CREATE TRIGGER trigger_auto_calc_next_exam
  BEFORE INSERT OR UPDATE OF examination_date, exam_type, risk_level, result
  ON medical_exams
  FOR EACH ROW
  EXECUTE FUNCTION auto_calc_next_exam();

-- ================================================================
-- DATA MIGRATION: Sync exam_type from examination_type
-- and set default risk_level
-- ================================================================

UPDATE medical_exams
SET
  exam_type = examination_type,
  risk_level = COALESCE(risk_level, 'mediu')
WHERE exam_type IS NULL;

-- Trigger the calculation for existing records
UPDATE medical_exams
SET examination_date = examination_date
WHERE next_exam_date IS NULL AND result != 'inapt';

-- ================================================================
-- COMMENTS FOR DOCUMENTATION
-- ================================================================

COMMENT ON COLUMN medical_exams.clinic_name IS 'Numele clinicii/cabinetului medical unde s-a efectuat controlul';
COMMENT ON COLUMN medical_exams.exam_type IS 'Tipul controlului medical conform legislației SSM';
COMMENT ON COLUMN medical_exams.restrictions IS 'Restricții medicale sau condiții de aptitudine';
COMMENT ON COLUMN medical_exams.fitness_file_url IS 'URL către certificatul medical scanat (Supabase Storage)';
COMMENT ON COLUMN medical_exams.cost IS 'Costul controlului medical în valuta locală';
COMMENT ON COLUMN medical_exams.next_exam_date IS 'Data următorului control medical (calculată automat)';
COMMENT ON COLUMN medical_exams.doctor_specialization IS 'Specializarea medicului (ex: medicina muncii, psihologie)';
COMMENT ON COLUMN medical_exams.risk_level IS 'Nivelul de risc al postului pentru calculul frecvenței';

COMMENT ON FUNCTION auto_calc_next_exam() IS 'Calculează automat data următorului control medical conform Ordin 1193/2006';
COMMENT ON TRIGGER trigger_auto_calc_next_exam ON medical_exams IS 'Trigger pentru calculul automat al next_exam_date';

-- ================================================================
-- RLS POLICIES (maintain existing security)
-- ================================================================

-- RLS should already be enabled on medical_exams
-- Verify and ensure it's active
ALTER TABLE medical_exams ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- SUCCESS MESSAGE
-- ================================================================

DO $$
BEGIN
  RAISE NOTICE '✓ Medical exams table enhanced successfully';
  RAISE NOTICE '✓ Added columns: clinic_name, exam_type, restrictions, fitness_file_url, cost, next_exam_date, doctor_specialization, risk_level';
  RAISE NOTICE '✓ Created function: auto_calc_next_exam()';
  RAISE NOTICE '✓ Created trigger: trigger_auto_calc_next_exam';
  RAISE NOTICE '✓ Migrated existing data';
  RAISE NOTICE '✓ Next exam dates calculated based on Romanian SSM legislation (Ordin 1193/2006)';
END $$;
