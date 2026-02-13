-- supabase/migrations/20260213_system_logs.sql
-- Tabel pentru jurnalizare sistem (system logs) pentru monitorizare și debugging

CREATE TABLE IF NOT EXISTS public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error')),
  source TEXT NOT NULL, -- componenta/modulul care a generat log-ul
  message TEXT NOT NULL,
  stack_trace TEXT, -- pentru erori, detalii stack trace
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  metadata JSONB, -- date suplimentare context-specific
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pentru căutări rapide
CREATE INDEX idx_system_logs_timestamp ON public.system_logs(timestamp DESC);
CREATE INDEX idx_system_logs_level ON public.system_logs(level);
CREATE INDEX idx_system_logs_source ON public.system_logs(source);
CREATE INDEX idx_system_logs_user_id ON public.system_logs(user_id);
CREATE INDEX idx_system_logs_org_id ON public.system_logs(organization_id);

-- RLS: doar consultanți și admini pot vedea logs
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Policy: consultanții pot vedea toate logs-urile
CREATE POLICY "Consultants can view all logs"
ON public.system_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.memberships
    WHERE memberships.user_id = auth.uid()
    AND memberships.role = 'consultant'
    AND memberships.is_active = true
  )
);

-- Policy: admini de firmă pot vedea logs-urile organizației lor
CREATE POLICY "Firm admins can view their org logs"
ON public.system_logs
FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM public.memberships
    WHERE memberships.user_id = auth.uid()
    AND memberships.role = 'firma_admin'
    AND memberships.is_active = true
  )
);

-- Function helper pentru inserare logs (poate fi apelată din cod sau triggers)
CREATE OR REPLACE FUNCTION public.insert_system_log(
  p_level TEXT,
  p_source TEXT,
  p_message TEXT,
  p_stack_trace TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_organization_id UUID DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.system_logs (
    level, source, message, stack_trace, user_id, organization_id, metadata
  ) VALUES (
    p_level, p_source, p_message, p_stack_trace, p_user_id, p_organization_id, p_metadata
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Inserare câteva exemple de logs pentru testing
INSERT INTO public.system_logs (level, source, message, metadata) VALUES
  ('info', 'system', 'Aplicație pornită cu succes', '{"version": "1.0.0", "env": "production"}'::jsonb),
  ('warn', 'auth', 'Încercare autentificare eșuată', '{"ip": "192.168.1.100", "attempts": 3}'::jsonb),
  ('error', 'database', 'Eroare conectare la baza de date', '{"code": "ECONNREFUSED", "host": "localhost"}'::jsonb),
  ('info', 'api', 'Request procesat cu succes', '{"endpoint": "/api/employees", "duration_ms": 245}'::jsonb),
  ('error', 'upload', 'Eroare încărcare fișier', '{"filename": "document.pdf", "error": "File too large"}'::jsonb);

COMMENT ON TABLE public.system_logs IS 'Jurnal sistem pentru monitorizare și debugging';
