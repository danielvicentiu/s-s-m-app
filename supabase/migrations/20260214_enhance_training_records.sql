-- ════════════════════════════════════════════════════════════════════════════
-- MIGRATION: Enhance Training Records
-- Date: 2026-02-14
-- Description: Create comprehensive trainings table with test management,
--              certificates, automatic next training date calculation,
--              and location/cost tracking
-- ════════════════════════════════════════════════════════════════════════════

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 1. CREATE TRAINING_TYPES LOOKUP TABLE                                      │
-- └────────────────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS training_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- Frequency configuration
  frequency_months INTEGER NOT NULL DEFAULT 12,
  -- Legal requirements
  legal_reference TEXT,
  is_mandatory BOOLEAN DEFAULT TRUE,

  -- Content management
  default_duration_hours DECIMAL(5,2),
  default_tematica JSONB DEFAULT '[]'::jsonb,

  -- Metadata
  country_code VARCHAR(2) DEFAULT 'RO',
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT training_types_name_country_unique UNIQUE (name, country_code)
);

-- Index for quick lookups
CREATE INDEX idx_training_types_country_active ON training_types(country_code, is_active);

COMMENT ON TABLE training_types IS 'Lookup table for training types with frequency and default content';
COMMENT ON COLUMN training_types.frequency_months IS 'Number of months until next training is required';
COMMENT ON COLUMN training_types.default_tematica IS 'Default topics/curriculum as JSONB array';

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 2. CREATE TRAININGS TABLE                                                  │
-- └────────────────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,

  -- Training details
  training_type_id UUID NOT NULL REFERENCES training_types(id) ON DELETE RESTRICT,
  training_type VARCHAR(255) NOT NULL, -- Denormalized for backward compatibility
  training_date DATE NOT NULL,
  duration_hours DECIMAL(5,2),

  -- Tematica (curriculum/content covered)
  tematica_content JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"topic": "Protecția muncii", "duration_min": 60, "completed": true}, ...]

  -- Test management
  test_questions JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"question": "Ce este EIP?", "type": "multiple_choice", "options": [...], "correct_answer": "A", "employee_answer": "A"}, ...]
  test_score INTEGER CHECK (test_score >= 0 AND test_score <= 100),
  test_passed BOOLEAN DEFAULT NULL,
  test_taken_at TIMESTAMPTZ,

  -- Certificate details
  certificate_number VARCHAR(100),
  certificate_url TEXT, -- Storage path or public URL
  certificate_issued_at DATE,

  -- Next training calculation
  next_training_date DATE,
  -- This will be auto-calculated based on training_type frequency

  -- Location and provider
  location VARCHAR(255), -- "La sediu", "Online", "Centru instruire București", etc.
  external_provider VARCHAR(255), -- If training is provided by external company

  -- Cost tracking
  cost DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'RON',

  -- Trainer information
  trainer_name VARCHAR(255),
  trainer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Status and compliance
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'expired')),
  is_compliant BOOLEAN DEFAULT TRUE,

  -- Notes and attachments
  notes TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  -- Example: [{"name": "fisa_instruire.pdf", "url": "...", "size": 12345}, ...]

  -- Audit trail
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Constraints
  CONSTRAINT trainings_test_score_valid CHECK (test_score IS NULL OR (test_score >= 0 AND test_score <= 100)),
  CONSTRAINT trainings_cost_positive CHECK (cost IS NULL OR cost >= 0)
);

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 3. CREATE INDEXES FOR PERFORMANCE                                          │
-- └────────────────────────────────────────────────────────────────────────────┘

-- Composite index for employee training history
CREATE INDEX idx_trainings_employee_type_date
  ON trainings(employee_id, training_type, training_date DESC);

-- Organization queries
CREATE INDEX idx_trainings_org_date
  ON trainings(organization_id, training_date DESC)
  WHERE deleted_at IS NULL;

-- Expiring trainings lookup
CREATE INDEX idx_trainings_next_date
  ON trainings(next_training_date)
  WHERE next_training_date IS NOT NULL
    AND status = 'completed'
    AND deleted_at IS NULL;

-- Status filtering
CREATE INDEX idx_trainings_status
  ON trainings(status)
  WHERE deleted_at IS NULL;

-- Full-text search on trainer name
CREATE INDEX idx_trainings_trainer_name
  ON trainings USING gin(to_tsvector('simple', trainer_name))
  WHERE trainer_name IS NOT NULL;

-- Certificate number lookup
CREATE INDEX idx_trainings_certificate_number
  ON trainings(certificate_number)
  WHERE certificate_number IS NOT NULL;

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 4. CREATE FUNCTION: AUTO-CALCULATE NEXT TRAINING DATE                      │
-- └────────────────────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION auto_calc_next_training()
RETURNS TRIGGER AS $$
DECLARE
  v_frequency_months INTEGER;
