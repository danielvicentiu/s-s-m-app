-- Migration: Create prevention_plans table
-- Created: 2026-02-14
-- Description: Prevention and protection plans based on risk assessments
-- Per risk: technical measure, organizational measure, hygiene measure, responsible person, deadline, resources

-- Create prevention_plans table
CREATE TABLE IF NOT EXISTS public.prevention_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  risk_assessment_id UUID REFERENCES public.risk_assessments(id) ON DELETE SET NULL,
  plan_name TEXT NOT NULL,
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  approved_by_name TEXT,
  approved_by_title TEXT,
  approval_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'active', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Create prevention_measures table (one measure per identified risk)
CREATE TABLE IF NOT EXISTS public.prevention_measures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prevention_plan_id UUID NOT NULL REFERENCES public.prevention_plans(id) ON DELETE CASCADE,
  risk_assessment_hazard_id UUID REFERENCES public.risk_assessment_hazards(id) ON DELETE SET NULL,
  risk_name TEXT NOT NULL,
  risk_level INTEGER, -- Copied from hazard for reference
  risk_level_label TEXT, -- 'CRITIC', 'RIDICAT', 'MEDIU', 'SCĂZUT', 'MINIMAL'

  -- Măsurile de prevenire (3 categorii)
  technical_measure TEXT, -- Măsură tehnică
  organizational_measure TEXT, -- Măsură organizatorică
  hygiene_measure TEXT, -- Măsură igienico-sanitară

  -- Responsabilitate și termen
  responsible_person TEXT, -- Persoană responsabilă implementare
  responsible_title TEXT, -- Funcție/titlu persoană responsabilă
  deadline DATE, -- Termen limită implementare
  priority TEXT CHECK (priority IN ('urgent', 'high', 'medium', 'low')), -- Prioritate

  -- Resurse necesare
  resources_needed TEXT, -- Resurse materiale/financiare necesare
  estimated_cost NUMERIC(10, 2), -- Cost estimat

  -- Status implementare
  implementation_status TEXT DEFAULT 'pending' CHECK (
    implementation_status IN ('pending', 'in_progress', 'completed', 'delayed', 'cancelled')
  ),
  completion_date DATE, -- Data finalizării
  completion_notes TEXT, -- Note finalizare

  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_prevention_plans_org_id ON public.prevention_plans(organization_id);
CREATE INDEX IF NOT EXISTS idx_prevention_plans_risk_assessment ON public.prevention_plans(risk_assessment_id);
CREATE INDEX IF NOT EXISTS idx_prevention_plans_status ON public.prevention_plans(status);
CREATE INDEX IF NOT EXISTS idx_prevention_plans_deleted_at ON public.prevention_plans(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_prevention_measures_plan_id ON public.prevention_measures(prevention_plan_id);
CREATE INDEX IF NOT EXISTS idx_prevention_measures_hazard_id ON public.prevention_measures(risk_assessment_hazard_id);
CREATE INDEX IF NOT EXISTS idx_prevention_measures_status ON public.prevention_measures(implementation_status);
CREATE INDEX IF NOT EXISTS idx_prevention_measures_deadline ON public.prevention_measures(deadline);

-- Create updated_at trigger for prevention_plans
CREATE OR REPLACE FUNCTION update_prevention_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_prevention_plans_updated_at
  BEFORE UPDATE ON public.prevention_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_prevention_plans_updated_at();

-- Create updated_at trigger for prevention_measures
CREATE OR REPLACE FUNCTION update_prevention_measures_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_prevention_measures_updated_at
  BEFORE UPDATE ON public.prevention_measures
  FOR EACH ROW
  EXECUTE FUNCTION update_prevention_measures_updated_at();

-- Enable Row Level Security
ALTER TABLE public.prevention_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prevention_measures ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prevention_plans

-- Policy: Users can view prevention plans for organizations they belong to
CREATE POLICY "Users can view prevention plans in their organizations"
  ON public.prevention_plans
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.memberships WHERE user_id = auth.uid() AND is_active = true
      UNION
      SELECT organization_id FROM public.user_roles WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- Policy: Consultants and admins can insert prevention plans
CREATE POLICY "Consultants and admins can create prevention plans"
  ON public.prevention_plans
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT m.organization_id
      FROM public.memberships m
      WHERE m.user_id = auth.uid()
        AND m.is_active = true
        AND m.role IN ('consultant', 'firma_admin')
      UNION
      SELECT ur.organization_id
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'consultant_ssm', 'firma_admin', 'responsabil_ssm_intern')
    )
  );

