-- Tabel pentru stocarea facturilor generate
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  period TEXT NOT NULL, -- Format: YYYY-MM
  subtotal DECIMAL(10, 2) NOT NULL,
  vat_amount DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('RON', 'EUR')),
  status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('draft', 'issued', 'paid', 'cancelled')),
  file_url TEXT,
  items JSONB NOT NULL DEFAULT '[]', -- Array de InvoiceItem
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexuri pentru performanță
CREATE INDEX IF NOT EXISTS idx_invoices_organization_id ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_period ON invoices(period);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);

-- Trigger pentru updated_at
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_invoices_updated_at();

-- RLS Policies
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policy: Utilizatorii pot vedea facturile organizațiilor lor
CREATE POLICY "Users can view invoices of their organizations"
  ON invoices
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Doar membrii cu rol consultant sau admin pot crea facturi
CREATE POLICY "Consultants and admins can create invoices"
  ON invoices
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND role IN ('consultant', 'firma_admin')
    )
  );

-- Policy: Doar membrii cu rol consultant sau admin pot actualiza facturi
CREATE POLICY "Consultants and admins can update invoices"
  ON invoices
  FOR UPDATE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND role IN ('consultant', 'firma_admin')
    )
  );

-- Policy: Doar membrii cu rol consultant pot șterge facturi
CREATE POLICY "Only consultants can delete invoices"
  ON invoices
  FOR DELETE
  USING (
    organization_id IN (
      SELECT organization_id
      FROM memberships
      WHERE user_id = auth.uid()
      AND role = 'consultant'
    )
  );

-- Comentarii pentru documentație
COMMENT ON TABLE invoices IS 'Stochează facturile generate pentru organizații';
COMMENT ON COLUMN invoices.invoice_number IS 'Număr unic de factură (ex: SSM-202401-ABC12345)';
COMMENT ON COLUMN invoices.period IS 'Perioada facturată în format YYYY-MM';
COMMENT ON COLUMN invoices.items IS 'Array JSON cu items (description, quantity, unit_price, total)';
COMMENT ON COLUMN invoices.status IS 'Status factură: draft, issued, paid, cancelled';