BEGIN
  -- Only calculate for completed trainings
  IF NEW.status = 'completed' AND NEW.training_date IS NOT NULL THEN

    -- Get frequency from training_types table
    SELECT frequency_months INTO v_frequency_months
    FROM training_types
    WHERE id = NEW.training_type_id;

    -- If training type found and has frequency, calculate next date
    IF v_frequency_months IS NOT NULL AND v_frequency_months > 0 THEN
      NEW.next_training_date := NEW.training_date + (v_frequency_months || ' months')::INTERVAL;
    END IF;

  END IF;

  -- Always update updated_at
  NEW.updated_at := NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auto_calc_next_training() IS
  'Automatically calculates next_training_date based on training_type frequency_months';

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 5. CREATE TRIGGER FOR AUTO-CALCULATION                                     │
-- └────────────────────────────────────────────────────────────────────────────┘

CREATE TRIGGER trigger_auto_calc_next_training
  BEFORE INSERT OR UPDATE ON trainings
  FOR EACH ROW
  EXECUTE FUNCTION auto_calc_next_training();

COMMENT ON TRIGGER trigger_auto_calc_next_training ON trainings IS
  'Triggers before insert/update to auto-calculate next training date';

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 6. CREATE HELPER FUNCTION: CALCULATE TEST PASS/FAIL                        │
-- └────────────────────────────────────────────────────────────────────────────┘

CREATE OR REPLACE FUNCTION calculate_test_result()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-set test_passed based on score
  IF NEW.test_score IS NOT NULL THEN
    -- Pass threshold: 70%
    NEW.test_passed := (NEW.test_score >= 70);

    -- Set test_taken_at if not already set
    IF NEW.test_taken_at IS NULL THEN
      NEW.test_taken_at := NOW();
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_test_result
  BEFORE INSERT OR UPDATE ON trainings
  FOR EACH ROW
  WHEN (NEW.test_score IS NOT NULL)
  EXECUTE FUNCTION calculate_test_result();

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 7. ROW LEVEL SECURITY (RLS)                                                │
-- └────────────────────────────────────────────────────────────────────────────┘

ALTER TABLE trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_types ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view trainings for their organization
CREATE POLICY trainings_select_policy ON trainings
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = TRUE
    )
    AND deleted_at IS NULL
  );

-- Policy: Consultants and admins can insert trainings
CREATE POLICY trainings_insert_policy ON trainings
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = TRUE
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Policy: Consultants and admins can update trainings
CREATE POLICY trainings_update_policy ON trainings
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = TRUE
        AND role IN ('consultant', 'firma_admin')
    )
    AND deleted_at IS NULL
  );

-- Policy: Only consultants can soft-delete trainings
CREATE POLICY trainings_delete_policy ON trainings
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
        AND is_active = TRUE
        AND role = 'consultant'
    )
  );

-- Policy: Everyone can view active training types
CREATE POLICY training_types_select_policy ON training_types
  FOR SELECT
  USING (is_active = TRUE);

-- Policy: Only consultants can manage training types (for now, open for all authenticated)
CREATE POLICY training_types_insert_policy ON training_types
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY training_types_update_policy ON training_types
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 8. SEED DEFAULT TRAINING TYPES (Romania)                                   │
-- └────────────────────────────────────────────────────────────────────────────┘

INSERT INTO training_types (name, description, frequency_months, legal_reference, default_duration_hours, country_code) VALUES
  ('Instruire Generală PSI', 'Instruire generală în domeniul prevenirii și stingerii incendiilor', 12, 'HG 1492/2004', 2.0, 'RO'),
  ('Instruire Specifică PSI', 'Instruire specifică locului de muncă - prevenirea și stingerea incendiilor', 12, 'HG 1492/2004', 3.0, 'RO'),
  ('Instruire Inițială SSM', 'Instruire inițială în domeniul securității și sănătății în muncă', NULL, 'Legea 319/2006', 8.0, 'RO'),
  ('Instruire Periodică SSM', 'Instruire periodică în domeniul securității și sănătății în muncă', 12, 'Legea 319/2006', 4.0, 'RO'),
  ('Instruire la Locul de Muncă', 'Instruire specifică la locul de muncă', 12, 'Legea 319/2006', 2.0, 'RO'),
  ('Prim Ajutor', 'Instruire în acordarea primului ajutor', 24, 'HG 1091/2006', 8.0, 'RO'),
  ('Evacuare în Caz de Urgență', 'Proceduri de evacuare și comportament în situații de urgență', 12, 'HG 1492/2004', 1.0, 'RO'),
  ('Lucru la Înălțime', 'Instruire pentru lucrări la înălțime', 12, 'HG 300/2006', 6.0, 'RO'),
  ('Stivuitor', 'Autorizare și instruire pentru operarea stivuitoarelor', 24, 'Ordin 1051/2006', 40.0, 'RO'),
  ('Substanțe Periculoase', 'Manipularea substanțelor chimice periculoase', 12, 'HG 1408/2008', 3.0, 'RO')