-- Policy: Consultants and admins can update prevention plans
CREATE POLICY "Consultants and admins can update prevention plans"
  ON public.prevention_plans
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT m.organization_id
      FROM public.memberships m
      WHERE m.user_id = auth.uid()
        AND m.is_active = true
        AND m.role IN ('consultant', 'firma_admin')
      UNION
      SELECT ur.organization_id
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'consultant_ssm', 'firma_admin', 'responsabil_ssm_intern')
    )
    AND deleted_at IS NULL
  );

-- Policy: Consultants and admins can soft delete prevention plans
CREATE POLICY "Consultants and admins can delete prevention plans"
  ON public.prevention_plans
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT m.organization_id
      FROM public.memberships m
      WHERE m.user_id = auth.uid()
        AND m.is_active = true
        AND m.role IN ('consultant', 'firma_admin')
      UNION
      SELECT ur.organization_id
      FROM public.user_roles ur
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'consultant_ssm', 'firma_admin')
    )
  );

-- RLS Policies for prevention_measures

-- Policy: Users can view measures for prevention plans they can access
CREATE POLICY "Users can view measures in their prevention plans"
  ON public.prevention_measures
  FOR SELECT
  USING (
    prevention_plan_id IN (
      SELECT pp.id
      FROM public.prevention_plans pp
      JOIN public.memberships m ON pp.organization_id = m.organization_id
      WHERE m.user_id = auth.uid() AND m.is_active = true AND pp.deleted_at IS NULL
      UNION
      SELECT pp.id
      FROM public.prevention_plans pp
      JOIN public.user_roles ur ON pp.organization_id = ur.organization_id
      WHERE ur.user_id = auth.uid() AND pp.deleted_at IS NULL
    )
  );

-- Policy: Consultants and admins can insert measures
CREATE POLICY "Consultants and admins can create measures"
  ON public.prevention_measures
  FOR INSERT
  WITH CHECK (
    prevention_plan_id IN (
      SELECT pp.id
      FROM public.prevention_plans pp
      JOIN public.memberships m ON pp.organization_id = m.organization_id
      WHERE m.user_id = auth.uid()
        AND m.is_active = true
        AND m.role IN ('consultant', 'firma_admin')
        AND pp.deleted_at IS NULL
      UNION
      SELECT pp.id
      FROM public.prevention_plans pp
      JOIN public.user_roles ur ON pp.organization_id = ur.organization_id
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'consultant_ssm', 'firma_admin', 'responsabil_ssm_intern')
        AND pp.deleted_at IS NULL
    )
  );

-- Policy: Consultants and admins can update measures
CREATE POLICY "Consultants and admins can update measures"
  ON public.prevention_measures
  FOR UPDATE
  USING (
    prevention_plan_id IN (
      SELECT pp.id
      FROM public.prevention_plans pp
      JOIN public.memberships m ON pp.organization_id = m.organization_id
      WHERE m.user_id = auth.uid()
        AND m.is_active = true
        AND m.role IN ('consultant', 'firma_admin')
        AND pp.deleted_at IS NULL
      UNION
      SELECT pp.id
      FROM public.prevention_plans pp
      JOIN public.user_roles ur ON pp.organization_id = ur.organization_id
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'consultant_ssm', 'firma_admin', 'responsabil_ssm_intern')
        AND pp.deleted_at IS NULL
    )
  );

-- Policy: Consultants and admins can delete measures
CREATE POLICY "Consultants and admins can delete measures"
  ON public.prevention_measures
  FOR DELETE
  USING (
    prevention_plan_id IN (
      SELECT pp.id
      FROM public.prevention_plans pp
      JOIN public.memberships m ON pp.organization_id = m.organization_id
      WHERE m.user_id = auth.uid()
        AND m.is_active = true
        AND m.role IN ('consultant', 'firma_admin')
        AND pp.deleted_at IS NULL
      UNION
      SELECT pp.id
      FROM public.prevention_plans pp
      JOIN public.user_roles ur ON pp.organization_id = ur.organization_id
      JOIN public.roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
        AND r.name IN ('super_admin', 'consultant_ssm', 'firma_admin')
        AND pp.deleted_at IS NULL
    )
  );

-- Add comments
COMMENT ON TABLE public.prevention_plans IS 'Prevention and protection plans based on risk assessments';
COMMENT ON TABLE public.prevention_measures IS 'Prevention measures per identified risk: technical, organizational, and hygiene measures';
COMMENT ON COLUMN public.prevention_measures.technical_measure IS 'Măsură tehnică de prevenire';
COMMENT ON COLUMN public.prevention_measures.organizational_measure IS 'Măsură organizatorică de prevenire';
COMMENT ON COLUMN public.prevention_measures.hygiene_measure IS 'Măsură igienico-sanitară';
COMMENT ON COLUMN public.prevention_measures.resources_needed IS 'Resurse materiale/financiare necesare pentru implementare';
