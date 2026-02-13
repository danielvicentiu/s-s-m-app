-- Migration: Webhooks system
-- Data: 13 Februarie 2026
-- Descriere: Tabele pentru configurare webhooks și delivery logs

-- Tabela webhooks
CREATE TABLE IF NOT EXISTS public.webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL DEFAULT '{}', -- array de event types (ex: 'medical.created', 'equipment.expiring')
  is_active BOOLEAN NOT NULL DEFAULT true,
  secret TEXT, -- optional secret pentru semnare payload
  last_response_status INTEGER, -- ultimul HTTP status code primit
  last_response_at TIMESTAMP WITH TIME ZONE, -- când a fost ultimul răspuns
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pentru queries rapide
CREATE INDEX idx_webhooks_organization ON public.webhooks(organization_id);
CREATE INDEX idx_webhooks_active ON public.webhooks(is_active) WHERE is_active = true;

-- Tabela webhook_deliveries (log deliveries)
CREATE TABLE IF NOT EXISTS public.webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID NOT NULL REFERENCES public.webhooks(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- tipul eventului (ex: 'medical.created')
  payload JSONB NOT NULL, -- payload-ul trimis
  response_status INTEGER, -- HTTP status code primit
  response_body TEXT, -- body răspuns (truncat la 10KB)
  delivered_at TIMESTAMP WITH TIME ZONE, -- când a fost livrat (NULL = pending)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pentru queries rapide
CREATE INDEX idx_webhook_deliveries_webhook ON public.webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_created ON public.webhook_deliveries(created_at DESC);
CREATE INDEX idx_webhook_deliveries_event ON public.webhook_deliveries(event_type);

-- Trigger pentru updated_at pe webhooks
CREATE OR REPLACE FUNCTION public.update_webhooks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER webhooks_updated_at
  BEFORE UPDATE ON public.webhooks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_webhooks_updated_at();

-- RLS policies pentru webhooks
ALTER TABLE public.webhooks ENABLE ROW LEVEL SECURITY;

-- Policy: Users pot vedea webhooks-urile organizației lor
CREATE POLICY "Users can view organization webhooks"
  ON public.webhooks
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.memberships
      WHERE user_id = auth.uid()
        AND is_active = true
    )
  );

-- Policy: Consultanți și admini pot insera webhooks
CREATE POLICY "Consultants and admins can insert webhooks"
  ON public.webhooks
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM public.memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Policy: Consultanți și admini pot actualiza webhooks
CREATE POLICY "Consultants and admins can update webhooks"
  ON public.webhooks
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- Policy: Consultanți și admini pot șterge webhooks
CREATE POLICY "Consultants and admins can delete webhooks"
  ON public.webhooks
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM public.memberships
      WHERE user_id = auth.uid()
        AND is_active = true
        AND role IN ('consultant', 'firma_admin')
    )
  );

-- RLS policies pentru webhook_deliveries
ALTER TABLE public.webhook_deliveries ENABLE ROW LEVEL SECURITY;

-- Policy: Users pot vedea delivery logs pentru webhooks-urile organizației lor
CREATE POLICY "Users can view organization webhook deliveries"
  ON public.webhook_deliveries
  FOR SELECT
  USING (
    webhook_id IN (
      SELECT w.id
      FROM public.webhooks w
      INNER JOIN public.memberships m ON m.organization_id = w.organization_id
      WHERE m.user_id = auth.uid()
        AND m.is_active = true
    )
  );

-- Policy: Consultanți și admini pot insera delivery logs (pentru test webhooks)
CREATE POLICY "Consultants and admins can insert webhook deliveries"
  ON public.webhook_deliveries
  FOR INSERT
  WITH CHECK (
    webhook_id IN (
      SELECT w.id
      FROM public.webhooks w
      INNER JOIN public.memberships m ON m.organization_id = w.organization_id
      WHERE m.user_id = auth.uid()
        AND m.is_active = true
        AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Policy: Consultanți și admini pot actualiza delivery logs
CREATE POLICY "Consultants and admins can update webhook deliveries"
  ON public.webhook_deliveries
  FOR UPDATE
  USING (
    webhook_id IN (
      SELECT w.id
      FROM public.webhooks w
      INNER JOIN public.memberships m ON m.organization_id = w.organization_id
      WHERE m.user_id = auth.uid()
        AND m.is_active = true
        AND m.role IN ('consultant', 'firma_admin')
    )
  );

-- Comentarii pentru documentație
COMMENT ON TABLE public.webhooks IS 'Configurare webhooks pentru notificări automate către sisteme externe';
COMMENT ON TABLE public.webhook_deliveries IS 'Log deliveries webhooks (pentru debugging și monitoring)';

COMMENT ON COLUMN public.webhooks.events IS 'Array de event types la care webhook-ul este subscris';
COMMENT ON COLUMN public.webhooks.secret IS 'Secret pentru semnare HMAC a payload-ului (optional)';
COMMENT ON COLUMN public.webhooks.last_response_status IS 'Ultimul HTTP status code primit de la webhook';
COMMENT ON COLUMN public.webhook_deliveries.payload IS 'Payload JSON trimis la webhook';
COMMENT ON COLUMN public.webhook_deliveries.response_status IS 'HTTP status code primit';
COMMENT ON COLUMN public.webhook_deliveries.response_body IS 'Body răspuns de la webhook (truncat la 10KB)';
