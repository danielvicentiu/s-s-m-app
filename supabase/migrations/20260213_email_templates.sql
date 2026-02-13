-- Migration: Email Templates
-- Descriere: Tabel pentru template-uri email editabile din admin UI
-- Data: 13 Februarie 2026

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key VARCHAR(100) UNIQUE NOT NULL, -- identificator unic (ex: 'alert_medical_expiring')
  name VARCHAR(255) NOT NULL, -- nume afișat în UI (ex: 'Control medical expirare')
  description TEXT, -- descriere scurtă pentru admin
  subject VARCHAR(500) NOT NULL, -- subject email (suportă variabile)
  body_html TEXT NOT NULL, -- corp HTML (suportă variabile)
  body_text TEXT, -- corp plain text (opțional, fallback)
  available_variables JSONB NOT NULL DEFAULT '[]'::jsonb, -- array cu variabile disponibile: [{name: 'employee_name', example: 'Ion Popescu'}, ...]
  category VARCHAR(50) NOT NULL DEFAULT 'general', -- 'alerts', 'reports', 'notifications', 'system'
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_system BOOLEAN NOT NULL DEFAULT false, -- template-uri sistem nu pot fi șterse
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS pentru email_templates (doar super_admin poate edita)
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Policy: super_admin poate citi și edita
CREATE POLICY "Super admin can manage email templates"
ON email_templates
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'super_admin'
    AND ur.is_active = true
    AND r.is_active = true
  )
);

-- Policy: consultant_ssm poate citi (pentru preview)
CREATE POLICY "Consultants can read email templates"
ON email_templates
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('consultant_ssm', 'super_admin')
    AND ur.is_active = true
    AND r.is_active = true
  )
);

-- Index pentru performanță
CREATE INDEX idx_email_templates_key ON email_templates(template_key);
CREATE INDEX idx_email_templates_category ON email_templates(category);
CREATE INDEX idx_email_templates_active ON email_templates(is_active);

-- Trigger pentru updated_at
CREATE TRIGGER set_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Template-uri inițiale (sistem)
INSERT INTO email_templates (template_key, name, description, subject, body_html, available_variables, category, is_system) VALUES
(
  'alert_medical_expiring',
  'Alertă Control Medical Expirat',
  'Email trimis când un control medical urmează să expire',
  'URGENT: Control medical expiră pentru {employee_name}',
  '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #e74c3c;">⚠️ Control Medical Expiră În Curând</h2>
    <p>Bună ziua,</p>
    <p>Vă informăm că următorul angajat are controlul medical care expiră:</p>
    <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #e74c3c; margin: 20px 0;">
      <strong>Angajat:</strong> {employee_name}<br>
      <strong>Companie:</strong> {company}<br>
      <strong>Data expirării:</strong> {expiry_date}<br>
      <strong>Zile rămase:</strong> {days_remaining}
    </div>
    <p>Vă rugăm să programați un nou control medical pentru a rămâne conform cu legislația SSM.</p>
    <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
      Acest email a fost generat automat de platforma S-S-M.ro
    </p>
  </div>
</body>
</html>',
  '[
    {"name": "employee_name", "example": "Ion Popescu", "description": "Numele angajatului"},
    {"name": "company", "example": "SC Example SRL", "description": "Denumirea companiei"},
    {"name": "expiry_date", "example": "25.02.2026", "description": "Data expirării"},
    {"name": "days_remaining", "example": "7", "description": "Zile până la expirare"}
  ]'::jsonb,
  'alerts',
  true
),
(
  'alert_equipment_inspection',
  'Alertă Verificare Echipament PSI',
  'Email trimis când un echipament PSI necesită verificare',
  'Verificare echipament PSI: {equipment_type} în {location}',
  '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #f39c12;">🔥 Verificare Echipament PSI Necesară</h2>
    <p>Bună ziua,</p>
    <p>Următorul echipament PSI necesită verificare:</p>
    <div style="background: #fff3cd; padding: 15px; border-left: 4px solid #f39c12; margin: 20px 0;">
      <strong>Tip echipament:</strong> {equipment_type}<br>
      <strong>Locație:</strong> {location}<br>
      <strong>Companie:</strong> {company}<br>
      <strong>Data următoarei verificări:</strong> {inspection_date}
    </div>
    <p>Vă rugăm să programați verificarea pentru a respecta normele PSI.</p>
    <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
      Acest email a fost generat automat de platforma S-S-M.ro
    </p>
  </div>
</body>
</html>',
  '[
    {"name": "equipment_type", "example": "Stingător pulbere", "description": "Tipul echipamentului"},
    {"name": "location", "example": "Biroul 12, etaj 3", "description": "Locația echipamentului"},
    {"name": "company", "example": "SC Example SRL", "description": "Denumirea companiei"},
    {"name": "inspection_date", "example": "01.03.2026", "description": "Data verificării"}
  ]'::jsonb,
  'alerts',
  true
),
(
  'welcome_new_user',
  'Bun venit pe platformă',
  'Email de bun venit pentru utilizatori noi',
  'Bun venit pe S-S-M.ro, {name}!',
  '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #3498db;">👋 Bun venit pe S-S-M.ro!</h2>
    <p>Bună ziua {name},</p>
    <p>Vă mulțumim că ați ales S-S-M.ro pentru gestionarea conformității SSM și PSI!</p>
    <div style="background: #e3f2fd; padding: 15px; border-left: 4px solid #3498db; margin: 20px 0;">
      <strong>Compania dumneavoastră:</strong> {company}<br>
      <strong>Rolul dumneavoastră:</strong> {role}<br>
      <strong>Data înregistrării:</strong> {date}
    </div>
    <p>Echipa noastră este aici să vă ajute. Nu ezitați să ne contactați pentru orice întrebare.</p>
    <p style="color: #7f8c8d; font-size: 12px; margin-top: 30px;">
      S-S-M.ro - Platforma digitală pentru consultanți SSM/PSI
    </p>
  </div>
</body>
</html>',
  '[
    {"name": "name", "example": "Maria Ionescu", "description": "Numele utilizatorului"},
    {"name": "company", "example": "SC Example SRL", "description": "Denumirea companiei"},
    {"name": "role", "example": "Administrator firmă", "description": "Rolul utilizatorului"},
    {"name": "date", "example": "13.02.2026", "description": "Data înregistrării"}
  ]'::jsonb,
  'notifications',
  true
);

COMMENT ON TABLE email_templates IS 'Template-uri editabile pentru email-uri automate';
COMMENT ON COLUMN email_templates.available_variables IS 'Array JSON cu variabile disponibile pentru template: [{"name": "var_name", "example": "Example", "description": "Descriere"}]';
