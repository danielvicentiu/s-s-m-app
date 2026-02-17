-- S-S-M.RO — RAPOARTE PDF AUTOMATE SSM/PSI
-- Data: 17 Februarie 2026
-- Descriere: Tabel pentru stocarea rapoartelor generate automat (SSM, PSI, instruiri, documente expirate)

-- ============================================================
-- TABELA: reports
-- ============================================================

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  report_type TEXT NOT NULL CHECK (report_type IN ('situatie_ssm', 'situatie_psi', 'instruiri_luna', 'documente_expirate')),
  title TEXT NOT NULL,
  html_content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  generated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pentru query-uri rapide
CREATE INDEX idx_reports_organization_id ON public.reports(organization_id);
CREATE INDEX idx_reports_report_type ON public.reports(report_type);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_reports_generated_by ON public.reports(generated_by);

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view reports from their organizations
CREATE POLICY "Users can view reports from their organizations"
  ON public.reports
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.memberships
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- Policy: Users can create reports for their organizations
CREATE POLICY "Users can create reports for their organizations"
  ON public.reports
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM public.memberships
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- Policy: Users can delete reports they generated
CREATE POLICY "Users can delete their own reports"
  ON public.reports
  FOR DELETE
  USING (generated_by = auth.uid());

-- ============================================================
-- COMENTARII
-- ============================================================

COMMENT ON TABLE public.reports IS 'Rapoarte PDF automate SSM/PSI generate per organizație';
COMMENT ON COLUMN public.reports.report_type IS 'Tipul raportului: situatie_ssm, situatie_psi, instruiri_luna, documente_expirate';
COMMENT ON COLUMN public.reports.html_content IS 'Conținut HTML complet al raportului (pentru print/save as PDF)';
COMMENT ON COLUMN public.reports.metadata IS 'Metadate suplimentare: period, stats, filter_params, etc.';
