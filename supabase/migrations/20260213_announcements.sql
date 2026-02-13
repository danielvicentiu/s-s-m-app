-- Migration: Sistema de anunțuri pentru dashboard
-- Data: 2026-02-13
-- Descriere: Tabela pentru anunțuri banner top dashboard (info/warning/critical)

-- Tabela announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'critical')),
  target_type TEXT NOT NULL CHECK (target_type IN ('all', 'plan', 'organization')),
  target_id UUID, -- NULL pentru 'all', plan_id pentru 'plan', organization_id pentru 'organization'
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_date_range CHECK (end_date > start_date)
);

-- Index pentru queries rapide
CREATE INDEX idx_announcements_active ON announcements(is_active, start_date, end_date) WHERE is_active = true;
CREATE INDEX idx_announcements_target ON announcements(target_type, target_id);
CREATE INDEX idx_announcements_dates ON announcements(start_date, end_date);

-- RLS policies
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Super admin poate crea/edita/șterge anunțuri
CREATE POLICY "Super admins manage announcements"
  ON announcements
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role_id IN (SELECT id FROM roles WHERE name = 'super_admin')
      AND user_roles.is_active = true
    )
  );

-- Toți utilizatorii autentificați pot citi anunțurile active pentru ei
CREATE POLICY "Users read active announcements"
  ON announcements
  FOR SELECT
  USING (
    is_active = true
    AND start_date <= NOW()
    AND end_date >= NOW()
    AND (
      -- Anunțuri pentru toți
      target_type = 'all'
      -- Anunțuri pentru organizația utilizatorului
      OR (
        target_type = 'organization'
        AND target_id IN (
          SELECT organization_id FROM memberships
          WHERE user_id = auth.uid() AND is_active = true
        )
      )
      -- Anunțuri pentru plan (de implementat când vom avea tabela plans)
      OR (
        target_type = 'plan'
        AND target_id IS NOT NULL
        -- TODO: Adaugă verificare plan când va fi implementată tabela
      )
    )
  );

-- Trigger pentru updated_at
CREATE OR REPLACE FUNCTION update_announcements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_announcements_updated_at();

-- Comentarii
COMMENT ON TABLE announcements IS 'Anunțuri banner pentru dashboard (info/warning/critical)';
COMMENT ON COLUMN announcements.type IS 'Tipul anunțului: info (albastru), warning (portocaliu), critical (roșu)';
COMMENT ON COLUMN announcements.target_type IS 'Țintă: all (toți userii), plan (plan specific), organization (organizație specifică)';
COMMENT ON COLUMN announcements.target_id IS 'ID-ul planului sau organizației (NULL pentru all)';
