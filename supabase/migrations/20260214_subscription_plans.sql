-- Tabel pentru planurile de abonament disponibile
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price_ron DECIMAL(10, 2) NOT NULL,
  price_eur DECIMAL(10, 2) NOT NULL,
  max_users INTEGER NOT NULL DEFAULT 5,
  max_organizations INTEGER NOT NULL DEFAULT 1,
  features JSONB NOT NULL DEFAULT '[]', -- Array de strings cu features incluse
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel pentru abonamentele organizațiilor
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'suspended', 'expired')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancelled_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  cancellation_reason TEXT,
  auto_renew BOOLEAN NOT NULL DEFAULT true,
  payment_method TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_subscription_plans_is_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_display_order ON subscription_plans(display_order);

CREATE INDEX IF NOT EXISTS idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON subscriptions(expires_at);

-- Trigger pentru updated_at
CREATE OR REPLACE FUNCTION update_subscription_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_plans_updated_at();

CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscriptions_updated_at();

-- RLS Policies pentru subscription_plans
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Policy: Toată lumea poate citi planurile active
CREATE POLICY "Anyone can view active subscription plans"
  ON subscription_plans
  FOR SELECT
  USING (is_active = true);

-- Policy: Doar consultanții pot crea/modifica planuri
CREATE POLICY "Only consultants can manage subscription plans"
  ON subscription_plans
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM memberships
      WHERE user_id = auth.uid()
      AND role = 'consultant'
    )
  );

-- RLS Policies pentru subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Utilizatorii pot vedea abonamentele organizațiilor lor
CREATE POLICY "Users can view subscriptions of their organizations"
  ON subscriptions
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Doar membrii cu rol consultant sau admin pot crea/modifica abonamente
CREATE POLICY "Consultants and admins can manage subscriptions"
  ON subscriptions
  FOR ALL
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND role IN ('consultant', 'firma_admin')
    )
  );

-- Comentarii pentru documentație
COMMENT ON TABLE subscription_plans IS 'Planuri de abonament disponibile pe platformă';
COMMENT ON COLUMN subscription_plans.features IS 'Array JSON cu features incluse (ex: ["api_access", "white_label", "custom_branding"])';
COMMENT ON COLUMN subscription_plans.max_users IS 'Număr maxim de utilizatori incluși în plan';

COMMENT ON TABLE subscriptions IS 'Abonamente active pentru organizații';
COMMENT ON COLUMN subscriptions.status IS 'Status abonament: active, cancelled, suspended, expired';
COMMENT ON COLUMN subscriptions.auto_renew IS 'Dacă abonamentul se reînnoiește automat';

-- Insert planuri default
INSERT INTO subscription_plans (name, description, price_ron, price_eur, max_users, max_organizations, features, display_order) VALUES
('Starter', 'Plan de bază pentru firme mici', 199.00, 39.00, 5, 1, '["basic_compliance", "document_storage", "email_support"]', 1),
('Professional', 'Plan complet pentru firme medii', 499.00, 99.00, 15, 3, '["basic_compliance", "document_storage", "email_support", "api_access", "priority_support", "advanced_reporting"]', 2),
('Enterprise', 'Plan pentru corporații și consultanți', 999.00, 199.00, 50, 10, '["basic_compliance", "document_storage", "email_support", "api_access", "priority_support", "advanced_reporting", "white_label", "custom_branding", "sso", "dedicated_support"]', 3)
ON CONFLICT (name) DO NOTHING;
