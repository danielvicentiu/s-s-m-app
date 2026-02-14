-- S-S-M.RO — A/B TESTING TABLES
-- Simple A/B testing framework with experiments, assignments, and conversions
-- Data: 14 Februarie 2026

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: ab_experiments
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ab_experiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  variants JSONB NOT NULL, -- Array of {name: string, weight: number}
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ
);

-- Index for quick lookup by name
CREATE INDEX IF NOT EXISTS idx_ab_experiments_name ON public.ab_experiments(name);
CREATE INDEX IF NOT EXISTS idx_ab_experiments_is_active ON public.ab_experiments(is_active);

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: ab_assignments
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ab_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  variant_name TEXT NOT NULL,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One assignment per user per experiment
  UNIQUE(experiment_id, user_id)
);

-- Indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_ab_assignments_experiment_id ON public.ab_assignments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_ab_assignments_user_id ON public.ab_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_assignments_variant_name ON public.ab_assignments(variant_name);

-- ══════════════════════════════════════════════════════════════════════════════
-- TABLE: ab_conversions
-- ══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.ab_conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experiment_id UUID NOT NULL REFERENCES public.ab_experiments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  variant_name TEXT NOT NULL,
  converted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB,

  -- One conversion per user per experiment
  UNIQUE(experiment_id, user_id)
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_ab_conversions_experiment_id ON public.ab_conversions(experiment_id);
CREATE INDEX IF NOT EXISTS idx_ab_conversions_user_id ON public.ab_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_conversions_variant_name ON public.ab_conversions(variant_name);

-- ══════════════════════════════════════════════════════════════════════════════
-- TRIGGER: auto-update updated_at
-- ══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_ab_experiments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ab_experiments_updated_at
  BEFORE UPDATE ON public.ab_experiments
  FOR EACH ROW
  EXECUTE FUNCTION update_ab_experiments_updated_at();

-- ══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE public.ab_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_conversions ENABLE ROW LEVEL SECURITY;

-- Experiments: Only authenticated users can read
CREATE POLICY "Users can read experiments"
  ON public.ab_experiments
  FOR SELECT
  TO authenticated
  USING (true);

-- Experiments: Only service role can create/update/delete
CREATE POLICY "Service role can manage experiments"
  ON public.ab_experiments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Assignments: Users can read their own assignments
CREATE POLICY "Users can read their own assignments"
  ON public.ab_assignments
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Assignments: Service role can manage all assignments
CREATE POLICY "Service role can manage assignments"
  ON public.ab_assignments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Conversions: Users can read their own conversions
CREATE POLICY "Users can read their own conversions"
  ON public.ab_conversions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Conversions: Service role can manage all conversions
CREATE POLICY "Service role can manage conversions"
  ON public.ab_conversions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ══════════════════════════════════════════════════════════════════════════════
-- COMMENTS
-- ══════════════════════════════════════════════════════════════════════════════

COMMENT ON TABLE public.ab_experiments IS 'A/B testing experiments with variants and weights';
COMMENT ON TABLE public.ab_assignments IS 'User-to-variant assignments (deterministic hash-based)';
COMMENT ON TABLE public.ab_conversions IS 'Conversion tracking for A/B test participants';

COMMENT ON COLUMN public.ab_experiments.variants IS 'Array of {name: string, weight: number} where weights sum to 100';
COMMENT ON COLUMN public.ab_experiments.is_active IS 'If false, new users will not be assigned to this experiment';
COMMENT ON COLUMN public.ab_conversions.metadata IS 'Additional context about the conversion event';
