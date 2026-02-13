-- Feature Flags Management
-- Admin can enable/disable features, control rollout percentage, and target specific organizations

CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_key TEXT NOT NULL UNIQUE,
  feature_name TEXT NOT NULL,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  rollout_percentage INTEGER NOT NULL DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_organizations UUID[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS Enable
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;

-- Policy: Only super_admin can read/write
CREATE POLICY "super_admin_full_access" ON feature_flags
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.role_key = 'super_admin'
      AND ur.is_active = true
    )
  );

-- Index for performance
CREATE INDEX idx_feature_flags_enabled ON feature_flags (is_enabled);
CREATE INDEX idx_feature_flags_key ON feature_flags (feature_key);

-- Trigger for updated_at
CREATE TRIGGER set_feature_flags_updated_at
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed initial features
INSERT INTO feature_flags (feature_key, feature_name, description, is_enabled, rollout_percentage) VALUES
  ('nis2_module', 'Modul NIS2', 'Directiva NIS2 pentru securitate cibernetică și raportare incidente', false, 0),
  ('whatsapp_integration', 'Integrare WhatsApp', 'Notificări și alerte prin WhatsApp Business API', false, 0),
  ('ai_assistant', 'Asistent AI', 'Chatbot AI pentru consultanță SSM/PSI automată', false, 0),
  ('advanced_analytics', 'Analiză Avansată', 'Dashboard-uri interactive și rapoarte predictive', false, 0),
  ('mobile_app', 'Aplicație Mobilă', 'Acces mobil nativ iOS/Android', false, 0),
  ('document_ocr', 'OCR Documente', 'Scanare și digitizare automată documente SSM', false, 0),
  ('multi_country', 'Multi-Țară', 'Suport extins pentru Bulgaria, Ungaria, Germania, Polonia', false, 0),
  ('api_access', 'Acces API', 'API REST pentru integrări externe', false, 0),
  ('custom_branding', 'Branding Personalizat', 'Logo și culori personalizate pentru consultanți', false, 0),
  ('elearning_platform', 'Platformă E-Learning', 'Cursuri SSM/PSI online cu certificare', false, 0)
ON CONFLICT (feature_key) DO NOTHING;

COMMENT ON TABLE feature_flags IS 'Feature flags pentru activare/dezactivare funcționalități platformă';
COMMENT ON COLUMN feature_flags.rollout_percentage IS 'Procentaj rollout gradual (0-100%)';
COMMENT ON COLUMN feature_flags.target_organizations IS 'UUID-uri organizații țintă (gol = toate)';