ON CONFLICT (name, country_code) DO NOTHING;

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 9. CREATE HELPFUL VIEWS                                                    │
-- └────────────────────────────────────────────────────────────────────────────┘

-- View: Trainings expiring soon (within 30 days)
CREATE OR REPLACE VIEW trainings_expiring_soon AS
SELECT
  t.*,
  e.full_name AS employee_name,
  e.cnp_hash,
  o.name AS organization_name,
  (t.next_training_date - CURRENT_DATE) AS days_until_due,
  tt.frequency_months
FROM trainings t
JOIN employees e ON t.employee_id = e.id
JOIN organizations o ON t.organization_id = o.id
JOIN training_types tt ON t.training_type_id = tt.id
WHERE t.next_training_date IS NOT NULL
  AND t.next_training_date <= CURRENT_DATE + INTERVAL '30 days'
  AND t.status = 'completed'
  AND t.deleted_at IS NULL
ORDER BY t.next_training_date ASC;

COMMENT ON VIEW trainings_expiring_soon IS
  'Shows all trainings that need to be renewed within 30 days';

-- View: Training completion statistics per organization
CREATE OR REPLACE VIEW training_completion_stats AS
SELECT
  o.id AS organization_id,
  o.name AS organization_name,
  COUNT(DISTINCT t.employee_id) AS employees_trained,
  COUNT(t.id) AS total_trainings,
  COUNT(t.id) FILTER (WHERE t.status = 'completed') AS completed_trainings,
  COUNT(t.id) FILTER (WHERE t.test_passed = TRUE) AS passed_tests,
  ROUND(AVG(t.test_score), 2) AS avg_test_score,
  SUM(t.cost) AS total_training_cost,
  COUNT(t.id) FILTER (WHERE t.next_training_date < CURRENT_DATE) AS overdue_trainings
FROM organizations o
LEFT JOIN trainings t ON o.id = t.organization_id AND t.deleted_at IS NULL
GROUP BY o.id, o.name;

COMMENT ON VIEW training_completion_stats IS
  'Aggregated training statistics per organization';

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 10. GRANT PERMISSIONS                                                      │
-- └────────────────────────────────────────────────────────────────────────────┘

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON trainings TO authenticated;
GRANT SELECT ON training_types TO authenticated;
GRANT SELECT ON trainings_expiring_soon TO authenticated;
GRANT SELECT ON training_completion_stats TO authenticated;

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- ┌────────────────────────────────────────────────────────────────────────────┐
-- │ 11. ADD HELPFUL COMMENTS                                                   │
-- └────────────────────────────────────────────────────────────────────────────┘

COMMENT ON TABLE trainings IS
  'Training records with test management, certificates, and automatic next training date calculation';

COMMENT ON COLUMN trainings.tematica_content IS
  'JSONB array of training topics/curriculum covered: [{"topic": "...", "duration_min": 60, "completed": true}]';

COMMENT ON COLUMN trainings.test_questions IS
  'JSONB array of test questions and answers: [{"question": "...", "type": "multiple_choice", "options": [...], "correct_answer": "A", "employee_answer": "A"}]';

COMMENT ON COLUMN trainings.test_score IS
  'Test score as percentage (0-100). Auto-calculates test_passed if >= 70';

COMMENT ON COLUMN trainings.test_passed IS
  'Boolean indicating if employee passed the test (auto-set based on test_score >= 70)';

COMMENT ON COLUMN trainings.certificate_number IS
  'Unique certificate number issued for this training';

COMMENT ON COLUMN trainings.certificate_url IS
  'URL or storage path to the certificate PDF/image';

COMMENT ON COLUMN trainings.next_training_date IS
  'Auto-calculated date when next training is required (training_date + frequency_months)';

COMMENT ON COLUMN trainings.location IS
  'Training location: "La sediu", "Online", "Centru instruire București", etc.';

COMMENT ON COLUMN trainings.external_provider IS
  'Name of external training company/provider (if applicable)';

COMMENT ON COLUMN trainings.cost IS
  'Cost of training per employee';

COMMENT ON COLUMN trainings.status IS
  'Training status: scheduled, completed, cancelled, expired';

-- ════════════════════════════════════════════════════════════════════════════
-- MIGRATION COMPLETE
-- ════════════════════════════════════════════════════════════════════════════
